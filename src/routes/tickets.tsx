import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Bot, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/tickets")({
  head: () => ({ meta: [{ title: "Tickets + AI Chat · AEGIS OS" }] }),
  component: TicketsPage,
});

function TicketsPage() {
  const live = useLiveSeries(48, 291, 60, 20);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 029 · FRESHDESK + INTERCOM AI" title="Ticket + Live Chat AI"
          subtitle="AI-first triage · deflection · co-pilot reply — autonomous helpdesk." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="AI deflection" value="62.4%" delta="+4.1pp" tone="ai" spark={<MiniArea data={generateSeries(24,21,60,10)} color="var(--ai)" />} />
          <Metric label="Live chats" value="184" delta="42 queued" tone="primary" spark={<MiniArea data={generateSeries(24,22,40,14)} />} />
          <Metric label="Auto-replies" value="2,840" delta="24h" tone="info" spark={<MiniArea data={generateSeries(24,23,60,12)} color="var(--info)" />} />
          <Metric label="Escalations" value="48" delta="-12%" tone="warning" spark={<MiniArea data={generateSeries(24,24,30,16)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CONVERSATION FLOW" title="AI handled · agent handled · escalated">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="AI QUALITY" title="Co-pilot accuracy">
            <div className="flex items-center justify-around">
              <Radial value={94} color="var(--ai)" label="ACCURACY" />
              <Radial value={88} color="var(--success)" label="HELPFUL" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="LIVE INBOX" title="Active conversations">
            <ul className="scrollbar-thin max-h-[280px] space-y-2 overflow-y-auto pr-1">
              {Array.from({length:10}).map((_,i)=>(
                <li key={i} className="rounded-md border border-border/60 bg-background/40 p-2.5">
                  <div className="flex items-center gap-2 text-[11.5px]">
                    {i%3===0 ? <Bot className="h-3.5 w-3.5 text-ai" /> : <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                    <span className="font-medium">{["Aurora L.","Dev R.","Pulse Co","Helix","Nova S.","Axiom","Quantum","Tessa M.","Ren K.","Ivo P."][i]}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{i*2+1}m ago</span>
                  </div>
                  <p className="mt-1 truncate text-[11.5px] text-muted-foreground">{["How do I rotate the API key?","Invoice missing items","Webhook signature mismatch","Cancel subscription mid-cycle","Why was I charged twice?","Upgrade plan question","Refund policy clarification","SSO with Okta?","Add team seat","Export data CSV"][i]}</p>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="AI COPILOT" title="Suggested reply preview">
            <div className="space-y-3 text-[12.5px]">
              <div className="rounded-md border border-border/60 bg-surface/60 p-3"><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">CUSTOMER</span><p className="mt-1">My webhook returns 500 every time, signature seems wrong.</p></div>
              <div className="rounded-md border border-ai/30 bg-ai/5 p-3"><span className="font-mono text-[10px] uppercase tracking-wider text-ai flex items-center gap-1"><Sparkles className="h-3 w-3" />VALA AI · DRAFT</span><p className="mt-1">Hi — webhook 500s typically mean the HMAC secret rotated. Check the WEBHOOK_SECRET env matches your dashboard value, then resend the failed delivery from Logs → Webhook → Retry.</p>
                <div className="mt-2 flex gap-2 text-[10.5px]">
                  <button className="rounded border border-success/40 px-2 py-1 font-mono text-success">SEND</button>
                  <button className="rounded border border-border px-2 py-1 font-mono text-muted-foreground">REGENERATE</button>
                  <span className="ml-auto self-center font-mono text-muted-foreground">conf 94%</span>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <Panel kicker="INTENTS" title="Top resolved intents · 7d"><Bars data={generateSeries(14,29,60,22)} color="var(--ai)" h={200} /></Panel>
      </div>
    </div>
  );
}
