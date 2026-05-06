import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  delay?: number;
}

const variantConfig = {
  default: {
    card: 'bg-card border border-border shadow-card',
    icon: 'bg-muted text-muted-foreground',
    text: 'text-foreground',
    sub: 'text-muted-foreground',
  },
  primary: {
    card: 'gradient-primary shadow-colored-primary',
    icon: 'bg-primary-foreground/15 text-primary-foreground',
    text: 'text-primary-foreground',
    sub: 'text-primary-foreground/70',
  },
  secondary: {
    card: 'gradient-secondary shadow-colored-secondary',
    icon: 'bg-secondary-foreground/15 text-secondary-foreground',
    text: 'text-secondary-foreground',
    sub: 'text-secondary-foreground/70',
  },
  accent: {
    card: 'gradient-accent shadow-colored-accent',
    icon: 'bg-accent-foreground/15 text-accent-foreground',
    text: 'text-accent-foreground',
    sub: 'text-accent-foreground/70',
  },
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = 'default' }: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <div className={`rounded-lg p-2.5 lg:p-3 ${config.card}`}>
      <div className="flex items-start justify-between mb-1.5">
        <span className={`text-[10px] lg:text-[11px] font-medium ${config.sub}`}>{title}</span>
        <div className={`p-1 lg:p-1.5 rounded-md ${config.icon}`}>
          <Icon className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
        </div>
      </div>
      <div className={`text-sm lg:text-base font-extrabold ${config.text} tracking-tight tabular-nums`}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-0.5 mt-1 ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trendUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          <span className="text-[9px] font-semibold">{trend}</span>
        </div>
      )}
    </div>
  );
}
