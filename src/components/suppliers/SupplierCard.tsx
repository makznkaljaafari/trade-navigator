import { Phone, MessageCircle, Building2, MapPin, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { StarRating } from '@/components/shared';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/store/useAppStore';
import type { Supplier } from '@/types';

interface Props {
  supplier: Supplier;
  index: number;
  onEdit: (s: Supplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierCard({ supplier: sup, index: i, onEdit, onDelete }: Props) {
  const updateSupplier = useAppStore(s => s.updateSupplier);
  return (
    <div
      className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
            {sup.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-sm">{sup.name}</h4>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="w-3 h-3" />{sup.company_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(sup)}><Edit2 className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(sup.id)}>
                <Trash2 className="w-4 h-4 ml-2" />حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary rounded-lg px-2 py-0.5 text-[11px] font-semibold">
          {sup.product_category}
        </span>
        <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[11px]">
          <MapPin className="w-3 h-3" />{sup.city}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
          <Phone className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-foreground">{sup.phone}</span>
        </div>
        {sup.wechat_or_whatsapp && (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
            <MessageCircle className="w-3.5 h-3.5 text-accent" />
            <span className="font-mono text-foreground">{sup.wechat_or_whatsapp}</span>
          </div>
        )}
      </div>
    </div>
  );
}
