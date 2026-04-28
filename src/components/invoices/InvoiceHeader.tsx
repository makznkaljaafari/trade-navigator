import { FileText, Receipt, LucideIcon } from 'lucide-react';

interface InvoiceHeaderProps {
  title: string;
  subtitle: string;
  icon?: 'file' | 'receipt';
}

export function InvoiceHeader({ title, subtitle, icon = 'file' }: InvoiceHeaderProps) {
  const Icon: LucideIcon = icon === 'receipt' ? Receipt : FileText;

  return (
    <div className="bg-card rounded-lg border border-border/60 p-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-md gradient-secondary">
          <Icon className="w-3.5 h-3.5 text-secondary-foreground" />
        </div>
        <div>
          <h4 className="font-bold text-xs">{title}</h4>
          <p className="text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
