import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { AppWindow, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app-builder")({
  head: () => ({ meta: [{ title: "App Builder · AEGIS OS" }] }),
  component: Page,
});

const PROJECTS = [
  ["aurora-customer-portal","ts · react","DEPLOYED","success",184],
  ["vala-mobile","ts · expo","BUILDING","warning",96],
  ["pos-kiosk","ts · vite","DEPLOYED","success",42],
  ["mlm-recruit","ts · next","DEPLOYED","success",18],
  ["payroll-self-serve","ts · react","FAILED","danger",4],
  ["franchise-onboard","ts · next","DEPLOYED","success",240],
] as const;

function Page() {
  const live = useLiveSeries(48, 511, 50, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 051 · BUBBLE + LOVABLE · APP FACTORY" title="App Builder"
          subtitle="AI-first scaffolding · component library · live preview · 1-click deploy." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Projects" value="412" delta="+18 wk" tone="ai" spark={<MiniArea data={generateSeries(24,512,60,10)} color="var(--ai)" />} />
          <Metric label="Builds · 24h" value="1,248" delta="+22%" tone="success" spark={<MiniArea data={generateSeries(24,513,80,18)} color="var(--success)" />} />
          <Metric label="Avg build" value="1m 42s" delta="-12%" tone="primary" spark={<MiniArea data={generateSeries(24,514,40,8)} />} />
          <Metric label="AI edits" value="18,420" delta="agents on" tone="ai" spark={<MiniArea data={generateSeries(24,515,80,14)} color="var(--ai)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="BUILD TELEMETRY" title="Builds · success · AI ops"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="AI BUILDER" title="Agent KPIs">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={96} color="var(--success)" label="BUILD OK" />
              <Radial value={88} color="var(--ai)" label="AI HIT" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Tokens used</span><span className="font-mono">184M</span></li>
              <li className="flex justify-between"><span>Templates</span><span className="font-mono text-muted-foreground">62</span></li>
              <li className="flex justify-between"><span>Components</span><span className="font-mono">1,248</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="PROJECT REGISTRY" title="Active builds">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Project</th><th>Stack</th><th className="text-right">Builds · 24h</th><th className="text-right">Status</th></tr></thead>
            <tbody>{PROJECTS.map(([n,st,s,tone,c]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><AppWindow className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground font-mono">{st}</td>
                <td className="py-2 text-right font-mono">{c}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}><Sparkles className="h-3 w-3" />{s}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="STACK MIX" title="Frameworks used"><Bars data={generateSeries(12,519,60,14)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
