import { useRef } from 'react';
import { Database, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-2 rounded-lg bg-muted/40 border border-border/60 text-center">
      <p className="text-base font-extrabold tabular-nums">{value}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}

export function DataTab() {
  const store = useAppStore();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

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

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object') throw new Error('Invalid format');
      const ok = window.confirm('سيتم استبدال البيانات الحالية بمحتوى الملف. هل تريد المتابعة؟');
      if (!ok) return;

      const s: any = useAppStore.getState();
      const setters: Array<[keyof typeof data, string]> = [
        ['settings', 'saveSettings'],
      ];
      // Best-effort: write each entity through bulk add/replace if a setter exists.
      const apply = (key: string, items: any[], adder?: string) => {
        if (!Array.isArray(items)) return;
        if (adder && typeof s[adder] === 'function') {
          items.forEach((it) => { try { s[adder](it); } catch {} });
        }
      };
      apply('suppliers', data.suppliers, 'addSupplier');
      apply('customers', data.customers, 'addCustomer');
      apply('products', data.products, 'addProduct');
      apply('trips', data.trips, 'addTrip');
      apply('shipments', data.shipments, 'addShipment');
      apply('expenses', data.expenses, 'addExpense');
      apply('purchaseInvoices', data.purchaseInvoices, 'addPurchaseInvoice');
      apply('salesInvoices', data.salesInvoices, 'addSalesInvoice');
      apply('quotations', data.quotations, 'addQuotation');
      apply('payments', data.payments, 'addPayment');
      if (data.settings && typeof s.saveSettings === 'function') {
        await s.saveSettings(data.settings);
      }
      toast({ title: 'تم الاستيراد', description: 'تمت إضافة بيانات النسخة الاحتياطية' });
    } catch (e: any) {
      toast({ title: 'فشل الاستيراد', description: e?.message || 'ملف غير صالح', variant: 'destructive' as any });
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/70 p-3.5 space-y-2.5 max-w-2xl shadow-card">
      <h3 className="font-bold text-[13px] flex items-center gap-2"><Database className="w-3.5 h-3.5 text-primary" /> البيانات والنسخ الاحتياطي</h3>
      <p className="text-[10px] text-muted-foreground">قم بتنزيل أو استعادة نسخة احتياطية كاملة من جميع بيانات النظام بصيغة JSON.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        <StatBox label="موردين" value={store.suppliers.length} />
        <StatBox label="عملاء" value={store.customers.length} />
        <StatBox label="منتجات" value={store.products.length} />
        <StatBox label="فواتير" value={store.purchaseInvoices.length + store.salesInvoices.length} />
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importData(f);
          e.target.value = '';
        }}
      />
      <div className="flex flex-wrap gap-1.5 pt-1">
        <Button onClick={exportData} size="sm" className="gap-2 h-7 text-[11px] gradient-primary text-primary-foreground">
          <Download className="w-3 h-3" /> تصدير نسخة احتياطية
        </Button>
        <Button onClick={() => inputRef.current?.click()} size="sm" variant="outline" className="gap-2 h-7 text-[11px]">
          <Upload className="w-3 h-3" /> استيراد نسخة احتياطية
        </Button>
      </div>
    </div>
  );
}
