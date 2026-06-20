import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Bell, Globe2, Bot, ChevronDown, Star,
  Sparkles, ArrowRight, CircleDot, Rocket, HelpCircle,
  Code2, Wallet, Inbox, Globe, Users, Briefcase, Video,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala — Enterprise Software Marketplace" },
      { name: "description", content: "Premium enterprise marketplace for ERP, CRM, HRMS, AI products. Buy, sell, resell, franchise." },
    ],
  }),
  component: HomePage,
});

/* ============ COMPONENT ============ */

function HomePage() {
  return (
    <main className="sv-root">
      <TopBar />
      <SubNav />

      <div className="sv-wrap">
        <HeroEmpty />

        <Section eyebrow="Quick actions" title="Choose your path">
          <EmptyState icon={Sparkles} label="No actions configured yet" />
        </Section>

        <Section eyebrow="Live ecosystem" title="The pulse of Software Vala">
          <EmptyState icon={CircleDot} label="No stats available yet" />
        </Section>

        <Section eyebrow="Featured software" title="Hand-picked enterprise products" cta="View all">
          <EmptyState icon={Inbox} label="No featured products yet" />
        </Section>

        <Section eyebrow="Industry marketplace" title="Software built for your sector" cta="All industries">
          <EmptyState icon={Inbox} label="No industries listed yet" />
        </Section>

        <Section eyebrow="What's hot this week" title="Trending Software" cta="See all">
          <EmptyState icon={Inbox} label="No trending products yet" />
        </Section>

        <Section eyebrow="Best sellers all-time" title="Top Selling Software" cta="See all">
          <EmptyState icon={Inbox} label="No top sellers yet" />
        </Section>

        <Section eyebrow="Fresh from vendors" title="New Releases" cta="See all">
          <EmptyState icon={Inbox} label="No new releases yet" />
        </Section>

        <Section eyebrow="AI Software Zone" title="Enterprise AI, ready to deploy">
          <EmptyState icon={Bot} label="No AI products published yet" />
        </Section>

        <Section eyebrow="Reseller opportunity" title="Build a software business in your city">
          <EmptyState icon={Inbox} label="No reseller data yet" />
        </Section>

        <Section eyebrow="Vendor market" title="Top vendors driving the marketplace" cta="All vendors">
          <EmptyState icon={Inbox} label="No vendors onboarded yet" />
        </Section>

        <Section eyebrow="Success stories" title="Real customers. Real outcomes." cta="Watch all">
          <EmptyState icon={Video} label="No stories published yet" />
        </Section>

        <Section eyebrow="Awards center" title="Marketplace champions">
          <EmptyState icon={Star} label="No awards announced yet" />
        </Section>

        <Section eyebrow="Live activity wall" title="Marketplace in motion">
          <EmptyState icon={CircleDot} label="No live activity yet" />
        </Section>

        <Section eyebrow="Software Vala TV" title="Watch, learn, deploy" cta="Open library">
          <EmptyState icon={Video} label="No videos published yet" />
        </Section>

        <Section eyebrow="Software Vala Academy" title="Get certified. Get hired. Get paid." cta="Browse academy">
          <EmptyState icon={Inbox} label="No courses available yet" />
        </Section>

        <Section eyebrow="Partner ecosystem" title="Ways to grow with Software Vala">
          <EmptyState icon={Inbox} label="No partner programs published yet" />
        </Section>

        <FAQ />

        <Section eyebrow="Ready to scale?" title="Where businesses buy enterprise software">
          <EmptyState icon={Rocket} label="No CTAs configured yet" />
        </Section>
      </div>

      <Footer />
    </main>
  );
}

/* ============ EMPTY STATE ============ */

function EmptyState({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number }>; label: string }) {
  return (
    <div className="sv-empty">
      <div className="sv-empty-icon"><Icon size={24} /></div>
      <p>{label}</p>
    </div>
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
          <input placeholder="Search products, vendors, industries…" />
          <kbd>⌘K</kbd>
        </label>

        <div className="sv-topactions">
          <button title="Language"><Globe2 size={15} /></button>
          <button title="Currency"><Wallet size={15} /></button>
          <button title="Notifications"><Bell size={15} /></button>
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

/* ============ HERO (empty / static) ============ */

function HeroEmpty() {
  return (
    <section className="sv-hero" style={{ "--hero-accent": "#00D4FF" } as React.CSSProperties}>
      <div className="sv-hero-bg" />
      <div className="sv-hero-grid" />
      <div className="sv-hero-content">
        <div className="sv-hero-left">
          <span className="sv-hero-eyebrow"><CircleDot size={10} /> Software Vala</span>
          <h1 className="sv-hero-title">Your enterprise software marketplace</h1>
          <p className="sv-hero-sub">Hero content will appear here once banners are published from the admin.</p>
          <div className="sv-hero-ctas">
            <button className="sv-btn-primary lg">Explore marketplace</button>
            <button className="sv-btn-ghost lg">Learn more <ArrowRight size={14} /></button>
          </div>
        </div>

        <div className="sv-hero-right">
          <div className="sv-hero-mockup">
            <div className="sv-mockup-glow" />
            <div className="sv-mockup-window">
              <div className="sv-mockup-bar"><i /><i /><i /></div>
              <div className="sv-mockup-body sv-empty" style={{ background: "transparent", border: "none" }}>
                <div className="sv-empty-icon"><Inbox size={24} /></div>
                <p>No banners yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ SECTION WRAPPER ============ */

function Section({ eyebrow, title, cta, children }: { eyebrow: string; title: string; cta?: string; children: React.ReactNode }) {
  return (
    <section className="sv-section">
      <SectionHead eyebrow={eyebrow} title={title} cta={cta} />
      {children}
    </section>
  );
}

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

/* ============ FAQ (kept — UI scaffolding, no mock metrics) ============ */

function FAQ() {
  const faqs = [
    { q: "How does enterprise licensing work?", a: "Per-user, per-site or unlimited; activate via license key or SSO." },
    { q: "What's covered in the marketplace warranty?", a: "Every product ships with a 30-day money-back guarantee and vendor support SLA." },
    { q: "Can resellers operate across multiple cities?", a: "Yes, multi-territory selling with transparent commission splits." },
    { q: "How do vendors get paid?", a: "Net-30 payouts in your local currency with revenue dashboards." },
  ];
  const [open, setOpen] = useState(-1);
  return (
    <section className="sv-section">
      <SectionHead eyebrow="FAQ" title="Common questions" />
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

/* ============ FOOTER ============ */

function Footer() {
  const cols = [
    { title: "Marketplace", links: ["All software", "Featured", "Trending", "New releases"] },
    { title: "Industries", links: ["Education", "Healthcare", "Retail", "Manufacturing"] },
    { title: "Resources", links: ["Blog", "Academy", "Software Vala TV", "Events"] },
    { title: "Support", links: ["Help center", "Contact", "Status", "Community"] },
    { title: "Legal", links: ["Terms", "Privacy", "Cookies", "Refund policy"] },
  ];
  return (
    <footer className="sv-footer">
      <div className="sv-footer-inner">
        <div className="sv-footer-brand">
          <a className="sv-logo" href="#">
            <span className="sv-logo-mark"><Code2 size={18} /></span>
            <span className="sv-logo-text"><b>Software</b><i>Vala</i></span>
          </a>
          <p>The world's premium enterprise software marketplace.</p>
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
    </footer>
  );
}
