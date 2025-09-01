'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import DataTable from './DataTable';

interface ReportCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

function ReportCard({ title, description, onClick }: ReportCardProps) {
  return (
    <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function ReportsSection() {
  const { orders, painters, stock, mixing, isLoading } = useApp();
  const [currentReport, setCurrentReport] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const reportConfigs = [
    {
      id: 'orders',
      title: 'Customer Orders Report',
      description: 'Generate a detailed report of all orders.',
      columns: [
        { key: 'orderId', label: 'Order ID' },
        { key: 'date', label: 'Date' },
        { key: 'customerName', label: 'Customer' },
        { key: 'painterName', label: 'Painter' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status' }
      ],
      data: orders as any[],
      searchFields: ['orderId', 'customerName', 'painterName', 'status']
    },
    {
      id: 'mixing',
      title: 'Color Mixing Report',
      description: 'See a history of all custom color mixes.',
      columns: [
        { key: 'mixName', label: 'Mix Name' },
        { key: 'hexCode', label: 'Hex Code' },
        { key: 'baseColors', label: 'Base Colors' },
        { key: 'ratios', label: 'Ratios' },
        { key: 'quantity', label: 'Quantity (L)' },
        { key: 'preview', label: 'Preview' }
      ],
      data: mixing as any[],
      searchFields: ['mixName', 'hexCode', 'baseColors']
    },
    {
      id: 'painters',
      title: 'Painter Commission Report',
      description: 'Track commissions and their assignments.',
      columns: [
        { key: 'name', label: 'Name' },
        { key: 'contact', label: 'Contact' },
        { key: 'totalCommissions', label: 'Total Commissions' }
      ],
      data: painters.map(painter => {
        const completedOrders = orders.filter(order => 
          order.painterName === painter.name && order.status === 'Completed'
        );
        const totalCommissions = completedOrders.reduce((sum, order) => 
          sum + (order.amount * 0.10), 0
        );
        return { ...painter, totalCommissions };
      }) as any[],
      searchFields: ['name', 'contact']
    },
    {
      id: 'inventory',
      title: 'Inventory Report',
      description: 'Detailed breakdown of all stock levels.',
      columns: [
        { key: 'productName', label: 'Product Name' },
        { key: 'color', label: 'Color' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'status', label: 'Status' }
      ],
      data: stock.map(item => ({
        ...item,
        status: item.quantity === 0 ? 'Out of Stock' :
                item.quantity <= 10 ? 'Low Stock' : 'In Stock'
      })) as any[],
      searchFields: ['productName', 'color', 'status']
    }
  ];

  const filteredReportData = useMemo(() => {
    if (!currentReport) return [];
    
    const config = reportConfigs.find(r => r.id === currentReport);
    if (!config) return [];

    let data = config.data;
    
    // Apply date filter if dates are set and data has date field
    if (startDate || endDate) {
      data = data.filter((item: any) => {
        if (!item.date) return true; // Include items without dates
        
        const itemDate = new Date(item.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        
        return (!start || itemDate >= start) && (!end || itemDate <= end);
      });
    }
    
    return data;
  }, [currentReport, startDate, endDate, reportConfigs]);

  const currentConfig = currentReport ? reportConfigs.find(r => r.id === currentReport) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleBackToReports = () => {
    setCurrentReport(null);
    setStartDate('');
    setEndDate('');
  };

  if (currentReport && currentConfig) {
    return (
      <div className="space-y-6">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold">{currentConfig.title}</h2>
          <Button onClick={handleBackToReports} variant="outline">
            Back to Reports
          </Button>
        </div>

        {/* Date Filters */}
        <div className="flex flex-wrap items-end gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="start-date">From:</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">To:</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={handlePrint} variant="outline">
            🖨️ Print
          </Button>
        </div>

        {/* Report Data */}
        <DataTable
          data={filteredReportData}
          columns={currentConfig.columns}
          searchFields={currentConfig.searchFields}
          searchPlaceholder={`Search ${currentConfig.title.toLowerCase()}...`}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportConfigs.map((report) => (
          <ReportCard
            key={report.id}
            title={report.title}
            description={report.description}
            onClick={() => setCurrentReport(report.id)}
          />
        ))}
      </div>
    </div>
  );
}