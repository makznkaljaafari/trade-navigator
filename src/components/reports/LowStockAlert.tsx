import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import type { Product } from '@/types';

export default function LowStockAlert({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <Card className="p-3 sm:p-4 border-destructive/30 bg-destructive/5">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-destructive" /> منتجات مخزونها منخفض
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {products.map(p => (
          <div key={p.id} className="bg-card p-2 rounded-lg border border-border text-xs">
            <div className="font-bold truncate">{p.name}</div>
            <div className="text-destructive font-extrabold">{p.quantity} متبقي</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
