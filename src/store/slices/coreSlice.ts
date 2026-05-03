import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, PurchaseInvoice, SalesInvoice, Quotation } from '../types';
import { mapProduct, mapInventory, groupBy } from '../helpers';

export const createCoreSlice: SliceCreator<{
  loadAll: () => Promise<void>;
  reset: () => void;
}> = (set) => ({
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
      payments: ((payments.data || []) as any[]).map(p => ({ ...p, amount: Number(p.amount) || 0 })),
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
});
