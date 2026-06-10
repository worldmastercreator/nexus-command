import { createFileRoute } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { Search, Bell, Globe2, Play, Star, ChevronDown, ShoppingCart, Code2, Building2, Bot, Users, ShieldCheck, ArrowRight } from "lucide-react";
import { products } from "@/lib/imported/marketplaceData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala Marketplace" },
      { name: "description", content: "Premium enterprise software marketplace for buying ERP, CRM, AI, ecommerce, education and industry-ready products." },
      { property: "og:title", content: "Software Vala Marketplace" },
      { property: "og:description", content: "Browse premium software products, vendor tools, reseller offers and enterprise solutions." },
    ],
  }),
  component: HomePage,
});

const heroProduct = products[1];
const productGrid = products.slice(0, 8);

function HomePage() {
  return (
    <main className="mp-home-page min-h-screen overflow-x-hidden">
      <div className="mp-stage">
        <section className="mp-reference-card">
          <MarketplaceNav />
          <Hero />
          <DealStrip />
          <MarketplaceFilters />
          <ProductPosterGrid />
          <MarketplaceFooter />
        </section>
      </div>
    </main>
  );
}

function MarketplaceNav() {
  return (
    <header className="mp-ref-nav">
      <a href="#" className="mp-ref-logo" aria-label="Software Vala home">
        <span className="mp-ref-logo-mark"><Code2 size={16} /></span>
        <span><b>Software</b><i>Vala</i></span>
      </a>
      <nav className="mp-ref-links" aria-label="Marketplace navigation">
        {['Main', 'Software', 'News', 'Contacts'].map((item) => <a key={item} href="#">{item}</a>)}
      </nav>
      <div className="mp-ref-actions">
        <button aria-label="Language"><Globe2 size={15} /></button>
        <button aria-label="Notifications"><Bell size={15} /></button>
        <a href="#">Log in</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mp-ref-hero">
      <div className="mp-ref-hero-art" />
      <div className="mp-ref-hero-copy">
        <div className="mp-ref-year">2026.</div>
        <h1>Software Vala marketplace</h1>
        <p>Buy premium business software, compare trusted vendors, activate licenses and scale operations from one enterprise marketplace.</p>
        <button className="mp-ref-play"><Play size={14} fill="currentColor" /> Watch demo</button>
      </div>
      <article className="mp-ref-feature-poster">
        <PosterVisual product={heroProduct} featured />
        <div>
          <span>Featured suite</span>
          <strong>{heroProduct.name}</strong>
        </div>
      </article>
    </section>
  );
}

function DealStrip() {
  return (
    <section className="mp-ref-strip" aria-label="Marketplace quick actions">
      <div>
        <span>Choose role</span>
        <div className="mp-ref-options"><b>Buyer</b><b>Vendor</b><b>Reseller</b></div>
      </div>
      <div>
        <span>Choose plan</span>
        <div className="mp-ref-options"><b>Trial</b><b>Lifetime</b><b>Enterprise</b></div>
      </div>
      <button className="mp-ref-buy"><ShoppingCart size={15} /> Buy software</button>
    </section>
  );
}

function MarketplaceFilters() {
  return (
    <section className="mp-ref-filterbar" aria-label="Software filters">
      <div className="mp-ref-filter-tabs">
        {['All software', 'By date', 'By category', 'Coming soon'].map((item, index) => (
          <button key={item} className={index === 0 ? 'active' : ''}>{item} {index < 3 && <ChevronDown size={11} />}</button>
        ))}
      </div>
      <label className="mp-ref-search">
        <input aria-label="Search software" placeholder="Search software" />
        <Search size={15} />
      </label>
    </section>
  );
}

function ProductPosterGrid() {
  return (
    <section className="mp-ref-products" aria-label="Software products">
      {productGrid.map((product, index) => (
        <article key={product.id} className="mp-ref-product-card">
          <div className="mp-ref-poster">
            <PosterVisual product={product} />
            <span>{product.status}</span>
          </div>
          <h2>{product.name}</h2>
          <div className="mp-ref-meta">
            <span><Star size={11} fill="currentColor" /> {product.rating.toFixed(1)}</span>
            <span>${product.price}</span>
            <span>{product.category}</span>
          </div>
        </article>
      ))}
      <div className="mp-ref-more-row"><button>Show more</button></div>
    </section>
  );
}

function PosterVisual({ product, featured = false }: { product: typeof products[number]; featured?: boolean }) {
  const palette = getPosterPalette(product.categorySlug);
  return (
    <div className={`mp-poster-art ${featured ? 'featured' : ''}`} style={{ '--poster-a': palette[0], '--poster-b': palette[1], '--poster-c': palette[2] } as CSSProperties} aria-label={`${product.name} preview`}>
      <div className="mp-poster-orbit" />
      <div className="mp-poster-window">
        <i /><i /><i />
        <strong>{product.category.split(' ')[0]}</strong>
        <em>{product.name.split(' ').map((word) => word[0]).join('').slice(0, 3)}</em>
      </div>
      <div className="mp-poster-bars"><b /><b /><b /></div>
      <p>{product.name}</p>
    </div>
  );
}

function getPosterPalette(slug: string) {
  const palettes: Record<string, [string, string, string]> = {
    education: ['#2dd4bf', '#2563eb', '#0f172a'],
    medical: ['#38bdf8', '#ef4444', '#111827'],
    hotel: ['#f59e0b', '#dc2626', '#18181b'],
    ecommerce: ['#a855f7', '#ec4899', '#111827'],
    services: ['#22c55e', '#14b8a6', '#0f172a'],
    manufacturing: ['#f97316', '#64748b', '#111827'],
  };
  return palettes[slug] ?? ['#ff1717', '#64748b', '#101216'];
}

function MarketplaceFooter() {
  return (
    <footer className="mp-ref-footer">
      <a href="#" className="mp-ref-logo"><span className="mp-ref-logo-mark"><Code2 size={16} /></span><span><b>Software</b><i>Vala</i></span></a>
      <nav aria-label="Footer navigation">{['Main', 'Software', 'News', 'Contacts'].map((item) => <a key={item} href="#">{item}</a>)}</nav>
      <div className="mp-ref-social"><Building2 size={15} /><Bot size={15} /><Users size={15} /><ShieldCheck size={15} /></div>
    </footer>
  );
}