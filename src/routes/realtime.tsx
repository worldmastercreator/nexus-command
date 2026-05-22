import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MiniArea } from "@/components/dash/charts";
import { generateSeries } from "@/lib/data";
import { useEvents, type BusEvent } from "@/lib/eventBus";
import { Sev } from "@/components/dash/FilterableTable";
import { useRbac, ROLE_META } from "@/lib/rbac";
import { Workflow, ScrollText, BugPlay, Radio } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/realtime")({
  head: () => ({ meta: [{ title: "Realtime · AEGIS OS" }] }),
  component: Page,
});

const CH_META = {
  workflow: { icon: Workflow, color: "var(--primary)", to: "/workflows" as const, label: "WORKFLOW" },
  logs: { icon: ScrollText, color: "var(--ai)", to: "/logs" as const, label: "LOG" },
  crash: { icon: BugPlay, color: "var(--danger)", to: "/crashes" as const, label: "CRASH" },
} as const;

function Page() {
  const [channels, setChannels] = useState<Record<keyof typeof CH_META, boolean>>({ workflow: true, logs: true, crash: true });
  const filter = useMemo(() => (e: BusEvent) => channels[e.channel], [channels]);
  const events = useEvents(filter, 80);
  const { role } = useRbac();
  const Mrole = ROLE_META[role];

  const counts = useMemo(() => {
    const c = { workflow: 0, logs: 0, crash: 0 } as Record<keyof typeof CH_META, number>;
    events.forEach((e) => { c[e.channel]++; });
    return c;
  }, [events]);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="UNIFIED · STREAM · MULTI-CHANNEL"
          title="Realtime Events Feed"
          subtitle="Live aggregation across Workflow Automation, Realtime Logs, and Crash Monitoring."
          actions={
            <div className="flex items-center gap-2 rounded border border-border bg-surface-2/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider">
              <Mrole.icon className={`h-3 w-3 ${Mrole.tone}`} />
              <span>VIEW AS · {Mrole.label}</span>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Events · live" value={String(events.length)} delta="rolling 80" tone="primary" spark={<MiniArea data={generateSeries(24, 901, 60, 22)} />} />
          <Metric label="Workflow runs" value={String(counts.workflow)} delta="ch 1" tone="ai" spark={<MiniArea data={generateSeries(24, 902, 50, 18)} color="var(--ai)" />} />
          <Metric label="Log lines" value={String(counts.logs)} delta="ch 2" tone="info" spark={<MiniArea data={generateSeries(24, 903, 70, 14)} color="var(--info)" />} />
          <Metric label="Crash signals" value={String(counts.crash)} delta="ch 3" tone="danger" spark={<MiniArea data={generateSeries(24, 904, 20, 16)} color="var(--danger)" />} />
        </div>

        <div className="flex flex-wrap gap-2">
          {(Object.keys(CH_META) as (keyof typeof CH_META)[]).map((k) => {
            const M = CH_META[k];
            const on = channels[k];
            return (
              <button key={k} onClick={() => setChannels((p) => ({ ...p, [k]: !p[k] }))}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-wider transition ${on ? "border-primary/50 bg-surface-2 text-foreground" : "border-border bg-surface/40 text-muted-foreground"}`}>
                <M.icon className="h-3 w-3" style={{ color: M.color }} />
                {M.label}
                <Link to={M.to} className="ml-1 rounded border border-border px-1 text-[9px] hover:border-primary/50">DRILL ↗</Link>
              </button>
            );
          })}
        </div>

        <Panel kicker="LIVE STREAM" title="Aggregated events · newest first">
          <div className="max-h-[520px] overflow-auto">
            <ul className="divide-y divide-border/40 font-mono text-[11.5px]">
              {[...events].reverse().map((e) => {
                const M = CH_META[e.channel];
                return (
                  <li key={e.id} className="flex items-start gap-3 py-2">
                    <span className="w-20 shrink-0 text-muted-foreground">{new Date(e.ts).toISOString().slice(11, 23)}</span>
                    <span className="inline-flex w-24 shrink-0 items-center gap-1" style={{ color: M.color }}>
                      <M.icon className="h-3 w-3" />{M.label}
                    </span>
                    <Sev s={e.severity} />
                    <span className="w-32 shrink-0 truncate text-foreground/90">{e.source}</span>
                    <span className="min-w-0 flex-1 truncate text-muted-foreground">{e.message}</span>
                    <span className="hidden shrink-0 text-muted-foreground md:inline">{e.meta?.latency_ms}ms · {e.meta?.region}</span>
                  </li>
                );
              })}
              {events.length === 0 && (
                <li className="py-10 text-center text-muted-foreground">
                  <Radio className="mx-auto mb-2 h-4 w-4 animate-pulse" />Waiting for signal…
                </li>
              )}
            </ul>
          </div>
        </Panel>
      </div>
    </div>
  );
}
