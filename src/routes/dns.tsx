import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/dns")({
  head: () => ({ meta: [{ title: "Domains & DNS · AEGIS OS" }] }),
  component: DnsPage,
});

function DnsPage() {
  const live = useLiveSeries(60, 611, 100, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 063 · CLOUDFLARE"
          title="Domains & DNS"
          subtitle="Zones · records · resolver · DNSSEC · failover."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Zones" value="184" tone="primary" />
          <Metric label="Records" value="48,210" tone="info" />
          <Metric label="Queries /s" value="2.41M" tone="success" spark={<MiniArea data={generateSeries(24, 61, 100, 14)} color="var(--success)" />} />
          <Metric label="NXDOMAIN" value="0.42%" tone="warning" spark={<MiniArea data={generateSeries(24, 62, 30, 20)} color="var(--warning)" />} />
          <Metric label="DNSSEC" value="98.4%" tone="ai" />
        </div>

        <Panel kicker="QUERY VOLUME" title="Resolver edge · global">
          <MultiLine data={live} h={260} />
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ZONES" title="Top domains" padded={false}>
            <table className="w-full text-[12px]">
              <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-3 py-2 text-left">DOMAIN</th><th className="px-3 py-2 text-left">RECORDS</th><th className="px-3 py-2 text-left">QPS</th><th className="px-3 py-2 text-left">DNSSEC</th><th className="px-3 py-2 text-left">STATUS</th></tr>
              </thead>
              <tbody>
                {[
                  ["aegis.io", 184, "8.2k", "on", "active"],
                  ["aegis.ai", 92, "2.1k", "on", "active"],
                  ["valacore.com", 312, "12.4k", "on", "active"],
                  ["partners.aegis.io", 28, "184", "on", "active"],
                  ["dev.aegis.io", 412, "1.8k", "off", "active"],
                  ["legacy.zk-corp.net", 18, "12", "off", "warning"],
                ].map((r) => (
                  <tr key={r[0] as string} className="border-b border-border/50 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono">{r[0]}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">{r[1]}</td>
                    <td className="px-3 py-2 font-mono text-info">{r[2]}</td>
                    <td className="px-3 py-2"><span className={`font-mono text-[10px] ${r[3]==="on"?"text-success":"text-muted-foreground"}`}>{r[3] as string}</span></td>
                    <td className="px-3 py-2"><span className={`live-dot ${r[4]==="warning"?"warn":""}`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel kicker="RECORD MIX" title="By type">
            <Bars data={generateSeries(8, 71, 80, 20)} h={200} />
            <ul className="mt-3 grid grid-cols-2 gap-1 text-[11px] font-mono text-muted-foreground">
              <li>A · 12,481</li><li>AAAA · 9,210</li><li>CNAME · 18,420</li><li>MX · 1,184</li>
              <li>TXT · 4,210</li><li>NS · 1,820</li><li>SRV · 412</li><li>CAA · 184</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
