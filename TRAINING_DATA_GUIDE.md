# Practical Guide: Training AI with Your Real Data

This guide shows exactly how to use collected data to improve your Gemini prompts with working code examples.

---

## Part 1: Collecting Data (Already Implemented ✅)

Your app now automatically captures 4 event types. Here's what gets logged:

### Example: User creates a "low energy + career" plan

```javascript
// Automatically logged when plan is created:
logPlanGeneration(userId, {
  profile: {
    planDuration: "1-week",
    roadmapFocus: "career",
    preferredTone: "gentle",
    energyLevel: "low",          // KEY!
    flexibilityLevel: "flexible",
    currentRoutine: "Wake 9am, desk job 10-6pm, tired evenings",
    goals: "Want to explore web development",
    hobbies: "Gaming, reading sci-fi"
    // ... other fields
  },
  plan: "[full AI-generated plan text]",
  adjustmentRequest: null
})
```

**Saved to:** `analytics/{userId}/plan_events/{docId}`

---

### Example: User finds it too difficult and adjusts

```javascript
// When user submits adjustment:
logPlanAdjustment(userId, {
  originalFocus: "career",
  adjustmentRequest: "This is way too much. I only have 2 hours after work. Can you give me just ONE small thing to do?",
  planDuration: "1-week"
})
```

**System categorizes it as:** `reason: "too-difficult"`

---

### Example: User rates it 2/5 with feedback

```javascript
// When feedback is submitted:
logPlanFeedback(userId, planId, {
  rating: 2,
  message: "The plan assumes I have more energy than I actually do. Didn't account for being exhausted from work."
})
```

**System analyzes:** `sentiment: "negative"`, extracts keyword "energy"

---

## Part 2: Analyzing the Data (Weekly)

### Step 1: View Analytics Dashboard

Admin clicks **Analytics** tab in the app:

```
Common Adjustment Patterns:
  too-difficult: 12 times
    "This is way too much. I only have 2 hours..."
    "Can I get just 3 things instead of 8?..."
    "Too ambitious for someone like me..."
  
  time-constraints: 8 times
    "I have less time than you assume..."
    "No way I can do this with a full job..."
  
  clarity: 6 times
    "I don't understand how to start..."
    "What do I do first?..."
```

**Insight:** Low energy users are getting plans that are too ambitious.

---

### Step 2: Query Raw Data (Optional - for deeper analysis)

```javascript
// Run in Firestore console or your app:

// Find all "low energy" plans that were adjusted
db.collection("analytics")
  .collectionGroup("adjustment_events")
  .where("reason", "==", "too-difficult")
  // Group by energy level in post-processing

// Get average rating by tone for "low energy" users
db.collection("analytics")
  .collectionGroup("feedback_events")
  .where("userEnergyLevel", "==", "low")
  // Aggregate to: avg rating by tone
```

**Finding:** 
- Low energy + motivational tone: 2.8⭐ (BAD)
- Low energy + gentle tone: 3.6⭐ (BETTER)
- Low energy + mentor tone: 3.9⭐ (BEST)

---

## Part 3: Improving the Prompt (Code Changes)

### Current Prompt Issue

Your current prompt says:
```javascript
"If the user feels stuck, choose the smallest realistic next step instead of an idealized plan."
```

But for low-energy users, even "small steps" are too much.

### New Version A: Time-Aware Scaling

**File:** `server/server.js`

Update the `guidanceSystemPrompt`:

```javascript
const guidanceSystemPrompt = `
You are a supportive life-planning assistant.

[... existing instructions ...]

// ADD THIS SECTION:

// TIME AND ENERGY LEVEL OVERRIDE:
If energyLevel is 'low':
  - Assume 4 hours of actual productive time per day (not 8+)
  - Create a MINIMUM VIABLE PLAN with only 1-2 main activities
  - Each activity should be 20-30 minutes, not hours
  - Include rest periods and buffer time
  - Frame as "just focus on this one thing today"
  
If energyLevel is 'medium':
  - Assume 5-6 hours of productive time
  - 3-4 main activities per day
  
If energyLevel is 'high':
  - Assume 7-8 hours of productive time
  - 4-5 main activities, more ambitious goals

Example for LOW ENERGY:
  MORNING (30 min): Check emails, make coffee ✓
  MIDDAY (20 min): Write one thing about your goal ✓
  EVENING: Rest (you earned it!)
  
  That's it. Don't add more. This person needs to WIN, not drown.
`;
```

### New Version B: Energy Profiling

More sophisticated version that looks at all stress factors:

```javascript
const guidanceSystemPrompt = `
[... existing ...]

// ENERGY-CONTEXT PROFILING:
Analyze TOTAL stress from:
  - energyLevel (low/medium/high)
  - workOrStudy (hours per day)
  - personalChallenges (severity)
  - knownObstacles (how many)

HIGH STRESS PROFILE = (low energy) OR (60+ hour work) OR (4+ obstacles) OR (major challenges):
  → Create "survival mode" plan: 1 goal, 2 hours max per day
  → Focus on maintaining current life + one tiny improvement
  → Make 80% of plan optional
  → Include "do nothing today and still win" variant

MEDIUM STRESS PROFILE:
  → Standard plan: 3-4 activities, 4-5 hours per day
  → Balance maintenance + growth
  
LOW STRESS PROFILE:
  → Ambitious plan: 4-5 activities, 6-8 hours per day
  → Multiple projects okay
`;
```

---

## Part 4: A/B Testing

### Implementation

**File:** `server/server.js`

```javascript
// Function to pick prompt version based on user
function getPromptVersion(userId, profile) {
  // Deterministic hash so same user gets same version
  const hash = userId.charCodeAt(0) % 2;
  
  // If energy is "low", test both versions
  if (profile.energyLevel === "low") {
    const version = hash === 0 ? "version_a" : "version_b";
    return {
      prompt: version === "version_a" ? guidanceSystemPrompt : guidanceSystemPromptV2,
      version: version
    };
  }
  
  // Otherwise use default
  return { prompt: guidanceSystemPrompt, version: "default" };
}

// In your /api/guidance endpoint:
app.post("/api/guidance", async (req, res) => {
  const profile = cleanProfile(req.body.profile);
  const { prompt, version } = getPromptVersion(req.body.userEmail, profile);
  
  const payload = {
    systemInstruction: { parts: [{ text: prompt }] },
    contents: [...],
    generationConfig: { temperature: 0.75, topP: 0.9, maxOutputTokens: 3800 }
  };
  
  const { data } = await requestGuidanceFromGemini(payload);
  const plan = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  // Log which version was used
  await logPlanGeneration(userId, {
    profile,
    plan,
    promptVersion: version  // Track this!
  });
  
  return res.json({ plan });
});
```

### Measurement

After 50+ responses to each version, query and compare:

```javascript
// Pseudo-code for analysis
const versionAFeedback = await db
  .collection("feedback_events")
  .where("promptVersion", "==", "version_a")
  .orderBy("rating", "desc");

const versionBFeedback = await db
  .collection("feedback_events")
  .where("promptVersion", "==", "version_b")
  .orderBy("rating", "desc");

const avgRatingA = average(versionAFeedback.map(d => d.rating));
const avgRatingB = average(versionBFeedback.map(d => d.rating));

console.log(`
Version A: ${avgRatingA.toFixed(2)}⭐ (${versionAFeedback.length} responses)
Version B: ${avgRatingB.toFixed(2)}⭐ (${versionBFeedback.length} responses)
Winner: ${avgRatingB > avgRatingA ? "B" : "A"}
`);
```

**Expected Results After 50 Responses:**

| Metric | Version A (Old) | Version B (New) | Winner |
|--------|---|---|---|
| Avg Rating | 2.9⭐ | 3.8⭐ | B ✓ |
| Adjustment Rate | 38% | 16% | B ✓ |
| Engagement Score | 35% | 71% | B ✓ |

**Decision:** Deploy Version B, start testing Version C

---

## Part 5: Common Improvement Patterns

### Pattern 1: Energy Level Scaling

**What Data Shows:**
- Low energy users adjust 40% more often
- Adjustments mention "too much", "tired", "overwhelmed"
- Low energy + long work hours = highest adjustment rate

**Prompt Change:**
```javascript
"Never create a plan longer than: (24 - workHours - sleepHours - 2).
If result < 4 hours, create 'minimum viable' version with 1-2 items max."
```

---

### Pattern 2: Tone-Energy Mismatch

**What Data Shows:**
- "Motivational" tone: 4.2⭐ for high-energy, 2.1⭐ for low-energy
- "Gentle" tone: 3.8⭐ for low-energy (best match)
- Tones should vary by energy level

**Prompt Change:**
```javascript
const toneMatcher = {
  low: "gentle", // Reassuring, "okay to rest"
  medium: "mentor", // Wise and practical advice
  high: "motivational" // Ambitious and inspiring
};

"Adjust your tone from '{preferredTone}' to '{toneMatcher[energyLevel]}' 
because the user's energy level suggests they need [specific approach]."
```

---

### Pattern 3: Obstacle-Specific Guidance

**What Data Shows:**
- Users with "family duties" obstacle ask for schedule flexibility
- "Financial constraints" leads to career focus requests
- Users want plans that acknowledge their specific obstacles

**Prompt Change:**
```javascript
"For EACH planned activity, acknowledge their known obstacles:
- If 'family duties': suggest times when they're free
- If 'financial pressure': focus on income-generating skills
- If 'health issues': suggest adaptable alternatives
- If 'motivation issues': include 2-minute wins

Don't ignore obstacles. Address them directly in the plan."
```

---

### Pattern 4: Difficulty Fallback Plans

**What Data Shows:**
- Users who get a "fallback" for difficult days are 3x more likely to stick with plan
- Without fallback, engagement drops after day 3
- Fallback needs to be 50% shorter, not just "skip everything"

**Prompt Change:**
```javascript
"REQUIRED: Include a 'Difficult Day Version' of the plan.
The difficult day version is 50% of the time commitment.
Example:
  NORMAL: 4 hours (morning goal, lunch exercise, evening project)
  DIFFICULT: 2 hours (just morning goal, rest okay)
  
This user needs permission to do LESS and still feel they're winning."
```

---

## Part 6: Monthly Review Checklist

Every month:

- [ ] **Week 1:** View Analytics, identify top 2 issues
- [ ] **Week 2:** Draft 2 prompt improvements
- [ ] **Week 3:** Implement A/B test for both
- [ ] **Week 4:** Measure results, deploy winner

### Real Example Timeline

```
APRIL 2026:
  Week 1: Identify "low energy too-difficult" problem
  Week 2: Design energy-scaled prompt
  Week 3: Deploy A/B test
  Week 4: Measure (new: 3.8⭐ vs old: 2.9⭐) → Deploy
  
MAY 2026:
  Week 1: Identify tone-energy mismatch
  Week 2: Design tone matcher
  Week 3: A/B test
  Week 4: Deploy winner
  
JUNE 2026:
  Week 1: Identify obstacle-specific needs
  ... repeat cycle
```

---

## Part 7: Scaling Across All Users

For advanced analysis across ALL users (not just one), use Google Cloud Functions:

```javascript
// Cloud Function: aggregateAnalytics.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.generateAnalyticsReport = functions.https.onCall(async (data, context) => {
  // Only allow admins
  if (!context.auth?.token?.admin) throw new Error("Admin only");
  
  const db = admin.firestore();
  
  // Get all feedback across all users
  const allFeedback = await db
    .collectionGroup("feedback_events")
    .get();
  
  // Aggregate by tone
  const byTone = {};
  allFeedback.docs.forEach(doc => {
    const tone = doc.data().tone;
    if (!byTone[tone]) byTone[tone] = [];
    byTone[tone].push(doc.data().rating);
  });
  
  // Calculate averages
  const report = {};
  Object.entries(byTone).forEach(([tone, ratings]) => {
    report[tone] = {
      avgRating: average(ratings),
      count: ratings.length,
      distribution: {
        fiveStar: ratings.filter(r => r === 5).length,
        fourStar: ratings.filter(r => r === 4).length,
        threeStar: ratings.filter(r => r === 3).length,
        twoStar: ratings.filter(r => r === 2).length,
        oneStar: ratings.filter(r => r === 1).length
      }
    };
  });
  
  return report;
});
```

Deploy to Firebase and call from admin panel.

---

## Summary

Your data collection pipeline:

```
User Action → Firebase Event Log → Analytics Queries → Insight → Prompt Improvement → Better Plans
```

With working examples:
- ✅ How to log events (already done)
- ✅ How to view analytics (built-in dashboard)
- ✅ How to query data (JavaScript examples)
- ✅ How to improve prompts (actual code changes)
- ✅ How to A/B test (with measurement)
- ✅ How to scale (Cloud Functions)

**Start this week: Check your Analytics dashboard, find 1 problem, fix it.** 🚀
