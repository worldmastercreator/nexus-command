import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Phone, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/sms")({
  head: () => ({ meta: [{ title: "WhatsApp / SMS · AEGIS OS" }] }),
  component: SmsPage,
});

const ROUTES = [
  ["WhatsApp Business", 62, "success", "99.4%"],
  ["SMS · Twilio", 24, "info", "98.2%"],
  ["SMS · Vonage", 8, "primary", "97.6%"],
  ["RCS", 4, "ai", "96.1%"],
  ["Viber", 2, "warning", "94.8%"],
] as const;

function SmsPage() {
  const live = useLiveSeries(48, 341, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 034 · TWILIO + META WHATSAPP" title="WhatsApp / SMS System"
          subtitle="Multi-rail messaging · OTPs · campaigns · 2-way conversations." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Sent · 24h" value="248K" delta="+18%" tone="primary" spark={<MiniArea data={generateSeries(24,71,60,16)} />} />
          <Metric label="Delivery rate" value="98.6%" delta="+0.4pp" tone="success" spark={<MiniArea data={generateSeries(24,72,80,4)} color="var(--success)" />} />
          <Metric label="OTP · success" value="99.1%" delta="2-rail fallback" tone="ai" spark={<MiniArea data={generateSeries(24,73,80,3)} color="var(--ai)" />} />
          <Metric label="Replies · 24h" value="18,420" delta="+9%" tone="info" spark={<MiniArea data={generateSeries(24,74,60,14)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="MESSAGE FLOW" title="Sent · delivered · replied"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="ROUTES" title="Channel mix">
            <ul className="space-y-3 text-[12px]">{ROUTES.map(([n,p,t,d]) => (
              <li key={n as string} className="space-y-1">
                <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{p}% · {d}</span></div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
              </li>))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="OTP HEALTH" title="2-rail failover">
            <div className="flex justify-around"><Radial value={99} color="var(--success)" label="WHATSAPP" /><Radial value={97} color="var(--info)" label="SMS" /></div>
          </Panel>
          <Panel kicker="GEOGRAPHY" title="Top destinations">
            <ul className="space-y-2 text-[12px]">
              {[["India",38],["United States",18],["Brazil",12],["Germany",9],["Nigeria",8],["Other",15]].map(([n,p]) => (
                <li key={n as string} className="flex items-center gap-3">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="w-28">{n}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface"><div className="h-full bg-info" style={{width:`${p}%`}} /></div>
                  <span className="w-10 text-right font-mono text-[11px] text-muted-foreground">{p}%</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="LIVE INBOUND" title="2-way conversations">
            <ul className="space-y-1.5 text-[12px]">
              {Array.from({length:6}).map((_,i)=>(
                <li key={i} className="flex items-center gap-2 rounded-md border border-border/60 bg-background/40 p-2">
                  <MessageCircle className="h-3.5 w-3.5 text-success" />
                  <span className="font-mono text-[10.5px] text-muted-foreground">+{["1","91","55","49","234","81"][i]}***</span>
                  <span className="truncate">{["YES confirm order","STOP","HELP plan?","Reschedule pls","Code 8421","Got it thanks"][i]}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <Panel kicker="VOLUME · HOURLY" title="Throughput · 24h"><Bars data={generateSeries(24,79,60,18)} color="var(--success)" h={200} /></Panel>
      </div>
    </div>
  );
}
