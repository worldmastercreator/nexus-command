import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Bot, Star, Download } from "lucide-react";

export const Route = createFileRoute("/ai/bots")({
  head: () => ({ meta: [{ title: "AI Bot Marketplace · AEGIS OS" }] }),
  component: AiBotsPage,
});

const BOTS = [
  ["SalesCloser GPT","Sales","48.2K","4.9","$24"],
  ["DocSummariser Pro","Productivity","42.1K","4.8","Free"],
  ["LegalDraft AI","Legal","28.4K","4.7","$48"],
  ["CodeReviewer X","Engineering","22.8K","4.9","$18"],
  ["MarketResearch Bot","Research","18.4K","4.6","$36"],
  ["TranslateMate","Comms","14.2K","4.8","Free"],
] as const;

function AiBotsPage() {
  const live = useLiveSeries(48, 391, 60, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 039 · GPT STORE" title="AI Bot Marketplace"
          subtitle="Discover · install · publish · monetize — curated agent store." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Listed bots" value="4,820" delta="+148 mo" tone="ai" spark={<MiniArea data={generateSeries(24,111,60,8)} color="var(--ai)" />} />
          <Metric label="Installs · 24h" value="18,420" delta="+22%" tone="primary" spark={<MiniArea data={generateSeries(24,112,60,14)} />} />
          <Metric label="Revenue · 24h" value="$24.8K" delta="+18%" tone="market" spark={<MiniArea data={generateSeries(24,113,60,12)} color="var(--market)" />} />
          <Metric label="Avg rating" value="4.74" delta="+0.04" tone="success" spark={<MiniArea data={generateSeries(24,114,80,3)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="DISCOVERY FLOW" title="Views · installs · purchases"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="TRENDING" title="Hot this week">
            <ul className="space-y-2 text-[12px]">
              {[["CRM Closer Pro","+184% installs"],["Voice Notetaker","+148%"],["AB-Test Buddy","+92%"],["Resume Roaster","+68%"],["Tax Filer GPT","+42%"]].map(([n,d]) => (
                <li key={n} className="flex items-center gap-2 rounded-md border border-border/60 bg-background/40 p-2">
                  <Bot className="h-3.5 w-3.5 text-ai" />
                  <span className="font-medium">{n}</span>
                  <span className="ml-auto font-mono text-success">{d}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP LISTINGS" title="Featured · 7d">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Bot</th><th>Category</th><th className="text-right">Installs</th><th className="text-right">Rating</th><th className="text-right">Price</th></tr></thead>
            <tbody>{BOTS.map(([n,c,i,r,p]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Bot className="h-3.5 w-3.5 text-ai" />{n}</td>
                <td className="py-2 text-muted-foreground">{c}</td>
                <td className="py-2 text-right font-mono"><Download className="mr-1 inline h-3 w-3 text-info" />{i}</td>
                <td className="py-2 text-right font-mono text-success"><Star className="mr-1 inline h-3 w-3 fill-success text-success" />{r}</td>
                <td className="py-2 text-right font-mono text-market">{p}</td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="CATEGORIES" title="Listing distribution"><Bars data={generateSeries(12,119,60,22)} color="var(--ai)" h={220} /></Panel>
          <Panel kicker="MODERATION QUEUE" title="Pending review">
            <ul className="space-y-2 text-[12px]">
              {[["FinAdvisor X","AI · review","pending"],["VoiceClone Pro","policy · audio","flagged"],["EduTutor","ready","approved"],["MedSummariser","compliance · HIPAA","review"]].map(([n,r,s]) => (
                <li key={n} className="flex items-center gap-2 rounded-md border border-border/60 bg-background/40 p-2">
                  <span className="font-medium">{n}</span>
                  <span className="text-muted-foreground">· {r}</span>
                  <span className={`ml-auto rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="approved"?"border-success/40 text-success":s==="flagged"?"border-danger/40 text-danger":"border-warning/40 text-warning"}`}>{s.toUpperCase()}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
