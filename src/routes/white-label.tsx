import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Layers3, Palette, Globe } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/white-label")({
  head: () => ({ meta: [{ title: "White Label · AEGIS OS" }] }),
  component: WhiteLabelPage,
});

function WhiteLabelPage() {
  const live = useLiveSeries(48, 211, 60, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 021 · GOHIGHLEVEL WHITE-LABEL SAAS"
          title="White Label System"
          subtitle="Brands · domains · themes · CNAME · SSL · per-tenant SMTP — reseller branding stack."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Branded tenants" value="284" delta="+12" tone="primary" spark={<MiniArea data={generateSeries(24,101,60,6)} />} />
          <Metric label="Custom domains" value="248" delta="+12 active" tone="info" spark={<MiniArea data={generateSeries(24,102,60,6)} color="var(--info)" />} />
          <Metric label="SSL coverage" value="100%" delta="auto-renew" tone="success" spark={<MiniArea data={generateSeries(24,103,80,2)} color="var(--success)" />} />
          <Metric label="Theme renders" value="8.4K/s" delta="edge cached" tone="ai" spark={<MiniArea data={generateSeries(24,104,60,12)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="EDGE DELIVERY" title="Per-tenant request stream"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="CONFIG HEALTH" title="DNS · SSL · SMTP">
            <Radial value={98} color="var(--success)" label="HEALTHY" h={180} />
            <div className="mt-3 space-y-2 text-[11.5px]">
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Globe className="h-3 w-3" />CNAME propagated</span><span className="text-success">248/248</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-2"><Palette className="h-3 w-3" />Custom themes</span><span className="text-success">284</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">SMTP relays</span><span className="text-warning">4 pending</span></div>
            </div>
          </Panel>
        </div>

        <Panel kicker="TENANT BRANDS" title="Active workspaces">
          <table className="w-full text-[12px]"><tbody>
            {[["aurora.app","Aurora Labs","#3B82F6","ACTIVE"],["pulse.io","Pulse Co","#8B5CF6","ACTIVE"],["helix-crm.com","Helix","#06B6D4","ACTIVE"],["nova.studio","Nova","#10B981","PROVISIONING"],["axiom.dev","Axiom UX","#F59E0B","ACTIVE"]].map(([d,n,c,s])=>(
              <tr key={d} className="border-b border-border/60 last:border-0">
                <td className="py-2 font-mono text-[11px] text-info">{d}</td>
                <td className="py-2 flex items-center gap-2"><Layers3 className="h-3.5 w-3.5" style={{color:c as string}} />{n}</td>
                <td className="py-2 font-mono text-[11px] text-muted-foreground">{c}</td>
                <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="ACTIVE"?"border-success/40 text-success":"border-warning/40 text-warning"}`}>{s}</span></td>
              </tr>
            ))}
          </tbody></table>
        </Panel>

        <ConnectedModules ids={[22, 21, 17, 24, 13]} />
      </div>
    </div>
  );
}
