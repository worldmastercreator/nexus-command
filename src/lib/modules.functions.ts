import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const MODULE_TABLES = [
  "mod_marketplace","mod_products","mod_orders","mod_payments","mod_subscriptions",
  "mod_licenses","mod_resellers","mod_franchises","mod_authors","mod_affiliates",
  "mod_influencers","mod_tenants","mod_white_label_brands","mod_books","mod_customers",
] as const;
export type ModuleTable = (typeof MODULE_TABLES)[number];

export const listModule = createServerFn({ method: "GET" })
  .inputValidator((data: { table: ModuleTable; limit?: number }) => {
    if (!MODULE_TABLES.includes(data.table)) throw new Error("bad table");
    return { table: data.table, limit: Math.min(data.limit ?? 100, 500) };
  })
  .handler(async ({ data }) => {
    const { data: rows, error } = await supabaseAdmin
      .from(data.table)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const moduleQueryOptions = (table: ModuleTable, limit = 100) =>
  queryOptions({
    queryKey: ["module", table, limit],
    queryFn: () => listModule({ data: { table, limit } }),
    staleTime: 30_000,
  });

export const updateModuleRow = createServerFn({ method: "POST" })
  .inputValidator((data: { table: ModuleTable; id: string; patch: Record<string, unknown> }) => {
    if (!MODULE_TABLES.includes(data.table)) throw new Error("bad table");
    if (!data.id || typeof data.id !== "string") throw new Error("bad id");
    if (!data.patch || typeof data.patch !== "object") throw new Error("bad patch");
    // Strip server-managed fields
    const { id: _i, created_at: _c, ...safe } = data.patch as Record<string, unknown>;
    return { table: data.table, id: data.id, patch: safe };
  })
  .handler(async ({ data }) => {
    const { data: row, error } = await (supabaseAdmin.from(data.table) as any)
      .update(data.patch)
      .eq("id", data.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { row };
  });


export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { customer: string; product: string; amount: number }) => {
    if (!d.customer?.trim()) throw new Error("customer required");
    if (!d.product?.trim()) throw new Error("product required");
    const amount = Number(d.amount);
    if (!isFinite(amount) || amount <= 0) throw new Error("amount must be > 0");
    return { customer: d.customer.trim().slice(0, 120), product: d.product.trim().slice(0, 120), amount };
  })
  .handler(async ({ data }) => {
    const order_no = "ORD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const { data: row, error } = await supabaseAdmin
      .from("mod_orders")
      .insert({ order_no, customer: data.customer, product: data.product, amount: data.amount, status: "PAID" })
      .select().single();
    if (error) throw new Error(error.message);
    return { row };
  });

export const refundOrder = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => {
    if (!d.id) throw new Error("id required");
    return { id: d.id };
  })
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("mod_orders")
      .update({ status: "REFUNDED" })
      .eq("id", data.id)
      .select().single();
    if (error) throw new Error(error.message);
    return { row };
  });

export const revokeLicense = createServerFn({ method: "POST" })
  .inputValidator((d: { id: string }) => {
    if (!d.id) throw new Error("id required");
    return { id: d.id };
  })
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("mod_licenses")
      .update({ status: "REVOKED" })
      .eq("id", data.id)
      .select().single();
    if (error) throw new Error(error.message);
    return { row };
  });
