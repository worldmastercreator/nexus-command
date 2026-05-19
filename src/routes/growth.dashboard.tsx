import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/growth/dashboard")({
  head: () => ({ meta: [{ title: "Growth OS · AEGIS OS" }] }),
  component: GrowthDashboard,
});

const STAGES = [
  { k: "New",        n: 1842, c: "var(--info)" },
  { k: "Qualified",  n: 1124, c: "var(--primary)" },
  { k: "Demo",       n: 612,  c: "var(--ai)" },
  { k: "Proposal",   n: 284,  c: "var(--warning)" },
  { k: "Negotiation",n: 142,  c: "var(--market)" },
  { k: "Closed Won", n: 71,   c: "var(--success)" },
];

function GrowthDashboard() {
  const live = useLiveSeries(48, 901, 60, 14);
  const maxN = STAGES[0].n;

  const leads = [
    { co: "Northwind Inc",    owner: "Aarav M.", amt: 84210, stage: "Demo",      heat: "hot" },
    { co: "Helix Robotics",   owner: "Sofia L.", amt: 142000, stage: "Proposal",  heat: "hot" },
    { co: "Aurora Health",    owner: "Mateo G.", amt: 38900,  stage: "Qualified", heat: "warm" },
    { co: "Pinnacle Cloud",   owner: "Priya S.", amt: 240000, stage: "Negotiation", heat: "hot" },
    { co: "Lumen Capital",    owner: "Noor H.",  amt: 12400,  stage: "New",       heat: "cold" },
    { co: "Vector Materials", owner: "Daichi S.",amt: 68200,  stage: "Demo",      heat: "warm" },
  ];

  const resellers = [
    { name: "Atlas Partners", deals: 38, revenue: 184200, tier: "Diamond" },
    { name: "Bridge Group",   deals: 22, revenue: 92410,  tier: "Platinum" },
    { name: "CinderLab",      deals: 14, revenue: 41200,  tier: "Gold" },
    { name: "Delta Sales",    deals: 9,  revenue: 18420,  tier: "Silver" },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 900 · GROWTH OS"
          title="Growth OS — Revenue Theatre"
          subtitle="Pipeline · campaigns · reseller network · SEO posture · payments lifecycle."
          actions={
            <div className="flex gap-2">
              <button className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] hover:bg-accent">New campaign</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Add lead</button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Pipeline" value="$8.4M" delta="+12.1%" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 70, 8)} />} />
          <Metric label="Closed (MTD)" value="$1.82M" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(30, 2, 80, 10)} color="var(--success)" />} />
          <Metric label="Active leads" value="1,842" delta="+312" tone="info" spark={<MiniArea data={generateSeries(30, 3, 50, 12)} color="var(--info)" />} />
          <Metric label="Win rate" value="38.4%" delta="+2.1pp" tone="ai" spark={<MiniArea data={generateSeries(30, 4, 60, 14)} color="var(--ai)" />} />
          <Metric label="Avg cycle" value="21d" delta="-3d" tone="warning" spark={<MiniArea data={generateSeries(30, 5, 40, 16)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="REVENUE" title="Bookings velocity · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="FUNNEL" title="Pipeline shape">
            <div className="space-y-2">
              {STAGES.map((s) => (
                <div key={s.k}>
                  <div className="flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                    <span>{s.k}</span><span>{s.n.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded bg-surface-2">
                    <div className="h-full" style={{ width: `${(s.n / maxN) * 100}%`, background: s.c, boxShadow: `0 0 14px ${s.c}` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LEADS" title="High-value deals · live">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["Company","Owner","Amount","Stage","Heat"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.co} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-medium">{l.co}</td>
                    <td className="px-3 py-2 text-muted-foreground">{l.owner}</td>
                    <td className="px-3 py-2 font-mono">${l.amt.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <span className="rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] uppercase">{l.stage}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        l.heat === "hot" ? "border-danger/40 bg-danger/10 text-danger" :
                        l.heat === "warm" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-info/40 bg-info/10 text-info"
                      }`}>{l.heat}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="RESELLERS" title="Channel leaderboard">
            <div className="space-y-1.5">
              {resellers.map((r) => (
                <div key={r.name} className="rounded border border-border/60 bg-surface-2/40 p-2">
                  <div className="flex items-center gap-2 text-[12.5px]">
                    <span className="font-medium">{r.name}</span>
                    <span className="ml-auto font-mono text-foreground">${(r.revenue / 1000).toFixed(0)}k</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
                    <span>{r.deals} deals</span>
                    <span className="text-ai">{r.tier}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded bg-surface">
                    <div className="h-full bg-ai" style={{ width: `${Math.min(100, r.revenue / 2000)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="CAMPAIGNS" title="Campaign performance">
            <Bars data={generateSeries(7, 51, 60, 18)} h={200} color="var(--ai)" />
          </Panel>
          <Panel kicker="SEO" title="Organic posture">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={84} color="var(--success)" label="DOMAIN" />
              <Radial value={62} color="var(--ai)" label="KEYWORDS" />
              <Radial value={71} color="var(--info)" label="BACKLINKS" />
              <Radial value={48} color="var(--warning)" label="CORE WEB" />
            </div>
          </Panel>
          <Panel kicker="PAYMENTS" title="Cashflow 24h">
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center justify-between"><span>Inflows</span><span className="font-mono text-success">$284,120</span></li>
              <li className="flex items-center justify-between"><span>Refunds</span><span className="font-mono text-danger">-$4,820</span></li>
              <li className="flex items-center justify-between"><span>Failed</span><span className="font-mono text-warning">12</span></li>
              <li className="flex items-center justify-between"><span>Held escrow</span><span className="font-mono text-info">$92,440</span></li>
              <li className="flex items-center justify-between"><span>Net settled</span><span className="font-mono text-foreground">$279,300</span></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
