import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, RefreshCw, Palette, Moon, Sun } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const { toast } = useToast();
  const { isDark, toggle } = useThemeStore();
  const { settings, saveSettings } = useAppStore();

  const [company, setCompany] = useState({
    company_name: '', company_phone: '', company_email: '', company_address: '',
  });
  const [rates, setRates] = useState({
    rate_cny_usd: '0.14', rate_cny_sar: '0.52', rate_usd_sar: '3.75',
  });

  useEffect(() => {
    if (settings) {
      setCompany({
        company_name: settings.company_name || '',
        company_phone: settings.company_phone || '',
        company_email: settings.company_email || '',
        company_address: settings.company_address || '',
      });
      setRates({
        rate_cny_usd: String(settings.rate_cny_usd),
        rate_cny_sar: String(settings.rate_cny_sar),
        rate_usd_sar: String(settings.rate_usd_sar),
      });
    }
  }, [settings]);

  const saveCompany = async () => {
    await saveSettings(company);
    toast({ title: 'تم الحفظ', description: 'تم حفظ معلومات الشركة بنجاح' });
  };

  const saveRates = async () => {
    await saveSettings({
      rate_cny_usd: Number(rates.rate_cny_usd),
      rate_cny_sar: Number(rates.rate_cny_sar),
      rate_usd_sar: Number(rates.rate_usd_sar),
    });
    toast({ title: 'تم الحفظ', description: 'تم تحديث أسعار الصرف بنجاح' });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="الإعدادات" />

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" /> الشركة</TabsTrigger>
          <TabsTrigger value="currency" className="gap-2"><RefreshCw className="w-4 h-4" /> العملات</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" /> المظهر</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-2xl">
            <h3 className="font-bold text-lg">معلومات الشركة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">اسم الشركة</Label>
                <Input value={company.company_name} onChange={e => setCompany({ ...company, company_name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">رقم الهاتف</Label>
                <Input value={company.company_phone} onChange={e => setCompany({ ...company, company_phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">البريد الإلكتروني</Label>
                <Input value={company.company_email} onChange={e => setCompany({ ...company, company_email: e.target.value })} />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">العنوان</Label>
                <Input value={company.company_address} onChange={e => setCompany({ ...company, company_address: e.target.value })} />
              </div>
            </div>
            <Button onClick={saveCompany} className="gradient-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> حفظ
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="currency">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-2xl">
            <h3 className="font-bold text-lg">أسعار الصرف</h3>
            <p className="text-xs text-muted-foreground">أدخل أسعار الصرف الأساسية المستخدمة في حسابات النظام</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">يوان → دولار</Label>
                <Input type="number" step="0.0001" value={rates.rate_cny_usd} onChange={e => setRates({ ...rates, rate_cny_usd: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">يوان → ريال</Label>
                <Input type="number" step="0.0001" value={rates.rate_cny_sar} onChange={e => setRates({ ...rates, rate_cny_sar: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">دولار → ريال</Label>
                <Input type="number" step="0.0001" value={rates.rate_usd_sar} onChange={e => setRates({ ...rates, rate_usd_sar: e.target.value })} className="font-mono" />
              </div>
            </div>
            <Button onClick={saveRates} className="gradient-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> حفظ الأسعار
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-md">
            <h3 className="font-bold text-lg">المظهر</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-secondary" />}
                <div>
                  <p className="font-semibold text-sm">{isDark ? 'الوضع المظلم' : 'الوضع الفاتح'}</p>
                  <p className="text-xs text-muted-foreground">تبديل مظهر التطبيق</p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggle} />
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
