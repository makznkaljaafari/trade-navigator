import { create } from 'zustand';
import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface AppState {
  trips: Trip[];
  suppliers: Supplier[];
  products: Product[];
  shipments: Shipment[];
  expenses: Expense[];
  inventory: InventoryItem[];
  loading: boolean;
  initialized: boolean;

  loadAll: () => Promise<void>;
  reset: () => void;

  // Trip actions
  addTrip: (trip: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, data: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;

  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProductField: (id: string, field: string, value: string | number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}

const userId = async () => (await supabase.auth.getUser()).data.user?.id;

export const useAppStore = create<AppState>((set, get) => ({
  trips: [],
  suppliers: [],
  products: [],
  shipments: [],
  expenses: [],
  inventory: [],
  loading: false,
  initialized: false,

  reset: () => set({ trips: [], suppliers: [], products: [], shipments: [], expenses: [], inventory: [], initialized: false }),

  loadAll: async () => {
    set({ loading: true });
    const [trips, suppliers, products, shipments, expenses] = await Promise.all([
      supabase.from('trips').select('*').order('created_at', { ascending: false }),
      supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('shipments').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('date', { ascending: false }),
    ]);

    const productsData = (products.data || []) as any[];
    const inventory: InventoryItem[] = productsData.map(p => ({
      id: p.id,
      product_name: p.name,
      oem_number: p.oem_number || '',
      brand: p.brand || '',
      quantity_purchased: p.quantity_purchased || 0,
      quantity_sold: p.quantity_sold || 0,
      quantity_available: (p.quantity_purchased || 0) - (p.quantity_sold || 0),
      purchase_price: Number(p.purchase_price) || 0,
      sale_price: Number(p.sale_price) || 0,
    }));

    set({
      trips: (trips.data || []) as any,
      suppliers: (suppliers.data || []) as any,
      products: productsData.map(p => ({
        ...p,
        quantity: p.quantity_purchased - p.quantity_sold,
        purchase_price: Number(p.purchase_price),
        sale_price: Number(p.sale_price),
      })) as any,
      shipments: (shipments.data || []) as any,
      expenses: (expenses.data || []).map(e => ({ ...e, amount: Number(e.amount) })) as any,
      inventory,
      loading: false,
      initialized: true,
    });
  },

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

  addProduct: async (product) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid,
      name: product.name,
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
      const p: any = { ...data, quantity: data.quantity_purchased - data.quantity_sold, purchase_price: Number(data.purchase_price), sale_price: Number(data.sale_price) };
      set(s => ({ products: [p, ...s.products] }));
      get().loadAll();
    }
  },
  updateProductField: async (id, field, value) => {
    const map: Record<string, string> = { quantity: 'quantity_purchased' };
    const dbField = map[field] || field;
    const updatePayload: any = { [dbField]: value };
    const { data } = await supabase.from('products').update(updatePayload).eq('id', id).select().single();
    if (data) {
      const p: any = { ...data, quantity: data.quantity_purchased - data.quantity_sold, purchase_price: Number(data.purchase_price), sale_price: Number(data.sale_price) };
      set(s => ({
        products: s.products.map(x => x.id === id ? p : x),
        inventory: s.inventory.map(x => x.id === id ? { ...x, quantity_purchased: data.quantity_purchased, quantity_sold: data.quantity_sold, quantity_available: data.quantity_purchased - data.quantity_sold, purchase_price: Number(data.purchase_price), sale_price: Number(data.sale_price) } : x),
      }));
    }
  },
  deleteProduct: async (id) => {
    await supabase.from('products').delete().eq('id', id);
    set(s => ({ products: s.products.filter(p => p.id !== id), inventory: s.inventory.filter(p => p.id !== id) }));
  },

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
}));
