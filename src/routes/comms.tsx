import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Hash, Volume2, Users } from "lucide-react";

export const Route = createFileRoute("/comms")({
  head: () => ({ meta: [{ title: "Comms Hub · AEGIS OS" }] }),
  component: CommsPage,
});

const CHANNELS = [
  ["#general", 184, "primary"],
  ["#incidents", 42, "danger"],
  ["#sales-wins", 24, "success"],
  ["#engineering", 96, "ai"],
  ["#support-escalations", 18, "warning"],
  ["#design-system", 32, "info"],
] as const;

function CommsPage() {
  const live = useLiveSeries(48, 321, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 032 · SLACK + DISCORD" title="Communication Hub"
          subtitle="Channels · DMs · huddles · threads — internal comms backbone." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active users" value="1,842" delta="+12 now" tone="success" spark={<MiniArea data={generateSeries(24,51,60,8)} color="var(--success)" />} />
          <Metric label="Messages · 24h" value="48.2K" delta="+9%" tone="primary" spark={<MiniArea data={generateSeries(24,52,60,14)} />} />
          <Metric label="Voice huddles" value="48" delta="6 active" tone="ai" spark={<MiniArea data={generateSeries(24,53,40,10)} color="var(--ai)" />} />
          <Metric label="Threads" value="2,184" delta="-4%" tone="info" spark={<MiniArea data={generateSeries(24,54,60,12)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ACTIVITY" title="Messages · reactions · calls"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="TOP CHANNELS" title="Live message rate">
            <ul className="space-y-3 text-[12.5px]">{CHANNELS.map(([n,c,t]) => (
              <li key={n} className="space-y-1">
                <div className="flex items-center gap-2"><Hash className={`h-3.5 w-3.5 text-${t}`} /><span className="font-mono">{n.slice(1)}</span><span className="ml-auto font-mono text-muted-foreground">{c}/h</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,c/2)}%`}} /></div>
              </li>))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="HUDDLES" title="Active voice rooms">
            <ul className="space-y-2 text-[12px]">
              {[["#incidents · sev1 bridge",8,"danger"],["#sprint-planning",12,"primary"],["#design-review",6,"ai"],["#exec-standup",4,"warning"]].map(([n,u,t]) => (
                <li key={n as string} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <Volume2 className={`h-3.5 w-3.5 text-${t}`} />
                  <span className="font-mono">{n}</span>
                  <Users className="ml-auto h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-muted-foreground">{u}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="TIMEZONE LOAD" title="DAU by hour"><Bars data={generateSeries(24,59,60,22)} color="var(--primary)" h={220} /></Panel>
        </div>
      </div>
    </div>
  );
}
