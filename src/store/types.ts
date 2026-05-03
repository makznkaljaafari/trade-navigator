import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';

// ===== Invoice / Quotation types (DB-shaped) =====
export interface PurchaseItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  oem_number: string | null;
  brand: string | null;
  size: string | null;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  notes: string | null;
}

export interface PurchaseInvoice {
  id: string;
  invoice_number: string | null;
  supplier_id: string | null;
  trip_id: string | null;
  date: string;
  currency: string;
  paid_amount: number;
  notes: string | null;
  items?: PurchaseItem[];
}

export interface SalesItem {
  id: string;
  invoice_id: string;
  product_id: string | null;
  product_name: string;
  oem_number: string | null;
  brand: string | null;
  size: string | null;
  quantity: number;
  sale_price: number;
  notes: string | null;
}

export interface SalesInvoice {
  id: string;
  invoice_number: string | null;
  customer_id: string | null;
  customer_name: string | null;
  date: string;
  currency: string;
  paid_amount: number;
  notes: string | null;
  items?: SalesItem[];
}

export interface QuotationItem {
  id: string;
  quotation_id: string;
  product_name: string;
  oem_number: string | null;
  brand: string | null;
  size: string | null;
  quantity: number;
  purchase_price: number;
  notes: string | null;
}

export interface Quotation {
  id: string;
  supplier_id: string | null;
  trip_id: string | null;
  date: string;
  notes: string | null;
  items?: QuotationItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  city: string | null;
  category: string | null;
  balance: number;
  notes: string | null;
}

export interface Payment {
  id: string;
  payment_type: 'purchase' | 'sales';
  invoice_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  date: string;
  notes: string | null;
}

export interface AppSettings {
  user_id: string;
  company_name: string | null;
  company_address: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_logo_url: string | null;
  default_currency: string;
  rate_cny_usd: number;
  rate_cny_sar: number;
  rate_usd_sar: number;
  low_stock_threshold: number;
}

// ===== Aggregate state shape =====
export interface AppState {
  // Data
  trips: Trip[];
  suppliers: Supplier[];
  customers: Customer[];
  products: Product[];
  shipments: Shipment[];
  expenses: Expense[];
  inventory: InventoryItem[];
  purchaseInvoices: PurchaseInvoice[];
  salesInvoices: SalesInvoice[];
  quotations: Quotation[];
  payments: Payment[];
  settings: AppSettings | null;
  loading: boolean;
  initialized: boolean;

  // Core
  loadAll: () => Promise<void>;
  reset: () => void;

  // Trips
  addTrip: (t: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, d: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  // Suppliers
  addSupplier: (s: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, d: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Customers
  addCustomer: (c: Omit<Customer, 'id' | 'balance'> & { balance?: number }) => Promise<void>;
  updateCustomer: (id: string, d: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;

  // Products
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProductField: (id: string, field: string, value: string | number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Expenses
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, d: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Shipments
  addShipment: (s: Omit<Shipment, 'id'>) => Promise<void>;
  updateShipment: (id: string, d: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;

  // Purchase invoices
  addPurchaseInvoice: (inv: Partial<PurchaseInvoice>) => Promise<string | null>;
  updatePurchaseInvoice: (id: string, d: Partial<PurchaseInvoice>) => Promise<void>;
  deletePurchaseInvoice: (id: string) => Promise<void>;
  addPurchaseItem: (invoiceId: string, item: Partial<PurchaseItem>) => Promise<void>;
  updatePurchaseItem: (id: string, field: string, value: string | number) => Promise<void>;
  deletePurchaseItem: (id: string) => Promise<void>;

  // Sales invoices
  addSalesInvoice: (inv: Partial<SalesInvoice>) => Promise<string | null>;
  updateSalesInvoice: (id: string, d: Partial<SalesInvoice>) => Promise<void>;
  deleteSalesInvoice: (id: string) => Promise<void>;
  addSalesItem: (invoiceId: string, item: Partial<SalesItem>) => Promise<void>;
  updateSalesItem: (id: string, field: string, value: string | number) => Promise<void>;
  deleteSalesItem: (id: string) => Promise<void>;

  // Quotations
  addQuotation: (q: Partial<Quotation>) => Promise<string | null>;
  updateQuotation: (id: string, d: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  addQuotationItem: (quotationId: string, item: Partial<QuotationItem>) => Promise<void>;
  updateQuotationItem: (id: string, field: string, value: string | number) => Promise<void>;
  deleteQuotationItem: (id: string) => Promise<void>;

  // Settings
  saveSettings: (d: Partial<AppSettings>) => Promise<void>;

  // Payments
  addPayment: (p: Omit<Payment, 'id'>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}

export type SliceCreator<T> = (
  set: (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void,
  get: () => AppState,
) => T;
