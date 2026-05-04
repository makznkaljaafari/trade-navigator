import { Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';

export default function PaymentsKPIs({ purchase, sales, net }: { purchase: number; sales: number; net: number; }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <div className="bg-card border border-border rounded-xl p-3 shadow-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <ArrowUpCircle className="w-3.5 h-3.5 text-destructive" /> مدفوع للموردين
        </div>
        <div className="text-base sm:text-lg font-extrabold text-destructive">{formatNumber(purchase)}</div>
      </div>
      <div className="bg-card border border-border rounded-xl p-3 shadow-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <ArrowDownCircle className="w-3.5 h-3.5 text-accent" /> مستلم من العملاء
        </div>
        <div className="text-base sm:text-lg font-extrabold text-accent">{formatNumber(sales)}</div>
      </div>
      <div className="bg-card border border-border rounded-xl p-3 shadow-card">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Wallet className="w-3.5 h-3.5 text-primary" /> الصافي
        </div>
        <div className={`text-base sm:text-lg font-extrabold ${net >= 0 ? 'text-accent' : 'text-destructive'}`}>{formatNumber(net)}</div>
      </div>
    </div>
  );
}
