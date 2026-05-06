import { MapPin, Calendar, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { StatusBadge } from '@/components/shared';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Trip } from '@/types';

interface Props { trip: Trip; index: number; onEdit: (t: Trip) => void; onDelete: (id: string) => void; }

export default function TripCard({ trip, index: i, onEdit, onDelete }: Props) {
  return (
    <div}}}
      className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-sm">{trip.name}</h4>
        <div className="flex items-center gap-1">
          <StatusBadge status={trip.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(trip)}><Edit2 className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(trip.id)}>
                <Trash2 className="w-4 h-4 ml-2" />حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="font-medium">{trip.city}، {trip.country}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span>{trip.start_date} → {trip.end_date}</span>
        </div>
      </div>
      {trip.notes && (
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 line-clamp-2">{trip.notes}</p>
      )}
    </div>
  );
}
