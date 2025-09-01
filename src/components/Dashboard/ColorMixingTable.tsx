'use client';

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import DataTable from './DataTable';
import DataModal from '../Modals/DataModal';
import { FormField } from '../../lib/types';

const mixingColumns = [
  { key: 'mixName', label: 'Mix Name' },
  { key: 'hexCode', label: 'Hex Code' },
  { key: 'baseColors', label: 'Base Colors' },
  { key: 'ratios', label: 'Ratios' },
  { key: 'quantity', label: 'Quantity (L)' },
  { key: 'preview', label: 'Preview' }
];

export default function ColorMixingTable() {
  const { mixing, addMixing, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mixingFields: FormField[] = [
    {
      label: 'Mix Name',
      name: 'mixName',
      type: 'text',
      placeholder: 'e.g., Navy Blue Special',
      required: true
    },
    {
      label: 'Hex Code',
      name: 'hexCode',
      type: 'text',
      placeholder: 'e.g., #000080',
      required: true
    },
    {
      label: 'Base Colors',
      name: 'baseColors',
      type: 'text',
      placeholder: 'e.g., Blue, Black, White',
      required: true
    },
    {
      label: 'Mixing Ratios',
      name: 'ratios',
      type: 'text',
      placeholder: 'e.g., 50, 40, 10',
      required: true
    },
    {
      label: 'Quantity (liters)',
      name: 'quantity',
      type: 'number',
      placeholder: 'e.g., 2.5',
      required: true
    }
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addMixing(data);
    } catch (error) {
      console.error('Error adding color mix:', error);
      alert('Failed to add color mix. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={mixing}
        columns={mixingColumns}
        searchFields={['mixName', 'hexCode', 'baseColors']}
        searchPlaceholder="Search color mixes..."
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Log New Mix"
        isLoading={isLoading}
      />

      <DataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log New Color Mix"
        fields={mixingFields}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}