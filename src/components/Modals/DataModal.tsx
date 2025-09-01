'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormField } from '../../lib/types';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function DataModal({
  isOpen,
  onClose,
  title,
  fields,
  onSubmit,
  isLoading = false
}: DataModalProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Process form data
    const processedData: any = {};
    fields.forEach(field => {
      let value = formData[field.name];
      
      if (field.type === 'number') {
        value = parseFloat(value) || 0;
      } else if (field.name === 'baseColors' && typeof value === 'string') {
        value = value.split(',').map(c => c.trim()).filter(c => c);
      } else if (field.name === 'ratios' && typeof value === 'string') {
        value = value.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
      }
      
      processedData[field.name] = value;
    });

    onSubmit(processedData);
    setFormData({});
    setErrors({});
    onClose();
  };

  const handleClose = () => {
    setFormData({});
    setErrors({});
    onClose();
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`;
    const hasError = !!errors[field.name];

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={fieldId}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Select 
            value={formData[field.name] || ''} 
            onValueChange={(value) => handleInputChange(field.name, value)}
          >
            <SelectTrigger className={hasError ? 'border-red-500' : ''}>
              <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasError && (
            <p className="text-sm text-red-500">{errors[field.name]}</p>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={fieldId}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <Input
          id={fieldId}
          type={field.type}
          placeholder={field.placeholder}
          value={formData[field.name] || ''}
          onChange={(e) => handleInputChange(field.name, e.target.value)}
          className={hasError ? 'border-red-500' : ''}
        />
        {hasError && (
          <p className="text-sm text-red-500">{errors[field.name]}</p>
        )}
        {field.name === 'baseColors' && (
          <p className="text-xs text-gray-500">Separate colors with commas</p>
        )}
        {field.name === 'ratios' && (
          <p className="text-xs text-gray-500">Separate ratios with commas (e.g., 50, 40, 10)</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(renderField)}
          
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}