'use client';

import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/button';
// Simple toast alternative
const toast = {
  success: (message: string) => alert(message),
  error: (message: string) => alert(message)
};

interface HeaderProps {
  onToggleSidebar: () => void;
}

const tabTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  customers: 'Customers',
  painters: 'Painters',
  stock: 'Stock',
  mixing: 'Color Mixing',
  reports: 'Reports'
};

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { userId } = useFirebase();
  const { currentTab } = useApp();
  const [copying, setCopying] = useState(false);

  const copyUserId = async () => {
    if (!userId || userId === 'Loading...' || userId === 'N/A (No DB)') {
      toast.error('No user ID to copy.');
      return;
    }

    setCopying(true);
    try {
      await navigator.clipboard.writeText(userId);
      toast.success('User ID copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy user ID.');
    } finally {
      setCopying(false);
    }
  };

  const displayUserId = userId || 'Loading...';
  const currentTitle = tabTitles[currentTab] || 'Dashboard';

  return (
    <header className="flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* Left side - Title and mobile menu */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden"
          onClick={onToggleSidebar}
        >
          <span className="text-lg">☰</span>
        </Button>
        <h1 className="text-2xl font-bold text-red-600">
          {currentTitle}
        </h1>
      </div>

      {/* Right side - User info */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Your ID: <span className="font-mono font-semibold">{displayUserId}</span>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyUserId}
          disabled={copying || !userId}
          className="text-blue-600 hover:text-blue-700 p-1"
          title="Copy ID"
        >
          {copying ? (
            <span className="text-sm">⏳</span>
          ) : (
            <span className="text-sm">📋</span>
          )}
        </Button>
      </div>
    </header>
  );
}