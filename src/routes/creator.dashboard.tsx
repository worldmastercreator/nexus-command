import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import { MultiLine, MiniArea, Bars } from "@/components/dash/charts";
import { generateSeries, useLiveSeries } from "@/lib/data";
import { GraduationCap, PlaySquare, Award, Users, Sparkles, BookOpen } from "lucide-react";

export const Route = createFileRoute("/creator/dashboard")({ component: CreatorDashboard });

function CreatorDashboard() {
  const live = useLiveSeries(48, 401, 220, 28);
  const cohorts = [
    { name: "Cohort · Q2", learners: 1284, completion: 86, nps: 71 },
    { name: "Cohort · Q1", learners: 962, completion: 78, nps: 64 },
    { name: "Pilot · Beta", learners: 412, completion: 92, nps: 81 },
    { name: "Open · Free", learners: 5320, completion: 41, nps: 52 },
  ];
  const top = [
    { c: "AI Engineering Bootcamp", w: 4280, r: 4.9 },
    { c: "Distributed Systems 301", w: 2961, r: 4.8 },
    { c: "Design Systems at Scale", w: 1840, r: 4.7 },
    { c: "Quant Finance for Devs", w: 1622, r: 4.6 },
    { c: "Rust for the Web", w: 1488, r: 4.8 },
  ];

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-6 p-6">
        <PageHeader
          eyebrow="MODULE · 400 · CREATOR HUB"
          title="Creator Operations · Learning Network"
          subtitle="Cohorts, courses, live classrooms, payments and revenue — one mission-control surface."
          actions={
            <div className="flex items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3 w-3 text-ai" /> Live · 42 sessions
            </div>
          }
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Metric label="Active learners" value="8,418" delta="+312 wk" tone="primary"
            spark={<MiniArea data={generateSeries(28, 11, 220, 22)} />} />
          <Metric label="Live classrooms" value="42" delta="+6" tone="info"
            spark={<MiniArea data={generateSeries(28, 12, 60, 18)} color="var(--info)" />} />
          <Metric label="Completion" value="78.4%" delta="+1.9pts" tone="success"
            spark={<MiniArea data={generateSeries(28, 13, 70, 8)} color="var(--success)" />} />
          <Metric label="MRR" value="$184.2k" delta="+12.4%" tone="ai"
            spark={<MiniArea data={generateSeries(28, 14, 80, 14)} color="var(--ai)" />} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2" kicker="LIVE TELEMETRY" title="Concurrent watch-time · last 4h">
            <MultiLine data={live} />
          </Panel>
          <Panel kicker="COHORTS" title="Performance">
            <ul className="space-y-3 text-[12.5px]">
              {cohorts.map((c) => (
                <li key={c.name} className="rounded-md border border-border bg-surface-2/40 p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    <span className="font-mono text-[10.5px] text-muted-foreground">{c.learners.toLocaleString()} learners</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-ai" style={{ width: `${c.completion}%` }} />
                    </div>
                    <span className="font-mono text-[10.5px] text-success">{c.completion}%</span>
                    <span className="font-mono text-[10.5px] text-ai">NPS {c.nps}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Panel kicker="TOP COURSES" title="By weekly watch hours" className="lg:col-span-2">
            <table className="w-full text-[12.5px]">
              <thead className="text-left font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-2">Course</th>
                  <th>Watch hrs</th>
                  <th>Rating</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {top.map((r, i) => (
                  <tr key={r.c} className="border-b border-border/50">
                    <td className="py-2"><BookOpen className="mr-2 inline h-3.5 w-3.5 text-primary" />{r.c}</td>
                    <td className="font-mono text-foreground">{r.w.toLocaleString()}</td>
                    <td className="font-mono text-success">★ {r.r}</td>
                    <td className="w-32"><MiniArea data={generateSeries(20, 50 + i, 40, 18)} color="var(--ai)" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel kicker="REVENUE MIX" title="By product line">
            <Bars data={generateSeries(12, 77, 50, 28)} color="var(--ai)" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <Tag icon={GraduationCap} label="Courses" v="58%" />
              <Tag icon={PlaySquare} label="Live" v="29%" />
              <Tag icon={Award} label="Certs" v="13%" />
            </div>
          </Panel>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="CLASSROOM" title="Live now">
            <ul className="divide-y divide-border text-[12.5px]">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-2">
                  <span className="live-dot" />
                  <Users className="h-3.5 w-3.5 text-info" />
                  <span>{["AI Engineering · Module 7","Design Systems · Workshop","Rust Web · Q&A","Quant · Backtesting","Distributed · Raft","Kubernetes · Day 3"][i]}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{120 + i * 17} attending</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel kicker="OPS FEED" title="Realtime events">
            <ul className="divide-y divide-border text-[12.5px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 py-2">
                  <span className={`live-dot ${i % 3 === 0 ? "warn" : ""}`} />
                  <span className="font-mono text-[10.5px] text-muted-foreground">T-{(i + 1) * 12}s</span>
                  <span>{["enrollment.complete","payment.succeeded","certificate.issued","assignment.graded","video.transcoded","forum.flagged","cohort.advanced"][i]}</span>
                  <span className="ml-auto rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">edge</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, label, v }: { icon: any; label: string; v: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2/40 px-2 py-1.5">
      <Icon className="h-3 w-3 text-primary" />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-mono text-foreground">{v}</span>
    </div>
  );
}
