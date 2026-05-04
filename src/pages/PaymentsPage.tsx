import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import PaymentFormDialog from '@/components/payments/PaymentFormDialog';
import PaymentsKPIs from '@/components/payments/PaymentsKPIs';
import PaymentsTable from '@/components/payments/PaymentsTable';

export default function PaymentsPage() {
  const { payments, deletePayment } = useAppStore();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'purchase' | 'sales'>('all');

  const filtered = useMemo(() => tab === 'all' ? payments : payments.filter(p => p.payment_type === tab), [payments, tab]);
  const totals = useMemo(() => {
    const purchase = payments.filter(p => p.payment_type === 'purchase').reduce((s, p) => s + p.amount, 0);
    const sales = payments.filter(p => p.payment_type === 'sales').reduce((s, p) => s + p.amount, 0);
    return { purchase, sales, net: sales - purchase };
  }, [payments]);

  return (
    <div className="space-y-4">
      <PageHeader title="المدفوعات" subtitle={`${payments.length} دفعة مسجلة`}>
        <Button onClick={() => setOpen(true)} className="gradient-secondary text-secondary-foreground gap-2 font-bold">
          <Plus className="w-4 h-4" /> دفعة جديدة
        </Button>
      </PageHeader>

      <PaymentFormDialog open={open} onOpenChange={setOpen} />
      <PaymentsKPIs {...totals} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as 'all' | 'purchase' | 'sales')}>
        <TabsList>
          <TabsTrigger value="all">الكل ({payments.length})</TabsTrigger>
          <TabsTrigger value="purchase">للموردين</TabsTrigger>
          <TabsTrigger value="sales">من العملاء</TabsTrigger>
        </TabsList>
        <TabsContent value={tab} className="mt-3">
          {filtered.length === 0 ? (
            <EmptyState message="لا توجد دفعات بعد. أضف دفعة جديدة لبدء التتبع." />
          ) : (
            <PaymentsTable payments={filtered} onDelete={setDeleteId} />
          )}
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}
        title="حذف الدفعة" description="سيتم تحديث رصيد الفاتورة تلقائياً."
        confirmText="حذف"
        onConfirm={async () => { if (deleteId) { await deletePayment(deleteId); toast({ title: 'تم الحذف' }); setDeleteId(null); } }}
        variant="destructive"
      />
    </div>
  );
}
