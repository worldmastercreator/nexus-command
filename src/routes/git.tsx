import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars, Radial } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { GitBranch, GitPullRequest, GitCommit } from "lucide-react";

export const Route = createFileRoute("/git")({
  head: () => ({ meta: [{ title: "Git Management · AEGIS OS" }] }),
  component: Page,
});

const REPOS = [
  ["aegis/core","main",184,42,"success"],
  ["aegis/web","main",96,18,"success"],
  ["aegis/mobile","develop",62,12,"warning"],
  ["aegis/infra","main",24,4,"success"],
  ["aegis/ai","main",148,28,"success"],
  ["aegis/billing","main",18,2,"danger"],
] as const;

function Page() {
  const live = useLiveSeries(48, 541, 50, 14);
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader eyebrow="MODULE · 054 · GITHUB · SOURCE CONTROL" title="Git Management"
          subtitle="Repos · branches · PRs · code review · protection rules — full org view." />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Metric label="Repos" value="148" delta="+4 wk" tone="primary" spark={<MiniArea data={generateSeries(24,542,60,6)} />} />
          <Metric label="Commits · 24h" value="2,840" delta="+18%" tone="success" spark={<MiniArea data={generateSeries(24,543,80,18)} color="var(--success)" />} />
          <Metric label="Open PRs" value="412" delta="42 ready" tone="ai" spark={<MiniArea data={generateSeries(24,544,60,10)} color="var(--ai)" />} />
          <Metric label="Avg review" value="4h 12m" delta="-22%" tone="success" spark={<MiniArea data={generateSeries(24,545,40,10)} color="var(--success)" />} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="VCS TELEMETRY" title="Commits · PRs · merges"><MultiLine data={live} h={260} /></Panel>
          <Panel kicker="CODE HEALTH" title="Branch protection">
            <div className="grid grid-cols-2 gap-2">
              <Radial value={96} color="var(--success)" label="PROTECTED" />
              <Radial value={84} color="var(--primary)" label="COVERAGE" />
            </div>
            <ul className="mt-3 space-y-1.5 text-[11.5px]">
              <li className="flex justify-between"><span>Required reviews</span><span className="font-mono">2</span></li>
              <li className="flex justify-between"><span>Signed commits</span><span className="font-mono">94%</span></li>
              <li className="flex justify-between"><span>Stale branches</span><span className="font-mono text-warning">42</span></li>
            </ul>
          </Panel>
        </div>
        <Panel kicker="REPO REGISTRY" title="Top repos · 24h">
          <table className="w-full text-[12px]">
            <thead><tr className="border-b border-border/60 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground"><th className="py-2">Repo</th><th>Default</th><th className="text-right">Commits</th><th className="text-right">PRs</th><th className="text-right">Health</th></tr></thead>
            <tbody>{REPOS.map(([n,b,c,pr,tone]) => (
              <tr key={n} className="border-b border-border/60 last:border-0">
                <td className="py-2 flex items-center gap-2"><GitBranch className={`h-3.5 w-3.5 text-${tone}`} /><span className="font-mono">{n}</span></td>
                <td className="py-2 font-mono text-muted-foreground">{b}</td>
                <td className="py-2 text-right font-mono"><span className="inline-flex items-center gap-1"><GitCommit className="h-3 w-3 text-muted-foreground" />{c}</span></td>
                <td className="py-2 text-right font-mono"><span className="inline-flex items-center gap-1"><GitPullRequest className="h-3 w-3 text-muted-foreground" />{pr}</span></td>
                <td className="py-2 text-right"><span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[10px] border-${tone}/40 text-${tone}`}>{tone==="danger"?"BLOCKED":tone==="warning"?"REVIEW":"OK"}</span></td>
              </tr>))}</tbody>
          </table>
        </Panel>
        <Panel kicker="ACTIVITY" title="Commits by team · 24h"><Bars data={generateSeries(14,549,60,18)} color="var(--ai)" h={220} /></Panel>
      </div>
    </div>
  );
}
