import { supabase } from '@/integrations/supabase/client';
import { SliceCreator, AppSettings } from '../types';
import { userId } from '../helpers';

export const createSettingsSlice: SliceCreator<{
  saveSettings: (d: Partial<AppSettings>) => Promise<void>;
}> = (set) => ({
  saveSettings: async (data) => {
    const uid = await userId(); if (!uid) return;
    const { data: upd } = await supabase
      .from('settings')
      .upsert({ user_id: uid, ...data }, { onConflict: 'user_id' })
      .select()
      .single();
    if (upd) set({
      settings: {
        ...upd,
        rate_cny_usd: Number(upd.rate_cny_usd),
        rate_cny_sar: Number(upd.rate_cny_sar),
        rate_usd_sar: Number(upd.rate_usd_sar),
      } as any,
    });
  },
});
