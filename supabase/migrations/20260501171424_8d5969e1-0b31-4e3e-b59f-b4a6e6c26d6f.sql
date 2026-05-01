
REVOKE EXECUTE ON FUNCTION public.handle_purchase_item_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_sales_item_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_settings() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
