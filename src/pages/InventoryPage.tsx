import { useState, useMemo } from 'react';
import { PageHeader, EditableTable, SearchBar, ExportButton } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { InventoryItem } from '@/types';
import { formatNumber } from '@/lib/helpers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Filter, X, Package } from 'lucide-react';

export default function InventoryPage() {
  const { inventory, settings } = useAppStore();
  const [showLowOnly, setShowLowOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const threshold = settings?.low_stock_threshold || 10;

  const brands = useMemo(() => [...new Set(inventory.map(i => i.brand).filter(Boolean))], [inventory]);

  const lowStockItems = useMemo(
    () => inventory.filter(i => i.quantity_available > 0 && i.quantity_available < threshold),
    [inventory, threshold]
  );
  const outOfStockItems = useMemo(() => inventory.filter(i => i.quantity_available <= 0), [inventory]);

  const filtered = useMemo(() => {
    let arr = showLowOnly ? lowStockItems : inventory;
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(i =>
        i.product_name.toLowerCase().includes(q) ||
        i.oem_number.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q)
      );
    }
    if (brandFilter !== 'all') arr = arr.filter(i => i.brand === brandFilter);
    return arr;
  }, [inventory, lowStockItems, showLowOnly, search, brandFilter]);

  const totalAvailable = filtered.reduce((s, i) => s + i.quantity_available, 0);
  const totalValue = filtered.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);
  const totalCost = filtered.reduce((s, i) => s + i.quantity_available * i.purchase_price, 0);

  const columns: ColumnDef<InventoryItem>[] = [
    { key: 'product_name', header: 'المنتج', editable: false, minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', editable: false, mono: true, minWidth: '100px' },
    { key: 'brand', header: 'العلامة', editable: false, minWidth: '80px' },
    { key: 'quantity_purchased', header: 'مشترى', editable: false, align: 'center' },
    { key: 'quantity_sold', header: 'مباع', editable: false, align: 'center' },
    {
      key: 'quantity_available', header: 'متوفر', align: 'center',
      render: (row) => {
        const isLow = row.quantity_available > 0 && row.quantity_available < threshold;
        const isOut = row.quantity_available <= 0;
        return (
          <span className={`font-bold ${isOut ? 'text-destructive' : isLow ? 'text-secondary' : 'text-accent'}`}>
            {row.quantity_available}
            {isLow && <span className="ml-1">⚠</span>}
            {isOut && <span className="ml-1">⛔</span>}
          </span>
        );
      },
    },
    { key: 'purchase_price', header: 'شراء', editable: false, align: 'center', render: (row) => <span>${row.purchase_price}</span> },
    { key: 'sale_price', header: 'بيع', editable: false, align: 'center', render: (row) => <span>${row.sale_price}</span> },
    {
      key: 'value', header: 'القيمة', align: 'center',
      render: (row) => <span className="font-semibold">${formatNumber(row.quantity_available * row.sale_price)}</span>,
    },
  ];

  const exportColumns = [
    { key: 'product_name', header: 'المنتج' },
    { key: 'oem_number', header: 'رقم OEM' },
    { key: 'brand', header: 'العلامة' },
    { key: 'quantity_purchased', header: 'مشترى' },
    { key: 'quantity_sold', header: 'مباع' },
    { key: 'quantity_available', header: 'متوفر' },
    { key: 'purchase_price', header: 'سعر الشراء' },
    { key: 'sale_price', header: 'سعر البيع' },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={5} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">{formatNumber(totalAvailable)}</td>
      <td colSpan={2} className="spreadsheet-cell text-center text-xs text-muted-foreground">تكلفة: ${formatNumber(totalCost)}</td>
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(totalValue)}</td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="المخزون" subtitle={`${inventory.length} منتج · حد التنبيه: ${threshold}`}>
        <ExportButton data={filtered} columns={exportColumns} filename="المخزون" />
        <Button
          variant={showLowOnly ? 'default' : 'outline'}
          onClick={() => setShowLowOnly(!showLowOnly)}
          className="gap-2"
          size="sm"
        >
          {showLowOnly ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          {showLowOnly ? 'عرض الكل' : `منخفض (${lowStockItems.length})`}
        </Button>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="bg-card rounded-xl p-3 border border-border shadow-card">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><Package className="w-3 h-3" /> منتجات</div>
          <div className="text-lg font-extrabold text-primary">{inventory.length}</div>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border shadow-card">
          <div className="text-xs text-muted-foreground flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> منخفض</div>
          <div className="text-lg font-extrabold text-secondary">{lowStockItems.length}</div>
        </div>
        <div className="bg-card rounded-xl p-3 border border-border shadow-card">
          <div className="text-xs text-muted-foreground">نفذ</div>
          <div className="text-lg font-extrabold text-destructive">{outOfStockItems.length}</div>
        </div>
      </div>

      <SearchBar
        placeholder="ابحث عن منتج أو OEM..."
        value={search}
        onChange={setSearch}
        filters={brands.length > 0 ? [{
          key: 'brand',
          label: 'العلامة',
          options: brands.map(b => ({ value: b, label: b })),
          value: brandFilter,
          onChange: setBrandFilter,
        }] : []}
      />

      {lowStockItems.length > 0 && !showLowOnly && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold text-sm">تنبيه: مخزون منخفض</AlertTitle>
          <AlertDescription className="text-xs">
            {lowStockItems.length} منتج بمخزون أقل من {threshold} وحدة.
          </AlertDescription>
        </Alert>
      )}

      <EditableTable data={filtered} columns={columns} footer={footer} />
    </div>
  );
}
