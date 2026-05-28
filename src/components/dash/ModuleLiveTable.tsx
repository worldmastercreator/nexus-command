import { useSuspenseQuery } from "@tanstack/react-query";
import { moduleQueryOptions, type ModuleTable } from "@/lib/modules.functions";
import { Panel } from "@/components/dash/primitives";
import { Suspense } from "react";

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

function statusTone(s: string) {
  const t = s.toUpperCase();
  if (["ACTIVE", "PAID", "SUCCESS", "OPEN", "LIVE", "PUBLISHED"].includes(t)) return "border-success/40 text-success";
  if (["PENDING", "REVIEW", "STAGING", "PILOT", "PAST_DUE"].includes(t)) return "border-warning/40 text-warning";
  if (["FAILED", "REFUNDED", "REVOKED", "EXPIRED", "CHURNED", "CANCELED", "DRAFT"].includes(t)) return "border-danger/40 text-danger";
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

function TableBody({ table, columns, limit }: { table: ModuleTable; columns: Col[]; limit?: number }) {
  const { data } = useSuspenseQuery(moduleQueryOptions(table, limit));
  const rows = data.rows as Record<string, unknown>[];
  if (rows.length === 0) {
    return <div className="px-3 py-8 text-center text-[12px] text-muted-foreground">No records yet.</div>;
  }
  return (
    <table className="w-full text-[12px]">
      <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
        <tr>
          {columns.map((c) => (
            <th key={c.key} className={`px-3 py-2 ${c.align === "right" ? "text-right" : "text-left"}`}>{c.label}</th>
          ))}
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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ModuleLiveTable({ table, kicker, title, columns, limit }: Props) {
  return (
    <Panel kicker={kicker} title={title} padded={false}>
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
