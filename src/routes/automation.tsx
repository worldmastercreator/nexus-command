import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Zap, AlertTriangle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation · AEGIS OS" }] }),
  component: Page,
});

const ZAPS = [
  ["lead.crm.sync","Salesforce → HubSpot","RUNNING","success",18420],
  ["order.shopify.slack","Shopify → Slack","RUNNING","success",2840],
  ["invoice.email","Stripe → Gmail","RUNNING","success",1248],
  ["ticket.escalate","Zendesk → Pager","WARN","warning",96],
  ["bi.snapshot","Postgres → Sheet","RUNNING","success",42],
  ["bug.report","Sentry → Linear","FAILED","danger",4],
] as const;

function Page() {
  const live = useLiveSeries(48, 471, 65, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 047 · ZAPIER · NO-CODE AUTOMATION" title="Automation"
          subtitle="Cross-app zaps · 5,000 connectors · scheduled · webhook — at SaaS scale." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active zaps" value="1,248" delta="+42 wk" tone="primary" spark={<MiniArea data={generateSeries(24,472,80,14)} />} />
          <Metric label="Tasks · 24h" value="2.4M" delta="+22%" tone="success" spark={<MiniArea data={generateSeries(24,473,90,22)} color="var(--success)" />} />
          <Metric label="Errors" value="184" delta="0.008%" tone="warning" spark={<MiniArea data={generateSeries(24,474,40,18)} color="var(--warning)" />} />
          <Metric label="Connectors" value="412" delta="48 custom" tone="ai" spark={<MiniArea data={generateSeries(24,475,60,8)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EXECUTION TELEMETRY" title="Tasks · success · errors"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="HEALTH" title="Run reliability">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="SUCCESS" />
              <Radial value={92} color="var(--primary)" label="QUEUE" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg run</span><span className="font-mono">240ms</span></li>
              <li className="flex justify-between"><span>Quota used</span><span className="font-mono text-muted-foreground">62%</span></li>
              <li className="flex justify-between"><span>Replays · 24h</span><span className="font-mono text-warning">412</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="ZAP REGISTRY" title="Live workflows">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Zap</th><th>Path</th><th className="text-right">Tasks · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{ZAPS.map(([n,p,s,tone,c]) => {
              const Ic = s==="FAILED"||s==="WARN"?AlertTriangle:CheckCircle2;
              return (<tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Zap className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground">{p}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Ic className="h-3 w-3" />{s}</span></td>
              </tr>);
            })}</tbody>
          </table>
        </Panel>
        <Panel kicker="CONNECTOR USAGE" title="Top connectors · 24h"><Bars data={generateSeries(14,479,60,22)} color="var(--primary)" h={220} /></Panel>
      </div>
    </div>
  );
}
