## خطة استكمال وتطوير الواجهة الخلفية

الحالة الحالية: 13 جدول + RLS + Auth (Email/Google) + Triggers لتحديث المخزون. لا توجد Edge Functions ولا Storage ولا Realtime ولا أدوار مستخدمين.

---

### المرحلة 1 — الصلاحيات والأمان (user_roles)
- جدول `app_role` enum: `admin`, `manager`, `accountant`, `viewer`.
- جدول `user_roles` منفصل + دالة `has_role()` بصيغة SECURITY DEFINER.
- تحديث RLS على الجداول الحساسة (الحذف للأدمن فقط، القراءة للمشاهد).
- جدول `audit_log` لتسجيل كل تعديل/حذف (من فعل، متى، ماذا).

### المرحلة 2 — التخزين (Storage Buckets)
- `product-images` (عام) — صور المنتجات.
- `invoice-attachments` (خاص) — مرفقات الفواتير/الإيصالات.
- `avatars` (عام) — صور المستخدمين.
- `company-logos` (عام) — شعار الشركة للطباعة.
- سياسات تحميل/قراءة حسب الدور و `auth.uid()`.

### المرحلة 3 — الحسابات الذكية (Triggers & Functions)
- Trigger تحديث رصيد العميل تلقائياً عند إنشاء فاتورة بيع أو دفعة.
- Trigger تحديث رصيد المورد عند فاتورة شراء/دفعة.
- Trigger حساب التكلفة الإجمالية للرحلة من (مشتريات + شحن + مصاريف).
- جدول `inventory_movements` يُملأ آلياً عند كل عملية.
- دوال RPC: `get_dashboard_stats()`, `get_profit_loss(from, to)`, `get_top_products(limit)`.

### المرحلة 4 — Edge Functions
- `live-currency`: جلب أسعار صرف USD/CNY/SAR/YER يومياً وحفظها في `exchange_rates`.
- `ai-assistant`: مساعد ذكي عبر Lovable AI Gateway (gemini-2.5-flash) للاستعلام بلغة طبيعية.
- `ocr-invoice`: قراءة فواتير الموردين الصينية بـ Gemini Vision.
- `send-notification`: إشعارات (انخفاض مخزون، دفعة مستحقة، فاتورة متأخرة).
- `backup-export`: تصدير كامل JSON موقّع للمستخدم.

### المرحلة 5 — Realtime & Notifications
- تفعيل Realtime على: `sales_invoices`, `payments`, `inventory_movements`, `notifications`.
- جدول `notifications` (user_id, type, title, body, read, link).
- Triggers تُنشئ إشعار عند: مخزون منخفض / فاتورة جديدة / دفعة مستلمة.

### المرحلة 6 — الأداء والصيانة
- فهارس Indexes على الأعمدة الأكثر استعلاماً (user_id, dates, status).
- Views محفوظة: `customer_balances`, `supplier_balances`, `product_stock`.
- Soft delete (`deleted_at`) بدل الحذف النهائي.
- Cron job يومي لتنظيف الإشعارات القديمة + تحديث أسعار الصرف.

---

### ترتيب التنفيذ المقترح
يُنفّذ كل مرحلة في migration منفصل، ثم تُربط الواجهة الأمامية بعدها.

**هل تريد:**
- (أ) تنفيذ الست مراحل بالترتيب الآن.
- (ب) البدء بمرحلة محددة فقط.
- (ج) تعديل/إضافة عناصر قبل البدء.