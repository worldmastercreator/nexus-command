
ALTER VIEW public.i18n_coverage SET (security_invoker = on);
CREATE OR REPLACE FUNCTION public.i18n_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
