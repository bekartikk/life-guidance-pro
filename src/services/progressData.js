import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import { applyProgressAction, defaultProgress, getDateKey } from "./rewards";

const progressCollection = collection(db, "progress");

function normalizeDate(value) {
  if (!value) return null;
  return typeof value?.toDate === "function" ? value.toDate().toISOString() : value;
}

export async function loadUserProgress(userId) {
  const progressRef = doc(progressCollection, userId);
  const snapshot = await getDoc(progressRef);
  if (!snapshot.exists()) {
    return { ...defaultProgress };
  }
  return { ...defaultProgress, ...snapshot.data() };
}

export async function loadUserCheckins(userId) {
  const snapshot = await getDocs(collection(progressCollection, userId, "checkins"));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((left, right) => right.date.localeCompare(left.date));
}

export async function loadRewardEvents(userId) {
  const snapshot = await getDocs(collection(progressCollection, userId, "events"));
  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((left, right) => new Date(normalizeDate(right.createdAt) || 0) - new Date(normalizeDate(left.createdAt) || 0));
}

export async function applyRewardAction(userId, action) {
  const progressRef = doc(progressCollection, userId);

  return runTransaction(db, async (transaction) => {
    const progressSnapshot = await transaction.get(progressRef);
    const currentProgress = progressSnapshot.exists()
      ? { ...defaultProgress, ...progressSnapshot.data() }
      : { ...defaultProgress, userId, createdAt: new Date().toISOString() };

    const { progress, rewards } = applyProgressAction(currentProgress, action);
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
      const eventRef = doc(collection(progressCollection, userId, "events"));
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
    const [progressSnapshot, checkinSnapshot] = await Promise.all([
      transaction.get(progressRef),
      transaction.get(checkinRef),
    ]);

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

    const { progress, rewards } = applyProgressAction(currentProgress, action);

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

