import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Boxes } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/saas")({
  head: () => ({ meta: [{ title: "SaaS Tenants · AEGIS OS" }] }),
  component: SaasPage,
});

function SaasPage() {
  const live = useLiveSeries(48, 221, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 022 · MULTI-TENANT SAAS PLATFORM"
          title="SaaS Tenant System"
          subtitle="Pod isolation · schema · quotas · usage billing — multi-region tenant orchestration."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Tenants" value="8,420" delta="+148 mo" tone="primary" spark={<MiniArea data={generateSeries(24,111,60,6)} />} />
          <Metric label="Active pods" value="48" delta="12 regions" tone="ai" spark={<MiniArea data={generateSeries(24,112,40,3)} color="var(--ai)" />} />
          <Metric label="Quota usage" value="68%" delta="auto-scale" tone="info" spark={<MiniArea data={generateSeries(24,113,60,10)} color="var(--info)" />} />
          <Metric label="Noisy neighbours" value="2" delta="throttled" tone="warning" spark={<MiniArea data={generateSeries(24,114,20,16)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TENANT LOAD" title="Requests · CPU · memory · queries"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="ISOLATION TIER" title="Pool · pod · dedicated">
            <ul className="space-y-3 text-[12.5px]">
              {[["Pool (shared)",6420,"info"],["Pod (silo)",1820,"ai"],["Dedicated",180,"market"]].map(([n,c,t])=>(
                <li key={n as string} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{c}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,(c as number)/65)}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP TENANTS" title="Usage · 24h">
          <table className="w-full text-[12px]"><tbody>
            {[["t_aurora_8421","Aurora Labs","2.4M req","Pod · us-east","HEALTHY"],["t_pulse_1184","Pulse Co","1.8M req","Pod · eu-west","HEALTHY"],["t_helix_7780","Helix CRM","1.2M req","Dedicated · ap-south","HEALTHY"],["t_nova_4421","Nova Studio","842K req","Pool · us-west","THROTTLED"],["t_axiom_2110","Axiom","620K req","Pod · sa-east","HEALTHY"]].map(([id,n,r,p,s])=>(
              <tr key={id} className="border-b border-border/60 last:border-0">
                <td className="py-2 font-mono text-[11px] text-muted-foreground">{id}</td>
                <td className="py-2 flex items-center gap-2"><Boxes className="h-3.5 w-3.5 text-primary" />{n}</td>
                <td className="py-2 font-mono text-info">{r}</td>
                <td className="py-2 text-muted-foreground">{p}</td>
                <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="HEALTHY"?"border-success/40 text-success":"border-warning/40 text-warning"}`}>{s}</span></td>
              </tr>
            ))}
          </tbody></table>
        </Panel>

        <Panel kicker="REGIONS" title="Tenants per region"><Bars data={generateSeries(12,118,60,22)} color="var(--ai)" h={200} /></Panel>

        <ConnectedModules ids={[21, 13, 15, 24, 14]} />
      </div>
    </div>
  );
}
