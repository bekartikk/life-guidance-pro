# Fix Firebase Offline Error

## Plan
- [x] Step 1: Enable IndexedDB persistence in `src/firebase.js`
- [ ] Step 2: Add offline error handling in `src/services/progressData.js`
- [ ] Step 3: Add offline error handling in `src/services/appData.js`
- [ ] Step 4: Verify edits compile correctly

---

## Root Cause
- `src/firebase.js` uses `enableIndexedDbPersistence(db)` which was **removed in Firebase 12**
- Without working persistence, Firestore throws `"Failed to get document because the client is offline"` on every read while offline
- `progressData.js` and `appData.js` let these errors propagate uncaught, crashing the Dashboard `Promise.all` load

## Fixes Applied
1. **firebase.js**: Replace `getFirestore` + `enableIndexedDbPersistence` with `initializeFirestore(app, { localCache: persistentLocalCache(...) })`
2. **progressData.js**: Add `handleOfflineError` helper, wrap all read functions to return safe defaults, wrap writes to throw friendly offline messages
3. **appData.js**: Same pattern — wrap ~25 async functions with offline-aware try/catch
4. **Verification**: Run `npm run lint` to confirm no syntax/import errors

