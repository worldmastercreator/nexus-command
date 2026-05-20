import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { TrendingUp, Flame, Trophy } from "lucide-react";

export const Route = createFileRoute("/sales")({
  head: () => ({ meta: [{ title: "Sales · AEGIS OS" }] }),
  component: SalesPage,
});

const STAGES = [
  ["Prospect", 1840, "info"],
  ["Qualified", 920, "primary"],
  ["Proposal", 410, "ai"],
  ["Negotiation", 184, "warning"],
  ["Closed Won", 82, "success"],
] as const;

const DEALS = [
  ["Aurora Labs", "$184K", "Negotiation", "Mira K.", "92%"],
  ["Pulse Co", "$96K", "Proposal", "Dev R.", "74%"],
  ["Helix CRM", "$240K", "Qualified", "Sara N.", "58%"],
  ["Nova Studio", "$48K", "Closed Won", "Theo L.", "100%"],
  ["Axiom UX", "$120K", "Negotiation", "Mira K.", "88%"],
] as const;

function SalesPage() {
  const live = useLiveSeries(50, 271, 60, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 027 · HUBSPOT SALES" title="Sales Manager"
          subtitle="Pipeline · velocity · forecast — revenue intelligence cockpit." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Pipeline" value="$8.42M" delta="+12.4%" tone="market" spark={<MiniArea data={generateSeries(24,1,60,16)} color="var(--market)" />} />
          <Metric label="Forecast Q" value="$2.18M" delta="84% attain" tone="ai" spark={<MiniArea data={generateSeries(24,2,60,12)} color="var(--ai)" />} />
          <Metric label="Win rate" value="38.2%" delta="+2.1pp" tone="success" spark={<MiniArea data={generateSeries(24,3,60,8)} color="var(--success)" />} />
          <Metric label="Cycle · days" value="42" delta="-6 vs prev" tone="info" spark={<MiniArea data={generateSeries(24,4,40,10)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="REVENUE FORECAST" title="Closed · committed · best case">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="PIPELINE" title="Stage funnel">
            <ul className="space-y-3 text-[12.5px]">
              {STAGES.map(([n,c,t]) => (
                <li key={n} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{c}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,c/20)}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="HOT DEALS" title="Closing this quarter">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Account</th><th>ARR</th><th>Stage</th><th>Owner</th><th className="text-right">Probability</th></tr></thead>
            <tbody>{DEALS.map(([a,v,s,o,p]) => (
              <tr key={a} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Flame className="h-3.5 w-3.5 text-warning" />{a}</td>
                <td className="py-2 font-mono text-market">{v}</td>
                <td className="py-2 text-muted-foreground">{s}</td>
                <td className="py-2">{o}</td>
                <td className="py-2 text-right font-mono text-success">{p}</td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="LEADERBOARD" title="Top reps · quota %">
            <ul className="space-y-2 text-[12px]">
              {[["Mira K.",128],["Sara N.",112],["Dev R.",98],["Theo L.",84],["Yuna P.",72]].map(([n,p],i) => (
                <li key={n as string} className="flex items-center gap-3">
                  <Trophy className={`h-3.5 w-3.5 ${i===0?"text-warning":"text-muted-foreground"}`} />
                  <span className="w-28">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className="h-full bg-ai" style={{width:`${Math.min(100,p as number)}%`}} /></div>
                  <span className="w-12 text-right font-mono">{p}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="ACTIVITY" title="Calls · emails · meetings · 7d"><Bars data={generateSeries(14,9,60,22)} color="var(--primary)" h={220} /></Panel>
        </div>
      </div>
    </div>
  );
}
