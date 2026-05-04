import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/shared';
import { tripSchema } from '@/lib/validations';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import type { Trip } from '@/types';

const emptyForm = { name: '', country: 'الصين', city: '', start_date: '', end_date: '', notes: '' };

export default function TripFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing: Trip | null; }) {
  const { addTrip, updateTrip } = useAppStore();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editing) setForm({ name: editing.name, country: editing.country, city: editing.city, start_date: editing.start_date, end_date: editing.end_date, notes: editing.notes });
    else if (open) { setForm(emptyForm); setErrors({}); }
  }, [editing, open]);

  const handleSave = () => {
    const r = tripSchema.safeParse(form);
    if (!r.success) {
      const fe: Record<string, string> = {};
      r.error.issues.forEach(i => { fe[i.path[0] as string] = i.message; });
      setErrors(fe); return;
    }
    const d = r.data;
    if (editing) {
      updateTrip(editing.id, { ...d, notes: d.notes || '' });
      toast({ title: 'تم التحديث' });
    } else {
      addTrip({ ...d, notes: d.notes || '', status: 'planning' });
      toast({ title: 'تمت الإضافة' });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md">
        <DialogHeader><DialogTitle className="font-extrabold">{editing ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <TextField label="اسم الرحلة" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="رحلة قوانغتشو..." error={errors.name} />
          <div className="grid grid-cols-2 gap-3">
            <TextField label="البلد" value={form.country} onChange={v => setForm({ ...form, country: v })} error={errors.country} />
            <TextField label="المدينة" value={form.city} onChange={v => setForm({ ...form, city: v })} placeholder="قوانغتشو" error={errors.city} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="تاريخ البداية" value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} type="date" error={errors.start_date} />
            <TextField label="تاريخ النهاية" value={form.end_date} onChange={v => setForm({ ...form, end_date: v })} type="date" error={errors.end_date} />
          </div>
          <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
          <Button onClick={handleSave} className="w-full gradient-secondary text-secondary-foreground font-bold">
            {editing ? 'تحديث الرحلة' : 'حفظ الرحلة'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
