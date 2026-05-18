import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { BrainCircuit, Sparkles } from "lucide-react";

export const Route = createFileRoute("/campaign/ai-prediction")({
  head: () => ({ meta: [{ title: "AI Prediction · AEGIS OS" }] }),
  component: AIPrediction,
});

const candidates = [
  { n: "Party A · Aurora", p: 38, c: "var(--primary)" },
  { n: "Party B · Helios", p: 32, c: "var(--ai)" },
  { n: "Party C · Vega", p: 18, c: "var(--analytics)" },
  { n: "Party D · Nyx", p: 8, c: "var(--warning)" },
  { n: "Independents", p: 4, c: "var(--muted-foreground)" },
];

function AIPrediction() {
  const live = useLiveSeries(60, 601, 50, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 302 · CAMPAIGN COMPASS"
          title="AI Election Prediction"
          subtitle="Bayesian ensemble · 14 models · 1.2M samples · updated every 90s."
          actions={
            <div className="flex items-center gap-2 rounded-md border border-ai/30 bg-ai/10 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-ai">
              <Sparkles className="h-3 w-3" /> confidence 92.4%
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Win probability" value="64.2%" delta="Party A" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 8)} />} />
          <Metric label="Vote share" value="38.4%" delta="+1.2pp wk" tone="ai" spark={<MiniArea data={generateSeries(30, 2, 60, 10)} color="var(--ai)" />} />
          <Metric label="Swing seats" value="14" delta="of 84" tone="warning" spark={<MiniArea data={generateSeries(30, 3, 60, 14)} color="var(--warning)" />} />
          <Metric label="Model agreement" value="92.4%" delta="ensemble" tone="success" spark={<MiniArea data={generateSeries(30, 4, 60, 6)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="FORECAST" title="Daily vote share projection">
            <MultiLine data={live} h={280} />
          </Panel>
          <Panel kicker="NEURAL" title="Model brain">
            <BrainViz />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="DISTRIBUTION" title="Projected vote share">
            <div className="space-y-3">
              {candidates.map((c) => (
                <div key={c.n}>
                  <div className="mb-1 flex items-center justify-between text-[12.5px]">
                    <span className="text-foreground">{c.n}</span>
                    <span className="font-mono text-muted-foreground">{c.p}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div className="h-full" style={{ width: `${c.p * 2.4}%`, background: c.c, boxShadow: `0 0 10px ${c.c}` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel kicker="CONFIDENCE" title="Per-region certainty">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={94} color="var(--success)" label="NORTH" />
              <Radial value={71} color="var(--warning)" label="WEST" />
              <Radial value={88} label="EAST" />
              <Radial value={62} color="var(--ai)" label="SOUTH" />
            </div>
          </Panel>

          <Panel kicker="SIGNALS" title="Top drivers">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["Local employment", +0.42],
                ["Rally turnout", +0.28],
                ["Sentiment · X", +0.18],
                ["Manifesto recall", +0.14],
                ["Opp. attack ads", -0.21],
                ["Field worker coverage", +0.31],
              ].map(([n, w]) => (
                <li key={n as string} className="flex items-center gap-3">
                  <span className="flex-1 truncate">{n}</span>
                  <span className={`font-mono text-[11px] ${(w as number) > 0 ? "text-success" : "text-danger"}`}>
                    {(w as number) > 0 ? "+" : ""}{(w as number).toFixed(2)}
                  </span>
                  <div className="h-1 w-20 overflow-hidden rounded-full bg-surface">
                    <div className="h-full"
                      style={{
                        width: `${Math.abs(w as number) * 200}%`,
                        background: (w as number) > 0 ? "var(--success)" : "var(--danger)",
                      }} />
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

function BrainViz() {
  return (
    <div className="relative grid h-[280px] place-items-center overflow-hidden rounded-lg border border-border bg-[radial-gradient(60%_60%_at_50%_50%,_color-mix(in_oklab,var(--ai)_18%,transparent),_transparent)]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        {Array.from({ length: 6 }).map((_, k) => (
          <circle key={k} cx="100" cy="100" r={24 + k * 9} fill="none"
            stroke="color-mix(in oklab, var(--ai) 30%, transparent)" strokeWidth="0.5">
            <animate attributeName="r" values={`${24 + k * 9};${28 + k * 9};${24 + k * 9}`} dur={`${2 + k * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r = 56 + (i % 4) * 8;
          const x = 100 + Math.cos(a) * r; const y = 100 + Math.sin(a) * r;
          return <g key={i}>
            <line x1="100" y1="100" x2={x} y2={y} stroke="color-mix(in oklab, var(--ai) 35%, transparent)" strokeWidth="0.3" />
            <circle cx={x} cy={y} r="1.4" fill="var(--ai)">
              <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1.2 + (i % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>;
        })}
        <circle cx="100" cy="100" r="6" fill="var(--ai)" />
      </svg>
      <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-2"><BrainCircuit className="h-3 w-3 text-ai" /> 14 MODELS · ENSEMBLE</div>
      </div>
    </div>
  );
}
