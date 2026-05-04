import { Trash2 } from 'lucide-react';
import { formatNumber } from '@/lib/helpers';
import { useAppStore } from '@/store/useAppStore';
import { PAYMENT_METHODS } from './PaymentFormDialog';
import type { Payment } from '@/store/useAppStore';

interface Props { payments: Payment[]; onDelete: (id: string) => void; }

export default function PaymentsTable({ payments, onDelete }: Props) {
  const { purchaseInvoices, salesInvoices } = useAppStore();
  const findInvoiceLabel = (p: Payment) => {
    const list = p.payment_type === 'purchase' ? purchaseInvoices : salesInvoices;
    const inv = list.find(i => i.id === p.invoice_id);
    return inv?.invoice_number || p.invoice_id.slice(0, 8);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card">
      <table className="w-full text-xs sm:text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="p-2 text-right font-semibold">التاريخ</th>
            <th className="p-2 text-right font-semibold">النوع</th>
            <th className="p-2 text-right font-semibold">الفاتورة</th>
            <th className="p-2 text-right font-semibold">المبلغ</th>
            <th className="p-2 text-right font-semibold hidden sm:table-cell">الطريقة</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-t border-border hover:bg-muted/30">
              <td className="p-2 font-mono">{p.date}</td>
              <td className="p-2">
                <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${p.payment_type === 'purchase' ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'}`}>
                  {p.payment_type === 'purchase' ? 'مورد' : 'عميل'}
                </span>
              </td>
              <td className="p-2 font-mono text-xs">{findInvoiceLabel(p)}</td>
              <td className="p-2 font-bold">{formatNumber(p.amount)} {p.currency}</td>
              <td className="p-2 hidden sm:table-cell">{PAYMENT_METHODS[p.payment_method] || p.payment_method}</td>
              <td className="p-2">
                <button onClick={() => onDelete(p.id)} className="p-1 rounded hover:bg-destructive/10 text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
