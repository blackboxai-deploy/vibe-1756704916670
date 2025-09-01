// Firebase configuration and initialization for Navkar's Paints

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot, query, setLogLevel, CollectionReference, DocumentData, Firestore } from 'firebase/firestore';
import { AppConfig } from './types';

// Enable Firestore debug logs in development
if (typeof window !== 'undefined' && typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  setLogLevel('debug');
}

// Configuration constants
export const COMMISSION_RATE = 0.10; // 10% commission rate
export const LOW_STOCK_THRESHOLD = 10;

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

// Global configuration (will be set from environment or props)
let appConfig: AppConfig = {
  appId: 'default-app-id',
  firebaseConfig: {},
  commissionRate: COMMISSION_RATE,
  lowStockThreshold: LOW_STOCK_THRESHOLD
};

export function initializeFirebase(config?: Partial<AppConfig>) {
  if (config) {
    appConfig = { ...appConfig, ...config };
  }

  // Initialize Firebase only if config is provided
  if (Object.keys(appConfig.firebaseConfig).length > 0) {
    try {
      app = initializeApp(appConfig.firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
      console.log('Firebase initialized successfully');
      return { app, db, auth };
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return { app: null, db: null, auth: null };
    }
  } else {
    console.warn('Firebase config not available. App will run without database features.');
    return { app: null, db: null, auth: null };
  }
}

export function getFirebaseInstances() {
  return { app, db, auth };
}

export function getAppConfig() {
  return appConfig;
}

// Authentication functions
export async function signInUser(): Promise<User | null> {
  if (!auth) {
    console.warn('Firebase auth not initialized');
    return null;
  }

  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Anonymous sign-in failed:', error);
    return null;
  }
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
}

// Database collection helpers
export function getCollectionPath(collectionName: string, userId: string) {
  return `artifacts/${appConfig.appId}/users/${userId}/${collectionName}`;
}

export function getCollection(collectionName: string, userId: string): CollectionReference<DocumentData> | null {
  if (!db || !userId) {
    console.warn('Database or User ID not available');
    return null;
  }

  const path = getCollectionPath(collectionName, userId);
  return collection(db, path);
}

// Add document helper
export async function addDocument(collectionName: string, userId: string, data: any) {
  const coll = getCollection(collectionName, userId);
  if (!coll) {
    throw new Error('Database not available');
  }

  const docData = {
    ...data,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return addDoc(coll, docData);
}

// Real-time listener helper
export function subscribeToCollection(
  collectionName: string, 
  userId: string, 
  callback: (data: any[]) => void
) {
  const coll = getCollection(collectionName, userId);
  if (!coll) {
    callback([]);
    return () => {};
  }

  return onSnapshot(query(coll), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
    callback(data);
  });
}

// Utility functions for calculations
export function calculateCommission(amount: number): number {
  return amount * appConfig.commissionRate;
}

export function getStockStatus(quantity: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
  if (quantity === 0) return 'Out of Stock';
  if (quantity <= appConfig.lowStockThreshold) return 'Low Stock';
  return 'In Stock';
}