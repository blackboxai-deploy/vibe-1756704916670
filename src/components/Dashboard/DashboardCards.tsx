'use client';

import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';

interface DashboardCardProps {
  title: string;
  value: number;
  className?: string;
  valueColor?: string;
}

function DashboardCard({ title, value, className, valueColor = "text-red-600" }: DashboardCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn("text-3xl font-bold", valueColor)}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardCards() {
  const { dashboardStats, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        title="Total Orders"
        value={dashboardStats.totalOrders}
      />
      
      <DashboardCard
        title="Total Customers"
        value={dashboardStats.totalCustomers}
      />
      
      <DashboardCard
        title="Total Painters"
        value={dashboardStats.totalPainters}
      />
      
      <DashboardCard
        title="Stock Items"
        value={dashboardStats.totalStock}
      />
      
      <DashboardCard
        title="Low Stock Alerts"
        value={dashboardStats.lowStockCount}
        className="bg-orange-50 border-l-4 border-orange-500"
        valueColor="text-orange-600"
      />
      
      <DashboardCard
        title="Completed Orders"
        value={dashboardStats.completedOrdersCount}
        className="bg-green-50 border-l-4 border-green-500"
        valueColor="text-green-600"
      />
    </div>
  );
}