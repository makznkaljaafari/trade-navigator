import { useState, useEffect } from 'react';
import { RefreshCw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { SettingsField } from './SettingsField';

const card = "bg-card rounded-xl border border-border/70 p-3.5 space-y-2.5 max-w-2xl shadow-card";

export function CurrencyTab() {
  const { settings, saveSettings } = useAppStore();
  const { toast } = useToast();
  const [rates, setRates] = useState({ rate_cny_usd: '0.14', rate_cny_sar: '0.52', rate_usd_sar: '3.75' });

  useEffect(() => {
    if (settings) setRates({
      rate_cny_usd: String(settings.rate_cny_usd),
      rate_cny_sar: String(settings.rate_cny_sar),
      rate_usd_sar: String(settings.rate_usd_sar),
    });
  }, [settings]);

  const save = async () => {
    await saveSettings({
      rate_cny_usd: Number(rates.rate_cny_usd),
      rate_cny_sar: Number(rates.rate_cny_sar),
      rate_usd_sar: Number(rates.rate_usd_sar),
    });
    toast({ title: 'تم الحفظ', description: 'أسعار الصرف محدثة' });
  };

  return (
    <div className={card}>
      <h3 className="font-bold text-[13px] flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-primary" /> أسعار الصرف</h3>
      <p className="text-[10px] text-muted-foreground">أساس حسابات تحويل العملات في كامل النظام.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <SettingsField label="يوان → دولار" value={rates.rate_cny_usd} onChange={v => setRates({ ...rates, rate_cny_usd: v })} type="number" mono />
        <SettingsField label="يوان → ريال" value={rates.rate_cny_sar} onChange={v => setRates({ ...rates, rate_cny_sar: v })} type="number" mono />
        <SettingsField label="دولار → ريال" value={rates.rate_usd_sar} onChange={v => setRates({ ...rates, rate_usd_sar: v })} type="number" mono />
      </div>
      <Button onClick={save} size="sm" className="gradient-primary text-primary-foreground gap-2 h-7 text-[11px]">
        <Save className="w-3 h-3" /> حفظ الأسعار
      </Button>
    </div>
  );
}
