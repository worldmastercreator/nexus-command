import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { LifeBuoy, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support · AEGIS OS" }] }),
  component: SupportPage,
});

const QUEUES = [
  ["Billing", 84, "warning"],
  ["Technical", 142, "danger"],
  ["Account", 38, "info"],
  ["General", 62, "primary"],
] as const;

function SupportPage() {
  const live = useLiveSeries(50, 281, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 028 · ZENDESK" title="Customer Support"
          subtitle="Omnichannel queues · SLAs · CSAT — agent command deck." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Open" value="326" delta="+18 · 1h" tone="warning" spark={<MiniArea data={generateSeries(24,11,60,14)} color="var(--warning)" />} />
          <Metric label="Solved · 24h" value="1,840" delta="+12%" tone="success" spark={<MiniArea data={generateSeries(24,12,60,12)} color="var(--success)" />} />
          <Metric label="FRT · median" value="2m 14s" delta="SLA · 5m" tone="info" spark={<MiniArea data={generateSeries(24,13,40,10)} color="var(--info)" />} />
          <Metric label="CSAT" value="94.2%" delta="+0.6pp" tone="ai" spark={<MiniArea data={generateSeries(24,14,80,6)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="VOLUME" title="Inbound · resolved · escalated">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="SLA" title="On-time resolution">
            <div className="flex items-center justify-around">
              <Radial value={96} color="var(--success)" label="FRT" />
              <Radial value={88} color="var(--ai)" label="RESOLVE" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="QUEUES" title="Open by category">
            <ul className="space-y-3 text-[12.5px]">{QUEUES.map(([n,c,t]) => (
              <li key={n} className="space-y-1">
                <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{c}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,c/2)}%`}} /></div>
              </li>))}
            </ul>
          </Panel>
          <Panel kicker="AGENTS" title="On shift · 24">
            <ul className="space-y-2 text-[12px]">
              {[["Mira K.","ON",18,"94%"],["Dev R.","ON",22,"96%"],["Sara N.","ON",14,"92%"],["Theo L.","BREAK",0,"-"],["Yuna P.","ON",16,"98%"]].map(([n,s,c,csat]) => (
                <li key={n as string} className="flex items-center gap-3">
                  <span className={`live-dot ${s==="BREAK"?"warn":""}`} />
                  <span className="w-24">{n}</span>
                  <span className="font-mono text-muted-foreground">{c} solved</span>
                  <span className="ml-auto font-mono text-success">{csat}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="CHANNELS" title="Mix · 24h"><Bars data={generateSeries(8,19,60,22)} color="var(--info)" h={220} /></Panel>
        </div>

        <Panel kicker="LIVE FEED" title="Recent tickets">
          <ul className="space-y-1.5 text-[12px]">
            {Array.from({length:8}).map((_,i)=>{
              const tone = ["danger","warning","info","success","primary"][i%5];
              const Ic = [AlertCircle,Clock,LifeBuoy,CheckCircle2,LifeBuoy][i%5];
              return (
                <li key={i} className="flex items-center gap-3 rounded-md border border-border/60 bg-background/40 px-3 py-2">
                  <Ic className={`h-3.5 w-3.5 text-${tone}`} />
                  <span className="font-mono text-[10.5px] text-muted-foreground">#{48210-i}</span>
                  <span className="truncate">{["Refund delayed","Login 2FA loop","Webhook 500s","Invoice PDF missing","API rate limit"][i%5]}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{i*3+1}m</span>
                </li>);
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
