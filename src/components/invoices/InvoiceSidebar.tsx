import { Plus, FileText, Receipt, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface InvoiceListItem {
  id: string;
  number: string;
  subtitle: string;
  date: string;
}

interface InvoiceSidebarProps {
  invoices: InvoiceListItem[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  icon?: 'file' | 'receipt';
}

export function InvoiceSidebar({ invoices, activeId, onSelect, onAdd, icon = 'file' }: InvoiceSidebarProps) {
  const Icon: LucideIcon = icon === 'receipt' ? Receipt : FileText;

  return (
    <div className="w-52 shrink-0 space-y-1">
      <Button onClick={onAdd} size="sm" className="w-full gap-1.5 mb-2 h-8 text-xs gradient-primary text-primary-foreground">
        <Plus className="w-3.5 h-3.5" /> فاتورة جديدة
      </Button>
      <div className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-0.5">
        {invoices.map(inv => {
          const isActive = inv.id === activeId;
          return (
            <button
              key={inv.id}
              onClick={() => onSelect(inv.id)}
              className={`w-full text-right p-2 rounded-lg border transition-all ${
                isActive
                  ? 'bg-primary/10 border-primary/40 shadow-sm ring-1 ring-primary/20'
                  : 'bg-card border-border/60 hover:bg-muted/50 hover:border-border'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md shrink-0 ${isActive ? 'gradient-primary' : 'bg-muted'}`}>
                  <Icon className={`w-3 h-3 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[11px] truncate leading-tight">{inv.number}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{inv.subtitle}</p>
                  <p className="text-[9px] text-muted-foreground/70 mt-0.5 font-mono">{inv.date}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
