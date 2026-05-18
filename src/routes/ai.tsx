import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Sparkles, BrainCircuit, Send } from "lucide-react";

export const Route = createFileRoute("/ai")({
  head: () => ({ meta: [{ title: "Vala AI · AEGIS OS" }] }),
  component: ValaAI,
});

function ValaAI() {
  const live = useLiveSeries(50, 181, 60, 28);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 036 · OPENAI ENTERPRISE"
          title="Vala AI — Neural Command"
          subtitle="Models · agents · prompts · runs — your enterprise intelligence plane."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Tokens · 24h" value="94.2M" delta="+18%" tone="ai" spark={<MiniArea data={generateSeries(30, 1, 60, 22)} color="var(--ai)" />} />
          <Metric label="Runs" value="142,810" delta="real-time" tone="primary" spark={<MiniArea data={generateSeries(30, 2, 60, 18)} />} />
          <Metric label="P95 latency" value="812ms" delta="-12%" tone="info" spark={<MiniArea data={generateSeries(30, 3, 60, 12)} color="var(--info)" />} />
          <Metric label="Cost / 1k" value="$0.0184" delta="-$0.002" tone="success" spark={<MiniArea data={generateSeries(30, 4, 60, 8)} color="var(--success)" />} />
          <Metric label="Hallucinations" value="0.24%" delta="-0.08pp" tone="warning" spark={<MiniArea data={generateSeries(30, 5, 30, 14)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="MODELS" title="Throughput · last 60m">
            <MultiLine data={live} h={280} />
          </Panel>
          <Panel kicker="BRAIN" title="Neural state">
            <BrainViz />
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="MODELS" title="Active fleet">
            <ul className="space-y-2 text-[12.5px]">
              {[
                ["aegis-prime-7b", 41, "var(--primary)"],
                ["aegis-vision-x", 22, "var(--ai)"],
                ["aegis-audio-l", 14, "var(--analytics)"],
                ["aegis-code-12b", 18, "var(--info)"],
                ["aegis-edge-3b", 5, "var(--warning)"],
              ].map(([n, p, c]) => (
                <li key={n as string}>
                  <div className="mb-1 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <span className="text-foreground">{n}</span><span>{p}% load</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                    <div className="h-full" style={{ width: `${p}%`, background: c as string, boxShadow: `0 0 12px ${c}` }} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel className="lg:col-span-2" kicker="CONSOLE" title="Vala · prompt console">
            <PromptConsole />
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
        <defs>
          <radialGradient id="brainG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ai)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--ai)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="74" fill="url(#brainG)" />
        {Array.from({ length: 7 }).map((_, k) => (
          <circle key={k} cx="100" cy="100" r={20 + k * 8} fill="none" stroke="color-mix(in oklab, var(--ai) 35%, transparent)" strokeWidth="0.6">
            <animate attributeName="r" values={`${20 + k * 8};${24 + k * 8};${20 + k * 8}`} dur={`${2 + k * 0.4}s`} repeatCount="indefinite" />
          </circle>
        ))}
        {Array.from({ length: 28 }).map((_, i) => {
          const a = (i / 28) * Math.PI * 2;
          const r = 60 + (i % 5) * 6;
          const x = 100 + Math.cos(a) * r;
          const y = 100 + Math.sin(a) * r;
          return <g key={i}>
            <line x1="100" y1="100" x2={x} y2={y} stroke="color-mix(in oklab, var(--ai) 30%, transparent)" strokeWidth="0.4" />
            <circle cx={x} cy={y} r="1.4" fill="var(--ai)">
              <animate attributeName="opacity" values="0.2;1;0.2" dur={`${1.2 + (i % 5) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>;
        })}
        <circle cx="100" cy="100" r="6" fill="var(--ai)" />
      </svg>
      <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <div className="flex items-center gap-2"><BrainCircuit className="h-3 w-3 text-ai" /> THINKING · 7 streams</div>
      </div>
    </div>
  );
}

function PromptConsole() {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-background/50 p-3 font-mono text-[12px]">
      <div className="text-muted-foreground">vala@aegis ~ $ analyze pipeline anomalies</div>
      <div className="text-success">→ scanning 142,810 traces · 7 models engaged</div>
      <div className="text-ai">→ detected 3 anomalies in payments-eu-2 (p=0.984)</div>
      <div className="text-foreground">  · refund spike correlated with deploy <span className="text-warning">v8.2.41</span> at 11:48 UTC</div>
      <div className="text-foreground">  · recommend: rollback or hotfix retry-with-backoff</div>
      <div className="text-success">→ drafted incident · 02m 18s · awaiting approval</div>
      <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface px-2 py-2">
        <Sparkles className="h-3.5 w-3.5 text-ai" />
        <input placeholder="Ask Vala…" className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground" />
        <button className="grid h-7 w-7 place-items-center rounded bg-ai/20 text-ai hover:bg-ai/30">
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
