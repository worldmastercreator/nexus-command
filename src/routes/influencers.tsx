import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Star, Instagram, Youtube, Twitch } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";
import { ModuleLiveTable, fmtNum } from "@/components/dash/ModuleLiveTable";

export const Route = createFileRoute("/influencers")({
  head: () => ({ meta: [{ title: "Influencer Manager · AEGIS OS" }] }),
  component: InfluencersPage,
});

function InfluencersPage() {
  const live = useLiveSeries(48, 201, 60, 20);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 020 · UPFLUENCE / GRIN CREATOR OS"
          title="Influencer Manager"
          subtitle="Discovery · contracts · campaigns · UGC · ROI — creator marketing ops."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Roster" value="2,184" delta="+24 active" tone="ai" spark={<MiniArea data={generateSeries(24,91,60,6)} color="var(--ai)" />} />
          <Metric label="Reach · 30d" value="48.2M" delta="+12%" tone="market" spark={<MiniArea data={generateSeries(24,92,60,14)} color="var(--market)" />} />
          <Metric label="Engagement" value="4.84%" delta="+0.3pp" tone="primary" spark={<MiniArea data={generateSeries(24,93,40,8)} />} />
          <Metric label="ROAS" value="4.2x" delta="+0.4x" tone="success" spark={<MiniArea data={generateSeries(24,94,60,10)} color="var(--success)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CAMPAIGNS LIVE" title="Reach · engagement · conversion"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="PLATFORM MIX" title="Channel distribution">
            <ul className="space-y-3 text-[12.5px]">
              {[[Instagram,"Instagram",48,"market"],[Youtube,"YouTube",28,"danger"],[Twitch,"TikTok",18,"ai"],[Star,"X / Threads",6,"primary"]].map(([I,n,p,t])=>{
                const Ico=I as any;
                return <li key={n as string} className="space-y-1">
                  <div className="flex items-center gap-2"><Ico className="h-3.5 w-3.5" /><span>{n as string}</span><span className="ml-auto font-mono text-muted-foreground">{p as number}%</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>;
              })}
            </ul>
          </Panel>
        </div>

        <Panel kicker="TOP CREATORS" title="Performance · 30d">
          <table className="w-full text-[12px]"><tbody>
            {[["@aurorabeats","Music · 1.2M","$48.2K","6.4%"],["@helix_dev","Tech · 820K","$32.1K","5.2%"],["@novacook","Food · 620K","$28.4K","4.8%"],["@pulsefit","Fitness · 480K","$22.1K","5.1%"],["@kite_world","Travel · 380K","$18.2K","4.4%"]].map(([n,m,r,e],i)=>(
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 font-mono text-[11px] text-muted-foreground">#{i+1}</td>
                <td className="py-2">{n}</td>
                <td className="py-2 text-muted-foreground">{m}</td>
                <td className="py-2 text-right font-mono text-success">{r}</td>
                <td className="py-2 text-right font-mono text-ai">{e}</td>
              </tr>
            ))}
          </tbody></table>
        </Panel>

        <Panel kicker="CATEGORIES" title="Niche distribution"><Bars data={generateSeries(12,98,60,22)} color="var(--market)" h={200} /></Panel>

        <ModuleLiveTable
          table="mod_influencers"
          kicker="LIVE · LOVABLE CLOUD"
          title="Creator roster"
          columns={[
            { key: "handle", label: "Handle", className: "font-mono text-[11px] text-market" },
            { key: "platform", label: "Platform", className: "text-muted-foreground" },
            { key: "followers", label: "Followers", align: "right", format: (v) => fmtNum(v) },
            { key: "engagement", label: "Engagement", align: "right", format: (v) => <span className="text-ai">{Number(v).toFixed(1)}%</span> },
            { key: "deals", label: "Deals", align: "right", format: (v) => fmtNum(v) },
          ]}
        />

        <ConnectedModules ids={[19, 16, 11, 24]} />
      </div>
    </div>
  );
}
