'use client';

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import DataTable from './DataTable';
import DataModal from '../Modals/DataModal';
import { FormField } from '../../lib/types';

const orderColumns = [
  { key: 'orderId', label: 'Order ID' },
  { key: 'date', label: 'Date' },
  { key: 'customerName', label: 'Customer' },
  { key: 'painterName', label: 'Painter' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' }
];

export default function OrdersTable() {
  const { orders, painters, addOrder, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const painterOptions = painters.map(painter => ({
    label: painter.name,
    value: painter.name
  }));

  const orderFields: FormField[] = [
    {
      label: 'Order ID',
      name: 'orderId',
      type: 'text',
      placeholder: 'e.g., ORD-2024-001',
      required: true
    },
    {
      label: 'Date',
      name: 'date',
      type: 'date',
      required: true
    },
    {
      label: 'Customer Name',
      name: 'customerName',
      type: 'text',
      placeholder: 'Enter customer name',
      required: true
    },
    {
      label: 'Painter Name',
      name: 'painterName',
      type: 'select',
      required: true,
      options: [
        { label: 'Select Painter', value: '' },
        ...painterOptions
      ]
    },
    {
      label: 'Amount ($)',
      name: 'amount',
      type: 'number',
      placeholder: 'Enter order amount',
      required: true
    },
    {
      label: 'Status',
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'Pending' },
        { label: 'Mixing', value: 'Mixing' },
        { label: 'Completed', value: 'Completed' }
      ]
    }
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addOrder(data);
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={orders}
        columns={orderColumns}
        searchFields={['orderId', 'date', 'customerName', 'painterName', 'status']}
        searchPlaceholder="Search orders..."
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Add New Order"
        isLoading={isLoading}
      />

      <DataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Order"
        fields={orderFields}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}