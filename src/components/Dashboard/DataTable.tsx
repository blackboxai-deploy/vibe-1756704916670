'use client';

import React, { useState, useMemo } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface TableColumn {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  searchFields: string[];
  searchPlaceholder?: string;
  onAdd?: () => void;
  addButtonText?: string;
  isLoading?: boolean;
}

export default function DataTable({
  data,
  columns,
  searchFields,
  searchPlaceholder = "Search...",
  onAdd,
  addButtonText = "Add New",
  isLoading = false
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(lowerCaseSearch);
      });
    });
  }, [data, searchFields, searchTerm]);

  const renderCellValue = (column: TableColumn, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }

    // Default rendering based on column key
    if (column.key === 'status') {
      const badgeVariant = 
        value?.toLowerCase().includes('completed') || value?.toLowerCase().includes('in stock') ? 'default' :
        value?.toLowerCase().includes('low') || value?.toLowerCase().includes('pending') ? 'secondary' :
        value?.toLowerCase().includes('out') ? 'destructive' : 'outline';
      
      return (
        <Badge variant={badgeVariant}>
          {value}
        </Badge>
      );
    }

    if (column.key === 'amount' || column.key === 'totalCommissions') {
      return `$${parseFloat(value || 0).toFixed(2)}`;
    }

    if (column.key === 'preview' && row.hexCode) {
      return (
        <div 
          className="w-12 h-12 rounded-lg border border-gray-300"
          style={{ backgroundColor: row.hexCode }}
          title={row.hexCode}
        />
      );
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return value || '-';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((_, i) => (
                  <TableHead key={i}>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(3)].map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-gray-100 rounded w-full animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {onAdd && (
          <Button onClick={onAdd} className="bg-red-600 hover:bg-red-700">
            {addButtonText}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key} className="whitespace-nowrap">
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                    No data available.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((row, index) => (
                  <TableRow key={row.id || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="whitespace-nowrap">
                        {renderCellValue(column, row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}