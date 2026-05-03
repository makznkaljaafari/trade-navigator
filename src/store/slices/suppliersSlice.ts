import { supabase } from '@/integrations/supabase/client';
import { Supplier } from '@/types';
import { SliceCreator } from '../types';
import { userId } from '../helpers';

export const createSuppliersSlice: SliceCreator<{
  addSupplier: (s: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: string, d: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;
}> = (set) => ({
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
});
