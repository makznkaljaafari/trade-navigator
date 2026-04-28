import { useState, useCallback, useRef } from 'react';
import { Plus, Printer } from 'lucide-react';
import { PageHeader, EditableTable } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber, generateId } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { InvoiceSidebar } from '@/components/invoices/InvoiceSidebar';
import { InvoiceHeader } from '@/components/invoices/InvoiceHeader';

interface InvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  size: string;
}

interface Invoice {
  id: string;
  number: string;
  supplier: string;
  trip: string;
  date: string;
  items: InvoiceItem[];
}

const defaultInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2025-001',
    supplier: 'Guangzhou Auto Parts Co.',
    trip: 'قوانغتشو يناير 2025',
    date: '2025-01-20',
    items: [
      { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 8, sale_price: 15, size: 'قياسي' },
      { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 12, sale_price: 25, size: 'كبير' },
      { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 18, sale_price: 35, size: 'أمامي' },
    ],
  },
  {
    id: '2',
    number: 'INV-2025-002',
    supplier: 'Shanghai Brake Systems',
    trip: 'قوانغتشو يناير 2025',
    date: '2025-01-22',
    items: [
      { id: '4', product_name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', quantity: 1000, purchase_price: 5, sale_price: 12, size: 'قياسي' },
      { id: '5', product_name: 'سير مكيف', oem_number: '99332-10960', brand: 'Gates', quantity: 150, purchase_price: 10, sale_price: 22, size: '6PK1060' },
    ],
  },
];

export default function PurchasesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoices);
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
        ? { ...inv, items: [...inv.items, { id: generateId(), product_name: '', oem_number: '', brand: '', quantity: 0, purchase_price: 0, sale_price: 0, size: '' }] }
        : inv
    ));
  };

  const addInvoice = () => {
    const num = invoices.length + 1;
    const newInv: Invoice = {
      id: generateId(),
      number: `INV-2025-${String(num).padStart(3, '0')}`,
      supplier: 'مورد جديد',
      trip: '',
      date: new Date().toISOString().split('T')[0],
      items: [],
    };
    setInvoices([...invoices, newInv]);
    setActiveId(newInv.id);
  };

  const total = activeInvoice.items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);

  const columns: ColumnDef<InvoiceItem>[] = [
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

  const sidebarItems = invoices.map(inv => ({
    id: inv.id,
    number: inv.number,
    subtitle: inv.supplier,
    date: inv.date,
  }));

  return (
    <div className="space-y-4">
      <PageHeader title="فواتير الشراء">
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
          icon="file"
        />

        <div className="flex-1 space-y-4 min-w-0">
          <InvoiceHeader
            title={`فاتورة شراء #${activeInvoice.number}`}
            subtitle={`المورد: ${activeInvoice.supplier} • الرحلة: ${activeInvoice.trip}`}
            icon="file"
          />
          <EditableTable data={activeInvoice.items} columns={columns} onCellChange={onCellChange} footer={footer} />
        </div>
      </div>

      <div className="hidden print:block">
        <InvoicePrint
          ref={printRef}
          type="purchase"
          invoiceNumber={activeInvoice.number}
          date={activeInvoice.date}
          partyName={activeInvoice.supplier}
          items={activeInvoice.items.map(i => ({ ...i, price: i.purchase_price }))}
        />
      </div>
    </div>
  );
}
