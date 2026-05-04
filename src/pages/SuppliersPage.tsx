import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Supplier } from '@/types';
import SupplierFormDialog from '@/components/suppliers/SupplierFormDialog';
import SupplierCard from '@/components/suppliers/SupplierCard';

const exportColumns = [
  { key: 'name', header: 'اسم المورد' },
  { key: 'company_name', header: 'اسم الشركة' },
  { key: 'city', header: 'المدينة' },
  { key: 'phone', header: 'الهاتف' },
  { key: 'wechat_or_whatsapp', header: 'WeChat/WhatsApp' },
  { key: 'product_category', header: 'التصنيف' },
  { key: 'rating', header: 'التقييم' },
  { key: 'notes', header: 'ملاحظات' },
];

export default function SuppliersPage() {
  const { suppliers, deleteSupplier } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  const categories = useMemo(() => [...new Set(suppliers.map(s => s.product_category))], [suppliers]);
  const cities = useMemo(() => [...new Set(suppliers.map(s => s.city))], [suppliers]);

  const filtered = useMemo(() => suppliers.filter(s => {
    const ms = !search || [s.name, s.company_name, s.city].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const mc = categoryFilter === 'all' || s.product_category === categoryFilter;
    const mci = cityFilter === 'all' || s.city === cityFilter;
    return ms && mc && mci;
  }), [suppliers, search, categoryFilter, cityFilter]);

  const handleEdit = (s: Supplier) => { setEditing(s); setOpen(true); };
  const handleAddNew = () => { setEditing(null); setOpen(true); };
  const handleDelete = () => {
    if (deleteId) { deleteSupplier(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="الموردين" subtitle={`${suppliers.length} مورد مسجل`}>
        <ExportButton data={suppliers} columns={exportColumns} filename="قائمة-الموردين" />
        <Button onClick={handleAddNew} className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
          <Plus className="w-4 h-4" /> مورد جديد
        </Button>
      </PageHeader>

      <SupplierFormDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }} editing={editing} />

      <SearchBar
        placeholder="ابحث عن مورد..." value={search} onChange={setSearch}
        filters={[
          { key: 'category', label: 'التصنيف', options: categories.map(c => ({ value: c, label: c })), value: categoryFilter, onChange: setCategoryFilter },
          { key: 'city', label: 'المدينة', options: cities.map(c => ({ value: c, label: c })), value: cityFilter, onChange: setCityFilter },
        ]}
      />

      {filtered.length === 0 ? (
        <EmptyState message={search || categoryFilter !== 'all' || cityFilter !== 'all' ? 'لا توجد نتائج مطابقة' : EMPTY_MESSAGES.suppliers} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((sup, i) => (
            <SupplierCard key={sup.id} supplier={sup} index={i} onEdit={handleEdit} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف المورد" description="هل أنت متأكد من حذف هذا المورد؟"
        confirmText="حذف" onConfirm={handleDelete} variant="destructive"
      />
    </div>
  );
}
