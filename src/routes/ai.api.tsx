import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Plug, Zap } from "lucide-react";

export const Route = createFileRoute("/ai/api")({
  head: () => ({ meta: [{ title: "AI API Manager · AEGIS OS" }] }),
  component: AiApiPage,
});

const PROVIDERS = [
  ["OpenAI · GPT-5", 42, "success", "98ms", "$0.012"],
  ["Anthropic · Claude 4.5", 28, "ai", "112ms", "$0.014"],
  ["Google · Gemini 2.5", 14, "info", "94ms", "$0.009"],
  ["Mistral · Large 2", 8, "primary", "76ms", "$0.004"],
  ["xAI · Grok 4", 5, "warning", "128ms", "$0.011"],
  ["Local · Llama 4", 3, "market", "42ms", "$0.000"],
] as const;

function AiApiPage() {
  const live = useLiveSeries(48, 371, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 037 · OPENROUTER" title="AI API Manager"
          subtitle="Provider routing · failover · cost-aware dispatch · usage caps." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Tokens · 24h" value="148.2M" delta="+18%" tone="ai" spark={<MiniArea data={generateSeries(24,91,60,14)} color="var(--ai)" />} />
          <Metric label="Cost · 24h" value="$1,842" delta="-12% via routing" tone="success" spark={<MiniArea data={generateSeries(24,92,40,12)} color="var(--success)" />} />
          <Metric label="Latency p95" value="124ms" delta="-22ms" tone="info" spark={<MiniArea data={generateSeries(24,93,40,8)} color="var(--info)" />} />
          <Metric label="Failover" value="38" delta="auto-recovered" tone="warning" spark={<MiniArea data={generateSeries(24,94,30,14)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="REQUEST FLOW" title="Prompts · completions · tokens"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="ROUTING SAVINGS" title="Smart dispatch">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={42} color="var(--success)" label="SAVED" />
              <Radial value={98} color="var(--ai)" label="UPTIME" />
            </div>
          </Panel>
        </div>

        <Panel kicker="PROVIDERS" title="Active models">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Provider · model</th><th>Share</th><th>Latency</th><th>$/1K tok</th><th className="text-right">Status</th></tr></thead>
            <tbody>{PROVIDERS.map(([n,p,t,l,c]) => (
              <tr key={n as string} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Plug className={`h-3.5 w-3.5 text-${t}`} />{n}</td>
                <td className="py-2"><div className="flex items-center gap-2"><div className="h-1.5 w-20 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div><span className="font-mono text-[11px] text-muted-foreground">{p}%</span></div></td>
                <td className="py-2 font-mono">{l}</td>
                <td className="py-2 font-mono text-market">{c}</td>
                <td className="py-2 text-right"><span className="font-mono text-[10px] text-success">●HEALTHY</span></td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="TOP CONSUMERS" title="Apps · keys">
            <ul className="space-y-2 text-[12px]">
              {[["vala-copilot","48.2M tok","$612"],["support-ai","32.1M tok","$418"],["doc-summarizer","18.4M tok","$184"],["lead-scorer","12.8M tok","$96"],["voice-agent","9.2M tok","$72"]].map(([k,t,c]) => (
                <li key={k} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <Zap className="h-3.5 w-3.5 text-ai" /><span className="font-mono">{k}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{t}</span>
                  <span className="font-mono text-market">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="USAGE BY HOUR" title="Token throughput · 24h"><Bars data={generateSeries(24,99,60,18)} color="var(--ai)" h={220} /></Panel>
        </div>
      </div>
    </div>
  );
}
