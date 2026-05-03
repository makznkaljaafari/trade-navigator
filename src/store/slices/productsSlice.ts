import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types';
import { SliceCreator } from '../types';
import { userId, mapProduct, mapInventory } from '../helpers';

export const createProductsSlice: SliceCreator<{
  addProduct: (p: Omit<Product, 'id'>) => Promise<void>;
  updateProductField: (id: string, field: string, value: string | number) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}> = (set) => ({
  addProduct: async (product) => {
    const uid = await userId(); if (!uid) return;
    const payload: any = {
      user_id: uid,
      name: product.name || 'منتج جديد',
      oem_number: product.oem_number,
      brand: product.brand,
      size: product.size,
      purchase_price: product.purchase_price,
      sale_price: product.sale_price,
      quantity_purchased: product.quantity || 0,
      notes: product.notes,
      rating: product.rating,
      image_url: product.image_url,
    };
    const { data } = await supabase.from('products').insert(payload).select().single();
    if (data) {
      set(s => ({
        products: [mapProduct(data), ...s.products],
        inventory: [mapInventory(data), ...s.inventory],
      }));
    }
  },
  updateProductField: async (id, field, value) => {
    const map: Record<string, string> = { quantity: 'quantity_purchased' };
    const dbField = map[field] || field;
    const { data } = await supabase.from('products').update({ [dbField]: value } as any).eq('id', id).select().single();
    if (data) {
      set(s => ({
        products: s.products.map(x => x.id === id ? mapProduct(data) : x),
        inventory: s.inventory.map(x => x.id === id ? mapInventory(data) : x),
      }));
    }
  },
  deleteProduct: async (id) => {
    await supabase.from('products').delete().eq('id', id);
    set(s => ({ products: s.products.filter(p => p.id !== id), inventory: s.inventory.filter(p => p.id !== id) }));
  },
});
