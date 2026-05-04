import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';

interface Debt { name: string; total: number; paid: number; due: number; }

interface Props {
  title: string;
  debts: Debt[];
  emptyText: string;
  variant: 'destructive' | 'secondary';
}

export default function DebtsList({ title, debts, emptyText, variant }: Props) {
  const colorClass = variant === 'destructive' ? 'text-destructive' : 'text-secondary';
  const bgClass = variant === 'destructive' ? 'bg-destructive/5 border-destructive/20' : 'bg-secondary/5 border-secondary/20';
  return (
    <Card className="p-3 sm:p-4">
      <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
        <AlertCircle className={`w-4 h-4 ${colorClass}`} /> {title}
      </h3>
      {debts.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">{emptyText}</p>
      ) : (
        <div className="space-y-1.5 max-h-64 overflow-auto">
          {debts.map(c => (
            <div key={c.name} className={`flex items-center justify-between p-2 rounded-lg border ${bgClass}`}>
              <div className="text-xs">
                <div className="font-bold">{c.name}</div>
                <div className="text-muted-foreground">دفع ${formatNumber(c.paid)} من ${formatNumber(c.total)}</div>
              </div>
              <div className={`font-extrabold text-sm ${colorClass}`}>${formatNumber(c.due)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
