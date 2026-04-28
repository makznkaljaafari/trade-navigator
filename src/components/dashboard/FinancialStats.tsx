import { StatCard } from '@/components/shared';
import { formatNumber } from '@/lib/helpers';
import { DollarSign, ShoppingCart, TrendingUp, Warehouse } from 'lucide-react';

interface FinancialStatsProps {
  totalPurchases: number;
  totalSales: number;
  totalProfit: number;
  inventoryValue: number;
}

export function FinancialStats({ totalPurchases, totalSales, totalProfit, inventoryValue }: FinancialStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      <StatCard title="إجمالي المشتريات" value={`$${formatNumber(totalPurchases)}`} icon={ShoppingCart} variant="primary" delay={0.05} />
      <StatCard title="إجمالي المبيعات" value={`$${formatNumber(totalSales)}`} icon={DollarSign} variant="secondary" delay={0.1} />
      <StatCard title="صافي الربح" value={`$${formatNumber(totalProfit)}`} icon={TrendingUp} variant="accent" trend="+23% من الرحلة السابقة" trendUp delay={0.15} />
      <StatCard title="قيمة المخزون" value={`$${formatNumber(inventoryValue)}`} icon={Warehouse} delay={0.2} />
    </div>
  );
}
