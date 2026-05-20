import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { HeartPulse, AlertTriangle, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/success")({
  head: () => ({ meta: [{ title: "Customer Success · AEGIS OS" }] }),
  component: SuccessPage,
});

const ACCOUNTS = [
  ["Aurora Labs","$184K","82","RISING","success"],
  ["Pulse Co","$96K","48","AT RISK","warning"],
  ["Helix CRM","$240K","91","HEALTHY","success"],
  ["Nova Studio","$48K","22","CHURN RISK","danger"],
  ["Axiom UX","$120K","74","STABLE","info"],
] as const;

function SuccessPage() {
  const live = useLiveSeries(48, 301, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 030 · GAINSIGHT" title="Customer Success"
          subtitle="Health scores · adoption · expansion · churn risk — retention OS." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="NRR" value="124%" delta="+6pp YoY" tone="success" spark={<MiniArea data={generateSeries(24,31,60,8)} color="var(--success)" />} />
          <Metric label="Churn · MoM" value="1.8%" delta="-0.4pp" tone="danger" spark={<MiniArea data={generateSeries(24,32,30,12)} color="var(--danger)" />} />
          <Metric label="Health avg" value="78" delta="+3" tone="ai" spark={<MiniArea data={generateSeries(24,33,60,10)} color="var(--ai)" />} />
          <Metric label="At risk · ARR" value="$148K" delta="12 accounts" tone="warning" spark={<MiniArea data={generateSeries(24,34,40,14)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ADOPTION TREND" title="DAU · WAU · MAU"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="HEALTH MIX" title="Portfolio">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={62} color="var(--success)" label="HEALTHY" />
              <Radial value={26} color="var(--warning)" label="AT RISK" />
              <Radial value={8} color="var(--danger)" label="CHURN" />
              <Radial value={4} color="var(--ai)" label="EXPAND" />
            </div>
          </Panel>
        </div>

        <Panel kicker="ACCOUNTS" title="Watchlist · top ARR">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Account</th><th>ARR</th><th>Health</th><th>State</th><th className="text-right">Action</th></tr></thead>
            <tbody>{ACCOUNTS.map(([a,v,h,s,t]) => (
              <tr key={a} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><HeartPulse className={`h-3.5 w-3.5 text-${t}`} />{a}</td>
                <td className="py-2 font-mono text-market">{v}</td>
                <td className="py-2"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${h}%`}} /></div><span className="font-mono text-[11px] text-muted-foreground">{h}</span></div></td>
                <td className="py-2"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] border-${t}/40 text-${t}`}>{s}</span></td>
                <td className="py-2 text-right"><button className="inline-flex items-center gap-1 font-mono text-[10.5px] text-primary">PLAYBOOK <ArrowUpRight className="h-3 w-3" /></button></td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="EXPANSION SIGNALS" title="Upsell candidates · 7d">
            <ul className="space-y-2 text-[12px]">
              {[["Aurora Labs","Hit 92% seat usage","$48K"],["Helix CRM","Added 3 integrations","$24K"],["Quantum Co","Enabled SSO","$18K"],["Axiom UX","API calls +180%","$12K"]].map(([a,sig,v]) => (
                <li key={a} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                  <span className="font-medium">{a}</span><span className="text-muted-foreground">· {sig}</span>
                  <span className="ml-auto font-mono text-success">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="RISK SIGNALS" title="Churn alerts · 7d">
            <ul className="space-y-2 text-[12px]">
              {[["Nova Studio","No login 21d","$48K"],["Pulse Co","CSAT drop to 3.2","$96K"],["Vertex","Downgrade requested","$22K"],["Helio","Webhook failures","$14K"]].map(([a,sig,v]) => (
                <li key={a} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-danger" />
                  <span className="font-medium">{a}</span><span className="text-muted-foreground">· {sig}</span>
                  <span className="ml-auto font-mono text-danger">{v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="ADOPTION HEATMAP" title="Feature usage · 14d"><Bars data={generateSeries(14,39,60,22)} color="var(--ai)" h={200} /></Panel>
      </div>
    </div>
  );
}
