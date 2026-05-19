import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Crosshair, Radar, Satellite, ShieldAlert, Activity } from "lucide-react";

export const Route = createFileRoute("/war-room")({
  head: () => ({
    meta: [
      { title: "Executive War Room · AEGIS OS" },
      { name: "description", content: "Global tactical theatre with live nodes, attack arcs, and cyber threat heat layers." },
    ],
  }),
  component: WarRoom,
});

/* ─── Geo helpers ─────────────────────────────────────────────────────────
   Project equirectangular lat/lng into a 360×180 viewBox.            */
const proj = (lng: number, lat: number) => [lng + 180, 90 - lat] as const;

type Node = { city: string; iso: string; lng: number; lat: number; tone: Tone; load: number };
type Tone = "primary" | "success" | "warning" | "danger" | "ai" | "info";

const NODES: Node[] = [
  { city: "SFO", iso: "US-W", lng: -122.4, lat: 37.7, tone: "primary", load: 78 },
  { city: "DFW", iso: "US-C", lng: -96.8, lat: 32.9, tone: "info", load: 64 },
  { city: "NYC", iso: "US-E", lng: -74.0, lat: 40.7, tone: "primary", load: 91 },
  { city: "MEX", iso: "LATAM", lng: -99.1, lat: 19.4, tone: "warning", load: 52 },
  { city: "SAO", iso: "BR", lng: -46.6, lat: -23.5, tone: "info", load: 47 },
  { city: "LON", iso: "EU-W", lng: -0.1, lat: 51.5, tone: "success", load: 86 },
  { city: "FRA", iso: "EU-C", lng: 8.7, lat: 50.1, tone: "primary", load: 88 },
  { city: "MAD", iso: "EU-S", lng: -3.7, lat: 40.4, tone: "info", load: 59 },
  { city: "WAW", iso: "EU-E", lng: 21.0, lat: 52.2, tone: "warning", load: 71 },
  { city: "IST", iso: "TR", lng: 28.9, lat: 41.0, tone: "danger", load: 96 },
  { city: "JNB", iso: "ZA", lng: 28.0, lat: -26.2, tone: "info", load: 38 },
  { city: "CAI", iso: "EG", lng: 31.2, lat: 30.0, tone: "warning", load: 63 },
  { city: "DXB", iso: "AE", lng: 55.3, lat: 25.2, tone: "ai", load: 74 },
  { city: "BLR", iso: "IN-S", lng: 77.6, lat: 12.9, tone: "primary", load: 82 },
  { city: "SIN", iso: "SG", lng: 103.8, lat: 1.3, tone: "success", load: 90 },
  { city: "HKG", iso: "HK", lng: 114.2, lat: 22.3, tone: "danger", load: 94 },
  { city: "TYO", iso: "JP", lng: 139.7, lat: 35.7, tone: "primary", load: 87 },
  { city: "SEL", iso: "KR", lng: 126.9, lat: 37.6, tone: "info", load: 68 },
  { city: "SYD", iso: "AU-E", lng: 151.2, lat: -33.9, tone: "success", load: 55 },
];

// Live "attack" routes — pairs of city codes, severity.
const ROUTES: { from: string; to: string; tone: Tone; delay: number }[] = [
  { from: "IST", to: "FRA", tone: "danger", delay: 0 },
  { from: "HKG", to: "SFO", tone: "warning", delay: 0.6 },
  { from: "TYO", to: "SYD", tone: "info", delay: 1.2 },
  { from: "DXB", to: "LON", tone: "ai", delay: 0.4 },
  { from: "MEX", to: "NYC", tone: "primary", delay: 1.6 },
  { from: "SAO", to: "MAD", tone: "info", delay: 0.9 },
  { from: "SIN", to: "BLR", tone: "success", delay: 1.8 },
  { from: "JNB", to: "WAW", tone: "warning", delay: 0.3 },
  { from: "BLR", to: "FRA", tone: "primary", delay: 2.2 },
  { from: "SEL", to: "SFO", tone: "danger", delay: 2.6 },
];

const toneVar = (t: Tone) =>
  ({ primary: "var(--primary)", success: "var(--success)", warning: "var(--warning)",
     danger: "var(--danger)", ai: "var(--ai)", info: "var(--info)" }[t]);

// Simplified, stylised continent silhouettes in equirectangular space.
// Not cartographically precise — designed for a tactical feel.
const CONTINENTS = [
  // North America
  "M50 30 L80 25 L120 30 L140 40 L150 60 L130 80 L110 90 L95 85 L80 70 L60 55 Z",
  // Central America
  "M115 88 L125 92 L130 100 L120 105 L112 100 Z",
  // South America
  "M120 105 L140 105 L150 120 L155 140 L145 160 L130 168 L120 160 L115 140 L118 120 Z",
  // Europe
  "M170 38 L210 32 L220 45 L215 60 L200 65 L185 65 L175 55 Z",
  // Africa
  "M180 70 L215 65 L225 80 L225 105 L215 125 L200 140 L188 135 L182 115 L178 95 Z",
  // Middle East
  "M222 60 L240 60 L245 75 L240 85 L228 85 L222 75 Z",
  // Asia mainland
  "M225 28 L300 25 L320 35 L325 55 L315 70 L295 80 L270 80 L250 70 L235 55 Z",
  // India
  "M255 75 L275 75 L275 95 L265 105 L258 95 Z",
  // SE Asia / Indonesia
  "M295 90 L325 88 L335 100 L325 108 L300 105 Z",
  // Australia
  "M315 120 L345 118 L350 135 L335 145 L318 142 Z",
  // Greenland
  "M150 18 L170 14 L172 28 L158 32 L148 26 Z",
];

const GRATICULES = [-60, -30, 0, 30, 60];

function WarRoom() {
  const live = useLiveSeries(60, 21, 70, 22);
  const byCity = useMemo(() => Object.fromEntries(NODES.map((n) => [n.city, n])), []);

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 002 · PALANTIR GOTHAM"
          title="Executive War Room"
          subtitle="Tactical situational awareness across every theatre — live geo nodes, intercepted routes, and cyber threat heat layers."
          actions={
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <Radar className="h-3 w-3 text-danger" /> DEFCON · 3
            </div>
          }
        />

        {/* Top metric strip */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Metric label="Assets tracked" value="38,420" delta="real-time" tone="primary" spark={<MiniArea data={generateSeries(30, 8, 60, 14)} />} />
          <Metric label="Theatres live" value="19 / 19" delta="green" tone="success" spark={<MiniArea data={generateSeries(30, 9, 80, 4)} color="var(--success)" />} />
          <Metric label="Threat score" value="71/100" delta="+4 / 5m" tone="danger" spark={<MiniArea data={generateSeries(30, 10, 50, 18)} color="var(--danger)" />} />
          <Metric label="Comms uptime" value="99.92%" delta="SLA-1" tone="info" spark={<MiniArea data={generateSeries(30, 11, 90, 3)} color="var(--info)" />} />
          <Metric label="Decisions / h" value="284" delta="AI-assisted" tone="ai" spark={<MiniArea data={generateSeries(30, 12, 60, 22)} color="var(--ai)" />} />
        </div>

        {/* Main canvas */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
          <Panel
            className="xl:col-span-3"
            kicker="THEATRE · GLOBAL"
            title="Operations canvas · live geo telemetry"
            padded={false}
            action={
              <div className="flex items-center gap-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="live-dot" /> live</span>
                <span className="flex items-center gap-1.5"><span className="live-dot warn" /> watch</span>
                <span className="flex items-center gap-1.5"><span className="live-dot danger" /> intercept</span>
              </div>
            }
          >
            <GlobeCanvas nodes={NODES} byCity={byCity} />
          </Panel>

          {/* Right column — threat feed + theatre health */}
          <div className="space-y-4">
            <Panel kicker="INTEL" title="Live threat feed">
              <ThreatFeed />
            </Panel>
            <Panel kicker="OPS" title="Active operations">
              <ul className="space-y-2 text-[12.5px]">
                {[
                  ["OP · NIGHTHAWK", "EU-WEST", 78, "var(--warning)"],
                  ["OP · IRON VEIL", "US-EAST", 92, "var(--success)"],
                  ["OP · DEEP SIGNAL", "AP-SOUTH", 41, "var(--danger)"],
                  ["OP · GLASSWAVE", "LATAM", 64, "var(--info)"],
                  ["OP · COLD HORIZON", "EU-EAST", 33, "var(--ai)"],
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
        </div>

        {/* Bottom row — telemetry + theatre table */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="INTEL" title="Cross-domain telemetry">
            <MultiLine data={live} h={220} />
          </Panel>
          <Panel kicker="STATUS" title="Theatre command">
            <ul className="divide-y divide-border text-[12.5px]">
              {NODES.slice(0, 8).map((n) => (
                <li key={n.city} className="flex items-center gap-3 py-2">
                  <span className="live-dot" style={{ background: toneVar(n.tone), boxShadow: `0 0 0 0 ${toneVar(n.tone)}` }} />
                  <span className="font-mono text-[10.5px] text-muted-foreground">{n.city}</span>
                  <span className="text-foreground/90">{n.iso}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{n.load.toString().padStart(2,"0")}%</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────── Globe canvas ───────────────────────────── */

function GlobeCanvas({ nodes, byCity }: { nodes: Node[]; byCity: Record<string, Node> }) {
  return (
    <div className="relative h-[520px] w-full overflow-hidden bg-[radial-gradient(120%_80%_at_50%_50%,_color-mix(in_oklab,var(--primary)_8%,transparent),_transparent_70%)]">
      {/* Scan line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan" />
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_80%_at_50%_50%,_transparent_55%,_color-mix(in_oklab,var(--background)_85%,transparent)_100%)]" />

      <svg viewBox="0 0 360 180" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 z-10 h-full w-full">
        <defs>
          <radialGradient id="hot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--danger)" stopOpacity="0.55" />
            <stop offset="60%" stopColor="var(--warning)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--danger)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--info)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--info)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Graticules — latitudes */}
        {GRATICULES.map((lat) => {
          const y = 90 - lat;
          return <line key={`la${lat}`} x1="0" y1={y} x2="360" y2={y}
            stroke="color-mix(in oklab, var(--primary) 8%, transparent)" strokeWidth="0.18" strokeDasharray="0.6 1.2" />;
        })}
        {/* Graticules — longitudes */}
        {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
          const x = lng + 180;
          return <line key={`lo${lng}`} x1={x} y1="0" x2={x} y2="180"
            stroke="color-mix(in oklab, var(--primary) 8%, transparent)" strokeWidth="0.18" strokeDasharray="0.6 1.2" />;
        })}

        {/* Continents — outline + soft fill */}
        <g>
          {CONTINENTS.map((d, i) => (
            <path key={i} d={d}
              fill="color-mix(in oklab, var(--primary) 9%, transparent)"
              stroke="color-mix(in oklab, var(--primary) 38%, transparent)"
              strokeWidth="0.35"
              strokeLinejoin="round" />
          ))}
        </g>

        {/* Heat layers — pulsing zones */}
        {[
          { c: [...proj(28.9, 41.0)], r: 22, fill: "url(#hot)", dur: "3.4s" },   // IST
          { c: [...proj(114.2, 22.3)], r: 24, fill: "url(#hot)", dur: "3.0s" }, // HKG
          { c: [...proj(-74.0, 40.7)], r: 20, fill: "url(#cool)", dur: "3.8s" }, // NYC
          { c: [...proj(103.8, 1.3)], r: 18, fill: "url(#cool)", dur: "4.2s" },  // SIN
          { c: [...proj(8.7, 50.1)], r: 18, fill: "url(#cool)", dur: "3.6s" },   // FRA
        ].map((h, i) => (
          <g key={i}>
            <circle cx={h.c[0]} cy={h.c[1]} r={h.r} fill={h.fill}>
              <animate attributeName="opacity" values="0.35;0.9;0.35" dur={h.dur} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Attack arcs — quadratic Bezier with travelling stroke */}
        <g filter="url(#soft-glow)">
          {ROUTES.map((r, i) => {
            const a = byCity[r.from]; const b = byCity[r.to];
            if (!a || !b) return null;
            const [ax, ay] = proj(a.lng, a.lat);
            const [bx, by] = proj(b.lng, b.lat);
            const mx = (ax + bx) / 2;
            const my = (ay + by) / 2;
            const dist = Math.hypot(bx - ax, by - ay);
            const lift = Math.min(dist * 0.45, 28);
            const cx = mx;
            const cy = my - lift; // arc upward
            const d = `M${ax} ${ay} Q${cx} ${cy} ${bx} ${by}`;
            const col = toneVar(r.tone);
            return (
              <g key={i} style={{ color: col }}>
                {/* Faint base track */}
                <path d={d} fill="none" stroke={col} strokeOpacity="0.22" strokeWidth="0.25" />
                {/* Travelling pulse */}
                <path d={d} fill="none" stroke={col} strokeWidth="0.55"
                  strokeLinecap="round"
                  strokeDasharray="6 60"
                  strokeDashoffset="0"
                  style={{ filter: `drop-shadow(0 0 1.2px ${col})` }}>
                  <animate attributeName="stroke-dashoffset" from="66" to="0" dur="2.6s"
                    begin={`${r.delay}s`} repeatCount="indefinite" />
                </path>
                {/* Impact marker at destination */}
                <circle cx={bx} cy={by} r="0.5" fill={col}>
                  <animate attributeName="r" values="0.4;2.2;0.4" dur="2.6s" begin={`${r.delay}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur="2.6s" begin={`${r.delay}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            const [x, y] = proj(n.lng, n.lat);
            const col = toneVar(n.tone);
            return (
              <g key={n.city}>
                <circle cx={x} cy={y} r="2.4" fill="none" stroke={col} strokeOpacity="0.65" strokeWidth="0.18">
                  <animate attributeName="r" values="1.6;5.2;1.6" dur="2.6s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.8;0;0.8" dur="2.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={x} cy={y} r="1.1" fill={col} style={{ filter: `drop-shadow(0 0 1.4px ${col})` }} />
                <text x={x + 1.6} y={y - 1.4} fontSize="2.1" fill="var(--foreground)" fillOpacity="0.85" fontFamily="JetBrains Mono, monospace">
                  {n.city}
                </text>
                <text x={x + 1.6} y={y + 1.2} fontSize="1.6" fill="var(--muted-foreground)" fontFamily="JetBrains Mono, monospace">
                  {n.iso}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Radar sweep overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center">
        <div className="animate-radar h-[78%] w-[78%] rounded-full bg-[conic-gradient(from_0deg,_color-mix(in_oklab,var(--primary)_22%,transparent),_transparent_18%)] opacity-50 mix-blend-screen" />
      </div>

      {/* HUD corners + labels */}
      <div className="pointer-events-none absolute inset-3 z-20">
        <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
      </div>

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="live-dot danger" /> THREAT POSTURE · ELEVATED
      </div>
      <div className="pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <Satellite className="h-3 w-3 text-info" /> ORBIT · GEO-04
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 z-20 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span><Crosshair className="mr-1 inline h-3 w-3 text-primary" /> 19 nodes</span>
        <span><Activity className="mr-1 inline h-3 w-3 text-success" /> 10 corridors</span>
        <span><ShieldAlert className="mr-1 inline h-3 w-3 text-danger" /> 3 intercepts</span>
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 z-20 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        PROJ · EQUIRECTANGULAR · WGS-84
      </div>
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const cls =
    pos === "tl" ? "left-0 top-0 border-l border-t"
    : pos === "tr" ? "right-0 top-0 border-r border-t"
    : pos === "bl" ? "left-0 bottom-0 border-l border-b"
    : "right-0 bottom-0 border-r border-b";
  return <span className={`absolute h-4 w-4 ${cls} border-primary/60`} />;
}

/* ───────────────────────────── Live threat feed ───────────────────────── */

const FEED = [
  { sev: "CRIT", src: "IST → FRA", msg: "DDoS L7 — 9.4 Mrps mitigated", tone: "danger" as Tone },
  { sev: "HIGH", src: "HKG → SFO", msg: "Credential stuff · botnet 4ce9", tone: "warning" as Tone },
  { sev: "INFO", src: "BLR · core", msg: "Failover BLR-2 → BLR-3 (auto)", tone: "info" as Tone },
  { sev: "AI",   src: "agent · sentinel", msg: "Anomaly cluster in EU-EAST", tone: "ai" as Tone },
  { sev: "HIGH", src: "DXB → LON", msg: "TLS hand-shake spike +318%", tone: "warning" as Tone },
  { sev: "OK",   src: "SIN · edge", msg: "Patched CVE-2026-1133", tone: "success" as Tone },
  { sev: "CRIT", src: "SEL → SFO", msg: "Lateral movement detected", tone: "danger" as Tone },
  { sev: "INFO", src: "SAO · cdn", msg: "PoP cache warmed 92%", tone: "info" as Tone },
];

function ThreatFeed() {
  return (
    <ul className="divide-y divide-border text-[12px]">
      {FEED.map((f, i) => (
        <li key={i} className="flex items-start gap-3 py-2">
          <span
            className="mt-1 inline-block rounded px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-wider"
            style={{
              color: toneVar(f.tone),
              background: `color-mix(in oklab, ${toneVar(f.tone)} 14%, transparent)`,
              border: `1px solid color-mix(in oklab, ${toneVar(f.tone)} 30%, transparent)`,
            }}
          >
            {f.sev}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-foreground/90">{f.msg}</div>
            <div className="mt-0.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span suppressHydrationWarning>
                {`${String((23 - i) % 24).padStart(2,"0")}:${String((59 - i * 7 + 60) % 60).padStart(2,"0")}:${String((41 - i * 11 + 60) % 60).padStart(2,"0")}`}
              </span>
              <span>·</span>
              <span>{f.src}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
