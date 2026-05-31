-- ============================================================
-- USER ROLES (with boss role gate)
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('boss', 'admin', 'reseller_manager', 'reseller', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_boss(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('boss','admin','reseller_manager')
  )
$$;

-- ============================================================
-- RESELLER APPLICATIONS
-- ============================================================
CREATE TABLE public.reseller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  country text,
  state text,
  city text,
  territory_requested text,
  kyc_status text NOT NULL DEFAULT 'PENDING',
  interview_scheduled_at timestamptz,
  reviewer_id uuid,
  status text NOT NULL DEFAULT 'NEW',  -- NEW, KYC, INTERVIEW, APPROVED, REJECTED, HOLD, WAITING
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER TERRITORIES
-- ============================================================
CREATE TABLE public.reseller_territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid,
  country text NOT NULL,
  state text,
  city text,
  district text,
  industry text,
  capacity int NOT NULL DEFAULT 100,
  assigned int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER CUSTOMERS
-- ============================================================
CREATE TABLE public.reseller_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  customer_name text NOT NULL,
  email text,
  plan text,
  mrr numeric NOT NULL DEFAULT 0,
  health_score int NOT NULL DEFAULT 80,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER LEADS
-- ============================================================
CREATE TABLE public.reseller_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid,
  name text NOT NULL,
  email text,
  phone text,
  source text,
  industry text,
  territory text,
  status text NOT NULL DEFAULT 'NEW',
  registered_deal boolean NOT NULL DEFAULT false,
  protected_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER ORDERS
-- ============================================================
CREATE TABLE public.reseller_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  customer_name text NOT NULL,
  product text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER LICENSES (with approval gate)
-- ============================================================
CREATE TABLE public.reseller_licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  customer_name text NOT NULL,
  product text NOT NULL,
  license_key text,
  approval_stage text NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, PENDING, APPROVED, GENERATED, ACTIVATED, BLOCKED, EXPIRED
  approved_by uuid,
  approved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER COMMISSIONS
-- ============================================================
CREATE TABLE public.reseller_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  source text NOT NULL,
  type text NOT NULL DEFAULT 'COMMISSION', -- COMMISSION, BONUS, RECOVERY
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',  -- PENDING, APPROVED, RELEASED, RECOVERED
  earned_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER EMPLOYEES
-- ============================================================
CREATE TABLE public.reseller_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  name text NOT NULL,
  role text,
  email text,
  status text NOT NULL DEFAULT 'ACTIVE',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER ATTENDANCE
-- ============================================================
CREATE TABLE public.reseller_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  reseller_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'PRESENT',
  hours numeric NOT NULL DEFAULT 8,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER PAYROLL
-- ============================================================
CREATE TABLE public.reseller_payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  reseller_id uuid NOT NULL,
  period text NOT NULL,
  gross numeric NOT NULL DEFAULT 0,
  net numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER DOCUMENTS
-- ============================================================
CREATE TABLE public.reseller_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  doc_type text NOT NULL,  -- KYC, AGREEMENT, NDA, TAX, CONTRACT
  name text NOT NULL,
  url text,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER PERFORMANCE
-- ============================================================
CREATE TABLE public.reseller_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  period text NOT NULL DEFAULT 'monthly',
  revenue_score numeric NOT NULL DEFAULT 0,
  growth_score numeric NOT NULL DEFAULT 0,
  activity_score numeric NOT NULL DEFAULT 0,
  health_score numeric NOT NULL DEFAULT 0,
  total_score numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER AUDIT LOGS
-- ============================================================
CREATE TABLE public.reseller_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid,
  actor_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RESELLER RENEWALS
-- ============================================================
CREATE TABLE public.reseller_renewals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id uuid NOT NULL,
  customer_name text NOT NULL,
  product text,
  amount numeric NOT NULL DEFAULT 0,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'UPCOMING',  -- UPCOMING, RENEWED, MISSED
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- GRANTS + RLS (all reseller_* tables: boss/admin/manager full, reseller scoped, anon read for demo)
-- ============================================================
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'reseller_applications','reseller_territories','reseller_customers',
    'reseller_leads','reseller_orders','reseller_licenses','reseller_commissions',
    'reseller_employees','reseller_attendance','reseller_payroll',
    'reseller_documents','reseller_performance','reseller_audit_logs','reseller_renewals'
  ] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Public read demo" ON public.%I FOR SELECT USING (true)', t);
    EXECUTE format('CREATE POLICY "Boss full access" ON public.%I FOR ALL TO authenticated USING (public.is_boss(auth.uid())) WITH CHECK (public.is_boss(auth.uid()))', t);
  END LOOP;
END $$;

-- Indexes
CREATE INDEX idx_apps_status ON public.reseller_applications(status);
CREATE INDEX idx_terr_country ON public.reseller_territories(country);
CREATE INDEX idx_cust_reseller ON public.reseller_customers(reseller_id);
CREATE INDEX idx_leads_reseller ON public.reseller_leads(reseller_id);
CREATE INDEX idx_orders_reseller ON public.reseller_orders(reseller_id);
CREATE INDEX idx_lic_stage ON public.reseller_licenses(approval_stage);
CREATE INDEX idx_comm_reseller ON public.reseller_commissions(reseller_id);
CREATE INDEX idx_renew_due ON public.reseller_renewals(due_date);
CREATE INDEX idx_audit_created ON public.reseller_audit_logs(created_at DESC);
