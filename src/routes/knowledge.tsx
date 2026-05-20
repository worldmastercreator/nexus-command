import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { BookOpen, Search as SearchIcon, ThumbsUp, ThumbsDown } from "lucide-react";

export const Route = createFileRoute("/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base · AEGIS OS" }] }),
  component: KnowledgePage,
});

const ARTICLES = [
  ["Rotate API keys safely","12,840","94%","success"],
  ["Webhook signature mismatch","9,240","88%","success"],
  ["Subscription proration explained","6,820","82%","ai"],
  ["SSO with Okta · setup","4,140","91%","success"],
  ["Refund timeline · bank rails","3,420","62%","warning"],
  ["Importing CSV data","2,840","48%","danger"],
] as const;

function KnowledgePage() {
  const live = useLiveSeries(48, 351, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 035 · INTERCOM HELP CENTER" title="Knowledge Base"
          subtitle="Articles · search · AI answers · deflection — self-serve intelligence." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Articles" value="1,284" delta="+18 mo" tone="primary" spark={<MiniArea data={generateSeries(24,81,60,4)} />} />
          <Metric label="Searches · 24h" value="48.2K" delta="+12%" tone="info" spark={<MiniArea data={generateSeries(24,82,60,14)} color="var(--info)" />} />
          <Metric label="AI deflection" value="64.8%" delta="+3.2pp" tone="ai" spark={<MiniArea data={generateSeries(24,83,60,8)} color="var(--ai)" />} />
          <Metric label="Helpful · avg" value="86%" delta="+1.4pp" tone="success" spark={<MiniArea data={generateSeries(24,84,80,4)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="USAGE" title="Searches · views · AI answers"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="NO-RESULT QUERIES" title="Content gaps · 7d">
            <ul className="space-y-2 text-[12px]">
              {[["bulk export csv",148],["whatsapp template approval",96],["regional tax brackets",82],["airgap install",48],["sso saml jit",36]].map(([q,c]) => (
                <li key={q as string} className="flex items-center gap-2">
                  <SearchIcon className="h-3.5 w-3.5 text-warning" />
                  <span className="font-mono text-[11.5px]">{q}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP ARTICLES" title="Most viewed · 7d">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Article</th><th className="text-right">Views</th><th className="text-right">Helpful</th><th className="text-right">Feedback</th></tr></thead>
            <tbody>{ARTICLES.map(([n,v,h,t]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><BookOpen className={`h-3.5 w-3.5 text-${t}`} />{n}</td>
                <td className="py-2 text-right font-mono">{v}</td>
                <td className="py-2 text-right font-mono text-success">{h}</td>
                <td className="py-2 text-right"><span className="inline-flex items-center gap-1 font-mono text-[10.5px]"><ThumbsUp className="h-3 w-3 text-success" />842 <ThumbsDown className="h-3 w-3 text-danger ml-2" />48</span></td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="CATEGORY MIX" title="Articles per topic"><Bars data={generateSeries(12,89,60,22)} color="var(--ai)" h={220} /></Panel>
          <Panel kicker="LANGUAGES" title="Localized coverage">
            <ul className="space-y-2 text-[12px]">
              {[["English",100],["Spanish",84],["French",72],["German",68],["Portuguese",54],["Japanese",42],["Hindi",38]].map(([l,p]) => (
                <li key={l as string} className="flex items-center gap-3">
                  <span className="w-24">{l}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className="h-full bg-primary" style={{width:`${p}%`}} /></div>
                  <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{p}%</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
