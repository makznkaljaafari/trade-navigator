import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function SalesTrendChart({ data }: { data: { month: string; sales: number; purchases: number }[] }) {
  return (
    <Card className="p-3 sm:p-4">
      <h3 className="font-bold text-sm mb-3">المبيعات والمشتريات (آخر 6 أشهر)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
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
  );
}
