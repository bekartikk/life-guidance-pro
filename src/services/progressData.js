import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import { applyProgressAction as runRewardAction, defaultProgress, getDateKey } from "./rewards";
import { safeRead } from "./safeFirestore";

const progressCollection = collection(db, "progress");

function normalizeDate(value) {
  if (!value) return null;
  return typeof value?.toDate === "function" ? value.toDate().toISOString() : value;
}

export async function loadUserProgress(userId) {
  if (!userId) return { ...defaultProgress };
  return safeRead(
    async () => {
      const snapshot = await getDoc(doc(db, "progress", userId));
      return snapshot.exists() ? { ...defaultProgress, ...snapshot.data() } : { ...defaultProgress };
    },
    { ...defaultProgress },
    "loadUserProgress",
  );
}

export async function loadUserCheckins(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(collection(db, "progress", userId, "checkins"));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((left, right) => right.date.localeCompare(left.date));
    },
    [],
    "loadUserCheckins",
  );
}

export async function loadRewardEvents(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(collection(db, "progress", userId, "events"));
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort(
          (left, right) =>
            new Date(normalizeDate(right.createdAt) || 0) -
            new Date(normalizeDate(left.createdAt) || 0),
        );
    },
    [],
    "loadRewardEvents",
  );
}

export async function applyRewardAction(userId, action) {
  if (!userId) throw new Error("User not logged in");

  const progressRef = doc(db, "progress", userId);

  return runTransaction(db, async (transaction) => {
    const progressSnapshot = await transaction.get(progressRef);

    const currentProgress = progressSnapshot.exists()
      ? { ...defaultProgress, ...progressSnapshot.data() }
      : { ...defaultProgress, userId, createdAt: new Date().toISOString() };

    const { progress, rewards } = runRewardAction(currentProgress, action);
    const now = new Date().toISOString();

    transaction.set(
      progressRef,
      {
        ...progress,
        userId,
        createdAt: currentProgress.createdAt || now,
        updatedAt: now,
      },
      { merge: true },
    );

    rewards.forEach((reward) => {
      const eventRef = doc(collection(db, "progress", userId, "events"));
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
  const checkinRef = doc(progressCollection, userId, "checkins", dateKey);

  return runTransaction(db, async (transaction) => {
    const progressSnapshot = await transaction.get(progressRef);
    const checkinSnapshot = await transaction.get(checkinRef);

    const currentProgress = progressSnapshot.exists()
      ? { ...defaultProgress, ...progressSnapshot.data() }
      : { ...defaultProgress, userId, createdAt: new Date().toISOString() };

    const previousStatus = checkinSnapshot.exists() ? checkinSnapshot.data().status : null;
    const now = new Date().toISOString();
    const action = {
      type: "daily-checkin",
      dateKey,
      previousStatus,
      status: payload.status,
      planId: payload.planId || null,
    };

    const { progress, rewards } = runRewardAction(currentProgress, action);

    transaction.set(
      progressRef,
      {
        ...progress,
        userId,
        createdAt: currentProgress.createdAt || now,
        updatedAt: now,
      },
      { merge: true },
    );

    transaction.set(checkinRef, {
      date: dateKey,
      status: payload.status,
      note: payload.note || "",
      mood: payload.mood || "",
      energy: payload.energy || "",
      focus: payload.focus || "",
      loneliness: payload.loneliness || "",
      difficultyReason: payload.difficultyReason || "",
      planId: payload.planId || null,
      createdAt: checkinSnapshot.exists() ? checkinSnapshot.data().createdAt || now : now,
      updatedAt: now,
    });

    rewards.forEach((reward) => {
      const eventRef = doc(collection(progressCollection, userId, "events"));
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
        note: payload.note || "",
        mood: payload.mood || "",
        energy: payload.energy || "",
        focus: payload.focus || "",
        loneliness: payload.loneliness || "",
        difficultyReason: payload.difficultyReason || "",
      },
    };
  });
}

export async function deleteAllProgressData(userId) {
  const [eventsSnapshot, checkinsSnapshot] = await Promise.all([
    getDocs(collection(progressCollection, userId, "events")),
    getDocs(collection(progressCollection, userId, "checkins")),
  ]);

  const deletions = [deleteDoc(doc(progressCollection, userId))];
  eventsSnapshot.forEach((item) => deletions.push(deleteDoc(item.ref)));
  checkinsSnapshot.forEach((item) => deletions.push(deleteDoc(item.ref)));
  await Promise.all(deletions);
}
