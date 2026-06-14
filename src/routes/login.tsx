import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Mail, User, Phone, KeyRound, ShieldCheck, QrCode, Fingerprint, Eye, EyeOff,
  Sparkles, Mic, Languages, HelpCircle, ChevronRight, Cpu, Globe, Server,
  Lock, BadgeCheck, Radio, Briefcase, Brain, BarChart3, Search, Headphones,
  Network, Building2, Users, Package, Activity, Zap, Crown, Rocket, Bell,
} from "lucide-react";
import logoRound from "@/assets/sv-logo-round.asset.json";
import logoLong from "@/assets/sv-logo-long.asset.json";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Enter Nexus OS — Software Vala" },
      { name: "description", content: "Software Vala Nexus OS — enterprise login to the global software ecosystem." },
      { property: "og:title", content: "Software Vala Nexus OS" },
    ],
  }),
  component: LoginPage,
});

/* ───────────── AI State machine ───────────── */
type AIState =
  | "idle" | "greeting" | "typingUser" | "typingPass" | "wrongPass"
  | "success" | "otp" | "qr" | "license" | "locked" | "reset"
  | "maint" | "error" | "vip" | "first" | "alert" | "multiDev";

const AI_LINES: Record<AIState, string> = {
  idle: "Standing by. Nexus OS is calibrated and ready, Boss.",
  greeting: "Welcome back, Boss. Authentication grid is warm.",
  typingUser: "Identity captured. Continuing handshake…",
  typingPass: "Encrypting your keystrokes through the secure channel.",
  wrongPass: "Credential mismatch. Try again — the gate is patient.",
  success: "Verified. Opening the Nexus OS gateway.",
  otp: "One-time signal dispatched. Awaiting six-digit confirmation.",
  qr: "Scanner armed. Align your trusted device with the matrix.",
  license: "License key verified against the master ledger.",
  locked: "Vault sealed. Cooling down before next attempt.",
  reset: "Recovery beacon prepared. Check your registered inbox.",
  maint: "Maintenance window active. Critical paths still online.",
  error: "Edge node hiccup. Re-establishing the secure link…",
  vip: "VIP signature detected. Concierge channel opened.",
  first: "First arrival noted. I will guide you, Boss.",
  alert: "Security alert. Verifying device fingerprint.",
  multiDev: "Multi-device login detected. Confirming trust ring.",
};

/* ───────────── Logo with Magic Touch ───────────── */
type Burst = { id: number; emoji: string; x: number; y: number; rare: boolean };

const COMMON_EFFECTS = ["❤️","💋","🫧","✨","💎","🦋","🌸","🌟","🎉","⚡","🔥","🚀","💰","💵","💶","💷","💴","🪙","🏆","👑","🎁","🌈","💫","🎊","🕊"];
const CURRENCY = ["$","€","£","¥","₹","₿","AED","SAR"];
const RARE_EFFECTS = ["👑","💎","🚀","🏆","🌎","✨"];

function MagicLogo({
  src, alt, size = 120, round = true, onTouch,
}: { src: string; alt: string; size?: number; round?: boolean; onTouch?: () => void }) {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [pulse, setPulse] = useState(0);
  const idRef = useRef(0);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const rare = Math.random() < 0.01;
    const pool = rare ? RARE_EFFECTS : Math.random() < 0.18 ? CURRENCY : COMMON_EFFECTS;
    const count = rare ? 14 : 6 + Math.floor(Math.random() * 6);
    const newBursts: Burst[] = Array.from({ length: count }).map(() => ({
      id: ++idRef.current,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      x: cx + (Math.random() - 0.5) * 40,
      y: cy + (Math.random() - 0.5) * 20,
      rare,
    }));
    setBursts((b) => [...b, ...newBursts]);
    setPulse((p) => p + 1);
    onTouch?.();
    setTimeout(() => {
      setBursts((b) => b.filter((x) => !newBursts.find((n) => n.id === x.id)));
    }, 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="sv-logo-btn relative"
      style={{ width: size, height: round ? size : size * 0.28 }}
      aria-label="Software Vala"
    >
      <span className="sv-logo-glow" key={pulse} />
      <span className="sv-logo-ring" />
      <img
        src={src}
        alt={alt}
        className={round ? "sv-logo-img sv-logo-round" : "sv-logo-img sv-logo-long"}
        draggable={false}
      />
      {bursts.map((b) => (
        <span
          key={b.id}
          className={`sv-burst ${b.rare ? "sv-burst-rare" : ""}`}
          style={{ left: b.x, top: b.y }}
        >
          {b.emoji}
        </span>
      ))}
    </button>
  );
}

/* ───────────── Background Ecosystem Network ───────────── */
function EcosystemNetwork() {
  // 12 nodes representing modules of the ecosystem.
  const nodes = useMemo(() => {
    const N = 14;
    const arr: { x: number; y: number; label: string; icon: any }[] = [];
    const labels = [
      ["Marketplace", Package], ["Reseller", Users], ["Franchise", Building2],
      ["Support", Headphones], ["AI Core", Brain], ["Security", ShieldCheck],
      ["Licensing", KeyRound], ["Servers", Server], ["Apps", Cpu],
      ["Products", Package], ["Users", Users], ["Network", Network],
      ["Revenue", BarChart3], ["Signals", Radio],
    ];
    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2 + (i % 2 ? 0.2 : -0.2);
      const r = 32 + (i % 3) * 8;
      arr.push({
        x: 50 + Math.cos(angle) * r,
        y: 50 + Math.sin(angle) * r * 0.62,
        label: labels[i][0] as string,
        icon: labels[i][1],
      });
    }
    return arr;
  }, []);

  return (
    <div className="sv-net">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="sv-net-svg">
        <defs>
          <linearGradient id="svline" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
          </linearGradient>
          <radialGradient id="svglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* hub */}
        <circle cx="50" cy="50" r="22" fill="url(#svglow)" />
        {nodes.map((n, i) => (
          <line key={i} x1="50" y1="50" x2={n.x} y2={n.y} stroke="url(#svline)" strokeWidth="0.18" />
        ))}
        {nodes.map((n, i) => (
          <g key={`d-${i}`}>
            <circle cx={n.x} cy={n.y} r="0.6" fill="#60a5fa" opacity="0.9" />
            <circle cx={n.x} cy={n.y} r="1.6" fill="#60a5fa" opacity="0.15">
              <animate attributeName="r" values="1.2;2.4;1.2" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.05;0.25" dur={`${3 + (i % 5)}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </svg>
      <div className="sv-net-grid" />
      <div className="sv-net-vignette" />
    </div>
  );
}

/* ───────────── Page ───────────── */
function LoginPage() {
  const [method, setMethod] = useState<"email" | "username" | "mobile" | "license" | "otp" | "qr" | "sso">("email");
  const [showPass, setShowPass] = useState(false);
  const [aiState, setAiState] = useState<AIState>("greeting");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setAiState("idle"), 3200);
    const i = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => { clearTimeout(t); clearInterval(i); };
  }, []);

  useEffect(() => {
    if (method === "otp") setAiState("otp");
    else if (method === "qr") setAiState("qr");
    else if (method === "license") setAiState("license");
    else setAiState((s) => (s === "otp" || s === "qr" || s === "license" ? "idle" : s));
  }, [method]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setAiState("typingPass");
    setTimeout(() => {
      const ok = password.length >= 6 && identifier.length > 2;
      setAiState(ok ? "success" : "wrongPass");
      setSubmitting(false);
    }, 1100);
  }

  return (
    <div className="sv-login-root">
      <EcosystemNetwork />

      {/* Top bar */}
      <header className="sv-top">
        <div className="sv-top-brand">
          <MagicLogo src={logoRound.url} alt="Software Vala" size={42} round />
          <div className="sv-top-name">
            <span className="sv-top-name-1">SOFTWARE VALA</span>
            <span className="sv-top-name-2">NEXUS · OS</span>
          </div>
        </div>
        <div className="sv-top-status">
          <StatusDot label="System" value="Online" tone="ok" />
          <StatusDot label="AI Core" value="Active" tone="ok" />
          <StatusDot label="Security" value="Hardened" tone="ok" />
          <StatusDot label="License" value="Valid" tone="ok" />
          <div className="sv-clock">{time || "—"}</div>
        </div>
      </header>

      <main className="sv-grid">
        {/* LEFT — Ecosystem opportunities */}
        <section className="sv-card sv-left">
          <div className="sv-eyebrow"><Sparkles className="h-3.5 w-3.5" /> ECOSYSTEM · OPPORTUNITIES</div>
          <h2 className="sv-h2">Build your career inside the Software Vala universe.</h2>
          <p className="sv-sub">Live programs across 60+ countries. Onboard, certify, and earn from a single account.</p>

          <div className="sv-roles">
            {[
              { icon: Cpu, name: "Developer", count: "1,284 open" },
              { icon: Brain, name: "AI Engineer", count: "612 open" },
              { icon: BarChart3, name: "Data Scientist", count: "418 open" },
              { icon: Search, name: "SEO Expert", count: "204 open" },
              { icon: Briefcase, name: "Sales Executive", count: "732 open" },
              { icon: Headphones, name: "Support Executive", count: "356 open" },
            ].map((r) => (
              <div key={r.name} className="sv-role">
                <div className="sv-role-icon"><r.icon className="h-4 w-4" /></div>
                <div className="sv-role-meta">
                  <div className="sv-role-name">{r.name}</div>
                  <div className="sv-role-count">{r.count}</div>
                </div>
                <ChevronRight className="h-4 w-4 opacity-50" />
              </div>
            ))}
          </div>

          <div className="sv-feature">
            <div className="sv-feature-tag"><Rocket className="h-3 w-3" /> FEATURED PROGRAM</div>
            <div className="sv-feature-title">Nexus Reseller Cohort · Q3</div>
            <div className="sv-feature-sub">Earn up to 38% recurring on enterprise SKUs. Applications close in 14 days.</div>
            <div className="sv-feature-row">
              <span className="sv-pill"><Globe className="h-3 w-3" /> Global</span>
              <span className="sv-pill"><Crown className="h-3 w-3" /> Top tier</span>
              <span className="sv-pill"><Zap className="h-3 w-3" /> Live</span>
            </div>
          </div>

          <div className="sv-announce">
            <Bell className="h-3.5 w-3.5" />
            <span>Boss Panel v4.2 deployed · 12 new modules live across the OS.</span>
          </div>
        </section>

        {/* CENTER — Auth */}
        <section className="sv-card sv-center">
          <div className="sv-center-head">
            <MagicLogo src={logoLong.url} alt="Software Vala" size={280} round={false} />
            <div className="sv-welcome">
              <span className="sv-welcome-eyebrow">SECURE · GATEWAY</span>
              <h1 className="sv-welcome-h1">Welcome back, Boss</h1>
              <p className="sv-welcome-sub">One login. The entire Software Vala ecosystem.</p>
            </div>
          </div>

          <div className="sv-method">
            {[
              ["email", Mail, "Email"],
              ["username", User, "Username"],
              ["mobile", Phone, "Mobile"],
              ["license", KeyRound, "License"],
              ["otp", ShieldCheck, "OTP"],
              ["qr", QrCode, "QR"],
              ["sso", Fingerprint, "SSO"],
            ].map(([k, Icon, label]: any) => (
              <button
                key={k}
                onClick={() => setMethod(k)}
                className={`sv-method-btn ${method === k ? "is-active" : ""}`}
                type="button"
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          <form className="sv-form" onSubmit={onSubmit}>
            {method === "qr" ? (
              <div className="sv-qr">
                <div className="sv-qr-frame">
                  <div className="sv-qr-grid" />
                  <div className="sv-qr-scan" />
                  <div className="sv-qr-corners">
                    <span /><span /><span /><span />
                  </div>
                </div>
                <div className="sv-qr-meta">
                  <div className="sv-qr-title">Scan with your trusted device</div>
                  <div className="sv-qr-sub">Token rotates every 30s · expires in 00:24</div>
                </div>
              </div>
            ) : method === "otp" ? (
              <>
                <SvInput
                  icon={Phone} label="Registered mobile / email"
                  value={identifier} onChange={setIdentifier}
                  onFocus={() => setAiState("typingUser")}
                  placeholder="+91 98765 43210"
                />
                <div className="sv-otp">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input key={i} maxLength={1} className="sv-otp-cell" inputMode="numeric" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <SvInput
                  icon={method === "license" ? KeyRound : method === "mobile" ? Phone : method === "username" ? User : Mail}
                  label={
                    method === "license" ? "License key" :
                    method === "mobile" ? "Mobile number" :
                    method === "username" ? "Username" :
                    method === "sso" ? "Corporate email" : "Email address"
                  }
                  value={identifier} onChange={setIdentifier}
                  onFocus={() => setAiState("typingUser")}
                  placeholder={
                    method === "license" ? "SV-XXXX-XXXX-XXXX-XXXX" :
                    method === "mobile" ? "+91 98765 43210" :
                    method === "username" ? "boss.vala" :
                    "you@company.com"
                  }
                />
                {method !== "license" && method !== "sso" && (
                  <SvInput
                    icon={Lock} label="Password"
                    type={showPass ? "text" : "password"}
                    value={password} onChange={setPassword}
                    onFocus={() => setAiState("typingPass")}
                    placeholder="Encrypted via Nexus channel"
                    rightSlot={
                      <button type="button" className="sv-eye" onClick={() => setShowPass((v) => !v)}>
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                )}
              </>
            )}

            <div className="sv-row-between">
              <label className="sv-check">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span /> Remember this device
              </label>
              <button type="button" className="sv-link">Forgot password?</button>
            </div>

            <button type="submit" className="sv-submit" disabled={submitting}>
              <ShieldCheck className="h-4 w-4" />
              {submitting ? "Verifying…" : "Enter Nexus OS"}
              <span className="sv-submit-shine" />
            </button>

            <div className="sv-divider"><span>or continue with</span></div>

            <div className="sv-oauth">
              <OAuthBtn label="Google" />
              <OAuthBtn label="Microsoft" />
              <OAuthBtn label="GitHub" />
              <OAuthBtn label="Enterprise SSO" />
            </div>
          </form>

          <div className="sv-security">
            <SecChip icon={BadgeCheck} label="2FA" value="Armed" />
            <SecChip icon={Activity} label="Sessions" value="2 active" />
            <SecChip icon={Globe} label="Region" value="IN · BLR-1" />
            <SecChip icon={ShieldCheck} label="Device" value="Trusted" />
          </div>
        </section>

        {/* RIGHT — AI Concierge */}
        <aside className="sv-card sv-right">
          <div className="sv-eyebrow"><Brain className="h-3.5 w-3.5" /> NEXUS · AI CONCIERGE</div>

          <div className="sv-ai-avatar">
            <div className="sv-ai-ring" />
            <div className="sv-ai-core">
              <div className="sv-ai-pulse" />
              <Brain className="h-8 w-8" />
            </div>
            <div className="sv-ai-orbit">
              <span /><span /><span />
            </div>
          </div>

          <div className="sv-ai-name">
            Vala<span>·</span><b>AI</b>
            <span className="sv-ai-status">{stateLabel(aiState)}</span>
          </div>

          <div className="sv-ai-bubble">
            <span className="sv-ai-bubble-tail" />
            {AI_LINES[aiState]}
          </div>

          <div className="sv-ai-states">
            {(["idle","greeting","otp","qr","license","vip","alert"] as AIState[]).map((s) => (
              <button
                key={s} onClick={() => setAiState(s)}
                className={`sv-state-chip ${aiState === s ? "is-active" : ""}`}
              >
                {stateLabel(s)}
              </button>
            ))}
          </div>

          <div className="sv-ai-actions">
            <button className="sv-ai-btn"><Mic className="h-4 w-4" /> Voice assistant</button>
            <button className="sv-ai-btn" onClick={() => setLanguage((l) => l === "EN" ? "हिंदी" : "EN")}>
              <Languages className="h-4 w-4" /> {language}
            </button>
            <button className="sv-ai-btn"><HelpCircle className="h-4 w-4" /> Help center</button>
          </div>

          <div className="sv-stats">
            <Stat label="Products" value="12,400+" />
            <Stat label="Users" value="1.2M" />
            <Stat label="Countries" value="64" />
          </div>
        </aside>
      </main>

      <footer className="sv-foot">
        <span>© Software Vala · The Name of Trust</span>
        <span className="sv-foot-mid">Last secure handshake · {time || "—"} IST</span>
        <span>Privacy · Terms · Trust Center</span>
      </footer>
    </div>
  );
}

/* ───────────── Small parts ───────────── */
function stateLabel(s: AIState) {
  return ({
    idle: "Idle", greeting: "Greeting", typingUser: "Listening",
    typingPass: "Encrypting", wrongPass: "Recheck", success: "Verified",
    otp: "OTP mode", qr: "QR mode", license: "License", locked: "Locked",
    reset: "Recovery", maint: "Maintenance", error: "Edge error",
    vip: "VIP", first: "First arrival", alert: "Alert", multiDev: "Multi-device",
  } as Record<AIState, string>)[s];
}

function SvInput({
  icon: Icon, label, value, onChange, type = "text", placeholder, onFocus, rightSlot,
}: {
  icon: any; label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; onFocus?: () => void; rightSlot?: React.ReactNode;
}) {
  return (
    <label className="sv-input">
      <span className="sv-input-label">{label}</span>
      <span className="sv-input-wrap">
        <Icon className="h-4 w-4 sv-input-icon" />
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} onFocus={onFocus} autoComplete="off"
        />
        {rightSlot}
      </span>
    </label>
  );
}

function OAuthBtn({ label }: { label: string }) {
  return (
    <button type="button" className="sv-oauth-btn">
      <span className="sv-oauth-dot" /> {label}
    </button>
  );
}

function StatusDot({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" }) {
  return (
    <div className="sv-status">
      <span className={`sv-status-dot sv-status-${tone}`} />
      <span className="sv-status-label">{label}</span>
      <span className="sv-status-value">{value}</span>
    </div>
  );
}

function SecChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="sv-secchip">
      <Icon className="h-3.5 w-3.5" />
      <div>
        <div className="sv-secchip-label">{label}</div>
        <div className="sv-secchip-value">{value}</div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="sv-stat">
      <div className="sv-stat-value">{value}</div>
      <div className="sv-stat-label">{label}</div>
    </div>
  );
}
