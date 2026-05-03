import { create } from 'zustand';
import { AppState } from './types';
import { createCoreSlice } from './slices/coreSlice';
import { createTripsSlice } from './slices/tripsSlice';
import { createSuppliersSlice } from './slices/suppliersSlice';
import { createCustomersSlice } from './slices/customersSlice';
import { createProductsSlice } from './slices/productsSlice';
import { createExpensesSlice } from './slices/expensesSlice';
import { createShipmentsSlice } from './slices/shipmentsSlice';
import { createPurchasesSlice } from './slices/purchasesSlice';
import { createSalesSlice } from './slices/salesSlice';
import { createQuotationsSlice } from './slices/quotationsSlice';
import { createSettingsSlice } from './slices/settingsSlice';
import { createPaymentsSlice } from './slices/paymentsSlice';

// Re-export all types for backward compatibility with existing imports
export type {
  AppState,
  PurchaseItem, PurchaseInvoice,
  SalesItem, SalesInvoice,
  QuotationItem, Quotation,
  Customer, Payment, AppSettings,
} from './types';

export const useAppStore = create<AppState>((set, get) => ({
  // Initial data state
  trips: [],
  suppliers: [],
  customers: [],
  products: [],
  shipments: [],
  expenses: [],
  inventory: [],
  purchaseInvoices: [],
  salesInvoices: [],
  quotations: [],
  payments: [],
  settings: null,
  loading: false,
  initialized: false,

  // Compose all slices
  ...createCoreSlice(set as any, get),
  ...createTripsSlice(set as any, get),
  ...createSuppliersSlice(set as any, get),
  ...createCustomersSlice(set as any, get),
  ...createProductsSlice(set as any, get),
  ...createExpensesSlice(set as any, get),
  ...createShipmentsSlice(set as any, get),
  ...createPurchasesSlice(set as any, get),
  ...createSalesSlice(set as any, get),
  ...createQuotationsSlice(set as any, get),
  ...createSettingsSlice(set as any, get),
  ...createPaymentsSlice(set as any, get),
}));
