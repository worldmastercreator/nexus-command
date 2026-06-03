import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, StackedArea, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Activity, AlertTriangle, Cpu, Database, Globe2, Radar, Server, Shield, TrendingUp, Users } from "lucide-react";
import { RoleDashboardKit } from "@/components/role/RoleDashboardKit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boss Panel · AEGIS OS" },
      { name: "description", content: "Mission-control overview: realtime telemetry, threats, AI agents, and global commerce." },
    ],
  }),
  component: BossPanel,
});

function BossPanel() {
  const live1 = useLiveSeries(60, 7, 80, 12);
  const live2 = useLiveSeries(60, 13, 50, 24);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative space-y-6 p-6">
        <RoleDashboardKit
          role="boss"
          title="Boss Panel — Mission Control"
          quickActions={[
            { label: "Open War Room", to: "/war-room" },
            { label: "Reseller Manager", to: "/rm" },
            { label: "Global Search", to: "/search" },
            { label: "Audit Logs", to: "/audit" },
          ]}
        />
        <PageHeader
          eyebrow="MODULE · 001 · PALANTIR + DATADOG"
          title="Boss Panel — Mission Control"
          subtitle="Realtime command surface for all 101 enterprise modules across 12 regions, 47 data centers, and 1.4M active sessions."
          actions={
            <div className="hidden items-center gap-2 md:flex">
              <button className="rounded-md border border-border bg-surface-2/60 px-3 py-1.5 text-[12px] hover:bg-surface-2">Export</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_30%,transparent)] hover:opacity-90">Deploy ops</button>
            </div>
          }
        />

        {/* KPI row */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <Metric label="GMV / 24h" value="$8.42M" delta="+12.4%" tone="market"
            spark={<MiniArea data={generateSeries(40, 2, 70, 12)} color="var(--market)" />} />
          <Metric label="Active users" value="142,318" delta="+3.1k" tone="primary"
            spark={<MiniArea data={generateSeries(40, 3, 70, 14)} />} />
          <Metric label="AI tokens" value="94.2M" delta="real-time" tone="ai"
            spark={<MiniArea data={generateSeries(40, 4, 70, 20)} color="var(--ai)" />} />
          <Metric label="Uptime" value="99.998%" delta="30d" tone="success"
            spark={<MiniArea data={generateSeries(40, 5, 85, 4)} color="var(--success)" />} />
          <Metric label="Threats blocked" value="14,209" delta="+182/h" tone="danger"
            spark={<MiniArea data={generateSeries(40, 6, 30, 20)} color="var(--danger)" />} />
          <Metric label="P95 latency" value="38ms" delta="-2ms" tone="info"
            spark={<MiniArea data={generateSeries(40, 7, 40, 6)} color="var(--info)" />} />
        </div>

        {/* Globe + telemetry */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GLOBAL · LIVE" title="Worldwide signal grid"
            action={<span className="font-mono text-[10px] text-muted-foreground">12 regions · 47 nodes</span>}
          >
            <WorldGrid />
          </Panel>
          <Panel kicker="SYSTEM · HEALTH" title="Subsystem radar">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={92} label="API" />
              <Radial value={87} color="var(--ai)" label="AI" />
              <Radial value={99} color="var(--success)" label="DB" />
              <Radial value={64} color="var(--warning)" label="QUEUE" />
            </div>
          </Panel>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="THROUGHPUT" title="Requests per second · global">
            <MultiLine data={live1} h={260} />
          </Panel>
          <Panel kicker="REVENUE" title="GMV stack · 24h">
            <StackedArea data={live2} h={260} />
          </Panel>
        </div>

        {/* Bottom — feeds */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="INCIDENTS" title="Active alerts"
            action={<span className="rounded border border-warning/40 bg-warning/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">2 active</span>}>
            <ul className="space-y-2 text-[12.5px]">
              {[
                { l: "DB-7 replica lag 412ms", t: "warn", k: "infra" },
                { l: "AI agent loop · GPT-vision", t: "warn", k: "ai" },
                { l: "Payments retried · stripe-eu-2", t: "ok", k: "commerce" },
                { l: "CDN cache miss spike · ap-south", t: "ok", k: "edge" },
              ].map((a, i) => (
                <li key={i} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <AlertTriangle className={`h-3.5 w-3.5 ${a.t === "warn" ? "text-warning" : "text-success"}`} />
                  <span className="text-foreground/90">{a.l}</span>
                  <span className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">{a.k}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="AGENTS" title="AI fleet · autonomous">
            <div className="space-y-3 text-[12.5px]">
              {[
                ["Orion · ops", 71, "var(--primary)"],
                ["Helios · sales", 88, "var(--ai)"],
                ["Vega · support", 54, "var(--analytics)"],
                ["Nyx · security", 96, "var(--danger)"],
              ].map(([n, p, c]) => (
                <div key={n as string}>
                  <div className="mb-1 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <span className="text-foreground">{n}</span><span>{p}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full rounded-full" style={{ width: `${p}%`, background: c as string, boxShadow: `0 0 12px ${c}` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel kicker="EVENTS" title="Realtime command log">
            <ul className="scrollbar-thin max-h-[220px] space-y-1 overflow-y-auto font-mono text-[11px]">
              {Array.from({ length: 14 }).map((_, i) => {
                const tones = ["text-success", "text-info", "text-warning", "text-ai", "text-primary"];
                return (
                  <li key={i} className="flex items-center gap-2 border-b border-border/40 pb-1">
                    <span suppressHydrationWarning className="text-muted-foreground">{`${String((23 - i) % 24).padStart(2,"0")}:${String((59 - i * 3 + 60) % 60).padStart(2,"0")}:${String((42 - i * 7 + 60) % 60).padStart(2,"0")}`}</span>
                    <span className={tones[i % tones.length]}>{["OK", "INF", "WRN", "AI", "REQ"][i % 5]}</span>
                    <span className="truncate text-foreground/80">{["edge", "core", "agent", "queue", "db"][i % 5]} · {["ingest", "scan", "route", "compile", "sync"][i % 5]} · {(91234 - i * 9).toString(16)}</span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function WorldGrid() {
  // Stylized SVG world: latitude rings + glowing nodes + radar sweep.
  const nodes = [
    { x: 18, y: 38, p: 92 }, { x: 28, y: 52, p: 64 }, { x: 36, y: 30, p: 78 },
    { x: 48, y: 36, p: 88 }, { x: 56, y: 48, p: 70 }, { x: 64, y: 30, p: 82 },
    { x: 72, y: 42, p: 60 }, { x: 80, y: 58, p: 72 }, { x: 86, y: 34, p: 50 },
    { x: 22, y: 64, p: 40 }, { x: 60, y: 64, p: 55 }, { x: 42, y: 58, p: 35 },
  ];
  return (
    <div className="relative h-[320px] w-full overflow-hidden rounded-lg border border-border bg-[radial-gradient(120%_80%_at_50%_50%,_color-mix(in_oklab,var(--primary)_10%,transparent),_transparent)]">
      {/* Latitude/longitude grid */}
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="rg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="60" fill="url(#rg)" />
        {[10, 20, 30, 40, 50].map((y) => (
          <ellipse key={y} cx="50" cy="30" rx="48" ry={y - 5} stroke="color-mix(in oklab, var(--primary) 25%, transparent)" strokeWidth="0.1" fill="none" />
        ))}
        {Array.from({ length: 18 }).map((_, i) => {
          const x = (i / 18) * 100;
          return <line key={i} x1={x} y1="3" x2={x} y2="57" stroke="color-mix(in oklab, var(--primary) 14%, transparent)" strokeWidth="0.08" />;
        })}
        {/* Connection arcs */}
        {nodes.slice(0, 8).map((n, i) => {
          const t = nodes[(i + 3) % nodes.length];
          const mx = (n.x + t.x) / 2; const my = Math.min(n.y, t.y) - 8;
          return (
            <path
              key={i}
              d={`M${n.x} ${n.y} Q ${mx} ${my} ${t.x} ${t.y}`}
              stroke="color-mix(in oklab, var(--primary) 70%, transparent)"
              strokeWidth="0.18" fill="none" strokeDasharray="0.6 0.6"
            />
          );
        })}
        {/* Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="1.6" fill="color-mix(in oklab, var(--primary) 18%, transparent)" />
            <circle cx={n.x} cy={n.y} r="0.7" fill={n.p > 75 ? "var(--success)" : n.p > 50 ? "var(--warning)" : "var(--danger)"}>
              <animate attributeName="r" values="0.7;1.4;0.7" dur={`${1.2 + (i % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      {/* Radar sweep */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="animate-radar h-[80%] w-[80%] rounded-full bg-[conic-gradient(from_0deg,_color-mix(in_oklab,var(--primary)_25%,transparent),_transparent_30%)] opacity-40" />
      </div>
      {/* HUD overlay */}
      <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-2"><span className="live-dot" /> GLOBAL LIVE GRID</div>
        <div className="mt-1">12 REGIONS · 47 NODES · 142K SESS</div>
      </div>
      <div className="absolute bottom-3 right-3 grid grid-cols-2 gap-x-4 gap-y-0.5 font-mono text-[10px] text-muted-foreground">
        <div>LAT 38ms</div><div>JIT 4ms</div>
        <div>RX 1.2G/s</div><div>TX 0.8G/s</div>
      </div>
    </div>
  );
}
