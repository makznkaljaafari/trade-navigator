import { useState } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import type { Shipment } from '@/types';
import ShipmentFormDialog from '@/components/shipping/ShipmentFormDialog';
import ShipmentCard from '@/components/shipping/ShipmentCard';

export default function ShippingPage() {
  const { shipments, deleteShipment } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <PageHeader title="إدارة الشحنات" subtitle={`${shipments.length} شحنة`}>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gradient-secondary text-secondary-foreground gap-2 font-bold">
          <Plus className="w-4 h-4" /> شحنة جديدة
        </Button>
      </PageHeader>

      <ShipmentFormDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }} editing={editing} />

      {shipments.length === 0 ? (
        <EmptyState message="لا توجد شحنات بعد" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {shipments.map((s, i) => (
            <ShipmentCard key={s.id} shipment={s} index={i} onEdit={(sh) => { setEditing(sh); setOpen(true); }} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف الشحنة" description="هل أنت متأكد من حذف هذه الشحنة؟"
        confirmText="حذف"
        onConfirm={async () => { if (deleteId) { await deleteShipment(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); } }}
        variant="destructive"
      />
    </div>
  );
}
