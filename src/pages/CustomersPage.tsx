import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, Edit2, Trash2, MoreVertical, MapPin, User } from 'lucide-react';
import { PageHeader, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore, type Customer } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const emptyForm = { name: '', phone: '', city: '', category: 'regular', notes: '' };

export default function CustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.phone || '').includes(search)
  ), [customers, search]);

  const handleSave = async () => {
    if (!form.name.trim()) { setErrors({ name: 'اسم العميل مطلوب' }); return; }
    if (editing) {
      await updateCustomer(editing.id, form);
      toast({ title: 'تم التحديث' });
    } else {
      await addCustomer(form);
      toast({ title: 'تمت الإضافة' });
    }
    setForm(emptyForm); setErrors({}); setEditing(null); setOpen(false);
  };

  const handleEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || '', city: c.city || '', category: c.category || 'regular', notes: c.notes || '' });
    setOpen(true);
  };

  const exportColumns = [
    { key: 'name', header: 'الاسم' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'city', header: 'المدينة' },
    { key: 'category', header: 'التصنيف' },
    { key: 'balance', header: 'الرصيد' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="العملاء" subtitle={`${customers.length} عميل`}>
        <ExportButton data={customers} columns={exportColumns} filename="العملاء" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null); setErrors({}); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-extrabold">{editing ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <TextField label="الاسم" value={form.name} onChange={v => setForm({ ...form, name: v })} error={errors.name} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="الهاتف" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <TextField label="المدينة" value={form.city} onChange={v => setForm({ ...form, city: v })} />
              </div>
              <TextField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} placeholder="regular / vip / wholesale" />
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
              <Button onClick={handleSave} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editing ? 'تحديث' : 'حفظ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <SearchBar placeholder="ابحث عن عميل..." value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <EmptyState message="لا يوجد عملاء بعد. أضف عميلك الأول!" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center text-sm font-bold text-secondary-foreground">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{c.name}</h4>
                    {c.category && (
                      <span className="text-[10px] uppercase font-semibold text-secondary">{c.category}</span>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(c)}>
                      <Edit2 className="w-4 h-4 ml-2" /> تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(c.id)}>
                      <Trash2 className="w-4 h-4 ml-2" /> حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {c.phone && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span className="font-mono text-foreground">{c.phone}</span>
                  </div>
                )}
                {c.city && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="text-foreground">{c.city}</span>
                  </div>
                )}
              </div>
              {c.balance !== 0 && (
                <div className={`mt-3 pt-3 border-t border-border/50 text-xs flex justify-between font-bold ${c.balance > 0 ? 'text-destructive' : 'text-accent'}`}>
                  <span>الرصيد:</span>
                  <span>{c.balance.toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف العميل"
        description="هل أنت متأكد من حذف هذا العميل؟"
        confirmText="حذف"
        onConfirm={async () => { if (deleteId) { await deleteCustomer(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); } }}
        variant="destructive"
      />
    </div>
  );
}
