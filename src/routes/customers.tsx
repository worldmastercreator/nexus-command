import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { UserCircle, Mail, Phone, MessageCircle } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";
import { ModuleLiveTable, StatusBadge, fmtMoney } from "@/components/dash/ModuleLiveTable";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customer Management · AEGIS OS" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const live = useLiveSeries(48, 241, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 024 · SALESFORCE / HUBSPOT CRM"
          title="Customer Management"
          subtitle="Accounts · contacts · opportunities · journeys · NPS — 360° customer graph."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Customers" value="184,210" delta="+1.2k" tone="primary" spark={<MiniArea data={generateSeries(24,131,60,8)} />} />
          <Metric label="MRR" value="$842K" delta="+4.2%" tone="success" spark={<MiniArea data={generateSeries(24,132,80,6)} color="var(--success)" />} />
          <Metric label="NPS" value="62" delta="+4" tone="ai" spark={<MiniArea data={generateSeries(24,133,60,8)} color="var(--ai)" />} />
          <Metric label="Open tickets" value="142" delta="SLA 98%" tone="warning" spark={<MiniArea data={generateSeries(24,134,40,12)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="JOURNEY" title="Acquisition · activation · expansion"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="HEALTH SCORE" title="Customer health distribution">
            <Radial value={84} color="var(--success)" label="HEALTHY" h={180} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded border border-success/40 bg-success/10 p-2 text-center"><div className="font-mono text-success">142K</div><div className="text-muted-foreground">Green</div></div>
              <div className="rounded border border-warning/40 bg-warning/10 p-2 text-center"><div className="font-mono text-warning">28K</div><div className="text-muted-foreground">Amber</div></div>
              <div className="rounded border border-danger/40 bg-danger/10 p-2 text-center"><div className="font-mono text-danger">14K</div><div className="text-muted-foreground">Red</div></div>
            </div>
          </Panel>
        </div>

        <Panel kicker="TOP ACCOUNTS" title="High-value customers">
          <table className="w-full text-[12px]"><tbody>
            {[["Aurora Labs","Enterprise","$184K ARR",92],["Pulse Co","Business","$98K ARR",88],["Helix CRM","Enterprise","$148K ARR",94],["Nova Studio","Pro","$48K ARR",76],["Axiom UX","Business","$72K ARR",81]].map(([n,t,r,h],i)=>(
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i+1}</td>
                <td className="py-2 flex items-center gap-2"><UserCircle className="h-3.5 w-3.5 text-primary" />{n}</td>
                <td className="py-2 text-muted-foreground">{t}</td>
                <td className="py-2 text-right font-mono text-success">{r}</td>
                <td className="py-2 text-right font-mono"><span className={h as number>=85?"text-success":h as number>=75?"text-warning":"text-danger"}>{h}</span></td>
              </tr>
            ))}
          </tbody></table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="CHANNELS" title="Inbound mix">
            <ul className="space-y-2 text-[12px]">
              {[[Mail,"Email",42,"primary"],[MessageCircle,"Chat",28,"ai"],[Phone,"Phone",18,"info"],[UserCircle,"Self-serve",12,"success"]].map(([I,n,p,t])=>{const Ico=I as any; return (
                <li key={n as string} className="space-y-1">
                  <div className="flex items-center gap-2"><Ico className="h-3.5 w-3.5" /><span>{n as string}</span><span className="ml-auto font-mono text-muted-foreground">{p as number}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>
              );})}
            </ul>
          </Panel>
          <Panel kicker="SEGMENTS" title="By plan tier"><Bars data={generateSeries(10,138,60,18)} color="var(--primary)" h={220} /></Panel>
          <Panel kicker="LIFETIME" title="LTV cohorts"><Bars data={generateSeries(10,139,60,22)} color="var(--success)" h={220} /></Panel>
        </div>

        <ModuleLiveTable
          table="mod_customers"
          kicker="LIVE · LOVABLE CLOUD"
          title="Customer accounts"
          columns={[
            { key: "name", label: "Customer" },
            { key: "email", label: "Email", className: "font-mono text-[11px] text-info" },
            { key: "plan", label: "Plan", className: "text-muted-foreground" },
            { key: "ltv", label: "LTV", align: "right", format: (v) => <span className="text-success">{fmtMoney(v)}</span> },
            { key: "status", label: "Status", align: "right", format: (v) => <StatusBadge value={String(v)} /> },
          ]}
        />

        <ConnectedModules ids={[11, 24, 25, 13, 19]} />
      </div>
    </div>
  );
}
