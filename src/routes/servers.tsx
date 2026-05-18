import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";

export const Route = createFileRoute("/servers")({
  head: () => ({ meta: [{ title: "Servers · AEGIS OS" }] }),
  component: ServersPage,
});

function ServersPage() {
  const live = useLiveSeries(50, 211, 50, 20);
  const racks = Array.from({ length: 6 }, (_, r) => ({
    id: `RACK-${(r + 1).toString().padStart(2, "0")}`,
    hosts: Array.from({ length: 12 }, (_, i) => ({
      id: i, cpu: Math.round(20 + ((Math.sin(r * 3 + i) + 1) / 2) * 75),
    })),
  }));

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 061 · DIGITAL OCEAN + CPANEL"
          title="Server Manager"
          subtitle="Datacenter visualization · rack health · live CPU pulse."
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Metric label="Hosts" value="1,284" delta="+6" tone="primary" spark={<MiniArea data={generateSeries(30, 1, 60, 6)} />} />
          <Metric label="vCPU" value="38,420" delta="" tone="info" spark={<MiniArea data={generateSeries(30, 2, 60, 8)} color="var(--info)" />} />
          <Metric label="Mem util" value="64%" delta="+2pp" tone="warning" spark={<MiniArea data={generateSeries(30, 3, 60, 8)} color="var(--warning)" />} />
          <Metric label="Net I/O" value="142Gbps" delta="" tone="ai" spark={<MiniArea data={generateSeries(30, 4, 60, 20)} color="var(--ai)" />} />
          <Metric label="Power" value="48.2kW" delta="green-mix 62%" tone="success" spark={<MiniArea data={generateSeries(30, 5, 60, 6)} color="var(--success)" />} />
        </div>

        <Panel kicker="DC · LIVE" title="Datacenter floor map">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {racks.map((rack) => (
              <div key={rack.id} className="rounded-lg border border-border bg-surface-2/60 p-2">
                <div className="mb-2 flex items-center justify-between font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                  <span>{rack.id}</span>
                  <span className="live-dot" />
                </div>
                <div className="space-y-1">
                  {rack.hosts.map((h) => (
                    <div key={h.id} className="relative h-3 overflow-hidden rounded-sm border border-border bg-background/60">
                      <div
                        className="h-full"
                        style={{
                          width: `${h.cpu}%`,
                          background: h.cpu > 80 ? "var(--danger)" : h.cpu > 60 ? "var(--warning)" : "var(--success)",
                          boxShadow: `0 0 8px color-mix(in oklab, ${h.cpu > 80 ? "var(--danger)" : h.cpu > 60 ? "var(--warning)" : "var(--success)"} 60%, transparent)`,
                        }}
                      />
                      <span className="absolute inset-y-0 right-1 grid place-items-center font-mono text-[9px] text-foreground/70">{h.cpu}%</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel kicker="THROUGHPUT" title="Network · I/O over time">
          <MultiLine data={live} h={240} />
        </Panel>
      </div>
    </div>
  );
}
