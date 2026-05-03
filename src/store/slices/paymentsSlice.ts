import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, Payment } from '../types';
import { userId } from '../helpers';

export const createPaymentsSlice: SliceCreator<{
  addPayment: (p: Omit<Payment, 'id'>) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
}> = (set, get) => ({
  addPayment: async (p) => {
    const uid = await userId(); if (!uid) return;
    const { data } = await supabase.from('payments').insert({ ...p, user_id: uid }).select().single();
    if (data) {
      set(s => ({ payments: [{ ...data, amount: Number(data.amount) } as any, ...s.payments] }));
      get().loadAll();
    }
  },
  deletePayment: async (id) => {
    await supabase.from('payments').delete().eq('id', id);
    set(s => ({ payments: s.payments.filter(p => p.id !== id) }));
    get().loadAll();
  },
});
