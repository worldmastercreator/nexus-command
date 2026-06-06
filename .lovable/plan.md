# Software Vala Marketplace — Home Page Build Plan

## Scope
Replace the current `/` (home) route content with a full marketplace home page following the locked spec: 20 sections, fixed color system, large premium cards, Netflix/Envato/Apple hybrid feel. UI shell (sidebar/topbar) stays as-is; this is a route-level page build.

## Color System (locked)
- bg `#050816`, card `#0B1225`, blue `#00D4FF`, purple `#8B5CFF`, gold `#FFD700`, white `#FFFFFF`
- Add as CSS tokens in `src/styles.css` (scoped class `.mp-home`) so we do not disturb the global AEGIS theme used by other routes.

## Layout shell
- Max width 1600px, content 1480px, padding 24px, section gap 32px
- Page-local left sidebar (280px sticky glass) + main column. This is **in-page**, separate from the global app sidebar (keeps existing nav untouched).
- Page-local header strip (80px) with marketplace nav, global search 500px, lang/currency/notif/AI/login/register.

## Sections (in order)
1. Hero banner 420px, 8 slides auto-rotate 15s, left copy + right product mockup
2. Quick action cards (4 × 160px): Reseller / Vendor / Franchise / Author
3. Live ecosystem stats (6 animated counters)
4. Featured Software — Netflix row, 320×220 cards (image 70 / info 30)
5. Industry Marketplace — 4×3 grid (12 industries) large premium cards
6. Trending Software — horizontal slider 280×360
7. Top Selling — horizontal slider 280×360
8. New Releases — horizontal slider 280×360
9. AI Software Zone — neon premium grid (6 AI products)
10. Reseller Opportunity — 3 calculators + leaderboard + trophy wall
11. Vendor Market — top vendors / revenue / products / stories
12. Global Map — 650px full-width world map with heat clusters
13. Success Stories — video cards (4)
14. Awards Center — 3D trophy wall (5 awards)
15. Live Activity Wall — realtime feed
16. Software Vala TV — video library grid
17. Academy — courses/certifications/training/exams
18. Partner Ecosystem — 5 partner tiles
19. FAQ — 3 grouped accordions
20. Final CTA — 4 actions
+ Footer 420px

## Data
- Reuse `src/lib/imported/marketplaceData.ts` (`products`, `categories`) for featured/trending/top/new/industry sections. No new backend needed for v1.
- Stats / leaderboard / activity feed / awards / videos: in-file mock arrays (clearly typed) — honest mode, no fake DB claims.
- Global map: lightweight SVG world map with positioned dot clusters (no heavy lib).

## Files
- `src/routes/index.tsx` — replace with marketplace home (was placeholder/landing).
- `src/components/marketplace-home/` — one component per section (Hero, QuickActions, Stats, FeaturedRow, IndustryGrid, TrendingSlider, TopSellingSlider, NewReleasesSlider, AIZone, ResellerOpportunity, VendorMarket, GlobalMap, SuccessStories, AwardsWall, ActivityWall, TvLibrary, Academy, PartnerEcosystem, FAQ, FinalCTA, Footer, PageHeader, PageSidebar).
- `src/styles.css` — append `.mp-home` scoped tokens + utility classes (glass card, hover-lift-8, neon-glow, counter).

## Out of scope (this slice)
- Real backend wiring for stats/leaderboard/activity (mocked, labeled).
- 125-language i18n strings for new copy (English baseline; i18n keys can be added next slice).
- Functional global search / AI search / currency switcher (UI only).
- Real video playback (poster + play button placeholders).

Confirm and I'll build it straight through.
