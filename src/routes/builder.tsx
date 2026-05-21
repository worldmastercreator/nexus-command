import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Hammer, Component, Layers } from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: () => ({ meta: [{ title: "Tool Builder · AEGIS OS" }] }),
  component: Page,
});

const APPS = [
  ["Refund Console","Finance · ops",84,"success"],
  ["Lead Inspector","Sales · GTM",212,"success"],
  ["Driver Dispatch","Ops · live",640,"success"],
  ["Vendor Onboard","Procurement",18,"warning"],
  ["KYC Reviewer","Risk · review",96,"success"],
  ["Inventory Audit","Warehouse",42,"warning"],
] as const;

function Page() {
  const live = useLiveSeries(48, 461, 55, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 046 · RETOOL · INTERNAL TOOLS" title="Tool Builder"
          subtitle="Drag-drop apps · 240 queries · RBAC · audit — ship in hours not weeks." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Apps" value="184" delta="+12 wk" tone="primary" spark={<MiniArea data={generateSeries(24,462,60,8)} />} />
          <Metric label="Queries · 24h" value="412,840" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(24,463,80,18)} color="var(--success)" />} />
          <Metric label="Users active" value="1,248" delta="42 teams" tone="ai" spark={<MiniArea data={generateSeries(24,464,80,14)} color="var(--ai)" />} />
          <Metric label="Avg latency" value="180ms" delta="p95 420ms" tone="success" spark={<MiniArea data={generateSeries(24,465,40,8)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="USAGE TELEMETRY" title="Queries · errors · users"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="PLATFORM" title="Build health">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={98} color="var(--success)" label="UPTIME" />
              <Radial value={84} color="var(--primary)" label="ADOPTION" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Components</span><span className="font-mono">412</span></li>
              <li className="flex justify-between"><span>Data sources</span><span className="font-mono">48</span></li>
              <li className="flex justify-between"><span>Saved queries</span><span className="font-mono text-muted-foreground">2,840</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="APP REGISTRY" title="Top internal apps">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">App</th><th>Owner</th><th className="text-right">Sessions · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{APPS.map(([n,o,c,tone]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Component className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground">{o}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Layers className="h-3 w-3" />{tone==="warning"?"REVIEW":"LIVE"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="COMPONENT USAGE" title="Top components rendered"><Bars data={generateSeries(14,469,60,18)} color="var(--primary)" h={220} /><span className="sr-only"><Hammer /></span></Panel>
      </div>
    </div>
  );
}
