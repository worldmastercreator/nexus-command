import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Shield, Lock, ShieldAlert, Globe } from "lucide-react";

export const Route = createFileRoute("/security")({
  head: () => ({ meta: [{ title: "Security · AEGIS OS" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const live = useLiveSeries(50, 91, 40, 26);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 007 · CLOUDFLARE ZERO TRUST"
          title="Security Manager"
          subtitle="Zero-trust posture · WAF · bot mitigation · access policies."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Threats blocked" value="14,209" delta="+182/h" tone="danger" spark={<MiniArea data={generateSeries(30, 1, 40, 22)} color="var(--danger)" />} />
          <Metric label="Policies" value="284" delta="all enforced" tone="success" spark={<MiniArea data={generateSeries(30, 2, 80, 4)} color="var(--success)" />} />
          <Metric label="Mfa coverage" value="98.2%" delta="" tone="primary" spark={<MiniArea data={generateSeries(30, 3, 80, 6)} />} />
          <Metric label="Tunnels" value="142" delta="" tone="info" spark={<MiniArea data={generateSeries(30, 4, 60, 8)} color="var(--info)" />} />
          <Metric label="Anomalies" value="9" delta="ai-flagged" tone="ai" spark={<MiniArea data={generateSeries(30, 5, 30, 18)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ATTACK SURFACE" title="Realtime threat telemetry">
            <MultiLine data={live} h={260} />
          </Panel>
          <Panel kicker="POSTURE" title="Zero-trust health">
            <div className="grid grid-cols-2 gap-3">
              <Radial value={94} color="var(--success)" label="IDENTITY" />
              <Radial value={88} label="DEVICE" />
              <Radial value={76} color="var(--warning)" label="NETWORK" />
              <Radial value={91} color="var(--ai)" label="APPS" />
            </div>
          </Panel>
        </div>

        <Panel kicker="ATTACK MAP" title="Global threat radar">
          <div className="relative h-[280px] overflow-hidden rounded-lg border border-border bg-[radial-gradient(50%_60%_at_50%_50%,_color-mix(in_oklab,var(--danger)_8%,transparent),_transparent)]">
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="animate-radar h-[80%] w-[80%] rounded-full bg-[conic-gradient(from_0deg,_color-mix(in_oklab,var(--danger)_35%,transparent),_transparent_25%)] opacity-50" />
            </div>
            <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full">
              {Array.from({ length: 60 }).map((_, i) => {
                const a = Math.sin(i * 1.7);
                const x = 50 + a * 40; const y = 30 + Math.cos(i * 0.9) * 20;
                return <circle key={i} cx={x} cy={y} r={0.4 + Math.abs(a) * 0.8} fill="var(--danger)">
                  <animate attributeName="opacity" values="0.3;1;0.3" dur={`${1 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
                </circle>;
              })}
              <circle cx="50" cy="30" r="2" fill="var(--success)" />
            </svg>
            <div className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <div className="flex items-center gap-2"><span className="live-dot danger" /> SCAN · CONTINUOUS</div>
            </div>
          </div>
        </Panel>

        <Panel kicker="EVENTS" title="Recent security events">
          <table className="w-full border-collapse text-[12.5px]">
            <thead className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border">
                {["Time", "Severity", "Type", "Source", "Action"].map((h) => (
                  <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["12:42:08", "CRIT", "Credential stuffing", "185.220.x.x", "BLOCKED"],
                ["12:41:55", "WARN", "Anomalous geo login", "user · zk@aegis", "STEP-UP"],
                ["12:41:32", "INFO", "Policy update", "admin", "APPLIED"],
                ["12:40:11", "CRIT", "Bot · scraper", "ASN 14618", "CHALLENGED"],
                ["12:39:02", "WARN", "TLS handshake fail", "edge-eu-3", "RETRIED"],
              ].map((r, i) => (
                <tr key={i} className="border-b border-border/60 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono text-muted-foreground">{r[0]}</td>
                  <td className={`px-3 py-2 font-mono ${r[1] === "CRIT" ? "text-danger" : r[1] === "WARN" ? "text-warning" : "text-info"}`}>{r[1]}</td>
                  <td className="px-3 py-2">{r[2]}</td>
                  <td className="px-3 py-2 font-mono">{r[3]}</td>
                  <td className="px-3 py-2"><span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase">{r[4]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
