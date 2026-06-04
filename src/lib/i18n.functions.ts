import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

export type LanguageCoverage = {
  code: string;
  name: string;
  native_name: string;
  rtl: boolean;
  is_source: boolean;
  enabled: boolean;
  total_keys: number;
  translated_keys: number;
  coverage_pct: number;
  is_ready: boolean;
};

export type Dictionary = Record<string, string>; // "namespace.key" -> value

/** All languages with their live coverage (used by picker + coverage dashboard). */
export const getLanguageCoverage = createServerFn({ method: "GET" }).handler(
  async (): Promise<LanguageCoverage[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("i18n_coverage" as never)
      .select("*")
      .order("is_source", { ascending: false })
      .order("coverage_pct", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as LanguageCoverage[];
  },
);

/** Resolved dictionary for a single language (falls back to English source per missing key). */
export const getDictionary = createServerFn({ method: "GET" })
  .inputValidator((input) =>
    z.object({ code: z.string().min(2).max(8).regex(/^[a-z-]+$/i) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ code: string; rtl: boolean; dict: Dictionary }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [{ data: lang }, { data: keys }, { data: values }] = await Promise.all([
      supabaseAdmin.from("i18n_languages").select("code, rtl, is_source").eq("code", data.code).maybeSingle(),
      supabaseAdmin.from("i18n_keys").select("id, namespace, key, source_value"),
      supabaseAdmin.from("i18n_values").select("key_id, value").eq("language_code", data.code),
    ]);

    const valueByKeyId = new Map<string, string>();
    for (const v of values ?? []) valueByKeyId.set(v.key_id as string, v.value as string);

    const dict: Dictionary = {};
    for (const k of keys ?? []) {
      const full = `${k.namespace}.${k.key}`;
      dict[full] = valueByKeyId.get(k.id as string) ?? (k.source_value as string);
    }

    return { code: data.code, rtl: lang?.rtl ?? false, dict };
  });

export const languageCoverageQueryOptions = () =>
  queryOptions({
    queryKey: ["i18n", "coverage"],
    queryFn: () => getLanguageCoverage(),
    staleTime: 60_000,
  });

export const dictionaryQueryOptions = (code: string) =>
  queryOptions({
    queryKey: ["i18n", "dict", code],
    queryFn: () => getDictionary({ data: { code } }),
    staleTime: 5 * 60_000,
  });
