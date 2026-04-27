# Life Guidance Pro

Life Guidance Pro is a privacy-aware planning and routine-building app. It combines Firebase authentication, Firestore-backed user data, a Gemini-powered planner, progress tracking, weekly and monthly reviews, rewards, career exploration, hobby-to-income mapping, routine blueprints, reminders, and admin analytics.

This app is supportive planning software. It is **not** therapy, medical care, legal advice, or emergency support.

## Feature Map

The current app includes:

- email/password auth
- Google sign-in UI
- password reset
- email verification sending
- AI planner with follow-up chat
- goals and milestones
- habits and streaks
- daily check-ins
- weekly and monthly reviews
- reward system, badges, milestones, missions, and levels
- achievement center
- personalization insights
- career explorer
- hobby-to-income paths
- routine builder with calendar export
- reminder preferences and browser test notifications
- privacy settings and JSON export
- admin analytics

## Project Structure

```text
life-guidance-pro/
  .env
  .env.example
  firestore.rules
  DEPLOYMENT_CHECKLIST.md
  render.yaml
  README.md
  index.html
  package.json
  vite.config.js
  eslint.config.js
  src/
    App.jsx
    App.css
    firebase.js
    main.jsx
    components/
      Dashboard.jsx
      Login.jsx
      dashboard/
        *.jsx
    services/
      appData.js
      progressData.js
      rewards.js
  server/
    .env
    .env.example
    package.json
    server.js
```

## Local Setup

### 1. Open the project

```bash
cd C:\Users\User\Downloads\projects\life-guidance-pro
code .
```

### 2. Install dependencies

```bash
npm install
cd server
npm install
cd ..
```

### 3. Configure the frontend environment

Use [`.env.example`](C:/Users/User/Downloads/projects/life-guidance-pro/.env.example) as your template.

### 4. Configure the backend environment

Use [`server/.env.example`](C:/Users/User/Downloads/projects/life-guidance-pro/server/.env.example) as your template.

### 5. Configure Firebase

In Firebase Console:

- enable `Email/Password`
- enable `Google` if you want Google sign-in to work
- create Firestore in production mode
- publish the rules from [`firestore.rules`](C:/Users/User/Downloads/projects/life-guidance-pro/firestore.rules)
- add authorized domains for local and live use

### 6. Run the backend

```bash
cd server
npm start
```

### 7. Run the frontend

```bash
npm run dev
```

## Launch Files Included

This repo now includes:

- [`firestore.rules`](C:/Users/User/Downloads/projects/life-guidance-pro/firestore.rules)  
  ready-to-paste Firestore rules covering all current collections

- [`render.yaml`](C:/Users/User/Downloads/projects/life-guidance-pro/render.yaml)  
  Render service configuration reference

- [`DEPLOYMENT_CHECKLIST.md`](C:/Users/User/Downloads/projects/life-guidance-pro/DEPLOYMENT_CHECKLIST.md)  
  exact launch checklist for Firebase, frontend, backend, and smoke testing

## Manual Setup Still Required

These parts cannot be completed by local code edits alone:

- enabling Google sign-in in Firebase Console
- publishing Firestore rules in Firebase Console
- adding live authorized domains in Firebase
- setting environment variables in Vercel/Render
- buying and connecting a custom domain
- real email reminder delivery
- real push notifications when the app is closed
- full Google Calendar API sync

## Build Checks

```bash
npm run lint
npm run build
cd server
node --check server.js
```
