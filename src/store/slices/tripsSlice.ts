import { supabase } from '@/integrations/supabase/client';
import { Trip } from '@/types';
import { SliceCreator } from '../types';
import { userId } from '../helpers';

export const createTripsSlice: SliceCreator<{
  addTrip: (t: Omit<Trip, 'id'>) => Promise<void>;
  updateTrip: (id: string, d: Partial<Trip>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
}> = (set) => ({
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
});
