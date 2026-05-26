import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { KeyRound, ShieldCheck, ShieldAlert } from "lucide-react";
import { ConnectedModules } from "@/components/dash/ConnectedModules";

export const Route = createFileRoute("/licenses")({
  head: () => ({ meta: [{ title: "License Manager · AEGIS OS" }] }),
  component: LicensesPage,
});

function LicensesPage() {
  const live = useLiveSeries(48, 151, 60, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 015 · LICENSE VERIFICATION"
          title="License Manager"
          subtitle="Activation · seats · domains · expiry · piracy detection — cryptographic enforcement."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Active licenses" value="148,210" delta="+842" tone="primary" spark={<MiniArea data={generateSeries(24, 41, 60, 6)} />} />
          <Metric label="Activations · 24h" value="4,820" delta="+12%" tone="success" spark={<MiniArea data={generateSeries(24, 42, 60, 14)} color="var(--success)" />} />
          <Metric label="Expiring 30d" value="2,184" delta="renew flow" tone="warning" spark={<MiniArea data={generateSeries(24, 43, 30, 10)} color="var(--warning)" />} />
          <Metric label="Piracy blocks" value="84" delta="auto-revoked" tone="danger" spark={<MiniArea data={generateSeries(24, 44, 20, 18)} color="var(--danger)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ENFORCEMENT" title="Verify · activate · renew · revoke">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="INTEGRITY" title="Signature validity">
            <Radial value={99} color="var(--success)" label="VALID KEYS" h={180} />
            <div className="mt-3 space-y-2 text-[11.5px]">
              <div className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-success" />ed25519 + HMAC chain intact</div>
              <div className="flex items-center gap-2"><ShieldAlert className="h-3.5 w-3.5 text-warning" />4 tamper attempts (auto-blocked)</div>
            </div>
          </Panel>
        </div>

        <Panel kicker="RECENT KEYS" title="Live activation stream">
          <ul className="divide-y divide-border text-[12px]">
            {Array.from({length:8}).map((_,i)=>(
              <li key={i} className="flex items-center gap-3 py-2">
                <KeyRound className="h-3.5 w-3.5 text-primary" />
                <span className="font-mono text-[11px]">{`XK-${(848210+i*7).toString(16).toUpperCase()}-${(98214+i).toString(36).toUpperCase()}`}</span>
                <span className="text-muted-foreground">{["nova_labs","axiom_ux","helix_dev","pulse_co"][i%4]} · seat {(i%5)+1}/5</span>
                <span className="ml-auto rounded border border-success/40 px-1.5 py-0.5 font-mono text-[10px] text-success">VERIFIED</span>
              </li>
            ))}
          </ul>
        </Panel>

        <ConnectedModules ids={[11, 12, 14, 18, 21]} />
      </div>
    </div>
  );
}
