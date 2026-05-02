-- Payments table (idempotent)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('purchase', 'sales')),
  invoice_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'SAR',
  payment_method TEXT NOT NULL DEFAULT 'cash',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own payments" ON public.payments;
CREATE POLICY "own payments" ON public.payments
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON public.payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);

CREATE OR REPLACE FUNCTION public.handle_payment_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE inv_id UUID; total NUMERIC; ptype TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN inv_id := OLD.invoice_id; ptype := OLD.payment_type;
  ELSE inv_id := NEW.invoice_id; ptype := NEW.payment_type; END IF;

  SELECT COALESCE(SUM(amount), 0) INTO total
  FROM public.payments WHERE invoice_id = inv_id AND payment_type = ptype;

  IF ptype = 'purchase' THEN
    UPDATE public.purchase_invoices SET paid_amount = total WHERE id = inv_id;
  ELSIF ptype = 'sales' THEN
    UPDATE public.sales_invoices SET paid_amount = total WHERE id = inv_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END; $$;

DROP TRIGGER IF EXISTS payments_change ON public.payments;
CREATE TRIGGER payments_change
AFTER INSERT OR UPDATE OR DELETE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_payment_change();

DROP TRIGGER IF EXISTS purchase_items_change ON public.purchase_items;
CREATE TRIGGER purchase_items_change
AFTER INSERT OR UPDATE OR DELETE ON public.purchase_items
FOR EACH ROW EXECUTE FUNCTION public.handle_purchase_item_change();

DROP TRIGGER IF EXISTS sales_items_change ON public.sales_items;
CREATE TRIGGER sales_items_change
AFTER INSERT OR UPDATE OR DELETE ON public.sales_items
FOR EACH ROW EXECUTE FUNCTION public.handle_sales_item_change();

DROP TRIGGER IF EXISTS set_updated_at_products ON public.products;
CREATE TRIGGER set_updated_at_products BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_suppliers ON public.suppliers;
CREATE TRIGGER set_updated_at_suppliers BEFORE UPDATE ON public.suppliers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_customers ON public.customers;
CREATE TRIGGER set_updated_at_customers BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_trips ON public.trips;
CREATE TRIGGER set_updated_at_trips BEFORE UPDATE ON public.trips
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_purchase_invoices ON public.purchase_invoices;
CREATE TRIGGER set_updated_at_purchase_invoices BEFORE UPDATE ON public.purchase_invoices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_sales_invoices ON public.sales_invoices;
CREATE TRIGGER set_updated_at_sales_invoices BEFORE UPDATE ON public.sales_invoices
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_quotations ON public.quotations;
CREATE TRIGGER set_updated_at_quotations BEFORE UPDATE ON public.quotations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_shipments ON public.shipments;
CREATE TRIGGER set_updated_at_shipments BEFORE UPDATE ON public.shipments
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_settings ON public.settings;
CREATE TRIGGER set_updated_at_settings BEFORE UPDATE ON public.settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();