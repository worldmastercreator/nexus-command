import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Eye, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/demos")({
  head: () => ({ meta: [{ title: "Demo System · AEGIS OS" }] }),
  component: Page,
});

const DEMOS = [
  ["aurora-enterprise","aurora.demo.aegis","LIVE","success",1248],
  ["vala-ai-pitch","vala.demo.aegis","LIVE","success",840],
  ["mlm-genesis","mlm.demo.aegis","LIVE","success",412],
  ["pos-retail","pos.demo.aegis","STAGING","warning",18],
  ["shopify-suite","shop.demo.aegis","LIVE","success",96],
  ["payroll-core","payroll.demo.aegis","ARCHIVED","info",0],
] as const;

function Page() {
  const live = useLiveSeries(48, 481, 50, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 048 · VERCEL PREVIEW · DEMO MESH" title="Demo System"
          subtitle="Per-branch demos · share links · expiring access · session telemetry." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Live demos" value="184" delta="42 new" tone="primary" spark={<MiniArea data={generateSeries(24,482,60,10)} />} />
          <Metric label="Sessions · 24h" value="12,840" delta="+34%" tone="success" spark={<MiniArea data={generateSeries(24,483,80,18)} color="var(--success)" />} />
          <Metric label="Avg dwell" value="6m 42s" delta="+18%" tone="ai" spark={<MiniArea data={generateSeries(24,484,60,12)} color="var(--ai)" />} />
          <Metric label="Share links" value="2,148" delta="84 exp" tone="warning" spark={<MiniArea data={generateSeries(24,485,40,8)} color="var(--warning)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="SESSION TELEMETRY" title="Visits · convo rate · dwell"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="CONVERSION" title="Demo → deal funnel">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={42} color="var(--success)" label="DEMO→TRIAL" />
              <Radial value={18} color="var(--primary)" label="TRIAL→PAID" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg interactions</span><span className="font-mono">24</span></li>
              <li className="flex justify-between"><span>Bounce</span><span className="font-mono text-warning">12%</span></li>
              <li className="flex justify-between"><span>Recordings</span><span className="font-mono text-muted-foreground">1,248</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="DEMO REGISTRY" title="Active demos">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Demo</th><th>Host</th><th className="text-right">Sessions · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{DEMOS.map(([n,h,s,tone,c]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Eye className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground font-mono">{h}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><ExternalLink className="h-3 w-3" />{s}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="TRAFFIC" title="Visitors per demo · 24h"><Bars data={generateSeries(14,489,60,18)} color="var(--success)" h={220} /></Panel>
      </div>
    </div>
  );
}
