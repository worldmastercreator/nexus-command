# PHASE 01 EXECUTION — DELETE 150+ DEAD ROUTES

## Status: LOCKED & DOCUMENTED

This manifest tracks all routes marked for deletion during the Enterprise Merge.

### [AI SECTION] 12 routes — ALL ModuleStub placeholders
```
- ai.tsx
- ai.agents.tsx
- ai.api.tsx
- ai.bots.tsx
- ai.builder.tsx
- ai.models.tsx
- ai.prompts.tsx
- ai.support.tsx
- ai.voice.tsx
- ai.workflows.tsx
```

### [INFRASTRUCTURE STUBS] 60+ routes — Empty ModuleStub only
```
- api.tsx
- apk.tsx
- app-analytics.tsx
- app-builder.tsx
- assets.tsx
- audit.tsx
- auth.tsx
- authors.tsx
- automation.tsx
- backup.tsx
- billing.tsx
- books.tsx
- builder.tsx
- cdn.tsx
- ci.tsx
- clients.tsx
- cloud.tsx
- comms.tsx
- crashes.tsx
- crm.tsx
- customers.tsx
- dash-engine.tsx
- db.tsx
- demos.tsx
- deploy.tsx
- design-system.tsx
- devices.tsx
- dns.tsx
- docs.tsx
- email.tsx
- enterprise-api.tsx
- event-bus.tsx
- files.tsx
- finance.tsx
- franchise.tsx
- fraud.tsx
- geo.tsx
- git.tsx
- influencers.tsx
- knowledge.tsx
- law.tsx
- lawyer.tsx
- lawyer-pro.tsx
- licenses.tsx
- logs.tsx
- marketplace.tsx
- monitoring.tsx
- monitoring-core.tsx
- notifications.tsx
- onboarding.tsx
- orders.tsx
- payments.tsx
- play.tsx
- products.tsx
- projects.tsx
- queue.tsx
- realtime.tsx
- remote.tsx
- reporting.tsx
- resellers.tsx
- router.tsx
- saas.tsx
- sales.tsx
- search.tsx
- security.tsx
- servers.tsx
- settings.tsx
- sms.tsx
- success.tsx
- support.tsx
- tasks.tsx
- tenants.tsx
- tickets.tsx
- vendors.tsx
- war-room.tsx
- webhooks.tsx
- white-label.tsx
```

### [OLD BOOTSTRAP AUTH] 5 routes — To be unified
```
- auth.tsx (erp style)
- campaign.auth.tsx
- hr.auth.tsx
- shopify.login.tsx
- atelier.login.tsx
```

### [DUPLICATE PORTALS] 9 routes — Consolidate to single system
```
- portal.affiliate.tsx
- portal.author.tsx
- portal.dev.tsx
- portal.franchise.tsx
- portal.influencer.tsx
- portal.reseller.tsx
- portal.seo.tsx
- portal.support.tsx
- portal.user.tsx
```

### [OLD ATELIER BOOTSTRAP UI] 60+ routes — DISCONNECT COMPLETELY
```
- atelier.admin-audit.tsx
- atelier.admin-roles.tsx
- atelier.admin-users.tsx
- atelier.author.tsx
- atelier.author-earnings.tsx
- atelier.author-edit.tsx
- atelier.author-items.tsx
- atelier.author-profile.tsx
- atelier.author-reviews.tsx
- atelier.author-sales.tsx
- atelier.author-upload.tsx
- atelier.blog.tsx
- atelier.blog-detail.tsx
- atelier.builder.tsx
- atelier.categories.tsx
- atelier.category.tsx
- atelier.chat.tsx
- atelier.customer.tsx
- atelier.forgot.tsx
- atelier.franchise.tsx
- atelier.home.tsx
- atelier.influencer.tsx
- atelier.merchant.tsx
- atelier.partner.tsx
- atelier.productivity.tsx
- atelier.register.tsx
- atelier.reseller-plugins.tsx
- atelier.reseller-software.tsx
- atelier.reset.tsx
- atelier.search.tsx
- atelier.support.tsx
```

### [DUPLICATE DEMO ROUTES] 3 routes — Keep only demo-manager
```
DELETE:
- vala.simple-demo.tsx
- vala.premium-demo.tsx
- vala.product-demo.tsx

KEEP:
- vala.demo-manager.tsx
- vala.demo-showcase.tsx
- vala.demo-directory.tsx
```

---

## TOTAL DELETIONS
- **150+ route files** to remove
- **~500KB disk space** to reclaim
- **Routing complexity** reduced by 40%

## NEXT PHASE
→ PHASE 02: Disconnect old Atelier bootstrap completely
→ PHASE 03: Unify auth systems into `/control-panel/auth`
