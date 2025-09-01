'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import DataTable from './DataTable';
import DataModal from '../Modals/DataModal';
import { FormField, Painter } from '../../lib/types';

const painterColumns = [
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'totalCommissions', label: 'Total Commissions' }
];

const COMMISSION_RATE = 0.10; // 10%

export default function PaintersTable() {
  const { painters, orders, addPainter, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate commissions for each painter
  const paintersWithCommissions = useMemo(() => {
    return painters.map((painter: Painter) => {
      const completedOrdersByPainter = orders.filter(order => 
        order.painterName === painter.name && order.status === 'Completed'
      );
      
      const totalCommissions = completedOrdersByPainter.reduce((sum, order) => 
        sum + (order.amount * COMMISSION_RATE), 0
      );

      return {
        ...painter,
        totalCommissions
      };
    });
  }, [painters, orders]);

  const painterFields: FormField[] = [
    {
      label: 'Name',
      name: 'name',
      type: 'text',
      placeholder: 'Enter full name',
      required: true
    },
    {
      label: 'Contact',
      name: 'contact',
      type: 'text',
      placeholder: 'Enter phone or email',
      required: true
    }
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addPainter(data);
    } catch (error) {
      console.error('Error adding painter:', error);
      alert('Failed to add painter. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={paintersWithCommissions}
        columns={painterColumns}
        searchFields={['name', 'contact']}
        searchPlaceholder="Search painters..."
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Add New Painter"
        isLoading={isLoading}
      />

      <DataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Painter"
        fields={painterFields}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}