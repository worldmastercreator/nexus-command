import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { GitMerge, CheckCircle2, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/ci")({
  head: () => ({ meta: [{ title: "CI/CD · AEGIS OS" }] }),
  component: Page,
});

const PIPELINES = [
  ["core.build","aegis/core","main","PASS","success","3m 42s"],
  ["web.deploy","aegis/web","main","PASS","success","2m 18s"],
  ["mobile.beta","aegis/mobile","develop","RUNNING","ai","—"],
  ["infra.plan","aegis/infra","main","PASS","success","4m 02s"],
  ["ai.train","aegis/ai","main","FAIL","danger","12m 18s"],
  ["billing.smoke","aegis/billing","main","PASS","success","1m 12s"],
] as const;

function Page() {
  const live = useLiveSeries(48, 551, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 055 · GITLAB CI · BUILD GRID" title="CI / CD"
          subtitle="Pipelines · runners · stages · cache · artifacts — every commit gated." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Pipelines · 24h" value="2,840" delta="+18%" tone="primary" spark={<MiniArea data={generateSeries(24,552,80,18)} />} />
          <Metric label="Pass rate" value="98.2%" delta="SLO 95%" tone="success" spark={<MiniArea data={generateSeries(24,553,90,4)} color="var(--success)" />} />
          <Metric label="Avg duration" value="3m 42s" delta="-12%" tone="success" spark={<MiniArea data={generateSeries(24,554,40,10)} color="var(--success)" />} />
          <Metric label="Runners" value="32/32" delta="0 idle" tone="ai" spark={<MiniArea data={generateSeries(24,555,60,4)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="PIPELINE TELEMETRY" title="Runs · pass · fail"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="DELIVERY" title="DORA metrics">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={92} color="var(--success)" label="DEPLOY FREQ" />
              <Radial value={88} color="var(--primary)" label="LEAD TIME" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>MTTR</span><span className="font-mono">18m</span></li>
              <li className="flex justify-between"><span>Change fail</span><span className="font-mono text-warning">3.4%</span></li>
              <li className="flex justify-between"><span>Cache hit</span><span className="font-mono">84%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="PIPELINE REGISTRY" title="Recent runs">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Pipeline</th><th>Repo</th><th>Branch</th><th className="text-right">Duration</th><th className="text-right">Status</th></tr></thead>
            <tbody>{PIPELINES.map(([n,r,b,s,tone,d]) => {
              const Ic = s==="FAIL"?XCircle:s==="RUNNING"?Clock:CheckCircle2;
              return (<tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><GitMerge className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{r}</td>
                <td className="py-2 font-mono text-muted-foreground">{b}</td>
                <td className="py-2 text-right font-mono">{d}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Ic className="h-3 w-3" />{s}</span></td>
              </tr>);
            })}</tbody>
          </table>
        </Panel>
        <Panel kicker="STAGE TIMING" title="Avg duration per stage"><Bars data={generateSeries(12,559,60,18)} color="var(--success)" h={220} /></Panel>
      </div>
    </div>
  );
}
