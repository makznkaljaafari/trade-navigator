import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getCutoffDate, calcPnL, calcTopProducts, calcCustomerDebts,
  calcSupplierDebts, calcSalesTrend,
} from '@/lib/reportCalculations';
import ReportKPIs from '@/components/reports/ReportKPIs';
import SalesTrendChart from '@/components/reports/SalesTrendChart';
import TopProductsChart from '@/components/reports/TopProductsChart';
import ExpensesPieChart from '@/components/reports/ExpensesPieChart';
import DebtsList from '@/components/reports/DebtsList';
import LowStockAlert from '@/components/reports/LowStockAlert';

export default function ReportsPage() {
  const { purchaseInvoices, salesInvoices, expenses, products, suppliers, settings } = useAppStore();
  const [period, setPeriod] = useState<'all' | '30' | '90' | '365'>('all');

  const cutoff = useMemo(() => getCutoffDate(period), [period]);
  const pnl = useMemo(() => calcPnL(salesInvoices, purchaseInvoices, expenses, cutoff), [salesInvoices, purchaseInvoices, expenses, cutoff]);
  const topProducts = useMemo(() => calcTopProducts(salesInvoices, cutoff), [salesInvoices, cutoff]);
  const customerDebts = useMemo(() => calcCustomerDebts(salesInvoices), [salesInvoices]);
  const supplierDebts = useMemo(() => calcSupplierDebts(purchaseInvoices, suppliers), [purchaseInvoices, suppliers]);
  const salesTrend = useMemo(() => calcSalesTrend(salesInvoices, purchaseInvoices), [salesInvoices, purchaseInvoices]);
  const lowStock = useMemo(() => {
    const t = settings?.low_stock_threshold || 10;
    return products.filter(p => p.quantity > 0 && p.quantity < t);
  }, [products, settings]);

  return (
    <div className="space-y-4">
      <PageHeader title="التقارير والتحليلات" subtitle="تقارير شاملة لأداء عملك" />

      <Tabs value={period} onValueChange={(v) => setPeriod(v as 'all' | '30' | '90' | '365')}>
        <TabsList>
          <TabsTrigger value="30">آخر 30 يوم</TabsTrigger>
          <TabsTrigger value="90">آخر 90 يوم</TabsTrigger>
          <TabsTrigger value="365">آخر سنة</TabsTrigger>
          <TabsTrigger value="all">الكل</TabsTrigger>
        </TabsList>
      </Tabs>

      <ReportKPIs pnl={pnl} />
      <SalesTrendChart data={salesTrend} />

      <div className="grid lg:grid-cols-2 gap-3">
        <TopProductsChart data={topProducts} />
        <ExpensesPieChart pnl={pnl} />
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        <DebtsList title="ديون العملاء (مستحقة)" debts={customerDebts} emptyText="لا توجد ديون مستحقة 🎉" variant="destructive" />
        <DebtsList title="مستحقات الموردين" debts={supplierDebts} emptyText="لا توجد مستحقات 🎉" variant="secondary" />
      </div>

      <LowStockAlert products={lowStock} />
    </div>
  );
}
