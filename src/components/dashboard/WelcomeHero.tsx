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
      className="gradient-hero rounded-2xl p-5 lg:p-8 text-sidebar-foreground relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-primary blur-3xl" />
      </div>
      <div className="relative z-10">
        <p className="text-sidebar-foreground/50 text-sm font-medium mb-1">مرحباً بك 👋</p>
        <h1 className="text-xl lg:text-2xl font-extrabold mb-1">نظام إدارة الاستيراد</h1>
        <p className="text-sidebar-foreground/50 text-sm max-w-lg">
          تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد
        </p>
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
            <Activity className="w-4 h-4 text-secondary" />
            <div>
              <p className="text-[10px] text-sidebar-foreground/50">هامش الربح</p>
              <p className="text-sm font-bold">{profitMargin}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            <div>
              <p className="text-[10px] text-sidebar-foreground/50">المنتجات النشطة</p>
              <p className="text-sm font-bold">{productsCount}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
            <Ship className="w-4 h-4 text-info" />
            <div>
              <p className="text-[10px] text-sidebar-foreground/50">شحنات في الطريق</p>
              <p className="text-sm font-bold">{inTransitCount}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
