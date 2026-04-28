import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { EXPENSE_CATEGORIES } from '@/constants';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { FinancialStats } from '@/components/dashboard/FinancialStats';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { QuickCounts } from '@/components/dashboard/QuickCounts';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  const { trips, suppliers, shipments, inventory, expenses } = useAppStore();

  const totalPurchases = inventory.reduce((s, i) => s + i.quantity_purchased * i.purchase_price, 0);
  const totalSales = inventory.reduce((s, i) => s + i.quantity_sold * i.sale_price, 0);
  const totalExpenses = expenses.reduce((s, e) => s + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD'), 0);
  const totalProfit = totalSales - totalPurchases - totalExpenses;
  const inventoryValue = inventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);
  const profitMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;
  const inTransitCount = shipments.filter(s => s.status === 'in_transit').length;

  const barChartData = inventory.map(item => ({
    name: item.product_name.length > 12 ? item.product_name.slice(0, 12) + '…' : item.product_name,
    purchases: item.quantity_purchased * item.purchase_price,
    sales: item.quantity_sold * item.sale_price,
  }));

  const expensesByCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD');
      return acc;
    }, {})
  ).map(([cat, value]) => ({
    name: EXPENSE_CATEGORIES[cat]?.label || cat,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6">
      <WelcomeHero profitMargin={profitMargin} productsCount={inventory.length} inTransitCount={inTransitCount} />
      <FinancialStats totalPurchases={totalPurchases} totalSales={totalSales} totalProfit={totalProfit} inventoryValue={inventoryValue} />
      <ChartsSection barChartData={barChartData} expensesByCategory={expensesByCategory} />
      <QuickCounts trips={trips.length} suppliers={suppliers.length} shipments={shipments.length} products={inventory.length} />
      <RecentActivity trips={trips} suppliers={suppliers} shipments={shipments} inventory={inventory} />
    </div>
  );
}
