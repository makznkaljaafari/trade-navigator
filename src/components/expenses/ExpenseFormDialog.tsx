import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, SelectField } from '@/components/shared';
import { expenseSchema } from '@/lib/validations';
import { EXPENSE_CATEGORIES, CURRENCIES } from '@/constants';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import type { Expense } from '@/types';

const emptyForm = { category: 'hotel', amount: '', currency: 'CNY', date: '', notes: '' };

export default function ExpenseFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing: Expense | null; }) {
  const { addExpense, updateExpense } = useAppStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) setForm({ category: editing.category, amount: String(editing.amount), currency: editing.currency, date: editing.date, notes: editing.notes });
    else if (open) { setForm(emptyForm); setErrors({}); }
  }, [editing, open]);

  const handleSave = () => {
    const r = expenseSchema.safeParse({ ...form, amount: Number(form.amount) });
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.issues.forEach(i => { fe[i.path[0] as string] = i.message; });
      setErrors(fe); return;
    }
    if (editing) { updateExpense(editing.id, r.data); toast({ title: 'تم التحديث' }); }
    else { addExpense({ trip_id: '', ...r.data } as Omit<Expense, 'id'>); toast({ title: 'تمت الإضافة' }); }
    onOpenChange(false);
  };

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => ({ value: k, label: v.label }));
  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader><DialogTitle className="font-extrabold">{editing ? 'تعديل المصروف' : 'إضافة مصروف'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <SelectField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} options={categoryOptions} error={errors.category} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="المبلغ" value={form.amount} onChange={v => setForm({ ...form, amount: v })} type="number" error={errors.amount} />
            <SelectField label="العملة" value={form.currency} onChange={v => setForm({ ...form, currency: v })} options={currencyOptions} />
          </div>
          <TextField label="التاريخ" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" error={errors.date} />
          <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
          <Button onClick={handleSave} className="w-full gradient-primary text-primary-foreground">{editing ? 'تحديث' : 'حفظ'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
