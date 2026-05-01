import { useState, useEffect, useRef } from 'react';
import { Plus, Printer, Trash2 } from 'lucide-react';
import { PageHeader, EditableTable, EmptyState } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { InvoiceSidebar } from '@/components/invoices/InvoiceSidebar';
import { InvoiceHeader } from '@/components/invoices/InvoiceHeader';
import { useAppStore, type SalesItem } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function SalesPage() {
  const { salesInvoices, addSalesInvoice, addSalesItem, updateSalesItem, deleteSalesItem, deleteSalesInvoice } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId && salesInvoices.length > 0) setActiveId(salesInvoices[0].id);
  }, [salesInvoices, activeId]);

  const activeInvoice = salesInvoices.find(inv => inv.id === activeId);

  const handlePrint = () => window.print();

  const addRow = async () => {
    if (!activeId) return;
    await addSalesItem(activeId, { product_name: '', quantity: 0, sale_price: 0 });
  };

  const addInvoice = async () => {
    const id = await addSalesInvoice({});
    if (id) { setActiveId(id); toast({ title: 'تم إنشاء فاتورة جديدة' }); }
  };

  const handleDeleteInvoice = async () => {
    if (!activeId) return;
    if (!confirm('حذف الفاتورة الحالية؟')) return;
    await deleteSalesInvoice(activeId);
    setActiveId(null);
    toast({ title: 'تم الحذف' });
  };

  const items = activeInvoice?.items || [];
  const total = items.reduce((s, i) => s + i.quantity * i.sale_price, 0);

  const columns: ColumnDef<SalesItem>[] = [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total', header: 'الإجمالي', minWidth: '80px', editable: false, align: 'center', render: (row) => <span className="font-semibold">${formatNumber(row.quantity * row.sale_price)}</span> },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={7} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(total)}</td>
    </tr>
  );

  const sidebarItems = salesInvoices.map(inv => ({
    id: inv.id,
    number: inv.invoice_number || '—',
    subtitle: inv.customer_name || '—',
    date: inv.date,
  }));

  return (
    <div className="space-y-4">
      <PageHeader title="فواتير البيع" subtitle={`${salesInvoices.length} فاتورة`}>
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

      {salesInvoices.length === 0 ? (
        <EmptyState
          message="لا توجد فواتير بيع بعد"
          action={{ label: 'إنشاء أول فاتورة', onClick: addInvoice }}
        />
      ) : (
        <div className="flex gap-4">
          <InvoiceSidebar
            invoices={sidebarItems}
            activeId={activeId || ''}
            onSelect={setActiveId}
            onAdd={addInvoice}
            icon="receipt"
          />

          <div className="flex-1 space-y-4 min-w-0">
            {activeInvoice && (
              <>
                <InvoiceHeader
                  title={`فاتورة بيع #${activeInvoice.invoice_number || '—'}`}
                  subtitle={`العميل: ${activeInvoice.customer_name || '—'} • التاريخ: ${activeInvoice.date}`}
                  icon="receipt"
                />
                <EditableTable
                  data={items}
                  columns={columns}
                  onCellChange={(id, field, value) => updateSalesItem(id as string, field, value)}
                  onDeleteRow={(id) => deleteSalesItem(id as string)}
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
            type="sale"
            invoiceNumber={activeInvoice.invoice_number || ''}
            date={activeInvoice.date}
            partyName={activeInvoice.customer_name || ''}
            items={items.map(i => ({ ...i, price: i.sale_price }))}
          />
        </div>
      )}
    </div>
  );
}
