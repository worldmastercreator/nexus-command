import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial, StackedArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/ai/support")({
  head: () => ({ meta: [{ title: "Support Assistant · AEGIS OS" }] }),
  component: Page,
});

const INTENTS = [
  ["billing.refund",2840,"96%","success"],
  ["account.reset",1920,"98%","success"],
  ["product.howto",4210,"94%","success"],
  ["api.error",640,"82%","warning"],
  ["enterprise.contract",96,"70%","warning"],
  ["complaint.escalate",42,"54%","danger"],
] as const;

function Page() {
  const live = useLiveSeries(48, 451, 60, 16);
  const stacked = useLiveSeries(48, 452, 70, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 045 · INTERCOM AI · CONVERSATIONAL SUPPORT" title="Support Assistant"
          subtitle="Live AI handling · escalations · knowledge fusion · CSAT-tuned." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Convos · 24h" value="18,420" delta="+12%" tone="ai" spark={<MiniArea data={generateSeries(24,453,80,18)} color="var(--ai)" />} />
          <Metric label="AI resolved" value="84%" delta="SLO 75%" tone="success" spark={<MiniArea data={generateSeries(24,454,80,8)} color="var(--success)" />} />
          <Metric label="CSAT" value="4.7/5" delta="+0.2" tone="success" spark={<MiniArea data={generateSeries(24,455,90,4)} color="var(--success)" />} />
          <Metric label="Escalations" value="184" delta="0.9%" tone="warning" spark={<MiniArea data={generateSeries(24,456,40,14)} color="var(--warning)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CONVO TELEMETRY" title="Volume · resolved · escalated"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="ASSIST KPIs" title="Quality">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={84} color="var(--success)" label="RESOLVED" />
              <Radial value={94} color="var(--ai)" label="CSAT" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>FRT</span><span className="font-mono">8s</span></li>
              <li className="flex justify-between"><span>AHT</span><span className="font-mono text-muted-foreground">2m 14s</span></li>
              <li className="flex justify-between"><span>Deflection</span><span className="font-mono">62%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="INTENT MIX" title="Top intents · 24h"><StackedArea data={stacked} h={220} /></Panel>
        <Panel kicker="INTENT TABLE" title="Resolution by intent">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Intent</th><th className="text-right">Convos</th><th className="text-right">Resolve%</th><th className="text-right">Status</th></tr></thead>
            <tbody>{INTENTS.map(([n,c,r,tone]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><HelpCircle className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right font-mono">{r}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{tone==="danger"?"ESCALATE":tone==="warning"?"REVIEW":"AUTO"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="LATENCY" title="First reply distribution"><Bars data={generateSeries(14,459,40,10)} color="var(--success)" h={200} /></Panel>
      </div>
    </div>
  );
}
