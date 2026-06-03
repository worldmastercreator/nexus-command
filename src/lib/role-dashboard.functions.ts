import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type RoleSlug =
  | "boss" | "admin" | "ceo" | "rm" | "reseller" | "franchise"
  | "sales" | "support" | "hr" | "accountant" | "author"
  | "customer" | "user" | "employee" | "manager";

const KPI_MAP: Record<RoleSlug, Array<{ label: string; table: string; filter?: { col: string; val: string }; agg?: "count" | "sum"; col?: string; prefix?: string }>> = {
  boss:       [{ label: "Tenants", table: "mod_tenants", agg: "count" },
               { label: "MRR", table: "mod_tenants", agg: "sum", col: "mrr", prefix: "$" },
               { label: "Resellers", table: "mod_resellers", agg: "count" },
               { label: "Customers", table: "mod_customers", agg: "count" }],
  admin:      [{ label: "Tenants", table: "mod_tenants", agg: "count" },
               { label: "Products", table: "mod_products", agg: "count" },
               { label: "Orders", table: "mod_orders", agg: "count" },
               { label: "Payments", table: "mod_payments", agg: "sum", col: "amount", prefix: "$" }],
  ceo:        [{ label: "Revenue", table: "mod_payments", agg: "sum", col: "amount", prefix: "$" },
               { label: "MRR", table: "mod_subscriptions", agg: "sum", col: "mrr", prefix: "$" },
               { label: "Resellers", table: "mod_resellers", agg: "count" },
               { label: "Tenants", table: "mod_tenants", agg: "count" }],
  rm:         [{ label: "Applications", table: "reseller_applications", agg: "count" },
               { label: "Active Resellers", table: "mod_resellers", filter: { col: "status", val: "ACTIVE" }, agg: "count" },
               { label: "Leads", table: "reseller_leads", agg: "count" },
               { label: "Pending Licenses", table: "reseller_licenses", filter: { col: "approval_stage", val: "REQUESTED" }, agg: "count" }],
  reseller:   [{ label: "My Leads", table: "reseller_leads", agg: "count" },
               { label: "My Customers", table: "reseller_customers", agg: "count" },
               { label: "Commissions", table: "reseller_commissions", agg: "sum", col: "amount", prefix: "$" },
               { label: "Renewals Due", table: "reseller_renewals", filter: { col: "status", val: "UPCOMING" }, agg: "count" }],
  franchise:  [{ label: "Franchises", table: "mod_franchises", agg: "count" },
               { label: "Locations", table: "mod_franchises", agg: "sum", col: "locations" },
               { label: "Revenue", table: "mod_franchises", agg: "sum", col: "revenue", prefix: "$" },
               { label: "Resellers", table: "mod_resellers", agg: "count" }],
  sales:      [{ label: "Leads", table: "reseller_leads", agg: "count" },
               { label: "Orders", table: "reseller_orders", agg: "count" },
               { label: "Revenue", table: "reseller_orders", agg: "sum", col: "amount", prefix: "$" },
               { label: "Customers", table: "mod_customers", agg: "count" }],
  support:    [{ label: "Customers", table: "mod_customers", agg: "count" },
               { label: "Active Subs", table: "mod_subscriptions", filter: { col: "status", val: "ACTIVE" }, agg: "count" },
               { label: "Licenses", table: "mod_licenses", agg: "count" },
               { label: "Renewals", table: "reseller_renewals", agg: "count" }],
  hr:         [{ label: "Employees", table: "reseller_employees", agg: "count" },
               { label: "Active", table: "reseller_employees", filter: { col: "status", val: "ACTIVE" }, agg: "count" },
               { label: "Payroll", table: "reseller_payroll", agg: "sum", col: "net", prefix: "$" },
               { label: "Attendance", table: "reseller_attendance", agg: "count" }],
  accountant: [{ label: "Payments", table: "mod_payments", agg: "sum", col: "amount", prefix: "$" },
               { label: "Orders", table: "mod_orders", agg: "count" },
               { label: "Books", table: "mod_books", agg: "count" },
               { label: "Subscriptions MRR", table: "mod_subscriptions", agg: "sum", col: "mrr", prefix: "$" }],
  author:     [{ label: "My Items", table: "mod_marketplace", agg: "count" },
               { label: "Sales", table: "mod_marketplace", agg: "sum", col: "sales" },
               { label: "Revenue", table: "mod_marketplace", agg: "sum", col: "revenue", prefix: "$" },
               { label: "Books", table: "mod_books", agg: "count" }],
  customer:   [{ label: "Subscriptions", table: "mod_subscriptions", agg: "count" },
               { label: "Licenses", table: "mod_licenses", agg: "count" },
               { label: "Orders", table: "mod_orders", agg: "count" },
               { label: "Marketplace", table: "mod_marketplace", agg: "count" }],
  user:       [{ label: "Marketplace", table: "mod_marketplace", agg: "count" },
               { label: "Products", table: "mod_products", agg: "count" },
               { label: "Authors", table: "mod_authors", agg: "count" },
               { label: "Books", table: "mod_books", agg: "count" }],
  employee:   [{ label: "Tasks Today", table: "reseller_attendance", agg: "count" },
               { label: "Team", table: "reseller_employees", agg: "count" },
               { label: "Payroll", table: "reseller_payroll", agg: "sum", col: "net", prefix: "$" },
               { label: "Hours", table: "reseller_attendance", agg: "sum", col: "hours" }],
  manager:    [{ label: "Team", table: "reseller_employees", agg: "count" },
               { label: "Leads", table: "reseller_leads", agg: "count" },
               { label: "Orders", table: "reseller_orders", agg: "count" },
               { label: "Performance", table: "reseller_performance", agg: "count" }],
};

export const getRoleDashboard = createServerFn({ method: "GET" })
  .inputValidator((d: { role: RoleSlug }) => {
    if (!(d.role in KPI_MAP)) throw new Error("bad role");
    return d;
  })
  .handler(async ({ data }) => {
    const specs = KPI_MAP[data.role];
    const kpis = await Promise.all(specs.map(async (spec) => {
      try {
        if (spec.agg === "sum" && spec.col) {
          let q = supabaseAdmin.from(spec.table).select(spec.col);
          if (spec.filter) q = q.eq(spec.filter.col, spec.filter.val);
          const { data: rows } = await q;
          const total = (rows ?? []).reduce((a: number, r: any) => a + Number(r[spec.col!] ?? 0), 0);
          return { label: spec.label, value: `${spec.prefix ?? ""}${Math.round(total).toLocaleString()}` };
        }
        let q = supabaseAdmin.from(spec.table).select("*", { count: "exact", head: true });
        if (spec.filter) q = q.eq(spec.filter.col, spec.filter.val);
        const { count } = await q;
        return { label: spec.label, value: (count ?? 0).toLocaleString() };
      } catch {
        return { label: spec.label, value: "—" };
      }
    }));

    const { data: activity } = await supabaseAdmin
      .from("reseller_audit_logs")
      .select("id, action, entity_type, entity_id, meta, created_at")
      .order("created_at", { ascending: false })
      .limit(12);

    return { kpis, activity: activity ?? [] };
  });

export const roleDashboardQueryOptions = (role: RoleSlug) =>
  queryOptions({
    queryKey: ["role-dashboard", role],
    queryFn: () => getRoleDashboard({ data: { role } }),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
