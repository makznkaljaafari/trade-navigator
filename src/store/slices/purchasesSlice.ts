import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, PurchaseInvoice, PurchaseItem } from '../types';
import { userId } from '../helpers';

export const createPurchasesSlice: SliceCreator<{
  addPurchaseInvoice: (inv: Partial<PurchaseInvoice>) => Promise<string | null>;
  updatePurchaseInvoice: (id: string, d: Partial<PurchaseInvoice>) => Promise<void>;
  deletePurchaseInvoice: (id: string) => Promise<void>;
  addPurchaseItem: (invoiceId: string, item: Partial<PurchaseItem>) => Promise<void>;
  updatePurchaseItem: (id: string, field: string, value: string | number) => Promise<void>;
  deletePurchaseItem: (id: string) => Promise<void>;
}> = (set, get) => ({
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
});
