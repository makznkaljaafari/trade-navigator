import { supabase } from '@/integrations/supabase/client';
import { Shipment } from '@/types';
import { SliceCreator } from '../types';
import { userId } from '../helpers';

export const createShipmentsSlice: SliceCreator<{
  addShipment: (s: Omit<Shipment, 'id'>) => Promise<void>;
  updateShipment: (id: string, d: Partial<Shipment>) => Promise<void>;
  deleteShipment: (id: string) => Promise<void>;
}> = (set) => ({
  addShipment: async (sh) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = { ...sh, user_id: uid };
    if (!payload.purchase_invoice_id) delete payload.purchase_invoice_id;
    const { data } = await supabase.from('shipments').insert(payload).select().single();
    if (data) set(s => ({ shipments: [{ ...data, shipping_cost: Number(data.shipping_cost), weight: Number(data.weight) } as any, ...s.shipments] }));
  },
  updateShipment: async (id, data) => {
    const { data: upd } = await supabase.from('shipments').update(data).eq('id', id).select().single();
    if (upd) set(s => ({ shipments: s.shipments.map(sh => sh.id === id ? { ...upd, shipping_cost: Number(upd.shipping_cost), weight: Number(upd.weight) } as any : sh) }));
  },
  deleteShipment: async (id) => {
    await supabase.from('shipments').delete().eq('id', id);
    set(s => ({ shipments: s.shipments.filter(sh => sh.id !== id) }));
  },
});
