'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import DataTable from './DataTable';
import DataModal from '../Modals/DataModal';
import { FormField, Stock } from '../../lib/types';
import { getStockStatus } from '../../lib/firebase';

const stockColumns = [
  { key: 'productName', label: 'Product Name' },
  { key: 'color', label: 'Color' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'status', label: 'Status' }
];

export default function StockTable() {
  const { stock, addStock, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add status to stock items
  const stockWithStatus = useMemo(() => {
    return stock.map((item: Stock) => ({
      ...item,
      status: getStockStatus(item.quantity)
    }));
  }, [stock]);

  const stockFields: FormField[] = [
    {
      label: 'Product Name',
      name: 'productName',
      type: 'text',
      placeholder: 'e.g., Premium Enamel',
      required: true
    },
    {
      label: 'Color',
      name: 'color',
      type: 'text',
      placeholder: 'e.g., Crimson Red',
      required: true
    },
    {
      label: 'Quantity',
      name: 'quantity',
      type: 'number',
      placeholder: 'Enter number of units',
      required: true
    }
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addStock(data);
    } catch (error) {
      console.error('Error adding stock:', error);
      alert('Failed to add stock item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={stockWithStatus}
        columns={stockColumns}
        searchFields={['productName', 'color', 'status']}
        searchPlaceholder="Search stock..."
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Add New Stock"
        isLoading={isLoading}
      />

      <DataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Stock Item"
        fields={stockFields}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}