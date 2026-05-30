// AEGIS · Reseller Gamification Engine
// Rank ladder, XP/level curve, points actions, badge + trophy + achievement catalog.
// State persists in localStorage so the demo feels continuous; swap to a DB-backed
// `mod_reseller_xp` table later by replacing useGameState's load/save.

import { useCallback, useEffect, useMemo, useState } from "react";

export type RankKey =
  | "starter" | "bronze" | "silver" | "gold" | "platinum"
  | "diamond" | "titan" | "legend" | "champion" | "global_champion"
  | "elite" | "grandmaster" | "emperor";

export type Rank = {
  key: RankKey;
  label: string;
  minLevel: number;
  color: string;     // CSS var or hex
  glow: string;
  badge: string;     // short code on the chip
};

export const RANKS: Rank[] = [
  { key: "starter",         label: "Starter",         minLevel: 1,   color: "var(--muted-foreground)", glow: "var(--muted)",       badge: "ST" },
  { key: "bronze",          label: "Bronze Warrior",  minLevel: 5,   color: "#cd7f32",                  glow: "#cd7f3266",          badge: "BR" },
  { key: "silver",          label: "Silver Warrior",  minLevel: 10,  color: "#c0c0c0",                  glow: "#c0c0c066",          badge: "SI" },
  { key: "gold",            label: "Gold Warrior",    minLevel: 20,  color: "#ffd54a",                  glow: "#ffd54a66",          badge: "GO" },
  { key: "platinum",        label: "Platinum Warrior",minLevel: 30,  color: "#e5e4e2",                  glow: "#e5e4e266",          badge: "PT" },
  { key: "diamond",         label: "Diamond Warrior", minLevel: 40,  color: "#b9f2ff",                  glow: "#b9f2ff66",          badge: "DM" },
  { key: "titan",           label: "Titan Warrior",   minLevel: 50,  color: "var(--info)",              glow: "var(--info)",        badge: "TI" },
  { key: "legend",          label: "Legend",          minLevel: 75,  color: "var(--ai)",                glow: "var(--ai)",          badge: "LG" },
  { key: "champion",        label: "Champion",        minLevel: 100, color: "var(--market)",            glow: "var(--market)",      badge: "CH" },
  { key: "global_champion", label: "Global Champion", minLevel: 150, color: "var(--success)",           glow: "var(--success)",     badge: "GC" },
  { key: "elite",           label: "Vala Elite",      minLevel: 200, color: "#f0d78c",                  glow: "#f0d78c80",          badge: "EL" },
  { key: "grandmaster",     label: "Nexus Grandmaster",minLevel: 300,color: "#ff5d8f",                  glow: "#ff5d8f80",          badge: "GM" },
  { key: "emperor",         label: "Nexus Emperor",   minLevel: 500, color: "#ff2d75",                  glow: "#ff2d7588",          badge: "EM" },
];

export function rankForLevel(level: number): Rank {
  let r = RANKS[0];
  for (const cand of RANKS) if (level >= cand.minLevel) r = cand;
  return r;
}
export function nextRank(level: number): Rank | null {
  return RANKS.find((r) => r.minLevel > level) ?? null;
}

/** XP curve: level N requires 100 * N^1.35 XP to reach. */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.35));
}
export function levelFromXp(xp: number): { level: number; xpInLevel: number; xpForNext: number } {
  let level = 1;
  let remaining = xp;
  // walk forward; capped at 999 to avoid infinite loop in absurd cases
  while (level < 999) {
    const need = xpForLevel(level);
    if (remaining < need) return { level, xpInLevel: remaining, xpForNext: need };
    remaining -= need;
    level += 1;
  }
  return { level, xpInLevel: 0, xpForNext: xpForLevel(level) };
}

// ─── Point actions ──────────────────────────────────────────────────────────
export type ActionKey =
  | "lead_created" | "lead_converted" | "sale_closed" | "renewal"
  | "support_solved" | "positive_review" | "referral" | "achievement";

export const ACTIONS: Record<ActionKey, { label: string; xp: number; icon: string; tone: string }> = {
  lead_created:    { label: "Lead Created",        xp: 5,  icon: "🎯", tone: "var(--info)" },
  lead_converted:  { label: "Lead Converted",      xp: 20, icon: "⚡", tone: "var(--ai)" },
  sale_closed:     { label: "Sale Closed",         xp: 50, icon: "💎", tone: "var(--success)" },
  renewal:         { label: "Renewal Success",     xp: 25, icon: "🔄", tone: "var(--market)" },
  support_solved:  { label: "Support Solved",      xp: 10, icon: "🛟", tone: "var(--info)" },
  positive_review: { label: "Positive Review",     xp: 15, icon: "⭐", tone: "var(--warning)" },
  referral:        { label: "Referral",            xp: 30, icon: "🤝", tone: "var(--ai)" },
  achievement:     { label: "Achievement Completed", xp: 40, icon: "🏆", tone: "var(--success)" },
};

// ─── Trophies (15) ──────────────────────────────────────────────────────────
export type Trophy = { id: string; label: string; req: number; icon: string; tone: string };
export const TROPHIES: Trophy[] = [
  { id: "revenue",    label: "Revenue Trophy",       req: 500,   icon: "💰", tone: "var(--success)" },
  { id: "sales",      label: "Sales Trophy",         req: 800,   icon: "📈", tone: "var(--ai)" },
  { id: "commission", label: "Commission Trophy",    req: 1200,  icon: "💸", tone: "var(--market)" },
  { id: "lead",       label: "Lead Trophy",          req: 1500,  icon: "🎯", tone: "var(--info)" },
  { id: "support",    label: "Support Trophy",       req: 2000,  icon: "🛟", tone: "var(--info)" },
  { id: "growth",     label: "Growth Trophy",        req: 3000,  icon: "🚀", tone: "var(--ai)" },
  { id: "renewal",    label: "Renewal Trophy",       req: 4000,  icon: "🔄", tone: "var(--market)" },
  { id: "customer",   label: "Customer Trophy",      req: 5500,  icon: "👥", tone: "var(--success)" },
  { id: "perf",       label: "Performance Trophy",   req: 7500,  icon: "⚡", tone: "var(--warning)" },
  { id: "innovation", label: "Innovation Trophy",    req: 10000, icon: "💡", tone: "var(--ai)" },
  { id: "leadership", label: "Leadership Trophy",    req: 15000, icon: "👑", tone: "var(--market)" },
  { id: "global",     label: "Global Trophy",        req: 20000, icon: "🌐", tone: "var(--info)" },
  { id: "country",    label: "Country Trophy",       req: 30000, icon: "🏳️", tone: "var(--success)" },
  { id: "continent",  label: "Continent Trophy",     req: 50000, icon: "🌍", tone: "var(--ai)" },
  { id: "lifetime",   label: "Lifetime Achievement", req: 100000,icon: "♛",  tone: "var(--market)" },
];

// ─── Badges (8) ─────────────────────────────────────────────────────────────
export type Badge = { id: string; label: string; minLevel: number; icon: string; tone: string };
export const BADGES: Badge[] = [
  { id: "premium",   label: "Premium",   minLevel: 1,   icon: "◆", tone: "var(--primary)" },
  { id: "verified",  label: "Verified",  minLevel: 10,  icon: "✓", tone: "var(--success)" },
  { id: "champion",  label: "Champion",  minLevel: 50,  icon: "★", tone: "var(--warning)" },
  { id: "elite",     label: "Elite",     minLevel: 75,  icon: "❖", tone: "var(--ai)" },
  { id: "founder",   label: "Founder",   minLevel: 100, icon: "✦", tone: "var(--market)" },
  { id: "legend",    label: "Legend",    minLevel: 125, icon: "♛", tone: "var(--ai)" },
  { id: "global",    label: "Global",    minLevel: 150, icon: "⬢", tone: "var(--info)" },
  { id: "crown",     label: "Crown",     minLevel: 200, icon: "♚", tone: "var(--market)" },
];

// ─── Award showcase (top performer entries) ────────────────────────────────
export const AWARDS = [
  { id: "day",    label: "Top Reseller of Day",    holder: "nordic_partners", value: "$18,420", tone: "var(--success)" },
  { id: "week",   label: "Top Reseller of Week",   holder: "apex_channel",    value: "$94,210", tone: "var(--ai)" },
  { id: "month",  label: "Top Reseller of Month",  holder: "nordic_partners", value: "$418,210",tone: "var(--market)" },
  { id: "year",   label: "Top Reseller of Year",   holder: "nordic_partners", value: "$4.2M",   tone: "var(--warning)" },
  { id: "growth", label: "Fastest Growing",        holder: "saffron_in",      value: "+412% MoM",tone: "var(--info)" },
  { id: "rev",    label: "Highest Revenue Gen.",   holder: "apex_channel",    value: "$284K",   tone: "var(--success)" },
  { id: "conv",   label: "Highest Conversion",     holder: "aurora_apac",     value: "38.4%",   tone: "var(--ai)" },
  { id: "cs",     label: "Best Customer Success",  holder: "helios_eu",       value: "98 NPS",  tone: "var(--info)" },
  { id: "renew",  label: "Best Renewal Champion",  holder: "zenith_jp",       value: "96% rate",tone: "var(--market)" },
  { id: "global", label: "Global Champion Partner",holder: "nordic_partners", value: "Q3 '26",  tone: "var(--success)" },
];

// ─── Challenges ─────────────────────────────────────────────────────────────
export type Challenge = { id: string; period: "daily" | "weekly" | "monthly"; label: string; goal: number; progress: number; reward: number; unit: string };
export const CHALLENGES: Challenge[] = [
  { id: "d1", period: "daily",   label: "Close 3 sales today",         goal: 3,   progress: 1,   reward: 150, unit: "sales" },
  { id: "d2", period: "daily",   label: "Add 10 new leads",            goal: 10,  progress: 6,   reward: 100, unit: "leads" },
  { id: "d3", period: "daily",   label: "Resolve 5 support tickets",   goal: 5,   progress: 3,   reward: 75,  unit: "tickets" },
  { id: "w1", period: "weekly",  label: "Hit $25K in commission",      goal: 25000,progress: 18420,reward:500,unit: "USD" },
  { id: "w2", period: "weekly",  label: "Onboard 12 customers",        goal: 12,  progress: 8,   reward: 400, unit: "customers" },
  { id: "m1", period: "monthly", label: "Reach $200K revenue",         goal: 200000,progress:148210,reward:2000,unit: "USD" },
  { id: "m2", period: "monthly", label: "Earn 4,000 XP",               goal: 4000,progress: 1840,reward: 1500,unit: "XP" },
];

// ─── Persistent gamification state (localStorage v1) ───────────────────────
type GameState = {
  xp: number;
  totalEarned: number;       // for trophy unlocks (uses commission $)
  recentActions: { ts: number; key: ActionKey; xp: number }[];
};

const STORAGE_KEY = "aegis.reseller.gamestate.v1";

function loadState(): GameState {
  if (typeof window === "undefined") return { xp: 0, totalEarned: 0, recentActions: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* noop */ }
  // Realistic starting state so the demo isn't level 1
  return { xp: 5840, totalEarned: 18420, recentActions: [] };
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState());

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* noop */ }
  }, [state]);

  const award = useCallback((key: ActionKey, earnedUSD = 0) => {
    const def = ACTIONS[key];
    setState((s) => ({
      xp: s.xp + def.xp,
      totalEarned: s.totalEarned + earnedUSD,
      recentActions: [{ ts: Date.now(), key, xp: def.xp }, ...s.recentActions].slice(0, 30),
    }));
    return def.xp;
  }, []);

  const derived = useMemo(() => {
    const { level, xpInLevel, xpForNext } = levelFromXp(state.xp);
    const rank = rankForLevel(level);
    const next = nextRank(level);
    const progressPct = Math.min(100, (xpInLevel / xpForNext) * 100);
    return { level, xpInLevel, xpForNext, rank, next, progressPct };
  }, [state.xp]);

  return { state, award, ...derived };
}

// ─── Locked-content thresholds ─────────────────────────────────────────────
export const UNLOCK_TIERS = [
  { xp: 100,    label: "Personal Coach"            },
  { xp: 500,    label: "Trophy Room access"        },
  { xp: 1000,   label: "Country leaderboard"       },
  { xp: 5000,   label: "Continent leaderboard"     },
  { xp: 10000,  label: "Premium reward catalog"    },
  { xp: 50000,  label: "Champion concierge"        },
  { xp: 100000, label: "Sovereign founder vault"   },
];

// ─── Countries (sample) ────────────────────────────────────────────────────
export const COUNTRIES: { code: string; name: string }[] = [
  { code: "IN", name: "India" }, { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" }, { code: "DE", name: "Germany" },
  { code: "FR", name: "France" }, { code: "JP", name: "Japan" },
  { code: "SG", name: "Singapore" }, { code: "AE", name: "UAE" },
  { code: "BR", name: "Brazil" }, { code: "SE", name: "Sweden" },
];
