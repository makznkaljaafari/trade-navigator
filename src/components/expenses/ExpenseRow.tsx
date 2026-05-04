import { motion } from 'framer-motion';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EXPENSE_CATEGORIES } from '@/constants';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import type { Expense } from '@/types';

interface Props { expense: Expense; index: number; onEdit: (e: Expense) => void; onDelete: (id: string) => void; }

export default function ExpenseRow({ expense: exp, index: i, onEdit, onDelete }: Props) {
  const cat = EXPENSE_CATEGORIES[exp.category];
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
      className="group bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cat?.style || ''}`}>{cat?.label || exp.category}</span>
        <div>
          <p className="text-sm font-medium">{exp.notes || 'بدون ملاحظات'}</p>
          <p className="text-xs text-muted-foreground">{exp.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="font-bold text-sm">{getCurrencySymbol(exp.currency as 'CNY' | 'USD' | 'SAR')}{formatNumber(exp.amount)}</p>
          {exp.currency === 'CNY' && (
            <p className="text-xs text-muted-foreground">${formatNumber(convertCurrency(exp.amount, 'CNY', 'USD'))}</p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(exp)}><Edit2 className="w-4 h-4 ml-2" />تعديل</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(exp.id)}>
              <Trash2 className="w-4 h-4 ml-2" />حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
