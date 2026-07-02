import { vi } from 'vitest';
import '@testing-library/jest-dom';
import * as mockFirebase from './mocks/firebase.js';

// Mock Firebase SDKs
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: mockFirebase.getAuth,
  signInWithEmailAndPassword: mockFirebase.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockFirebase.createUserWithEmailAndPassword,
  signInWithPopup: mockFirebase.signInWithPopup,
  signOut: mockFirebase.signOut,
  sendEmailVerification: mockFirebase.sendEmailVerification,
  sendPasswordResetEmail: mockFirebase.sendPasswordResetEmail,
  GoogleAuthProvider: mockFirebase.GoogleAuthProvider,
}));

vi.mock('firebase/firestore', () => ({
  initializeFirestore: mockFirebase.initializeFirestore,
  memoryLocalCache: mockFirebase.memoryLocalCache,
  serverTimestamp: mockFirebase.serverTimestamp,
  collection: mockFirebase.collection,
  doc: mockFirebase.doc,
  query: mockFirebase.query,
  where: mockFirebase.where,
  getDoc: mockFirebase.getDoc,
  getDocs: mockFirebase.getDocs,
  addDoc: mockFirebase.addDoc,
  setDoc: mockFirebase.setDoc,
  deleteDoc: mockFirebase.deleteDoc,
}));

// Mock browser APIs
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.requestIdleCallback = (cb) => setTimeout(cb, 1);
global.cancelIdleCallback = (id) => clearTimeout(id);

global.Notification = class Notification {
  static permission = 'granted';
  constructor(title, options) {
    this.title = title;
    this.options = options;
  }
  close() {}
};
