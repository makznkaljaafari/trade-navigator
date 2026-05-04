import { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextField } from '@/components/shared';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import { formatNumber } from '@/lib/helpers';

export const PAYMENT_METHODS: Record<string, string> = {
  cash: 'نقداً', bank: 'تحويل بنكي', card: 'بطاقة', cheque: 'شيك', other: 'أخرى',
};

const emptyForm = {
  payment_type: 'purchase' as 'purchase' | 'sales',
  invoice_id: '', amount: 0, currency: 'SAR', payment_method: 'cash',
  date: new Date().toISOString().split('T')[0], notes: '',
};

export default function PaymentFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void; }) {
  const { purchaseInvoices, salesInvoices, suppliers, addPayment } = useAppStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { if (open) setForm(emptyForm); }, [open]);

  const invoiceOptions = useMemo(() => form.payment_type === 'purchase'
    ? purchaseInvoices.map(inv => {
        const sup = suppliers.find(s => s.id === inv.supplier_id);
        const total = inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0;
        return { id: inv.id, label: `${inv.invoice_number || inv.id.slice(0, 8)} — ${sup?.name || 'بدون مورد'} — ${formatNumber(total)} ${inv.currency}` };
      })
    : salesInvoices.map(inv => {
        const total = inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0;
        return { id: inv.id, label: `${inv.invoice_number || inv.id.slice(0, 8)} — ${inv.customer_name || 'عميل'} — ${formatNumber(total)} ${inv.currency}` };
      }), [form.payment_type, purchaseInvoices, salesInvoices, suppliers]);

  const handleSubmit = async () => {
    if (!form.invoice_id || form.amount <= 0) {
      toast({ title: 'خطأ', description: 'اختر الفاتورة وأدخل مبلغ صحيح', variant: 'destructive' });
      return;
    }
    await addPayment(form);
    toast({ title: 'تم تسجيل الدفعة', description: `${formatNumber(form.amount)} ${form.currency}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                ) : invoiceOptions.map(o => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
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
                  {Object.entries(PAYMENT_METHODS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
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
  );
}
