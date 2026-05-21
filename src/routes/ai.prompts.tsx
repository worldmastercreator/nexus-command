import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Terminal, GitBranch } from "lucide-react";

export const Route = createFileRoute("/ai/prompts")({
  head: () => ({ meta: [{ title: "Prompt Manager · AEGIS OS" }] }),
  component: Page,
});

const PROMPTS = [
  ["sales.cold_outreach","v18","gpt-5","success",18420],
  ["support.first_reply","v22","claude-4.5","success",96210],
  ["bi.sql_writer","v9","gpt-5-thinking","warning",2840],
  ["legal.contract_review","v6","claude-4.5","success",640],
  ["growth.subject_line","v14","mistral-l","success",4210],
  ["ops.incident_summarize","v11","gpt-5","success",1820],
] as const;

function Page() {
  const live = useLiveSeries(48, 421, 70, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 042 · OPENWEBUI · PROMPT OPS" title="Prompt Manager"
          subtitle="Versioned prompts · evals · A/B · drift — single source of LLM truth." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Prompts" value="412" delta="84 prod" tone="ai" spark={<MiniArea data={generateSeries(24,422,60,10)} color="var(--ai)" />} />
          <Metric label="Calls · 24h" value="2.4M" delta="+22%" tone="success" spark={<MiniArea data={generateSeries(24,423,90,18)} color="var(--success)" />} />
          <Metric label="Tokens" value="184M" delta="$1,240" tone="primary" spark={<MiniArea data={generateSeries(24,424,80,16)} />} />
          <Metric label="Eval pass" value="96%" delta="+2.1%" tone="success" spark={<MiniArea data={generateSeries(24,425,90,4)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="USAGE TELEMETRY" title="Calls · tokens · latency"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="QUALITY" title="Eval scores">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={96} color="var(--success)" label="PASS" />
              <Radial value={88} color="var(--ai)" label="RELEVANCE" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Toxicity</span><span className="font-mono text-success">0.02%</span></li>
              <li className="flex justify-between"><span>Hallucination</span><span className="font-mono text-warning">1.4%</span></li>
              <li className="flex justify-between"><span>Cache hit</span><span className="font-mono">68%</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="PROMPT REGISTRY" title="Production prompts">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Prompt</th><th>Ver</th><th>Model</th><th className="text-right">Calls · 24h</th><th className="text-right">Health</th></tr></thead>
            <tbody>{PROMPTS.map(([n,v,m,tone,c]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Terminal className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{v}</td>
                <td className="py-2 text-muted-foreground">{m}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><GitBranch className="h-3 w-3" />{tone==="warning"?"DRIFT":"OK"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="MODEL SPEND" title="Tokens by model · 24h"><Bars data={generateSeries(12,429,60,18)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
