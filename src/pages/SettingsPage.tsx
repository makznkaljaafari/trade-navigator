import { Building2, RefreshCw, Palette, Database, UserCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyTab } from '@/components/settings/CompanyTab';
import { CurrencyTab } from '@/components/settings/CurrencyTab';
import { AppearanceTab } from '@/components/settings/AppearanceTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { DataTab } from '@/components/settings/DataTab';

export default function SettingsPage() {
  return (
    <div className="space-y-2.5">
      <PageHeader title="الإعدادات" subtitle="إدارة الشركة، العملات، الحساب والمظهر" />

      <Tabs defaultValue="company" className="space-y-2.5">
        <TabsList className="bg-muted/50 flex-wrap h-auto p-1 gap-0.5">
          <TabsTrigger value="company" className="gap-1.5 text-[10px]"><Building2 className="w-3 h-3" /> الشركة</TabsTrigger>
          <TabsTrigger value="currency" className="gap-1.5 text-[10px]"><RefreshCw className="w-3 h-3" /> العملات</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5 text-[10px]"><Palette className="w-3 h-3" /> المظهر</TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5 text-[10px]"><UserCircle className="w-3 h-3" /> الحساب</TabsTrigger>
          <TabsTrigger value="data" className="gap-1.5 text-[10px]"><Database className="w-3 h-3" /> البيانات</TabsTrigger>
        </TabsList>

        <TabsContent value="company"><CompanyTab /></TabsContent>
        <TabsContent value="currency"><CurrencyTab /></TabsContent>
        <TabsContent value="appearance"><AppearanceTab /></TabsContent>
        <TabsContent value="account"><AccountTab /></TabsContent>
        <TabsContent value="data"><DataTab /></TabsContent>
      </Tabs>
    </div>
  );
}
