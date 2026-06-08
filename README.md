# PflegeNest OS™

> Enterprise digital operating system for the care company **PflegeNest Bochum** — premium public website, Pflegegrad assessment, digital anamnesis, full CRM, patient record, recruiting pipeline, HR, tour & shift planning, document center, task tickets, operations wall, digital twin, AI assistance, analytics, and SEO engine — built on **Next.js 14 / TypeScript / Tailwind / shadcn-ui**.

This is **Iteration 1** of the foundation defined in `pflegenest_os_foundation_3f091bb7.plan.md`. The system runs end-to-end against an in-memory + filesystem persistence layer (`.data/store.json`) in `DEMO_MODE` and is fully **Prisma-ready** for a Postgres cluster in production.

---

## Quick start (demo mode)

```bash
cp .env.example .env.local        # DEMO_MODE=true is already set as default
npm install
npm run dev
```

Open <http://localhost:3000>. The seeded demo users on `/login` correspond to the eight roles defined in the RBAC matrix.

```bash
npm run build && npm start         # production build (no DB needed in demo mode)
npm run typecheck                  # strict TS check
npm run lint
```

### Switching to Postgres / Prisma

1. Provision a Postgres instance and set `DATABASE_URL=postgres://…` in `.env.local`.
2. Unset / remove `DEMO_MODE`.
3. `npm run db:migrate` to apply `prisma/schema.prisma`.
4. Implement the Prisma adapter behind `src/core/repositories/index.ts` (the `Repositories` interface is the single integration point — **no UI changes** required).
5. `npm run db:seed` to load reference data.

Because every Server Action, service, and component talks to repositories through the `Repositories` interface, swapping persistence is a purely back-end concern.

---

## Architecture in 30 seconds

```text
src/
  app/                          # Next.js App Router (RSC-first)
    (public)/                   # premium website + Pflegegrad + anamnesis
    admin/                      # full operations UI, RBAC-guarded
    actions/                    # Server Actions (mutations only)
  core/                         # UI-free domain core
    types/                      # all domain types
    domain/                     # labels, value objects
    events/                     # typed event bus + DomainEvent union
    workflows/                  # config-driven workflow engine
    audit/                      # audit log + default subscribers
    permissions/                # RBAC matrix, <Can/>, requirePermission
    auth/                       # cookie session (Iteration 1)
    repositories/               # IRepository + memory + (future) prisma
    services/                   # business logic; emit events; no UI
    search/                     # global enterprise search (fuse.js)
    storage/                    # file storage abstraction
    seed.ts                     # demo seed
    bootstrap.ts                # idempotent startup
  modules/                      # feature UI (wizards, boards, dashboards)
  components/                   # shadcn-ui primitives + reusable shells
  lib/                          # tiny helpers (cn, formatDate, …)
prisma/schema.prisma            # complete domain schema (Postgres target)
```

Every mutation flows through the same pipeline:

```
UI → Server Action → Service → Repository → (Event Bus → Audit + Workflow + Notifications)
```

---

## Highlights

- **RBAC**: `ROLE_PERMISSIONS` matrix enforced server-side via `requirePermission()` and mirrored in the UI via `<Can permission="…">`. 8 roles, ~40 permissions.
- **Event system**: typed discriminated union in `src/core/events/types.ts`, in-process pub/sub bus, audit + workflow + notification subscribers installed at boot.
- **Workflow engine**: three seeded workflows (anamnesis intake, sick report substitute search, applicant SLA reminder). All steps are predefined `WorkflowStepKind`s — no arbitrary code execution.
- **Audit log**: complete before/after tracking with CSV export at `/admin/audit`.
- **Operations Wall** (`/admin/ops`): 15 live tiles + system health score from the Digital Twin.
- **Digital Twin** (`/admin/twin`): 10 perspectives (patients, employees, applicants, tours, shifts, documents, tasks, leads, capacity, risks) and a synthetic health score.
- **AI Command Center** (`/admin/ai`): heuristic recommendations behind the `IAIService` interface — swap in OpenAI / Anthropic via env vars without UI changes.
- **Enterprise search** (`⌘K`): fuzzy search across leads, patients, applicants, employees, tasks, documents.
- **Public website**: premium hero, services, Pflegegrad center (6-step NBA-style wizard), digital anamnesis (multi-section wizard with consent), careers form, 10 local SEO landing pages, sitemap, robots, LocalBusiness schema, FAQ schema.
- **Mobile-first**: responsive shells with bottom-nav drawer on `<md`.
- **Accessibility**: semantic HTML, focus rings, Radix primitives, aria labels on icon-only buttons.
- **GDPR**: explicit `ConsentRecord`s on form submissions, no third-party trackers, sensible cookie defaults.

---

## Demo users (seeded)

| Email                              | Role                  |
| ---------------------------------- | --------------------- |
| `super@pflegenest-bochum.de`       | SUPER_ADMIN           |
| `gf@pflegenest-bochum.de`          | GESCHAEFTSFUEHRUNG    |
| `pdl@pflegenest-bochum.de`         | PFLEGEDIENSTLEITUNG   |
| `verwaltung@pflegenest-bochum.de`  | VERWALTUNG            |
| `recruiting@pflegenest-bochum.de`  | RECRUITING            |
| `mitarbeiter@pflegenest-bochum.de` | MITARBEITER           |
| `angehoeriger@example.de`          | ANGEHOERIGE           |
| `patient@example.de`               | PATIENT               |

In demo mode the login page is a one-click role switcher — no passwords required.

---

## Deployment (Vercel)

1. Set the env vars from `.env.example` in the Vercel dashboard.
2. For production, set `DATABASE_URL` to a managed Postgres (e.g. Neon, RDS) and unset `DEMO_MODE`.
3. The `build` step runs `prisma generate && next build`.
4. The `.data/store.json` file is only used in demo mode and lives outside the repo (ignored by `.gitignore`).

---

## Roadmap beyond Iteration 1

- Prisma adapter behind the same `Repositories` interface.
- Real LLM bindings for `IAIService` and `ITourOptimizer` (interfaces already in place).
- WebSocket / SSE-based realtime replacement for the current revalidate-on-mutation pattern.
- S3 storage backend behind `IStorage` (local FS used in Iteration 1).
- Mobile PWA shell for caregivers.

---

## License

Proprietary — © PflegeNest Bochum. All rights reserved.
