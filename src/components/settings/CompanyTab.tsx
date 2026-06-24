import { useState, useEffect } from 'react';
import { Building2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';
import { SettingsField } from './SettingsField';

const card = "bg-card rounded-xl border border-border/70 p-3.5 space-y-2.5 max-w-2xl shadow-card";

export function CompanyTab() {
  const { settings, saveSettings } = useAppStore();
  const { toast } = useToast();
  const [company, setCompany] = useState({ company_name: '', company_phone: '', company_email: '', company_address: '' });

  useEffect(() => {
    if (settings) setCompany({
      company_name: settings.company_name || '',
      company_phone: settings.company_phone || '',
      company_email: settings.company_email || '',
      company_address: settings.company_address || '',
    });
  }, [settings]);

  const save = async () => {
    await saveSettings(company);
    toast({ title: 'تم الحفظ', description: 'معلومات الشركة محدثة' });
  };

  return (
    <div className={card}>
      <h3 className="font-bold text-[13px] flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-primary" /> معلومات الشركة</h3>
      <p className="text-[10px] text-muted-foreground">تظهر هذه البيانات في الفواتير وعروض الأسعار المطبوعة.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <SettingsField label="اسم الشركة" value={company.company_name} onChange={v => setCompany({ ...company, company_name: v })} />
        <SettingsField label="رقم الهاتف" value={company.company_phone} onChange={v => setCompany({ ...company, company_phone: v })} />
        <SettingsField label="البريد الإلكتروني" value={company.company_email} onChange={v => setCompany({ ...company, company_email: v })} />
        <SettingsField label="العنوان" value={company.company_address} onChange={v => setCompany({ ...company, company_address: v })} />
      </div>
      <Button onClick={save} size="sm" className="gradient-primary text-primary-foreground gap-2 h-7 text-[11px]">
        <Save className="w-3 h-3" /> حفظ التغييرات
      </Button>
    </div>
  );
}
