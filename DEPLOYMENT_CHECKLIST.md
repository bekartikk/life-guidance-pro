# Deployment Checklist

Use this checklist when moving the app from local development to a live environment.

## 1. Firebase

- Enable `Email/Password` in Firebase Authentication.
- Enable `Google` sign-in in Firebase Authentication if you want the Google button to work.
- Add local and live authorized domains:
  - `localhost`
  - `127.0.0.1`
  - your Vercel domain
- Create Firestore in production mode.
- Paste the contents of [firestore.rules](C:/Users/User/Downloads/projects/life-guidance-pro/firestore.rules) into Firebase Firestore Rules and publish them.

## 2. Frontend environment

Set these in your live frontend environment:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BASE_URL=
VITE_ADMIN_EMAILS=
```

## 3. Backend environment

Set these in your live backend environment:

```text
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=
```

## 4. Deploy backend

You can use [render.yaml](C:/Users/User/Downloads/projects/life-guidance-pro/render.yaml) as a reference for Render setup.

## 5. Deploy frontend

Use Vercel with:

- build command: `npm run build`
- output directory: `dist`

## 6. Final smoke test

- Sign up
- Login
- Google sign-in
- Save profile
- Create plan
- Submit feedback
- Save goal
- Save habit
- Save weekly review
- Save monthly review
- Save career map
- Save hobby path
- Save routine blueprint
- Save reminder settings
- Enable browser notifications
- Export weekly summary
- Export JSON data
- Open admin tab with admin email
