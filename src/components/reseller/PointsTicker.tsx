import { useEffect, useState } from "react";
import { ACTIONS, type ActionKey } from "@/lib/gamification";

type Toast = { id: number; key: ActionKey };
let counter = 0;

export function usePointsTicker() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (key: ActionKey) => {
    const id = ++counter;
    setToasts((t) => [...t, { id, key }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200);
  };
  return { toasts, push };
}

export function PointsTicker({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => {
        const a = ACTIONS[t.key];
        return (
          <div key={t.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-background/95 px-3 py-2 font-mono text-[12px] shadow-xl backdrop-blur animate-[ticker_2.2s_ease-out_forwards]"
            style={{ borderColor: `${a.tone}66`, boxShadow: `0 0 24px ${a.tone}44` }}
          >
            <span className="text-base">{a.icon}</span>
            <span className="text-foreground">{a.label}</span>
            <span style={{ color: a.tone }}>+{a.xp} XP</span>
          </div>
        );
      })}
      <style>{`
        @keyframes ticker {
          0%   { opacity: 0; transform: translateY(20px) scale(0.95); }
          15%  { opacity: 1; transform: translateY(0)   scale(1); }
          85%  { opacity: 1; transform: translateY(0)   scale(1); }
          100% { opacity: 0; transform: translateY(-12px) scale(0.98); }
        }
      `}</style>
    </div>
  );
}

export function useUnlockedSound(deps: unknown) {
  // Subtle audio cue using WebAudio so we don't need an asset file.
  useEffect(() => {
    if (deps === null || deps === undefined) return;
    try {
      const Ctx = (window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!Ctx) return;
      const ctx = new Ctx();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine"; o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      o.start(); o.stop(ctx.currentTime + 0.28);
      setTimeout(() => ctx.close(), 400);
    } catch { /* noop */ }
  }, [deps]);
}
