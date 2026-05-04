import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatNumber } from '@/lib/helpers';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

interface Props {
  pnl: { purchases: number; expenses: number; profit: number };
}

export default function ExpensesPieChart({ pnl }: Props) {
  const data = [
    { name: 'مشتريات', value: pnl.purchases },
    { name: 'مصروفات تشغيل', value: pnl.expenses },
    { name: 'ربح', value: Math.max(0, pnl.profit) },
  ];
  return (
    <Card className="p-3 sm:p-4">
      <h3 className="font-bold text-sm mb-3">توزيع المصاريف</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
            label={(e) => `${e.name}: ${formatNumber(Number(e.value))}`}>
            {[0, 1, 2].map((i) => <Cell key={i} fill={COLORS[i]} />)}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
