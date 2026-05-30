import ReactCountryFlag from "react-country-flag";
import { Trophy, Target, TrendingUp, Users2, DollarSign, Briefcase, Award } from "lucide-react";
import type { Rank } from "@/lib/gamification";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Good night";
}

function festival(): string | null {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (m === 12 && day >= 22) return "Happy Holidays";
  if (m === 1  && day <= 5)  return "Happy New Year";
  if (m === 10 && day >= 24 && day <= 31) return "Happy Diwali";
  if ([0, 6].includes(d.getDay())) return "Weekend Push";
  return null;
}

export function HeroPanel({
  country,
  user,
  rank,
  level,
  commission,
  revenue,
  leads,
  customers,
  target,
}: {
  country: { code: string; name: string };
  user: string;
  rank: Rank;
  level: number;
  commission: number;
  revenue: number;
  leads: number;
  customers: number;
  target: number;
}) {
  const achievement = Math.min(100, Math.round((revenue / target) * 100));
  const fest = festival();

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-2 via-surface to-surface-2 p-5">
      {/* glow */}
      <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-25 blur-3xl"
        style={{ background: rank.color }} />
      <div aria-hidden className="grid-bg-fine pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative flex flex-wrap items-start gap-5">
        {/* Flag block */}
        <div className="relative grid h-20 w-28 place-items-center overflow-hidden rounded-lg border border-border bg-background/40 shadow-lg">
          <ReactCountryFlag countryCode={country.code} svg style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Greeting + rank */}
        <div className="min-w-0 flex-1">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {country.name} · Reseller Command Center
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            {greeting()}, {user}.
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            <span className="rounded-full border px-2 py-0.5 font-mono uppercase tracking-wider"
              style={{ borderColor: `${rank.color}55`, color: rank.color, background: `${rank.color}10` }}>
              {rank.badge} · {rank.label}
            </span>
            <span>Level {level}</span>
            {fest && (
              <span className="rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono uppercase tracking-wider text-warning">
                {fest}
              </span>
            )}
          </div>
        </div>

        {/* Achievement ring */}
        <div className="flex items-center gap-3">
          <RingPct value={achievement} />
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Target progress</div>
            <div className="text-lg font-semibold">${(revenue/1000).toFixed(1)}K <span className="text-muted-foreground text-[12px]">/ ${(target/1000).toFixed(0)}K</span></div>
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KPI icon={<DollarSign className="h-3.5 w-3.5" />} label="Commission"  value={`$${commission.toLocaleString()}`} tone="var(--success)" />
        <KPI icon={<TrendingUp className="h-3.5 w-3.5" />} label="Revenue"     value={`$${(revenue/1000).toFixed(1)}K`} tone="var(--market)" />
        <KPI icon={<Target className="h-3.5 w-3.5" />}     label="Leads"       value={leads.toLocaleString()} tone="var(--info)" />
        <KPI icon={<Users2 className="h-3.5 w-3.5" />}     label="Customers"   value={customers.toLocaleString()} tone="var(--ai)" />
        <KPI icon={<Briefcase className="h-3.5 w-3.5" />}  label="Target"      value={`$${(target/1000).toFixed(0)}K`} tone="var(--warning)" />
        <KPI icon={<Trophy className="h-3.5 w-3.5" />}     label="Achievement" value={`${achievement}%`} tone="var(--success)" />
      </div>
    </div>
  );
}

function KPI({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/40 p-2.5">
      <div className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
        <span style={{ color: tone }}>{icon}</span>{label}
      </div>
      <div className="mt-1 text-[15px] font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function RingPct({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" className="-rotate-90">
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
      <circle cx="34" cy="34" r={r} fill="none" stroke="var(--success)" strokeWidth="6"
        strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
      <text x="34" y="38" textAnchor="middle" className="rotate-90 fill-foreground font-mono"
        style={{ transformOrigin: "34px 34px", fontSize: 13, fontWeight: 600 }}>
        {value}%
      </text>
    </svg>
  );
}
