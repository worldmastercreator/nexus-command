import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { Bars, MiniArea, Radial } from "@/components/dash/charts";
import { generateSeries } from "@/lib/data";

export const Route = createFileRoute("/devices")({
  head: () => ({ meta: [{ title: "Sessions & Devices · AEGIS OS" }] }),
  component: DevicesPage,
});

function DevicesPage() {
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 009 · MICROSOFT INTUNE"
          title="Session & Device Control"
          subtitle="Posture, compliance, MDM enrolment, conditional access."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Enrolled" value="12,481" tone="primary" spark={<MiniArea data={generateSeries(24, 91, 80, 8)} />} />
          <Metric label="Compliant" value="11,920" tone="success" />
          <Metric label="Quarantined" value="284" tone="warning" spark={<MiniArea data={generateSeries(24, 92, 30, 18)} color="var(--warning)" />} />
          <Metric label="Blocked" value="42" tone="danger" />
          <Metric label="Live sessions" value="4,108" tone="info" spark={<MiniArea data={generateSeries(24, 93, 60, 12)} color="var(--info)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="ENROLMENTS · 30D" title="iOS · Android · macOS · Windows · Linux">
            <Bars data={generateSeries(30, 71, 80, 14)} h={240} />
          </Panel>
          <Panel kicker="POSTURE SCORE" title="Org-wide compliance">
            <Radial value={95} color="var(--success)" label="COMPLIANT" h={200} />
          </Panel>
        </div>

        <Panel kicker="LIVE SESSIONS" title="Top devices" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">DEVICE</th><th className="px-3 py-2 text-left">OWNER</th><th className="px-3 py-2 text-left">OS</th><th className="px-3 py-2 text-left">LOCATION</th><th className="px-3 py-2 text-left">POSTURE</th><th className="px-3 py-2 text-left">LAST SEEN</th></tr>
            </thead>
            <tbody>
              {[
                ["MBP-Khan-14", "Z. Khan", "macOS 14.5", "Berlin", "compliant", "now"],
                ["iPhone-Singh", "K. Singh", "iOS 17.5", "Bangalore", "compliant", "12s"],
                ["Win-Romero", "L. Romero", "Win 11 23H2", "Lisbon", "compliant", "1m"],
                ["Pixel-Okafor", "M. Okafor", "Android 14", "Lagos", "quarantined", "4m"],
                ["MBP-Park", "A. Park", "macOS 14.4", "Seoul", "compliant", "9m"],
                ["Win-X-380", "ops/bot", "Win Server", "ams-1", "compliant", "16m"],
                ["Pixel-8-Pro", "—", "Android 14", "—", "blocked", "1h"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono text-[11px]">{r[0]}</td>
                  <td className="px-3 py-2">{r[1]}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[2]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r[3]}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-mono uppercase ${r[4]==="compliant"?"bg-success/15 text-success":r[4]==="quarantined"?"bg-warning/15 text-warning":"bg-danger/15 text-danger"}`}>{r[4]}</span>
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[5]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
