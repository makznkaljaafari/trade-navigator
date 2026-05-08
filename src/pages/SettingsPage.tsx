import { useState, useEffect } from 'react';
import { Save, Building2, RefreshCw, Palette, Moon, Sun, Database, UserCircle, LogOut, Download, Upload, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { toast } = useToast();
  const { isDark, toggle } = useThemeStore();
  const store = useAppStore();
  const { settings, saveSettings } = store;
  const { user, signOut } = useAuth();

  const [company, setCompany] = useState({ company_name: '', company_phone: '', company_email: '', company_address: '' });
  const [rates, setRates] = useState({ rate_cny_usd: '0.14', rate_cny_sar: '0.52', rate_usd_sar: '3.75' });

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
    toast({ title: 'تم الحفظ', description: 'معلومات الشركة محدثة' });
  };

  const saveRates = async () => {
    await saveSettings({
      rate_cny_usd: Number(rates.rate_cny_usd),
      rate_cny_sar: Number(rates.rate_cny_sar),
      rate_usd_sar: Number(rates.rate_usd_sar),
    });
    toast({ title: 'تم الحفظ', description: 'أسعار الصرف محدثة' });
  };

  const exportData = () => {
    const data = {
      exported_at: new Date().toISOString(),
      trips: store.trips, suppliers: store.suppliers, customers: store.customers,
      products: store.products, shipments: store.shipments, expenses: store.expenses,
      purchaseInvoices: store.purchaseInvoices, salesInvoices: store.salesInvoices,
      quotations: store.quotations, payments: store.payments, settings: store.settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autoparts-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'تم التصدير', description: 'تم تنزيل ملف النسخة الاحتياطية' });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({ title: 'تم تسجيل الخروج' });
  };

  const sectionCard = "bg-card rounded-xl border border-border/70 p-4 space-y-3 max-w-2xl shadow-card";

  return (
    <div className="space-y-3">
      <PageHeader title="الإعدادات" subtitle="إدارة الشركة، العملات، الحساب والمظهر" />

      <Tabs defaultValue="company" className="space-y-3">
        <TabsList className="bg-muted/50 flex-wrap h-auto p-1 gap-0.5">
          <TabsTrigger value="company" className="gap-1.5 text-[11px]"><Building2 className="w-3.5 h-3.5" /> الشركة</TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5 text-[11px]"><RefreshCw className="w-3.5 h-3.5" /> العملات</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-[11px]"><Palette className="w-3.5 h-3.5" /> المظهر</TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5 text-[11px]"><UserCircle className="w-3.5 h-3.5" /> الحساب</TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5 text-[11px]"><Database className="w-3.5 h-3.5" /> البيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <div className={sectionCard}>
            <h3 className="font-bold text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> معلومات الشركة</h3>
            <p className="text-[11px] text-muted-foreground">تظهر هذه البيانات في الفواتير وعروض الأسعار المطبوعة.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="اسم الشركة" value={company.company_name} onChange={v => setCompany({ ...company, company_name: v })} />
              <Field label="رقم الهاتف" value={company.company_phone} onChange={v => setCompany({ ...company, company_phone: v })} />
              <Field label="البريد الإلكتروني" value={company.company_email} onChange={v => setCompany({ ...company, company_email: v })} />
              <Field label="العنوان" value={company.company_address} onChange={v => setCompany({ ...company, company_address: v })} className="sm:col-span-1" />
            </div>
            <Button onClick={saveCompany} size="sm" className="gradient-primary text-primary-foreground gap-2 h-8 text-xs">
              <Save className="w-3.5 h-3.5" /> حفظ التغييرات
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="currency">
          <div className={sectionCard}>
            <h3 className="font-bold text-sm flex items-center gap-2"><RefreshCw className="w-4 h-4 text-primary" /> أسعار الصرف</h3>
            <p className="text-[11px] text-muted-foreground">أساس حسابات تحويل العملات في كامل النظام.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="يوان → دولار" value={rates.rate_cny_usd} onChange={v => setRates({ ...rates, rate_cny_usd: v })} type="number" mono />
              <Field label="يوان → ريال" value={rates.rate_cny_sar} onChange={v => setRates({ ...rates, rate_cny_sar: v })} type="number" mono />
              <Field label="دولار → ريال" value={rates.rate_usd_sar} onChange={v => setRates({ ...rates, rate_usd_sar: v })} type="number" mono />
            </div>
            <Button onClick={saveRates} size="sm" className="gradient-primary text-primary-foreground gap-2 h-8 text-xs">
              <Save className="w-3.5 h-3.5" /> حفظ الأسعار
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className={`${sectionCard} max-w-md`}>
            <h3 className="font-bold text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-primary" /> المظهر</h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/60">
              <div className="flex items-center gap-2.5">
                {isDark ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-secondary" />}
                <div>
                  <p className="font-semibold text-xs">{isDark ? 'الوضع المظلم' : 'الوضع الفاتح'}</p>
                  <p className="text-[10px] text-muted-foreground">تبديل سمة التطبيق</p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggle} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className={`${sectionCard} max-w-md`}>
            <h3 className="font-bold text-sm flex items-center gap-2"><UserCircle className="w-4 h-4 text-primary" /> الحساب</h3>
            <div className="p-3 rounded-lg bg-muted/40 border border-border/60 space-y-2">
              <Row label="البريد الإلكتروني" value={user?.email || '—'} mono />
              <Row label="معرف المستخدم" value={user?.id?.slice(0, 13) + '…' || '—'} mono />
              <Row label="آخر دخول" value={user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ar') : '—'} />
            </div>
            <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">حسابك محمي بمصادقة آمنة وكلمات مرور مشفرة. بياناتك مخزّنة بشكل خاص.</p>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full gap-2 h-8 text-xs text-destructive border-destructive/40 hover:bg-destructive/10">
              <LogOut className="w-3.5 h-3.5" /> تسجيل الخروج
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className={sectionCard}>
            <h3 className="font-bold text-sm flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> البيانات والنسخ الاحتياطي</h3>
            <p className="text-[11px] text-muted-foreground">قم بتنزيل نسخة احتياطية كاملة من جميع بيانات النظام بصيغة JSON.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatBox label="موردين" value={store.suppliers.length} />
              <StatBox label="عملاء" value={store.customers.length} />
              <StatBox label="منتجات" value={store.products.length} />
              <StatBox label="فواتير" value={store.purchaseInvoices.length + store.salesInvoices.length} />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={exportData} size="sm" className="gap-2 h-8 text-xs gradient-primary text-primary-foreground">
                <Download className="w-3.5 h-3.5" /> تصدير نسخة احتياطية
              </Button>
              <Button size="sm" variant="outline" disabled className="gap-2 h-8 text-xs">
                <Upload className="w-3.5 h-3.5" /> استيراد (قريباً)
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', mono, className = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; className?: string }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label className="text-[11px] font-semibold text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`h-8 text-xs ${mono ? 'font-mono tabular-nums' : ''}`}
        step={type === 'number' ? '0.0001' : undefined}
      />
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${mono ? 'font-mono tabular-nums' : ''}`}>{value}</span>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-center">
      <p className="text-lg font-extrabold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
