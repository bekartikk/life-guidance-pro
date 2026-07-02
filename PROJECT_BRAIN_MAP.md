# Project Brain Map

_Auto-generated on 2 Jul 2026, 5:27 pm. This file updates from the repo structure and app/server entry points._

## What This Project Is

**Life Guidance Pro** is a full-stack planning app with:
- a React + Vite frontend
- Firebase Auth + Firestore persistence
- an Express backend for Gemini-powered plan generation and follow-up chat
- planner, goals, habits, reviews, rewards, analytics, reminders, profile, admin, and export flows

## Brain Map

```mermaid
flowchart TD
  A["User"] --> B["React App"]
  B --> C["Auth Layer"]
  B --> D["Dashboard Workspace"]
  B --> E["Planner + Result Panel"]
  D --> F["Tabs: AchievementTab, AdminTab, AnalyticsChart, AnalyticsPanel, CareerExplorerTab, ChatExtensionTab, DailyProgressTab, DashboardShell, ..."]
  E --> G["Express API"]
  G --> H["Gemini Guidance + Follow-up"]
  D --> I["Firestore Services"]
  I --> J["Collections: )),
    getDocs(collection(progressCollection, userId, , ));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(
        metricsRef,
        stripUndefinedDeep({
          timestamp: new Date().toISOString(),
          completedDays: checkinStats.completedDays || 0,
          partialDays: checkinStats.partialDays || 0,
          difficultDays: checkinStats.difficultDays || 0,
          missedDays: checkinStats.missedDays || 0,
          activeStreak: checkinStats.activeStreak || 0,
          engagementScore: calculateEngagementScore(checkinStats),
        }),
        { merge: true },
      );
    }),
  );
}

export async function getAnalyticsSummary(timeframeHours = 168) {
  const cutoffDate = new Date(Date.now() - timeframeHours * 3600000);

  return {
    period: , ));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: , ));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort(
          (left, right) =>
            new Date(normalizeDate(right.createdAt) || 0) -
            new Date(normalizeDate(left.createdAt) || 0),
        );
    },
    [],
    , ));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((left, right) => right.date.localeCompare(left.date));
    },
    [],
    , ));
      transaction.set(eventRef, {
        ...reward,
        date: action.dateKey || getDateKey(),
        planId: action.planId || null,
        createdAt: now,
      });
    });

    return { progress, rewards };
  });
}

export async function submitDailyCheckin(userId, payload) {
  const dateKey = payload.dateKey || getDateKey();
  const progressRef = doc(progressCollection, userId);
  const checkinRef = doc(progressCollection, userId, , ..."]
  D --> K["Reward + Progress Engine"]
  D --> L["Analytics Logging"]
  B --> M["Project Map Generator"]
  M --> N["PROJECT_BRAIN_MAP.md"]
```

## Runtime Flow

1. User signs in with Firebase Auth.
2. Frontend loads dashboard workspace and Firestore-backed user data.
3. Planner form submits to the Express backend.
4. Backend builds a Gemini prompt and returns a complete plan or follow-up response.
5. Frontend saves plan, goals, habits, reviews, progress, reminders, and analytics into Firestore.
6. Reward engine updates points, streaks, badges, milestones, and check-ins.
7. This map file is regenerated on dev-server startup, build startup, and file changes while Vite is running.

## Frontend Surface

- App shell: `src/App.jsx`
- Auth screen: `src/components/Login.jsx`
- Main workspace: `src/components/Dashboard.jsx`
- Shared styles: `src/App.css`
- Dashboard tabs:
  - `AchievementTab`
  - `AdminTab`
  - `AnalyticsChart`
  - `AnalyticsPanel`
  - `CareerExplorerTab`
  - `ChatExtensionTab`
  - `DailyProgressTab`
  - `DashboardShell`
  - `DashboardTabRouter`
  - `FeedbackTab`
  - `GoalTab`
  - `HabitTab`
  - `Header`
  - `HistoryTab`
  - `HobbyIncomeTab`
  - `MissionsTab`
  - `MonthlyReviewTab`
  - `PersonalizationTab`
  - `PlannerBoard`
  - `PlannerTab`
  - `ProfileTab`
  - `ProgressWidget`
  - `ProjectMapTab`
  - `QuickAddModal`
  - `ReminderTab`
  - `ResultPanel`
  - `RoutineBuilderTab`
  - `SettingsTab`
  - `Sidebar`
  - `SupportTab`
  - `TaskCard`
  - `WeeklyProgressTab`
  - `WeeklyReviewTab`

## Backend Surface

- API server: `server/server.js`
- Routes:
  - `GET /`
  - `GET /healthz`
  - `GET /api/adaptive-insights`
  - `POST /api/guidance`
  - `POST /api/followup`

## Data Layer

- Firestore-facing services:
  - `src/services/appData.js`
  - `src/services/progressData.js`
  - `src/services/dataCollection.js`
  - `src/services/rewards.js`
- Collections discovered from code:
  - `)),
    getDocs(collection(progressCollection, userId, `
  - `));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(
        metricsRef,
        stripUndefinedDeep({
          timestamp: new Date().toISOString(),
          completedDays: checkinStats.completedDays || 0,
          partialDays: checkinStats.partialDays || 0,
          difficultDays: checkinStats.difficultDays || 0,
          missedDays: checkinStats.missedDays || 0,
          activeStreak: checkinStats.activeStreak || 0,
          engagementScore: calculateEngagementScore(checkinStats),
        }),
        { merge: true },
      );
    }),
  );
}

export async function getAnalyticsSummary(timeframeHours = 168) {
  const cutoffDate = new Date(Date.now() - timeframeHours * 3600000);

  return {
    period: `
  - `));

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: `
  - `));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort(
          (left, right) =>
            new Date(normalizeDate(right.createdAt) || 0) -
            new Date(normalizeDate(left.createdAt) || 0),
        );
    },
    [],
    `
  - `));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((left, right) => right.date.localeCompare(left.date));
    },
    [],
    `
  - `));
      transaction.set(eventRef, {
        ...reward,
        date: action.dateKey || getDateKey(),
        planId: action.planId || null,
        createdAt: now,
      });
    });

    return { progress, rewards };
  });
}

export async function submitDailyCheckin(userId, payload) {
  const dateKey = payload.dateKey || getDateKey();
  const progressRef = doc(progressCollection, userId);
  const checkinRef = doc(progressCollection, userId, `
  - `));
      transaction.set(eventRef, {
        ...reward,
        date: dateKey,
        planId: payload.planId || null,
        createdAt: now,
      });
    });

    return {
      progress,
      rewards,
      checkin: {
        date: dateKey,
        status: payload.status,
        note: payload.note || `
  - `));
  const timestamp = new Date().toISOString();

  return runSafeAnalyticsWrite(() =>
    runTransaction(db, async (transaction) => {
      transaction.set(eventRef, stripUndefinedDeep({
        type: `
  - `),
    where(`
  - `);

function normalizeDate(value) {
  if (!value) return null;
  return typeof value?.toDate === `
  - `);

function sortByNewest(items) {
  return items.sort((left, right) => {
    const leftValue = typeof left.createdAt?.toDate === `
  - `);
const careerExplorationsCollection = collection(db, `
  - `);
const feedbackCollection = collection(db, `
  - `);
const goalsCollection = collection(db, `
  - `);
const reviewsCollection = collection(db, `
  - `);
const routineBuildersCollection = collection(db, `
  - `adjustment_events`

## Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_DATABASE_URL`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_API_BASE_URL`
- `VITE_ADMIN_EMAILS`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`
- `VITE_APP_VERSION`
- `VITE_COMMIT_SHA`
- `VITE_BACKEND_MODE`
- `VITE_SENTRY_DSN`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_REALTIME`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SENTRY_DSN`
- `ENABLE_SUPABASE_MIRROR`
- `ENABLE_AI_EMBEDDINGS`
- `ENABLE_SUPABASE_REALTIME`

## Tooling

- Package: `life-guidance-pro`
- Frontend scripts:
  - `dev`: `vite`
  - `build`: `vite build`
  - `lint`: `eslint .`
  - `preview`: `vite preview`
  - `project:map`: `node scripts/generate-project-map.mjs`
  - `project:map:watch`: `node scripts/watch-project-map.mjs`
  - `cap:sync`: `npx cap sync`
  - `cap:open`: `npx cap open android`
  - `test`: `vitest run`
  - `test:watch`: `vitest`
  - `test:e2e`: `playwright test`
- Vite config present: `yes`

## High-Level File Map

### src/
- `src/ai`
- `src/ai/cache`
- `src/ai/cache/upstashAdapter.js`
- `src/ai/memory`
- `src/ai/memory/memorySchema.js`
- `src/ai/memory/memoryService.js`
- `src/ai/memory/providers`
- `src/ai/memory/providers/pineconeAdapter.js`
- `src/ai/orchestration`
- `src/ai/orchestration/adaptiveIntelligence.js`
- `src/ai/orchestration/buildAiRequestContext.js`
- `src/ai/orchestration/runtimeConfig.js`
- `src/analytics`
- `src/analytics/posthog.js`
- `src/App.css`
- `src/App.jsx`
- `src/assets`
- `src/assets/hero.png`
- `src/assets/react.svg`
- `src/assets/vite.svg`
- `src/components`
- `src/components/ai`
- `src/components/ai/AdaptiveHistorySurface.jsx`
- `src/components/ai/adaptiveInsightsRepository.js`
- `src/components/ai/AdaptiveIntelligenceRail.jsx`
- `src/components/ai/AdaptiveWidgetSkeleton.jsx`
- `src/components/ai/useAdaptiveInsightsFeed.js`
- `src/components/AppErrorBoundary.jsx`
- `src/components/dashboard`
- `src/components/dashboard/AchievementTab.jsx`
- `src/components/dashboard/AdminTab.jsx`
- `src/components/dashboard/AnalyticsChart.jsx`
- `src/components/dashboard/AnalyticsPanel.jsx`
- `src/components/dashboard/CareerExplorerTab.jsx`
- `src/components/dashboard/ChatExtensionTab.jsx`
- `src/components/dashboard/DailyProgressTab.jsx`
- `src/components/dashboard/DashboardShell.jsx`
- `src/components/dashboard/DashboardTabRouter.jsx`
- `src/components/dashboard/FeedbackTab.jsx`
- `src/components/dashboard/GoalTab.jsx`

### server/
- `server/.env`
- `server/.env.example`
- `server/adaptive-engine`
- `server/adaptive-engine/adaptiveEngine.js`
- `server/ai`
- `server/ai/cache`
- `server/ai/cache/runtimeCache.js`
- `server/ai/orchestrator.js`
- `server/ai/providerRegistry.js`
- `server/ai/providers`
- `server/ai/providers/geminiProvider.js`
- `server/ai/providers/openaiProvider.js`
- `server/auth`
- `server/auth/firebaseAdmin.js`
- `server/auth/requireFirebaseAuth.js`
- `server/db`
- `server/db/auth`
- `server/db/auth/authContext.js`
- `server/db/config.js`
- `server/db/embeddings`
- `server/db/embeddings/openaiEmbeddingProvider.js`
- `server/db/repositories`
- `server/db/repositories/index.js`
- `server/db/repositories/noopAdaptiveRepository.js`
- `server/db/repositories/supabaseAdaptiveRepository.js`
- `server/db/repositories/types.js`
- `server/db/retrieval`
- `server/db/retrieval/adaptiveContextBuilder.js`
- `server/db/retrieval/embeddingQueueHelpers.js`
- `server/db/retrieval/memoryRankingEngine.js`
- `server/db/retrieval/scoringUtils.js`
- `server/db/retrieval/vectorMemoryService.js`
- `server/db/services`
- `server/db/services/loadAdaptiveInsights.js`
- `server/db/services/persistAdaptiveArtifacts.js`
- `server/db/supabaseAdmin.js`
- `server/memory`
- `server/memory/memoryEngine.js`
- `server/monitoring`
- `server/package-lock.json`

### docs and config
- `.agents/skills/supabase-postgres-best-practices/references/advanced-full-text-search.md`
- `.agents/skills/supabase-postgres-best-practices/references/advanced-jsonb-indexing.md`
- `.agents/skills/supabase-postgres-best-practices/references/conn-idle-timeout.md`
- `.agents/skills/supabase-postgres-best-practices/references/conn-limits.md`
- `.agents/skills/supabase-postgres-best-practices/references/conn-pooling.md`
- `.agents/skills/supabase-postgres-best-practices/references/conn-prepared-statements.md`
- `.agents/skills/supabase-postgres-best-practices/references/data-batch-inserts.md`
- `.agents/skills/supabase-postgres-best-practices/references/data-n-plus-one.md`
- `.agents/skills/supabase-postgres-best-practices/references/data-pagination.md`
- `.agents/skills/supabase-postgres-best-practices/references/data-upsert.md`
- `.agents/skills/supabase-postgres-best-practices/references/lock-advisory.md`
- `.agents/skills/supabase-postgres-best-practices/references/lock-deadlock-prevention.md`
- `.agents/skills/supabase-postgres-best-practices/references/lock-short-transactions.md`
- `.agents/skills/supabase-postgres-best-practices/references/lock-skip-locked.md`
- `.agents/skills/supabase-postgres-best-practices/references/monitor-explain-analyze.md`
- `.agents/skills/supabase-postgres-best-practices/references/monitor-pg-stat-statements.md`
- `.agents/skills/supabase-postgres-best-practices/references/monitor-vacuum-analyze.md`
- `.agents/skills/supabase-postgres-best-practices/references/query-composite-indexes.md`
- `.agents/skills/supabase-postgres-best-practices/references/query-covering-indexes.md`
- `.agents/skills/supabase-postgres-best-practices/references/query-index-types.md`
- `.agents/skills/supabase-postgres-best-practices/references/query-missing-indexes.md`
- `.agents/skills/supabase-postgres-best-practices/references/query-partial-indexes.md`
- `.agents/skills/supabase-postgres-best-practices/references/schema-constraints.md`
- `.agents/skills/supabase-postgres-best-practices/references/schema-data-types.md`
- `.agents/skills/supabase-postgres-best-practices/references/schema-foreign-key-indexes.md`
