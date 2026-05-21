import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { Mic2 } from "lucide-react";

export const Route = createFileRoute("/ai/voice")({
  head: () => ({ meta: [{ title: "Voice Assistant · AEGIS OS" }] }),
  component: Page,
});

const VOICES = [
  ["Aurora-EN","en-US · female","42,180","success"],
  ["Nova-ES","es-MX · female","18,420","success"],
  ["Atlas-EN","en-GB · male","9,240","success"],
  ["Sora-JA","ja-JP · female","6,180","success"],
  ["Echo-DE","de-DE · male","2,840","warning"],
  ["Orion-HI","hi-IN · male","1,920","success"],
] as const;

function Page() {
  const live = useLiveSeries(48, 441, 65, 16);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 044 · ELEVENLABS · VOICE OPS" title="Voice Assistant"
          subtitle="TTS · STT · cloned voices · realtime streams — sub-second latency." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Voices" value="148" delta="32 cloned" tone="ai" spark={<MiniArea data={generateSeries(24,442,60,8)} color="var(--ai)" />} />
          <Metric label="Minutes · 24h" value="184,210" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(24,443,80,22)} color="var(--success)" />} />
          <Metric label="Latency p95" value="620ms" delta="SLO 800ms" tone="primary" spark={<MiniArea data={generateSeries(24,444,40,8)} />} />
          <Metric label="MOS score" value="4.6/5" delta="quality" tone="success" spark={<MiniArea data={generateSeries(24,445,80,4)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="STREAM TELEMETRY" title="Concurrent streams · latency · TTFB"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="QUALITY" title="Voice KPIs">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={92} color="var(--success)" label="MOS" />
              <Radial value={88} color="var(--ai)" label="CLARITY" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>TTFB</span><span className="font-mono">180ms</span></li>
              <li className="flex justify-between"><span>WER</span><span className="font-mono text-muted-foreground">3.4%</span></li>
              <li className="flex justify-between"><span>Streams</span><span className="font-mono">1,248</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="VOICE LIBRARY" title="Top voices · 24h">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Voice</th><th>Locale</th><th className="text-right">Minutes</th><th className="text-right">Health</th></tr></thead>
            <tbody>{VOICES.map(([n,l,m,tone]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><Mic2 className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 text-muted-foreground">{l}</td>
                <td className="py-2 text-right font-mono">{m}</td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{tone==="warning"?"DEGRADED":"LIVE"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="LANGUAGE MIX" title="Minutes by locale · 24h"><Bars data={generateSeries(12,449,60,18)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
