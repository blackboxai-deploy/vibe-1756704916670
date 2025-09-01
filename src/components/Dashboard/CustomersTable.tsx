'use client';

import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import DataTable from './DataTable';
import DataModal from '../Modals/DataModal';
import { FormField } from '../../lib/types';

const customerColumns = [
  { key: 'name', label: 'Name' },
  { key: 'contact', label: 'Contact' },
  { key: 'mobileNo', label: 'Mobile No.' }
];

export default function CustomersTable() {
  const { customers, addCustomer, isLoading } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerFields: FormField[] = [
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
      placeholder: 'Enter email or address',
      required: true
    },
    {
      label: 'Mobile No.',
      name: 'mobileNo',
      type: 'tel',
      placeholder: 'Enter mobile number',
      required: true
    }
  ];

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await addCustomer(data);
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DataTable
        data={customers}
        columns={customerColumns}
        searchFields={['name', 'contact', 'mobileNo']}
        searchPlaceholder="Search customers..."
        onAdd={() => setIsModalOpen(true)}
        addButtonText="Add New Customer"
        isLoading={isLoading}
      />

      <DataModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Customer"
        fields={customerFields}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </>
  );
}