import { vi } from 'vitest';

export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
};

// Auth Mock
export const getAuth = vi.fn(() => ({
  currentUser: mockUser,
  onAuthStateChanged: vi.fn((callback) => {
    callback(mockUser);
    return vi.fn(); // unsubscribe
  }),
}));

export const signInWithEmailAndPassword = vi.fn(() => Promise.resolve({ user: mockUser }));
export const createUserWithEmailAndPassword = vi.fn(() => Promise.resolve({ user: mockUser }));
export const signInWithPopup = vi.fn(() => Promise.resolve({ user: mockUser }));
export const signOut = vi.fn(() => Promise.resolve());
export const sendEmailVerification = vi.fn(() => Promise.resolve());
export const sendPasswordResetEmail = vi.fn(() => Promise.resolve());

export class GoogleAuthProvider {
  static PROVIDER_ID = 'google.com';
}

// Firestore Mock
export const db = {};
export const initializeFirestore = vi.fn(() => db);
export const memoryLocalCache = vi.fn(() => ({}));
export const serverTimestamp = vi.fn(() => new Date().toISOString());

export const collection = vi.fn((dbInstance, path) => ({
  path,
  id: path.split('/').pop(),
}));

export const doc = vi.fn((dbInstance, path, ...segments) => ({
  path: [path, ...segments].filter(Boolean).join('/'),
  id: segments.length ? segments[segments.length - 1] : path.split('/').pop(),
}));

export const query = vi.fn((colRef, ...queryConstraints) => ({
  colRef,
  queryConstraints,
}));

export const where = vi.fn((field, op, value) => ({
  field,
  op,
  value,
}));

let mockDbData = {};

export function setMockDbData(data) {
  mockDbData = data;
}

export const getDoc = vi.fn((docRef) => {
  const data = mockDbData[docRef.path] || null;
  return Promise.resolve({
    id: docRef.id,
    exists: () => !!data,
    data: () => data,
  });
});

export const getDocs = vi.fn((queryInstance) => {
  const path = queryInstance.colRef ? queryInstance.colRef.path : queryInstance.path;
  const docs = Object.entries(mockDbData)
    .filter(([docPath]) => docPath.startsWith(path + '/'))
    .map(([docPath, data]) => ({
      id: docPath.split('/').pop(),
      data: () => data,
    }));
  return Promise.resolve({
    docs,
    forEach: (cb) => docs.forEach(cb),
  });
});

export const addDoc = vi.fn((colRef, data) => {
  const id = `mock-doc-${Math.random().toString(36).slice(2, 9)}`;
  const path = `${colRef.path}/${id}`;
  mockDbData[path] = data;
  return Promise.resolve({
    id,
    path,
  });
});

export const setDoc = vi.fn((docRef, data) => {
  mockDbData[docRef.path] = data;
  return Promise.resolve();
});

export const deleteDoc = vi.fn((docRef) => {
  delete mockDbData[docRef.path];
  return Promise.resolve();
});
