import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Rocket, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding · AEGIS OS" }] }),
  component: OnboardingPage,
});

const STEPS = [
  ["Sign up", 100, "success"],
  ["Verify email", 92, "success"],
  ["Create workspace", 78, "ai"],
  ["Invite team", 54, "info"],
  ["First action", 38, "warning"],
  ["Aha moment", 22, "danger"],
] as const;

function OnboardingPage() {
  const live = useLiveSeries(48, 311, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 031 · APPCUES" title="Onboarding"
          subtitle="Activation flows · tours · checklists · TTV — guided experience engine." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Signups · 24h" value="1,842" delta="+12%" tone="primary" spark={<MiniArea data={generateSeries(24,41,60,14)} />} />
          <Metric label="Activation" value="38.2%" delta="+2.4pp" tone="success" spark={<MiniArea data={generateSeries(24,42,60,8)} color="var(--success)" />} />
          <Metric label="Time-to-value" value="14m" delta="-3m" tone="ai" spark={<MiniArea data={generateSeries(24,43,40,10)} color="var(--ai)" />} />
          <Metric label="Drop-off" value="22%" delta="step 4" tone="warning" spark={<MiniArea data={generateSeries(24,44,30,14)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ACTIVATION FUNNEL" title="Step-through · cohort 7d">
            <ul className="space-y-3">
              {STEPS.map(([n,p,t],i) => (
                <li key={n} className="space-y-1">
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <div className={`grid h-5 w-5 place-items-center rounded-full border border-${t}/40 font-mono text-[10px] text-${t}`}>{i+1}</div>
                    <span>{n}</span>
                    <span className="ml-auto font-mono text-muted-foreground">{p}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="QUALITY" title="Activation health">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={62} color="var(--success)" label="ACTIVATED" />
              <Radial value={84} color="var(--ai)" label="COMPLETION" />
            </div>
            <ul className="mt-4 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg steps done</span><span className="font-mono text-muted-foreground">4.2 / 6</span></li>
              <li className="flex justify-between"><span>Median session</span><span className="font-mono text-muted-foreground">8m 12s</span></li>
              <li className="flex justify-between"><span>Returning d2</span><span className="font-mono text-success">68%</span></li>
            </ul>
          </Panel>
        </div>

        <Panel kicker="LIVE COHORT" title="Realtime signups">
          <MultiLine data={live} h={220} />
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="FLOWS" title="Top tours · completion">
            <ul className="space-y-2 text-[12px]">
              {[["First import",84],["Connect bank",72],["Invite teammate",58],["Build first chart",46]].map(([n,p]) => (
                <li key={n as string} className="flex items-center gap-3">
                  <Rocket className="h-3.5 w-3.5 text-primary" />
                  <span className="w-36">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className="h-full bg-ai" style={{width:`${p}%`}} /></div>
                  <span className="w-10 text-right font-mono">{p}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="CHECKLIST" title="Per-user completion · 24h"><Bars data={generateSeries(12,49,60,22)} color="var(--success)" h={220} /></Panel>
        </div>
      </div>
    </div>
  );
}
