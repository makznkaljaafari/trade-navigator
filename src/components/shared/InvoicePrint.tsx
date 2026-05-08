import { forwardRef } from 'react';

interface PrintItem {
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  price: number;
  size: string;
}

interface InvoicePrintProps {
  type: 'purchase' | 'sale' | 'quotation';
  invoiceNumber: string;
  date: string;
  partyName: string;
  items: PrintItem[];
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  taxNumber?: string;
  notes?: string;
  currency?: string;
}

const titleMap = {
  purchase: 'فاتورة شراء',
  sale: 'فاتورة بيع',
  quotation: 'عرض سعر',
};

const partyLabelMap = {
  purchase: 'المورد',
  sale: 'العميل',
  quotation: 'العميل',
};

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(
  ({
    type, invoiceNumber, date, partyName, items, notes, currency = '$',
    companyName = 'AutoParts',
    companyAddress = 'الرياض، المملكة العربية السعودية',
    companyPhone = '+966 50 000 0000',
    taxNumber = '300000000000003',
  }, ref) => {
    const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const vat = subtotal * 0.15;
    const total = subtotal + vat;

    return (
      <div ref={ref} className="print-invoice p-10 bg-white text-black" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {/* Header band */}
        <div className="flex justify-between items-start pb-5 mb-6 border-b-4" style={{ borderColor: '#1e3a8a' }}>
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg"
              style={{ background: 'linear-gradient(135deg,#1e3a8a,#3b82f6)' }}
            >
              {companyName.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{companyName}</h1>
              <p className="text-xs text-gray-600 mt-0.5">{companyAddress}</p>
              <p className="text-xs text-gray-600">هاتف: {companyPhone}</p>
              {taxNumber && <p className="text-xs text-gray-600">الرقم الضريبي: {taxNumber}</p>}
            </div>
          </div>
          <div className="text-left">
            <div
              className="inline-block px-4 py-1.5 rounded-lg text-white text-sm font-bold mb-2"
              style={{ background: '#1e3a8a' }}
            >
              {titleMap[type]}
            </div>
            <p className="text-xs text-gray-700"><span className="font-semibold">رقم:</span> <span className="font-mono">{invoiceNumber || '—'}</span></p>
            <p className="text-xs text-gray-700"><span className="font-semibold">التاريخ:</span> {date}</p>
          </div>
        </div>

        {/* Party info */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg border border-gray-200" style={{ background: '#f8fafc' }}>
            <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">{partyLabelMap[type]}</p>
            <p className="text-base font-extrabold mt-1">{partyName || '—'}</p>
          </div>
          <div className="p-3 rounded-lg border border-gray-200" style={{ background: '#f8fafc' }}>
            <p className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">حالة الدفع</p>
            <p className="text-base font-extrabold mt-1 text-amber-600">قيد الانتظار</p>
          </div>
        </div>

        {/* Items table */}
        <table className="w-full border-collapse text-xs mb-6" style={{ border: '1px solid #cbd5e1' }}>
          <thead>
            <tr style={{ background: '#1e3a8a', color: 'white' }}>
              <th className="p-2 border border-blue-900 w-8 text-center">#</th>
              <th className="p-2 border border-blue-900 text-right">المنتج</th>
              <th className="p-2 border border-blue-900 text-right">رقم OEM</th>
              <th className="p-2 border border-blue-900 text-right">العلامة</th>
              <th className="p-2 border border-blue-900 text-center">المقاس</th>
              <th className="p-2 border border-blue-900 text-center">الكمية</th>
              <th className="p-2 border border-blue-900 text-center">السعر</th>
              <th className="p-2 border border-blue-900 text-center">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f1f5f9' }}>
                <td className="p-2 border border-gray-300 text-center font-mono text-[10px]">{i + 1}</td>
                <td className="p-2 border border-gray-300 font-medium">{item.product_name || '—'}</td>
                <td className="p-2 border border-gray-300 font-mono text-[10px]">{item.oem_number || '—'}</td>
                <td className="p-2 border border-gray-300">{item.brand || '—'}</td>
                <td className="p-2 border border-gray-300 text-center">{item.size || '—'}</td>
                <td className="p-2 border border-gray-300 text-center font-bold">{item.quantity}</td>
                <td className="p-2 border border-gray-300 text-center font-mono">{currency}{item.price.toFixed(2)}</td>
                <td className="p-2 border border-gray-300 text-center font-bold font-mono">{currency}{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-400 text-xs border border-gray-300">— لا توجد عناصر —</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-72 border border-gray-300 rounded-lg overflow-hidden">
            <div className="flex justify-between p-2 text-xs bg-gray-50">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-mono font-semibold">{currency}{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 text-xs bg-white border-t border-gray-200">
              <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
              <span className="font-mono font-semibold">{currency}{vat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2.5 text-sm text-white font-extrabold" style={{ background: '#1e3a8a' }}>
              <span>الإجمالي النهائي</span>
              <span className="font-mono">{currency}{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mb-6 p-3 rounded-lg border border-amber-200" style={{ background: '#fffbeb' }}>
            <p className="text-[10px] font-bold uppercase text-amber-700 mb-1">ملاحظات</p>
            <p className="text-xs">{notes}</p>
          </div>
        )}

        {/* Signatures */}
        <div className="flex justify-between items-end mt-12 pt-4 border-t border-gray-300">
          <div className="text-center">
            <div className="w-40 border-b border-gray-400 mb-1"></div>
            <p className="text-[10px] text-gray-500">توقيع المستلم</p>
          </div>
          <div className="text-center">
            <div className="w-40 border-b border-gray-400 mb-1"></div>
            <p className="text-[10px] text-gray-500">توقيع المسؤول</p>
          </div>
        </div>

        <p className="text-center text-[9px] text-gray-400 mt-8">
          تم الإنشاء بواسطة نظام {companyName} • {new Date().toLocaleDateString('ar-SA')}
        </p>
      </div>
    );
  }
);

InvoicePrint.displayName = 'InvoicePrint';
