import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

export default function ReportsPage() {
  const { purchaseInvoices, salesInvoices, expenses, products, customers, suppliers, settings } = useAppStore();
  const [period, setPeriod] = useState<'all' | '30' | '90' | '365'>('all');

  const cutoffDate = useMemo(() => {
    if (period === 'all') return null;
    const d = new Date();
    d.setDate(d.getDate() - Number(period));
    return d.toISOString().split('T')[0];
  }, [period]);

  const filterByDate = <T extends { date: string }>(items: T[]) =>
    cutoffDate ? items.filter(i => i.date >= cutoffDate) : items;

  // ---- P&L ----
  const pnl = useMemo(() => {
    const sales = filterByDate(salesInvoices).reduce((s, inv) => {
      const total = inv.items?.reduce((t, it) => t + it.quantity * it.sale_price, 0) || 0;
      return s + convertCurrency(total, inv.currency as any, 'USD');
    }, 0);
    const purchases = filterByDate(purchaseInvoices).reduce((s, inv) => {
      const total = inv.items?.reduce((t, it) => t + it.quantity * it.purchase_price, 0) || 0;
      return s + convertCurrency(total, inv.currency as any, 'USD');
    }, 0);
    const exp = filterByDate(expenses).reduce((s, e) => s + convertCurrency(e.amount, e.currency as any, 'USD'), 0);
    const profit = sales - purchases - exp;
    const margin = sales > 0 ? (profit / sales) * 100 : 0;
    return { sales, purchases, expenses: exp, profit, margin };
  }, [salesInvoices, purchaseInvoices, expenses, cutoffDate]);

  // ---- Top products ----
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    filterByDate(salesInvoices).forEach(inv => {
      inv.items?.forEach(it => {
        const k = it.product_name;
        const rev = convertCurrency(it.quantity * it.sale_price, inv.currency as any, 'USD');
        map[k] = map[k] || { name: k, qty: 0, revenue: 0 };
        map[k].qty += it.quantity;
        map[k].revenue += rev;
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
  }, [salesInvoices, cutoffDate]);

  // ---- Customer debts ----
  const customerDebts = useMemo(() => {
    const map: Record<string, { name: string; total: number; paid: number; due: number }> = {};
    salesInvoices.forEach(inv => {
      const total = convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0, inv.currency as any, 'USD');
      const paid = convertCurrency(inv.paid_amount, inv.currency as any, 'USD');
      const name = inv.customer_name || 'عميل غير معروف';
      map[name] = map[name] || { name, total: 0, paid: 0, due: 0 };
      map[name].total += total;
      map[name].paid += paid;
      map[name].due += total - paid;
    });
    return Object.values(map).filter(c => c.due > 0.01).sort((a, b) => b.due - a.due);
  }, [salesInvoices]);

  // ---- Supplier debts ----
  const supplierDebts = useMemo(() => {
    const map: Record<string, { name: string; total: number; paid: number; due: number }> = {};
    purchaseInvoices.forEach(inv => {
      const sup = suppliers.find(s => s.id === inv.supplier_id);
      const name = sup?.name || 'بدون مورد';
      const total = convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0, inv.currency as any, 'USD');
      const paid = convertCurrency(inv.paid_amount, inv.currency as any, 'USD');
      map[name] = map[name] || { name, total: 0, paid: 0, due: 0 };
      map[name].total += total;
      map[name].paid += paid;
      map[name].due += total - paid;
    });
    return Object.values(map).filter(c => c.due > 0.01).sort((a, b) => b.due - a.due);
  }, [purchaseInvoices, suppliers]);

  // ---- Sales over time (last 6 months) ----
  const salesTrend = useMemo(() => {
    const months: Record<string, { month: string; sales: number; purchases: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { month: d.toLocaleDateString('ar', { month: 'short' }), sales: 0, purchases: 0 };
    }
    salesInvoices.forEach(inv => {
      const k = inv.date.slice(0, 7);
      if (months[k]) months[k].sales += convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0, inv.currency as any, 'USD');
    });
    purchaseInvoices.forEach(inv => {
      const k = inv.date.slice(0, 7);
      if (months[k]) months[k].purchases += convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0, inv.currency as any, 'USD');
    });
    return Object.values(months);
  }, [salesInvoices, purchaseInvoices]);

  // ---- Low stock ----
  const lowStockProducts = useMemo(() => {
    const threshold = settings?.low_stock_threshold || 10;
    return products.filter(p => p.quantity > 0 && p.quantity < threshold);
  }, [products, settings]);

  return (
    <div className="space-y-4">
      <PageHeader title="التقارير والتحليلات" subtitle="تقارير شاملة لأداء عملك" />

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList>
          <TabsTrigger value="30">آخر 30 يوم</TabsTrigger>
          <TabsTrigger value="90">آخر 90 يوم</TabsTrigger>
          <TabsTrigger value="365">آخر سنة</TabsTrigger>
          <TabsTrigger value="all">الكل</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-accent" /> المبيعات
          </div>
          <div className="text-base sm:text-lg font-extrabold">${formatNumber(pnl.sales)}</div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-destructive" /> المشتريات + المصروفات
          </div>
          <div className="text-base sm:text-lg font-extrabold">${formatNumber(pnl.purchases + pnl.expenses)}</div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <DollarSign className="w-3.5 h-3.5 text-primary" /> صافي الربح
          </div>
          <div className={`text-base sm:text-lg font-extrabold ${pnl.profit >= 0 ? 'text-accent' : 'text-destructive'}`}>
            ${formatNumber(pnl.profit)}
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-secondary" /> هامش الربح
          </div>
          <div className={`text-base sm:text-lg font-extrabold ${pnl.margin >= 0 ? 'text-accent' : 'text-destructive'}`}>
            {pnl.margin.toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Trend chart */}
      <Card className="p-3 sm:p-4">
        <h3 className="font-bold text-sm mb-3">المبيعات والمشتريات (آخر 6 أشهر)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="sales" stroke="hsl(var(--accent))" strokeWidth={2} name="مبيعات" />
            <Line type="monotone" dataKey="purchases" stroke="hsl(var(--destructive))" strokeWidth={2} name="مشتريات" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-3">
        {/* Top products */}
        <Card className="p-3 sm:p-4">
          <h3 className="font-bold text-sm mb-3">أفضل 10 منتجات مبيعاً</h3>
          {topProducts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">لا توجد بيانات مبيعات</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(180, topProducts.length * 28)}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" name="الإيرادات $" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* P&L breakdown */}
        <Card className="p-3 sm:p-4">
          <h3 className="font-bold text-sm mb-3">توزيع المصاريف</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'مشتريات', value: pnl.purchases },
                  { name: 'مصروفات تشغيل', value: pnl.expenses },
                  { name: 'ربح', value: Math.max(0, pnl.profit) },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={(e) => `${e.name}: ${formatNumber(Number(e.value))}`}
              >
                {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-3">
        {/* Customer debts */}
        <Card className="p-3 sm:p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" /> ديون العملاء (مستحقة)
          </h3>
          {customerDebts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">لا توجد ديون مستحقة 🎉</p>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-auto">
              {customerDebts.map(c => (
                <div key={c.name} className="flex items-center justify-between p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                  <div className="text-xs">
                    <div className="font-bold">{c.name}</div>
                    <div className="text-muted-foreground">دفع ${formatNumber(c.paid)} من ${formatNumber(c.total)}</div>
                  </div>
                  <div className="font-extrabold text-destructive text-sm">${formatNumber(c.due)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Supplier debts */}
        <Card className="p-3 sm:p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-secondary" /> مستحقات الموردين
          </h3>
          {supplierDebts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">لا توجد مستحقات 🎉</p>
          ) : (
            <div className="space-y-1.5 max-h-64 overflow-auto">
              {supplierDebts.map(s => (
                <div key={s.name} className="flex items-center justify-between p-2 bg-secondary/5 rounded-lg border border-secondary/20">
                  <div className="text-xs">
                    <div className="font-bold">{s.name}</div>
                    <div className="text-muted-foreground">دفع ${formatNumber(s.paid)} من ${formatNumber(s.total)}</div>
                  </div>
                  <div className="font-extrabold text-secondary text-sm">${formatNumber(s.due)}</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Low stock */}
      {lowStockProducts.length > 0 && (
        <Card className="p-3 sm:p-4 border-destructive/30 bg-destructive/5">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" /> منتجات مخزونها منخفض
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {lowStockProducts.map(p => (
              <div key={p.id} className="bg-card p-2 rounded-lg border border-border text-xs">
                <div className="font-bold truncate">{p.name}</div>
                <div className="text-destructive font-extrabold">{p.quantity} متبقي</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
