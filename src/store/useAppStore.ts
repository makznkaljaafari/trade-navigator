import { create } from 'zustand';
import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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

interface AppState {
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

const userId = async () => (await supabase.auth.getUser()).data.user?.id;

const mapProduct = (p: any): Product => ({
  ...p,
  quantity: (p.quantity_purchased || 0) - (p.quantity_sold || 0),
  purchase_price: Number(p.purchase_price) || 0,
  sale_price: Number(p.sale_price) || 0,
});

const mapInventory = (p: any): InventoryItem => ({
  id: p.id,
  product_name: p.name,
  oem_number: p.oem_number || '',
  brand: p.brand || '',
  quantity_purchased: p.quantity_purchased || 0,
  quantity_sold: p.quantity_sold || 0,
  quantity_available: (p.quantity_purchased || 0) - (p.quantity_sold || 0),
  purchase_price: Number(p.purchase_price) || 0,
  sale_price: Number(p.sale_price) || 0,
});

export const useAppStore = create<AppState>((set, get) => ({
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

  reset: () => set({
    trips: [], suppliers: [], customers: [], products: [], shipments: [],
    expenses: [], inventory: [], purchaseInvoices: [], salesInvoices: [],
    quotations: [], payments: [], settings: null, initialized: false,
  }),

  loadAll: async () => {
    set({ loading: true });
    const [trips, suppliers, customers, products, shipments, expenses, pInvoices, pItems, sInvoices, sItems, quotations, qItems, payments, settings] = await Promise.all([
      supabase.from('trips').select('*').order('created_at', { ascending: false }),
      supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('shipments').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
      supabase.from('purchase_invoices').select('*').order('date', { ascending: false }),
      supabase.from('purchase_items').select('*'),
      supabase.from('sales_invoices').select('*').order('date', { ascending: false }),
      supabase.from('sales_items').select('*'),
      supabase.from('quotations').select('*').order('date', { ascending: false }),
      supabase.from('quotation_items').select('*'),
      supabase.from('payments').select('*').order('date', { ascending: false }),
      supabase.from('settings').select('*').maybeSingle(),
    ]);

    const productsData = (products.data || []) as any[];
    const groupBy = <T extends { invoice_id?: string; quotation_id?: string }>(items: T[], key: 'invoice_id' | 'quotation_id') => {
      const map: Record<string, T[]> = {};
      items.forEach(it => {
        const k = (it as any)[key] as string;
        if (!k) return;
        (map[k] ||= []).push(it);
      });
      return map;
    };

    const pItemsByInv = groupBy((pItems.data || []) as any[], 'invoice_id');
    const sItemsByInv = groupBy((sItems.data || []) as any[], 'invoice_id');
    const qItemsByQ = groupBy((qItems.data || []) as any[], 'quotation_id');

    const purchaseInvoices: PurchaseInvoice[] = ((pInvoices.data || []) as any[]).map(inv => ({
      ...inv,
      paid_amount: Number(inv.paid_amount) || 0,
      items: (pItemsByInv[inv.id] || []).map((it: any) => ({
        ...it,
        purchase_price: Number(it.purchase_price) || 0,
        sale_price: Number(it.sale_price) || 0,
      })),
    }));

    const salesInvoices: SalesInvoice[] = ((sInvoices.data || []) as any[]).map(inv => ({
      ...inv,
      paid_amount: Number(inv.paid_amount) || 0,
      items: (sItemsByInv[inv.id] || []).map((it: any) => ({
        ...it,
        sale_price: Number(it.sale_price) || 0,
      })),
    }));

    const quotationsList: Quotation[] = ((quotations.data || []) as any[]).map(q => ({
      ...q,
      items: (qItemsByQ[q.id] || []).map((it: any) => ({
        ...it,
        purchase_price: Number(it.purchase_price) || 0,
      })),
    }));

    const s: any = settings.data;
    set({
      trips: (trips.data || []) as any,
      suppliers: (suppliers.data || []) as any,
      customers: ((customers.data || []) as any[]).map(c => ({ ...c, balance: Number(c.balance) || 0 })),
      products: productsData.map(mapProduct),
      shipments: ((shipments.data || []) as any[]).map(sh => ({ ...sh, shipping_cost: Number(sh.shipping_cost) || 0, weight: Number(sh.weight) || 0 })),
      expenses: ((expenses.data || []) as any[]).map(e => ({ ...e, amount: Number(e.amount) })),
      inventory: productsData.map(mapInventory),
      purchaseInvoices,
      salesInvoices,
      quotations: quotationsList,
      settings: s ? {
        ...s,
        rate_cny_usd: Number(s.rate_cny_usd),
        rate_cny_sar: Number(s.rate_cny_sar),
        rate_usd_sar: Number(s.rate_usd_sar),
      } : null,
      loading: false,
      initialized: true,
    });
  },

  // ============ Trips ============
  addTrip: async (trip) => {
    const uid = await userId(); if (!uid) return;
    const { data } = await supabase.from('trips').insert({ ...trip, user_id: uid }).select().single();
    if (data) set(s => ({ trips: [data as any, ...s.trips] }));
  },
  updateTrip: async (id, data) => {
    const { data: upd } = await supabase.from('trips').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ trips: s.trips.map(t => t.id === id ? upd as any : t) }));
  },
  deleteTrip: async (id) => {
    await supabase.from('trips').delete().eq('id', id);
    set(s => ({ trips: s.trips.filter(t => t.id !== id) }));
  },

  // ============ Suppliers ============
  addSupplier: async (supplier) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = { ...supplier, user_id: uid };
    if (!payload.trip_id) delete payload.trip_id;
    const { data } = await supabase.from('suppliers').insert(payload).select().single();
    if (data) set(s => ({ suppliers: [data as any, ...s.suppliers] }));
  },
  updateSupplier: async (id, data) => {
    const { data: upd } = await supabase.from('suppliers').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ suppliers: s.suppliers.map(t => t.id === id ? upd as any : t) }));
  },
  deleteSupplier: async (id) => {
    await supabase.from('suppliers').delete().eq('id', id);
    set(s => ({ suppliers: s.suppliers.filter(t => t.id !== id) }));
  },

  // ============ Customers ============
  addCustomer: async (customer) => {
    const uid = await userId(); if (!uid) return;
    const { data } = await supabase.from('customers').insert({ ...customer, user_id: uid }).select().single();
    if (data) set(s => ({ customers: [{ ...data, balance: Number(data.balance) || 0 } as any, ...s.customers] }));
  },
  updateCustomer: async (id, data) => {
    const { data: upd } = await supabase.from('customers').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ customers: s.customers.map(c => c.id === id ? { ...upd, balance: Number(upd.balance) } as any : c) }));
  },
  deleteCustomer: async (id) => {
    await supabase.from('customers').delete().eq('id', id);
    set(s => ({ customers: s.customers.filter(c => c.id !== id) }));
  },

  // ============ Products ============
  addProduct: async (product) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid,
      name: product.name || 'منتج جديد',
      oem_number: product.oem_number,
      brand: product.brand,
      size: product.size,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      quantity_purchased: product.quantity || 0,
      notes: product.notes,
      rating: product.rating,
      image_url: product.image_url,
    };
    const { data } = await supabase.from('products').insert(payload).select().single();
    if (data) {
      set(s => ({
        products: [mapProduct(data), ...s.products],
        inventory: [mapInventory(data), ...s.inventory],
      }));
    }
  },
  updateProductField: async (id, field, value) => {
    const map: Record<string, string> = { quantity: 'quantity_purchased' };
    const dbField = map[field] || field;
    const { data } = await supabase.from('products').update({ [dbField]: value } as any).eq('id', id).select().single();
    if (data) {
      set(s => ({
        products: s.products.map(x => x.id === id ? mapProduct(data) : x),
        inventory: s.inventory.map(x => x.id === id ? mapInventory(data) : x),
      }));
    }
  },
  deleteProduct: async (id) => {
    await supabase.from('products').delete().eq('id', id);
    set(s => ({ products: s.products.filter(p => p.id !== id), inventory: s.inventory.filter(p => p.id !== id) }));
  },

  // ============ Expenses ============
  addExpense: async (expense) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = { ...expense, user_id: uid };
    if (!payload.trip_id) delete payload.trip_id;
    const { data } = await supabase.from('expenses').insert(payload).select().single();
    if (data) set(s => ({ expenses: [{ ...data, amount: Number(data.amount) } as any, ...s.expenses] }));
  },
  updateExpense: async (id, data) => {
    const { data: upd } = await supabase.from('expenses').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ expenses: s.expenses.map(e => e.id === id ? { ...upd, amount: Number(upd.amount) } as any : e) }));
  },
  deleteExpense: async (id) => {
    await supabase.from('expenses').delete().eq('id', id);
    set(s => ({ expenses: s.expenses.filter(e => e.id !== id) }));
  },

  // ============ Shipments ============
  addShipment: async (sh) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = { ...sh, user_id: uid };
    if (!payload.purchase_invoice_id) delete payload.purchase_invoice_id;
    const { data } = await supabase.from('shipments').insert(payload).select().single();
    if (data) set(s => ({ shipments: [{ ...data, shipping_cost: Number(data.shipping_cost), weight: Number(data.weight) } as any, ...s.shipments] }));
  },
  updateShipment: async (id, data) => {
    const { data: upd } = await supabase.from('shipments').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ shipments: s.shipments.map(sh => sh.id === id ? { ...upd, shipping_cost: Number(upd.shipping_cost), weight: Number(upd.weight) } as any : sh) }));
  },
  deleteShipment: async (id) => {
    await supabase.from('shipments').delete().eq('id', id);
    set(s => ({ shipments: s.shipments.filter(sh => sh.id !== id) }));
  },

  // ============ Purchase Invoices ============
  addPurchaseInvoice: async (inv) => {
    const uid = await userId(); if (!uid) return null;
    const num = `INV-${new Date().getFullYear()}-${String(get().purchaseInvoices.length + 1).padStart(3, '0')}`;
    const payload: any = {
      user_id: uid,
      invoice_number: inv.invoice_number || num,
      supplier_id: inv.supplier_id || null,
      trip_id: inv.trip_id || null,
      date: inv.date || new Date().toISOString().split('T')[0],
      currency: inv.currency || 'CNY',
      paid_amount: inv.paid_amount || 0,
      notes: inv.notes,
    };
    const { data } = await supabase.from('purchase_invoices').insert(payload).select().single();
    if (data) {
      set(s => ({ purchaseInvoices: [{ ...data, paid_amount: Number(data.paid_amount), items: [] } as any, ...s.purchaseInvoices] }));
      return data.id;
    }
    return null;
  },
  updatePurchaseInvoice: async (id, data) => {
    const { data: upd } = await supabase.from('purchase_invoices').update({ ...data, items: undefined } as any).eq('id', id).select().single();
    if (upd) set(s => ({
      purchaseInvoices: s.purchaseInvoices.map(inv => inv.id === id ? { ...inv, ...upd, paid_amount: Number(upd.paid_amount) } as any : inv),
    }));
  },
  deletePurchaseInvoice: async (id) => {
    await supabase.from('purchase_items').delete().eq('invoice_id', id);
    await supabase.from('purchase_invoices').delete().eq('id', id);
    set(s => ({ purchaseInvoices: s.purchaseInvoices.filter(inv => inv.id !== id) }));
    get().loadAll();
  },
  addPurchaseItem: async (invoiceId, item) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid, invoice_id: invoiceId,
      product_id: item.product_id || null,
      product_name: item.product_name || '',
      oem_number: item.oem_number, brand: item.brand, size: item.size,
      quantity: item.quantity || 0,
      purchase_price: item.purchase_price || 0,
      sale_price: item.sale_price || 0,
      notes: item.notes,
    };
    const { data } = await supabase.from('purchase_items').insert(payload).select().single();
    if (data) {
      set(s => ({
        purchaseInvoices: s.purchaseInvoices.map(inv => inv.id === invoiceId
          ? { ...inv, items: [...(inv.items || []), { ...data, purchase_price: Number(data.purchase_price), sale_price: Number(data.sale_price) } as any] }
          : inv),
      }));
      get().loadAll();
    }
  },
  updatePurchaseItem: async (id, field, value) => {
    const { data } = await supabase.from('purchase_items').update({ [field]: value } as any).eq('id', id).select().single();
    if (data) {
      set(s => ({
        purchaseInvoices: s.purchaseInvoices.map(inv => ({
          ...inv,
          items: inv.items?.map(it => it.id === id ? { ...data, purchase_price: Number(data.purchase_price), sale_price: Number(data.sale_price) } as any : it),
        })),
      }));
      if (field === 'quantity') get().loadAll();
    }
  },
  deletePurchaseItem: async (id) => {
    await supabase.from('purchase_items').delete().eq('id', id);
    set(s => ({
      purchaseInvoices: s.purchaseInvoices.map(inv => ({ ...inv, items: inv.items?.filter(it => it.id !== id) })),
    }));
    get().loadAll();
  },

  // ============ Sales Invoices ============
  addSalesInvoice: async (inv) => {
    const uid = await userId(); if (!uid) return null;
    const num = `SALE-${new Date().getFullYear()}-${String(get().salesInvoices.length + 1).padStart(3, '0')}`;
    const payload: any = {
      user_id: uid,
      invoice_number: inv.invoice_number || num,
      customer_id: inv.customer_id || null,
      customer_name: inv.customer_name || 'عميل جديد',
      date: inv.date || new Date().toISOString().split('T')[0],
      currency: inv.currency || 'SAR',
      paid_amount: inv.paid_amount || 0,
      notes: inv.notes,
    };
    const { data } = await supabase.from('sales_invoices').insert(payload).select().single();
    if (data) {
      set(s => ({ salesInvoices: [{ ...data, paid_amount: Number(data.paid_amount), items: [] } as any, ...s.salesInvoices] }));
      return data.id;
    }
    return null;
  },
  updateSalesInvoice: async (id, data) => {
    const { data: upd } = await supabase.from('sales_invoices').update({ ...data, items: undefined } as any).eq('id', id).select().single();
    if (upd) set(s => ({
      salesInvoices: s.salesInvoices.map(inv => inv.id === id ? { ...inv, ...upd, paid_amount: Number(upd.paid_amount) } as any : inv),
    }));
  },
  deleteSalesInvoice: async (id) => {
    await supabase.from('sales_items').delete().eq('invoice_id', id);
    await supabase.from('sales_invoices').delete().eq('id', id);
    set(s => ({ salesInvoices: s.salesInvoices.filter(inv => inv.id !== id) }));
    get().loadAll();
  },
  addSalesItem: async (invoiceId, item) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid, invoice_id: invoiceId,
      product_id: item.product_id || null,
      product_name: item.product_name || '',
      oem_number: item.oem_number, brand: item.brand, size: item.size,
      quantity: item.quantity || 0,
      sale_price: item.sale_price || 0,
      notes: item.notes,
    };
    const { data } = await supabase.from('sales_items').insert(payload).select().single();
    if (data) {
      set(s => ({
        salesInvoices: s.salesInvoices.map(inv => inv.id === invoiceId
          ? { ...inv, items: [...(inv.items || []), { ...data, sale_price: Number(data.sale_price) } as any] }
          : inv),
      }));
      get().loadAll();
    }
  },
  updateSalesItem: async (id, field, value) => {
    const { data } = await supabase.from('sales_items').update({ [field]: value } as any).eq('id', id).select().single();
    if (data) {
      set(s => ({
        salesInvoices: s.salesInvoices.map(inv => ({
          ...inv,
          items: inv.items?.map(it => it.id === id ? { ...data, sale_price: Number(data.sale_price) } as any : it),
        })),
      }));
      if (field === 'quantity') get().loadAll();
    }
  },
  deleteSalesItem: async (id) => {
    await supabase.from('sales_items').delete().eq('id', id);
    set(s => ({
      salesInvoices: s.salesInvoices.map(inv => ({ ...inv, items: inv.items?.filter(it => it.id !== id) })),
    }));
    get().loadAll();
  },

  // ============ Quotations ============
  addQuotation: async (q) => {
    const uid = await userId(); if (!uid) return null;
    const payload: any = {
      user_id: uid,
      supplier_id: q.supplier_id || null,
      trip_id: q.trip_id || null,
      date: q.date || new Date().toISOString().split('T')[0],
      notes: q.notes,
    };
    const { data } = await supabase.from('quotations').insert(payload).select().single();
    if (data) {
      set(s => ({ quotations: [{ ...data, items: [] } as any, ...s.quotations] }));
      return data.id;
    }
    return null;
  },
  updateQuotation: async (id, data) => {
    const { data: upd } = await supabase.from('quotations').update({ ...data, items: undefined } as any).eq('id', id).select().single();
    if (upd) set(s => ({ quotations: s.quotations.map(q => q.id === id ? { ...q, ...upd } as any : q) }));
  },
  deleteQuotation: async (id) => {
    await supabase.from('quotation_items').delete().eq('quotation_id', id);
    await supabase.from('quotations').delete().eq('id', id);
    set(s => ({ quotations: s.quotations.filter(q => q.id !== id) }));
  },
  addQuotationItem: async (quotationId, item) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid, quotation_id: quotationId,
      product_name: item.product_name || '',
      oem_number: item.oem_number, brand: item.brand, size: item.size,
      quantity: item.quantity || 0,
      purchase_price: item.purchase_price || 0,
      notes: item.notes,
    };
    const { data } = await supabase.from('quotation_items').insert(payload).select().single();
    if (data) {
      set(s => ({
        quotations: s.quotations.map(q => q.id === quotationId
          ? { ...q, items: [...(q.items || []), { ...data, purchase_price: Number(data.purchase_price) } as any] }
          : q),
      }));
    }
  },
  updateQuotationItem: async (id, field, value) => {
    const { data } = await supabase.from('quotation_items').update({ [field]: value } as any).eq('id', id).select().single();
    if (data) {
      set(s => ({
        quotations: s.quotations.map(q => ({
          ...q,
          items: q.items?.map(it => it.id === id ? { ...data, purchase_price: Number(data.purchase_price) } as any : it),
        })),
      }));
    }
  },
  deleteQuotationItem: async (id) => {
    await supabase.from('quotation_items').delete().eq('id', id);
    set(s => ({
      quotations: s.quotations.map(q => ({ ...q, items: q.items?.filter(it => it.id !== id) })),
    }));
  },

  // ============ Settings ============
  saveSettings: async (data) => {
    const uid = await userId(); if (!uid) return;
    const { data: upd } = await supabase
      .from('settings')
      .upsert({ user_id: uid, ...data }, { onConflict: 'user_id' })
      .select()
      .single();
    if (upd) set({
      settings: {
        ...upd,
        rate_cny_usd: Number(upd.rate_cny_usd),
        rate_cny_sar: Number(upd.rate_cny_sar),
        rate_usd_sar: Number(upd.rate_usd_sar),
      } as any,
    });
  },
}));
