import { supabase } from '@/integrations/supabase/client';
import { Expense } from '@/types';
import { SliceCreator } from '../types';
import { userId } from '../helpers';

export const createExpensesSlice: SliceCreator<{
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>;
  updateExpense: (id: string, d: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}> = (set) => ({
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
});
