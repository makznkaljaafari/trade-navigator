import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, SalesInvoice, SalesItem } from '../types';
import { userId } from '../helpers';

export const createSalesSlice: SliceCreator<{
  addSalesInvoice: (inv: Partial<SalesInvoice>) => Promise<string | null>;
  updateSalesInvoice: (id: string, d: Partial<SalesInvoice>) => Promise<void>;
  deleteSalesInvoice: (id: string) => Promise<void>;
  addSalesItem: (invoiceId: string, item: Partial<SalesItem>) => Promise<void>;
  updateSalesItem: (id: string, field: string, value: string | number) => Promise<void>;
  deleteSalesItem: (id: string) => Promise<void>;
}> = (set, get) => ({
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
});
