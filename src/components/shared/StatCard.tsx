import { motion } from 'framer-motion';
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
    card: 'gradient-primary shadow-colored-primary gradient-card-shine',
    icon: 'bg-primary-foreground/15 text-primary-foreground',
    text: 'text-primary-foreground',
    sub: 'text-primary-foreground/70',
  },
  secondary: {
    card: 'gradient-secondary shadow-colored-secondary gradient-card-shine',
    icon: 'bg-secondary-foreground/15 text-secondary-foreground',
    text: 'text-secondary-foreground',
    sub: 'text-secondary-foreground/70',
  },
  accent: {
    card: 'gradient-accent shadow-colored-accent gradient-card-shine',
    icon: 'bg-accent-foreground/15 text-accent-foreground',
    text: 'text-accent-foreground',
    sub: 'text-accent-foreground/70',
  },
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = 'default', delay = 0 }: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl p-3 lg:p-4 ${config.card}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-[11px] lg:text-xs font-medium ${config.sub}`}>
          {title}
        </span>
        <div className={`p-1.5 lg:p-2 rounded-lg ${config.icon}`}>
          <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
        </div>
      </div>
      <div className={`text-base lg:text-lg font-extrabold ${config.text} tracking-tight`}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1.5 ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span className="text-[10px] font-semibold">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}
