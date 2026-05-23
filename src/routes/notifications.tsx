import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications · AEGIS OS" }] }),
  component: NotificationsPage,
});

const SEV = [
  ["P1", "danger"], ["P2", "warning"], ["P3", "info"], ["P4", "success"],
] as const;

function NotificationsPage() {
  const live = useLiveSeries(60, 211, 80, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 005 · PAGERDUTY"
          title="Notification & Incident Router"
          subtitle="On-call schedules, escalation policies, signal-noise filtering."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Open incidents" value="14" tone="warning" spark={<MiniArea data={generateSeries(24, 1, 30, 18)} color="var(--warning)" />} />
          <Metric label="MTTA" value="1m 42s" delta="-18%" tone="success" spark={<MiniArea data={generateSeries(24, 2, 30, 12)} color="var(--success)" />} />
          <Metric label="MTTR" value="11m 04s" delta="-6%" tone="primary" spark={<MiniArea data={generateSeries(24, 3, 60, 10)} />} />
          <Metric label="Noise filtered" value="84.2%" tone="ai" spark={<MiniArea data={generateSeries(24, 4, 80, 6)} color="var(--ai)" />} />
          <Metric label="Pages /24h" value="2,481" tone="info" spark={<MiniArea data={generateSeries(24, 5, 80, 14)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE PAGE STREAM" title="Routed across 38 services">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="ON-CALL ROTATION" title="Next 24h">
            <ul className="space-y-3 text-[12.5px]">
              {[
                ["Platform · primary", "K. Singh", "06:00 → 18:00", "success"],
                ["Platform · backup", "L. Romero", "06:00 → 18:00", "info"],
                ["Payments · primary", "M. Okafor", "00:00 → 12:00", "warning"],
                ["AI core · primary", "Z. Khan", "12:00 → 00:00", "ai"],
                ["Security · primary", "A. Park", "24h", "danger"],
              ].map(([r, who, w, t]) => (
                <li key={r} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="truncate">{r}</div>
                    <div className="font-mono text-[10px] text-muted-foreground">{w}</div>
                  </div>
                  <span className={`live-dot ${t === "warning" ? "warn" : t === "danger" ? "danger" : ""}`} />
                  <span className="w-24 text-right text-[12px]">{who}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="SEVERITY MIX" title="Last 7 days">
            <Bars data={generateSeries(20, 7, 60, 16)} h={200} />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {SEV.map(([s, t]) => (
                <div key={s} className="rounded-md border border-border bg-surface-2/40 p-2 text-center">
                  <div className={`text-[14px] font-semibold text-${t}`}>{s}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{Math.floor(Math.random() * 400 + 40)}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel kicker="ESCALATION PATH" title="Hit-rate by tier">
            <Radial value={72} color="var(--info)" label="ACK · T1" h={200} />
          </Panel>
          <Panel kicker="OPEN INCIDENTS" title="Highest priority">
            <ul className="space-y-2 text-[12px]">
              {[
                ["INC-7741", "DB-7 replica lag · 184s", "P1", "danger"],
                ["INC-7740", "Edge worker memory creep · eu-3", "P2", "warning"],
                ["INC-7738", "Stripe 5xx spike · 0.4%", "P2", "warning"],
                ["INC-7737", "AI quota near cap · gpt-4o", "P3", "info"],
                ["INC-7735", "Auth token rotation drift", "P3", "info"],
              ].map(([id, t, s, tone]) => (
                <li key={id} className="flex items-center gap-2 rounded-md border border-border bg-surface-2/40 px-2 py-1.5">
                  <span className={`font-mono text-[10px] text-${tone}`}>{s}</span>
                  <span className="font-mono text-[10.5px] text-muted-foreground">{id}</span>
                  <span className="ml-auto truncate">{t}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
