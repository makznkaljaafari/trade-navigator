import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save } from 'lucide-react';
import { StarRating } from '@/components/ui/star-rating';
import { mockProducts } from '@/data/mock-data';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const updateCell = useCallback((id: string, field: keyof Product, value: string | number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  }, []);

  const addRow = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: '', oem_number: '', brand: '', size: '',
      purchase_price: 0, sale_price: 0, quantity: 0,
      notes: '', rating: 0,
    };
    setProducts([...products, newProduct]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">المنتجات</h3>
        <div className="flex gap-2">
          <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة صف
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto"
      >
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className="spreadsheet-header w-8">#</th>
              <th className="spreadsheet-header min-w-[140px]">اسم المنتج</th>
              <th className="spreadsheet-header min-w-[120px]">رقم OEM</th>
              <th className="spreadsheet-header min-w-[90px]">العلامة</th>
              <th className="spreadsheet-header min-w-[70px]">المقاس</th>
              <th className="spreadsheet-header min-w-[80px]">سعر الشراء</th>
              <th className="spreadsheet-header min-w-[80px]">سعر البيع</th>
              <th className="spreadsheet-header min-w-[60px]">الكمية</th>
              <th className="spreadsheet-header min-w-[80px]">التقييم</th>
              <th className="spreadsheet-header min-w-[120px]">ملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                <td className="spreadsheet-cell text-center text-muted-foreground font-mono text-xs">{i + 1}</td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={product.name}
                    onChange={e => updateCell(product.id, 'name', e.target.value)}
                    placeholder="اسم المنتج"
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm font-mono"
                    value={product.oem_number}
                    onChange={e => updateCell(product.id, 'oem_number', e.target.value)}
                    placeholder="OEM"
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={product.brand}
                    onChange={e => updateCell(product.id, 'brand', e.target.value)}
                    placeholder="العلامة"
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={product.size}
                    onChange={e => updateCell(product.id, 'size', e.target.value)}
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm text-center"
                    type="number"
                    value={product.purchase_price || ''}
                    onChange={e => updateCell(product.id, 'purchase_price', Number(e.target.value))}
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm text-center"
                    type="number"
                    value={product.sale_price || ''}
                    onChange={e => updateCell(product.id, 'sale_price', Number(e.target.value))}
                  />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm text-center"
                    type="number"
                    value={product.quantity || ''}
                    onChange={e => updateCell(product.id, 'quantity', Number(e.target.value))}
                  />
                </td>
                <td className="spreadsheet-cell">
                  <StarRating rating={product.rating} onRate={r => updateCell(product.id, 'rating', r)} />
                </td>
                <td className="spreadsheet-cell">
                  <input
                    className="w-full bg-transparent focus:outline-none text-sm"
                    value={product.notes}
                    onChange={e => updateCell(product.id, 'notes', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
