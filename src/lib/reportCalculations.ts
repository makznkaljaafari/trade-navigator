import { convertCurrency } from '@/lib/currency';
import type { PurchaseInvoice, SalesInvoice, Payment } from '@/store/types';
import type { Expense, Supplier } from '@/types';

type Currency = 'CNY' | 'USD' | 'SAR';

export const filterByDate = <T extends { date: string }>(items: T[], cutoff: string | null) =>
  cutoff ? items.filter(i => i.date >= cutoff) : items;

export const getCutoffDate = (period: 'all' | '30' | '90' | '365'): string | null => {
  if (period === 'all') return null;
  const d = new Date();
  d.setDate(d.getDate() - Number(period));
  return d.toISOString().split('T')[0];
};

export const calcPnL = (
  sales: SalesInvoice[],
  purchases: PurchaseInvoice[],
  expenses: Expense[],
  cutoff: string | null,
) => {
  const s = filterByDate(sales, cutoff).reduce((sum, inv) => {
    const total = inv.items?.reduce((t, it) => t + it.quantity * it.sale_price, 0) || 0;
    return sum + convertCurrency(total, inv.currency as Currency, 'USD');
  }, 0);
  const p = filterByDate(purchases, cutoff).reduce((sum, inv) => {
    const total = inv.items?.reduce((t, it) => t + it.quantity * it.purchase_price, 0) || 0;
    return sum + convertCurrency(total, inv.currency as Currency, 'USD');
  }, 0);
  const e = filterByDate(expenses, cutoff).reduce(
    (sum, ex) => sum + convertCurrency(ex.amount, ex.currency as Currency, 'USD'), 0,
  );
  const profit = s - p - e;
  const margin = s > 0 ? (profit / s) * 100 : 0;
  return { sales: s, purchases: p, expenses: e, profit, margin };
};

export const calcTopProducts = (sales: SalesInvoice[], cutoff: string | null) => {
  const map: Record<string, { name: string; qty: number; revenue: number }> = {};
  filterByDate(sales, cutoff).forEach(inv => {
    inv.items?.forEach(it => {
      const k = it.product_name;
      const rev = convertCurrency(it.quantity * it.sale_price, inv.currency as Currency, 'USD');
      map[k] = map[k] || { name: k, qty: 0, revenue: 0 };
      map[k].qty += it.quantity;
      map[k].revenue += rev;
    });
  });
  return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 10);
};

export const calcCustomerDebts = (sales: SalesInvoice[]) => {
  const map: Record<string, { name: string; total: number; paid: number; due: number }> = {};
  sales.forEach(inv => {
    const total = convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0, inv.currency as Currency, 'USD');
    const paid = convertCurrency(inv.paid_amount, inv.currency as Currency, 'USD');
    const name = inv.customer_name || 'عميل غير معروف';
    map[name] = map[name] || { name, total: 0, paid: 0, due: 0 };
    map[name].total += total; map[name].paid += paid; map[name].due += total - paid;
  });
  return Object.values(map).filter(c => c.due > 0.01).sort((a, b) => b.due - a.due);
};

export const calcSupplierDebts = (purchases: PurchaseInvoice[], suppliers: Supplier[]) => {
  const map: Record<string, { name: string; total: number; paid: number; due: number }> = {};
  purchases.forEach(inv => {
    const sup = suppliers.find(s => s.id === inv.supplier_id);
    const name = sup?.name || 'بدون مورد';
    const total = convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0, inv.currency as Currency, 'USD');
    const paid = convertCurrency(inv.paid_amount, inv.currency as Currency, 'USD');
    map[name] = map[name] || { name, total: 0, paid: 0, due: 0 };
    map[name].total += total; map[name].paid += paid; map[name].due += total - paid;
  });
  return Object.values(map).filter(c => c.due > 0.01).sort((a, b) => b.due - a.due);
};

export const calcSalesTrend = (sales: SalesInvoice[], purchases: PurchaseInvoice[]) => {
  const months: Record<string, { month: string; sales: number; purchases: number }> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    months[key] = { month: d.toLocaleDateString('ar', { month: 'short' }), sales: 0, purchases: 0 };
  }
  sales.forEach(inv => {
    const k = inv.date.slice(0, 7);
    if (months[k]) months[k].sales += convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.sale_price, 0) || 0, inv.currency as Currency, 'USD');
  });
  purchases.forEach(inv => {
    const k = inv.date.slice(0, 7);
    if (months[k]) months[k].purchases += convertCurrency(inv.items?.reduce((s, it) => s + it.quantity * it.purchase_price, 0) || 0, inv.currency as Currency, 'USD');
  });
  return Object.values(months);
};
