import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Radio, Megaphone, Vote, Tv2 } from "lucide-react";

export const Route = createFileRoute("/campaign/control-room")({
  head: () => ({ meta: [{ title: "Control Room · AEGIS OS" }] }),
  component: ControlRoom,
});

function ControlRoom() {
  const live = useLiveSeries(60, 501, 70, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 301 · CAMPAIGN COMPASS"
          title="Campaign Control Room"
          subtitle="Live theatre across constituencies · booths · field teams · media pulse."
          actions={<div className="hidden items-center gap-2 md:flex">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">D-14 · go-live</span>
          </div>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-6">
          <Metric label="Constituencies" value="84" delta="all live" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 80, 4)} />} />
          <Metric label="Booths" value="14,208" delta="+18 today" tone="info" spark={<MiniArea data={generateSeries(30, 2, 60, 8)} color="var(--info)" />} />
          <Metric label="Volunteers" value="48,210" delta="active" tone="success" spark={<MiniArea data={generateSeries(30, 3, 60, 8)} color="var(--success)" />} />
          <Metric label="Door knocks /h" value="2,842" delta="+12%" tone="ai" spark={<MiniArea data={generateSeries(30, 4, 60, 18)} color="var(--ai)" />} />
          <Metric label="Sentiment" value="+12.4" delta="last 24h" tone="market" spark={<MiniArea data={generateSeries(30, 5, 60, 14)} color="var(--market)" />} />
          <Metric label="Incidents" value="4" delta="2 critical" tone="warning" spark={<MiniArea data={generateSeries(30, 6, 30, 16)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="THEATRE" title="Field operations map">
            <FieldMap />
          </Panel>
          <Panel kicker="WAR ROOM" title="Live channels">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["Press · TV-1", "live", Tv2, "var(--danger)"],
                ["Social · X stream", "active", Megaphone, "var(--ai)"],
                ["Booth ops · CMD", "active", Vote, "var(--success)"],
                ["Volunteer radio", "57 nodes", Radio, "var(--info)"],
              ].map(([n, s, Icon, c]) => {
                const Comp = Icon as any;
                return (
                  <li key={n as string} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                    <Comp className="h-3.5 w-3.5" style={{ color: c as string }} />
                    <span>{n}</span>
                    <span className="ml-auto font-mono text-[10.5px]" style={{ color: c as string }}>{s}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Radial value={86} label="REACH" />
              <Radial value={71} color="var(--ai)" label="MOOD" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="SENTIMENT" title="Public mood · multi-channel">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="INCIDENTS" title="Open · field reports">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["EVM glitch · Booth 4128", "CRIT", "var(--danger)"],
                ["Rally crowd surge · MG Rd", "WARN", "var(--warning)"],
                ["Misinfo post · viral", "WARN", "var(--warning)"],
                ["Vehicle breakdown · Conv-12", "INFO", "var(--info)"],
              ].map(([l, s, c]) => (
                <li key={l as string} className="rounded-md border border-border/60 bg-background/40 p-2">
                  <div className="flex items-center justify-between">
                    <span>{l}</span>
                    <span className="font-mono text-[10.5px]" style={{ color: c as string }}>{s}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function FieldMap() {
  const nodes = [
    { x: 22, y: 30, p: 92 }, { x: 32, y: 44, p: 64 }, { x: 38, y: 22, p: 78 },
    { x: 48, y: 28, p: 88 }, { x: 56, y: 40, p: 70 }, { x: 64, y: 22, p: 82 },
    { x: 72, y: 34, p: 60 }, { x: 80, y: 50, p: 72 }, { x: 84, y: 28, p: 50 },
    { x: 24, y: 56, p: 40 }, { x: 60, y: 56, p: 55 }, { x: 44, y: 50, p: 35 },
    { x: 70, y: 14, p: 88 }, { x: 30, y: 18, p: 76 },
  ];
  return (
    <div className="relative h-[380px] overflow-hidden rounded-lg border border-border bg-[radial-gradient(70%_60%_at_50%_50%,_color-mix(in_oklab,var(--ai)_10%,transparent),_transparent)]">
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
        {/* state-like outline */}
        <path d="M8 18 L28 8 L52 12 L78 6 L92 22 L88 44 L74 54 L42 52 L18 48 L6 36 Z"
          fill="color-mix(in oklab, var(--primary) 4%, transparent)"
          stroke="color-mix(in oklab, var(--primary) 60%, transparent)" strokeWidth="0.18" />
        {Array.from({ length: 16 }).map((_, i) => {
          const x = (i / 16) * 100;
          return <line key={i} x1={x} y1="3" x2={x} y2="57" stroke="color-mix(in oklab, var(--primary) 10%, transparent)" strokeWidth="0.08" />;
        })}
        {/* connections */}
        {nodes.slice(0, 10).map((n, i) => {
          const t = nodes[(i + 3) % nodes.length];
          return <line key={i} x1={n.x} y1={n.y} x2={t.x} y2={t.y}
            stroke="color-mix(in oklab, var(--ai) 50%, transparent)" strokeWidth="0.12" strokeDasharray="0.6 0.4" />;
        })}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="1.6" fill="color-mix(in oklab, var(--primary) 18%, transparent)" />
            <circle cx={n.x} cy={n.y} r="0.7" fill={n.p > 75 ? "var(--success)" : n.p > 50 ? "var(--warning)" : "var(--danger)"}>
              <animate attributeName="r" values="0.7;1.4;0.7" dur={`${1.2 + (i % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="animate-radar h-[70%] w-[70%] rounded-full bg-[conic-gradient(from_0deg,_color-mix(in_oklab,var(--ai)_25%,transparent),_transparent_25%)] opacity-40" />
      </div>
      <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-2"><span className="live-dot" /> FIELD · 84 CONSTITUENCIES</div>
        <div className="mt-1">14,208 BOOTHS · 48K VOLUNTEERS</div>
      </div>
    </div>
  );
}
