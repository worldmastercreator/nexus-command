import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial, StackedArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Network } from "lucide-react";

export const Route = createFileRoute("/api")({
  head: () => ({ meta: [{ title: "API Gateway · AEGIS OS" }] }),
  component: Page,
});

const ENDPOINTS = [
  ["GET /v1/orders","184k","42ms","success",0.02],
  ["POST /v1/payments","42k","148ms","success",0.18],
  ["GET /v1/users","612k","18ms","success",0.01],
  ["POST /v1/webhooks","18k","220ms","warning",1.84],
  ["GET /v1/search","248k","62ms","success",0.04],
  ["POST /v1/auth/token","96k","82ms","success",0.12],
  ["DELETE /v1/sessions","2k","240ms","danger",4.2],
] as const;

function Page() {
  const live = useLiveSeries(48, 571, 90, 22);
  const stacked = useLiveSeries(48, 572, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 057 · POSTMAN · API GATEWAY" title="API Gateway"
          subtitle="Routes · auth · throttling · contract tests · SLOs — every call observed." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Req/s" value="48,210" delta="peak 62k" tone="primary" spark={<MiniArea data={generateSeries(24,573,90,22)} />} />
          <Metric label="p95 latency" value="148ms" delta="SLO 250ms" tone="success" spark={<MiniArea data={generateSeries(24,574,60,12)} color="var(--success)" />} />
          <Metric label="Error rate" value="0.18%" delta="SLO 1%" tone="success" spark={<MiniArea data={generateSeries(24,575,40,8)} color="var(--success)" />} />
          <Metric label="Endpoints" value="412" delta="48 deprecated" tone="ai" spark={<MiniArea data={generateSeries(24,576,60,8)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GATEWAY TELEMETRY" title="RPS · errors · saturation"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="RELIABILITY" title="SLO burn">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={99} color="var(--success)" label="SLO MET" />
              <Radial value={84} color="var(--primary)" label="QUOTA" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Rate-limited</span><span className="font-mono text-warning">4,210</span></li>
              <li className="flex justify-between"><span>5xx · 24h</span><span className="font-mono text-danger">412</span></li>
              <li className="flex justify-between"><span>Auth fails</span><span className="font-mono">1.2%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="STATUS MIX" title="Response codes · 24h"><StackedArea data={stacked} h={220} /></Panel>
        <Panel kicker="ENDPOINT REGISTRY" title="Top routes · 24h">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Endpoint</th><th className="text-right">Calls</th><th className="text-right">p95</th><th className="text-right">Err%</th><th className="text-right">Health</th></tr></thead>
            <tbody>{ENDPOINTS.map(([e,c,l,tone,er]) => (
              <tr key={e} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Network className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{e}</span></td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right font-mono">{l}</td>
                <td className="py-2 text-right font-mono">{er}%</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{tone==="danger"?"ALERT":tone==="warning"?"WATCH":"OK"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
