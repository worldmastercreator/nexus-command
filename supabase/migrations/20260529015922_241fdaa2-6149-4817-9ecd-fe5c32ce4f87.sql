DROP POLICY IF EXISTS "Public insert" ON public.mod_orders;
CREATE POLICY "Public insert" ON public.mod_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
GRANT INSERT ON public.mod_orders TO anon, authenticated;