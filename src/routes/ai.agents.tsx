import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Cpu, GitBranch, Play, Pause, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/ai/agents")({
  head: () => ({ meta: [{ title: "AI Agents · AEGIS OS" }] }),
  component: AiAgentsPage,
});

const AGENTS = [
  ["LeadHunter-7","Sales · prospecting","RUNNING",184,"success"],
  ["DocCrawler-3","Knowledge · indexing","RUNNING",2840,"success"],
  ["TaxAuditor-2","Finance · reconciliation","REVIEW",42,"warning"],
  ["IncidentTriage-1","Ops · alerting","RUNNING",96,"success"],
  ["ContentDraft-9","Marketing · drafts","PAUSED",0,"info"],
  ["Forecaster-X","Analytics · planning","RUNNING",18,"success"],
  ["FraudHunter-4","Risk · review","ESCALATED",6,"danger"],
] as const;

function AiAgentsPage() {
  const live = useLiveSeries(48, 401, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 040 · AUTOGPT · MULTI-AGENT MESH" title="AI Agent System"
          subtitle="Autonomous workers · tools · memory · loops — supervised goal pursuit." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active agents" value="184" delta="42 running" tone="ai" spark={<MiniArea data={generateSeries(24,121,40,6)} color="var(--ai)" />} />
          <Metric label="Tasks done · 24h" value="48,210" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(24,122,60,14)} color="var(--success)" />} />
          <Metric label="Tool calls" value="2.4M" delta="148 tools" tone="primary" spark={<MiniArea data={generateSeries(24,123,60,12)} />} />
          <Metric label="Human review" value="42" delta="awaiting" tone="warning" spark={<MiniArea data={generateSeries(24,124,30,12)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="AGENT TELEMETRY" title="Steps · tool calls · completions"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="GOAL SUCCESS" title="Autonomy KPIs">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={84} color="var(--success)" label="GOAL HIT" />
              <Radial value={92} color="var(--ai)" label="PLAN OK" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Avg steps · goal</span><span className="font-mono text-muted-foreground">14.2</span></li>
              <li className="flex justify-between"><span>Loop break rate</span><span className="font-mono text-danger">0.4%</span></li>
            </ul>
          </Panel>
        </div>

        <Panel kicker="AGENT FLEET" title="Live status">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Agent</th><th>Role</th><th className="text-right">Tasks · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{AGENTS.map(([n,r,s,c,t]) => {
              const Ic = s==="RUNNING"?Play:s==="PAUSED"?Pause:s==="REVIEW"?AlertTriangle:s==="ESCALATED"?AlertTriangle:CheckCircle2;
              return (
                <tr key={n} className="border-b border-border/60 last:border-0">
                  <td className="py-2 flex items-center gap-2"><Cpu className={`h-3.5 w-3.5 text-${t}`} /><span className="font-mono">{n}</span></td>
                  <td className="py-2 text-muted-foreground">{r}</td>
                  <td className="py-2 text-right font-mono">{c}</td>
                  <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${t}/40 text-${t}`}><Ic className="h-3 w-3" />{s}</span></td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="EXECUTION GRAPH" title="Reasoning trace · LeadHunter-7">
            <ol className="space-y-2 text-[12px]">
              {[["plan","Identify 50 prospects in Aurora ICP"],["tool · web.search","Searched CrunchBase 4 queries"],["tool · enrich","Hydrated 50 records"],["filter","Kept 42 with >50 employees"],["tool · email.compose","Drafted 42 emails"],["await","Pending human approval"]].map(([k,v],i) => (
                <li key={i} className="flex items-start gap-3 rounded-md border border-border/60 bg-background/40 p-2">
                  <GitBranch className="mt-0.5 h-3.5 w-3.5 text-ai" />
                  <div className="flex-1">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{k}</div>
                    <div className="text-[12px]">{v}</div>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{i*4+1}s</span>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel kicker="TOOL USAGE" title="Top tools called · 24h"><Bars data={generateSeries(14,129,60,22)} color="var(--ai)" h={260} /></Panel>
        </div>
      </div>
    </div>
  );
}
