import { ReactNode } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicroDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  footer?: ReactNode;
  children: ReactNode;
}

const sizeMap = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

/**
 * Compact micro-dialog with sticky header + scrollable body + sticky footer.
 * Designed for forms with many fields without ballooning vertical space.
 */
export function MicroDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  size = 'sm',
  footer,
  children,
}: MicroDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className={cn(
          'p-0 gap-0 overflow-hidden rounded-xl border-border/70 shadow-xl',
          'max-h-[88vh] flex flex-col',
          sizeMap[size]
        )}
      >
        {/* Sticky header */}
        <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-border/60 bg-muted/30 shrink-0">
          {icon && (
            <div className="p-1.5 rounded-md gradient-primary text-primary-foreground shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <DialogPrimitive.Title className="font-extrabold text-xs leading-tight truncate">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="text-[10px] text-muted-foreground truncate">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close className="p-1 rounded-md hover:bg-muted transition-colors shrink-0">
            <X className="w-3.5 h-3.5" />
          </DialogPrimitive.Close>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {children}
        </div>

        {/* Sticky footer */}
        {footer && (
          <div className="border-t border-border/60 bg-muted/20 px-4 py-2.5 flex items-center justify-end gap-2 shrink-0">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
