// TypeScript interfaces for Navkar's Paints application

export interface Order {
  id?: string;
  orderId: string;
  date: string;
  customerName: string;
  painterName: string;
  amount: number;
  status: 'Pending' | 'Mixing' | 'Completed';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  id?: string;
  name: string;
  contact: string;
  mobileNo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Painter {
  id?: string;
  name: string;
  contact: string;
  totalCommissions?: number; // Calculated field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Stock {
  id?: string;
  productName: string;
  color: string;
  quantity: number;
  status?: 'In Stock' | 'Low Stock' | 'Out of Stock'; // Calculated field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ColorMixing {
  id?: string;
  mixName: string;
  hexCode: string;
  baseColors: string[];
  ratios: number[];
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  totalOrders: number;
  totalCustomers: number;
  totalPainters: number;
  totalStock: number;
  lowStockCount: number;
  completedOrdersCount: number;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  type: 'orders' | 'customers' | 'painters' | 'stock' | 'mixing' | 'inventory';
}

export interface AppConfig {
  appId: string;
  firebaseConfig: any;
  commissionRate: number;
  lowStockThreshold: number;
}

export type TabType = 'dashboard' | 'orders' | 'customers' | 'painters' | 'stock' | 'mixing' | 'reports';

export interface FormField {
  label: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'tel' | 'email' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
}

export interface ModalConfig {
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
}