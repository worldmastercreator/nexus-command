
-- 15 module tables, consistent shape per domain.
-- Public READ for anon (demo data); writes via service role only.

CREATE TABLE public.mod_marketplace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  sales integer NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  units integer NOT NULL DEFAULT 0,
  refs integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no text NOT NULL UNIQUE,
  customer text NOT NULL,
  product text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'PAID',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  txn_no text NOT NULL UNIQUE,
  method text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'SUCCESS',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer text NOT NULL,
  plan text NOT NULL,
  mrr numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  renewed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key text NOT NULL UNIQUE,
  product text NOT NULL,
  customer text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE',
  expires_at timestamptz NOT NULL DEFAULT now() + interval '1 year',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_resellers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'silver',
  commission numeric NOT NULL DEFAULT 0,
  sales numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_franchises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  region text NOT NULL,
  locations integer NOT NULL DEFAULT 1,
  revenue numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text NOT NULL UNIQUE,
  name text NOT NULL,
  items integer NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text NOT NULL UNIQUE,
  clicks integer NOT NULL DEFAULT 0,
  conversions integer NOT NULL DEFAULT 0,
  commission numeric NOT NULL DEFAULT 0,
  tier text NOT NULL DEFAULT 'T1',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  handle text NOT NULL UNIQUE,
  platform text NOT NULL,
  followers integer NOT NULL DEFAULT 0,
  engagement numeric NOT NULL DEFAULT 0,
  deals integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  seats integer NOT NULL DEFAULT 1,
  mrr numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_white_label_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  domain text NOT NULL UNIQUE,
  tenants integer NOT NULL DEFAULT 0,
  plan text NOT NULL DEFAULT 'pro',
  status text NOT NULL DEFAULT 'LIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn text NOT NULL UNIQUE,
  sales integer NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'PUBLISHED',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.mod_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  ltv numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grants + RLS (open read for anon since auth is localStorage demo)
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'mod_marketplace','mod_products','mod_orders','mod_payments','mod_subscriptions',
    'mod_licenses','mod_resellers','mod_franchises','mod_authors','mod_affiliates',
    'mod_influencers','mod_tenants','mod_white_label_brands','mod_books','mod_customers'
  ]) LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
  END LOOP;
END $$;
