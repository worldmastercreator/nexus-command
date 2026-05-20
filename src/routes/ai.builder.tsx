import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Wand2, Boxes, Sparkles, Cpu } from "lucide-react";

export const Route = createFileRoute("/ai/builder")({
  head: () => ({ meta: [{ title: "AI Builder · AEGIS OS" }] }),
  component: AiBuilderPage,
});

function AiBuilderPage() {
  const live = useLiveSeries(48, 381, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 038 · RETOOL AI + LOVABLE" title="AI Builder Platform"
          subtitle="Prompt-to-app · component graph · deploy in seconds." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Apps built · 7d" value="2,840" delta="+24%" tone="ai" spark={<MiniArea data={generateSeries(24,101,60,16)} color="var(--ai)" />} />
          <Metric label="Avg build · time" value="6m 42s" delta="-1m 12s" tone="success" spark={<MiniArea data={generateSeries(24,102,40,10)} color="var(--success)" />} />
          <Metric label="Components" value="48.2K" delta="reused" tone="primary" spark={<MiniArea data={generateSeries(24,103,60,12)} />} />
          <Metric label="Live deploys" value="184" delta="now" tone="info" spark={<MiniArea data={generateSeries(24,104,40,8)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GENERATION FLOW" title="Prompts · iterations · publishes"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="PIPELINE" title="Live build queue">
            <ul className="space-y-2 text-[12px]">
              {[["Internal CRM","gen ui","ai"],["Tax dashboard","gen logic","primary"],["Onboarding form","schema","info"],["KPI report","preview","success"],["Webhook tester","deploy","warning"]].map(([n,s,t]) => (
                <li key={n} className="rounded-md border border-border/60 bg-background/40 p-2.5">
                  <div className="flex items-center gap-2"><Sparkles className={`h-3.5 w-3.5 text-${t}`} /><span className="font-medium">{n}</span><span className="ml-auto font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s}</span></div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${30+(n.length*5)%70}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="POPULAR BLOCKS" title="Most used components">
            <ul className="space-y-1.5 text-[12px]">
              {[["DataTable",4820],["AIChat",3140],["FormBuilder",2840],["KPI Card",2480],["Chart · Line",1820],["Auth Gate",1240]].map(([n,c]) => (
                <li key={n as string} className="flex items-center gap-2">
                  <Boxes className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono">{n}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="MODEL USAGE" title="Builder backends">
            <ul className="space-y-3 text-[12.5px]">
              {[["GPT-5",58,"ai"],["Claude 4.5",24,"primary"],["Gemini 2.5",12,"info"],["Local",6,"market"]].map(([n,p,t]) => (
                <li key={n as string} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{p}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="OUTPUT VOLUME" title="LOC generated · 24h"><Bars data={generateSeries(12,109,60,18)} color="var(--ai)" h={200} /></Panel>
        </div>
      </div>
    </div>
  );
}
