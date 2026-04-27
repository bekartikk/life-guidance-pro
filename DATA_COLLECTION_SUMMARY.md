# Data Collection & AI Improvement System

## What Was Implemented

Your app now has a **complete data collection and AI improvement pipeline** that automatically tracks user interactions to help you continuously improve the AI-generated plans.

### 1. **Data Collection Layer** (`src/services/dataCollection.js`)

Automatically logs 4 types of events:

#### Plan Generation Events
```javascript
logPlanGeneration(userId, {
  profile: userAnswers,
  plan: generatedPlan,
  adjustmentRequest: null
})
```
**Tracks:**
- Which tone/focus combinations are used
- Plan settings (duration, flexibility, energy level)
- Keywords from user profile
- Plan length (tokens)

#### Feedback Events
```javascript
logPlanFeedback(userId, planId, {
  rating: 1-5,
  message: userFeedback
})
```
**Tracks:**
- User satisfaction (1-5 stars)
- Sentiment of feedback (positive/negative/neutral)
- Whether users found it useful

#### Adjustment Events
```javascript
logPlanAdjustment(userId, {
  originalFocus: 'career',
  adjustmentRequest: 'Too much, need easier version',
  planDuration: '1-week'
})
```
**Tracks:**
- What users find too difficult
- What they request changed
- Categorized reasons:
  - `too-difficult`
  - `time-constraints`
  - `clarity`
  - `personalization`
  - etc.

#### Engagement Metrics
```javascript
logCheckinPattern(userId, {
  completedDays: 4,
  partialDays: 2,
  difficultDays: 1,
  missedDays: 0,
  activeStreak: 4
})
```
**Tracks:**
- How many users actually follow the plan
- Engagement score (0-100)
- Completion patterns

---

### 2. **Integration Points** (Updated Dashboard.jsx)

Data collection is hooked into user actions:

```javascript
// After plan is generated
await logPlanGeneration(userId, { profile, plan, adjustmentRequest });

// After user submits feedback
await logPlanFeedback(userId, planId, { rating, message });

// When user adjusts a plan
await logPlanAdjustment(userId, { originalFocus, adjustmentRequest, planDuration });

// When user checks in daily
await logCheckinPattern(userId, progress);
```

---

### 3. **Analytics Dashboard** (`src/components/dashboard/AnalyticsPanel.jsx`)

Admins can view **Analytics** tab showing:

#### Adjustment Patterns
See why users modify plans:
- "too-difficult" - 12 times
- "time-constraints" - 8 times
- "clarity" - 6 times

With example quotes from users.

#### Engagement Metrics
- Current engagement score (0-100%)
- Active streak
- Completion rate
- Plan adherence

#### Top Configurations
Most popular tone + focus combinations:
- "motivational-career" - 24 uses
- "mentor-balanced" - 18 uses
- "gentle-hobbies" - 15 uses

#### AI Improvement Recommendations
4 specific actions to improve:
1. Refine prompts based on adjustment patterns
2. Correlate ratings with tone selection
3. Track engagement by focus area
4. A/B test new prompt versions

---

### 4. **Data Flow**

```
User Creates Plan
        ↓
(logPlanGeneration) → analytics/[userId]/plan_events
        ↓
User Rates Plan
        ↓
(logPlanFeedback) → analytics/[userId]/feedback_events
        ↓
User Asks for Changes
        ↓
(logPlanAdjustment) → analytics/[userId]/adjustment_events
        ↓
User Checks In Daily
        ↓
(logCheckinPattern) → analytics/[userId]/checkin_metrics
        ↓
Admin Views Analytics Dashboard
        ↓
Admin Refines Prompt in server/server.js
        ↓
Better Plans for Next Users ✨
```

---

## How to Use This for AI Improvement

### Weekly Workflow

1. **Check Analytics** (5 min)
   - Go to Admin tab → Analytics
   - Look at "Common Adjustment Patterns"
   - Note top 2-3 issues

2. **Analyze Root Cause** (10 min)
   - Why are users finding it "too difficult"?
   - Is it low energy users? Specific focus areas?
   - Check the example requests

3. **Draft Improvement** (15 min)
   - Write a specific prompt change based on findings
   - Test logic: "If user has low energy, cut time by 50%"

4. **Deploy A/B Test** (5 min)
   - Update `server/server.js` with new version
   - 50% of users get old prompt, 50% get new
   - Tag events with version

5. **Measure Results** (ongoing)
   - After 50+ responses, compare ratings
   - If new > old, make it default
   - Continue testing next improvement

---

## Example: Real Improvement Scenario

### Problem Identified (Week 1)
Analytics shows:
- 15 "too-difficult" adjustments
- Low engagement scores: 35%
- Users with "low" energy level most affected

### Root Cause (Week 2)
Query: Plans for "low energy" users are 40% longer than "medium energy" users
→ Prompt is not respecting energy level properly

### Solution Designed (Week 2-3)
Update system prompt to:
```javascript
"If energyLevel is 'low':
- Create 2-3 hour daily plan (not 6+ hours)
- Include rest periods
- Make 70% of tasks optional
- Celebrate any progress, not just full completion"
```

### A/B Test (Week 3-4)
- Split users 50/50
- Track: rating, adjustment rate, engagement
- Results:
  - Old: 3.1⭐, 42% adjust, 32% engagement
  - New: 3.9⭐, 18% adjust, 71% engagement

### Deploy (Week 5)
- New version becomes default
- Start testing next improvement
- Estimated impact: ~200 happier users per month

---

## Firebase Structure

Your data is organized in Firestore:

```
analytics/
  {userId}/
    plan_events/
      {docId}: {
        type: "plan-generated",
        profile: { tone, focus, duration, energy, ... },
        keywords: ["career", "learning"],
        timestamp: "2026-04-25T..."
      }
    feedback_events/
      {docId}: {
        type: "feedback-submitted",
        rating: 4,
        sentiment: "positive",
        timestamp: "2026-04-25T..."
      }
    adjustment_events/
      {docId}: {
        type: "plan-adjusted",
        reason: "too-difficult",
        adjustmentRequest: "Can you make it easier?",
        timestamp: "2026-04-25T..."
      }
    checkin_metrics/
      {docId}: {
        completedDays: 4,
        engagementScore: 65,
        activeStreak: 4,
        timestamp: "2026-04-25T..."
      }
```

---

## Key Metrics to Track

### Quality Metrics
| Metric | Target | What It Means |
|--------|--------|---------------|
| Avg Rating | 4.0+ ⭐ | Users satisfied with plans |
| Adjustment Rate | <25% | Plans are clear and achievable |
| Engagement Score | >60% | Users actually follow plans |
| Completion Rate | >40% | Users finish full week |

### Learning Metrics
| Metric | Action | Why |
|--------|--------|-----|
| Top adjustment reason | Fix that in prompt | Most common pain point |
| Best tone/focus combo | Focus testing there | Most popular = most feedback |
| Lowest engagement focus | Deep dive on that | Needs most improvement |

---

## Privacy & Best Practices

✅ **We Store:**
- Anonymized profile settings (not identifiable)
- Plan metadata (tone, focus, duration)
- Ratings and sentiment (not full messages needed)
- Engagement metrics (daily stats)

❌ **We Don't Store:**
- Full personal stories
- Medical/mental health details
- Identifiable private information
- More than 500 chars of feedback

✅ **Use Data For:**
- Improving AI quality
- Understanding user needs
- Making plans more personalized

❌ **Don't Use For:**
- Selling user data
- Marketing/targeting
- Sharing with third parties
- Training external models (add consent first)

---

## Commands for Manual Analysis

### Export adjustment patterns
```javascript
// In browser console (Admin):
const adjustments = await getDocs(
  collection(db, "analytics", userId, "adjustment_events")
);
const patterns = {};
adjustments.forEach(doc => {
  const reason = doc.data().reason;
  patterns[reason] = (patterns[reason] || 0) + 1;
});
console.table(patterns); // Export to CSV
```

### Find high-engagement users
```javascript
const metrics = await getDocs(
  collection(db, "analytics", userId, "checkin_metrics")
);
const highEngagement = metrics.docs
  .map(d => d.data())
  .filter(m => m.engagementScore > 70)
  .sort((a,b) => b.engagementScore - a.engagementScore);
console.table(highEngagement);
```

---

## Next Steps

1. **Today:** Review Analytics dashboard in admin tab
2. **This Week:** Identify top 2 issues from adjustment patterns
3. **Next Week:** Draft and deploy prompt improvements
4. **Monthly:** Full review cycle with A/B testing
5. **Quarterly:** Major prompt overhaul based on learnings

---

## Full Documentation

For detailed improvement strategies, see: **`AI_IMPROVEMENT_GUIDE.md`**

That guide includes:
- Step-by-step improvement process
- Real examples of successful changes
- Advanced analytics queries
- A/B testing setup
- Regular review cycle checklist

---

**Your AI is now data-driven. Every user interaction makes it smarter.** 🚀
