import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { CloudUpload, Globe2 } from "lucide-react";

export const Route = createFileRoute("/deploy")({
  head: () => ({ meta: [{ title: "Deployments · AEGIS OS" }] }),
  component: Page,
});

const DEPLOYMENTS = [
  ["aegis-web","prod","iad1","LIVE","success","2m ago"],
  ["aegis-web","preview","sfo1","BUILDING","ai","18s ago"],
  ["aegis-api","prod","fra1","LIVE","success","42m ago"],
  ["aegis-edge","prod","sin1","LIVE","success","6m ago"],
  ["aegis-static","prod","gru1","ROLLED BACK","warning","1h ago"],
  ["aegis-ai","prod","iad1","LIVE","success","12m ago"],
] as const;

function Page() {
  const live = useLiveSeries(48, 561, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 056 · VERCEL · EDGE DEPLOY MESH" title="Deployments"
          subtitle="Atomic deploys · 32 regions · preview URLs · instant rollback · zero-downtime." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Deploys · 24h" value="412" delta="+24%" tone="primary" spark={<MiniArea data={generateSeries(24,562,60,16)} />} />
          <Metric label="Regions" value="32" delta="global" tone="success" spark={<MiniArea data={generateSeries(24,563,80,4)} color="var(--success)" />} />
          <Metric label="Avg deploy" value="42s" delta="-18%" tone="success" spark={<MiniArea data={generateSeries(24,564,40,8)} color="var(--success)" />} />
          <Metric label="Edge req/s" value="184k" delta="peak" tone="ai" spark={<MiniArea data={generateSeries(24,565,90,22)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EDGE TELEMETRY" title="Requests · TTFB · cache hit"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="RELIABILITY" title="Edge KPIs">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="SUCCESS" />
              <Radial value={94} color="var(--primary)" label="CACHE HIT" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>TTFB p95</span><span className="font-mono">42ms</span></li>
              <li className="flex justify-between"><span>Rollbacks · 7d</span><span className="font-mono text-warning">6</span></li>
              <li className="flex justify-between"><span>Preview URLs</span><span className="font-mono">1,248</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="DEPLOY REGISTRY" title="Recent deploys">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Project</th><th>Env</th><th>Region</th><th className="text-right">When</th><th className="text-right">Status</th></tr></thead>
            <tbody>{DEPLOYMENTS.map(([p,e,r,s,tone,w],i) => (
              <tr key={i} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><CloudUpload className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{p}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{e}</td>
                <td className="py-2 font-mono text-muted-foreground"><span className="inline-flex items-center gap-1"><Globe2 className="h-3 w-3" />{r}</span></td>
                <td className="py-2 text-right font-mono">{w}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{s}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="REGION MIX" title="Requests by region · 24h"><Bars data={generateSeries(14,569,80,22)} color="var(--primary)" h={220} /></Panel>
      </div>
    </div>
  );
}
