import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/data/dashboard")({
  head: () => ({ meta: [{ title: "Data Vault · AEGIS OS" }] }),
  component: DataDashboard,
});

function DataDashboard() {
  const live = useLiveSeries(48, 801, 70, 14);

  const datasets = [
    { id: "DS-7421", name: "Global B2B Contacts", rows: "184.2M", price: 4900, vel: "hot", health: 99.4 },
    { id: "DS-7088", name: "EU Real-Estate Listings", rows: "12.8M", price: 1290, vel: "steady", health: 98.2 },
    { id: "DS-6914", name: "LinkedIn Tech Roles", rows: "7.1M", price: 890, vel: "hot", health: 97.6 },
    { id: "DS-6612", name: "Crypto OHLCV Tick", rows: "3.2B", price: 2400, vel: "steady", health: 99.9 },
    { id: "DS-6311", name: "NPI Healthcare Providers", rows: "2.4M", price: 640, vel: "cold", health: 94.1 },
    { id: "DS-6020", name: "SEC EDGAR Filings 10K", rows: "812K", price: 380, vel: "steady", health: 99.0 },
  ];

  const extractors = [
    { name: "Amazon Reviews",  qps: 142, fresh: "12s", err: 0.02 },
    { name: "Yelp Business",   qps: 84,  fresh: "31s", err: 0.10 },
    { name: "Google Maps POI", qps: 211, fresh: "8s",  err: 0.01 },
    { name: "Indeed Jobs",     qps: 67,  fresh: "44s", err: 0.34 },
    { name: "Twitter Search",  qps: 38,  fresh: "5s",  err: 0.81 },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 800 · DATA VAULT"
          title="Data Vault — Marketplace & Extractor Grid"
          subtitle="Curated datasets · live scrapers · AI extraction · billing & resale."
          actions={
            <div className="flex gap-2">
              <button className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] hover:bg-accent">New extractor</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Publish dataset</button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Datasets" value="4,210" delta="+38 wk" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 8)} />} />
          <Metric label="Rows indexed" value="284.1B" delta="+2.4B" tone="ai" spark={<MiniArea data={generateSeries(30, 2, 80, 10)} color="var(--ai)" />} />
          <Metric label="GMV 30d" value="$1.18M" delta="+18.4%" tone="success" spark={<MiniArea data={generateSeries(30, 3, 70, 12)} color="var(--success)" />} />
          <Metric label="Live extractors" value="184" delta="6 stalled" tone="warning" spark={<MiniArea data={generateSeries(30, 4, 40, 14)} color="var(--warning)" />} />
          <Metric label="API calls 24h" value="92.4M" delta="+11.2%" tone="info" spark={<MiniArea data={generateSeries(30, 5, 50, 16)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="THROUGHPUT" title="Extraction throughput · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="VAULT" title="Health posture">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={97} color="var(--success)" label="FRESH" />
              <Radial value={88} color="var(--ai)" label="AI HIT" />
              <Radial value={74} color="var(--info)" label="COVERAGE" />
              <Radial value={62} color="var(--warning)" label="DEDUPE" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="CATALOG" title="Top datasets">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["ID","Dataset","Rows","Price","Velocity","Health"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {datasets.map((d) => (
                  <tr key={d.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono text-[11px]">{d.id}</td>
                    <td className="px-3 py-2 font-medium">{d.name}</td>
                    <td className="px-3 py-2 font-mono">{d.rows}</td>
                    <td className="px-3 py-2 font-mono">${d.price.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        d.vel === "hot" ? "border-danger/40 bg-danger/10 text-danger" :
                        d.vel === "steady" ? "border-success/40 bg-success/10 text-success" :
                        "border-border bg-surface-2 text-muted-foreground"
                      }`}>{d.vel}</span>
                    </td>
                    <td className="px-3 py-2 font-mono text-[11px]">{d.health}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="EXTRACTORS" title="Live scraper grid">
            <div className="space-y-1.5">
              {extractors.map((e) => (
                <div key={e.name} className="rounded border border-border/60 bg-surface-2/40 p-2 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className={`live-dot ${e.err > 0.5 ? "danger" : e.err > 0.2 ? "warn" : ""}`} />
                    <span className="font-medium">{e.name}</span>
                    <span className="ml-auto font-mono text-[11px]">{e.qps} qps</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>fresh {e.fresh}</span>
                    <span>err {(e.err * 100).toFixed(2)}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-surface">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, e.qps / 2.2)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="CATEGORIES" title="Marketplace mix">
            <Bars data={generateSeries(8, 31, 60, 18)} h={200} color="var(--ai)" />
          </Panel>
          <Panel kicker="REVENUE" title="GMV by tier">
            <Bars data={generateSeries(6, 42, 70, 16)} h={200} color="var(--success)" />
          </Panel>
          <Panel kicker="WALLET" title="Operator balances">
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center justify-between"><span>Hot wallet</span><span className="font-mono text-success">$184,210</span></li>
              <li className="flex items-center justify-between"><span>Escrow</span><span className="font-mono text-info">$92,440</span></li>
              <li className="flex items-center justify-between"><span>Pending payouts</span><span className="font-mono text-warning">$18,720</span></li>
              <li className="flex items-center justify-between"><span>Refund pool</span><span className="font-mono text-muted-foreground">$4,180</span></li>
              <li className="flex items-center justify-between"><span>Reseller credits</span><span className="font-mono text-ai">$62,890</span></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
