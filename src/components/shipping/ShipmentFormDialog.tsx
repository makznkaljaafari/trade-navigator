import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, SelectField } from '@/components/shared';
import { STATUS_LABELS } from '@/constants';
import { toast } from '@/hooks/use-toast';
import { useAppStore } from '@/store/useAppStore';
import type { Shipment } from '@/types';

const TIMELINE_STAGES = ['purchased', 'at_warehouse', 'shipped', 'in_transit', 'arrived', 'delivered'] as const;

const emptyForm = {
  shipment_number: '', shipping_company: '', shipping_type: 'sea',
  departure_port: '', arrival_port: '', ship_date: '', expected_arrival_date: '',
  shipping_cost: '0', weight: '0', cartons_count: '0', status: 'purchased', notes: '',
};

export default function ShipmentFormDialog({ open, onOpenChange, editing }: { open: boolean; onOpenChange: (v: boolean) => void; editing: Shipment | null; }) {
  const { addShipment, updateShipment } = useAppStore();
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editing) setForm({
      shipment_number: editing.shipment_number, shipping_company: editing.shipping_company,
      shipping_type: editing.shipping_type, departure_port: editing.departure_port, arrival_port: editing.arrival_port,
      ship_date: editing.ship_date || '', expected_arrival_date: editing.expected_arrival_date || '',
      shipping_cost: String(editing.shipping_cost), weight: String(editing.weight),
      cartons_count: String(editing.cartons_count), status: editing.status, notes: '',
    });
    else if (open) setForm(emptyForm);
  }, [editing, open]);

  const handleSave = async () => {
    if (!form.shipment_number.trim()) { toast({ title: 'رقم الشحنة مطلوب', variant: 'destructive' }); return; }
    const payload = {
      ...form,
      ship_date: form.ship_date || null,
      expected_arrival_date: form.expected_arrival_date || null,
      shipping_cost: Number(form.shipping_cost) || 0,
      weight: Number(form.weight) || 0,
      cartons_count: Number(form.cartons_count) || 0,
    };
    if (editing) { await updateShipment(editing.id, payload as Partial<Shipment>); toast({ title: 'تم التحديث' }); }
    else { await addShipment(payload as Omit<Shipment, 'id'>); toast({ title: 'تمت الإضافة' }); }
    onOpenChange(false);
  };

  const statusOptions = TIMELINE_STAGES.map(s => ({ value: s, label: STATUS_LABELS[s] }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-extrabold">{editing ? 'تعديل الشحنة' : 'شحنة جديدة'}</DialogTitle></DialogHeader>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <TextField label="رقم الشحنة" value={form.shipment_number} onChange={v => setForm({ ...form, shipment_number: v })} />
            <TextField label="الشركة" value={form.shipping_company} onChange={v => setForm({ ...form, shipping_company: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="نوع الشحن" value={form.shipping_type} onChange={v => setForm({ ...form, shipping_type: v })} options={[{ value: 'sea', label: 'بحري' }, { value: 'air', label: 'جوي' }]} />
            <SelectField label="الحالة" value={form.status} onChange={v => setForm({ ...form, status: v })} options={statusOptions} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="ميناء المغادرة" value={form.departure_port} onChange={v => setForm({ ...form, departure_port: v })} />
            <TextField label="ميناء الوصول" value={form.arrival_port} onChange={v => setForm({ ...form, arrival_port: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="تاريخ الشحن" value={form.ship_date} onChange={v => setForm({ ...form, ship_date: v })} type="date" />
            <TextField label="الوصول المتوقع" value={form.expected_arrival_date} onChange={v => setForm({ ...form, expected_arrival_date: v })} type="date" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <TextField label="التكلفة $" value={form.shipping_cost} onChange={v => setForm({ ...form, shipping_cost: v })} type="number" />
            <TextField label="الوزن (كغ)" value={form.weight} onChange={v => setForm({ ...form, weight: v })} type="number" />
            <TextField label="الكراتين" value={form.cartons_count} onChange={v => setForm({ ...form, cartons_count: v })} type="number" />
          </div>
          <Button onClick={handleSave} className="w-full gradient-secondary text-secondary-foreground font-bold">
            {editing ? 'تحديث' : 'حفظ'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
