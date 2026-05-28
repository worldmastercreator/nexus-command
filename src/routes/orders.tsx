import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { ShoppingCart, Truck, PackageCheck, CircleAlert } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";
import { ModuleLiveTable, StatusBadge, fmtMoney } from "@/components/dash/ModuleLiveTable";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Order Management · AEGIS OS" }] }),
  component: OrdersPage,
});

const ORDERS = [
  ["#48210","Aurora Labs","$1,840.00","FULFILLED","2026-05-19"],
  ["#48209","Pulse Co","$240.00","PROCESSING","2026-05-19"],
  ["#48208","Helix CRM","$4,820.00","SHIPPED","2026-05-18"],
  ["#48207","Nova Studio","$120.00","FULFILLED","2026-05-18"],
  ["#48206","Axiom UX","$720.00","REFUNDED","2026-05-17"],
  ["#48205","Quantum Co","$2,140.00","FULFILLED","2026-05-17"],
] as const;

const STATUS_TONE: Record<string,string> = {FULFILLED:"success",SHIPPED:"info",PROCESSING:"warning",REFUNDED:"danger"};

function OrdersPage() {
  const live = useLiveSeries(48, 251, 60, 22);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 025 · SHOPIFY ORDERS / OMS"
          title="Order Management"
          subtitle="Capture · pick · pack · ship · return — omnichannel fulfilment OS."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Orders · 24h" value="8,420" delta="+12%" tone="primary" spark={<MiniArea data={generateSeries(24,141,60,16)} />} />
          <Metric label="GMV" value="$1.84M" delta="+9.4%" tone="market" spark={<MiniArea data={generateSeries(24,142,60,14)} color="var(--market)" />} />
          <Metric label="In flight" value="2,184" delta="picking · packing" tone="info" spark={<MiniArea data={generateSeries(24,143,40,10)} color="var(--info)" />} />
          <Metric label="Fulfilled" value="98.4%" delta="SLA" tone="success" spark={<MiniArea data={generateSeries(24,144,80,4)} color="var(--success)" />} />
          <Metric label="Returns" value="2.1%" delta="-0.3pp" tone="warning" spark={<MiniArea data={generateSeries(24,145,20,12)} color="var(--warning)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ORDER FLOW" title="Capture · process · ship · close"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="FULFILMENT STAGE" title="In-flight pipeline">
            <ul className="space-y-3 text-[12.5px]">
              {[[ShoppingCart,"Captured",2840,"primary"],[CircleAlert,"Picking",1240,"warning"],[PackageCheck,"Packed",820,"ai"],[Truck,"In transit",1480,"info"]].map(([I,n,c,t])=>{const Ico=I as any; return (
                <li key={n as string} className="space-y-1">
                  <div className="flex items-center gap-2"><Ico className="h-3.5 w-3.5" /><span>{n as string}</span><span className="ml-auto font-mono text-muted-foreground">{c as number}</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className={`h-full bg-${t}`} style={{width:`${Math.min(100,(c as number)/30)}%`}} /></div>
                </li>
              );})}
            </ul>
          </Panel>
        </div>

        <Panel kicker="RECENT ORDERS" title="Live OMS stream">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Order</th><th>Customer</th><th className="text-right">Amount</th><th className="text-right">Status</th><th className="text-right">Date</th></tr></thead>
            <tbody>
              {ORDERS.map(([id,c,a,s,d])=>(
                <tr key={id} className="border-b border-border/60 last:border-0">
                  <td className="py-2 font-mono text-[11px] text-info">{id}</td>
                  <td className="py-2">{c}</td>
                  <td className="py-2 text-right font-mono">{a}</td>
                  <td className="py-2 text-right"><span className={`rounded border px-1.5 py-0.5 font-mono text-[10px] border-${STATUS_TONE[s]}/40 text-${STATUS_TONE[s]}`}>{s}</span></td>
                  <td className="py-2 text-right font-mono text-[11px] text-muted-foreground">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="CHANNELS" title="Origin mix"><Bars data={generateSeries(10,148,60,22)} color="var(--primary)" h={200} /></Panel>
          <Panel kicker="CARRIERS" title="Shipping mix"><Bars data={generateSeries(10,149,60,18)} color="var(--info)" h={200} /></Panel>
        </div>

        <ModuleLiveTable
          table="mod_orders"
          kicker="LIVE · LOVABLE CLOUD"
          title="Order ledger"
          columns={[
            { key: "order_no", label: "Order", className: "font-mono text-[11px] text-info" },
            { key: "customer", label: "Customer" },
            { key: "product", label: "Product", className: "text-muted-foreground" },
            { key: "amount", label: "Amount", align: "right", format: (v) => fmtMoney(v) },
            { key: "status", label: "Status", align: "right", format: (v) => <StatusBadge value={String(v)} /> },
            { key: "created_at", label: "Created", align: "right", format: (v) => <span className="font-mono text-[11px] text-muted-foreground">{new Date(String(v)).toISOString().slice(0,10)}</span> },
          ]}
        />

        <ConnectedModules ids={[11, 12, 14, 23, 25]} />
      </div>
    </div>
  );
}
