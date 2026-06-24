import { Palette, Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useThemeStore } from '@/store/useThemeStore';

export function AppearanceTab() {
  const { isDark, toggle } = useThemeStore();
  return (
    <div className="bg-card rounded-xl border border-border/70 p-3.5 space-y-2.5 max-w-md shadow-card">
      <h3 className="font-bold text-[13px] flex items-center gap-2"><Palette className="w-3.5 h-3.5 text-primary" /> المظهر</h3>
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50 border border-border/60">
        <div className="flex items-center gap-2">
          {isDark ? <Moon className="w-3.5 h-3.5 text-primary" /> : <Sun className="w-3.5 h-3.5 text-secondary" />}
          <div>
            <p className="font-semibold text-[11px]">{isDark ? 'الوضع المظلم' : 'الوضع الفاتح'}</p>
            <p className="text-[9px] text-muted-foreground">تبديل سمة التطبيق</p>
          </div>
        </div>
        <Switch checked={isDark} onCheckedChange={toggle} />
      </div>
    </div>
  );
}
