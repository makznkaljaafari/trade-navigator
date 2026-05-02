import { useState, useMemo } from 'react';
import { Plus, Trash2, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { PageHeader, EmptyState, TextField, ConfirmDialog } from '@/components/shared';
import { useAppStore, Payment } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { formatNumber } from '@/lib/helpers';

const emptyForm = {
  payment_type: 'purchase' as 'purchase' | 'sales',
  invoice_id: '',
  amount: 0,
  currency: 'SAR',
  payment_method: 'cash',
  date: new Date().toISOString().split('T')[0],
  notes: '',
};

const METHODS: Record<string, string> = {
  cash: 'نقداً',
  bank: 'تحويل بنكي',
  card: 'بطاقة',
  cheque: 'شيك',
  other: 'أخرى',
};

export default function PaymentsPage() {
  const { payments, purchaseInvoices, salesInvoices, suppliers, addPayment, deletePayment } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'purchase' | 'sales'>('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return payments;
    return payments.filter(p => p.payment_type === tab);
  }, [payments, tab]);

  const totals = useMemo(() => {
    const purchase = payments.filter(p => p.payment_type === 'purchase').reduce((s, p) => s + p.amount, 0);
    const sales = payments.filter(p => p.payment_type === 'sales').reduce((s, p) => s + p.amount, 0);
    return { purchase, sales, net: sales - purchase };
  }, [payments]);

  const invoiceOptions = form.payment_type === 'purchase'
    ? purchaseInvoices.map(inv => {
        const sup = suppliers.find(s => s.id === inv.supplier_id);
        const total = inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0;
        return { id: inv.id, label: `${inv.invoice_number || inv.id.slice(0, 8)} — ${sup?.name || 'بدون مورد'} — ${formatNumber(total)} ${inv.currency}`, paid: inv.paid_amount, total };
      })
    : salesInvoices.map(inv => {
        const total = inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0;
        return { id: inv.id, label: `${inv.invoice_number || inv.id.slice(0, 8)} — ${inv.customer_name || 'عميل'} — ${formatNumber(total)} ${inv.currency}`, paid: inv.paid_amount, total };
      });

  const handleSubmit = async () => {
    if (!form.invoice_id || form.amount <= 0) {
      toast({ title: 'خطأ', description: 'اختر الفاتورة وأدخل مبلغ صحيح', variant: 'destructive' });
      return;
    }
    await addPayment(form);
    toast({ title: 'تم تسجيل الدفعة', description: `${formatNumber(form.amount)} ${form.currency}` });
    setForm(emptyForm);
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deletePayment(deleteId);
    toast({ title: 'تم الحذف' });
    setDeleteId(null);
  };

  const findInvoiceLabel = (p: Payment) => {
    if (p.payment_type === 'purchase') {
      const inv = purchaseInvoices.find(i => i.id === p.invoice_id);
      return inv?.invoice_number || p.invoice_id.slice(0, 8);
    }
    const inv = salesInvoices.find(i => i.id === p.invoice_id);
    return inv?.invoice_number || p.invoice_id.slice(0, 8);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="المدفوعات" subtitle={`${payments.length} دفعة مسجلة`}>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> دفعة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle className="font-extrabold">تسجيل دفعة</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-xs font-semibold mb-1 block">نوع الدفعة</label>
                <Select value={form.payment_type} onValueChange={(v: 'purchase' | 'sales') => setForm({ ...form, payment_type: v, invoice_id: '' })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">دفعة لمورد (شراء)</SelectItem>
                    <SelectItem value="sales">دفعة من عميل (بيع)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block">الفاتورة</label>
                <Select value={form.invoice_id} onValueChange={v => setForm({ ...form, invoice_id: v })}>
                  <SelectTrigger><SelectValue placeholder="اختر فاتورة" /></SelectTrigger>
                  <SelectContent>
                    {invoiceOptions.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground">لا توجد فواتير</div>
                    ) : invoiceOptions.map(o => (
                      <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="المبلغ" type="number" value={String(form.amount)} onChange={v => setForm({ ...form, amount: Number(v) })} />
                <div>
                  <label className="text-xs font-semibold mb-1 block">العملة</label>
                  <Select value={form.currency} onValueChange={v => setForm({ ...form, currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SAR">ر.س</SelectItem>
                      <SelectItem value="USD">$</SelectItem>
                      <SelectItem value="CNY">¥</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block">طريقة الدفع</label>
                  <Select value={form.payment_method} onValueChange={v => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(METHODS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <TextField label="التاريخ" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} />
              </div>
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
              <Button onClick={handleSubmit} className="w-full gradient-secondary text-secondary-foreground font-bold">حفظ الدفعة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-card border border-border rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowUpCircle className="w-3.5 h-3.5 text-destructive" /> مدفوع للموردين
          </div>
          <div className="text-base sm:text-lg font-extrabold text-destructive">{formatNumber(totals.purchase)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <ArrowDownCircle className="w-3.5 h-3.5 text-accent" /> مستلم من العملاء
          </div>
          <div className="text-base sm:text-lg font-extrabold text-accent">{formatNumber(totals.sales)}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 shadow-card">
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Wallet className="w-3.5 h-3.5 text-primary" /> الصافي
          </div>
          <div className={`text-base sm:text-lg font-extrabold ${totals.net >= 0 ? 'text-accent' : 'text-destructive'}`}>{formatNumber(totals.net)}</div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
        <TabsList>
          <TabsTrigger value="all">الكل ({payments.length})</TabsTrigger>
          <TabsTrigger value="purchase">للموردين</TabsTrigger>
          <TabsTrigger value="sales">من العملاء</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState message="لا توجد دفعات بعد. أضف دفعة جديدة لبدء التتبع." />
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2 text-right font-semibold">التاريخ</th>
                    <th className="p-2 text-right font-semibold">النوع</th>
                    <th className="p-2 text-right font-semibold">الفاتورة</th>
                    <th className="p-2 text-right font-semibold">المبلغ</th>
                    <th className="p-2 text-right font-semibold hidden sm:table-cell">الطريقة</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-2 font-mono">{p.date}</td>
                      <td className="p-2">
                        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${p.payment_type === 'purchase' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
                          {p.payment_type === 'purchase' ? 'مورد' : 'عميل'}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-xs">{findInvoiceLabel(p)}</td>
                      <td className="p-2 font-bold">{formatNumber(p.amount)} {p.currency}</td>
                      <td className="p-2 hidden sm:table-cell">{METHODS[p.payment_method] || p.payment_method}</td>
                      <td className="p-2">
                        <button onClick={() => setDeleteId(p.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف الدفعة"
        description="سيتم تحديث رصيد الفاتورة تلقائياً."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
