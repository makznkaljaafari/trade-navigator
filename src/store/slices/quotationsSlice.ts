import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, Quotation, QuotationItem } from '../types';
import { userId } from '../helpers';

export const createQuotationsSlice: SliceCreator<{
  addQuotation: (q: Partial<Quotation>) => Promise<string | null>;
  updateQuotation: (id: string, d: Partial<Quotation>) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  addQuotationItem: (quotationId: string, item: Partial<QuotationItem>) => Promise<void>;
  updateQuotationItem: (id: string, field: string, value: string | number) => Promise<void>;
  deleteQuotationItem: (id: string) => Promise<void>;
}> = (set) => ({
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
});
