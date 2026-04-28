import { motion } from 'framer-motion';
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
    <div className="w-64 shrink-0 space-y-2">
      <Button onClick={onAdd} variant="outline" className="w-full gap-2 mb-2">
        <Plus className="w-4 h-4" /> فاتورة جديدة
      </Button>
      {invoices.map((inv, i) => {
        const isActive = inv.id === activeId;
        return (
          <motion.button
            key={inv.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(inv.id)}
            className={`w-full text-right p-3 rounded-xl border transition-all ${
              isActive
                ? 'bg-primary/10 border-primary/30 shadow-sm'
                : 'bg-card border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${isActive ? 'gradient-primary' : 'bg-muted'}`}>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{inv.number}</p>
                <p className="text-[10px] text-muted-foreground truncate">{inv.subtitle}</p>
                <p className="text-[10px] text-muted-foreground">{inv.date}</p>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
