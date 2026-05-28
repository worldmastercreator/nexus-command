# Master Integration & Live-Wiring Plan

Goal: turn the merged codebase into one coherent system — master UI bound to real data/logic, single auth, no dead routes, no dummy data.

Scope is realistic for this stack (TanStack Start + Lovable Cloud). No new backend framework, no Socket.IO server (use Supabase Realtime), no rewrites of working modules.

---

## Phase 1 — Source Inventory (read-only audit)

Produce `.lovable/audit.md` listing:
- Every route file under `src/routes/` → status (real page | ModuleStub | alias | dead).
- Every module in `src/lib/imported/*` → what it exports, who imports it, duplicate detection.
- Every nav entry in `src/lib/nav.ts` → mapped route, `built` flag accuracy.
- Auth surfaces found: `AuthContext` (localStorage), `seedAuth`, `roles`, Supabase client. Pick one.
- Data sources: mock (`marketplaceData`, `mockData`, `productStore`), `apiClient` (BACKEND_ENABLED=false), Supabase. Pick one per module.

Deliverable: a single table mapping `UI page → data source → backend status → action (keep/merge/delete)`.

## Phase 2 — Pick the Locked Stack (decisions, no code)

Lock-in (subject to your confirmation):
- **Auth**: Lovable Cloud (Supabase) only. `AuthContext` + `seedAuth` localStorage flow becomes a thin adapter over `supabase.auth`. Roles via `user_roles` table + `has_role()` RPC.
- **Data**: Supabase tables generated from `src/lib/imported/schema.sql`. `apiClient.BACKEND_ENABLED` removed; all reads/writes go through server functions in `src/lib/*.functions.ts`.
- **Realtime**: Supabase Realtime channels (no custom websocket server).
- **Routing**: TanStack file-routes only. `ModuleStub` routes either get a real page or get deleted from `nav.ts`.

## Phase 3 — Cleanup Pass

- Delete duplicate `erp.*` ModuleStub routes that mirror real top-level routes (e.g. `/erp/marketplace*` when `/marketplace` exists).
- Collapse `control-panel/$module` alias if not used by nav.
- Remove `src/lib/imported/api.ts` legacy paths once server fns replace them.
- Single auth provider in `__root.tsx`; delete the localStorage-only `AuthContext` usage paths.

## Phase 4 — Enable Lovable Cloud + Schema

- Enable Cloud.
- Migrate `schema.sql` to Postgres migrations (rename MySQL types, add RLS + GRANTs, add `user_roles` + `app_role` enum + `has_role()`).
- Seed minimal demo data for marketplace/products/orders so dashboards render real numbers.

## Phase 5 — Wire Modules 11–25 to Real Data

For each of Marketplace, Products, Billing, Payments, Licenses, Resellers, Franchise, Authors, Affiliates, Influencers, White Label, SaaS, Books, Customers, Orders:
1. Replace mock arrays with a `useSuspenseQuery` against a `createServerFn` reading from Supabase.
2. Keep existing `FilterableTable` / `charts` / `ConnectedModules` primitives.
3. Bind one primary write action per module (create/update) to a real mutation.
4. Subscribe the KPI strip to a Realtime channel so cards update live.

## Phase 6 — Role-Aware Shell

- `Sidebar` + `Topbar` already locked — filter nav items by `has_role`.
- Add `_authenticated` layout guard; redirect unauth → `/login`.
- Login page calls `supabase.auth.signInWithPassword`; seeded demo creds (`seedAuth`) get inserted as real auth users during migration.

## Phase 7 — Validation

- Click-through script (manual or Playwright-light) over every nav entry: expect non-empty render, no console error, at least one real network call.
- Strip remaining `ModuleStub` usages from `nav.ts` (mark `built: false` or remove).
- Final `.lovable/audit.md` rerun showing 0 dead routes, 0 duplicate modules.

---

## Technical Notes

- No Socket.IO, no Prisma, no custom Express — they don't exist in this template and adding them breaks the Worker runtime.
- `process.env` only inside `.handler()` of server fns; never at module scope.
- All new public tables need `GRANT` + RLS in the same migration.
- Animation engine, color tokens, sidebar/topbar, `ConnectedModules`, `primitives`, `charts`, `FilterableTable` stay as-is — they're the locked design system.

---

## Open Questions (please confirm before I build)

1. **Auth migration**: OK to drop the localStorage `AuthContext` and move every login to Supabase Auth? Seeded demo accounts will be recreated as real users.
2. **Scope of Phase 5**: wire all 15 modules in one pass, or start with Marketplace + Orders + Payments + Customers and iterate?
3. **Delete vs hide**: should ModuleStub routes that have no real implementation be deleted, or kept hidden from the sidebar until built?
4. **Realtime**: enable Supabase Realtime on KPI tables now, or defer until after static data is wired?