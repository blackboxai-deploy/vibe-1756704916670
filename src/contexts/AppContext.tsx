'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useFirebase } from './FirebaseContext';
import { subscribeToCollection, addDocument, getStockStatus } from '../lib/firebase';
import { Order, Customer, Painter, Stock, ColorMixing, DashboardStats, TabType } from '../lib/types';

interface AppContextType {
  // Data
  orders: Order[];
  customers: Customer[];
  painters: Painter[];
  stock: Stock[];
  mixing: ColorMixing[];
  
  // UI State
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  
  // Dashboard stats
  dashboardStats: DashboardStats;
  
  // Operations
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  addPainter: (painter: Omit<Painter, 'id'>) => Promise<void>;
  addStock: (stock: Omit<Stock, 'id'>) => Promise<void>;
  addMixing: (mixing: Omit<ColorMixing, 'id'>) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { userId, isFirebaseAvailable } = useFirebase();
  
  // Data state
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [painters, setPainters] = useState<Painter[]>([]);
  const [stock, setStock] = useState<Stock[]>([]);
  const [mixing, setMixing] = useState<ColorMixing[]>([]);
  
  // UI state
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Setup real-time listeners when user is available
  useEffect(() => {
    if (!userId || !isFirebaseAvailable) {
      setIsLoading(false);
      return;
    }

    const unsubscribes: (() => void)[] = [];

    try {
      // Orders listener
      unsubscribes.push(
        subscribeToCollection('orders', userId, (data) => {
          setOrders(data as Order[]);
        })
      );

      // Customers listener
      unsubscribes.push(
        subscribeToCollection('customers', userId, (data) => {
          setCustomers(data as Customer[]);
        })
      );

      // Painters listener
      unsubscribes.push(
        subscribeToCollection('painters', userId, (data) => {
          setPainters(data as Painter[]);
        })
      );

      // Stock listener
      unsubscribes.push(
        subscribeToCollection('stock', userId, (data) => {
          setStock(data as Stock[]);
        })
      );

      // Mixing listener
      unsubscribes.push(
        subscribeToCollection('mixing', userId, (data) => {
          setMixing(data as ColorMixing[]);
        })
      );

      setIsLoading(false);
    } catch (err) {
      setError('Failed to initialize data listeners');
      setIsLoading(false);
    }

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [userId, isFirebaseAvailable]);

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = React.useMemo(() => {
    const completedOrders = orders.filter(o => o.status === 'Completed');
    const lowStockItems = stock.filter(item => {
      const status = getStockStatus(item.quantity);
      return status === 'Low Stock' || status === 'Out of Stock';
    });

    return {
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalPainters: painters.length,
      totalStock: stock.length,
      lowStockCount: lowStockItems.length,
      completedOrdersCount: completedOrders.length
    };
  }, [orders, customers, painters, stock]);

  // Data operations
  const addOrder = async (orderData: Omit<Order, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');
    await addDocument('orders', userId, orderData);
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');
    await addDocument('customers', userId, customerData);
  };

  const addPainter = async (painterData: Omit<Painter, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');
    await addDocument('painters', userId, painterData);
  };

  const addStock = async (stockData: Omit<Stock, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');
    await addDocument('stock', userId, stockData);
  };

  const addMixing = async (mixingData: Omit<ColorMixing, 'id'>) => {
    if (!userId) throw new Error('User not authenticated');
    await addDocument('mixing', userId, mixingData);
  };

  const contextValue: AppContextType = {
    orders,
    customers,
    painters,
    stock,
    mixing,
    currentTab,
    setCurrentTab,
    dashboardStats,
    addOrder,
    addCustomer,
    addPainter,
    addStock,
    addMixing,
    isLoading,
    error
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}