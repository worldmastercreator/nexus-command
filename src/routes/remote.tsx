import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/remote")({
  head: () => ({ meta: [{ title: "Remote Access · AEGIS OS" }] }),
  component: RemotePage,
});

function RemotePage() {
  const live = useLiveSeries(60, 1001, 50, 10);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 070 · TEAMVIEWER TENSOR"
          title="Remote Access & Bastion"
          subtitle="Just-in-time access · session recording · clipboard policy."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Live sessions" value="184" tone="primary" spark={<MiniArea data={generateSeries(24, 11, 60, 10)} />} />
          <Metric label="JIT grants" value="42" delta="24h" tone="info" />
          <Metric label="Recorded" value="100%" tone="success" />
          <Metric label="Policy blocks" value="18" tone="warning" />
          <Metric label="P95 latency" value="38ms" tone="ai" />
        </div>

        <Panel kicker="SESSION ACTIVITY" title="Concurrent · recorded">
          <MultiLine data={live} h={240} />
        </Panel>

        <Panel kicker="ACTIVE SESSIONS" title="Live · click to inspect" padded={false}>
          <table className="w-full text-[12px]">
            <thead className="border-b border-border bg-surface-2/40 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr><th className="px-3 py-2 text-left">SESSION</th><th className="px-3 py-2 text-left">OPERATOR</th><th className="px-3 py-2 text-left">TARGET</th><th className="px-3 py-2 text-left">PROTOCOL</th><th className="px-3 py-2 text-left">JIT</th><th className="px-3 py-2 text-left">DURATION</th></tr>
            </thead>
            <tbody>
              {[
                ["S-44821", "K. Singh", "rds/aegis-prod", "psql", "4h", "00:24"],
                ["S-44820", "L. Romero", "ec2/edge-fra-3", "ssh", "1h", "00:08"],
                ["S-44819", "Z. Khan", "k8s/aegis-core", "kubectl", "30m", "00:04"],
                ["S-44818", "A. Park", "vpc/secrets-vault", "https", "15m", "00:02"],
                ["S-44817", "M. Okafor", "azdo/release-7", "rdp", "2h", "01:12"],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-border/50 hover:bg-accent/40">
                  <td className="px-3 py-2 font-mono">{r[0]}</td>
                  <td className="px-3 py-2">{r[1]}</td>
                  <td className="px-3 py-2 font-mono text-[11px] text-muted-foreground">{r[2]}</td>
                  <td className="px-3 py-2"><span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase text-primary">{r[3]}</span></td>
                  <td className="px-3 py-2 font-mono text-[11px] text-info">{r[4]}</td>
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
