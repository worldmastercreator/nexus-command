
-- Languages registry
CREATE TABLE public.i18n_languages (
  code text PRIMARY KEY,
  name text NOT NULL,
  native_name text NOT NULL,
  rtl boolean NOT NULL DEFAULT false,
  is_source boolean NOT NULL DEFAULT false,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.i18n_languages TO anon, authenticated;
GRANT ALL ON public.i18n_languages TO service_role;
ALTER TABLE public.i18n_languages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read languages" ON public.i18n_languages FOR SELECT USING (true);
CREATE POLICY "Boss manage languages" ON public.i18n_languages FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- Translation keys (source-of-truth English strings)
CREATE TABLE public.i18n_keys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  namespace text NOT NULL DEFAULT 'common',
  key text NOT NULL,
  source_value text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (namespace, key)
);
CREATE INDEX i18n_keys_ns_idx ON public.i18n_keys(namespace);
GRANT SELECT ON public.i18n_keys TO anon, authenticated;
GRANT ALL ON public.i18n_keys TO service_role;
ALTER TABLE public.i18n_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read keys" ON public.i18n_keys FOR SELECT USING (true);
CREATE POLICY "Boss manage keys" ON public.i18n_keys FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- Translation values per language
CREATE TABLE public.i18n_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id uuid NOT NULL REFERENCES public.i18n_keys(id) ON DELETE CASCADE,
  language_code text NOT NULL REFERENCES public.i18n_languages(code) ON DELETE CASCADE,
  value text NOT NULL,
  reviewed boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (key_id, language_code)
);
CREATE INDEX i18n_values_lang_idx ON public.i18n_values(language_code);
GRANT SELECT ON public.i18n_values TO anon, authenticated;
GRANT ALL ON public.i18n_values TO service_role;
ALTER TABLE public.i18n_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read values" ON public.i18n_values FOR SELECT USING (true);
CREATE POLICY "Boss manage values" ON public.i18n_values FOR ALL TO authenticated
  USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()));

-- Audit log
CREATE TABLE public.i18n_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  language_code text,
  key_id uuid,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.i18n_audit_logs TO authenticated;
GRANT ALL ON public.i18n_audit_logs TO service_role;
ALTER TABLE public.i18n_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Boss read audit" ON public.i18n_audit_logs FOR SELECT TO authenticated USING (public.is_boss(auth.uid()));

-- Coverage view: per-language total/translated/percent
CREATE OR REPLACE VIEW public.i18n_coverage AS
SELECT
  l.code,
  l.name,
  l.native_name,
  l.rtl,
  l.is_source,
  l.enabled,
  (SELECT COUNT(*) FROM public.i18n_keys) AS total_keys,
  COALESCE(v.translated, 0) AS translated_keys,
  CASE
    WHEN (SELECT COUNT(*) FROM public.i18n_keys) = 0 THEN 0
    ELSE ROUND((COALESCE(v.translated,0)::numeric / (SELECT COUNT(*) FROM public.i18n_keys)::numeric) * 100, 2)
  END AS coverage_pct,
  CASE
    WHEN l.is_source THEN true
    WHEN (SELECT COUNT(*) FROM public.i18n_keys) = 0 THEN false
    ELSE COALESCE(v.translated,0) = (SELECT COUNT(*) FROM public.i18n_keys)
  END AS is_ready
FROM public.i18n_languages l
LEFT JOIN (
  SELECT language_code, COUNT(*) AS translated
  FROM public.i18n_values
  GROUP BY language_code
) v ON v.language_code = l.code;

GRANT SELECT ON public.i18n_coverage TO anon, authenticated;

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.i18n_touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER i18n_keys_touch BEFORE UPDATE ON public.i18n_keys
  FOR EACH ROW EXECUTE FUNCTION public.i18n_touch_updated_at();
CREATE TRIGGER i18n_values_touch BEFORE UPDATE ON public.i18n_values
  FOR EACH ROW EXECUTE FUNCTION public.i18n_touch_updated_at();
