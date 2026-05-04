import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/shared';
import { supplierSchema } from '@/lib/validations';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import type { Supplier } from '@/types';

const emptyForm = { name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: '' };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Supplier | null;
}

export default function SupplierFormDialog({ open, onOpenChange, editing }: Props) {
  const { addSupplier, updateSupplier } = useAppStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name, company_name: editing.company_name, city: editing.city,
        phone: editing.phone, wechat_or_whatsapp: editing.wechat_or_whatsapp,
        product_category: editing.product_category, notes: editing.notes,
      });
    } else if (open) {
      setForm(emptyForm); setErrors({});
    }
  }, [editing, open]);

  const handleSave = () => {
    const result = supplierSchema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach(i => { fe[i.path[0] as string] = i.message; });
      setErrors(fe); return;
    }
    const d = result.data;
    const payload = {
      name: d.name, company_name: d.company_name, city: d.city, phone: d.phone,
      wechat_or_whatsapp: d.wechat_or_whatsapp || '', product_category: d.product_category,
      notes: d.notes || '',
    };
    if (editing) {
      updateSupplier(editing.id, payload);
      toast({ title: 'تم التحديث' });
    } else {
      addSupplier({ ...payload, rating: 0, trip_id: '' });
      toast({ title: 'تمت الإضافة' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-extrabold">{editing ? 'تعديل المورد' : 'إضافة مورد جديد'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="اسم المورد" value={form.name} onChange={v => setForm({ ...form, name: v })} error={errors.name} />
            <TextField label="اسم الشركة" value={form.company_name} onChange={v => setForm({ ...form, company_name: v })} error={errors.company_name} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="المدينة" value={form.city} onChange={v => setForm({ ...form, city: v })} error={errors.city} />
            <TextField label="التصنيف" value={form.product_category} onChange={v => setForm({ ...form, product_category: v })} error={errors.product_category} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="الهاتف" value={form.phone} onChange={v => setForm({ ...form, phone: v })} error={errors.phone} />
            <TextField label="WeChat / WhatsApp" value={form.wechat_or_whatsapp} onChange={v => setForm({ ...form, wechat_or_whatsapp: v })} />
          </div>
          <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
          <Button onClick={handleSave} className="w-full gradient-secondary text-secondary-foreground font-bold">
            {editing ? 'تحديث المورد' : 'حفظ المورد'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
