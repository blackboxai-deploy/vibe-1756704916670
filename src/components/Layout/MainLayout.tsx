'use client';

import React, { useState } from 'react';
import { useFirebase } from '../../contexts/FirebaseContext';
import { useApp } from '../../contexts/AppContext';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardCards from '../Dashboard/DashboardCards';
import OrdersTable from '../Dashboard/OrdersTable';
import CustomersTable from '../Dashboard/CustomersTable';
import PaintersTable from '../Dashboard/PaintersTable';
import StockTable from '../Dashboard/StockTable';
import ColorMixingTable from '../Dashboard/ColorMixingTable';
import ReportsSection from '../Dashboard/ReportsSection';

export default function MainLayout() {
  const { isLoading: authLoading } = useFirebase();
  const { currentTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Navkar's Paints...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardCards />;
      case 'orders':
        return <OrdersTable />;
      case 'customers':
        return <CustomersTable />;
      case 'painters':
        return <PaintersTable />;
      case 'stock':
        return <StockTable />;
      case 'mixing':
        return <ColorMixingTable />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <DashboardCards />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 transition-all duration-300">
          <div className="p-6">
            <Header onToggleSidebar={toggleSidebar} />
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}