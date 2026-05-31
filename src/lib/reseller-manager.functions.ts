import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RM_TABLES = [
  "reseller_applications","reseller_territories","reseller_customers",
  "reseller_leads","reseller_orders","reseller_licenses","reseller_commissions",
  "reseller_employees","reseller_attendance","reseller_payroll",
  "reseller_documents","reseller_performance","reseller_audit_logs","reseller_renewals",
] as const;
export type RmTable = (typeof RM_TABLES)[number];

export const listRm = createServerFn({ method: "GET" })
  .inputValidator((d: { table: RmTable; limit?: number }) => {
    if (!RM_TABLES.includes(d.table)) throw new Error("bad table");
    return { table: d.table, limit: Math.min(d.limit ?? 50, 500) };
  })
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from(data.table).select("*")
      .order("created_at", { ascending: false }).limit(data.limit);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const rmQueryOptions = (table: RmTable, limit = 50) =>
  queryOptions({
    queryKey: ["rm", table, limit],
    queryFn: () => listRm({ data: { table, limit } }),
    staleTime: 20_000,
  });

export const getRmKpis = createServerFn({ method: "GET" }).handler(async () => {
  const c = async (t: RmTable, filter?: { col: string; val: string }) => {
    let q = supabaseAdmin.from(t).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter.col, filter.val);
    const { count } = await q;
    return count ?? 0;
  };
  const sum = async (t: RmTable, col: string) => {
    const { data } = await supabaseAdmin.from(t).select(col);
    return (data ?? []).reduce((a: number, r: any) => a + Number(r[col] ?? 0), 0);
  };
  const [resellers, active, suspended, pending, revenue, licenses, customers, renewalRev, leads, orders] =
    await Promise.all([
      c("reseller_applications" as any).catch(() => 0),
      supabaseAdmin.from("mod_resellers").select("*", { count: "exact", head: true }).eq("status", "ACTIVE").then(r => r.count ?? 0),
      supabaseAdmin.from("mod_resellers").select("*", { count: "exact", head: true }).eq("status", "SUSPENDED").then(r => r.count ?? 0),
      c("reseller_applications", { col: "status", val: "NEW" }),
      sum("reseller_orders", "amount"),
      c("reseller_licenses"),
      c("reseller_customers"),
      sum("reseller_renewals", "amount"),
      c("reseller_leads"),
      c("reseller_orders"),
    ]);
  return { resellers, active, suspended, pending, revenue, licenses, customers, renewalRev, leads, orders };
});

export const kpisQueryOptions = queryOptions({
  queryKey: ["rm", "kpis"],
  queryFn: () => getRmKpis(),
  staleTime: 15_000,
});

// Boss-gated mutations
async function assertBoss(supabase: any, userId: string) {
  const { data } = await supabase.rpc("is_boss", { _user_id: userId });
  if (!data) throw new Error("Forbidden: boss role required");
}

export const setApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: "APPROVED"|"REJECTED"|"HOLD"|"INTERVIEW"|"KYC" }) => {
    if (!d.id) throw new Error("id required");
    if (!["APPROVED","REJECTED","HOLD","INTERVIEW","KYC"].includes(d.status)) throw new Error("bad status");
    return d;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertBoss(supabase, userId);
    const { data: row, error } = await supabaseAdmin
      .from("reseller_applications")
      .update({ status: data.status, reviewer_id: userId, updated_at: new Date().toISOString() })
      .eq("id", data.id).select().single();
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("reseller_audit_logs").insert({
      actor_id: userId, action: `application.${data.status.toLowerCase()}`,
      entity_type: "reseller_applications", entity_id: data.id,
    });
    return { row };
  });

export const setLicenseStage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; stage: string }) => {
    if (!d.id || !d.stage) throw new Error("bad input");
    return d;
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await assertBoss(supabase, userId);
    const patch: any = { approval_stage: data.stage };
    if (data.stage === "APPROVED") { patch.approved_by = userId; patch.approved_at = new Date().toISOString(); }
    if (data.stage === "GENERATED") patch.license_key = "LIC-" + Math.random().toString(36).slice(2, 14).toUpperCase();
    const { data: row, error } = await supabaseAdmin
      .from("reseller_licenses").update(patch).eq("id", data.id).select().single();
    if (error) throw new Error(error.message);
    await supabaseAdmin.from("reseller_audit_logs").insert({
      actor_id: userId, action: `license.${data.stage.toLowerCase()}`,
      entity_type: "reseller_licenses", entity_id: data.id,
    });
    return { row };
  });

export const seedRmDemo = createServerFn({ method: "POST" }).handler(async () => {
  const countries = ["USA","India","UK","Germany","Brazil","Japan","Australia","UAE"];
  const apps = countries.map((c, i) => ({
    applicant_name: `Applicant ${i+1}`, company: `Acme ${c}`, email: `app${i}@${c.toLowerCase()}.io`,
    country: c, territory_requested: c, kyc_status: ["PENDING","VERIFIED","REJECTED"][i%3],
    status: ["NEW","KYC","INTERVIEW","APPROVED","HOLD","WAITING"][i%6],
  }));
  await supabaseAdmin.from("reseller_applications").insert(apps);
  const terr = countries.map((c, i) => ({
    country: c, state: `State ${i}`, city: `City ${i}`, industry: ["SaaS","Retail","Edu","Health"][i%4],
    capacity: 100 + i*20, assigned: Math.floor(Math.random()*80), status: i%5===0?"FULL":"OPEN",
  }));
  await supabaseAdmin.from("reseller_territories").insert(terr);
  return { ok: true };
});
