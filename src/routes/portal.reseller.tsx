import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, Suspense } from "react";
import confetti from "canvas-confetti";
import { PageHeader } from "@/components/dash/primitives";
import { Ambassador, type AmbassadorState } from "@/components/ambassador/Ambassador";
import { HeroPanel } from "@/components/reseller/HeroPanel";
import { XPBar } from "@/components/reseller/XPBar";
import { TrophyRoom } from "@/components/reseller/TrophyRoom";
import { AchievementWall } from "@/components/reseller/AchievementWall";
import { ChallengeBoard } from "@/components/reseller/ChallengeBoard";
import { Leaderboard } from "@/components/reseller/Leaderboard";
import { StatGrid } from "@/components/reseller/StatGrid";
import { PointsTicker, usePointsTicker, useUnlockedSound } from "@/components/reseller/PointsTicker";
import { useGameState, COUNTRIES, ACTIONS, type ActionKey } from "@/lib/gamification";

export const Route = createFileRoute("/portal/reseller")({
  head: () => ({ meta: [{ title: "Reseller Command Center · AEGIS OS" }] }),
  component: ResellerCommandCenter,
});

function ResellerCommandCenter() {
  const game = useGameState();
  const ticker = usePointsTicker();
  const [ambassadorState, setAmbassadorState] = useState<AmbassadorState>("success");
  const [lastLevel, setLastLevel] = useState(game.level);
  const country = COUNTRIES[0]; // India · could be derived from profile

  useUnlockedSound(ticker.toasts[ticker.toasts.length - 1]?.id ?? null);

  // Detect level-up → celebrate + confetti
  useEffect(() => {
    if (game.level > lastLevel) {
      setAmbassadorState("celebrate");
      confetti({ particleCount: 140, spread: 70, origin: { y: 0.3 }, colors: ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"] });
      const t = setTimeout(() => setAmbassadorState("success"), 4000);
      setLastLevel(game.level);
      return () => clearTimeout(t);
    }
  }, [game.level, lastLevel]);

  const handleAward = (k: ActionKey) => {
    const usdMap: Partial<Record<ActionKey, number>> = { sale_closed: 1200, renewal: 540, lead_converted: 320, referral: 800 };
    game.award(k, usdMap[k] ?? 0);
    ticker.push(k);
    if (k === "sale_closed" || k === "achievement") {
      setAmbassadorState("celebrate");
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ["#10B981", "#F59E0B"] });
      setTimeout(() => setAmbassadorState("success"), 2500);
    }
  };

  return (
    <div className="relative">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative space-y-5 p-6">
        <PageHeader
          eyebrow="MODULE · 096 · RESELLER COMMAND CENTER"
          title="Reseller Command Center"
          subtitle="AWS Partner Portal × HubSpot × Salesforce × LinkedIn Premium — Software Vala Nexus OS."
        />

        {/* Ambassador + Hero side-by-side */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[420px,1fr]">
          <Ambassador state={ambassadorState} />
          <HeroPanel
            country={country}
            user="Boss"
            rank={game.rank}
            level={game.level}
            commission={Math.round(game.state.totalEarned * 0.22)}
            revenue={Math.round(game.state.totalEarned)}
            leads={1284}
            customers={284}
            target={250000}
          />
        </div>

        <StatGrid />

        <XPBar
          level={game.level}
          xpInLevel={game.xpInLevel}
          xpForNext={game.xpForNext}
          rank={game.rank}
          next={game.next}
          progressPct={game.progressPct}
          onAward={handleAward}
        />

        <ChallengeBoard />

        <AchievementWall level={game.level} xp={game.state.xp} />

        <TrophyRoom totalEarned={game.state.totalEarned} />

        <Suspense fallback={<div className="rounded-xl border border-border bg-surface-2/40 p-6 text-center text-sm text-muted-foreground">Loading leaderboard…</div>}>
          <Leaderboard />
        </Suspense>

        {/* Recent points feed */}
        {game.state.recentActions.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-2/40 p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Recent points</div>
            <div className="flex flex-wrap gap-1.5">
              {game.state.recentActions.slice(0, 12).map((a, i) => {
                const def = ACTIONS[a.key];
                return (
                  <span key={i} className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/40 px-2 py-1 text-[11px]">
                    <span>{def.icon}</span>
                    <span className="text-muted-foreground">{def.label}</span>
                    <span className="font-mono" style={{ color: def.tone }}>+{a.xp}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <PointsTicker toasts={ticker.toasts} />
      </div>
    </div>
  );
}
