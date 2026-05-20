import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Mail, MousePointerClick } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Email System · AEGIS OS" }] }),
  component: EmailPage,
});

const CAMPAIGNS = [
  ["May product digest","SENT","42,180","48.2%","12.4%","success"],
  ["Trial expiry · day 12","RUNNING","18,420","52.1%","18.8%","ai"],
  ["Win-back · churned","SCHEDULED","8,940","-","-","info"],
  ["Onboarding · day 1","RUNNING","12,180","68.4%","24.2%","success"],
  ["Beta invite","DRAFT","-","-","-","warning"],
] as const;

function EmailPage() {
  const live = useLiveSeries(48, 331, 60, 18);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 033 · MAILCHIMP" title="Email System"
          subtitle="Campaigns · automations · deliverability · reputation — sending OS." />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Sent · 24h" value="184K" delta="+12%" tone="primary" spark={<MiniArea data={generateSeries(24,61,60,16)} />} />
          <Metric label="Open rate" value="42.8%" delta="+1.2pp" tone="success" spark={<MiniArea data={generateSeries(24,62,60,8)} color="var(--success)" />} />
          <Metric label="Click rate" value="12.4%" delta="+0.4pp" tone="ai" spark={<MiniArea data={generateSeries(24,63,40,10)} color="var(--ai)" />} />
          <Metric label="Bounce" value="0.8%" delta="-0.2pp" tone="warning" spark={<MiniArea data={generateSeries(24,64,20,10)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ENGAGEMENT" title="Sent · opened · clicked"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="DELIVERABILITY" title="Sender reputation">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={98} color="var(--success)" label="INBOX" />
              <Radial value={94} color="var(--ai)" label="REPUTATION" />
            </div>
            <ul className="mt-4 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>SPF / DKIM / DMARC</span><span className="font-mono text-success">PASS</span></li>
              <li className="flex justify-between"><span>Spam complaints</span><span className="font-mono text-success">0.02%</span></li>
              <li className="flex justify-between"><span>Blocklist</span><span className="font-mono text-success">CLEAN</span></li>
            </ul>
          </Panel>
        </div>

        <Panel kicker="CAMPAIGNS" title="Recent · scheduled">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Campaign</th><th>Status</th><th>Recipients</th><th>Open</th><th>Click</th></tr></thead>
            <tbody>{CAMPAIGNS.map(([n,s,r,o,c,t]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Mail className={`h-3.5 w-3.5 text-${t}`} />{n}</td>
                <td className="py-2"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] border-${t}/40 text-${t}`}>{s}</span></td>
                <td className="py-2 font-mono">{r}</td>
                <td className="py-2 font-mono text-success">{o}</td>
                <td className="py-2 font-mono text-ai">{c}</td>
              </tr>))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="HOT LINKS" title="Top clicked · 7d">
            <ul className="space-y-2 text-[12px]">
              {[["app.aegis.io/upgrade",4820],["docs/api-keys",3140],["pricing/enterprise",2480],["blog/changelog",1820]].map(([u,c]) => (
                <li key={u as string} className="flex items-center gap-2">
                  <MousePointerClick className="h-3.5 w-3.5 text-ai" />
                  <span className="font-mono text-[11.5px]">{u}</span>
                  <span className="ml-auto font-mono text-muted-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="HOURLY VOLUME" title="Send rate · 24h"><Bars data={generateSeries(24,69,60,18)} color="var(--info)" h={220} /></Panel>
        </div>
      </div>
    </div>
  );
}
