import {
  LayoutDashboard, Plane, Users, Package, FileText, Ship,
  Warehouse, ShoppingCart, Receipt, DollarSign, Settings, RefreshCw, UserCircle
} from 'lucide-react';

export const navGroups = [
  {
    label: 'الرئيسية',
    items: [
      { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
      { path: '/trips', label: 'الرحلات', icon: Plane },
    ],
  },
  {
    label: 'المشتريات',
    items: [
      { path: '/suppliers', label: 'الموردين', icon: Users },
      { path: '/products', label: 'المنتجات', icon: Package },
      { path: '/quotations', label: 'عروض الأسعار', icon: FileText },
      { path: '/purchases', label: 'فواتير الشراء', icon: ShoppingCart },
    ],
  },
  {
    label: 'اللوجستيات والمخزون',
    items: [
      { path: '/shipping', label: 'الشحنات', icon: Ship },
      { path: '/inventory', label: 'المخزون', icon: Warehouse },
    ],
  },
  {
    label: 'المبيعات والمالية',
    items: [
      { path: '/customers', label: 'العملاء', icon: UserCircle },
      { path: '/sales', label: 'فواتير البيع', icon: Receipt },
      { path: '/expenses', label: 'المصروفات', icon: DollarSign },
      { path: '/currency', label: 'محول العملات', icon: RefreshCw },
      { path: '/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
];

export const allNavItems = navGroups.flatMap(g => g.items);

export const bottomNavItems = [
  allNavItems[0], // Dashboard
  allNavItems[2], // Suppliers
  allNavItems[3], // Products
  allNavItems[6], // Shipping
  allNavItems[7], // Inventory
];
