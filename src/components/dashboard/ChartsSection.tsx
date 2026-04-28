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
    borderRadius: '10px',
    fontSize: 11,
  };

  return (
    <div className="grid lg:grid-cols-2 gap-3">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <h3 className="font-bold text-xs flex items-center gap-1.5 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-primary" />
          المشتريات مقابل المبيعات
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`$${formatNumber(value)}`, '']} />
              <Bar dataKey="purchases" name="المشتريات" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
              <Bar dataKey="sales" name="المبيعات" fill="hsl(var(--accent))" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border/60 p-4 shadow-card">
        <h3 className="font-bold text-xs flex items-center gap-1.5 mb-3">
          <DollarSign className="w-3.5 h-3.5 text-secondary" />
          توزيع المصاريف
        </h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expensesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                style={{ fontSize: 10 }}
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
