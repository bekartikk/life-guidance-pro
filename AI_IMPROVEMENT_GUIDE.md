# AI Training & Improvement Guide

This guide explains how to use the collected user data to continuously improve your AI guidance prompts for better, more personalized results.

## What Data Is Collected

The system automatically logs:

1. **Plan Generation Events** (`logPlanGeneration`)
   - User profile settings (tone, focus, flexibility, energy level)
   - Plan duration and complexity
   - Keywords from user input
   - Whether it was an adjustment request

2. **Feedback Data** (`logPlanFeedback`)
   - User ratings (1-5 stars)
   - Feedback messages with sentiment analysis
   - Plan ID for correlation

3. **Adjustment Requests** (`logPlanAdjustment`)
   - What users found difficult
   - Specific changes they requested
   - Categorized reasons (too-difficult, time-constraints, etc.)

4. **Engagement Metrics** (`logCheckinPattern`)
   - Daily checkin completion rates
   - Streak information
   - Overall engagement score (0-100)

---

## How to Access the Data

### In Firebase Console
Navigate to: **Firestore > Collections > analytics > [userId] > [collection_name]**

Collections available:
- `plan_events` - Plan generations
- `feedback_events` - User feedback
- `adjustment_events` - Plan adjustments
- `checkin_metrics` - Engagement tracking

### Via Analytics Dashboard
Admins can view the **Analytics** tab in the app to see:
- Adjustment patterns aggregated across users
- Engagement metrics
- Most-used configurations
- AI improvement recommendations

---

## Using Data for Prompt Improvement

### Step 1: Identify Problem Areas

Export adjustment events and look for patterns:

```
Reason: "too-difficult" → 12 times
Reason: "time-constraints" → 8 times
Reason: "clarity" → 6 times
```

**Action:** "Too difficult" is the #1 issue. Refine prompt to create more achievable plans.

### Step 2: Analyze Success Factors

Query high-rated plans (rating >= 4):

```
SELECT 
  profile.preferredTone,
  profile.roadmapFocus,
  AVG(rating) as avg_rating
FROM feedback_events
WHERE rating >= 4
GROUP BY preferredTone, roadmapFocus
ORDER BY avg_rating DESC
```

This shows which tone/focus combos users love.

### Step 3: Refine System Prompt

Based on patterns, update `server/server.js` guidanceSystemPrompt:

**Example Change:**

If data shows users with "difficult" energy level adjust for "too-difficult" → Add this:

```javascript
// BEFORE
"If the user feels stuck, choose the smallest realistic next step instead of an idealized plan."

// AFTER
"If the user has difficult or low energy, prioritize ONE small win per day.
Break tasks into 15-min blocks. Include easy wins at morning, afternoon, evening.
A difficult day plan should take 30% less time than a balanced plan."
```

### Step 4: Test the Change

Implement prompt A/B testing:

```javascript
// In server/server.js

const usePromptVersion = (userId) => {
  // Hash userId to get deterministic A/B split (50/50)
  const hash = userId.charCodeAt(0) % 2;
  return hash === 0 ? guidanceSystemPrompt : guidanceSystemPromptV2;
};

// In API endpoint:
const systemPrompt = usePromptVersion(userEmail);
// Then use systemPrompt in Gemini request
```

Track which version users rated higher.

### Step 5: Rollout Winners

Once v2 has higher avg rating than v1 after 50+ responses → Make v2 the default, test v3.

---

## Common Improvements Based on Data

### Issue: Plans are "too difficult"
**Data Signal:** High "too-difficult" adjustments, low engagement scores
**Fix:**
```javascript
// Add to prompt:
"For low-energy users, create a 'minimum viable routine' that takes 2-3 hours/day.
Assume 60% of planned time will become procrastination.
Make the routine failable: user can skip afternoon and still win."
```

### Issue: Plans lack clarity
**Data Signal:** "clarity" adjustments, low completion on difficult days
**Fix:**
```javascript
// Improve structuring:
"For each time block, use this format:
[TIME] Activity Name
- What: specific action (not vague)
- Why: how this helps their goal
- Duration: exact minutes
- If stuck: [2-minute escape task]"
```

### Issue: Plans ignore stated obstacles
**Data Signal:** Low ratings, feedback like "doesn't address my family duties"
**Fix:**
```javascript
// Reference obstacles explicitly:
"The user stated: [knownObstacles].
For each planned activity, note how to handle [specific obstacle].
Example: If obstacle is 'family interruptions', suggest:
  - Best times to work uninterrupted
  - How to say 'give me 30 mins' respectfully
  - Quick pivots if interrupted"
```

### Issue: Tone doesn't match preference
**Data Signal:** High adjustments after tone selection, low ratings for certain tones
**Fix:**
```javascript
// Add tone-specific behavior:
const tonePatterns = {
  gentle: "Use phrases like 'whenever you're ready', 'no pressure', 'if possible'",
  direct: "Use action verbs, deadlines, specific metrics",
  motivational: "Include why this matters, celebrate small wins",
  mentor: "Speak as a warm advisor, share realistic wisdom"
};
```

---

## Metrics That Matter Most

### For AI Quality:
1. **Avg Rating by Configuration** (Target: 4.2+)
   - Which tone/focus/flexibility combos get rated highest?

2. **Adjustment Rate by Prompt Version** (Target: <30%)
   - What % of users request adjustments?
   - Lower = better prompt clarity

3. **Engagement Score Trend**
   - Are users actually following the plan?
   - Plans with engagement >70% should be replicated

### For Business:
1. **Plan Completion Rate**
   - % of users who complete a full week = plan quality
   - Target: 40%+ of users finish week 1

2. **Feedback Volume & Sentiment**
   - More feedback = user engagement
   - Target: 30%+ of users submit feedback

3. **Comeback Win Rate**
   - Users who restart after missing days
   - High rate = plan is valuable even when interrupted

---

## Setting Up Regular Review Cycles

### Weekly
- [ ] Check new adjustment patterns
- [ ] Identify top 3 pain points
- [ ] Brainstorm 1-2 prompt improvements

### Monthly
- [ ] Analyze engagement scores by configuration
- [ ] Run A/B test on top prompt change
- [ ] Deploy winning version

### Quarterly
- [ ] Comprehensive data review
- [ ] User interview (call 3-5 users, ask about pain points)
- [ ] Refactor major prompt sections based on learnings
- [ ] Plan next quarter's tests

---

## Example: Real Improvement Cycle

**Week 1: Problem Identified**
- Analytics shows 15 "time-constraints" adjustments
- User feedback: "Plan too ambitious, can't fit in my schedule"

**Week 2: Root Cause Analysis**
- Query: Users with energyLevel="low" + roadmapFocus="career" get adjusted 8x more
- These users need tighter time budgets

**Week 3: Prompt Refinement**
```javascript
// Added to system prompt:
"If energyLevel is 'low', cut all time estimates by 50%.
Show a 2-hour minimum routine (not 6+ hours).
Focus on career progress in 20-min slots, not full projects."
```

**Week 4: A/B Test**
- 50% of "low energy + career" users get new prompt
- Track engagement & ratings for 50 responses

**Result (Week 5)**
- Old prompt: 3.2⭐ avg, 45% adjusted
- New prompt: 3.8⭐ avg, 18% adjusted
- **Deploy new version as default**

---

## Tools & Scripts

### Export Adjustment Patterns
```javascript
// Run in browser console with admin access:
const adjustments = await getDocs(
  collection(db, "analytics", userId, "adjustment_events")
);
const patterns = {};
adjustments.forEach(doc => {
  const reason = doc.data().reason;
  patterns[reason] = (patterns[reason] || 0) + 1;
});
console.table(patterns); // Copy to spreadsheet
```

### Calculate Engagement by Tone
```javascript
// Aggregate across all users:
const feedbacks = await getDocs(collection(db, "feedback_events")); // ⚠️ Requires Cloud Function
const toneRatings = {};
feedbacks.forEach(doc => {
  const tone = doc.data().tone;
  if (!toneRatings[tone]) toneRatings[tone] = [];
  toneRatings[tone].push(doc.data().rating);
});

Object.keys(toneRatings).forEach(tone => {
  const avg = toneRatings[tone].reduce((a,b) => a+b) / toneRatings[tone].length;
  console.log(`${tone}: ${avg.toFixed(2)}⭐`);
});
```

⚠️ **Note:** For larger datasets, use Google Cloud Functions to aggregate across all users securely.

---

## Privacy & Ethics

✅ **DO:**
- Analyze aggregated patterns (not individual user data)
- Use feedback to improve guidance quality
- Share improvements transparently

❌ **DON'T:**
- Store identifiable personal details beyond what's necessary
- Sell or share user data
- Use data to manipulate users
- Train proprietary models on user content without consent

---

## Next Steps

1. **This Week:** Check Analytics panel, identify top 2 issues
2. **Next Week:** Draft refined prompt based on findings
3. **Week After:** Deploy A/B test, measure results
4. **Monthly:** Review cycle, iterate

Good luck improving your AI! 🚀
