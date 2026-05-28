import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ConnectedModules } from "@/components/dash/ConnectedModules";
import { ModuleLiveTable, StatusBadge, fmtMoney } from "@/components/dash/ModuleLiveTable";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Payments · AEGIS OS" }] }),
  component: PaymentsPage,
});

const GATEWAYS = [
  ["Stripe", 64, "success", "98.7%"],
  ["PayPal", 18, "info", "97.1%"],
  ["Razorpay", 9, "primary", "96.8%"],
  ["Adyen", 6, "ai", "98.2%"],
  ["Crypto · USDC", 3, "market", "99.4%"],
];

function PaymentsPage() {
  const live = useLiveSeries(60, 141, 60, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 014 · MULTI-GATEWAY PROCESSOR"
          title="Payment System"
          subtitle="Routing · 3DS · fraud · settlement · reconciliation — multi-rail orchestration."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Volume · 24h" value="$3.84M" delta="+9.1%" tone="market" spark={<MiniArea data={generateSeries(24, 31, 60, 18)} color="var(--market)" />} />
          <Metric label="Success rate" value="98.42%" delta="+0.18pp" tone="success" spark={<MiniArea data={generateSeries(24, 32, 80, 4)} color="var(--success)" />} />
          <Metric label="3DS challenges" value="12.4%" delta="-1.2pp" tone="info" spark={<MiniArea data={generateSeries(24, 33, 40, 10)} color="var(--info)" />} />
          <Metric label="Fraud blocked" value="184" delta="$48.2K saved" tone="danger" spark={<MiniArea data={generateSeries(24, 34, 30, 14)} color="var(--danger)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE PROCESSING" title="Authorizations · captures · refunds">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="GATEWAY MIX" title="Smart routing">
            <ul className="space-y-3 text-[12px]">
              {GATEWAYS.map(([n, p, t, sr]) => (
                <li key={n as string} className="space-y-1">
                  <div className="flex justify-between"><span>{n}</span><span className="font-mono text-muted-foreground">{p}% · {sr}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${p}%`}} /></div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="METHOD MIX" title="Cards · wallets · bank · crypto"><Bars data={generateSeries(10, 38, 60, 24)} color="var(--info)" h={200} /></Panel>
          <Panel kicker="LATENCY p95" title="Authorization · ms"><Bars data={generateSeries(10, 39, 30, 14)} color="var(--ai)" h={200} /></Panel>
          <Panel kicker="DISPUTES" title="Open · last 30d">
            <ul className="divide-y divide-border text-[12px]">
              {[["#DP-8821","$148.00","NEW"],["#DP-8807","$2,140.50","REPRESENTING"],["#DP-8741","$48.20","WON"],["#DP-8702","$320.00","LOST"]].map(([id,a,s])=>(
                <li key={id as string} className="flex items-center py-2">
                  <span className="font-mono text-[11px] text-muted-foreground">{id}</span>
                  <span className="ml-auto mr-3 font-mono">{a}</span>
                  <span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] ${s==="WON"?"border-success/40 text-success":s==="LOST"?"border-danger/40 text-danger":"border-border text-muted-foreground"}`}>{s}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <ModuleLiveTable
          table="mod_payments"
          kicker="LIVE · LOVABLE CLOUD"
          title="Recent transactions"
          columns={[
            { key: "txn_no", label: "Txn", className: "font-mono text-[11px] text-info" },
            { key: "method", label: "Method", className: "text-muted-foreground" },
            { key: "currency", label: "Cur", className: "font-mono text-[11px] text-muted-foreground" },
            { key: "amount", label: "Amount", align: "right", format: (v, r) => `${fmtMoney(v)} ${(r as { currency: string }).currency ?? ""}` },
            { key: "status", label: "Status", align: "right", format: (v) => <StatusBadge value={String(v)} /> },
          ]}
        />

        <ConnectedModules ids={[13, 23, 15, 14, 11]} />
      </div>
    </div>
  );
}
