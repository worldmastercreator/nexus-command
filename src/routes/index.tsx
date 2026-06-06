import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search, Bell, Globe, Sparkles, ChevronRight, ChevronLeft, Play, Star,
  Download, Users, ShoppingBag, Trophy, Zap, TrendingUp, Award,
  Bot, GraduationCap, Tv, HelpCircle, ArrowRight, Hospital,
  Store, Factory, HardHat, Hotel, Truck, Banknote, Heart, Home as HomeIcon,
  Scale, Landmark, Crown, Briefcase, Handshake, PenTool, BarChart3,
  Headphones, Plus, Minus, Calendar, ShieldCheck, Layers, Cpu
} from "lucide-react";
import { products } from "@/lib/imported/marketplaceData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala — Enterprise Software Marketplace" },
      { name: "description", content: "Netflix + Envato + Apple grade marketplace for enterprise software, AI products, resellers, vendors, franchises and authors." },
      { property: "og:title", content: "Software Vala — Enterprise Software Marketplace" },
      { property: "og:description", content: "Premium marketplace for ERP, CRM, HRMS, AI software and 12 industry verticals." },
    ],
  }),
  component: MarketplaceHome,
});

/* =========================================================================
   Top-level page
   ========================================================================= */
function MarketplaceHome() {
  return (
    <div className="mp-home relative">
      <div className="mp-grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative">
        <PageHeader />
        <div className="mp-wrap pt-6">
          <div className="mp-content flex gap-6">
            <PageSidebar />
            <main className="min-w-0 flex-1 space-y-8 pb-16">
              <HeroBanner />
              <QuickActions />
              <LiveStats />
              <FeaturedRow />
              <IndustryGrid />
              <HorizontalSlider title="Trending Software" eyebrow="SECTION · 06" tone="blue" pool={products.slice(0, 12)} />
              <HorizontalSlider title="Top Selling Software" eyebrow="SECTION · 07" tone="gold" pool={products.slice(6, 18)} />
              <HorizontalSlider title="New Releases" eyebrow="SECTION · 08" tone="purple" pool={products.slice(12, 24)} />
              <AIZone />
              <ResellerOpportunity />
              <VendorMarket />
              <GlobalMap />
              <SuccessStories />
              <AwardsWall />
              <ActivityWall />
              <TvLibrary />
              <Academy />
              <PartnerEcosystem />
              <FAQSection />
              <FinalCTA />
            </main>
          </div>
        </div>
        <PageFooter />
      </div>
    </div>
  );
}

/* =========================================================================
   Header  (80px)
   ========================================================================= */
function PageHeader() {
  const nav = ["Marketplace","Solutions","Industries","Products","Resellers","Vendors","Franchise","Authors"];
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-white/5 bg-[#050816]/85 backdrop-blur-xl">
      <div className="mp-wrap mp-content flex h-full items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#8B5CFF] text-[#050816]">
            <Crown size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold tracking-tight text-white">Software Vala</div>
            <div className="text-[9.5px] font-mono uppercase tracking-[0.18em] text-[#00D4FF]">Enterprise · Marketplace</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex">
          {nav.map(n => (
            <a key={n} href="#" className="rounded-md px-2.5 py-1.5 text-[12.5px] text-white/70 hover:bg-white/5 hover:text-white">{n}</a>
          ))}
        </nav>
        <div className="ml-auto flex w-[500px] max-w-[36vw] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
          <Search size={15} className="text-white/40" />
          <input placeholder="Search 280,000+ software, vendors, industries…" className="w-full bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none" />
          <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9.5px] text-white/50">⌘K</span>
        </div>
        <div className="flex items-center gap-1">
          {[Globe, Banknote, Bell, Sparkles].map((I, i) => (
            <button key={i} className="grid h-9 w-9 place-items-center rounded-lg text-white/70 hover:bg-white/5 hover:text-white">
              <I size={15} />
            </button>
          ))}
          <button className="mp-btn-ghost ml-2 hidden md:inline-flex">Login</button>
          <button className="mp-btn ml-1 hidden md:inline-flex">Register</button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
   Sidebar  (280px)
   ========================================================================= */
function PageSidebar() {
  const groups = [
    { label: "Marketplace", items: ["Marketplace Home","Industries","All Software","Featured Software","Trending Software","New Launches","Top Rated","Best Sellers","Lifetime Deals","Subscriptions"] },
    { label: "Zones", items: ["Reseller Zone","Vendor Zone","Franchise Zone","Author Zone"] },
    { label: "Resources", items: ["Downloads","Events","Academy","Support"] },
  ];
  const [open, setOpen] = useState(true);
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="sticky top-24 h-10 w-10 shrink-0 rounded-xl border border-white/10 bg-white/[0.03] text-white/70">
        <ChevronRight size={16} className="mx-auto" />
      </button>
    );
  }
  return (
    <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-[280px] shrink-0 overflow-y-auto rounded-2xl border border-white/10 bg-[#0B1225]/80 p-4 backdrop-blur-xl lg:block">
      <div className="mb-3 flex items-center justify-between">
        <div className="mp-eyebrow">Navigator</div>
        <button onClick={() => setOpen(false)} className="rounded p-1 text-white/40 hover:text-white"><ChevronLeft size={14} /></button>
      </div>
      {groups.map((g, gi) => (
        <div key={g.label} className={gi > 0 ? "mt-5 border-t border-white/5 pt-4" : ""}>
          <div className="mb-2 px-2 text-[10.5px] font-mono uppercase tracking-[0.18em] text-white/40">{g.label}</div>
          <ul className="space-y-0.5">
            {g.items.map((it, i) => (
              <li key={it}>
                <a href="#" className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12.5px] text-white/70 hover:bg-white/5 hover:text-white ${gi===0 && i===0 ? "bg-gradient-to-r from-[#00D4FF]/10 to-transparent text-white" : ""}`}>
                  <span>{it}</span>
                  <ChevronRight size={12} className="opacity-40" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="mt-6 rounded-xl border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/10 to-transparent p-3">
        <Trophy size={16} className="text-[#FFD700]" />
        <div className="mt-1.5 text-[12px] font-semibold text-white">Become a Top Reseller</div>
        <div className="mt-0.5 text-[11px] text-white/60">Earn up to 40% commission.</div>
        <button className="mt-2 text-[11px] font-semibold text-[#FFD700] hover:underline">Apply now →</button>
      </div>
    </aside>
  );
}

/* =========================================================================
   01 — Hero Banner (420px, 8 slides, 15s auto)
   ========================================================================= */
const HERO_SLIDES = [
  { tag: "ENTERPRISE", title: "Enterprise ERP", sub: "Run finance, supply chain, HR and operations on one quantum-secure platform.", cta: "Explore ERP", grad: ["#00D4FF","#8B5CFF"] },
  { tag: "CRM", title: "Omnichannel CRM", sub: "Unify sales, marketing and service across 120+ channels with AI co-pilots.", cta: "Try CRM", grad: ["#8B5CFF","#FF4FCB"] },
  { tag: "HRMS", title: "AI HRMS Suite", sub: "Hire, onboard, pay and grow 100k+ employees from one console.", cta: "See HRMS", grad: ["#FFD700","#FF6B35"] },
  { tag: "EDUCATION", title: "School & College ERP", sub: "From admissions to alumni — every learner, every campus, every device.", cta: "Open School ERP", grad: ["#00D4FF","#22D3EE"] },
  { tag: "HEALTHCARE", title: "Hospital ERP & EMR", sub: "OPD, IPD, lab, pharmacy, billing and tele-health — all in one cockpit.", cta: "Tour Hospital ERP", grad: ["#FF6B6B","#8B5CFF"] },
  { tag: "RETAIL", title: "Retail POS & Inventory", sub: "Multi-store, multi-currency, offline-first POS with AI demand forecast.", cta: "Launch POS", grad: ["#FFD700","#00D4FF"] },
  { tag: "AI ZONE", title: "AI Products Marketplace", sub: "60+ ready-to-deploy AI agents for sales, support, ops and analytics.", cta: "Browse AI", grad: ["#8B5CFF","#00D4FF"] },
  { tag: "PROMOTION", title: "Marketplace Mega Sale", sub: "Lifetime deals, 40% partner commissions, free migration this quarter.", cta: "View Deals", grad: ["#FFD700","#FF4FCB"] },
];
function HeroBanner() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % HERO_SLIDES.length), 15000);
    return () => clearInterval(t);
  }, []);
  const s = HERO_SLIDES[i];
  return (
    <section className="relative h-[420px] overflow-hidden rounded-[22px] border border-white/10">
      <div className="absolute inset-0 transition-all duration-700"
        style={{ background: `radial-gradient(circle at 20% 50%, ${s.grad[0]}30, transparent 60%), radial-gradient(circle at 90% 30%, ${s.grad[1]}30, transparent 60%), linear-gradient(135deg, #050816, #0B1225)` }} />
      <div className="mp-grid-bg absolute inset-0 opacity-40" />
      <div className="relative grid h-full grid-cols-1 items-center gap-6 px-10 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10.5px] font-mono uppercase tracking-[0.22em] text-white"
            style={{ color: s.grad[0] }}>
            <span className="h-1.5 w-1.5 rounded-full mp-pulse" style={{ background: s.grad[0] }} /> {s.tag}
          </div>
          <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white lg:text-6xl">{s.title}</h1>
          <p className="max-w-lg text-[15px] text-white/70">{s.sub}</p>
          <div className="flex items-center gap-3 pt-2">
            <button className="mp-btn" style={{ background: `linear-gradient(135deg, ${s.grad[0]}, ${s.grad[1]})` }}>
              {s.cta} <ArrowRight size={15} />
            </button>
            <button className="mp-btn-ghost"><Play size={13} /> Watch demo</button>
          </div>
          <div className="flex items-center gap-2 pt-4">
            {HERO_SLIDES.map((_, k) => (
              <button key={k} onClick={() => setI(k)} aria-label={`Slide ${k+1}`}
                className={`h-1 rounded-full transition-all ${k===i ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>
        <div className="relative hidden h-[340px] lg:block">
          <div className="absolute inset-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-5 backdrop-blur-xl"
            style={{ boxShadow: `0 30px 80px -20px ${s.grad[0]}55` }}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
                <span className="ml-3 font-mono text-[10.5px] text-white/40">{s.title.toLowerCase().replace(/\s+/g,"-")}.app</span>
              </div>
              <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
                {Array.from({ length: 9 }).map((_, k) => (
                  <div key={k} className="rounded-lg border border-white/5 bg-white/[0.03] p-2.5">
                    <div className="h-1.5 w-1/2 rounded-full" style={{ background: k % 2 ? s.grad[0] : s.grad[1] }} />
                    <div className="mt-2 h-1 w-3/4 rounded-full bg-white/10" />
                    <div className="mt-1.5 h-1 w-2/3 rounded-full bg-white/10" />
                    <div className="mt-3 h-8 rounded-md" style={{ background: `linear-gradient(135deg, ${s.grad[0]}30, ${s.grad[1]}30)` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   02 — Quick Action Cards
   ========================================================================= */
function QuickActions() {
  const cards = [
    { title: "Become a Reseller", desc: "Sell global software, earn up to 40%.", icon: Handshake, grad: ["#00D4FF","#8B5CFF"] },
    { title: "Become a Vendor", desc: "Publish your product to 1.4M buyers.", icon: Store, grad: ["#8B5CFF","#FF4FCB"] },
    { title: "Become a Franchise", desc: "Own a city, run a regional empire.", icon: Crown, grad: ["#FFD700","#FF6B35"] },
    { title: "Become an Author", desc: "Build, ship, monetise your code.", icon: PenTool, grad: ["#00D4FF","#22D3EE"] },
  ];
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(c => (
        <a key={c.title} href="#" className="mp-card relative h-[160px] overflow-hidden p-5">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-25 blur-2xl"
            style={{ background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})` }} />
          <div className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: `linear-gradient(135deg, ${c.grad[0]}, ${c.grad[1]})`, color: "#050816" }}>
            <c.icon size={20} />
          </div>
          <div className="mt-4 text-[16px] font-semibold text-white">{c.title}</div>
          <div className="mt-1 text-[12.5px] text-white/60">{c.desc}</div>
          <div className="absolute bottom-4 right-5 text-white/40">
            <ArrowRight size={16} />
          </div>
        </a>
      ))}
    </section>
  );
}

/* =========================================================================
   03 — Live Ecosystem Stats (animated counters)
   ========================================================================= */
function useCount(target: number, durationMs = 1600) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / durationMs);
          setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, durationMs]);
  return [v, ref] as const;
}
function StatCard({ label, value, suffix, prefix, icon: Icon, tone }: { label: string; value: number; suffix?: string; prefix?: string; icon: any; tone: string }) {
  const [c, r] = useCount(value);
  return (
    <div ref={r} className="mp-card relative overflow-hidden p-5">
      <div className="absolute right-3 top-3 opacity-30" style={{ color: tone }}><Icon size={28} /></div>
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em]" style={{ color: tone }}>{label}</div>
      <div className="mt-2 text-[32px] font-bold tracking-tight text-white">
        {prefix}{c.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[11.5px] text-emerald-400"><TrendingUp size={12} /> live</div>
    </div>
  );
}
function LiveStats() {
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 03" title="Live Ecosystem" sub="Pulse of the entire Software Vala economy." />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Products" value={284910} icon={Layers} tone="#00D4FF" />
        <StatCard label="Customers" value={1428002} icon={Users} tone="#8B5CFF" />
        <StatCard label="Licenses" value={3920184} icon={ShieldCheck} tone="#FFD700" />
        <StatCard label="Renewals · 30d" value={184220} icon={Calendar} tone="#22D3EE" />
        <StatCard label="Resellers" value={14208} icon={Handshake} tone="#FF4FCB" />
        <StatCard label="Vendors" value={8642} icon={Store} tone="#00D4FF" />
      </div>
    </section>
  );
}

/* =========================================================================
   Reusable: SectionTitle
   ========================================================================= */
function SectionTitle({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="mp-eyebrow">{eyebrow}</div>
        <h2 className="mp-h2 mt-1">{title}</h2>
        {sub && <p className="mp-sub mt-1">{sub}</p>}
      </div>
      {action ?? <a href="#" className="mp-btn-ghost shrink-0">View all <ArrowRight size={13} /></a>}
    </div>
  );
}

/* =========================================================================
   04 — Featured Software (Netflix row, 320x220, image 70 / info 30)
   ========================================================================= */
function FeaturedRow() {
  const feat = products.slice(0, 10);
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 04" title="Featured Software" sub="Hand-picked by the Software Vala editorial team." />
      <div className="mp-scroll mt-4 flex gap-4 overflow-x-auto pb-3">
        {feat.map(p => (
          <div key={p.id} className="mp-card group relative flex h-[220px] w-[320px] shrink-0 flex-col overflow-hidden">
            <div className="relative h-[154px] overflow-hidden">
              <img src={p.thumbnail} alt={p.name} loading="lazy" className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1225] via-transparent to-transparent" />
              <span className="absolute left-3 top-3 mp-pill bg-[#FFD700] text-[#050816]">FEATURED</span>
              <span className="absolute right-3 top-3 mp-pill bg-black/60 text-white backdrop-blur">{p.category}</span>
            </div>
            <div className="flex flex-1 items-center justify-between gap-3 px-4">
              <div className="min-w-0">
                <div className="truncate text-[13.5px] font-semibold text-white">{p.name}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-white/60">
                  <Star size={11} className="fill-[#FFD700] text-[#FFD700]" /> {p.rating.toFixed(1)} · {p.users.toLocaleString()} users
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-[#00D4FF]">${p.price}</div>
                <div className="text-[10px] text-white/40 line-through">${p.originalPrice}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   05 — Industry Marketplace (4x3 grid, 12 industries)
   ========================================================================= */
const INDUSTRIES = [
  { name: "Education", icon: GraduationCap, color: "#00D4FF", count: 4820 },
  { name: "Healthcare", icon: Hospital, color: "#FF6B6B", count: 3142 },
  { name: "Retail", icon: ShoppingBag, color: "#FFD700", count: 5208 },
  { name: "Manufacturing", icon: Factory, color: "#8B5CFF", count: 2614 },
  { name: "Construction", icon: HardHat, color: "#FF8A3D", count: 1820 },
  { name: "Hotel", icon: Hotel, color: "#22D3EE", count: 2410 },
  { name: "Transport", icon: Truck, color: "#A78BFA", count: 1604 },
  { name: "Finance", icon: Banknote, color: "#00D4FF", count: 3920 },
  { name: "NGO", icon: Heart, color: "#FF4FCB", count: 920 },
  { name: "Real Estate", icon: HomeIcon, color: "#FFD700", count: 2140 },
  { name: "Legal", icon: Scale, color: "#8B5CFF", count: 1180 },
  { name: "Government", icon: Landmark, color: "#22D3EE", count: 1462 },
];
function IndustryGrid() {
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 05" title="Industry Marketplace" sub="Vertical solutions across 12 global industries." />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {INDUSTRIES.map(ind => (
          <a key={ind.name} href="#" className="mp-card group relative h-[180px] overflow-hidden p-5">
            <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full opacity-25 blur-3xl"
              style={{ background: ind.color }} />
            <div className="relative flex h-full flex-col">
              <div className="grid h-12 w-12 place-items-center rounded-xl"
                style={{ background: `${ind.color}1A`, color: ind.color, border: `1px solid ${ind.color}40` }}>
                <ind.icon size={22} />
              </div>
              <div className="mt-auto">
                <div className="text-[18px] font-semibold text-white">{ind.name}</div>
                <div className="mt-1 flex items-center justify-between text-[11.5px] text-white/60">
                  <span>{ind.count.toLocaleString()} apps</span>
                  <ArrowRight size={13} className="transition group-hover:translate-x-1" style={{ color: ind.color }} />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   06 / 07 / 08 — Horizontal Slider (280 x 360)
   ========================================================================= */
function HorizontalSlider({ title, eyebrow, tone, pool }: { title: string; eyebrow: string; tone: "blue"|"gold"|"purple"; pool: typeof products }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 600, behavior: "smooth" });
  const toneColor = tone === "blue" ? "#00D4FF" : tone === "gold" ? "#FFD700" : "#8B5CFF";
  return (
    <section>
      <SectionTitle eyebrow={eyebrow} title={title} action={
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="mp-btn-ghost h-9 w-9 p-0"><ChevronLeft size={16} className="mx-auto" /></button>
          <button onClick={() => scroll(1)} className="mp-btn-ghost h-9 w-9 p-0"><ChevronRight size={16} className="mx-auto" /></button>
        </div>
      } />
      <div ref={ref} className="mp-scroll mt-4 flex gap-4 overflow-x-auto pb-3">
        {pool.map(p => (
          <div key={p.id} className="mp-card group relative h-[360px] w-[280px] shrink-0 overflow-hidden">
            <div className="relative h-[200px] overflow-hidden">
              <img src={p.thumbnail} alt={p.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1225] via-[#0B1225]/30 to-transparent" />
              <span className="absolute left-3 top-3 mp-pill" style={{ background: toneColor, color: "#050816" }}>{p.status.toUpperCase()}</span>
            </div>
            <div className="p-4">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.18em]" style={{ color: toneColor }}>{p.category}</div>
              <div className="mt-1 text-[15px] font-semibold leading-tight text-white">{p.name}</div>
              <p className="mt-1.5 line-clamp-2 text-[11.5px] text-white/55">{p.shortDescription}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-white/60">
                <span className="flex items-center gap-1"><Star size={11} className="fill-[#FFD700] text-[#FFD700]" /> {p.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1"><Download size={11} /> {(p.users/1000).toFixed(1)}k</span>
                <span className="flex items-center gap-1"><Users size={11} /> {p.reviews}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                <div>
                  <div className="text-[14px] font-bold text-white">${p.price}</div>
                  <div className="text-[10px] text-white/40">or ${p.subscription.monthly}/mo</div>
                </div>
                <button className="rounded-lg px-3 py-1.5 text-[11px] font-semibold" style={{ background: `${toneColor}1A`, color: toneColor, border: `1px solid ${toneColor}40` }}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   09 — AI Software Zone (neon)
   ========================================================================= */
function AIZone() {
  const ai = [
    { name: "AI CRM", desc: "Autonomous sales agent that closes deals 24/7.", icon: Bot },
    { name: "AI ERP", desc: "Self-driving ledger, supply chain & forecasting.", icon: Cpu as any },
    { name: "AI HRMS", desc: "Resume screening, onboarding, sentiment analysis.", icon: Users },
    { name: "AI Analytics", desc: "Natural-language BI across every data source.", icon: BarChart3 },
    { name: "AI Automation", desc: "Build & deploy agents with zero code.", icon: Zap },
    { name: "AI Support", desc: "Multilingual support agent · 125 languages.", icon: Headphones },
  ];
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-[#8B5CFF]/30 bg-gradient-to-br from-[#0B1225] via-[#1a1040] to-[#0B1225] p-8 mp-glow-purple">
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#8B5CFF]/30 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-[#00D4FF]/20 blur-3xl" />
      <div className="relative">
        <SectionTitle eyebrow="SECTION · 09 · NEURAL" title="AI Software Zone" sub="Premium agents trained on enterprise workflows." />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ai.map(a => (
            <div key={a.name} className="group relative rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur transition hover:border-[#8B5CFF]/60 hover:-translate-y-2">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#8B5CFF] to-[#00D4FF] text-[#050816]">
                  <a.icon size={20} />
                </div>
                <div className="text-[15px] font-semibold text-white">{a.name}</div>
                <span className="ml-auto mp-pill bg-[#00D4FF]/15 text-[#00D4FF]">NEW</span>
              </div>
              <p className="mt-3 text-[12.5px] text-white/60">{a.desc}</p>
              <button className="mt-4 text-[12px] font-semibold text-[#00D4FF] hover:underline">Deploy agent →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   10 — Reseller Opportunity
   ========================================================================= */
function CalcCard({ title, hint, color }: { title: string; hint: string; color: string }) {
  const [v, setV] = useState(50);
  const calc = useMemo(() => Math.round(v * 1200), [v]);
  return (
    <div className="mp-card p-5">
      <div className="text-[10.5px] font-mono uppercase tracking-[0.18em]" style={{ color }}>{title}</div>
      <div className="mt-3 text-[32px] font-bold text-white">${calc.toLocaleString()}</div>
      <div className="mt-1 text-[12px] text-white/55">{hint}</div>
      <input type="range" min={1} max={100} value={v} onChange={e => setV(+e.target.value)} className="mt-4 w-full accent-[color:var(--mp-purple)]" />
      <div className="mt-2 flex justify-between text-[10.5px] text-white/40"><span>{v} licenses / month</span><span>Projected /yr</span></div>
    </div>
  );
}
function ResellerOpportunity() {
  const leaders = [
    { n: "Nova Labs", v: "$184,210" }, { n: "Axiom UX", v: "$142,820" },
    { n: "Pulse Co", v: "$98,410" }, { n: "Helix Dev", v: "$84,128" },
    { n: "Aurora IO", v: "$71,420" }, { n: "Quantum Sys", v: "$62,008" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 10" title="Reseller Opportunity" sub="Calculate your earnings. Climb the global leaderboard." />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="grid grid-cols-1 gap-4 lg:col-span-3 md:grid-cols-3">
          <CalcCard title="Revenue Projection" hint="At avg $1,200 / license" color="#00D4FF" />
          <CalcCard title="Commission · 30%" hint="Tier-2 partner default" color="#FFD700" />
          <CalcCard title="Growth · 12mo" hint="Compounded retention" color="#8B5CFF" />
        </div>
        <div className="mp-card lg:col-span-2 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="mp-eyebrow">Leaderboard</div>
              <div className="text-[16px] font-semibold text-white">Top Resellers · 7d</div>
            </div>
            <Trophy size={22} className="text-[#FFD700]" />
          </div>
          <ul className="mt-3 space-y-1.5">
            {leaders.map((l, i) => (
              <li key={l.n} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                <span className="grid h-6 w-6 place-items-center rounded-md text-[11px] font-bold"
                  style={{ background: i===0 ? "#FFD700" : i===1 ? "#C0C0C0" : i===2 ? "#CD7F32" : "rgba(255,255,255,0.06)", color: i<3 ? "#050816" : "white" }}>
                  {i+1}
                </span>
                <span className="text-[12.5px] text-white">{l.n}</span>
                <span className="ml-auto font-mono text-[11.5px] text-emerald-400">{l.v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   11 — Vendor Market
   ========================================================================= */
function VendorMarket() {
  const vendors = [
    { name: "Aurora Systems", rev: "$1.82M", products: 24, story: "Scaled from 0 to 8k customers in 14 months." },
    { name: "NeoStack Labs", rev: "$1.42M", products: 18, story: "Top vendor in Asia-Pacific for 3 quarters." },
    { name: "Helix Software", rev: "$1.08M", products: 12, story: "Switched from direct sales to Software Vala." },
    { name: "Quantum Forge", rev: "$928k", products: 9, story: "Built a global reseller chain on day 30." },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 11" title="Vendor Market" sub="Where global software companies grow." />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {vendors.map(v => (
          <div key={v.name} className="mp-card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#8B5CFF] text-[#050816] font-bold">
                {v.name.split(" ").map(x=>x[0]).join("").slice(0,2)}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">{v.name}</div>
                <div className="text-[10.5px] text-white/50">{v.products} products</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-white/5 bg-black/20 p-3">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-[#00D4FF]">Revenue · 30d</div>
              <div className="mt-1 text-[20px] font-bold text-white">{v.rev}</div>
            </div>
            <p className="mt-3 text-[11.5px] italic text-white/55">“{v.story}”</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   12 — Global Map (650px)
   ========================================================================= */
function GlobalMap() {
  const dots = [
    { cx: 18, cy: 38, r: 10, c: "#00D4FF", label: "North America" },
    { cx: 46, cy: 36, r: 8, c: "#8B5CFF", label: "Europe" },
    { cx: 68, cy: 50, r: 12, c: "#FFD700", label: "India" },
    { cx: 78, cy: 42, r: 7, c: "#00D4FF", label: "East Asia" },
    { cx: 32, cy: 62, r: 6, c: "#FF4FCB", label: "Brazil" },
    { cx: 56, cy: 58, r: 5, c: "#22D3EE", label: "Africa" },
    { cx: 82, cy: 70, r: 5, c: "#FFD700", label: "Australia" },
    { cx: 24, cy: 50, r: 4, c: "#8B5CFF", label: "Mexico" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 12" title="Global Footprint" sub="Live coverage across 6 continents · 142 countries." />
      <div className="mp-card relative mt-4 h-[650px] overflow-hidden p-6">
        <div className="absolute inset-0 mp-grid-bg opacity-30" />
        <div className="relative grid h-full grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="relative lg:col-span-3">
            <svg viewBox="0 0 100 80" className="h-full w-full">
              <defs>
                <radialGradient id="cont" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
                </radialGradient>
              </defs>
              {/* abstract continents */}
              {[[12,28,16,18],[40,24,22,20],[64,30,22,26],[26,54,16,16],[52,52,18,18],[76,62,12,12]].map(([x,y,w,h],i)=>(
                <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="url(#cont)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.2" />
              ))}
              {dots.map((d,i) => (
                <g key={i}>
                  <circle cx={d.cx} cy={d.cy} r={d.r} fill={d.c} fillOpacity="0.15">
                    <animate attributeName="r" values={`${d.r};${d.r+4};${d.r}`} dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0.15;0;0.15" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={d.cx} cy={d.cy} r={1.4} fill={d.c} />
                </g>
              ))}
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {[
              { l: "Customers", v: "1.42M", c: "#00D4FF" },
              { l: "Revenue · 30d", v: "$42.1M", c: "#FFD700" },
              { l: "Licenses", v: "3.92M", c: "#8B5CFF" },
              { l: "Resellers", v: "14,208", c: "#22D3EE" },
              { l: "Vendors", v: "8,642", c: "#FF4FCB" },
              { l: "Franchises", v: "612", c: "#FFD700" },
            ].map(s => (
              <div key={s.l} className="rounded-xl border border-white/8 bg-black/30 p-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em]" style={{ color: s.c }}>{s.l}</div>
                <div className="mt-1 text-[18px] font-bold text-white">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   13 — Success Stories
   ========================================================================= */
function SuccessStories() {
  const stories = [
    { kind: "Customer", who: "Lotus Hospitals", quote: "Cut admin time by 62% on day 90.", grad: ["#00D4FF","#8B5CFF"] },
    { kind: "Reseller",  who: "Nova Labs", quote: "Crossed $1M ARR in 8 months.", grad: ["#FFD700","#FF6B35"] },
    { kind: "Vendor",    who: "Helix Software", quote: "Reached 42 countries via Software Vala.", grad: ["#8B5CFF","#FF4FCB"] },
    { kind: "Franchise", who: "Mumbai City Hub", quote: "62 onboardings in the first quarter.", grad: ["#22D3EE","#00D4FF"] },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 13" title="Success Stories" sub="Real partners. Real numbers. Real growth." />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stories.map(s => (
          <div key={s.who} className="mp-card group relative h-[280px] overflow-hidden">
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${s.grad[0]}40, ${s.grad[1]}40)` }} />
            <div className="absolute inset-0 bg-[#0B1225]/40" />
            <div className="absolute inset-0 grid place-items-center">
              <button className="grid h-16 w-16 place-items-center rounded-full bg-white/10 backdrop-blur transition group-hover:scale-110 mp-pulse">
                <Play size={22} className="ml-1 text-white" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="mp-pill bg-white/10 text-white">{s.kind} story</span>
              <div className="mt-2 text-[15px] font-semibold text-white">{s.who}</div>
              <p className="mt-1 text-[12px] text-white/70">“{s.quote}”</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   14 — Awards Wall (3D trophy)
   ========================================================================= */
function AwardsWall() {
  const awards = [
    { t: "Best Product", who: "Aurora ERP", c: "#FFD700" },
    { t: "Best Vendor",  who: "NeoStack Labs", c: "#00D4FF" },
    { t: "Best Reseller",who: "Nova Labs", c: "#8B5CFF" },
    { t: "Best Territory", who: "Bangalore", c: "#22D3EE" },
    { t: "Global Champion", who: "Helix Software", c: "#FF4FCB" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 14" title="Awards Center" sub="2026 Software Vala Excellence Awards." />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {awards.map((a,i) => (
          <div key={a.t} className="mp-card relative h-[240px] overflow-hidden p-5 text-center" style={{ boxShadow: `inset 0 0 60px -10px ${a.c}30` }}>
            <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-30 blur-2xl" style={{ background: a.c }} />
            <div className="relative mx-auto mt-4 grid h-20 w-20 place-items-center rounded-full" style={{ background: `linear-gradient(135deg, ${a.c}, transparent)`, border: `2px solid ${a.c}` }}>
              <Trophy size={32} style={{ color: a.c }} />
            </div>
            <div className="relative mt-4 text-[10.5px] font-mono uppercase tracking-[0.2em]" style={{ color: a.c }}>{a.t}</div>
            <div className="relative mt-1 text-[14px] font-semibold text-white">{a.who}</div>
            <div className="relative mt-2 text-[10.5px] text-white/50">Rank #{i+1} · 2026</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   15 — Live Activity Wall
   ========================================================================= */
function ActivityWall() {
  const seed = [
    { k: "New Customer", t: "Lotus Hospitals · Mumbai", c: "#00D4FF", I: Users },
    { k: "New License", t: "EduFlow Pro · 250 seats", c: "#FFD700", I: ShieldCheck },
    { k: "New Product", t: "AI Forecast Studio v2.0", c: "#8B5CFF", I: Layers },
    { k: "New Vendor", t: "Quantum Forge onboarded", c: "#22D3EE", I: Store },
    { k: "New Reseller", t: "Nova Labs · USA", c: "#FF4FCB", I: Handshake },
    { k: "Renewal", t: "FactoryOS · $48,200", c: "#22C55E", I: Calendar },
    { k: "New Customer", t: "Kavi Schools · Pune", c: "#00D4FF", I: Users },
    { k: "New License", t: "MediCore 360 · 84 seats", c: "#FFD700", I: ShieldCheck },
  ];
  const [feed, setFeed] = useState(seed);
  useEffect(() => {
    const t = setInterval(() => {
      setFeed(f => [seed[Math.floor(Math.random() * seed.length)], ...f].slice(0, 12));
    }, 4000);
    return () => clearInterval(t);
  }, []);
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 15" title="Live Activity Wall" sub="Real-time pulse of the Software Vala economy." />
      <div className="mp-card mt-4 max-h-[420px] overflow-hidden p-3">
        <ul className="space-y-1.5">
          {feed.map((e,i) => (
            <li key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-md" style={{ background: `${e.c}1A`, color: e.c }}>
                <e.I size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-white">{e.k}</div>
                <div className="truncate text-[11px] text-white/55">{e.t}</div>
              </div>
              <span className="ml-auto flex items-center gap-1.5 font-mono text-[10.5px] text-white/40">
                <span className="h-1.5 w-1.5 rounded-full mp-pulse" style={{ background: e.c }} /> live
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* =========================================================================
   16 — Software Vala TV
   ========================================================================= */
function TvLibrary() {
  const cats = [
    { name: "Tutorials", count: 1240, c: "#00D4FF" },
    { name: "Product Demos", count: 820, c: "#8B5CFF" },
    { name: "Training", count: 642, c: "#FFD700" },
    { name: "Events", count: 318, c: "#FF4FCB" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 16" title="Software Vala TV" sub="Video library · 3,000+ hours of premium content." />
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cats.map(c => (
          <div key={c.name} className="mp-card group relative h-[200px] overflow-hidden p-5">
            <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 80% 20%, ${c.c}, transparent 60%)` }} />
            <Tv size={22} style={{ color: c.c }} />
            <div className="mt-3 text-[18px] font-semibold text-white">{c.name}</div>
            <div className="mt-1 text-[12px] text-white/55">{c.count.toLocaleString()} videos</div>
            <button className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur transition group-hover:bg-white/20">
              <Play size={14} className="ml-0.5 text-white" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   17 — Academy
   ========================================================================= */
function Academy() {
  const items = [
    { t: "Courses", n: 320, I: GraduationCap, c: "#00D4FF" },
    { t: "Certifications", n: 48, I: Award, c: "#FFD700" },
    { t: "Training Programs", n: 124, I: Briefcase, c: "#8B5CFF" },
    { t: "Exams", n: 86, I: ShieldCheck, c: "#22D3EE" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 17" title="Academy" sub="Become a Software Vala certified expert." />
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map(i => (
          <div key={i.t} className="mp-card p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: `${i.c}1A`, color: i.c, border: `1px solid ${i.c}40` }}>
              <i.I size={22} />
            </div>
            <div className="mt-4 text-[28px] font-bold text-white">{i.n}+</div>
            <div className="mt-1 text-[12.5px] text-white/60">{i.t}</div>
            <button className="mt-3 text-[11.5px] font-semibold" style={{ color: i.c }}>Browse →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   18 — Partner Ecosystem
   ========================================================================= */
function PartnerEcosystem() {
  const partners = [
    { t: "Reseller",  d: "Sell software in your territory.", I: Handshake, c: "#00D4FF" },
    { t: "Vendor",    d: "Publish your product globally.", I: Store, c: "#8B5CFF" },
    { t: "Franchise", d: "Own a regional empire.", I: Crown, c: "#FFD700" },
    { t: "Author",    d: "Build, ship & monetise.", I: PenTool, c: "#22D3EE" },
    { t: "Affiliate", d: "Earn on every referral.", I: Sparkles, c: "#FF4FCB" },
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 18" title="Partner Ecosystem" sub="Five paths to grow with Software Vala." />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {partners.map(p => (
          <div key={p.t} className="mp-card p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: `${p.c}1A`, color: p.c, border: `1px solid ${p.c}40` }}>
              <p.I size={20} />
            </div>
            <div className="mt-4 text-[15px] font-semibold text-white">{p.t}</div>
            <div className="mt-1 text-[11.5px] text-white/60">{p.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   19 — FAQ
   ========================================================================= */
function FAQSection() {
  const groups = [
    { label: "Enterprise FAQ", items: [
      ["Do you offer on-prem deployment?", "Yes. Every enterprise plan ships with on-prem, private-cloud and hybrid options."],
      ["What about SOC 2 & ISO 27001?", "All marketplace products are vetted against SOC 2 Type II and ISO 27001."],
      ["Can we run a 60-day pilot?", "Yes. Pilots include white-glove migration and a dedicated success engineer."],
    ]},
    { label: "Marketplace FAQ", items: [
      ["How are vendors vetted?", "Every vendor passes a 12-point security, quality and SLA review before going live."],
      ["Can I compare products side-by-side?", "Yes. Add up to 5 products to the comparator from any listing card."],
      ["Is there a free trial?", "Most products offer a 14-day free trial with full feature access."],
    ]},
    { label: "Licensing FAQ", items: [
      ["Per-seat vs lifetime?", "Both are available; lifetime deals are listed in the Lifetime Deals zone."],
      ["Can I transfer a license?", "Yes, licenses are transferable once per 90 days from your console."],
      ["Volume discounts?", "Automatic from 25 seats; custom pricing from 250 seats."],
    ]},
  ];
  return (
    <section>
      <SectionTitle eyebrow="SECTION · 19" title="Frequently Asked" sub="Everything you need to buy with confidence." />
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {groups.map(g => (
          <div key={g.label} className="mp-card p-5">
            <div className="flex items-center gap-2">
              <HelpCircle size={16} className="text-[#00D4FF]" />
              <div className="text-[14px] font-semibold text-white">{g.label}</div>
            </div>
            <div className="mt-3 divide-y divide-white/5">
              {g.items.map(([q, a], i) => <FAQItem key={i} q={q} a={a} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3">
      <button onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between gap-3 text-left">
        <span className="text-[12.5px] font-medium text-white">{q}</span>
        {open ? <Minus size={14} className="text-[#00D4FF]" /> : <Plus size={14} className="text-white/50" />}
      </button>
      {open && <p className="mt-2 text-[12px] text-white/60">{a}</p>}
    </div>
  );
}

/* =========================================================================
   20 — Final CTA
   ========================================================================= */
function FinalCTA() {
  const ctas = [
    { t: "Explore Marketplace", d: "280,000+ products live.", I: ShoppingBag },
    { t: "Book a Demo",         d: "30-min guided walkthrough.", I: Play },
    { t: "Become a Partner",    d: "Reseller · vendor · franchise.", I: Handshake },
    { t: "Contact Team",        d: "We reply within 4 hours.", I: Headphones },
  ];
  return (
    <section className="relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#00D4FF]/15 via-[#8B5CFF]/15 to-[#FFD700]/10 p-10">
      <div className="absolute inset-0 mp-grid-bg opacity-30" />
      <div className="relative text-center">
        <div className="mp-eyebrow">SECTION · 20</div>
        <h2 className="mx-auto mt-2 max-w-2xl text-4xl font-bold text-white">Run your business on the world's most premium software marketplace.</h2>
        <p className="mx-auto mt-3 max-w-xl text-[14px] text-white/65">Built for enterprises, beloved by resellers and vendors. From boutique to billion-dollar.</p>
      </div>
      <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ctas.map(c => (
          <a key={c.t} href="#" className="mp-card group flex items-center gap-3 p-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#8B5CFF] text-[#050816]"><c.I size={18} /></div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-semibold text-white">{c.t}</div>
              <div className="truncate text-[11px] text-white/55">{c.d}</div>
            </div>
            <ArrowRight size={15} className="text-white/40 transition group-hover:translate-x-1 group-hover:text-white" />
          </a>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   Footer (420px)
   ========================================================================= */
function PageFooter() {
  const cols = [
    { t: "Marketplace", items: ["Home","All Software","Featured","Trending","New Launches","Top Rated"] },
    { t: "Industries", items: ["Education","Healthcare","Retail","Manufacturing","Hotel","Finance"] },
    { t: "Resources", items: ["Downloads","Events","Academy","Software Vala TV","Blog","Roadmap"] },
    { t: "Support", items: ["Help Center","Contact","Status","SLA","Community","Developers"] },
    { t: "Legal", items: ["Terms","Privacy","Cookies","DPA","Acceptable Use","Compliance"] },
  ];
  return (
    <footer className="mt-12 border-t border-white/5 bg-[#050816] text-white">
      <div className="mp-wrap mp-content py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#8B5CFF] text-[#050816]"><Crown size={18} /></div>
              <div className="text-[15px] font-bold">Software Vala</div>
            </div>
            <p className="mt-3 text-[12px] text-white/55">Enterprise software marketplace. 280k+ products, 142 countries, 125 languages.</p>
            <div className="mt-4 flex gap-2">
              {["X","in","fb","ig","yt"].map(s => (
                <a key={s} href="#" className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-[10px] font-bold uppercase text-white/70 hover:bg-white/5">{s}</a>
              ))}
            </div>
          </div>
          {cols.map(c => (
            <div key={c.t}>
              <div className="mb-3 text-[11px] font-mono uppercase tracking-[0.2em] text-[#00D4FF]">{c.t}</div>
              <ul className="space-y-1.5">
                {c.items.map(i => <li key={i}><a href="#" className="text-[12.5px] text-white/65 hover:text-white">{i}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 text-[11.5px] text-white/45 md:flex-row md:items-center">
          <span>© 2026 Software Vala · All rights reserved.</span>
          <span className="font-mono">SOC 2 · ISO 27001 · GDPR · HIPAA · PCI-DSS</span>
        </div>
      </div>
    </footer>
  );
}

