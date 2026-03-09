import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  size: string;
  notes: string;
}

export default function PurchasesPage() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 8, sale_price: 15, size: 'قياسي', notes: '' },
    { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 12, sale_price: 25, size: 'كبير', notes: '' },
    { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 18, sale_price: 35, size: 'أمامي', notes: '' },
  ]);

  const updateCell = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, []);

  const addRow = () => {
    setItems([...items, {
      id: Date.now().toString(), product_name: '', oem_number: '', brand: '',
      quantity: 0, purchase_price: 0, sale_price: 0, size: '', notes: '',
    }]);
  };

  const total = items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">فواتير الشراء</h3>
        <div className="flex gap-2">
          <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة صف
          </Button>
        </div>
      </div>

      {/* Invoice Header */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg gradient-secondary"><FileText className="w-4 h-4 text-secondary-foreground" /></div>
          <div>
            <h4 className="font-bold text-sm">فاتورة شراء #INV-2025-001</h4>
            <p className="text-xs text-muted-foreground">المورد: Guangzhou Auto Parts Co. • الرحلة: قوانغتشو يناير 2025</p>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr>
              <th className="spreadsheet-header w-8">#</th>
              <th className="spreadsheet-header min-w-[140px]">المنتج</th>
              <th className="spreadsheet-header min-w-[110px]">رقم OEM</th>
              <th className="spreadsheet-header min-w-[80px]">العلامة</th>
              <th className="spreadsheet-header min-w-[60px]">الكمية</th>
              <th className="spreadsheet-header min-w-[80px]">سعر الشراء</th>
              <th className="spreadsheet-header min-w-[80px]">سعر البيع</th>
              <th className="spreadsheet-header min-w-[70px]">المقاس</th>
              <th className="spreadsheet-header min-w-[80px]">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} className="hover:bg-muted/30">
                <td className="spreadsheet-cell text-center text-xs text-muted-foreground">{i + 1}</td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm" value={item.product_name} onChange={e => updateCell(item.id, 'product_name', e.target.value)} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm font-mono" value={item.oem_number} onChange={e => updateCell(item.id, 'oem_number', e.target.value)} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm" value={item.brand} onChange={e => updateCell(item.id, 'brand', e.target.value)} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm text-center" type="number" value={item.quantity || ''} onChange={e => updateCell(item.id, 'quantity', Number(e.target.value))} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm text-center" type="number" value={item.purchase_price || ''} onChange={e => updateCell(item.id, 'purchase_price', Number(e.target.value))} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm text-center" type="number" value={item.sale_price || ''} onChange={e => updateCell(item.id, 'sale_price', Number(e.target.value))} /></td>
                <td className="spreadsheet-cell"><input className="w-full bg-transparent focus:outline-none text-sm" value={item.size} onChange={e => updateCell(item.id, 'size', e.target.value)} /></td>
                <td className="spreadsheet-cell text-center font-semibold text-sm">${(item.quantity * item.purchase_price).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-bold">
              <td colSpan={8} className="spreadsheet-cell text-sm">الإجمالي</td>
              <td className="spreadsheet-cell text-center text-sm">${total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </motion.div>
    </div>
  );
}
