
-- Add foreign key relationships and inventory auto-update triggers

-- Add updated_at triggers for tables that need them
DO $$ BEGIN
  CREATE TRIGGER trg_purchase_invoices_updated BEFORE UPDATE ON public.purchase_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_sales_invoices_updated BEFORE UPDATE ON public.sales_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_suppliers_updated BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_trips_updated BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_shipments_updated BEFORE UPDATE ON public.shipments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_quotations_updated BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TRIGGER trg_settings_updated BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_purchase_items_invoice ON public.purchase_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_invoice ON public.sales_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation ON public.quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_purchase_items_product ON public.purchase_items(product_id);
CREATE INDEX IF NOT EXISTS idx_sales_items_product ON public.sales_items(product_id);

-- Auto-update product quantities on purchase items insert/update/delete
CREATE OR REPLACE FUNCTION public.handle_purchase_item_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_purchased = quantity_purchased + NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_purchased = quantity_purchased - OLD.quantity WHERE id = OLD.product_id;
    END IF;
    IF NEW.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_purchased = quantity_purchased + NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_purchased = quantity_purchased - OLD.quantity WHERE id = OLD.product_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_purchase_item_inv ON public.purchase_items;
CREATE TRIGGER trg_purchase_item_inv
AFTER INSERT OR UPDATE OR DELETE ON public.purchase_items
FOR EACH ROW EXECUTE FUNCTION public.handle_purchase_item_change();

-- Auto-update product quantities on sales items insert/update/delete
CREATE OR REPLACE FUNCTION public.handle_sales_item_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_sold = quantity_sold + NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_sold = quantity_sold - OLD.quantity WHERE id = OLD.product_id;
    END IF;
    IF NEW.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_sold = quantity_sold + NEW.quantity WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.product_id IS NOT NULL THEN
      UPDATE public.products SET quantity_sold = quantity_sold - OLD.quantity WHERE id = OLD.product_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END; $$;

DROP TRIGGER IF EXISTS trg_sales_item_inv ON public.sales_items;
CREATE TRIGGER trg_sales_item_inv
AFTER INSERT OR UPDATE OR DELETE ON public.sales_items
FOR EACH ROW EXECUTE FUNCTION public.handle_sales_item_change();

-- Auto-create default settings row for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.settings (user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_settings ON auth.users;
CREATE TRIGGER on_auth_user_settings
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Ensure profile + settings exist for already-signed-up user (safety)
INSERT INTO public.settings (user_id)
SELECT id FROM auth.users WHERE id NOT IN (SELECT user_id FROM public.settings)
ON CONFLICT DO NOTHING;
