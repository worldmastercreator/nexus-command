import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Workflow, CheckCircle2, AlertTriangle, Play } from "lucide-react";

export const Route = createFileRoute("/ai/workflows")({
  head: () => ({ meta: [{ title: "AI Workflows · AEGIS OS" }] }),
  component: Page,
});

const FLOWS = [
  ["onboard.user","Sales","RUNNING","success",1248],
  ["enrich.lead","Growth","RUNNING","success",842],
  ["invoice.retry","Finance","WARN","warning",96],
  ["incident.triage","Ops","RUNNING","success",312],
  ["webhook.fanout","Platform","FAILED","danger",4],
  ["nightly.report","BI","RUNNING","success",18],
  ["churn.predict","CS","RUNNING","success",60],
] as const;

function Page() {
  const live = useLiveSeries(48, 411, 80, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 041 · N8N · WORKFLOW ENGINE" title="AI Workflows"
          subtitle="Visual graphs · triggers · webhooks · code nodes — orchestrated end-to-end." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active flows" value="412" delta="+18 today" tone="ai" spark={<MiniArea data={generateSeries(24,412,80,12)} color="var(--ai)" />} />
          <Metric label="Runs · 24h" value="184,210" delta="+12%" tone="success" spark={<MiniArea data={generateSeries(24,413,90,22)} color="var(--success)" />} />
          <Metric label="Success" value="99.4%" delta="SLO 99%" tone="primary" spark={<MiniArea data={generateSeries(24,414,90,4)} />} />
          <Metric label="Failed" value="218" delta="0.6%" tone="danger" spark={<MiniArea data={generateSeries(24,415,40,18)} color="var(--danger)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EXECUTION TELEMETRY" title="Runs · success · latency"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="RELIABILITY" title="Engine health">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="SUCCESS" />
              <Radial value={86} color="var(--ai)" label="QUEUE OK" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg latency</span><span className="font-mono text-muted-foreground">240ms</span></li>
              <li className="flex justify-between"><span>Retry rate</span><span className="font-mono text-warning">1.2%</span></li>
              <li className="flex justify-between"><span>Workers online</span><span className="font-mono">24/24</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="WORKFLOW REGISTRY" title="Top active flows">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Flow</th><th>Team</th><th className="text-right">Runs · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{FLOWS.map(([n,t,s,tone,c]) => {
              const Ic = s==="FAILED"?AlertTriangle:s==="WARN"?AlertTriangle:s==="RUNNING"?Play:CheckCircle2;
              return (<tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Workflow className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground">{t}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Ic className="h-3 w-3" />{s}</span></td>
              </tr>);
            })}</tbody>
          </table>
        </Panel>
        <Panel kicker="NODE USAGE" title="Top node types · 24h"><Bars data={generateSeries(14,419,60,22)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
