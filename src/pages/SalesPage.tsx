import { useState, useCallback, useRef } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader, EditableTable } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber, generateId } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { InvoiceSidebar } from '@/components/invoices/InvoiceSidebar';
import { InvoiceHeader } from '@/components/invoices/InvoiceHeader';

interface SaleItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  sale_price: number;
  size: string;
}

interface SalesInvoice {
  id: string;
  number: string;
  customer: string;
  date: string;
  items: SaleItem[];
}

const defaultInvoices: SalesInvoice[] = [
  {
    id: '1',
    number: 'SALE-2025-001',
    customer: 'أحمد محمد',
    date: '2025-03-01',
    items: [
      { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 100, sale_price: 15, size: 'قياسي' },
      { id: '2', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 30, sale_price: 35, size: 'أمامي' },
    ],
  },
  {
    id: '2',
    number: 'SALE-2025-002',
    customer: 'محمد علي',
    date: '2025-03-05',
    items: [
      { id: '3', product_name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', quantity: 200, sale_price: 12, size: 'قياسي' },
      { id: '4', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 50, sale_price: 25, size: 'كبير' },
    ],
  },
];

export default function SalesPage() {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(defaultInvoices);
  const [activeId, setActiveId] = useState(defaultInvoices[0].id);
  const printRef = useRef<HTMLDivElement>(null);

  const activeInvoice = invoices.find(inv => inv.id === activeId)!;

  const handlePrint = () => window.print();

  const onCellChange = useCallback((id: string, field: string, value: string | number) => {
    setInvoices(prev => prev.map(inv =>
      inv.id === activeId
        ? { ...inv, items: inv.items.map(item => item.id === id ? { ...item, [field]: value } : item) }
        : inv
    ));
  }, [activeId]);

  const addRow = () => {
    setInvoices(prev => prev.map(inv =>
      inv.id === activeId
        ? { ...inv, items: [...inv.items, { id: generateId(), product_name: '', oem_number: '', brand: '', quantity: 0, sale_price: 0, size: '' }] }
        : inv
    ));
  };

  const addInvoice = () => {
    const num = invoices.length + 1;
    const newInv: SalesInvoice = {
      id: generateId(),
      number: `SALE-2025-${String(num).padStart(3, '0')}`,
      customer: 'عميل جديد',
      date: new Date().toISOString().split('T')[0],
      items: [],
    };
    setInvoices([...invoices, newInv]);
    setActiveId(newInv.id);
  };

  const total = activeInvoice.items.reduce((s, i) => s + i.quantity * i.sale_price, 0);

  const columns: ColumnDef<SaleItem>[] = [
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

  const sidebarItems = invoices.map(inv => ({
    id: inv.id,
    number: inv.number,
    subtitle: inv.customer,
    date: inv.date,
  }));

  return (
    <div className="space-y-4">
      <PageHeader title="فواتير البيع">
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> طباعة
          </Button>
          <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة صف
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-4">
        <InvoiceSidebar
          invoices={sidebarItems}
          activeId={activeId}
          onSelect={setActiveId}
          onAdd={addInvoice}
          icon="receipt"
        />

        <div className="flex-1 space-y-4 min-w-0">
          <InvoiceHeader
            title={`فاتورة بيع #${activeInvoice.number}`}
            subtitle={`العميل: ${activeInvoice.customer} • التاريخ: ${activeInvoice.date}`}
            icon="receipt"
          />
          <EditableTable data={activeInvoice.items} columns={columns} onCellChange={onCellChange} footer={footer} />
        </div>
      </div>

      <div className="hidden print:block">
        <InvoicePrint
          ref={printRef}
          type="sale"
          invoiceNumber={activeInvoice.number}
          date={activeInvoice.date}
          partyName={activeInvoice.customer}
          items={activeInvoice.items.map(i => ({ ...i, price: i.sale_price }))}
        />
      </div>
    </div>
  );
}
