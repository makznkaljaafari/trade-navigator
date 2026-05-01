import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, ArrowLeftRight, Star, Trash2 } from 'lucide-react';
import { PageHeader, EmptyState, EditableTable, SelectField } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { useAppStore, type QuotationItem } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function QuotationsPage() {
  const { quotations, suppliers, addQuotation, addQuotationItem, updateQuotationItem, deleteQuotationItem, deleteQuotation, updateQuotation } = useAppStore();
  const [comparing, setComparing] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { if (!activeId && quotations.length > 0) setActiveId(quotations[0].id); }, [quotations, activeId]);

  const active = quotations.find(q => q.id === activeId);
  const supplierName = (id: string | null) => suppliers.find(s => s.id === id)?.name || 'غير محدد';

  const addQ = async () => {
    const id = await addQuotation({});
    if (id) { setActiveId(id); toast({ title: 'تم إنشاء عرض جديد' }); }
  };

  const addRow = async () => {
    if (!activeId) return;
    await addQuotationItem(activeId, { product_name: '', quantity: 0, purchase_price: 0 });
  };

  const supplierOptions = suppliers.map(s => ({ value: s.id, label: `${s.name} - ${s.company_name}` }));

  const columns: ColumnDef<QuotationItem>[] = [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'purchase_price', header: 'السعر', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total', header: 'الإجمالي', editable: false, align: 'center', render: (row) => <span className="font-semibold">¥{(row.quantity * row.purchase_price).toLocaleString()}</span> },
  ];

  // Compare mode: pivot by product_name across quotations
  const allProducts = Array.from(new Set(quotations.flatMap(q => (q.items || []).map(it => it.product_name)).filter(Boolean)));

  return (
    <div className="space-y-4">
      <PageHeader title="عروض الأسعار" subtitle={`${quotations.length} عرض`}>
        <div className="flex gap-2">
          <Button onClick={() => setComparing(!comparing)} variant={comparing ? 'default' : 'outline'} className="gap-2">
            <ArrowLeftRight className="w-4 h-4" /> {comparing ? 'إنهاء المقارنة' : 'مقارنة'}
          </Button>
          <Button onClick={addQ} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> عرض جديد
          </Button>
        </div>
      </PageHeader>

      {quotations.length === 0 ? (
        <EmptyState message="لا توجد عروض أسعار بعد" action={<Button onClick={addQ} className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" />إنشاء أول عرض</Button>} />
      ) : comparing && allProducts.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="spreadsheet-header">المنتج</th>
                {quotations.map(q => (
                  <th key={q.id} className="spreadsheet-header text-center">{supplierName(q.supplier_id).split(' ')[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allProducts.map(product => {
                const prices = quotations.map(q => q.items?.find(it => it.product_name === product)?.purchase_price || 0);
                const valid = prices.filter(p => p > 0);
                const minPrice = valid.length ? Math.min(...valid) : 0;
                return (
                  <tr key={product} className="hover:bg-muted/30">
                    <td className="spreadsheet-cell text-sm font-medium">{product}</td>
                    {prices.map((p, j) => {
                      const isBest = p === minPrice && p > 0 && valid.length > 1;
                      return (
                        <td key={j} className={`spreadsheet-cell text-center text-sm font-bold ${isBest ? 'bg-accent/15 text-accent' : ''}`}>
                          {p > 0 ? <span className="inline-flex items-center gap-1">{isBest && <Star className="w-3 h-3 fill-current" />}¥{p}</span> : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <div className="space-y-2">
            {quotations.map(q => (
              <button key={q.id} onClick={() => setActiveId(q.id)}
                className={`w-full text-right p-3 rounded-xl border transition ${activeId === q.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:bg-muted/30'}`}>
                <p className="text-sm font-bold truncate">{supplierName(q.supplier_id)}</p>
                <p className="text-xs text-muted-foreground">{q.date}</p>
              </button>
            ))}
          </div>

          {active && (
            <div className="space-y-3">
              <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <SelectField
                    label="المورد"
                    value={active.supplier_id || ''}
                    onChange={v => updateQuotation(active.id, { supplier_id: v })}
                    options={[{ value: '', label: '— غير محدد —' }, ...supplierOptions]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={addRow} size="sm" className="gradient-primary text-primary-foreground gap-1">
                    <Plus className="w-3.5 h-3.5" /> صف
                  </Button>
                  <Button onClick={() => { if (confirm('حذف العرض؟')) { deleteQuotation(active.id); setActiveId(null); } }}
                    variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <EditableTable
                data={active.items || []}
                columns={columns}
                onCellChange={(id, field, value) => updateQuotationItem(id as string, field, value)}
                onDeleteRow={(id) => deleteQuotationItem(id as string)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
