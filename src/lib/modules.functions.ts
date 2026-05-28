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
