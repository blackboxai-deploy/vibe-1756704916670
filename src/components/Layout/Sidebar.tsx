'use client';

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TabType } from '../../lib/types';
import { cn } from '../../lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: TabType;
  label: string;
  icon: string;
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'orders', label: 'Orders', icon: '📋' },
  { id: 'customers', label: 'Customers', icon: '👥' },
  { id: 'painters', label: 'Painters', icon: '🎨' },
  { id: 'stock', label: 'Stock', icon: '📦' },
  { id: 'mixing', label: 'Color Mixing', icon: '🎨' },
  { id: 'reports', label: 'Reports', icon: '📈' }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentTab, setCurrentTab } = useApp();

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-slate-800 text-white transform transition-transform duration-300 z-50",
          "md:translate-x-0 md:static md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-red-400">
              Navkar's Paints
            </h2>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  "hover:bg-slate-700",
                  currentTab === item.id 
                    ? "bg-slate-700 text-red-400 border-l-4 border-red-400" 
                    : "text-gray-300"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}