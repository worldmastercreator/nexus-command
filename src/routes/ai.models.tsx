import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Server, Cpu } from "lucide-react";

export const Route = createFileRoute("/ai/models")({
  head: () => ({ meta: [{ title: "Model Manager · AEGIS OS" }] }),
  component: Page,
});

const MODELS = [
  ["llama-3.3-70b","local · ollama","ONLINE","success",78,46],
  ["qwen-2.5-coder","local · ollama","ONLINE","success",62,38],
  ["mixtral-8x22b","local · ollama","WARM","warning",18,82],
  ["gpt-5","openai","REMOTE","ai",0,0],
  ["claude-4.5-sonnet","anthropic","REMOTE","ai",0,0],
  ["mistral-large","mistral","REMOTE","ai",0,0],
  ["phi-4","local · ollama","ONLINE","success",92,18],
] as const;

function Page() {
  const live = useLiveSeries(48, 431, 60, 20);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 043 · OLLAMA · MODEL FLEET" title="Model Manager"
          subtitle="Local + remote LLMs · GPU pools · routing · warm pools — all in one console." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Models loaded" value="48" delta="14 warm" tone="ai" spark={<MiniArea data={generateSeries(24,432,60,8)} color="var(--ai)" />} />
          <Metric label="GPUs online" value="32/32" delta="A100 · H100" tone="success" spark={<MiniArea data={generateSeries(24,433,80,4)} color="var(--success)" />} />
          <Metric label="VRAM used" value="612 GB" delta="78%" tone="primary" spark={<MiniArea data={generateSeries(24,434,80,14)} />} />
          <Metric label="Tok/s" value="184k" delta="aggregate" tone="success" spark={<MiniArea data={generateSeries(24,435,90,22)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GPU TELEMETRY" title="VRAM · tok/s · temp"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="POOL HEALTH" title="Fleet status">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={78} color="var(--ai)" label="VRAM" />
              <Radial value={62} color="var(--warning)" label="HEAT" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Warm pool</span><span className="font-mono">14 models</span></li>
              <li className="flex justify-between"><span>Avg load t</span><span className="font-mono text-muted-foreground">1.8s</span></li>
              <li className="flex justify-between"><span>Cold misses</span><span className="font-mono text-warning">4.2%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="MODEL FLEET" title="Loaded + routed">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Model</th><th>Provider</th><th className="text-right">GPU%</th><th className="text-right">VRAM%</th><th className="text-right">Status</th></tr></thead>
            <tbody>{MODELS.map(([n,p,s,tone,g,v]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Cpu className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground">{p}</td>
                <td className="py-2 text-right font-mono">{g}%</td>
                <td className="py-2 text-right font-mono">{v}%</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Server className="h-3 w-3" />{s}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="ROUTING" title="Requests routed by model · 24h"><Bars data={generateSeries(14,439,70,22)} color="var(--primary)" h={220} /></Panel>
      </div>
    </div>
  );
}
