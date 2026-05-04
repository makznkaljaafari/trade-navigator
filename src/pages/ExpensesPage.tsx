import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Expense } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCIES, EMPTY_MESSAGES } from '@/constants';
import { convertCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ExpenseFormDialog from '@/components/expenses/ExpenseFormDialog';
import ExpenseRow from '@/components/expenses/ExpenseRow';
import ExpensesTotals from '@/components/expenses/ExpensesTotals';

const exportColumns = [
  { key: 'category', header: 'التصنيف' }, { key: 'amount', header: 'المبلغ' },
  { key: 'currency', header: 'العملة' }, { key: 'date', header: 'التاريخ' }, { key: 'notes', header: 'ملاحظات' },
];

export default function ExpensesPage() {
  const { expenses, deleteExpense } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  const filtered = useMemo(() => expenses.filter(e => {
    const ms = !search || e.notes.toLowerCase().includes(search.toLowerCase());
    const mc = categoryFilter === 'all' || e.category === categoryFilter;
    const mcu = currencyFilter === 'all' || e.currency === currencyFilter;
    return ms && mc && mcu;
  }), [expenses, search, categoryFilter, currencyFilter]);

  const totalCNY = filtered.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
  const totalUSD = filtered.filter(e => e.currency === 'USD').reduce((s, e) => s + e.amount, 0) + convertCurrency(totalCNY, 'CNY', 'USD');
  const totalSAR = filtered.filter(e => e.currency === 'SAR').reduce((s, e) => s + e.amount, 0);

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => ({ value: k, label: v.label }));
  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }));

  const handleDelete = () => {
    if (deleteId) { deleteExpense(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="المصروفات" subtitle={`${expenses.length} مصروف`}>
        <ExportButton data={expenses} columns={exportColumns} filename="المصروفات" />
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> مصروف جديد
        </Button>
      </PageHeader>

      <ExpenseFormDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }} editing={editing} />

      <SearchBar
        placeholder="ابحث في الملاحظات..." value={search} onChange={setSearch}
        filters={[
          { key: 'category', label: 'التصنيف', options: categoryOptions, value: categoryFilter, onChange: setCategoryFilter },
          { key: 'currency', label: 'العملة', options: currencyOptions, value: currencyFilter, onChange: setCurrencyFilter },
        ]}
      />

      <ExpensesTotals totalCNY={totalCNY} totalUSD={totalUSD} totalSAR={totalSAR} />

      {filtered.length === 0 ? (
        <EmptyState message={search || categoryFilter !== 'all' || currencyFilter !== 'all' ? 'لا توجد نتائج' : EMPTY_MESSAGES.expenses} />
      ) : (
        <div className="space-y-2">
          {filtered.map((exp, i) => (
            <ExpenseRow key={exp.id} expense={exp} index={i} onEdit={(e) => { setEditing(e); setOpen(true); }} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف المصروف" description="هل أنت متأكد من حذف هذا المصروف؟"
        confirmText="حذف" onConfirm={handleDelete} variant="destructive"
      />
    </div>
  );
}
