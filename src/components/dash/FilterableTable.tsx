import { useMemo, useState, type ReactNode } from "react";
import { Panel } from "@/components/dash/primitives";
import { exportCsv } from "@/lib/eventBus";
import { Gated } from "@/lib/rbac";
import { Download, Search } from "lucide-react";

export interface Column<T> {
  key: keyof T & string;
  label: string;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
  mono?: boolean;
}

export function FilterableTable<T extends object>({
  title, kicker, rows, columns, facets, exportName,
}: {
  title: string; kicker: string;
  rows: T[]; columns: Column<T>[];
  facets?: { key: keyof T & string; label: string; options: string[] }[];
  exportName: string;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const ql = q.toLowerCase();
    return rows.filter((r) => {
      const rec = r as Record<string, unknown>;
      if (ql && !columns.some((c) => String(rec[c.key] ?? "").toLowerCase().includes(ql))) return false;
      for (const k in active) {
        if (active[k] && String(rec[k] ?? "") !== active[k]) return false;
      }
      return true;
    });
  }, [rows, q, active, columns]);

  return (
    <Panel kicker={kicker} title={title} action={
      <Gated perm="logs.export" label="EXPORT LOCKED">
        <button onClick={() => exportCsv(filtered, `${exportName}.csv`)}
          className="inline-flex items-center gap-1 rounded border border-border bg-surface-2 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-foreground hover:border-primary/40">
          <Download className="h-3 w-3" />Export {filtered.length}
        </button>
      </Gated>
    }>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter…"
            className="h-7 w-56 rounded border border-border bg-surface-2 pl-7 pr-2 font-mono text-[11px] text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none" />
        </div>
        {facets?.map((f) => (
          <select key={f.key} value={active[f.key] ?? ""} onChange={(e) => setActive((p) => ({ ...p, [f.key]: e.target.value }))}
            className="h-7 rounded border border-border bg-surface-2 px-2 font-mono text-[11px] text-foreground focus:border-primary/50 focus:outline-none">
            <option value="">{f.label} · ALL</option>
            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <div className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {filtered.length} / {rows.length}
        </div>
      </div>
      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-[12px]">
          <thead className="sticky top-0 bg-surface/95 backdrop-blur">
            <tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => <th key={c.key} className={`py-2 ${c.align === "right" ? "text-right" : ""}`}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="border-b border-border/40 last:border-0 hover:bg-surface-2/40">
                {columns.map((c) => (
                  <td key={c.key} className={`py-1.5 ${c.align === "right" ? "text-right" : ""} ${c.mono ? "font-mono text-[11px]" : ""}`}>
                    {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length} className="py-8 text-center font-mono text-[11px] text-muted-foreground">NO MATCHING RECORDS</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

export function Sev({ s }: { s: "info" | "success" | "warning" | "danger" }) {
  const tone = { info: "text-info border-info/40", success: "text-success border-success/40", warning: "text-warning border-warning/40", danger: "text-danger border-danger/40" }[s];
  return <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${tone}`}>{s}</span>;
}
