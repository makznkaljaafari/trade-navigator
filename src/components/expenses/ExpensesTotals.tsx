import { formatNumber } from '@/lib/helpers';

export default function ExpensesTotals({ totalCNY, totalUSD, totalSAR }: { totalCNY: number; totalUSD: number; totalSAR: number; }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">إجمالي باليوان</p>
        <p className="text-xl font-bold mt-1">¥{formatNumber(totalCNY)}</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">إجمالي بالدولار</p>
        <p className="text-xl font-bold mt-1">${formatNumber(totalUSD)}</p>
      </div>
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">إجمالي بالريال</p>
        <p className="text-xl font-bold mt-1">ر.س{formatNumber(totalSAR)}</p>
      </div>
    </div>
  );
}
