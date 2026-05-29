-- Enable realtime + full row payloads for all module tables
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'mod_marketplace','mod_products','mod_orders','mod_payments','mod_subscriptions',
    'mod_licenses','mod_resellers','mod_franchises','mod_authors','mod_affiliates',
    'mod_influencers','mod_tenants','mod_white_label_brands','mod_books','mod_customers'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', t);
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    -- Permissive public update policy for demo dashboard quick-edits
    EXECUTE format('DROP POLICY IF EXISTS "Public update" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Public update" ON public.%I FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true)', t);
    EXECUTE format('GRANT UPDATE ON public.%I TO anon, authenticated', t);
  END LOOP;
END $$;