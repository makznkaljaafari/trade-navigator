import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';

interface Props {
  pnl: { sales: number; purchases: number; expenses: number; profit: number; margin: number };
}

export default function ReportKPIs({ pnl }: Props) {
  return (
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
  );
}
