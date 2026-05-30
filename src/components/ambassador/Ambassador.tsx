// AI Reseller Ambassador — Software Vala employee.
// SVG-based character (smooth, controllable, no asset hosting risk) with
// expression states. Pairs with browser TTS via `@/lib/voice`. Slot is
// designed to accept a Lottie animation later by swapping <CharacterSVG/>
// for <Lottie animationData={...} />.

import { useEffect, useRef, useState } from "react";
import { speak, stopSpeaking, voiceAvailable } from "@/lib/voice";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

export type AmbassadorState =
  | "idle" | "typing" | "thinking"
  | "success" | "fail" | "locked" | "error"
  | "celebrate";

const LINES: Record<AmbassadorState, string[]> = {
  idle:      ["Welcome to Software Vala Nexus OS.", "Your command deck is ready, boss.", "Standing by for orders."],
  typing:    ["Your credentials are private and secure.", "Eyes covered. Type freely."],
  thinking:  ["Crunching the numbers…", "Analyzing your pipeline…"],
  success:   ["Welcome back, boss.", "Your workspace is ready.", "Glad to see you. Let's ship today."],
  fail:      ["Sorry boss, login failed.", "Please verify your credentials and try again."],
  locked:    ["Your account is temporarily locked.", "Please contact administrator."],
  error:     ["Our systems are busy right now.", "Please try again shortly."],
  celebrate: ["Massive close, boss!", "Commission unlocked. Keep firing.", "Legendary move."],
};

export function Ambassador({
  state = "idle",
  name = "Vala",
  title = "AI Reseller Ambassador",
  empId = "SV-001-VALA",
  className,
  compact = false,
}: {
  state?: AmbassadorState;
  name?: string;
  title?: string;
  empId?: string;
  className?: string;
  compact?: boolean;
}) {
  const [muted, setMuted] = useState(true); // start muted; user must enable
  const [dialogue, setDialogue] = useState<string>(LINES[state][0]);
  const lastStateRef = useRef<AmbassadorState>(state);

  // Rotate dialogue when state changes
  useEffect(() => {
    const pool = LINES[state];
    const line = pool[Math.floor(Math.random() * pool.length)];
    setDialogue(line);
    if (!muted && lastStateRef.current !== state) speak(line);
    lastStateRef.current = state;
    return () => { /* keep speaking */ };
  }, [state, muted]);

  // Cleanup voice on unmount
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-2/80 to-surface/40 backdrop-blur",
      compact ? "p-3" : "p-4",
      className,
    )}>
      {/* glow ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
        style={{ background: state === "fail" || state === "error" ? "var(--danger)" : state === "celebrate" || state === "success" ? "var(--success)" : "var(--ai)" }}
      />

      <div className="relative flex items-start gap-3">
        <CharacterSVG state={state} size={compact ? 76 : 96} />

        <div className="min-w-0 flex-1">
          {/* Employee card header */}
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            <span>SOFTWARE · VALA</span>
            <span className="ml-auto">{empId}</span>
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-[15px] font-semibold tracking-tight">{name}</span>
            <span className="text-[11px] text-muted-foreground">· {title}</span>
          </div>

          {/* Dialogue bubble */}
          <div className="mt-2 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-[12.5px] leading-snug">
            {dialogue}
          </div>

          {/* Capability chips */}
          <div className="mt-2 flex flex-wrap gap-1 font-mono text-[9.5px] uppercase tracking-wider">
            <Cap>Online</Cap>
            <Cap>Voice</Cap>
            <Cap>125+ Languages</Cap>
            <Cap>Realtime</Cap>
            <Cap>Context Aware</Cap>
          </div>
        </div>

        {/* Voice toggle */}
        {voiceAvailable() && (
          <button
            onClick={() => {
              if (muted) { setMuted(false); speak(dialogue); }
              else       { setMuted(true);  stopSpeaking(); }
            }}
            className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:text-foreground"
            aria-label={muted ? "Enable voice" : "Mute voice"}
            title={muted ? "Enable voice" : "Mute voice"}
          >
            {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}

function Cap({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border/70 bg-surface/60 px-1.5 py-0.5 text-muted-foreground">
      {children}
    </span>
  );
}

/* ---------- SVG character ---------- */
function CharacterSVG({ state, size = 96 }: { state: AmbassadorState; size?: number }) {
  // Animation cues derived from state
  const eyesClosed   = state === "typing";
  const sad          = state === "fail" || state === "locked" || state === "error";
  const happy        = state === "success" || state === "celebrate";
  const blinking     = state === "idle" || state === "thinking";

  const skin = "#f5d6b5";
  const hair = "#1f2937";
  const suit = "#0f172a";
  const tie  = state === "celebrate" ? "var(--success)" : state === "fail" || state === "error" ? "var(--danger)" : "var(--primary)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {/* halo */}
      <div className="absolute inset-0 rounded-full opacity-40 blur-xl"
        style={{ background: happy ? "var(--success)" : sad ? "var(--danger)" : "var(--ai)" }}
      />
      <svg viewBox="0 0 120 120" width={size} height={size} className="relative">
        <defs>
          <radialGradient id="bg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="rgba(139,92,246,0.35)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0.0)" />
          </radialGradient>
          <linearGradient id="suit" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={suit} />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="58" fill="url(#bg)" />

        {/* shoulders / suit */}
        <path d="M20,118 C30,90 45,82 60,82 C75,82 90,90 100,118 Z" fill="url(#suit)" stroke="#0b1220" strokeWidth="1" />
        {/* tie */}
        <path d="M58,84 L62,84 L64,96 L60,108 L56,96 Z" fill={tie} />
        {/* lapels */}
        <path d="M48,90 L60,82 L72,90 L66,108 L54,108 Z" fill="none" stroke="#334155" strokeWidth="0.8" />
        {/* ID badge */}
        <rect x="36" y="96" width="14" height="9" rx="1.5" fill="#fef3c7" stroke="#1f2937" strokeWidth="0.5" />
        <line x1="40" y1="99" x2="46" y2="99" stroke="#1f2937" strokeWidth="0.6" />
        <line x1="40" y1="101.5" x2="48" y2="101.5" stroke="#94a3b8" strokeWidth="0.4" />

        {/* head */}
        <ellipse cx="60" cy="56" rx="22" ry="26" fill={skin} stroke="#0b1220" strokeWidth="1" />
        {/* hair */}
        <path d="M38,46 C40,28 52,22 60,22 C70,22 82,28 82,46 C76,40 70,38 60,38 C50,38 44,40 38,46 Z" fill={hair} />
        {/* ears */}
        <ellipse cx="38" cy="58" rx="3" ry="5" fill={skin} stroke="#0b1220" strokeWidth="0.5" />
        <ellipse cx="82" cy="58" rx="3" ry="5" fill={skin} stroke="#0b1220" strokeWidth="0.5" />

        {/* eyes — covered when typing */}
        {eyesClosed ? (
          <g>
            {/* hand-over-eyes */}
            <rect x="42" y="50" width="36" height="10" rx="4" fill={skin} stroke="#0b1220" strokeWidth="0.8" />
            <line x1="46" y1="55" x2="74" y2="55" stroke="#0b1220" strokeWidth="0.6" />
          </g>
        ) : (
          <>
            <g className={blinking ? "animate-[blink_4s_ease-in-out_infinite]" : ""}>
              <ellipse cx="51" cy="55" rx="3" ry="3.5" fill="#fff" />
              <ellipse cx="69" cy="55" rx="3" ry="3.5" fill="#fff" />
              <circle cx="51.5" cy="55.5" r="1.6" fill="#0b1220" />
              <circle cx="69.5" cy="55.5" r="1.6" fill="#0b1220" />
              <circle cx="52.2" cy="54.8" r="0.5" fill="#fff" />
              <circle cx="70.2" cy="54.8" r="0.5" fill="#fff" />
            </g>
            {/* sad brows */}
            {sad && (
              <>
                <path d="M46,49 L56,52" stroke="#0b1220" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M74,49 L64,52" stroke="#0b1220" strokeWidth="1.4" strokeLinecap="round" />
              </>
            )}
            {happy && (
              <>
                <path d="M46,49 Q51,46 56,49" stroke="#0b1220" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                <path d="M64,49 Q69,46 74,49" stroke="#0b1220" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </>
            )}
          </>
        )}

        {/* mouth */}
        {happy ? (
          <path d="M48,72 Q60,82 72,72" stroke="#7f1d1d" strokeWidth="1.6" fill="#7f1d1d" />
        ) : sad ? (
          <path d="M48,76 Q60,68 72,76" stroke="#7f1d1d" strokeWidth="1.6" fill="none" />
        ) : (
          <path d="M52,73 Q60,76 68,73" stroke="#7f1d1d" strokeWidth="1.4" fill="none" />
        )}

        {/* thumbs up for celebrate */}
        {state === "celebrate" && (
          <g transform="translate(86,76)">
            <rect x="-3" y="-6" width="6" height="10" rx="2" fill={skin} stroke="#0b1220" strokeWidth="0.6" />
            <circle cx="0" cy="-9" r="3" fill={skin} stroke="#0b1220" strokeWidth="0.6" />
          </g>
        )}

        {/* sparkles for success */}
        {happy && (
          <g className="origin-center animate-[twinkle_2s_ease-in-out_infinite]">
            <path d="M18,30 l2,4 l4,2 l-4,2 l-2,4 l-2,-4 l-4,-2 l4,-2 z" fill="var(--warning)" opacity="0.9" />
            <path d="M100,40 l1.5,3 l3,1.5 l-3,1.5 l-1.5,3 l-1.5,-3 l-3,-1.5 l3,-1.5 z" fill="var(--success)" opacity="0.85" />
          </g>
        )}
      </svg>

      <style>{`
        @keyframes blink { 0%, 93%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}
