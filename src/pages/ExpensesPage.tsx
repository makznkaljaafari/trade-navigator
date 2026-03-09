import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { mockExpenses, currencyRates } from '@/data/mock-data';
import { Expense } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const categoryLabels: Record<string, string> = {
  hotel: '🏨 فندق',
  transport: '🚗 تنقلات',
  food: '🍜 طعام',
  samples: '📦 عينات',
  translator: '🗣️ مترجم',
  other: '📋 أخرى',
};

const categoryColors: Record<string, string> = {
  hotel: 'bg-primary/10 text-primary',
  transport: 'bg-secondary/10 text-secondary',
  food: 'bg-accent/10 text-accent',
  samples: 'bg-info/15 text-info',
  translator: 'bg-warning/15 text-warning',
  other: 'bg-muted text-muted-foreground',
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: 'hotel' as Expense['category'], amount: '', currency: 'CNY', date: '', notes: '' });

  const totalCNY = expenses.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
  const totalUSD = totalCNY * currencyRates.CNY_USD;

  const handleAdd = () => {
    const exp: Expense = { id: Date.now().toString(), trip_id: '1', ...form, amount: Number(form.amount) };
    setExpenses([exp, ...expenses]);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">المصروفات</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> مصروف جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة مصروف</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>التصنيف</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Expense['category'] })}>
                  {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>المبلغ</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
                <div><Label>العملة</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    <option value="CNY">يوان صيني</option>
                    <option value="USD">دولار أمريكي</option>
                    <option value="SAR">ريال سعودي</option>
                  </select>
                </div>
              </div>
              <div><Label>التاريخ</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>ملاحظات</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">حفظ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي بالیوان</p>
          <p className="text-xl font-bold mt-1">¥{totalCNY.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي بالدولار</p>
          <p className="text-xl font-bold mt-1">${totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {expenses.map((exp, i) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${categoryColors[exp.category]}`}>
                {categoryLabels[exp.category]}
              </span>
              <div>
                <p className="text-sm font-medium">{exp.notes}</p>
                <p className="text-xs text-muted-foreground">{exp.date}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">{exp.currency === 'CNY' ? '¥' : '$'}{exp.amount.toLocaleString()}</p>
              {exp.currency === 'CNY' && (
                <p className="text-xs text-muted-foreground">${(exp.amount * currencyRates.CNY_USD).toFixed(0)}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
