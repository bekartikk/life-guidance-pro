import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase-db";
import { deleteAllProgressData } from "./progressData";
import { safeRead } from "./safeFirestore";

const plansCollection = collection(db, "plans");
const feedbackCollection = collection(db, "feedback");
const profilesCollection = collection(db, "profiles");
const goalsCollection = collection(db, "goals");
const habitsCollection = collection(db, "habits");
const reviewsCollection = collection(db, "weeklyReviews");
const monthlyReviewsCollection = collection(db, "monthlyReviews");
const careerExplorationsCollection = collection(db, "careerExplorations");
const hobbyPlansCollection = collection(db, "hobbyPlans");
const routineBuildersCollection = collection(db, "routineBuilders");
const reminderSettingsCollection = collection(db, "reminderSettings");

function sortByNewest(items) {
  return items.sort((left, right) => {
    const leftValue = typeof left.createdAt?.toDate === "function" ? left.createdAt.toDate().getTime() : new Date(left.createdAt || 0).getTime();
    const rightValue = typeof right.createdAt?.toDate === "function" ? right.createdAt.toDate().getTime() : new Date(right.createdAt || 0).getTime();
    return rightValue - leftValue;
  });
}

function createClientTimestamp() {
  return new Date().toISOString();
}

function buildSavedRecord(id, payload, timestamp = createClientTimestamp()) {
  return {
    id,
    ...payload,
    createdAt: payload.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export async function loadUserPlans(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
    const snapshot = await getDocs(query(plansCollection, where("userId", "==", userId)));
    return sortByNewest(snapshot.docs.map((planDoc) => ({ id: planDoc.id, ...planDoc.data() })));
    },
    [],
    "loadUserPlans",
  );
}

export async function loadUserGoals(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(goalsCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((goalDoc) => ({ id: goalDoc.id, ...goalDoc.data() })));
    },
    [],
    "loadUserGoals",
  );
}

export async function loadUserHabits(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(habitsCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((habitDoc) => ({ id: habitDoc.id, ...habitDoc.data() })));
    },
    [],
    "loadUserHabits",
  );
}

export async function loadWeeklyReviews(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(reviewsCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() })));
    },
    [],
    "loadWeeklyReviews",
  );
}

export async function loadMonthlyReviews(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(monthlyReviewsCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((reviewDoc) => ({ id: reviewDoc.id, ...reviewDoc.data() })));
    },
    [],
    "loadMonthlyReviews",
  );
}

export async function loadUserCareerExplorations(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(careerExplorationsCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((itemDoc) => ({ id: itemDoc.id, ...itemDoc.data() })));
    },
    [],
    "loadUserCareerExplorations",
  );
}

export async function loadUserHobbyPlans(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(hobbyPlansCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((itemDoc) => ({ id: itemDoc.id, ...itemDoc.data() })));
    },
    [],
    "loadUserHobbyPlans",
  );
}

export async function loadUserRoutineBuilders(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(routineBuildersCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((itemDoc) => ({ id: itemDoc.id, ...itemDoc.data() })));
    },
    [],
    "loadUserRoutineBuilders",
  );
}

export async function loadReminderSettings(userId) {
  if (!userId) return null;
  return safeRead(
    async () => {
      const snapshot = await getDoc(doc(reminderSettingsCollection, userId));
      return snapshot.exists() ? snapshot.data() : null;
    },
    null,
    "loadReminderSettings",
  );
}

export async function savePlanRecord(payload) {
  const timestamp = createClientTimestamp();
  const planRef = await addDoc(plansCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(planRef.id, payload, timestamp);
}

export async function saveGoalRecord(payload) {
  const timestamp = createClientTimestamp();
  const goalRef = await addDoc(goalsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(goalRef.id, payload, timestamp);
}

export async function saveHabitRecord(payload) {
  const timestamp = createClientTimestamp();
  const habitRef = await addDoc(habitsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(habitRef.id, payload, timestamp);
}

export async function saveWeeklyReviewRecord(payload) {
  const timestamp = createClientTimestamp();
  const reviewRef = await addDoc(reviewsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(reviewRef.id, payload, timestamp);
}

export async function saveMonthlyReviewRecord(payload) {
  const timestamp = createClientTimestamp();
  const reviewRef = await addDoc(monthlyReviewsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(reviewRef.id, payload, timestamp);
}

export async function saveCareerExplorationRecord(payload) {
  const timestamp = createClientTimestamp();
  const itemRef = await addDoc(careerExplorationsCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(itemRef.id, payload, timestamp);
}

export async function saveHobbyPlanRecord(payload) {
  const timestamp = createClientTimestamp();
  const itemRef = await addDoc(hobbyPlansCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(itemRef.id, payload, timestamp);
}

export async function saveRoutineBuilderRecord(payload) {
  const timestamp = createClientTimestamp();
  const itemRef = await addDoc(routineBuildersCollection, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return buildSavedRecord(itemRef.id, payload, timestamp);
}

export async function updateGoalRecord(goalId, payload, currentGoal = {}) {
  const timestamp = createClientTimestamp();
  await setDoc(
    doc(db, "goals", goalId),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return { ...currentGoal, ...payload, id: goalId, updatedAt: timestamp };
}

export async function updateHabitRecord(habitId, payload, currentHabit = {}) {
  const timestamp = createClientTimestamp();
  await setDoc(
    doc(db, "habits", habitId),
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return { ...currentHabit, ...payload, id: habitId, updatedAt: timestamp };
}

export async function saveReminderSettings(userId, payload) {
  await setDoc(
    doc(reminderSettingsCollection, userId),
    {
      ...payload,
      userId,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function deletePlanRecord(planId) {
  await deleteDoc(doc(db, "plans", planId));
}

export async function deleteGoalRecord(goalId) {
  await deleteDoc(doc(db, "goals", goalId));
}

export async function deleteHabitRecord(habitId) {
  await deleteDoc(doc(db, "habits", habitId));
}

export async function deleteRoutineBuilderRecord(recordId) {
  await deleteDoc(doc(db, "routineBuilders", recordId));
}

export async function loadUserProfile(userId) {
  if (!userId) return null;
  return safeRead(
    async () => {
      const snapshot = await getDoc(doc(profilesCollection, userId));
      return snapshot.exists() ? snapshot.data() : null;
    },
    null,
    "loadUserProfile",
  );
}

export async function saveUserProfile(userId, payload) {
  await setDoc(doc(profilesCollection, userId), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function submitFeedbackRecord(payload) {
  const timestamp = createClientTimestamp();
  const feedbackRef = await addDoc(feedbackCollection, { ...payload, createdAt: serverTimestamp() });
  return buildSavedRecord(feedbackRef.id, payload, timestamp);
}

export async function loadUserFeedback(userId) {
  if (!userId) return [];
  return safeRead(
    async () => {
      const snapshot = await getDocs(query(feedbackCollection, where("userId", "==", userId)));
      return sortByNewest(snapshot.docs.map((feedbackDoc) => ({ id: feedbackDoc.id, ...feedbackDoc.data() })));
    },
    [],
    "loadUserFeedback",
  );
}

export async function deleteAllUserData(userId) {
  const [plansSnapshot, feedbackSnapshot] = await Promise.all([
    getDocs(query(plansCollection, where("userId", "==", userId))),
    getDocs(query(feedbackCollection, where("userId", "==", userId))),
  ]);

  const goalsSnapshot = await getDocs(query(goalsCollection, where("userId", "==", userId)));
  const habitsSnapshot = await getDocs(query(habitsCollection, where("userId", "==", userId)));
  const reviewsSnapshot = await getDocs(query(reviewsCollection, where("userId", "==", userId)));
  const monthlyReviewsSnapshot = await getDocs(query(monthlyReviewsCollection, where("userId", "==", userId)));
  const careerSnapshot = await getDocs(query(careerExplorationsCollection, where("userId", "==", userId)));
  const hobbySnapshot = await getDocs(query(hobbyPlansCollection, where("userId", "==", userId)));
  const routineSnapshot = await getDocs(query(routineBuildersCollection, where("userId", "==", userId)));

  const deletions = [
    deleteDoc(doc(profilesCollection, userId)),
    deleteDoc(doc(reminderSettingsCollection, userId)),
    deleteAllProgressData(userId),
  ];
  plansSnapshot.forEach((planDoc) => deletions.push(deleteDoc(planDoc.ref)));
  feedbackSnapshot.forEach((feedbackDoc) => deletions.push(deleteDoc(feedbackDoc.ref)));
  goalsSnapshot.forEach((goalDoc) => deletions.push(deleteDoc(goalDoc.ref)));
  habitsSnapshot.forEach((habitDoc) => deletions.push(deleteDoc(habitDoc.ref)));
  reviewsSnapshot.forEach((reviewDoc) => deletions.push(deleteDoc(reviewDoc.ref)));
  monthlyReviewsSnapshot.forEach((reviewDoc) => deletions.push(deleteDoc(reviewDoc.ref)));
  careerSnapshot.forEach((itemDoc) => deletions.push(deleteDoc(itemDoc.ref)));
  hobbySnapshot.forEach((itemDoc) => deletions.push(deleteDoc(itemDoc.ref)));
  routineSnapshot.forEach((itemDoc) => deletions.push(deleteDoc(itemDoc.ref)));
  await Promise.all(deletions);
}

function countTopValues(plans, key) {
  const frequencyMap = new Map();
  plans.forEach((plan) => {
    String(plan.profileSnapshot?.[key] || "")
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean)
      .forEach((item) => frequencyMap.set(item, (frequencyMap.get(item) || 0) + 1));
  });
  return [...frequencyMap.entries()].sort((left, right) => right[1] - left[1]).slice(0, 5).map(([label, count]) => ({ label, count }));
}

export async function loadAdminSnapshot() {
  const [plansSnapshot, feedbackSnapshot, profilesSnapshot, goalsSnapshot, habitsSnapshot, reviewsSnapshot, monthlyReviewsSnapshot, careerSnapshot, hobbySnapshot, routineSnapshot, reminderSnapshot] = await Promise.all([
    getDocs(plansCollection),
    getDocs(feedbackCollection),
    getDocs(profilesCollection),
    getDocs(goalsCollection),
    getDocs(habitsCollection),
    getDocs(reviewsCollection),
    getDocs(monthlyReviewsCollection),
    getDocs(careerExplorationsCollection),
    getDocs(hobbyPlansCollection),
    getDocs(routineBuildersCollection),
    getDocs(reminderSettingsCollection),
  ]);
  const plans = sortByNewest(plansSnapshot.docs.map((planDoc) => ({ id: planDoc.id, ...planDoc.data() })));
  const feedback = sortByNewest(feedbackSnapshot.docs.map((feedbackDoc) => ({ id: feedbackDoc.id, ...feedbackDoc.data() })));
  return {
    totals: {
      users: profilesSnapshot.size,
      plans: plansSnapshot.size,
      goals: goalsSnapshot.size,
      habits: habitsSnapshot.size,
      reviews: reviewsSnapshot.size,
      monthlyReviews: monthlyReviewsSnapshot.size,
      careerExplorations: careerSnapshot.size,
      hobbyPlans: hobbySnapshot.size,
      routineBuilders: routineSnapshot.size,
      reminderProfiles: reminderSnapshot.size,
      feedback: feedbackSnapshot.size,
      positiveFeedback: feedback.filter((item) => Number(item.rating) >= 4).length,
    },
    recentPlans: plans.slice(0, 5),
    recentFeedback: feedback.slice(0, 5),
    topGoals: countTopValues(plans, "goals"),
    topHobbies: countTopValues(plans, "hobbies"),
  };
}
