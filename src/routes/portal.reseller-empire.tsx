import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, Metric } from "@/components/dash/primitives";
import {
  Trophy, Award, Crown, Star, Flag, Target, TrendingUp, Users2, Building2,
  Sparkles, MapPinned, GraduationCap, BadgeCheck, ArrowDown, CheckCircle2,
  AlertTriangle, Clock, Activity, Coins, Repeat, Gift, ArrowUpRight, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/portal/reseller-empire")({
  head: () => ({ meta: [{ title: "Reseller Empire · Career · Awards · Business Path" }] }),
  component: ResellerEmpire,
});

/* ----------------- Data ----------------- */

const CAREER = [
  "Applicant","Verified","Approved","Active Reseller","Senior Reseller","Gold Reseller",
  "Platinum Reseller","Diamond Reseller","Titan Reseller","Master Reseller",
  "Territory Partner","Regional Partner","National Partner","Franchise Candidate","Franchise Owner",
];
const CURRENT_RANK_INDEX = 5; // Gold

const FIRSTS = [
  "First Lead","First Demo","First Proposal","First Sale","First License",
  "First Renewal","First Customer","First Team Member","First Territory",
];

const REVENUE_AWARDS = [
  { tier: "Bronze",   amount: 1_000,      tone: "#cd7f32", icon: "🥉" },
  { tier: "Silver",   amount: 10_000,     tone: "#c0c0c0", icon: "🥈" },
  { tier: "Gold",     amount: 50_000,     tone: "#f5b400", icon: "🥇" },
  { tier: "Platinum", amount: 100_000,    tone: "#e5e4e2", icon: "💠" },
  { tier: "Diamond",  amount: 500_000,    tone: "#73c8ff", icon: "💎" },
  { tier: "Titan",    amount: 1_000_000,  tone: "#a78bfa", icon: "🏆" },
  { tier: "Legend",   amount: 10_000_000, tone: "#ff3d8a", icon: "👑" },
];
const CURRENT_REVENUE = 62_400;

const TROPHIES = [
  "Lead Champion","Demo Champion","Sales Champion","Renewal Champion","Customer Champion",
  "Territory Champion","Growth Champion","Support Champion","Marketplace Champion","Global Champion",
];

const BUSINESS_STAGES = [
  "Get Leads","Convert Leads","Run Demos","Create Proposal","Create Order","Get Approval",
  "Generate License","Customer Success","Renewal","Upsell","Referral","Recurring Revenue",
];
const CURRENT_STAGE = 6;

const EXPANSION = [
  "Single Reseller","Build Team","Assign Sales Agents","Assign Support Agents","Assign Demo Team",
  "Open New Territory","Add Sub Resellers","Become Territory Partner","Become Franchise",
];

const SCORES = [
  { label: "Revenue",  value: 86, tone: "var(--primary)" },
  { label: "Lead",     value: 72, tone: "var(--info)" },
  { label: "Demo",     value: 64, tone: "var(--ai)" },
  { label: "Customer", value: 91, tone: "var(--success)" },
  { label: "Renewal",  value: 78, tone: "var(--market)" },
  { label: "Support",  value: 83, tone: "var(--warning)" },
  { label: "Activity", value: 95, tone: "var(--primary)" },
  { label: "Training", value: 58, tone: "var(--info)" },
];

const CHAMPION_WALL = [
  { label: "Top Revenue",    name: "Arjun M.",   value: "$2.4M" },
  { label: "Top Renewals",   name: "Priya K.",   value: "412" },
  { label: "Top Customers",  name: "Diego R.",   value: "1,284" },
  { label: "Top Territory",  name: "Aiko T.",    value: "Tokyo" },
  { label: "Top Team",       name: "Lukas B.",   value: "28 ppl" },
  { label: "Top Growth",     name: "Sara A.",    value: "+412%" },
  { label: "Top Conversion", name: "Omar F.",    value: "38.4%" },
];

const MISSING_UI = [
  { title: "Revenue Opportunity Center", icon: Coins,     tone: "var(--success)" },
  { title: "Business Expansion Center",  icon: TrendingUp,tone: "var(--primary)" },
  { title: "Territory Growth Center",    icon: MapPinned, tone: "var(--info)" },
  { title: "Referral Center",            icon: Gift,      tone: "var(--ai)" },
  { title: "Upsell Center",              icon: ArrowUpRight, tone: "var(--market)" },
  { title: "Cross Sell Center",          icon: Repeat,    tone: "var(--warning)" },
  { title: "Partner Center",             icon: Building2, tone: "var(--primary)" },
  { title: "Sub Reseller Center",        icon: Users2,    tone: "var(--info)" },
];

const DAILY_FLOW = [
  { kicker: "WHAT TO DO TODAY",      items: ["Follow up · Acme Corp demo", "Send proposal · BluePeak", "Call · Nimbus renewal"], tone: "var(--primary)", icon: Target },
  { kicker: "WHAT IS PENDING",       items: ["3 proposals awaiting signature", "2 license approvals", "5 KYC docs review"], tone: "var(--warning)", icon: Clock },
  { kicker: "WHAT IS AT RISK",       items: ["Helios renewal · 4 days", "Vertex churn risk · health 38", "Atlas demo no-show"], tone: "var(--danger)", icon: AlertTriangle },
  { kicker: "WHAT GENERATES REVENUE",items: ["Upsell · Orion → Enterprise ($12k)", "Renewal · Solis Co ($8.4k)", "New lead · Kestrel ($24k)"], tone: "var(--success)", icon: Coins },
  { kicker: "WHAT NEEDS FOLLOWUP",   items: ["Cold lead · Mira (7d)", "Trial expired · Lume (3d)", "Demo replay · Sable"], tone: "var(--info)", icon: Activity },
];

const CEO_SUMMARY = [
  { label: "Revenue Today",       value: "$4,820",   tone: "primary" as const },
  { label: "Revenue This Month",  value: "$62.4k",   tone: "success" as const },
  { label: "Expected Revenue",    value: "$118k",    tone: "ai" as const },
  { label: "Lost Revenue",        value: "$9.2k",    tone: "danger" as const },
  { label: "Renewal Revenue",     value: "$28.7k",   tone: "market" as const },
  { label: "Opportunity Revenue", value: "$184k",    tone: "info" as const },
];

const ROADMAP = [
  { k: "Current Rank",           v: "Gold Reseller" },
  { k: "Next Rank",              v: "Platinum Reseller" },
  { k: "Required Revenue",       v: "$100k · 62% complete" },
  { k: "Required Customers",     v: "300 · 284 done" },
  { k: "Required Renewals",      v: "120 · 78 done" },
  { k: "Required Training",      v: "8 modules · 5 done" },
  { k: "Required Certifications",v: "3 of 6 unlocked" },
];

const CERTIFICATIONS = [
  { name: "Certified Sales Expert",        unlocked: true  },
  { name: "Certified Product Expert",      unlocked: true  },
  { name: "Certified Demo Expert",         unlocked: true  },
  { name: "Certified Renewal Expert",      unlocked: false },
  { name: "Certified Territory Manager",   unlocked: false },
  { name: "Certified Franchise Candidate", unlocked: false },
];

const ULTIMATE_FLOW = [
  "Lead","Demo","Proposal","Quotation","Approval","Order","Payment","License","Activation",
  "Customer","Support","Renewal","Upgrade","Referral","Commission","Revenue","Expansion","Franchise",
];

/* ----------------- UI ----------------- */

function VerticalPath({ steps, currentIndex, accent = "var(--primary)" }: { steps: string[]; currentIndex: number; accent?: string }) {
  return (
    <ol className="relative space-y-1">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[10px] font-mono ${
                done ? "border-success/50 bg-success/10 text-success"
                : current ? "border-primary text-primary"
                : "border-border/60 text-muted-foreground"
              }`}
              style={current ? { boxShadow: `0 0 16px ${accent}55`, background: `${accent}18` } : undefined}
            >
              {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={`text-[12.5px] ${current ? "font-semibold text-foreground" : done ? "text-muted-foreground line-through" : "text-foreground/80"}`}>
              {s}
            </span>
            {current && <span className="ml-auto rounded border border-primary/40 bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">You are here</span>}
          </li>
        );
      })}
    </ol>
  );
}

function ResellerEmpire() {
  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-5 p-6">
        <PageHeader
          eyebrow="MODULE · RESELLER EMPIRE · CAREER · AWARDS · BUSINESS PATH"
          title="From Reseller → Software Empire"
          subtitle="Every page must show: what happened, what is happening, what is blocked, what is at risk, what generates revenue, what to do next."
        />

        {/* CEO SUMMARY */}
        <div>
          <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">CEO Summary Panel</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {CEO_SUMMARY.map((m) => <Metric key={m.label} label={m.label} value={m.value} tone={m.tone} />)}
          </div>
        </div>

        {/* DAILY FLOW */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {DAILY_FLOW.map((b) => {
            const Icon = b.icon;
            return (
              <Panel key={b.kicker} kicker={b.kicker} title="">
                <ul className="space-y-1.5">
                  {b.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 rounded-md border border-border/60 bg-surface-2/40 px-2 py-1.5 text-[12px]">
                      <Icon className="mt-[2px] h-3.5 w-3.5 shrink-0" style={{ color: b.tone }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            );
          })}
        </div>

        {/* CAREER + EXPANSION side by side */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,1fr,1fr]">
          <Panel kicker="RESELLER CAREER JOURNEY" title="15 ranks · Applicant → Franchise Owner">
            <VerticalPath steps={CAREER} currentIndex={CURRENT_RANK_INDEX} />
          </Panel>

          <Panel kicker="BUSINESS PLAN · 12 STAGES" title="The reseller revenue machine">
            <VerticalPath steps={BUSINESS_STAGES} currentIndex={CURRENT_STAGE} accent="var(--success)" />
          </Panel>

          <Panel kicker="EXPANSION PLAN" title="Solo → Franchise empire">
            <VerticalPath steps={EXPANSION} currentIndex={3} accent="var(--ai)" />
          </Panel>
        </div>

        {/* REVENUE AWARDS */}
        <Panel kicker="REVENUE AWARDS" title={`$${CURRENT_REVENUE.toLocaleString()} earned · Next: Platinum`}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {REVENUE_AWARDS.map((a) => {
              const unlocked = CURRENT_REVENUE >= a.amount;
              const pct = Math.min(100, (CURRENT_REVENUE / a.amount) * 100);
              return (
                <div
                  key={a.tier}
                  className={`rounded-lg border p-3 ${unlocked ? "border-border bg-surface-2/60" : "border-border/40 bg-surface/40 opacity-70 grayscale"}`}
                  style={unlocked ? { boxShadow: `0 0 22px ${a.tone}33` } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{a.icon}</span>
                    {unlocked
                      ? <span className="rounded border border-success/40 bg-success/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-success">Unlocked</span>
                      : <span className="font-mono text-[10px] text-muted-foreground">{Math.round(pct)}%</span>}
                  </div>
                  <div className="mt-2 text-[12px] font-semibold" style={{ color: a.tone }}>{a.tier}</div>
                  <div className="font-mono text-[10px] text-muted-foreground">${a.amount.toLocaleString()}</div>
                  {!unlocked && (
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                      <div className="h-full" style={{ width: `${pct}%`, background: a.tone }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Panel>

        {/* FIRSTS + TROPHIES */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel kicker="ACHIEVEMENT SYSTEM" title="Your firsts">
            <div className="grid grid-cols-3 gap-2">
              {FIRSTS.map((f, i) => {
                const done = i < 5;
                return (
                  <div key={f} className={`flex items-center gap-2 rounded-md border p-2 text-[12px] ${done ? "border-success/40 bg-success/8" : "border-border/60 bg-surface-2/40"}`}>
                    {done ? <BadgeCheck className="h-4 w-4 text-success" /> : <Star className="h-4 w-4 text-muted-foreground" />}
                    <span className={done ? "text-foreground" : "text-muted-foreground"}>{f}</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <Panel kicker="SPECIAL TROPHIES" title="Champion legacy">
            <div className="grid grid-cols-2 gap-2">
              {TROPHIES.map((t, i) => {
                const got = i < 4;
                return (
                  <div key={t} className={`flex items-center gap-2 rounded-md border p-2 text-[12px] ${got ? "border-warning/40 bg-warning/8" : "border-border/60 bg-surface-2/40 opacity-70"}`}>
                    <Trophy className={`h-4 w-4 ${got ? "text-warning" : "text-muted-foreground"}`} />
                    <span>{t}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>

        {/* SCORE ENGINE */}
        <Panel kicker="RESELLER SCORE ENGINE" title="8-dimension performance index · Total: 78.4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
            {SCORES.map((s) => (
              <div key={s.label} className="rounded-md border border-border/60 bg-surface-2/40 p-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{s.label}</div>
                <div className="mt-1 text-[20px] font-semibold" style={{ color: s.tone }}>{s.value}</div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface">
                  <div className="h-full" style={{ width: `${s.value}%`, background: s.tone }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* CHAMPION WALL */}
        <Panel kicker="CHAMPION WALL" title="Top performers · this quarter">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {CHAMPION_WALL.map((c) => (
              <div key={c.label} className="rounded-md border border-border/60 bg-surface-2/40 p-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-warning" />
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.label}</div>
                </div>
                <div className="mt-1 text-[13px] font-semibold">{c.name}</div>
                <div className="font-mono text-[11px] text-primary">{c.value}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* MISSING UI CENTERS */}
        <Panel kicker="MISSING UI · GROWTH CENTERS" title="Every revenue surface, one click away">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            {MISSING_UI.map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.title}
                  className="group rounded-lg border border-border/60 bg-surface-2/40 p-3 text-left transition hover:scale-[1.02] hover:border-primary/50"
                  style={{ boxShadow: `0 0 0 transparent` }}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-md" style={{ background: `${m.tone}18`, color: m.tone }}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="mt-2 text-[12.5px] font-medium leading-tight">{m.title}</div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground group-hover:text-primary">Open →</div>
                </button>
              );
            })}
          </div>
        </Panel>

        {/* ROADMAP + CERTIFICATIONS */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr,1fr]">
          <Panel kicker="RESELLER ROADMAP" title="Path to Platinum">
            <ul className="space-y-1.5">
              {ROADMAP.map((r) => (
                <li key={r.k} className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-surface-2/40 px-3 py-2 text-[12.5px]">
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">{r.k}</span>
                  <span className="font-medium text-foreground">{r.v}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel kicker="CERTIFICATION CENTER" title="Unlock to rank up">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {CERTIFICATIONS.map((c) => (
                <div key={c.name} className={`flex items-center gap-2 rounded-md border p-2.5 ${c.unlocked ? "border-ai/40 bg-ai/8" : "border-border/60 bg-surface-2/40 opacity-70"}`}>
                  <GraduationCap className={`h-4 w-4 ${c.unlocked ? "text-ai" : "text-muted-foreground"}`} />
                  <span className="flex-1 text-[12.5px]">{c.name}</span>
                  <span className={`font-mono text-[9px] uppercase tracking-wider ${c.unlocked ? "text-ai" : "text-muted-foreground"}`}>
                    {c.unlocked ? "Earned" : "Locked"}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ULTIMATE FLOW horizontal */}
        <Panel kicker="ULTIMATE FLOW" title="Lead → Franchise · the empire pipeline">
          <div className="flex flex-wrap items-center gap-1.5">
            {ULTIMATE_FLOW.map((s, i) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="rounded-md border border-border/70 bg-surface-2/60 px-2 py-1 font-mono text-[10.5px] uppercase tracking-wider">
                  {s}
                </span>
                {i < ULTIMATE_FLOW.length - 1 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
        </Panel>

        {/* ENDGAME */}
        <Panel kicker="END GAME" title="">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-surface-2/40 p-5">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Day one</div>
              <div className="mt-1 text-[18px] font-semibold text-glow">"I started as a reseller."</div>
            </div>
            <div className="rounded-lg border border-primary/40 bg-primary/8 p-5" style={{ boxShadow: "0 0 32px hsl(var(--primary) / 0.2)" }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">Endgame</div>
              <div className="mt-1 text-[18px] font-semibold text-primary text-glow">"I built a software empire."</div>
              <div className="mt-2 text-[11px] text-muted-foreground">Without ever leaving Software Vala Nexus.</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
