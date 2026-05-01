import { useState, useEffect, useRef } from 'react';
import { Plus, Printer, Trash2 } from 'lucide-react';
import { PageHeader, EditableTable, EmptyState } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { InvoiceSidebar } from '@/components/invoices/InvoiceSidebar';
import { InvoiceHeader } from '@/components/invoices/InvoiceHeader';
import { useAppStore, type PurchaseItem } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function PurchasesPage() {
  const { purchaseInvoices, suppliers, addPurchaseInvoice, addPurchaseItem, updatePurchaseItem, deletePurchaseItem, deletePurchaseInvoice } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId && purchaseInvoices.length > 0) setActiveId(purchaseInvoices[0].id);
  }, [purchaseInvoices, activeId]);

  const activeInvoice = purchaseInvoices.find(inv => inv.id === activeId);
  const supplierName = activeInvoice?.supplier_id
    ? suppliers.find(s => s.id === activeInvoice.supplier_id)?.name || 'غير محدد'
    : 'غير محدد';

  const handlePrint = () => window.print();

  const addRow = async () => {
    if (!activeId) return;
    await addPurchaseItem(activeId, { product_name: '', quantity: 0, purchase_price: 0, sale_price: 0 });
  };

  const addInvoice = async () => {
    const id = await addPurchaseInvoice({});
    if (id) { setActiveId(id); toast({ title: 'تم إنشاء فاتورة جديدة' }); }
  };

  const handleDeleteInvoice = async () => {
    if (!activeId) return;
    if (!confirm('حذف الفاتورة الحالية؟')) return;
    await deletePurchaseInvoice(activeId);
    setActiveId(null);
    toast({ title: 'تم الحذف' });
  };

  const items = activeInvoice?.items || [];
  const total = items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);

  const columns: ColumnDef<PurchaseItem>[] = [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total', header: 'الإجمالي', minWidth: '80px', editable: false, align: 'center', render: (row) => <span className="font-semibold">${formatNumber(row.quantity * row.purchase_price)}</span> },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={8} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(total)}</td>
    </tr>
  );

  const sidebarItems = purchaseInvoices.map(inv => ({
    id: inv.id,
    number: inv.invoice_number || '—',
    subtitle: suppliers.find(s => s.id === inv.supplier_id)?.name || '—',
    date: inv.date,
  }));

  return (
    <div className="space-y-4">
      <PageHeader title="فواتير الشراء" subtitle={`${purchaseInvoices.length} فاتورة`}>
        <div className="flex gap-2">
          {activeInvoice && (
            <>
              <Button onClick={handleDeleteInvoice} variant="outline" className="gap-2 text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Printer className="w-4 h-4" /> طباعة
              </Button>
              <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
                <Plus className="w-4 h-4" /> إضافة صف
              </Button>
            </>
          )}
        </div>
      </PageHeader>

      {purchaseInvoices.length === 0 ? (
        <EmptyState
          message="لا توجد فواتير شراء بعد"
          action={<Button onClick={addInvoice} className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4"/>إنشاء أول فاتورة</Button>}
        />
      ) : (
        <div className="flex gap-4">
          <InvoiceSidebar
            invoices={sidebarItems}
            activeId={activeId || ''}
            onSelect={setActiveId}
            onAdd={addInvoice}
            icon="file"
          />

          <div className="flex-1 space-y-4 min-w-0">
            {activeInvoice && (
              <>
                <InvoiceHeader
                  title={`فاتورة شراء #${activeInvoice.invoice_number || '—'}`}
                  subtitle={`المورد: ${supplierName} • التاريخ: ${activeInvoice.date}`}
                  icon="file"
                />
                <EditableTable
                  data={items}
                  columns={columns}
                  onCellChange={(id, field, value) => updatePurchaseItem(id as string, field, value)}
                  onDeleteRow={(id) => deletePurchaseItem(id as string)}
                  footer={footer}
                />
              </>
            )}
          </div>
        </div>
      )}

      {activeInvoice && (
        <div className="hidden print:block">
          <InvoicePrint
            ref={printRef}
            type="purchase"
            invoiceNumber={activeInvoice.invoice_number || ''}
            date={activeInvoice.date}
            partyName={supplierName}
            items={items.map(i => ({ ...i, price: i.purchase_price }))}
          />
        </div>
      )}
    </div>
  );
}
