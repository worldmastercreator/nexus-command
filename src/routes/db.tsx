import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Database, Table as TableIcon } from "lucide-react";

export const Route = createFileRoute("/db")({
  head: () => ({ meta: [{ title: "Database · AEGIS OS" }] }),
  component: Page,
});

const TABLES = [
  ["orders","42.8M","18.4 GB","success",1840],
  ["users","18.2M","6.2 GB","success",640],
  ["events","148.6M","82.4 GB","warning",4210],
  ["payments","12.4M","3.8 GB","success",1248],
  ["sessions","240.2M","48.6 GB","warning",6420],
  ["audit_log","612.4M","148.2 GB","success",2840],
] as const;

function Page() {
  const live = useLiveSeries(48, 581, 70, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 058 · SUPABASE STUDIO · POSTGRES OPS" title="Database"
          subtitle="Tables · indexes · queries · replication · vacuum · RLS — every byte tracked." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="QPS" value="48,210" delta="peak 82k" tone="primary" spark={<MiniArea data={generateSeries(24,582,90,22)} />} />
          <Metric label="Tables" value="412" delta="148 indexed" tone="ai" spark={<MiniArea data={generateSeries(24,583,60,6)} color="var(--ai)" />} />
          <Metric label="Storage" value="2.4 TB" delta="42% used" tone="success" spark={<MiniArea data={generateSeries(24,584,80,8)} color="var(--success)" />} />
          <Metric label="Replication" value="12ms" delta="lag · primary" tone="success" spark={<MiniArea data={generateSeries(24,585,40,6)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="DB TELEMETRY" title="QPS · connections · cache"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="HEALTH" title="Cluster">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={94} color="var(--success)" label="CACHE HIT" />
              <Radial value={62} color="var(--warning)" label="CPU" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Connections</span><span className="font-mono">412/500</span></li>
              <li className="flex justify-between"><span>Slow queries</span><span className="font-mono text-warning">42/min</span></li>
              <li className="flex justify-between"><span>WAL backlog</span><span className="font-mono">18 MB</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="TABLE REGISTRY" title="Largest tables">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Table</th><th className="text-right">Rows</th><th className="text-right">Size</th><th className="text-right">QPS</th><th className="text-right">Status</th></tr></thead>
            <tbody>{TABLES.map(([n,r,sz,tone,q]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><TableIcon className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-right font-mono">{r}</td>
                <td className="py-2 text-right font-mono">{sz}</td>
                <td className="py-2 text-right font-mono">{q}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Database className="h-3 w-3" />{tone==="warning"?"VACUUM":"HOT"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="QUERY MIX" title="Top query patterns · 24h"><Bars data={generateSeries(14,589,70,22)} color="var(--primary)" h={220} /></Panel>
      </div>
    </div>
  );
}
