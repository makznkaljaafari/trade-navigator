import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, Customer } from '../types';
import { userId } from '../helpers';

export const createCustomersSlice: SliceCreator<{
  addCustomer: (c: Omit<Customer, 'id' | 'balance'> & { balance?: number }) => Promise<void>;
  updateCustomer: (id: string, d: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}> = (set) => ({
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
});
