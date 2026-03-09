import { motion } from 'framer-motion';
import { mockInventory } from '@/data/mock-data';
import { Package } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">المخزون</h3>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="spreadsheet-header">#</th>
              <th className="spreadsheet-header">المنتج</th>
              <th className="spreadsheet-header">رقم OEM</th>
              <th className="spreadsheet-header">العلامة</th>
              <th className="spreadsheet-header">المشتراة</th>
              <th className="spreadsheet-header">المباعة</th>
              <th className="spreadsheet-header">المتوفرة</th>
              <th className="spreadsheet-header">سعر الشراء</th>
              <th className="spreadsheet-header">سعر البيع</th>
              <th className="spreadsheet-header">القيمة</th>
            </tr>
          </thead>
          <tbody>
            {mockInventory.map((item, i) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="spreadsheet-cell text-center text-muted-foreground text-xs">{i + 1}</td>
                <td className="spreadsheet-cell font-medium text-sm">{item.product_name}</td>
                <td className="spreadsheet-cell font-mono text-xs">{item.oem_number}</td>
                <td className="spreadsheet-cell text-sm">{item.brand}</td>
                <td className="spreadsheet-cell text-center text-sm">{item.quantity_purchased}</td>
                <td className="spreadsheet-cell text-center text-sm">{item.quantity_sold}</td>
                <td className="spreadsheet-cell text-center font-bold text-sm">
                  <span className={item.quantity_available < 50 ? 'text-destructive' : 'text-accent'}>
                    {item.quantity_available}
                  </span>
                </td>
                <td className="spreadsheet-cell text-center text-sm">${item.purchase_price}</td>
                <td className="spreadsheet-cell text-center text-sm">${item.sale_price}</td>
                <td className="spreadsheet-cell text-center font-semibold text-sm">
                  ${(item.quantity_available * item.sale_price).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/50 font-bold">
              <td colSpan={6} className="spreadsheet-cell text-sm">الإجمالي</td>
              <td className="spreadsheet-cell text-center text-sm">{mockInventory.reduce((s, i) => s + i.quantity_available, 0)}</td>
              <td colSpan={2} className="spreadsheet-cell" />
              <td className="spreadsheet-cell text-center text-sm">
                ${mockInventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </motion.div>
    </div>
  );
}
