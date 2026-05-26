# Focus Pass: Modules 11–25 (Commerce / Monetization Spine)

## Scope

Upgrade the 15 commerce/monetization modules from their current shallow first-pass dashboards (~60–90 lines each) into deep, CodeCanyon-clone-specific operations dashboards — using ONLY the locked master shell, design tokens, animation system, and chart primitives. No new design system, no new routing, no new sidebar.

All 15 route files already exist as bespoke pages (not ModuleStub). This pass deepens them — it does not re-route or re-shell anything.

```text
11 /marketplace   → CodeCanyon Marketplace
12 /products      → CodeCanyon Product Manager
13 /billing       → CodeCanyon SaaS Billing
14 /payments      → CodeCanyon Multi-Gateway
15 /licenses      → CodeCanyon License Verification
16 /resellers     → CodeCanyon Reseller Mgmt
17 /franchise     → CodeCanyon Multi-Branch Franchise
18 /authors       → CodeCanyon Vendor Panel
19 /affiliates    → CodeCanyon Affiliate Mgmt
20 /influencers   → CodeCanyon Influencer Marketing
21 /white-label   → CodeCanyon White-Label SaaS
22 /saas          → CodeCanyon Multi-Tenant SaaS
23 /books         → CodeCanyon Accounting & Invoice
24 /customers     → CodeCanyon CRM
25 /orders        → CodeCanyon Order Mgmt
```

## What each dashboard gets (uniform structure)

Every page uses the same locked primitives so the system stays unified:

1. **PageHeader** — eyebrow `MODULE · NNN · <CLONE>`, title, subtitle, live-dot status pill.
2. **Metric strip** — 4 KPIs with sparklines (`Metric` + `MiniArea`), domain-correct labels and tones (success/warning/danger/market/ai).
3. **Primary telemetry panel** — `MultiLine` driven by `useLiveSeries` for realtime throughput / revenue / activations / orders.
4. **Secondary insight panel** — domain-specific: `Radial` (health/coverage), `Bars` (distribution), or stacked breakdown.
5. **Operational table / feed** — `FilterableTable` or a live activity stream with status badges, monospaced IDs, and SLA chips.
6. **Module spec / drill-in panel** — region, tier, SLA, integrations, deep links into related modules (e.g. Marketplace ↔ Authors ↔ Payments).

All colors come from `var(--primary|success|warning|danger|market|ai|info)`; no hardcoded hex.

## Per-module signature widgets

| # | Module | Signature widgets |
|---|---|---|
| 11 | Marketplace | GMV stream, top authors leaderboard, category mix, geo heat list |
| 12 | Products | Catalog health (stock/draft/published), top SKUs, price-change feed |
| 13 | Billing | MRR/ARR curve, churn vs expansion bars, dunning queue table |
| 14 | Payments | Gateway split (Stripe/Paddle/Razorpay/PayPal) radial, success rate, failed-txn feed |
| 15 | Licenses | Activation stream (already strong) + seat utilization bars, piracy block ticker |
| 16 | Resellers | Partner tiers radial, deal pipeline funnel, payout queue table |
| 17 | Franchise | Branch map list, per-branch revenue bars, SLA breach feed |
| 18 | Authors | Earnings curve, top-selling items, payout cycle countdown |
| 19 | Affiliates | Click→signup→paid funnel, top affiliates table, commission accrual |
| 20 | Influencers | Campaign ROI bars, reach vs engagement, post-approval queue |
| 21 | White Label | Tenant brand list, theme override coverage radial, custom-domain SSL feed |
| 22 | SaaS Tenants | Tenant health grid, resource utilization, provisioning queue |
| 23 | Books | P&L mini, AR aging bars, invoice status table (paid/overdue/draft) |
| 24 | Customers | Lifecycle stages bars, NPS radial, recent touchpoints feed |
| 25 | Orders | Order pipeline (placed→paid→fulfilled→delivered), refund queue, SLA timers |

## Cross-module wiring

- Add a small **"Connected modules"** strip at the bottom of each page (chips linking via `<Link>` to the related routes — e.g. Payments links to Billing, Licenses, Books). Pure presentation, uses existing `nav.ts` entries.
- No nav changes. No new routes. No new design tokens.

## Out of scope (this pass)

- Modules 1–10 (already covered) and 26+ (next pass).
- Backend / Lovable Cloud wiring — all data stays via `generateSeries` / `useLiveSeries` mock streams, matching the rest of the master system.
- No edits to `Shell`, `Sidebar`, `Topbar`, `nav.ts`, `routeTree.gen.ts`, or `ModuleStub`.

## Technical notes

- Files touched: exactly the 15 route files listed above.
- Primitives reused: `PageHeader`, `Panel`, `Metric`, `StatusDot` from `@/components/dash/primitives`; `MultiLine`, `MiniArea`, `Bars`, `Radial` from `@/components/dash/charts`; `FilterableTable` from `@/components/dash/FilterableTable`.
- Data: `generateSeries(n, seed, max, variance)` and `useLiveSeries(...)` from `@/lib/data` — unique seeds per module to keep curves visually distinct.
- Each route keeps its existing `createFileRoute("/...")` and `head()` block; only the component body is expanded.
- Hydration-safe: any time-based strings use `suppressHydrationWarning` (same pattern as `ModuleStub`).

## Deliverable

15 upgraded route files, each ~180–240 lines, visually consistent with `marketplace.tsx` / `licenses.tsx` but domain-specialized. All rendering inside the locked enterprise shell, all using the locked tokens and animation engine.
