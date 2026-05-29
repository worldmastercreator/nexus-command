import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { moduleQueryOptions, updateModuleRow, type ModuleTable } from "@/lib/modules.functions";
import { Panel } from "@/components/dash/primitives";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MoreHorizontal, Eye, Pencil, Activity, Radio } from "lucide-react";

export type Col<T = Record<string, unknown>> = {
  key: keyof T & string;
  label: string;
  align?: "left" | "right";
  format?: (v: unknown, row: T) => React.ReactNode;
  className?: string;
};

type Props = {
  table: ModuleTable;
  kicker: string;
  title: string;
  columns: Col[];
  limit?: number;
};

const STATUS_CYCLE: Record<string, string[]> = {
  mod_marketplace: ["ACTIVE", "REVIEW", "DRAFT"],
  mod_products: ["ACTIVE", "DRAFT", "ARCHIVED"],
  mod_orders: ["PAID", "PENDING", "REFUNDED", "CANCELED"],
  mod_payments: ["SUCCESS", "PENDING", "FAILED", "REFUNDED"],
  mod_subscriptions: ["ACTIVE", "PAST_DUE", "CANCELED", "CHURNED"],
  mod_licenses: ["ACTIVE", "EXPIRED", "REVOKED"],
  mod_resellers: ["ACTIVE", "PENDING", "CANCELED"],
  mod_franchises: ["OPEN", "PILOT", "CLOSED"],
  mod_authors: ["ACTIVE", "REVIEW", "SUSPENDED"],
  mod_affiliates: ["ACTIVE", "PENDING", "CANCELED"],
  mod_influencers: ["ACTIVE", "PENDING", "CANCELED"],
  mod_tenants: ["ACTIVE", "STAGING", "CHURNED"],
  mod_white_label_brands: ["LIVE", "STAGING", "DRAFT"],
  mod_books: ["PUBLISHED", "DRAFT", "ARCHIVED"],
  mod_customers: ["ACTIVE", "PENDING", "CHURNED"],
};

function statusTone(s: string) {
  const t = s.toUpperCase();
  if (["ACTIVE", "PAID", "SUCCESS", "OPEN", "LIVE", "PUBLISHED"].includes(t)) return "border-success/40 text-success";
  if (["PENDING", "REVIEW", "STAGING", "PILOT", "PAST_DUE"].includes(t)) return "border-warning/40 text-warning";
  if (["FAILED", "REFUNDED", "REVOKED", "EXPIRED", "CHURNED", "CANCELED", "DRAFT", "ARCHIVED", "SUSPENDED", "CLOSED"].includes(t)) return "border-danger/40 text-danger";
  return "border-border text-muted-foreground";
}

export function StatusBadge({ value }: { value: string }) {
  return (
    <span className={`inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${statusTone(value)}`}>
      {value}
    </span>
  );
}

export function fmtMoney(v: unknown) {
  const n = Number(v ?? 0);
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(2)}`;
}
export function fmtNum(v: unknown) {
  const n = Number(v ?? 0);
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US");
}

function useRealtimeInvalidate(table: ModuleTable) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel(`rt:${table}`)
      .on("postgres_changes", { event: "*", schema: "public", table }, () => {
        qc.invalidateQueries({ queryKey: ["module", table] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, qc]);
}

function RowActions({
  table,
  row,
  columns,
  onView,
  onEdit,
}: {
  table: ModuleTable;
  row: Record<string, unknown>;
  columns: Col[];
  onView: () => void;
  onEdit: () => void;
}) {
  const qc = useQueryClient();
  const update = useServerFn(updateModuleRow);
  const mut = useMutation({
    mutationFn: (patch: Record<string, unknown>) =>
      update({ data: { table, id: row.id as string, patch } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["module", table] });
      toast.success("Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const statuses = STATUS_CYCLE[table] ?? [];
  const hasStatus = "status" in row;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="rounded p-1 hover:bg-accent" aria-label="Row actions">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onView}><Eye className="h-3.5 w-3.5 mr-2" />View</DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}><Pencil className="h-3.5 w-3.5 mr-2" />Edit</DropdownMenuItem>
        {hasStatus && statuses.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Activity className="h-3 w-3" />Quick status
            </DropdownMenuLabel>
            {statuses.map((s) => (
              <DropdownMenuItem
                key={s}
                disabled={mut.isPending || s === row.status}
                onClick={() => mut.mutate({ status: s })}
              >
                <StatusBadge value={s} />
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function RowDialog({
  table,
  row,
  columns,
  mode,
  onClose,
}: {
  table: ModuleTable;
  row: Record<string, unknown> | null;
  columns: Col[];
  mode: "view" | "edit";
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const update = useServerFn(updateModuleRow);
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setDraft(row ? { ...row } : {});
  }, [row]);

  const mut = useMutation({
    mutationFn: (patch: Record<string, unknown>) =>
      update({ data: { table, id: row!.id as string, patch } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["module", table] });
      toast.success("Saved");
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!row) return null;
  const editableKeys = columns.map((c) => c.key).filter((k) => k !== "id");

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono text-[12px] uppercase tracking-wider">
            {mode === "view" ? "View" : "Edit"} · {table.replace("mod_", "")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-[60vh] overflow-auto">
          {editableKeys.map((k) => {
            const v = draft[k];
            const isNum = typeof row[k] === "number";
            return (
              <div key={k} className="space-y-1">
                <Label className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{k}</Label>
                {mode === "view" ? (
                  <div className="font-mono text-[12px] rounded border border-border bg-surface-2/40 px-2 py-1.5">
                    {String(v ?? "—")}
                  </div>
                ) : (
                  <Input
                    value={v == null ? "" : String(v)}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, [k]: isNum ? Number(e.target.value) : e.target.value }))
                    }
                    className="font-mono text-[12px]"
                  />
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {mode === "edit" && (
            <Button
              onClick={() => {
                const patch: Record<string, unknown> = {};
                for (const k of editableKeys) {
                  if (draft[k] !== row[k]) patch[k] = draft[k];
                }
                if (Object.keys(patch).length === 0) {
                  toast.info("No changes");
                  return;
                }
                mut.mutate(patch);
              }}
              disabled={mut.isPending}
            >
              {mut.isPending ? "Saving…" : "Save"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TableBody({ table, columns, limit }: { table: ModuleTable; columns: Col[]; limit?: number }) {
  const { data } = useSuspenseQuery(moduleQueryOptions(table, limit));
  useRealtimeInvalidate(table);
  const rows = data.rows as Record<string, unknown>[];
  const [active, setActive] = useState<{ row: Record<string, unknown>; mode: "view" | "edit" } | null>(null);

  if (rows.length === 0) {
    return <div className="px-3 py-8 text-center text-[12px] text-muted-foreground">No records yet.</div>;
  }
  return (
    <>
      <table className="w-full text-[12px]">
        <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={`px-3 py-2 ${c.align === "right" ? "text-right" : "text-left"}`}>{c.label}</th>
            ))}
            <th className="px-3 py-2 w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={(r.id as string) ?? i} className="border-b border-border/50 last:border-0 hover:bg-accent/40">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-2 ${c.align === "right" ? "text-right font-mono" : ""} ${c.className ?? ""}`}
                >
                  {c.format ? c.format(r[c.key], r as never) : String(r[c.key] ?? "")}
                </td>
              ))}
              <td className="px-3 py-2 text-right">
                <RowActions
                  table={table}
                  row={r}
                  columns={columns}
                  onView={() => setActive({ row: r, mode: "view" })}
                  onEdit={() => setActive({ row: r, mode: "edit" })}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <RowDialog
        table={table}
        row={active?.row ?? null}
        columns={columns}
        mode={active?.mode ?? "view"}
        onClose={() => setActive(null)}
      />
    </>
  );
}

export function ModuleLiveTable({ table, kicker, title, columns, limit }: Props) {
  return (
    <Panel
      kicker={kicker}
      title={title}
      action={
        <span className="inline-flex items-center gap-1.5 rounded border border-success/40 px-1.5 py-0.5">
          <Radio className="h-3 w-3 animate-pulse text-success" />
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-success">LIVE</span>
        </span>
      }
      padded={false}
    >
      <Suspense
        fallback={
          <div className="px-3 py-8 text-center text-[11px] font-mono text-muted-foreground">
            LOADING LIVE DATA…
          </div>
        }
      >
        <TableBody table={table} columns={columns} limit={limit} />
      </Suspense>
    </Panel>
  );
}

