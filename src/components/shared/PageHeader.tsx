import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-2.5 lg:mb-3 gap-2"
    >
      <div className="min-w-0">
        <h3 className="text-sm lg:text-base font-extrabold tracking-tight truncate">{title}</h3>
        {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
      </div>
      {children && <div className="flex gap-1.5 shrink-0">{children}</div>}
    </motion.div>
  );
}
