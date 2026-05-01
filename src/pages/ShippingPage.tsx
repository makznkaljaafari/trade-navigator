import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, StatusBadge, EmptyState, TextField, SelectField, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { STATUS_LABELS } from '@/constants';
import { Ship, MapPin, Package, DollarSign, Weight, Calendar, Anchor, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import type { Shipment } from '@/types';

const TIMELINE_STAGES = ['purchased', 'at_warehouse', 'shipped', 'in_transit', 'arrived', 'delivered'] as const;
const STAGE_ICONS: Record<string, React.ElementType> = {
  purchased: Package, at_warehouse: Anchor, shipped: Ship,
  in_transit: Ship, arrived: MapPin, delivered: Check,
};

const statusProgress: Record<string, number> = {
  purchased: 15, at_warehouse: 30, shipped: 45,
  in_transit: 65, arrived: 85, delivered: 100,
};

const emptyForm = {
  shipment_number: '', shipping_company: '', shipping_type: 'sea',
  departure_port: '', arrival_port: '', ship_date: '', expected_arrival_date: '',
  shipping_cost: '0', weight: '0', cartons_count: '0', status: 'purchased', notes: '',
};

export default function ShippingPage() {
  const { shipments, addShipment, updateShipment, deleteShipment } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const handleSave = async () => {
    if (!form.shipment_number.trim()) { toast({ title: 'رقم الشحنة مطلوب', variant: 'destructive' }); return; }
    const payload: any = {
      shipment_number: form.shipment_number,
      shipping_company: form.shipping_company,
      shipping_type: form.shipping_type,
      departure_port: form.departure_port,
      arrival_port: form.arrival_port,
      ship_date: form.ship_date || null,
      expected_arrival_date: form.expected_arrival_date || null,
      shipping_cost: Number(form.shipping_cost) || 0,
      weight: Number(form.weight) || 0,
      cartons_count: Number(form.cartons_count) || 0,
      status: form.status,
      notes: form.notes,
    };
    if (editing) {
      await updateShipment(editing.id, payload);
      toast({ title: 'تم التحديث' });
    } else {
      await addShipment(payload);
      toast({ title: 'تمت الإضافة' });
    }
    setForm(emptyForm); setEditing(null); setOpen(false);
  };

  const handleEdit = (s: Shipment) => {
    setEditing(s);
    setForm({
      shipment_number: s.shipment_number, shipping_company: s.shipping_company,
      shipping_type: s.shipping_type, departure_port: s.departure_port, arrival_port: s.arrival_port,
      ship_date: s.ship_date || '', expected_arrival_date: s.expected_arrival_date || '',
      shipping_cost: String(s.shipping_cost), weight: String(s.weight),
      cartons_count: String(s.cartons_count), status: s.status, notes: '',
    });
    setOpen(true);
  };

  const statusOptions = TIMELINE_STAGES.map(s => ({ value: s, label: STATUS_LABELS[s] }));

  return (
    <div className="space-y-4">
      <PageHeader title="إدارة الشحنات" subtitle={`${shipments.length} شحنة`}>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> شحنة جديدة
            </Button>
          </DialogTrigger>
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
      </PageHeader>

      {shipments.length === 0 ? (
        <EmptyState message="لا توجد شحنات بعد" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {shipments.map((s, i) => {
            const progress = statusProgress[s.status] || 0;
            const currentIdx = TIMELINE_STAGES.indexOf(s.status as typeof TIMELINE_STAGES[number]);

            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="group bg-card rounded-2xl border border-border p-5 shadow-card glass-card-hover">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl gradient-primary shadow-colored-primary flex items-center justify-center">
                      <Ship className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{s.shipment_number}</h4>
                      <p className="text-xs text-muted-foreground">{s.shipping_company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={s.status} />
                    <button onClick={() => handleEdit(s)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                      <Edit2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => setDeleteId(s.id)} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-muted/40 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                        <Anchor className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[10px] font-bold">{s.departure_port}</p>
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full gradient-secondary rounded-full" />
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-1">
                        <MapPin className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-[10px] font-bold">{s.arrival_port}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 px-2">
                  <div className="flex items-center justify-between">
                    {TIMELINE_STAGES.map((stage, idx) => {
                      const StageIcon = STAGE_ICONS[stage];
                      const isCompleted = idx < currentIdx;
                      const isCurrent = idx === currentIdx;
                      return (
                        <div key={stage} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                              isCompleted ? 'bg-accent border-accent text-accent-foreground'
                              : isCurrent ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20'
                              : 'bg-muted border-border text-muted-foreground'
                            }`}>
                              {isCompleted ? <Check className="w-3.5 h-3.5" /> : <StageIcon className="w-3 h-3" />}
                            </div>
                            <p className={`text-[9px] mt-1 text-center leading-tight max-w-[50px] ${
                              isCurrent ? 'font-bold text-primary' : idx > currentIdx ? 'text-muted-foreground' : 'font-medium text-accent'
                            }`}>{STATUS_LABELS[stage]}</p>
                          </div>
                          {idx < TIMELINE_STAGES.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 rounded-full mt-[-14px] ${
                              idx < currentIdx ? 'bg-accent' : 'bg-border'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-muted/40 rounded-lg p-2 text-center">
                    <Calendar className="w-3.5 h-3.5 mx-auto mb-1 text-primary" />
                    <p className="text-[10px] text-muted-foreground">شحن</p>
                    <p className="font-semibold">{s.ship_date || '—'}</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2 text-center">
                    <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-secondary" />
                    <p className="text-[10px] text-muted-foreground">وصول</p>
                    <p className="font-semibold">{s.expected_arrival_date || '—'}</p>
                  </div>
                  <div className="bg-muted/40 rounded-lg p-2 text-center">
                    <DollarSign className="w-3.5 h-3.5 mx-auto mb-1 text-accent" />
                    <p className="text-[10px] text-muted-foreground">تكلفة</p>
                    <p className="font-semibold">${s.shipping_cost.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" />{s.cartons_count} كرتون</span>
                    <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{s.weight} كغ</span>
                  </div>
                  <span className="font-medium">{s.shipping_type === 'sea' ? '🚢 بحري' : '✈️ جوي'}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الشحنة"
        description="هل أنت متأكد من حذف هذه الشحنة؟"
        confirmText="حذف"
        onConfirm={async () => { if (deleteId) { await deleteShipment(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); } }}
        variant="destructive"
      />
    </div>
  );
}
