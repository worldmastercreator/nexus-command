import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/pos/dashboard")({
  head: () => ({ meta: [{ title: "POS Retail OS · AEGIS OS" }] }),
  component: POSDashboard,
});

function POSDashboard() {
  const live = useLiveSeries(48, 701, 70, 16);

  const terminals = [
    { id: "T-01", store: "Connaught Place", op: "Ananya", txn: 184, gmv: 92410, status: "open", uptime: 99.8 },
    { id: "T-02", store: "Bandra West",     op: "Vikram", txn: 142, gmv: 71240, status: "open", uptime: 99.4 },
    { id: "T-03", store: "Koramangala",     op: "Meera",  txn: 211, gmv: 108220, status: "open", uptime: 99.9 },
    { id: "T-04", store: "Salt Lake",       op: "Imran",  txn: 38,  gmv: 18420, status: "syncing", uptime: 92.1 },
    { id: "T-05", store: "Hi-Tech City",    op: "Lakshmi",txn: 167, gmv: 84920, status: "open", uptime: 99.6 },
    { id: "T-06", store: "Whitefield",      op: "Rohan",  txn: 0,   gmv: 0,     status: "closed", uptime: 0 },
  ];

  const recent = [
    { id: "INV-89241", items: 7,  total: 1842.50, pay: "UPI",   sec: 12 },
    { id: "INV-89240", items: 3,  total: 612.00,  pay: "Card",  sec: 32 },
    { id: "INV-89239", items: 11, total: 4210.75, pay: "Cash",  sec: 58 },
    { id: "INV-89238", items: 1,  total: 199.00,  pay: "UPI",   sec: 71 },
    { id: "INV-89237", items: 5,  total: 1280.20, pay: "Card",  sec: 94 },
    { id: "INV-89236", items: 9,  total: 3120.40, pay: "UPI",   sec: 118 },
  ];

  const inventory = [
    { sku: "SKU-7821", name: "Espresso Beans 1kg",  stock: 18, min: 30, vel: "high" },
    { sku: "SKU-4410", name: "Notebook A5",          stock: 412, min: 100, vel: "med" },
    { sku: "SKU-9132", name: "Wireless Mouse",       stock: 4,  min: 25, vel: "high" },
    { sku: "SKU-2087", name: "USB-C Cable 1m",       stock: 62, min: 50, vel: "med" },
    { sku: "SKU-6655", name: "Insulated Bottle 750", stock: 0,  min: 20, vel: "high" },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 700 · POS RETAIL OS"
          title="POS Command — Retail Operations"
          subtitle="Multi-store terminals · billing · inventory · shift control · offline-first sync."
          actions={
            <div className="flex gap-2">
              <button className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-[12px] hover:bg-accent">End-of-day Z</button>
              <button className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-medium text-primary-foreground hover:opacity-90">Open terminal</button>
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="GMV today" value="$1.42M" delta="+12.1%" tone="success" spark={<MiniArea data={generateSeries(30, 11, 80, 10)} color="var(--success)" />} />
          <Metric label="Transactions" value="18,420" delta="+9.4%" tone="primary" spark={<MiniArea data={generateSeries(30, 12, 70, 12)} />} />
          <Metric label="Avg basket" value="$77.20" delta="+$3.10" tone="info" spark={<MiniArea data={generateSeries(30, 13, 40, 14)} color="var(--info)" />} />
          <Metric label="Refunds" value="42" delta="0.23%" tone="warning" spark={<MiniArea data={generateSeries(30, 14, 30, 16)} color="var(--warning)" />} />
          <Metric label="Offline queue" value="1,184" delta="syncing" tone="ai" spark={<MiniArea data={generateSeries(30, 15, 50, 18)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE GMV" title="Revenue · last 48h">
            <MultiLine data={live} h={240} />
          </Panel>
          <Panel kicker="HEALTH" title="Fleet posture">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={98} color="var(--success)" label="UPTIME" />
              <Radial value={84} color="var(--ai)" label="SYNC" />
              <Radial value={72} color="var(--info)" label="STOCK" />
              <Radial value={91} color="var(--warning)" label="CASH" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="TERMINALS" title="Live store fleet">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["Terminal","Store","Operator","Txn","GMV","Uptime","Status"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {terminals.map((t) => (
                  <tr key={t.id} className="border-b border-border/60 hover:bg-accent/40">
                    <td className="px-3 py-2 font-mono">{t.id}</td>
                    <td className="px-3 py-2">{t.store}</td>
                    <td className="px-3 py-2 text-muted-foreground">{t.op}</td>
                    <td className="px-3 py-2 font-mono">{t.txn}</td>
                    <td className="px-3 py-2 font-mono">${t.gmv.toLocaleString()}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{t.uptime}%</td>
                    <td className="px-3 py-2">
                      <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                        t.status === "open" ? "border-success/40 bg-success/10 text-success" :
                        t.status === "syncing" ? "border-warning/40 bg-warning/10 text-warning" :
                        "border-border bg-surface-2 text-muted-foreground"
                      }`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="RECEIPTS" title="Last 6 transactions">
            <div className="space-y-1.5">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center gap-2 rounded border border-border/60 bg-surface-2/40 px-2 py-1.5 text-[12px]">
                  <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.items} item</span>
                  <span className="ml-auto font-mono">${r.total.toFixed(2)}</span>
                  <span className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[9px] uppercase text-muted-foreground">{r.pay}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.sec}s</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="INVENTORY" title="Low-stock signals">
            <table className="w-full border-collapse text-[12.5px]">
              <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  {["SKU","Item","Stock","Min","Velocity","Status"].map((h) => <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {inventory.map((i) => {
                  const out = i.stock === 0;
                  const low = i.stock < i.min;
                  return (
                    <tr key={i.sku} className="border-b border-border/60 hover:bg-accent/40">
                      <td className="px-3 py-2 font-mono text-[11px]">{i.sku}</td>
                      <td className="px-3 py-2">{i.name}</td>
                      <td className="px-3 py-2 font-mono">{i.stock}</td>
                      <td className="px-3 py-2 font-mono text-muted-foreground">{i.min}</td>
                      <td className="px-3 py-2 font-mono text-[10px] uppercase text-muted-foreground">{i.vel}</td>
                      <td className="px-3 py-2">
                        <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                          out ? "border-danger/40 bg-danger/10 text-danger" :
                          low ? "border-warning/40 bg-warning/10 text-warning" :
                          "border-success/40 bg-success/10 text-success"
                        }`}>{out ? "out" : low ? "low" : "ok"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>

          <Panel kicker="PAYMENT MIX" title="Tender split">
            <Bars data={generateSeries(5, 41, 60, 16)} h={220} color="var(--ai)" />
            <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase text-muted-foreground">
              <div>UPI · 54%</div><div>Card · 31%</div><div>Cash · 15%</div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
