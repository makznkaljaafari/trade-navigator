import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function TopProductsChart({ data }: { data: { name: string; qty: number; revenue: number }[] }) {
  return (
    <Card className="p-3 sm:p-4">
      <h3 className="font-bold text-sm mb-3">أفضل 10 منتجات مبيعاً</h3>
      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">لا توجد بيانات مبيعات</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, data.length * 28)}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
            <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: 12 }} />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="الإيرادات $" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
