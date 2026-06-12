import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Search, Bell, Globe2, Bot, ChevronDown, ShoppingCart, Play, Star,
  GraduationCap, Stethoscope, Store, Factory, HardHat, Hotel, Truck, Landmark,
  Heart, Home, Scale, Building2, Users, Package, KeyRound, RefreshCw, Briefcase,
  Sparkles, TrendingUp, Award, Trophy, MapPin, Video, BookOpen, HandshakeIcon,
  HelpCircle, ArrowRight, Calculator, BarChart3, Zap, Crown, Globe, PlayCircle,
  ChevronRight, Flame, Rocket, ShieldCheck, CircleDot, Activity, Cpu, Database,
  LineChart, Layers, Code2, Megaphone, Wallet, Boxes, Headphones, Mic,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala — Enterprise Software Marketplace" },
      { name: "description", content: "Premium enterprise marketplace for ERP, CRM, HRMS, AI products. Buy, sell, resell, franchise. Netflix-grade browsing for business software." },
      { property: "og:title", content: "Software Vala — Enterprise Software Marketplace" },
      { property: "og:description", content: "ERP, CRM, HRMS, AI products. Premium marketplace with vendor, reseller, franchise ecosystem." },
    ],
  }),
  component: HomePage,
});

/* ============ DATA ============ */

const heroBanners = [
  { eyebrow: "Enterprise ERP", title: "Run your entire company on one intelligent platform", sub: "Finance, supply chain, HR, manufacturing — orchestrated by AI.", cta: "Explore ERP suite", accent: "blue", icon: Database },
  { eyebrow: "CRM Suite", title: "Close more deals with predictive customer intelligence", sub: "Pipeline, automation, conversation AI in one console.", cta: "Launch CRM", accent: "purple", icon: Users },
  { eyebrow: "HRMS Platform", title: "From hire to retire, fully automated", sub: "Payroll, attendance, performance, compliance — globally.", cta: "Try HRMS", accent: "gold", icon: Briefcase },
  { eyebrow: "School ERP", title: "The complete operating system for modern education", sub: "Admissions, fees, academics, transport, parents — one app.", cta: "See School ERP", accent: "blue", icon: GraduationCap },
  { eyebrow: "Hospital ERP", title: "Patient-first hospital management, AI-powered", sub: "OPD, IPD, pharmacy, billing, insurance, diagnostics.", cta: "Discover Hospital", accent: "purple", icon: Stethoscope },
  { eyebrow: "Retail POS", title: "Sell anywhere — store, online, mobile, marketplace", sub: "Inventory, loyalty, accounting unified across channels.", cta: "Open Retail POS", accent: "gold", icon: Store },
  { eyebrow: "AI Products", title: "Plug enterprise AI into every workflow", sub: "Voice agents, document AI, analytics, copilots out of the box.", cta: "Browse AI", accent: "blue", icon: Bot },
  { eyebrow: "Marketplace", title: "Discover 2,400+ verified business products", sub: "From SMB to enterprise — every industry, every workflow.", cta: "Enter marketplace", accent: "purple", icon: Sparkles },
];

const quickActions = [
  { title: "Become a Reseller", sub: "Earn up to 40% commission selling vetted enterprise software.", icon: Megaphone, accent: "blue" },
  { title: "Become a Vendor", sub: "List your product on the world's premium B2B marketplace.", icon: Package, accent: "purple" },
  { title: "Become a Franchise", sub: "Own a territory. Build a software empire in your city.", icon: Crown, accent: "gold" },
  { title: "Become an Author", sub: "Publish training, courses, certifications and earn royalties.", icon: BookOpen, accent: "blue" },
];

const stats = [
  { label: "Products", value: 2487, suffix: "+", icon: Boxes },
  { label: "Customers", value: 184236, suffix: "", icon: Users },
  { label: "Licenses Active", value: 612480, suffix: "", icon: KeyRound },
  { label: "Renewals (30d)", value: 24910, suffix: "", icon: RefreshCw },
  { label: "Resellers", value: 4820, suffix: "", icon: Megaphone },
  { label: "Vendors", value: 1206, suffix: "", icon: Briefcase },
];

const featuredSoftware = [
  { name: "Aurora ERP Cloud", industry: "Manufacturing", rating: 4.9, price: 1299, accent: ["#00D4FF", "#8B5CFF"], icon: Factory },
  { name: "Pulse CRM Pro", industry: "Sales & Marketing", rating: 4.8, price: 89, accent: ["#8B5CFF", "#FFD700"], icon: TrendingUp },
  { name: "Helix HRMS", industry: "Human Resources", rating: 4.7, price: 199, accent: ["#FFD700", "#00D4FF"], icon: Users },
  { name: "Mediscope Hospital", industry: "Healthcare", rating: 4.9, price: 899, accent: ["#00D4FF", "#10B981"], icon: Stethoscope },
  { name: "Scholar360 School", industry: "Education", rating: 4.8, price: 349, accent: ["#8B5CFF", "#00D4FF"], icon: GraduationCap },
  { name: "Quantum POS", industry: "Retail", rating: 4.6, price: 79, accent: ["#FFD700", "#8B5CFF"], icon: Store },
];

const industries = [
  { name: "Education", count: 184, icon: GraduationCap, accent: "#00D4FF" },
  { name: "Healthcare", count: 142, icon: Stethoscope, accent: "#8B5CFF" },
  { name: "Retail", count: 218, icon: Store, accent: "#FFD700" },
  { name: "Manufacturing", count: 167, icon: Factory, accent: "#00D4FF" },
  { name: "Construction", count: 96, icon: HardHat, accent: "#8B5CFF" },
  { name: "Hotel", count: 88, icon: Hotel, accent: "#FFD700" },
  { name: "Transport", count: 74, icon: Truck, accent: "#00D4FF" },
  { name: "Finance", count: 156, icon: Landmark, accent: "#8B5CFF" },
  { name: "NGO", count: 42, icon: Heart, accent: "#FFD700" },
  { name: "Real Estate", count: 112, icon: Home, accent: "#00D4FF" },
  { name: "Legal", count: 68, icon: Scale, accent: "#8B5CFF" },
  { name: "Government", count: 54, icon: Building2, accent: "#FFD700" },
];

const trending = [
  { name: "NeuralChat Enterprise", downloads: "184K", customers: "12.4K", rating: 4.9, accent: ["#00D4FF", "#8B5CFF"], tag: "AI" },
  { name: "ForgeSign Contracts", downloads: "98K", customers: "8.1K", rating: 4.8, accent: ["#8B5CFF", "#FFD700"], tag: "Legal" },
  { name: "Vantage Analytics", downloads: "76K", customers: "5.6K", rating: 4.7, accent: ["#FFD700", "#00D4FF"], tag: "BI" },
  { name: "Orbit Project Suite", downloads: "112K", customers: "9.2K", rating: 4.8, accent: ["#00D4FF", "#10B981"], tag: "PM" },
  { name: "Pinnacle Accounting", downloads: "68K", customers: "4.8K", rating: 4.6, accent: ["#8B5CFF", "#00D4FF"], tag: "Finance" },
  { name: "Reach Marketing Cloud", downloads: "142K", customers: "11.3K", rating: 4.9, accent: ["#FFD700", "#8B5CFF"], tag: "Marketing" },
];

const aiZone = [
  { name: "AI CRM", sub: "Predictive deals + auto follow-ups", icon: Users },
  { name: "AI ERP", sub: "Autonomous finance & supply", icon: Database },
  { name: "AI HRMS", sub: "Skill mapping + hiring copilot", icon: Briefcase },
  { name: "AI Analytics", sub: "Natural-language BI assistant", icon: BarChart3 },
  { name: "AI Automation", sub: "Workflow agents across apps", icon: Zap },
  { name: "AI Support", sub: "24/7 voice + chat resolution", icon: Headphones },
];

const stories = [
  { title: "How Velora Foods scaled to 200 stores", role: "Customer Story", person: "Anita Verma, CIO", accent: "#00D4FF" },
  { title: "₹4.2 Cr earned in 18 months as reseller", role: "Reseller Story", person: "Rohit Patil, Pune", accent: "#8B5CFF" },
  { title: "Listing on SoftwareVala 10x'd our pipeline", role: "Vendor Story", person: "Sneha Iyer, Founder", accent: "#FFD700" },
  { title: "Franchise breakeven in 6 months — Jaipur", role: "Franchise Story", person: "Vikram Singh", accent: "#00D4FF" },
];

const liveFeed = [
  { type: "Customer", text: "Apex Logistics activated 240 licenses of Aurora ERP", color: "#00D4FF" },
  { type: "Reseller", text: "Rohit P. closed ₹18.4L deal in Pune territory", color: "#8B5CFF" },
  { type: "Vendor", text: "Helix HRMS published v4.2 release with payroll AI", color: "#FFD700" },
  { type: "Renewal", text: "Velora Foods renewed Pulse CRM Pro for 3 years", color: "#10B981" },
  { type: "Product", text: "New launch: AI Procurement Copilot by NorthOps", color: "#00D4FF" },
  { type: "Customer", text: "Bright Future School onboarded 4,800 students", color: "#8B5CFF" },
];

const awards = [
  { title: "Best Product 2026", name: "Aurora ERP Cloud", icon: Crown },
  { title: "Best Vendor 2026", name: "Helix Systems", icon: Trophy },
  { title: "Best Reseller", name: "Rohit Patil", icon: Award },
  { title: "Best Territory", name: "Pune Region", icon: MapPin },
  { title: "Global Champion", name: "Velora Foods", icon: Globe },
];

/* ============ COMPONENT ============ */

function HomePage() {
  return (
    <main className="sv-root">
      <TopBar />
      <SubNav />

      <div className="sv-wrap">
        <HeroBanner />

        <QuickActions />

        <LiveStats />

        <FeaturedSoftware />

        <IndustryGrid />

        <HorizontalRow title="Trending Software" eyebrow="What's hot this week" items={trending} accent="#00D4FF" />
        <HorizontalRow title="Top Selling Software" eyebrow="Best sellers all-time" items={trending.slice().reverse()} accent="#FFD700" />
        <HorizontalRow title="New Releases" eyebrow="Fresh from vendors" items={trending} accent="#8B5CFF" />

        <AIZone />

        <ResellerSection />

        <VendorMarket />

        <GlobalMap />

        <SuccessStories />

        <AwardsCenter />

        <LiveActivity />

        <SoftwareValaTV />

        <Academy />

        <PartnerEcosystem />

        <FAQ />

        <FinalCTA />
      </div>

      <Footer />
    </main>
  );
}

/* ============ HEADER ============ */

function TopBar() {
  return (
    <header className="sv-topbar">
      <div className="sv-topbar-inner">
        <a className="sv-logo" href="#">
          <span className="sv-logo-mark"><Code2 size={18} /></span>
          <span className="sv-logo-text"><b>Software</b><i>Vala</i></span>
        </a>

        <nav className="sv-topnav" aria-label="Primary">
          {["Marketplace", "Solutions", "Industries", "Products", "Resellers", "Vendors", "Franchise", "Authors"].map((l) => (
            <a key={l} href="#">{l}</a>
          ))}
        </nav>

        <label className="sv-search">
          <Search size={15} />
          <input placeholder="Search 2,400+ products, vendors, industries…" />
          <kbd>⌘K</kbd>
        </label>

        <div className="sv-topactions">
          <button title="Language"><Globe2 size={15} /></button>
          <button title="Currency"><Wallet size={15} /></button>
          <button title="Notifications"><Bell size={15} /><span className="sv-dot" /></button>
          <button title="AI search"><Bot size={15} /></button>
          <a className="sv-link" href="#">Login</a>
          <a className="sv-btn-primary" href="#">Register</a>
        </div>
      </div>
    </header>
  );
}

function SubNav() {
  const items = ["Marketplace Home", "Industries", "All Software", "Featured", "Trending", "New Launches", "Top Rated", "Best Sellers", "Lifetime Deals", "Subscriptions", "Downloads", "Events", "Support"];
  return (
    <div className="sv-subnav">
      <div className="sv-subnav-inner">
        {items.map((i, idx) => (
          <a key={i} href="#" className={idx === 0 ? "active" : ""}>{i}</a>
        ))}
      </div>
    </div>
  );
}

/* ============ HERO ============ */

function HeroBanner() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % heroBanners.length), 6000);
    return () => clearInterval(t);
  }, []);
  const b = heroBanners[idx];
  const Icon = b.icon;
  const accentColor = b.accent === "blue" ? "#00D4FF" : b.accent === "purple" ? "#8B5CFF" : "#FFD700";

  return (
    <section className="sv-hero" style={{ "--hero-accent": accentColor } as React.CSSProperties}>
      <div className="sv-hero-bg" />
      <div className="sv-hero-grid" />
      <div className="sv-hero-content">
        <div className="sv-hero-left">
          <span className="sv-hero-eyebrow"><CircleDot size={10} /> {b.eyebrow}</span>
          <h1 className="sv-hero-title">{b.title}</h1>
          <p className="sv-hero-sub">{b.sub}</p>
          <div className="sv-hero-ctas">
            <button className="sv-btn-primary lg"><Play size={14} fill="currentColor" /> {b.cta}</button>
            <button className="sv-btn-ghost lg">Book live demo <ArrowRight size={14} /></button>
          </div>
          <div className="sv-hero-trust">
            <span><ShieldCheck size={13} /> ISO 27001</span>
            <span><Users size={13} /> 184K+ businesses</span>
            <span><Star size={13} fill="currentColor" /> 4.9 avg rating</span>
          </div>
        </div>

        <div className="sv-hero-right">
          <div className="sv-hero-mockup">
            <div className="sv-mockup-glow" />
            <div className="sv-mockup-window">
              <div className="sv-mockup-bar"><i /><i /><i /></div>
              <div className="sv-mockup-body">
                <div className="sv-mockup-icon"><Icon size={42} /></div>
                <div className="sv-mockup-lines"><span style={{ width: "82%" }} /><span style={{ width: "64%" }} /><span style={{ width: "70%" }} /></div>
                <div className="sv-mockup-chart">
                  {[40, 65, 50, 78, 60, 88, 72].map((h, i) => <b key={i} style={{ height: `${h}%` }} />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sv-hero-dots">
        {heroBanners.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={i === idx ? "active" : ""} aria-label={`Banner ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

/* ============ QUICK ACTIONS ============ */

function QuickActions() {
  return (
    <section className="sv-quick">
      {quickActions.map((q) => {
        const Icon = q.icon;
        const color = q.accent === "blue" ? "#00D4FF" : q.accent === "purple" ? "#8B5CFF" : "#FFD700";
        return (
          <a key={q.title} href="#" className="sv-quick-card" style={{ "--c": color } as React.CSSProperties}>
            <div className="sv-quick-icon"><Icon size={22} /></div>
            <div>
              <h3>{q.title}</h3>
              <p>{q.sub}</p>
            </div>
            <ArrowRight size={16} className="sv-quick-arrow" />
          </a>
        );
      })}
    </section>
  );
}

/* ============ STATS ============ */

function useCounter(target: number, duration = 1400) {
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val.toLocaleString();
}

function StatCard({ s }: { s: typeof stats[number] }) {
  const v = useCounter(s.value);
  const Icon = s.icon;
  return (
    <div className="sv-stat-card">
      <div className="sv-stat-icon"><Icon size={18} /></div>
      <div className="sv-stat-num">{v}{s.suffix}</div>
      <div className="sv-stat-label">{s.label}</div>
      <div className="sv-stat-spark"><Activity size={12} /> live</div>
    </div>
  );
}

function LiveStats() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Live ecosystem" title="The pulse of Software Vala — right now" />
      <div className="sv-stats">{stats.map((s) => <StatCard key={s.label} s={s} />)}</div>
    </section>
  );
}

/* ============ FEATURED (Netflix row) ============ */

function FeaturedSoftware() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Featured software" title="Hand-picked enterprise products" cta="View all" />
      <div className="sv-featured-row sv-scroll">
        {featuredSoftware.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.name} className="sv-featured-card">
              <div className="sv-featured-art" style={{ background: `linear-gradient(135deg, ${p.accent[0]} 0%, ${p.accent[1]} 100%)` }}>
                <Icon size={56} strokeWidth={1.4} />
                <span className="sv-featured-badge"><Star size={10} fill="currentColor" /> {p.rating}</span>
              </div>
              <div className="sv-featured-info">
                <h3>{p.name}</h3>
                <div className="sv-featured-meta">
                  <span>{p.industry}</span>
                  <strong>${p.price}<i>/mo</i></strong>
                </div>
                <div className="sv-featured-actions">
                  <button className="sv-chip"><PlayCircle size={12} /> Demo</button>
                  <button className="sv-chip">Compare</button>
                  <button className="sv-chip primary">View <ChevronRight size={12} /></button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ============ INDUSTRY GRID ============ */

function IndustryGrid() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Industry marketplace" title="Software built for your sector" cta="All industries" />
      <div className="sv-industry-grid">
        {industries.map((i) => {
          const Icon = i.icon;
          return (
            <a key={i.name} href="#" className="sv-industry-card" style={{ "--c": i.accent } as React.CSSProperties}>
              <div className="sv-industry-icon"><Icon size={26} /></div>
              <div>
                <h3>{i.name}</h3>
                <p>{i.count} products</p>
              </div>
              <ChevronRight size={16} className="sv-industry-arrow" />
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ============ HORIZONTAL ROW (Trending / Top / New) ============ */

function HorizontalRow({ title, eyebrow, items, accent }: { title: string; eyebrow: string; items: typeof trending; accent: string }) {
  return (
    <section className="sv-section">
      <SectionHead eyebrow={eyebrow} title={title} cta="See all" />
      <div className="sv-hrow sv-scroll">
        {items.map((it, i) => (
          <article key={it.name + i} className="sv-hrow-card">
            <div className="sv-hrow-art" style={{ background: `linear-gradient(140deg, ${it.accent[0]} 0%, ${it.accent[1]} 100%)` }}>
              <span className="sv-hrow-tag" style={{ background: accent, color: "#050816" }}>{it.tag}</span>
              <div className="sv-hrow-mock">
                <i /><i /><i />
                <b style={{ width: "80%" }} /><b style={{ width: "60%" }} /><b style={{ width: "72%" }} />
              </div>
            </div>
            <div className="sv-hrow-info">
              <h3>{it.name}</h3>
              <div className="sv-hrow-meta">
                <span><Star size={11} fill="currentColor" /> {it.rating}</span>
                <span><Users size={11} /> {it.customers}</span>
                <span><TrendingUp size={11} /> {it.downloads}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============ AI ZONE ============ */

function AIZone() {
  return (
    <section className="sv-section">
      <div className="sv-ai-wrap">
        <div className="sv-ai-bg" />
        <div className="sv-ai-head">
          <span className="sv-eyebrow neon"><Sparkles size={11} /> AI Software Zone</span>
          <h2 className="sv-h2">Enterprise AI, ready to deploy</h2>
          <p className="sv-sub">Six neural-powered suites that plug into your stack and start working from day one.</p>
        </div>
        <div className="sv-ai-grid">
          {aiZone.map((a) => {
            const Icon = a.icon;
            return (
              <a key={a.name} href="#" className="sv-ai-card">
                <div className="sv-ai-icon"><Icon size={22} /></div>
                <h3>{a.name}</h3>
                <p>{a.sub}</p>
                <span className="sv-ai-link">Deploy now <ArrowRight size={12} /></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ RESELLER ============ */

function ResellerSection() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Reseller opportunity" title="Build a software business in your city" />
      <div className="sv-reseller">
        <div className="sv-calc">
          <h3><Calculator size={16} /> Revenue calculator</h3>
          <div className="sv-calc-stat"><span>Avg deal size</span><b>₹2.4L</b></div>
          <div className="sv-calc-stat"><span>Commission</span><b className="gold">40%</b></div>
          <div className="sv-calc-stat"><span>Deals / month</span><b>8</b></div>
          <div className="sv-calc-result">
            <span>Est. monthly earning</span>
            <strong>₹7.68 L</strong>
          </div>
          <button className="sv-btn-primary">Start as reseller <ArrowRight size={14} /></button>
        </div>

        <div className="sv-leaderboard">
          <h3><Trophy size={16} /> Top resellers this month</h3>
          {[
            { name: "Rohit Patil", city: "Pune", rev: "₹18.4L", rank: 1 },
            { name: "Anita Sharma", city: "Bengaluru", rev: "₹14.2L", rank: 2 },
            { name: "Vikram Singh", city: "Jaipur", rev: "₹11.8L", rank: 3 },
            { name: "Priya Nair", city: "Kochi", rev: "₹9.6L", rank: 4 },
            { name: "Arjun Mehta", city: "Mumbai", rev: "₹8.9L", rank: 5 },
          ].map((r) => (
            <div key={r.name} className="sv-lb-row">
              <span className={`sv-rank rank-${r.rank}`}>#{r.rank}</span>
              <div className="sv-lb-name">
                <b>{r.name}</b>
                <em>{r.city}</em>
              </div>
              <span className="sv-lb-rev">{r.rev}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ VENDOR MARKET ============ */

function VendorMarket() {
  const vendors = [
    { name: "Helix Systems", products: 14, revenue: "₹4.2 Cr", growth: "+38%" },
    { name: "NorthOps Labs", products: 9, revenue: "₹2.8 Cr", growth: "+62%" },
    { name: "Aurora Cloud", products: 22, revenue: "₹6.4 Cr", growth: "+24%" },
    { name: "Pulse Digital", products: 11, revenue: "₹3.1 Cr", growth: "+48%" },
  ];
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Vendor market" title="Top vendors driving the marketplace" cta="All vendors" />
      <div className="sv-vendor-grid">
        {vendors.map((v) => (
          <div key={v.name} className="sv-vendor-card">
            <div className="sv-vendor-head">
              <div className="sv-vendor-logo">{v.name[0]}</div>
              <div>
                <h3>{v.name}</h3>
                <p>Verified vendor • {v.products} products</p>
              </div>
            </div>
            <div className="sv-vendor-stats">
              <div><span>Revenue</span><b>{v.revenue}</b></div>
              <div><span>Growth</span><b className="green">{v.growth}</b></div>
            </div>
            <button className="sv-btn-ghost">View products <ChevronRight size={12} /></button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ GLOBAL MAP ============ */

function GlobalMap() {
  const dots = Array.from({ length: 42 }, (_, i) => ({
    x: 8 + (i * 73) % 92,
    y: 12 + (i * 47) % 76,
    s: (i % 3) + 1,
  }));
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Global presence" title="Software Vala across the world" />
      <div className="sv-map">
        <div className="sv-map-grid" />
        <svg viewBox="0 0 100 60" className="sv-map-svg" preserveAspectRatio="none">
          {dots.map((d, i) => (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r={d.s * 0.6} fill="#00D4FF" opacity="0.8">
                <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2 + (i % 3)}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={d.x} cy={d.y} r={d.s * 2} fill="none" stroke="#00D4FF" strokeWidth="0.15" opacity="0.4">
                <animate attributeName="r" values={`${d.s * 0.6};${d.s * 4};${d.s * 0.6}`} dur={`${3 + (i % 2)}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
        <div className="sv-map-legend">
          {[
            { label: "Customers", value: "184K+", c: "#00D4FF" },
            { label: "Revenue", value: "$48M", c: "#FFD700" },
            { label: "Licenses", value: "612K", c: "#8B5CFF" },
            { label: "Resellers", value: "4.8K", c: "#10B981" },
            { label: "Vendors", value: "1.2K", c: "#00D4FF" },
            { label: "Franchises", value: "284", c: "#FFD700" },
          ].map((m) => (
            <div key={m.label} className="sv-map-stat">
              <span className="sv-dot-c" style={{ background: m.c }} />
              <em>{m.label}</em>
              <b>{m.value}</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ SUCCESS STORIES ============ */

function SuccessStories() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Success stories" title="Real customers. Real outcomes." cta="Watch all" />
      <div className="sv-stories">
        {stories.map((s) => (
          <article key={s.title} className="sv-story-card" style={{ "--c": s.accent } as React.CSSProperties}>
            <div className="sv-story-thumb">
              <button className="sv-play"><Play size={20} fill="currentColor" /></button>
              <span className="sv-story-role">{s.role}</span>
            </div>
            <h3>{s.title}</h3>
            <p>— {s.person}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============ AWARDS ============ */

function AwardsCenter() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Awards center" title="2026 marketplace champions" />
      <div className="sv-awards">
        {awards.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={a.title} className={`sv-award ${i === 4 ? "champion" : ""}`}>
              <div className="sv-award-glow" />
              <Icon size={36} />
              <span>{a.title}</span>
              <strong>{a.name}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ LIVE ACTIVITY ============ */

function LiveActivity() {
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Live activity wall" title="Marketplace in motion" />
      <div className="sv-feed">
        {[...liveFeed, ...liveFeed].map((f, i) => (
          <div key={i} className="sv-feed-row">
            <span className="sv-feed-pulse" style={{ background: f.color }} />
            <em style={{ color: f.color }}>{f.type}</em>
            <p>{f.text}</p>
            <span className="sv-feed-time">{i < 6 ? `${i + 1}m ago` : `${i}m ago`}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ SOFTWARE VALA TV ============ */

function SoftwareValaTV() {
  const videos = [
    { title: "Aurora ERP — full product tour", duration: "12:48", type: "Demo" },
    { title: "Build a reseller business in 90 days", duration: "28:14", type: "Training" },
    { title: "AI Procurement: live walkthrough", duration: "18:32", type: "Webinar" },
    { title: "School ERP rollout — case study", duration: "22:06", type: "Story" },
  ];
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Software Vala TV" title="Watch, learn, deploy" cta="Open library" />
      <div className="sv-tv">
        {videos.map((v, i) => (
          <article key={v.title} className="sv-tv-card">
            <div className="sv-tv-thumb" style={{ background: `linear-gradient(135deg, ${["#00D4FF","#8B5CFF","#FFD700","#10B981"][i]}, #0B1225)` }}>
              <Video size={28} />
              <span className="sv-tv-duration">{v.duration}</span>
            </div>
            <span className="sv-tv-type">{v.type}</span>
            <h3>{v.title}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ============ ACADEMY ============ */

function Academy() {
  const items = [
    { title: "Marketplace Foundations", type: "Course", count: "12 lessons", icon: BookOpen },
    { title: "Certified Reseller Pro", type: "Certification", count: "Exam included", icon: Award },
    { title: "Vendor Mastery Track", type: "Training", count: "8 modules", icon: Layers },
    { title: "AI Implementation Exam", type: "Exam", count: "60 minutes", icon: Cpu },
  ];
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Software Vala Academy" title="Get certified. Get hired. Get paid." cta="Browse academy" />
      <div className="sv-academy">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <div key={it.title} className="sv-academy-card">
              <div className="sv-academy-icon"><Icon size={20} /></div>
              <span className="sv-academy-type">{it.type}</span>
              <h3>{it.title}</h3>
              <p>{it.count}</p>
              <button className="sv-btn-ghost sm">Enroll <ChevronRight size={12} /></button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ PARTNER ECOSYSTEM ============ */

function PartnerEcosystem() {
  const partners = [
    { name: "Reseller", desc: "Sell software, earn commission", icon: Megaphone, c: "#00D4FF" },
    { name: "Vendor", desc: "Publish & monetize products", icon: Package, c: "#8B5CFF" },
    { name: "Franchise", desc: "Own a territory", icon: Crown, c: "#FFD700" },
    { name: "Author", desc: "Publish learning content", icon: BookOpen, c: "#10B981" },
    { name: "Affiliate", desc: "Earn from referrals", icon: HandshakeIcon, c: "#00D4FF" },
  ];
  return (
    <section className="sv-section">
      <SectionHead eyebrow="Partner ecosystem" title="Five ways to grow with Software Vala" />
      <div className="sv-partners">
        {partners.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="sv-partner" style={{ "--c": p.c } as React.CSSProperties}>
              <Icon size={28} />
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <ArrowRight size={14} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ FAQ ============ */

function FAQ() {
  const faqs = [
    { q: "How does enterprise licensing work?", a: "Per-user, per-site or unlimited; activate via license key or SSO. Compliance reports included." },
    { q: "What's covered in the marketplace warranty?", a: "Every product ships with a 30-day money-back guarantee and 12-month vendor support SLA." },
    { q: "Can resellers operate across multiple cities?", a: "Yes, the marketplace supports multi-territory selling with transparent commission splits." },
    { q: "How do vendors get paid?", a: "Net-30 payouts in your local currency, with revenue dashboards and tax compliance built in." },
    { q: "Is SOC2 / ISO compliance available?", a: "Most enterprise products are SOC2 Type II and ISO 27001 certified. Filter by compliance in search." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="sv-section">
      <SectionHead eyebrow="FAQ" title="Enterprise, marketplace, licensing — answered" />
      <div className="sv-faq">
        {faqs.map((f, i) => (
          <button key={f.q} className={`sv-faq-item ${open === i ? "open" : ""}`} onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="sv-faq-q">
              <HelpCircle size={16} />
              <span>{f.q}</span>
              <ChevronDown size={16} className="sv-faq-chev" />
            </div>
            {open === i && <p className="sv-faq-a">{f.a}</p>}
          </button>
        ))}
      </div>
    </section>
  );
}

/* ============ FINAL CTA ============ */

function FinalCTA() {
  const ctas = [
    { title: "Explore Marketplace", sub: "2,400+ products waiting", icon: Sparkles, c: "#00D4FF" },
    { title: "Book a Demo", sub: "30-min personalized tour", icon: Video, c: "#8B5CFF" },
    { title: "Become a Partner", sub: "Reseller / Vendor / Franchise", icon: HandshakeIcon, c: "#FFD700" },
    { title: "Contact Team", sub: "Talk to a specialist", icon: Mic, c: "#10B981" },
  ];
  return (
    <section className="sv-section">
      <div className="sv-finalcta">
        <div className="sv-finalcta-bg" />
        <span className="sv-eyebrow neon"><Rocket size={11} /> Ready to scale?</span>
        <h2>Where India's businesses buy enterprise software</h2>
        <p>Join 184,000+ companies running on Software Vala. Pick your path below.</p>
        <div className="sv-finalcta-grid">
          {ctas.map((c) => {
            const Icon = c.icon;
            return (
              <a key={c.title} href="#" className="sv-finalcta-card" style={{ "--c": c.c } as React.CSSProperties}>
                <Icon size={22} />
                <strong>{c.title}</strong>
                <span>{c.sub}</span>
                <ArrowRight size={14} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION HEAD ============ */

function SectionHead({ eyebrow, title, cta }: { eyebrow: string; title: string; cta?: string }) {
  return (
    <div className="sv-section-head">
      <div>
        <span className="sv-eyebrow"><CircleDot size={9} /> {eyebrow}</span>
        <h2 className="sv-h2">{title}</h2>
      </div>
      {cta && <a className="sv-section-cta" href="#">{cta} <ArrowRight size={13} /></a>}
    </div>
  );
}

/* ============ FOOTER ============ */

function Footer() {
  const cols = [
    { title: "Marketplace", links: ["All software", "Featured", "Trending", "New releases", "Top rated", "Lifetime deals"] },
    { title: "Industries", links: ["Education", "Healthcare", "Retail", "Manufacturing", "Hotel", "Finance"] },
    { title: "Resources", links: ["Blog", "Academy", "Software Vala TV", "Events", "Documentation", "API"] },
    { title: "Support", links: ["Help center", "Contact", "Status", "Community", "Partner portal"] },
    { title: "Legal", links: ["Terms", "Privacy", "Cookies", "GDPR", "Refund policy"] },
  ];
  return (
    <footer className="sv-footer">
      <div className="sv-footer-inner">
        <div className="sv-footer-brand">
          <a className="sv-logo" href="#">
            <span className="sv-logo-mark"><Code2 size={18} /></span>
            <span className="sv-logo-text"><b>Software</b><i>Vala</i></span>
          </a>
          <p>The world's premium enterprise software marketplace. Buy, sell, resell, franchise — all in one place.</p>
          <div className="sv-footer-social">
            {[Globe, Users, Briefcase, Video].map((I, i) => <a key={i} href="#"><I size={14} /></a>)}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="sv-footer-col">
            <h4>{c.title}</h4>
            {c.links.map((l) => <a key={l} href="#">{l}</a>)}
          </div>
        ))}
      </div>
      <div className="sv-footer-bottom">
        <span>© 2026 Software Vala. All rights reserved.</span>
        <span>Made for enterprises. Trusted by 184K+ businesses.</span>
      </div>
    </footer>
  );
}
