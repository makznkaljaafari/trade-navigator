import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { EMPTY_MESSAGES, STATUS_LABELS } from '@/constants';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Trip } from '@/types';
import TripFormDialog from '@/components/trips/TripFormDialog';
import TripCard from '@/components/trips/TripCard';

const exportColumns = [
  { key: 'name', header: 'اسم الرحلة' }, { key: 'country', header: 'البلد' }, { key: 'city', header: 'المدينة' },
  { key: 'start_date', header: 'تاريخ البداية' }, { key: 'end_date', header: 'تاريخ النهاية' },
  { key: 'status', header: 'الحالة' }, { key: 'notes', header: 'ملاحظات' },
];

export default function TripsPage() {
  const { trips, deleteTrip } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => trips.filter(t => {
    const ms = !search || [t.name, t.city, t.country].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const mst = statusFilter === 'all' || t.status === statusFilter;
    return ms && mst;
  }), [trips, search, statusFilter]);

  const handleDelete = () => {
    if (deleteId) { deleteTrip(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="رحلات الشراء" subtitle={`${trips.length} رحلة مسجلة`}>
        <ExportButton data={trips} columns={exportColumns} filename="رحلات-الشراء" />
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
          <Plus className="w-4 h-4" /> رحلة جديدة
        </Button>
      </PageHeader>

      <TripFormDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }} editing={editing} />

      <SearchBar
        placeholder="ابحث عن رحلة..." value={search} onChange={setSearch}
        filters={[{
          key: 'status', label: 'الحالة',
          options: [
            { value: 'planning', label: STATUS_LABELS.planning },
            { value: 'active', label: STATUS_LABELS.active },
            { value: 'completed', label: STATUS_LABELS.completed },
          ],
          value: statusFilter, onChange: setStatusFilter,
        }]}
      />

      {filtered.length === 0 ? (
        <EmptyState message={search || statusFilter !== 'all' ? 'لا توجد نتائج مطابقة' : EMPTY_MESSAGES.trips} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t, i) => (
            <TripCard key={t.id} trip={t} index={i} onEdit={(tr) => { setEditing(tr); setOpen(true); }} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف الرحلة" description="هل أنت متأكد من حذف هذه الرحلة؟"
        confirmText="حذف" onConfirm={handleDelete} variant="destructive"
      />
    </div>
  );
}
