'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  initializeFirebase, 
  signInUser, 
  onAuthStateChange,
  getAppConfig
} from '../lib/firebase';
import { AppConfig } from '../lib/types';

// Define User type locally to avoid Firebase import issues
interface User {
  uid: string;
}

interface FirebaseContextType {
  user: User | null;
  userId: string | null;
  isLoading: boolean;
  appConfig: AppConfig;
  isFirebaseAvailable: boolean;
}

const FirebaseContext = createContext<FirebaseContextType>({
  user: null,
  userId: null,
  isLoading: true,
  appConfig: getAppConfig(),
  isFirebaseAvailable: false
});

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within FirebaseProvider');
  }
  return context;
}

interface FirebaseProviderProps {
  children: React.ReactNode;
  config?: Partial<AppConfig>;
}

export function FirebaseProvider({ children, config }: FirebaseProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);

  useEffect(() => {
    // Try to get config from window variables (for backward compatibility)
    const windowObj = typeof window !== 'undefined' ? window : {};
    const globalConfig = {
      appId: (windowObj as any).__app_id || config?.appId || 'navkar-paints-app',
      firebaseConfig: (windowObj as any).__firebase_config 
        ? JSON.parse((windowObj as any).__firebase_config) 
        : config?.firebaseConfig || {},
      commissionRate: config?.commissionRate || 0.10,
      lowStockThreshold: config?.lowStockThreshold || 10
    };

    // Initialize Firebase
    const { auth } = initializeFirebase(globalConfig);
    setIsFirebaseAvailable(!!auth);

    if (auth) {
      // Setup auth listener
      const unsubscribe = onAuthStateChange(async (authUser) => {
        if (authUser) {
          setUser(authUser);
        } else {
          // Try to sign in anonymously
          const newUser = await signInUser();
          setUser(newUser);
        }
        setIsLoading(false);
      });

      return unsubscribe;
    } else {
      // No Firebase available - set mock user ID
      setUser({
        uid: 'demo-user-' + Math.random().toString(36).substr(2, 9)
      } as User);
      setIsLoading(false);
    }
  }, [config]);

  const userId = user?.uid || null;
  const appConfig = getAppConfig();

  return (
    <FirebaseContext.Provider 
      value={{ 
        user, 
        userId, 
        isLoading, 
        appConfig, 
        isFirebaseAvailable 
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}