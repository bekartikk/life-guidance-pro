# 🧠 Life Guidance Pro - Brain Map

**Last Updated:** 2026-04-28  
**Project Status:** Development  
**Tech Stack:** React 19 + Firebase + Vite + Vanilla CSS (moving to Tailwind)

---

## 📊 Executive Summary

**Life Guidance Pro** is a privacy-first personal planning and routine-building platform that combines AI-powered guidance (Gemini API) with habit tracking, progress analytics, and gamified rewards.

### Quick Stats
- **Language Composition:** 93.5% JavaScript | 6.4% CSS | 0.1% HTML
- **Frontend:** React 19 + Vite (SPA)
- **Backend:** Node.js/Express API
- **Database:** Firebase Firestore (NoSQL)
- **Auth:** Firebase Email/Password + Google OAuth
- **Deployment:** Vercel (Frontend) + Render (Backend)
- **Features:** 17+ major features across 25+ components

---

## 🎯 Feature Map & Current Status

| Feature | Status | Component | Notes |
|---------|--------|-----------|-------|
| **Authentication** | ✅ Complete | Login.jsx | Email/password + Google OAuth |
| **Dashboard** | ✅ Complete | Dashboard.jsx | Main hub with 19 tabs |
| **AI Planner** | ✅ Complete | PlannerTab.jsx | Gemini API integration |
| **Chat Extension** | ✅ Complete | ChatExtensionTab.jsx | Follow-up chat with plans |
| **Goals & Milestones** | ✅ Complete | GoalTab.jsx | CRUD operations |
| **Habits & Streaks** | ✅ Complete | HabitTab.jsx | Daily streak tracking |
| **Daily Check-ins** | ✅ Complete | DailyProgressTab.jsx | Daily mood/energy/notes |
| **Daily Progress** | ✅ Complete | DailyProgressTab.jsx | Visual progress tracking |
| **Weekly Reviews** | ✅ Complete | WeeklyReviewTab.jsx | Weekly reflection |
| **Weekly Progress** | ✅ Complete | WeeklyProgressTab.jsx | Visual analytics |
| **Monthly Reviews** | ✅ Complete | MonthlyReviewTab.jsx | Monthly reflection |
| **Reward System** | ✅ Complete | RewardTab (in Dashboard) | Points, badges, levels |
| **Achievement Center** | ✅ Complete | AchievementTab.jsx | Badge showcase |
| **Missions** | ✅ Complete | MissionsTab.jsx | Gamified tasks |
| **Career Explorer** | ✅ Complete | CareerExplorerTab.jsx | Career insights |
| **Hobby-to-Income** | ✅ Complete | HobbyIncomeTab.jsx | Monetization paths |
| **Routine Builder** | ✅ Complete | RoutineBuilderTab.jsx | Schedule + calendar export |
| **Reminders** | ✅ Complete | ReminderTab.jsx | Notification preferences |
| **Personalization** | ✅ Complete | PersonalizationTab.jsx | Tone, focus, style |
| **Privacy Settings** | ✅ Complete | SettingsTab.jsx | Data export, deletion |
| **Admin Analytics** | ✅ Complete | AdminTab.jsx | System metrics |
| **Error Handling** | ✅ Complete | AppErrorBoundary.jsx | Global error boundary |
| **History** | ✅ Complete | HistoryTab.jsx | Past planner results |
| **Feedback** | ✅ Complete | FeedbackTab.jsx | User feedback collection |
| **Support** | ✅ Complete | SupportTab.jsx | FAQ and support links |

---

## 🏗️ Project Architecture

### Directory Structure

```
life-guidance-pro/
├── src/
│   ├── components/
│   │   ├── AppErrorBoundary.jsx        # Global error handler
│   │   ├── Dashboard.jsx               # Main dashboard (1600+ lines)
│   │   ├── Login.jsx                   # Auth UI
│   │   └── dashboard/                  # 22 tab components
│   │       ├── AchievementTab.jsx
│   │       ├── AdminTab.jsx
│   │       ├── AnalyticsPanel.jsx
│   │       ├── CareerExplorerTab.jsx
│   │       ├── ChatExtensionTab.jsx
│   │       ├── DailyProgressTab.jsx
│   │       ├── FeedbackTab.jsx
│   │       ├── GoalTab.jsx
│   │       ├── HabitTab.jsx
│   │       ├── HistoryTab.jsx
│   │       ├── HobbyIncomeTab.jsx
│   │       ├── MissionsTab.jsx
│   │       ├── MonthlyReviewTab.jsx
│   │       ├── PersonalizationTab.jsx
│   │       ├── PlannerTab.jsx
│   │       ├── ProfileTab.jsx
│   │       ├── ReminderTab.jsx
│   │       ├── ResultPanel.jsx
│   │       ├── RoutineBuilderTab.jsx
│   │       ├── SettingsTab.jsx
│   │       ├── SupportTab.jsx
│   │       ├── WeeklyProgressTab.jsx
│   │       └── WeeklyReviewTab.jsx
│   ├── services/
│   │   ├── appData.js                  # Firestore CRUD
│   │   ├── dataCollection.js           # Data collection logic
│   │   ├── progressData.js             # Progress calculations
│   │   └── rewards.js                  # Reward system logic
│   ├── data/
│   │   └── sampleProfiles.js           # Demo profile data
│   ├── App.jsx                         # Root component
│   ├── App.css                         # Global styles
│   ├── firebase.js                     # Firebase config
│   ├── main.jsx                        # React entry point
│   └── assets/                         # Images, icons, etc.
├── server/
│   ├── server.js                       # Node.js/Express backend
│   ├── .env.example
│   └── package.json
├── public/
├── index.html                          # HTML entry
├── package.json                        # Frontend dependencies
├── vite.config.js                      # Vite config
├── eslint.config.js                    # Lint rules
├── firestore.rules                     # Firestore security rules
├── render.yaml                         # Render deployment config
├── README.md
└── [Documentation files]
```

---

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```
User Input → Firebase Auth (Email/Google) → Auth State → setUser() → Dashboard/Login
```
- **Entry:** Login.jsx
- **Handler:** Firebase onAuthStateChanged()
- **State:** App.jsx manages `user` state
- **Result:** Routes to Dashboard if authenticated

### 2. User Data Management
```
Firebase Firestore ←→ appData.js ←→ React Components ←→ UI Updates
```
- **Collections:**
  - `users` - User profiles
  - `goals` - User goals
  - `habits` - Habit definitions
  - `dailyCheckIns` - Daily logs
  - `weeklyReviews` - Weekly summaries
  - `monthlyReviews` - Monthly summaries
  - `routines` - User routines
  - `rewards` - Achievement data
  - `personalization` - User preferences

- **Key Functions:**
  - `fetchUserData()` - Load user profile
  - `createGoal()` - Add new goal
  - `updateHabit()` - Update habit progress
  - `saveCheckIn()` - Save daily check-in
  - `getRewards()` - Fetch achievement data

### 3. AI Planning Flow
```
User Prompt → Backend API → Gemini API → Response → ResultPanel → Chat Follow-ups
```
- **Component:** PlannerTab.jsx
- **Backend:** server.js (Node.js/Express)
- **AI Model:** Google Gemini API
- **Storage:** Results saved to Firestore
- **Related:** ChatExtensionTab.jsx for follow-up conversations

### 4. Habit & Streak System
```
Daily Check-in → progressData.js → Streak Calculation → Rewards Trigger → Update UI
```
- **Tracking:** HabitTab.jsx, DailyProgressTab.jsx
- **Calculation:** `calculateStreaks()` in progressData.js
- **Rewards:** rewards.js triggers badges/points when milestones hit
- **Display:** AchievementTab.jsx shows earned rewards

### 5. Reward & Gamification System
```
User Action → rewards.js (Logic) → Badge/Points Award → Achievement Center → UI Update
```
- **Actions Tracked:**
  - Goal creation/completion
  - Habit streaks
  - Check-in consistency
  - Plan reviews
  - Missions completed

- **Reward Types:**
  - Badges (collectible achievements)
  - Points (numerical score)
  - Levels (progression tiers)
  - Missions (special tasks)

- **Storage:** `rewards` collection in Firestore

### 6. Notification & Reminder System
```
ReminderTab.jsx → User Preferences → Browser Notifications API → Desktop Alerts
```
- **Config:** ReminderTab.jsx
- **Storage:** Preferences in user profile
- **Execution:** Browser notification system
- **Types:** Daily check-ins, habit reminders, review prompts

---

## 📱 Component Hierarchy

```
App.jsx
├── AppErrorBoundary
│   ├── Topbar (header with branding + auth)
│   └── Login.jsx OR Dashboard.jsx
│       ├── Dashboard Rail (sidebar)
│       │   ├── Quick stats
│       │   ├── Meta grid
│       │   └── Sample prompts
│       └── Workspace (main content)
│           ├── Navigation chips (tab selector)
│           ├── Tab Content (one of 22 tabs)
│           │   ├── Form inputs
│           │   ├── Data displays
│           │   ├── Action buttons
│           │   └── Results panels
│           └── ResultPanel.jsx (AI results)
```

---

## 🗄️ Firestore Collections & Schema

### users
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  displayName: "User Name",
  createdAt: timestamp,
  personalization: {
    tone: "supportive",
    focus: "career",
    style: "detailed"
  },
  privacySettings: {
    allowAnalytics: true,
    allowReminders: true
  }
}
```

### goals
```javascript
{
  id: "goal-id",
  userId: "user-id",
  title: "Learn React",
  description: "...",
  category: "skill",
  status: "active",
  priority: "high",
  deadline: timestamp,
  milestones: [],
  progress: 0,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### habits
```javascript
{
  id: "habit-id",
  userId: "user-id",
  name: "Morning Exercise",
  frequency: "daily",
  currentStreak: 5,
  longestStreak: 12,
  lastCheckedDate: timestamp,
  createdAt: timestamp
}
```

### dailyCheckIns
```javascript
{
  id: "checkin-id",
  userId: "user-id",
  date: timestamp,
  mood: "happy",
  energy: "high",
  notes: "Great day!",
  habitsCompleted: ["habit-1", "habit-2"],
  createdAt: timestamp
}
```

### weeklyReviews
```javascript
{
  id: "review-id",
  userId: "user-id",
  weekStart: timestamp,
  goalsProgress: {},
  habitsStats: {},
  reflection: "...",
  createdAt: timestamp
}
```

### rewards
```javascript
{
  userId: "user-id",
  points: 1250,
  level: 3,
  badges: [
    { id: "badge-1", name: "First Step", earnedAt: timestamp },
    { id: "badge-2", name: "Week Warrior", earnedAt: timestamp }
  ],
  missions: [],
  lastUpdated: timestamp
}
```

---

## 🔌 API Endpoints (Backend)

### POST /api/plan
- **Input:** User prompt, personalization preferences
- **Output:** AI-generated plan from Gemini API
- **Used By:** PlannerTab.jsx

### POST /api/chat
- **Input:** Follow-up message
- **Output:** Conversational response
- **Used By:** ChatExtensionTab.jsx

### GET /api/health
- **Output:** Server status
- **Used By:** Health checks

---

## 🔐 Security & Firestore Rules

The app uses Firestore security rules to ensure:
- ✅ Users can only read/write their own data
- ✅ Public collections (if any) are read-only
- ✅ Admin operations are restricted
- ✅ Real-time sync with proper validation

---

## 📦 Current Dependencies

### Frontend (package.json)
```json
{
  "dependencies": {
    "firebase": "^12.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "vite": "^8.0.4",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^9.39.4"
  }
}
```

### Backend (server/package.json)
```json
{
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.6",
    "dotenv": "^17.2.3"
  }
}
```

---

## 🚀 Deployment Overview

### Frontend (Vercel)
- Auto-deploys from main branch
- Environment: `.env` (Firebase config)
- URL: https://life-guidance-pro.vercel.app

### Backend (Render)
- Node.js/Express server
- Environment: `server/.env` (API keys)
- Auto-restarts on code changes

### Database (Firebase)
- Firestore in production mode
- Real-time sync enabled
- Security rules from `firestore.rules`

---

## 🔄 Auto-Update Checklist

Use this checklist whenever you make changes to keep the brain map current:

### When Adding a New Feature
- [ ] Add feature to "Feature Map" table (✅ Complete, 🚀 In Progress, or 📋 Planned)
- [ ] Create new component(s) and list in "Directory Structure"
- [ ] Document data flow in "Data Flow Architecture" section
- [ ] Add Firestore collection/schema if creating new data types
- [ ] Update "Component Hierarchy" if adding new routes
- [ ] Update dependencies in "Current Dependencies" if adding packages
- [ ] Test on both frontend and backend before marking complete

### When Adding a New Component
- [ ] Add to appropriate directory (components/ or dashboard/)
- [ ] Update "Component Hierarchy" section
- [ ] Document props and state in component comments
- [ ] Add to "Directory Structure" tree
- [ ] Link from Dashboard navigation
- [ ] Add error handling with AppErrorBoundary

### When Modifying Firestore Schema
- [ ] Update schema in "Firestore Collections & Schema"
- [ ] Update Firestore rules in firestore.rules
- [ ] Update related service functions in services/*.js
- [ ] Test CRUD operations
- [ ] Document backward compatibility issues

### When Updating Dependencies
- [ ] Update version in "Current Dependencies"
- [ ] Test all features that use the updated package
- [ ] Check for breaking changes in component code
- [ ] Update build scripts if needed

### When Adding API Endpoints
- [ ] Document endpoint in "API Endpoints" section
- [ ] Include HTTP method, input, output
- [ ] Note which component(s) use it
- [ ] Add error handling in server.js
- [ ] Test with sample data

### When Redesigning UI
- [ ] Update color scheme in App.css
- [ ] Update component styling
- [ ] Document design system changes
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Update this brain map with new design approach

---

## 📊 Statistics

- **Total Components:** 25+
- **Total Service Functions:** 15+
- **Firestore Collections:** 9
- **Deployment Environments:** 3 (Vercel, Render, Firebase)
- **Authentication Methods:** 2 (Email/Password, Google OAuth)
- **Lines of Code:** ~5,000+ (frontend) + ~500+ (backend)

---

## 🎨 Current Design System

### Colors (Earthy/Green Theme)
- Primary: #2d6f5b (teal green)
- Background: #f3f6f1 (light cream)
- Text: #172019 (dark green)
- Accent: #526052 (muted green)
- Borders: #cdd9c7 (soft green border)
- Success: #1e5a43
- Error: #8d1f1f

### Typography
- Font Family: Inter (system-ui fallback)
- Headings: font-weight: 800, clamp() for responsive
- Body: Regular weight, line-height: 1.5

### Spacing
- Base unit: 4px
- Padding: 12px, 14px, 16px, 18px, 20px, 24px, 28px
- Gap: 8px, 10px, 12px, 14px, 16px, 18px, 22px
- Margins: auto, variable based on context

### Components
- Border radius: 8px (standard), 6px (smaller), 999px (pills)
- Borders: 1px solid with green-tinted colors
- Box shadow: 0 18px 48px rgba(28, 48, 33, 0.08)
- Transitions: 120ms ease for interactive elements

---

## 📝 Next Steps

1. ✅ Complete feature parity
2. 🎨 Modern UI redesign (in progress - see MODERN_UI_REDESIGN.md)
3. 🔧 Performance optimization
4. 📱 Mobile app version
5. 🌐 Multi-language support
6. 🔔 Real push notifications
7. 📊 Advanced analytics dashboard
8. 🤖 More AI features (journaling, analysis)

---

## 🔗 Related Documentation

- `README.md` - Project overview
- `QUICK_START_GUIDE.md` - Development setup
- `DEPLOYMENT_CHECKLIST.md` - Launch procedures
- `MODERN_UI_REDESIGN.md` - UI redesign guide
- `COMPONENT_REDESIGN_GUIDE.md` - Component-specific redesign
- `AI_IMPROVEMENT_GUIDE.md` - AI feature improvements
- `TRAINING_DATA_GUIDE.md` - Data training guide
- `firestore.rules` - Security rules

---

**Remember:** Update this brain map whenever you make significant changes. Use the checklist above as your guide.
