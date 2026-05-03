import { Product, InventoryItem } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const userId = async () => (await supabase.auth.getUser()).data.user?.id;

export const mapProduct = (p: any): Product => ({
  ...p,
  quantity: (p.quantity_purchased || 0) - (p.quantity_sold || 0),
  purchase_price: Number(p.purchase_price) || 0,
  sale_price: Number(p.sale_price) || 0,
});

export const mapInventory = (p: any): InventoryItem => ({
  id: p.id,
  product_name: p.name,
  oem_number: p.oem_number || '',
  brand: p.brand || '',
  quantity_purchased: p.quantity_purchased || 0,
  quantity_sold: p.quantity_sold || 0,
  quantity_available: (p.quantity_purchased || 0) - (p.quantity_sold || 0),
  purchase_price: Number(p.purchase_price) || 0,
  sale_price: Number(p.sale_price) || 0,
});

export const groupBy = <T extends Record<string, any>>(items: T[], key: string) => {
  const map: Record<string, T[]> = {};
  items.forEach(it => {
    const k = it[key];
    if (!k) return;
    (map[k] ||= []).push(it);
  });
  return map;
};
