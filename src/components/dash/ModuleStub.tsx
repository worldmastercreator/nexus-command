import { useRouterState } from "@tanstack/react-router";
import { ALL_ITEMS } from "@/lib/nav";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Sparkles } from "lucide-react";

/**
 * Unified, on-brand fallback dashboard for modules whose hand-crafted
 * screens are not yet built. Still cinematic, animated, enterprise.
 */
export function ModuleStub() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const item = ALL_ITEMS.find((i) => i.path === pathname) ?? ALL_ITEMS[0];
  const Icon = item.icon;
  const seed = item.id;
  const live = useLiveSeries(40, seed, 60, 14);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow={`MODULE · ${String(item.id).padStart(3, "0")} · ${item.clone.toUpperCase()}`}
          title={item.title}
          subtitle={`Inspired by ${item.clone}. Hand-crafted screen in the next iteration — the shell, theme, and primitives are already enterprise-locked.`}
          actions={
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-ai" /> Iterate to hand-craft
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Metric label="Live signal" value="1.42k/s" delta="+8.2%" tone="primary"
            spark={<MiniArea data={generateSeries(24, seed + 1, 60, 12)} />} />
          <Metric label="Coverage" value="98.7%" delta="SLA" tone="success"
            spark={<MiniArea data={generateSeries(24, seed + 2, 80, 6)} color="var(--success)" />} />
          <Metric label="Latency" value="38ms" delta="-2ms" tone="info"
            spark={<MiniArea data={generateSeries(24, seed + 3, 40, 10)} color="var(--info)" />} />
          <Metric label="Queue depth" value="0142" delta="stable" tone="warning"
            spark={<MiniArea data={generateSeries(24, seed + 4, 30, 18)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE TELEMETRY" title={`${item.title} · throughput`}>
            <MultiLine data={live} />
          </Panel>
          <Panel kicker="DISTRIBUTION" title="Workload mix">
            <Bars data={generateSeries(14, seed + 9, 40, 22)} color="var(--ai)" />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="ACTIVITY" title="Realtime feed" className="lg:col-span-2">
            <ul className="divide-y divide-border text-[12.5px]">
              {Array.from({ length: 8 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-2">
                  <span className={`live-dot ${i % 4 === 0 ? "warn" : ""}`} />
                  <span className="font-mono text-[10.5px] text-muted-foreground">
                    {new Date(Date.now() - i * 41000).toISOString().slice(11, 19)}
                  </span>
                  <span className="text-foreground/90">
                    {item.title} event <span className="font-mono text-muted-foreground">#{(99814 - i * 7).toString(16).toUpperCase()}</span>
                  </span>
                  <span className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {["api", "edge", "core", "agent"][i % 4]}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="MODULE" title="Specification">
            <div className="space-y-3 text-[12.5px]">
              <Row k="Module" v={`#${String(item.id).padStart(3, "0")}`} />
              <Row k="Reference" v={item.clone} />
              <Row k="Surface" v="UI · enterprise shell" />
              <Row k="Tier" v="ENTERPRISE-7" />
              <Row k="Region" v="GLOBAL · 12" />
              <Row k="Status" v={<span className="text-success">OPERATIONAL</span>} />
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-md border border-dashed border-border bg-background/40 p-3 text-[11.5px] text-muted-foreground">
              <Icon className="h-4 w-4 text-primary" />
              Hand-crafted screens are unlocked iteratively. Ask: "build module #{item.id}" to elevate.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
