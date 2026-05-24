# Life Guidance Pro - Project Brain Map

_Updated: 24 May 2026_

This is the working memory file for the project. It captures what the app is, what has been upgraded, what is integrated, what is only prepared, and what the current production-safe architecture looks like.

## 1. Product Identity

**Life Guidance Pro** has evolved from a simple AI planner into an **adaptive AI life operating system** focused on:

- planning
- routines
- emotional awareness
- behavioral learning
- recovery support
- sustainable productivity
- roadmap generation
- long-term growth guidance

The intended experience is:

- premium
- emotionally calm
- mobile-aware
- adaptive
- realistic
- supportive without pretending to be therapy

The app is explicitly **not**:

- therapy
- crisis support
- medical advice
- legal advice

## 2. Core Stack

### Frontend

- React 19
- Vite 8
- React Router DOM 7
- Tailwind CSS 4
- Framer Motion
- Recharts
- React Icons

### Backend

- Node.js
- Express 5
- dotenv
- CORS

### Primary data/auth

- Firebase Auth
- Firestore

### Secondary / hybrid data layer

- Supabase JS
- pgvector-ready migrations
- hybrid repository architecture

### Analytics

- PostHog, loaded lazily

### Monitoring

- Sentry code path was added temporarily in earlier phases, then intentionally rolled back

## 3. Current High-Level Architecture

### Frontend app shell

- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)
  - router
  - auth hydration
  - safe lazy route loading
  - protected/public route handling

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
  - main authenticated workspace
  - planner surface
  - adaptive AI surfaces
  - tab system
  - mobile bottom nav
  - safe lazy widget loading

- [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
  - auth entry
  - onboarding-style login/signup presentation

- [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
  - premium landing experience
  - mobile-first progressive reveal sections

### Frontend domain folders

- [src/components/dashboard](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard)
  - planner, reviews, result panel, analytics, reminders, settings, admin, etc.

- [src/components/ai](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai)
  - adaptive intelligence surfaces
  - adaptive history surfaces
  - adaptive insight loading hooks

- [src/ai](C:/Users/User/Downloads/projects/life-guidance-pro/src/ai)
  - frontend adaptive orchestration helpers
  - memory/cache/provider scaffolding

- [src/services](C:/Users/User/Downloads/projects/life-guidance-pro/src/services)
  - Firestore-backed app data
  - progress/rewards
  - behavioral insight derivation
  - analytics event logging

- [src/data/hybrid](C:/Users/User/Downloads/projects/life-guidance-pro/src/data/hybrid)
  - browser-side Supabase hybrid helpers
  - backend mode gating
  - realtime subscription helpers

### Backend domain folders

- [server/ai](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai)
  - provider orchestration
  - runtime cache
  - OpenAI/Gemini provider adapters

- [server/prompts](C:/Users/User/Downloads/projects/life-guidance-pro/server/prompts)
  - centralized prompts
  - structured schemas
  - personality definitions

- [server/adaptive-engine](C:/Users/User/Downloads/projects/life-guidance-pro/server/adaptive-engine)
  - adaptive state and planning logic

- [server/memory](C:/Users/User/Downloads/projects/life-guidance-pro/server/memory)
  - memory engine

- [server/personality-engine](C:/Users/User/Downloads/projects/life-guidance-pro/server/personality-engine)
  - AI personality selection

- [server/recommendation-engine](C:/Users/User/Downloads/projects/life-guidance-pro/server/recommendation-engine)
  - recommendations and adaptive suggestions

- [server/db](C:/Users/User/Downloads/projects/life-guidance-pro/server/db)
  - hybrid persistence/retrieval layer
  - Supabase admin setup
  - repository pattern
  - embeddings and vector retrieval scaffolding

## 4. Major Product / UX Upgrades Already Completed

### A. Landing page transformation

The landing page was upgraded from a basic planner pitch into a premium AI product story:

- premium hero
- clearer value proposition
- emotional/productivity positioning
- audience segmentation
- AI workflow explanation
- AI memory explanation
- hobby-to-income positioning
- daily check-in explanation
- behavioral analytics explanation
- trust/privacy section
- stronger CTA structure

Key files:

- [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)

### B. Login / onboarding refinement

The auth experience was redesigned into a calmer, guided entry flow:

- onboarding-style framing
- premium positioning
- improved mobile layout
- cleaner spacing and hierarchy

Key files:

- [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
- [src/styles/auth-onboarding.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/auth-onboarding.css)

### C. Mobile-first UX refinement

Mobile was heavily refined without redesigning desktop:

- shorter mobile hero
- progressive reveal content on landing
- reduced scroll fatigue
- simplified mobile storytelling
- dashboard mobile bottom nav
- deferred heavy analytics on mobile
- smaller mobile skeletons
- calmer adaptive rail behavior on mobile

Key files:

- [src/pages/Landing.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/pages/Landing.jsx)
- [src/styles/landing-experience.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/landing-experience.css)
- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)

### D. Dashboard modernization

The dashboard was upgraded into a premium dark SaaS workspace:

- stronger shell
- upgraded hero
- side navigation and intelligence rail
- planner/result split workspace
- improved progress/analytics surfaces
- better adaptive panels

Key files:

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/dashboard](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard)
- [src/styles/dashboard-modern.css](C:/Users/User/Downloads/projects/life-guidance-pro/src/styles/dashboard-modern.css)

## 5. Adaptive AI / Intelligence Upgrades Already Completed

### Daily adaptive check-in system

Daily check-ins now capture richer user state:

- mood
- energy
- focus
- stress
- motivation
- productivity
- sleep quality
- happiness
- emotional state
- pressure level
- personal issues
- wins
- reflection
- loneliness
- difficulty reason

Key files:

- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)
- [src/services/progressData.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/progressData.js)

### Behavioral insight engine

The app now derives:

- burnout risk
- life state
- neglected areas
- micro-wins
- adaptive recommendations
- future projection
- memory cards
- emotional/productivity patterns

Key file:

- [src/services/behavioralInsights.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/behavioralInsights.js)

### Frontend adaptive orchestration

The frontend now has a local adaptive intelligence layer for shaping dashboard behavior and AI context:

- workspace modes
- insight feed shaping
- memory explanation
- roadmap intelligence
- request context building

Key files:

- [src/ai/orchestration/adaptiveIntelligence.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/ai/orchestration/adaptiveIntelligence.js)
- [src/ai/orchestration/buildAiRequestContext.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/ai/orchestration/buildAiRequestContext.js)
- [src/ai/orchestration/runtimeConfig.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/ai/orchestration/runtimeConfig.js)

### Visual AI intelligence surfaces

Dashboard now exposes adaptive AI visually via:

- Today’s AI Focus
- Momentum Score
- Burnout Risk
- Recovery Suggestions
- Adaptive Intensity
- Cognitive Load
- AI Weekly Pattern
- Adaptive AI history
- Why the plan changed
- semantic memory summaries

Key files:

- [src/components/ai/AdaptiveIntelligenceRail.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveIntelligenceRail.jsx)
- [src/components/ai/AdaptiveHistorySurface.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveHistorySurface.jsx)
- [src/components/ai/AdaptiveWidgetSkeleton.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/AdaptiveWidgetSkeleton.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/dashboard/ResultPanel.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/ResultPanel.jsx)

## 6. AI Backend / Orchestration Upgrades Already Completed

The Express backend evolved from a single prompt endpoint into a modular AI engine.

### Current backend API

Defined in [server/server.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/server.js):

- `GET /`
- `GET /healthz`
- `GET /api/adaptive-insights`
- `POST /api/guidance`
- `POST /api/followup`

### AI provider layer

Current provider design supports:

- OpenAI
- Gemini
- provider selection via env vars
- structured output response shaping
- runtime fallback behavior

Key files:

- [server/ai/orchestrator.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai/orchestrator.js)
- [server/ai/providerRegistry.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai/providerRegistry.js)
- [server/ai/providers/openaiProvider.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai/providers/openaiProvider.js)
- [server/ai/providers/geminiProvider.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai/providers/geminiProvider.js)
- [server/ai/cache/runtimeCache.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/ai/cache/runtimeCache.js)

### Personality system

Implemented personalities:

- strict coach
- calm mentor
- therapist-style reflective guide
- gym coach
- study mentor

Key files:

- [server/prompts/personalities.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/prompts/personalities.js)
- [server/personality-engine/personalityEngine.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/personality-engine/personalityEngine.js)

### Adaptive / memory / recommendation engines

Implemented backend modules for:

- adaptive routines
- burnout prevention
- recovery mode
- dynamic task intensity
- momentum scoring
- AI daily focus
- behavioral learning
- memory snapshot generation
- recommendation ranking

Key files:

- [server/adaptive-engine/adaptiveEngine.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/adaptive-engine/adaptiveEngine.js)
- [server/memory/memoryEngine.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/memory/memoryEngine.js)
- [server/recommendation-engine/recommendationEngine.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/recommendation-engine/recommendationEngine.js)
- [server/prompts/guidancePrompts.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/prompts/guidancePrompts.js)
- [server/prompts/schemas.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/prompts/schemas.js)

## 7. Firebase / Firestore Work Already Completed

Firebase remains the primary production source of truth.

### Auth

- email/password auth
- Google sign-in UI path
- password reset
- email verification sending
- auth hydration guards
- protected/public routes

Key files:

- [src/firebase.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/firebase.js)
- [src/components/Login.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Login.jsx)
- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)

### Firestore data/services

App persistence covers:

- plans
- profile
- goals
- habits
- weekly reviews
- monthly reviews
- career explorations
- hobby income plans
- routine builders
- reminders
- progress
- rewards
- check-ins
- analytics events

Key files:

- [src/services/appData.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/appData.js)
- [src/services/progressData.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/progressData.js)
- [src/services/rewards.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/rewards.js)
- [src/services/dataCollection.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/dataCollection.js)
- [firestore.rules](C:/Users/User/Downloads/projects/life-guidance-pro/firestore.rules)

### Performance improvements already made

- split Firebase app/auth from Firestore boot
- public routes do not fully pay Firestore setup cost immediately
- reduced extra Firestore reads after writes in several services

Key files:

- [src/firebase.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/firebase.js)
- [src/firebase-db.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/firebase-db.js)
- [src/services/appData.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/services/appData.js)

## 8. Supabase Hybrid Architecture Already Completed

Supabase was introduced as a **hybrid, non-breaking secondary layer**.

### Important current status

- Firebase is still primary
- Supabase is mirror/read/vector architecture
- hybrid mode is prepared
- live rollout depends on valid Supabase credentials and applying migrations

### What is already implemented

- Supabase browser helpers
- Supabase admin client
- hybrid repository pattern
- noop fallback repository
- adaptive artifact persistence hooks
- adaptive insights read path
- realtime-ready recommendation refresh hooks
- vector memory retrieval scaffolding
- semantic memory summary surfacing

Key frontend files:

- [src/data/hybrid/backendMode.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/data/hybrid/backendMode.js)
- [src/data/hybrid/supabaseBrowser.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/data/hybrid/supabaseBrowser.js)
- [src/data/hybrid/authBridge.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/data/hybrid/authBridge.js)
- [src/data/hybrid/realtimeSubscriptions.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/data/hybrid/realtimeSubscriptions.js)

Key backend files:

- [server/db/config.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/config.js)
- [server/db/supabaseAdmin.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/supabaseAdmin.js)
- [server/db/auth/authContext.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/auth/authContext.js)
- [server/db/repositories/index.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/repositories/index.js)
- [server/db/repositories/supabaseAdaptiveRepository.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/repositories/supabaseAdaptiveRepository.js)
- [server/db/repositories/noopAdaptiveRepository.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/repositories/noopAdaptiveRepository.js)
- [server/db/services/persistAdaptiveArtifacts.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/services/persistAdaptiveArtifacts.js)
- [server/db/services/loadAdaptiveInsights.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/services/loadAdaptiveInsights.js)

### Vector / embeddings / retrieval layer

Prepared and partially wired:

- embedding provider
- queue helpers
- vector retrieval service
- memory ranking engine
- adaptive context builder
- scoring utilities

Key files:

- [server/db/embeddings/openaiEmbeddingProvider.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/embeddings/openaiEmbeddingProvider.js)
- [server/db/retrieval/vectorMemoryService.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/retrieval/vectorMemoryService.js)
- [server/db/retrieval/adaptiveContextBuilder.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/retrieval/adaptiveContextBuilder.js)
- [server/db/retrieval/memoryRankingEngine.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/retrieval/memoryRankingEngine.js)
- [server/db/retrieval/scoringUtils.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/retrieval/scoringUtils.js)
- [server/db/retrieval/embeddingQueueHelpers.js](C:/Users/User/Downloads/projects/life-guidance-pro/server/db/retrieval/embeddingQueueHelpers.js)

### Supabase migrations prepared

- [supabase/migrations/202605190001_adaptive_ai_foundation.sql](C:/Users/User/Downloads/projects/life-guidance-pro/supabase/migrations/202605190001_adaptive_ai_foundation.sql)
- [supabase/migrations/202605190002_vector_memory_retrieval.sql](C:/Users/User/Downloads/projects/life-guidance-pro/supabase/migrations/202605190002_vector_memory_retrieval.sql)

These prepare:

- AI memory storage
- behavior snapshots
- recommendations
- conversation history
- usage analytics
- pgvector vector search
- match functions
- indexes
- RLS
- realtime-ready publication support

## 9. Analytics / Monitoring / Trust Work

### PostHog

Integrated in a lazy, non-blocking way:

- optional via env vars
- idle-ish initialization
- safe event wrappers
- reduced startup cost

Key files:

- [src/analytics/posthog.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/analytics/posthog.js)
- [src/utils/analytics.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/utils/analytics.js)

### Sentry

Important current status:

- **not active**
- Sentry experiments were rolled back to protect runtime stability
- current monitoring file is a safe no-op stub

Key file:


### Privacy / trust messaging

Privacy messaging has been added to the UX and settings/result/dashboard surfaces:

- memory is private
- user control is emphasized
- delete-my-data flow exists
- no therapy claims

Key files:

- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/dashboard/SettingsTab.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/SettingsTab.jsx)

## 10. Performance / Stability Work Already Completed

### Build and bundle improvements

Already done:

- route-level lazy loading
- lazy tab/widget loading
- guarded `safeLazy()` paths
- smarter vendor chunking
- separate Firebase chunks
- lazy PostHog loading
- deferred mobile analytics loading
- removed unused dependencies from earlier phases

Key files:

- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)
- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [vite.config.js](C:/Users/User/Downloads/projects/life-guidance-pro/vite.config.js)

### Dashboard stability hardening

Already done:

- guarded lazy module loading
- timeout fallbacks for lazy widgets
- workspace boot timeout
- auth wait timeout
- adaptive insights timeout
- stale async protection
- fail-open rendering when adaptive/Supabase data is missing
- object-to-JSX rendering fixes
- React #306 lazy import crash fix
- explicit extension import fixes for Vercel/Linux case-sensitive builds

Key files:

- [src/App.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/App.jsx)
- [src/components/Dashboard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/Dashboard.jsx)
- [src/components/ai/useAdaptiveInsightsFeed.js](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/ai/useAdaptiveInsightsFeed.js)
- [src/components/dashboard/QuickAddModal.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/QuickAddModal.jsx)
- [src/components/dashboard/Header.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Header.jsx)
- [src/components/dashboard/Sidebar.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/Sidebar.jsx)
- [src/components/dashboard/TaskCard.jsx](C:/Users/User/Downloads/projects/life-guidance-pro/src/components/dashboard/TaskCard.jsx)

### Remaining known non-critical performance hotspot

Still large:

- `charts` chunk from Recharts

This is the clearest remaining frontend bundle hotspot.

## 11. Current Integrations Status

### Active and used

- Firebase Auth
- Firestore
- Express API
- Gemini/OpenAI-ready AI backend orchestration
- PostHog lazy analytics
- Supabase client libraries and hybrid architecture code

### Prepared but dependent on external setup

- Supabase live mirror mode
- Supabase realtime in production
- Supabase vector retrieval with real embeddings
- OpenAI embeddings in production
- full OpenAI provider production rollout

### Deliberately disabled or rolled back

- Sentry production monitoring
- risky crash-test / verification monitoring flows

## 12. Environment Variables Used

### Frontend

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
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- feature flags for hybrid/realtime modes as defined in env examples

### Backend

- `PORT`
- `CLIENT_ORIGIN`
- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENABLE_SUPABASE_MIRROR`
- `ENABLE_AI_EMBEDDINGS`
- `ENABLE_SUPABASE_REALTIME`

## 13. Main Docs Already Added

- [README.md](C:/Users/User/Downloads/projects/life-guidance-pro/README.md)
- [AI_IMPROVEMENT_GUIDE.md](C:/Users/User/Downloads/projects/life-guidance-pro/AI_IMPROVEMENT_GUIDE.md)
- [DATA_COLLECTION_SUMMARY.md](C:/Users/User/Downloads/projects/life-guidance-pro/DATA_COLLECTION_SUMMARY.md)
- [DEPLOYMENT_CHECKLIST.md](C:/Users/User/Downloads/projects/life-guidance-pro/DEPLOYMENT_CHECKLIST.md)
- [MODERN_UI_REDESIGN.md](C:/Users/User/Downloads/projects/life-guidance-pro/MODERN_UI_REDESIGN.md)
- [FIGMA_REDESIGN_EXECUTION_PLAN.md](C:/Users/User/Downloads/projects/life-guidance-pro/FIGMA_REDESIGN_EXECUTION_PLAN.md)
- [QUICK_START_GUIDE.md](C:/Users/User/Downloads/projects/life-guidance-pro/QUICK_START_GUIDE.md)
- [TRAINING_DATA_GUIDE.md](C:/Users/User/Downloads/projects/life-guidance-pro/TRAINING_DATA_GUIDE.md)
- [PROJECT_BRAIN_MAP.md](C:/Users/User/Downloads/projects/life-guidance-pro/PROJECT_BRAIN_MAP.md)

## 14. Notable Commit Milestones

Recent major milestones in git history:

- `5fe51b1` - Transform landing and onboarding into premium AI life operating system experience
- `540c88b` - Add adaptive behavioral intelligence and richer emotional check-in system
- `3566ce3` - Reduce mobile landing scroll fatigue with progressive reveal sections
- `d8e5868` - Reduce mobile landing scroll fatigue with guided section navigation
- `63f2959` - Improve performance, mobile UX, and adaptive AI workspace intelligence
- `53312c2` - Fix dashboard lazy import crash after auth refresh
- `ac7928c` - Fix Vercel dashboard import resolution
- `9f2e453` - Stabilize production build and sync backend architecture

## 15. Current Production-Safe Status

At the code level, the project currently has:

- working React + Vite frontend
- Firebase-first auth/data flow
- production build stability improvements
- explicit import path fixes for Linux/Vercel
- modular AI backend with adaptive intelligence
- hybrid Supabase architecture ready for gradual rollout
- mobile-aware premium UX

Recent verified checks that have passed during this work:

- `npm run lint`
- `npm run build`
- `node --check server/server.js`

## 16. What Still Needs External Setup

These are not code problems; they need real platform setup:

- Supabase live service-role key validation
- applying Supabase migrations to the real project
- enabling Supabase mirror mode in production envs
- enabling embeddings in production
- any future reintroduction of Sentry, if desired
- final Vercel env syncing and redeploys when new integrations are turned on

## 17. One-Sentence Summary

**Life Guidance Pro is now a Firebase-first, React/Vite adaptive AI life operating system with a premium dashboard experience, behavioral insight layer, modular AI backend, and a prepared Supabase vector-memory migration path.**
