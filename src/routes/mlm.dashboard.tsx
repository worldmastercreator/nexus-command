import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/mlm/dashboard")({
  head: () => ({ meta: [{ title: "MLM Network · AEGIS OS" }] }),
  component: MLMDashboard,
});

type Node = { id: string; name: string; rank: string; vol: number; children?: Node[] };

const TREE: Node = {
  id: "root", name: "Z. Khan", rank: "Diamond", vol: 1820000,
  children: [
    { id: "a", name: "Aarav M.", rank: "Platinum", vol: 612000, children: [
      { id: "a1", name: "Sofia L.", rank: "Gold", vol: 184000 },
      { id: "a2", name: "Mateo G.", rank: "Gold", vol: 152000 },
      { id: "a3", name: "Riya T.", rank: "Silver", vol: 84000 },
    ]},
    { id: "b", name: "Noor H.", rank: "Platinum", vol: 540000, children: [
      { id: "b1", name: "Kenji S.", rank: "Gold", vol: 192000 },
      { id: "b2", name: "Lara V.", rank: "Silver", vol: 88000 },
    ]},
    { id: "c", name: "Priya S.", rank: "Gold", vol: 410000, children: [
      { id: "c1", name: "Daichi S.", rank: "Silver", vol: 92000 },
      { id: "c2", name: "Eva R.", rank: "Bronze", vol: 41000 },
    ]},
  ],
};

const RANK_COLOR: Record<string, string> = {
  Diamond: "text-ai", Platinum: "text-info", Gold: "text-warning",
  Silver: "text-muted-foreground", Bronze: "text-danger",
};

function TreeRow({ n, depth = 0 }: { n: Node; depth?: number }) {
  return (
    <>
      <div className="flex items-center gap-2 border-b border-border/40 py-1.5 text-[12.5px]" style={{ paddingLeft: depth * 18 }}>
        <span className="font-mono text-[10px] text-muted-foreground">L{depth}</span>
        <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-primary to-ai text-[9px] font-semibold">
          {n.name.split(" ").map(s => s[0]).join("")}
        </span>
        <span className="font-medium">{n.name}</span>
        <span className={`ml-2 font-mono text-[10px] uppercase ${RANK_COLOR[n.rank] ?? ""}`}>{n.rank}</span>
        <span className="ml-auto font-mono text-[11px] text-foreground">${(n.vol / 1000).toFixed(0)}k</span>
        <span className="h-1 w-16 overflow-hidden rounded-full bg-surface-2">
          <span className="block h-full bg-primary" style={{ width: `${Math.min(100, n.vol / 20000)}%` }} />
        </span>
      </div>
      {n.children?.map((c) => <TreeRow key={c.id} n={c} depth={depth + 1} />)}
    </>
  );
}

function MLMDashboard() {
  const live = useLiveSeries(48, 601, 50, 14);
  const payouts = [
    { id: "PX-71204", to: "Sofia L.", amt: 4820, method: "Wire", status: "pending" },
    { id: "PX-71203", to: "Mateo G.", amt: 3110, method: "USDT", status: "sent" },
    { id: "PX-71202", to: "Kenji S.", amt: 7220, method: "Wire", status: "sent" },
    { id: "PX-71201", to: "Daichi S.", amt: 1840, method: "ACH", status: "review" },
    { id: "PX-71200", to: "Lara V.", amt: 6480, method: "USDT", status: "sent" },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 600 · MLM NETWORK"
          title="MLM Command — Network Operations"
          subtitle="Genealogy · commissions · pools · ranks · payouts. Multi-tier residual engine."
          actions={
            <div className="flex gap-2">
              <button className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] hover:bg-accent">Run cycle</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Approve payouts</button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Active members" value="48,210" delta="+312 24h" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 70, 8)} />} />
          <Metric label="Network volume" value="$1.82M" delta="+9.4%" tone="success" spark={<MiniArea data={generateSeries(30, 2, 80, 10)} color="var(--success)" />} />
          <Metric label="Commissions due" value="$184,210" delta="cycle 84" tone="warning" spark={<MiniArea data={generateSeries(30, 3, 50, 12)} color="var(--warning)" />} />
          <Metric label="Pool balance" value="$92,440" delta="4 pools" tone="ai" spark={<MiniArea data={generateSeries(30, 4, 40, 14)} color="var(--ai)" />} />
          <Metric label="KYC pending" value="184" delta="-22" tone="info" spark={<MiniArea data={generateSeries(30, 5, 30, 16)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="VOLUME" title="Network volume · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="RANKS" title="Rank distribution">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={6} label="DIAMOND" />
              <Radial value={18} color="var(--info)" label="PLATINUM" />
              <Radial value={42} color="var(--warning)" label="GOLD" />
              <Radial value={71} color="var(--ai)" label="SILVER" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="GENEALOGY" title="Network tree · top legs">
            <div className="rounded-md border border-border/60 bg-surface/40 p-2">
              <TreeRow n={TREE} />
            </div>
          </Panel>
          <Panel kicker="PAYOUTS" title="Pending disbursements">
            <div className="space-y-1.5">
              {payouts.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded border border-border/60 bg-surface-2/40 px-2 py-1.5 text-[12px]">
                  <span className="font-mono text-[10px] text-muted-foreground">{p.id}</span>
                  <span className="font-medium">{p.to}</span>
                  <span className="ml-auto font-mono">${p.amt.toLocaleString()}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{p.method}</span>
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase ${
                    p.status === "sent" ? "border-success/40 bg-success/10 text-success" :
                    p.status === "pending" ? "border-warning/40 bg-warning/10 text-warning" :
                    "border-info/40 bg-info/10 text-info"
                  }`}>{p.status}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="POOLS" title="Pool accruals">
            <Bars data={generateSeries(6, 11, 60, 18)} h={200} color="var(--ai)" />
          </Panel>
          <Panel kicker="PACKAGES" title="Active package mix">
            <Bars data={generateSeries(7, 22, 55, 16)} h={200} color="var(--success)" />
          </Panel>
          <Panel kicker="COMPLIANCE" title="Risk signals">
            <ul className="space-y-2 text-[12px]">
              <li className="flex items-center justify-between"><span>Cross-line stacking</span><span className="font-mono text-warning">12</span></li>
              <li className="flex items-center justify-between"><span>Duplicate KYC</span><span className="font-mono text-danger">3</span></li>
              <li className="flex items-center justify-between"><span>Velocity anomalies</span><span className="font-mono text-warning">7</span></li>
              <li className="flex items-center justify-between"><span>Refund spikes</span><span className="font-mono text-info">2</span></li>
              <li className="flex items-center justify-between"><span>Chargebacks</span><span className="font-mono text-success">0</span></li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
