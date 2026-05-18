import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/war-room")({
  head: () => ({ meta: [{ title: "War Room · AEGIS OS" }] }),
  component: WarRoom,
});

function WarRoom() {
  const live = useLiveSeries(48, 21, 70, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 002 · PALANTIR GOTHAM"
          title="Executive War Room"
          subtitle="Tactical situational awareness across global theatres of operation."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="THEATRE" title="Global operations canvas">
            <div className="relative h-[420px] overflow-hidden rounded-lg border border-border bg-[radial-gradient(70%_60%_at_50%_50%,_color-mix(in_oklab,var(--primary)_8%,transparent),_transparent)]">
              <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
                {Array.from({ length: 24 }).map((_, i) => {
                  const a = (i / 24) * Math.PI * 2;
                  const x = 50 + Math.cos(a) * 28; const y = 30 + Math.sin(a) * 22;
                  return <line key={i} x1="50" y1="30" x2={x} y2={y} stroke="color-mix(in oklab, var(--primary) 16%, transparent)" strokeWidth="0.08" />;
                })}
                {[8, 18, 28].map((r) => (
                  <circle key={r} cx="50" cy="30" r={r} stroke="color-mix(in oklab, var(--primary) 28%, transparent)" strokeWidth="0.12" fill="none" />
                ))}
                {[
                  [22, 18, "ALPHA"], [76, 22, "BRAVO"], [82, 44, "CHARLIE"],
                  [30, 46, "DELTA"], [54, 14, "ECHO"], [60, 50, "FOXTROT"],
                ].map(([x, y, n], i) => (
                  <g key={n as string}>
                    <circle cx={x as number} cy={y as number} r="1.5" fill="var(--danger)">
                      <animate attributeName="r" values="1.2;2.2;1.2" dur="1.4s" repeatCount="indefinite" />
                    </circle>
                    <text x={(x as number) + 2.5} y={(y as number) + 1} fontSize="2.4" fill="var(--muted-foreground)" fontFamily="monospace">{n}</text>
                  </g>
                ))}
                <circle cx="50" cy="30" r="1.4" fill="var(--primary)" />
              </svg>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="animate-radar h-[70%] w-[70%] rounded-full bg-[conic-gradient(from_0deg,_color-mix(in_oklab,var(--danger)_30%,transparent),_transparent_25%)] opacity-50" />
              </div>
              <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <div className="flex items-center gap-2"><span className="live-dot danger" /> THREAT POSTURE · ELEVATED</div>
              </div>
            </div>
          </Panel>

          <Panel kicker="OPS" title="Active operations">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["OP · NIGHTHAWK", "EU-WEST", 78, "var(--warning)"],
                ["OP · IRON VEIL", "US-EAST", 92, "var(--success)"],
                ["OP · DEEP SIGNAL", "AP-SOUTH", 41, "var(--danger)"],
                ["OP · GLASSWAVE", "LATAM", 64, "var(--info)"],
              ].map(([n, r, p, c]) => (
                <li key={n as string} className="rounded-md border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider">
                    <span className="text-foreground">{n}</span>
                    <span className="text-muted-foreground">{r}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                    <div className="h-full" style={{ width: `${p}%`, background: c as string, boxShadow: `0 0 10px ${c}` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          <Metric label="Assets tracked" value="38,420" delta="real-time" tone="primary" spark={<MiniArea data={generateSeries(30, 8, 60, 14)} />} />
          <Metric label="Threat score" value="71/100" delta="+4" tone="danger" spark={<MiniArea data={generateSeries(30, 9, 50, 18)} color="var(--danger)" />} />
          <Metric label="Comms uptime" value="99.92%" delta="" tone="success" spark={<MiniArea data={generateSeries(30, 10, 80, 4)} color="var(--success)" />} />
          <Metric label="Decisions /h" value="284" delta="ai-assisted" tone="ai" spark={<MiniArea data={generateSeries(30, 11, 60, 22)} color="var(--ai)" />} />
        </div>

        <Panel kicker="INTEL" title="Cross-domain telemetry">
          <MultiLine data={live} h={260} />
        </Panel>
      </div>
    </div>
  );
}
