import { motion } from 'framer-motion';
import { BarChart3, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { formatNumber } from '@/lib/helpers';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--info))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

interface ChartsSectionProps {
  barChartData: { name: string; purchases: number; sales: number }[];
  expensesByCategory: { name: string; value: number }[];
}

export function ChartsSection({ barChartData, expensesByCategory }: ChartsSectionProps) {
  const tooltipStyle = {
    background: 'hsl(var(--card))',
    border: '1px solid hsl(var(--border))',
    borderRadius: '12px',
    fontSize: 12,
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-primary" />
          المشتريات مقابل المبيعات
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${formatNumber(value)}`, '']} />
              <Bar dataKey="purchases" name="المشتريات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" name="المبيعات" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
        <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-secondary" />
          توزيع المصاريف
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {expensesByCategory.map((_, idx) => (
                  <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${value}`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
