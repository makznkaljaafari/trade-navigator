import { FileText, Receipt, LucideIcon } from 'lucide-react';

interface InvoiceHeaderProps {
  title: string;
  subtitle: string;
  icon?: 'file' | 'receipt';
}

export function InvoiceHeader({ title, subtitle, icon = 'file' }: InvoiceHeaderProps) {
  const Icon: LucideIcon = icon === 'receipt' ? Receipt : FileText;

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg gradient-secondary">
          <Icon className="w-4 h-4 text-secondary-foreground" />
        </div>
        <div>
          <h4 className="font-bold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
