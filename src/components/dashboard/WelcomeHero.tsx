import { motion } from 'framer-motion';
import { Activity, BarChart3, Ship } from 'lucide-react';

interface WelcomeHeroProps {
  profitMargin: number;
  productsCount: number;
  inTransitCount: number;
}

export function WelcomeHero({ profitMargin, productsCount, inTransitCount }: WelcomeHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-hero rounded-xl p-4 lg:p-6 text-sidebar-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-8 w-28 h-28 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-16 w-32 h-32 rounded-full bg-primary blur-3xl" />
      </div>
      <div className="relative z-10">
        <p className="text-sidebar-foreground/50 text-xs font-medium mb-0.5">مرحباً بك 👋</p>
        <h1 className="text-base lg:text-xl font-extrabold mb-0.5">نظام إدارة الاستيراد</h1>
        <p className="text-sidebar-foreground/50 text-xs max-w-lg">
          تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <div className="flex items-center gap-1.5 bg-sidebar-foreground/10 rounded-lg px-2.5 py-1.5">
            <Activity className="w-3.5 h-3.5 text-secondary" />
            <div>
              <p className="text-[9px] text-sidebar-foreground/50 leading-tight">هامش الربح</p>
              <p className="text-xs font-bold leading-tight">{profitMargin}%</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-sidebar-foreground/10 rounded-lg px-2.5 py-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-accent" />
            <div>
              <p className="text-[9px] text-sidebar-foreground/50 leading-tight">المنتجات النشطة</p>
              <p className="text-xs font-bold leading-tight">{productsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-sidebar-foreground/10 rounded-lg px-2.5 py-1.5">
            <Ship className="w-3.5 h-3.5 text-info" />
            <div>
              <p className="text-[9px] text-sidebar-foreground/50 leading-tight">شحنات في الطريق</p>
              <p className="text-xs font-bold leading-tight">{inTransitCount}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
