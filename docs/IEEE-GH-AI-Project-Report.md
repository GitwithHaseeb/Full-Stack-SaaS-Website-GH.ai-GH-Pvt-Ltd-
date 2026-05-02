# GH.ai: A Full-Stack AI-Assisted Sales Automation Platform

**Authors:** Muhammad Haseeb, Ghania Tanveer  
**Affiliation:** GH Pvt Ltd  
**Correspondence:** Engineering and product leadership, GH.ai initiative  
**Date:** May 2026  

---

## Abstract

This technical report documents **GH.ai**, a production-oriented software-as-a-service (SaaS) platform developed by **GH Pvt Ltd** for revenue teams. The system combines a **Next.js 15** (React 19, App Router) web client, a **FastAPI** REST API, **PostgreSQL** persistence, **Redis** as a broker/cache substrate, and **Celery** for asynchronous workloads. The architecture emphasizes same-origin browser access to versioned APIs via an **edge-safe reverse proxy pattern**, structured authentication, and integration hooks for **Gmail** and **Calendly**. We describe requirements, layered architecture, implementation choices, deployment topology (including **GitHub** source control and **Vercel** for the marketing and application shell), operational considerations, limitations, and future research directions. A public deployment of the frontend is available at **https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/**; the authoritative source repository resides on **GitHub** under the organization’s naming convention for the monorepo.

**Index Terms** — Software as a service, sales automation, Next.js, FastAPI, PostgreSQL, asynchronous task queues, system architecture, deployment engineering.

---

## I. INTRODUCTION

### A. Motivation

Modern outbound and inbound revenue teams rely on fragmented tooling: customer relationship management (CRM) systems, email clients, scheduling tools, and ad hoc spreadsheets. **GH.ai** consolidates a subset of that workflow into a cohesive web product: **pipeline visualization**, **campaign definitions**, **lead records**, **AI-assisted drafting** (subject to operator approval), and **Calendly-aligned booking flows**. The motivation is both commercial and technical: demonstrate that a small team can ship a **credible, maintainable** full-stack SaaS with explicit separation of concerns, auditable persistence, and a path to horizontal scaling.

### B. Problem Statement

Small and mid-sized teams require (1) **low-friction onboarding** to a web dashboard, (2) **secure handling of credentials and tokens** for third-party APIs, (3) **durable storage** of leads and pipeline transitions, and (4) **background execution** for rate-limited email and scoring tasks without blocking HTTP request threads. The problem addressed by GH.ai is the **integration and orchestration** of these capabilities behind a single product surface while preserving **testability** and **operational clarity**.

### C. Contributions of This Report

This document contributes: (1) a **reference architecture** for a Next.js + FastAPI monorepo with PostgreSQL and Redis; (2) a **deployment narrative** spanning local Docker, managed databases (e.g., Neon-class providers), and Vercel-hosted frontends with externally hosted APIs; (3) a **risk and limitation** register suitable for academic or investor technical due diligence; (4) a **reproducible bibliography** of primary technologies.

### D. Report Organization

Section II summarizes related platforms and standards. Section III captures requirements. Section IV details architecture. Section V discusses implementation. Section VI covers deployment. Section VII addresses security. Section VIII outlines validation. Section IX lists limitations and future work. Section X concludes. References close the document.

---

## II. RELATED WORK AND STANDARDS

### A. Comparable Commercial Systems

Products in the sales engagement category (e.g., outbound sequencers, meeting schedulers) typically centralize messaging and analytics. GH.ai differentiates by **open, inspectable codebase** (for the owning organization), **self-hostable** backend components, and **explicit** async worker separation.

### B. Web Standards and Frameworks

The frontend adheres to **HTML5** semantics, **WCAG-oriented** practices via component libraries, and **HTTP cookie** semantics for session continuity where applicable. The API follows **OpenAPI 3** conventions exposed by FastAPI’s automatic documentation.

### C. Persistence and Migrations

**Alembic** supplies schema migrations, aligning with twelve-factor app principles for reproducible database state across environments.

---

## III. REQUIREMENTS AND SYSTEM OVERVIEW

### A. Functional Requirements

1. **Marketing site:** static and server-rendered pages for positioning, pricing narrative, blog stubs, contact, and waitlist.  
2. **Authentication:** registration, login, token refresh patterns consistent with secure SaaS norms.  
3. **Dashboard:** authenticated views for leads, pipeline, campaigns, AI agent interactions, API keys, billing placeholder, and settings.  
4. **API surface:** CRUD and workflow endpoints for leads, pipeline transitions, campaigns, email-related actions, Calendly connectivity, and AI-assisted text generation endpoints.  
5. **Webhooks:** inbound HTTP receivers for external systems (e.g., Calendly, Gmail notifications) with idempotent handling goals.  
6. **Background jobs:** Celery tasks for long-running or periodic operations.

### B. Non-Functional Requirements

- **Performance:** API responses bounded by database and external API latency; frontend employs **Next.js** streaming and selective client components.  
- **Availability:** Health and readiness endpoints for orchestrators.  
- **Security:** CORS restrictions, secret management via environment variables, rate limiting middleware.  
- **Maintainability:** Typed Python (Pydantic v2) and TypeScript on the client.

### C. System Context Diagram (Narrative)

Actors include **end users** (browser), **administrators** (configuration), and **external providers** (Google, Calendly, OpenAI-class vendors). The **Next.js** deployment serves UI and proxies `/api/v1/*` to **FastAPI**. **PostgreSQL** stores authoritative entities; **Redis** backs Celery.

---

## IV. ARCHITECTURE AND DESIGN

### A. Layered Model

1. **Presentation layer:** Next.js routes, React components, Tailwind styling.  
2. **Edge/API gateway layer:** Next route handlers forwarding cookies and methods to FastAPI.  
3. **Application layer:** FastAPI routers grouped by domain (auth, users, leads, pipeline, campaigns, email, Calendly, AI agent, API keys).  
4. **Domain layer:** SQLAlchemy models encapsulating invariants.  
5. **Infrastructure layer:** async engine configuration, Redis clients, Celery app.

### B. Data Model Highlights

Core entities include **User**, **Lead**, **Pipeline** stage transitions, **Campaign** definitions, **API keys** (encrypted at rest patterns as implemented), and **Waitlist** entries for marketing capture. Relationships favor **single-tenant per deployment** semantics unless extended.

### C. API Versioning

All REST endpoints are under **`/api/v1`**, enabling future breaking changes under `/api/v2` without silent client breakage.

### D. Frontend–Backend Coupling

The coupling is **intentionally loose**: the browser targets same-origin `/api/v1`; the server-side proxy uses **`BACKEND_INTERNAL_URL`**, enabling independent scaling of the Python service and the Next deployment.

---

## V. IMPLEMENTATION (DETAILED)

### V.A. Frontend stack and build pipeline

The client application targets **Node.js 20+** and ships with **Next.js 15.2.8** and **React 19**. Styling uses **Tailwind CSS** with a shared component layer under `src/components/ui` (Radix primitives). Production builds run `next build`, emitting optimized bundles, route manifests, and server action / RSC payloads where applicable. **TypeScript** enforces static typing across pages and libraries. **ESLint** (`eslint-config-next`) guards common footguns. The `next.config.ts` file enables `outputFileTracingRoot` pointing at the monorepo parent so that file tracing in container and multi-root deployments resolves shared paths consistently. Marketing routes live under the `(marketing)` route group; authenticated dashboard routes live under `(dashboard)` with layout-level assumptions for session-bearing requests.

### V.B. Same-origin API proxy (`/api/v1/*`)

Browser code calls **`NEXT_PUBLIC_API_URL`** defaulting to `/api/v1`. The App Router handler at `src/app/api/v1/[...route]/route.ts` forwards method, headers, query string, and body to **`BACKEND_INTERNAL_URL`** suffixed with `/api/v1/...`. Cookie headers are forwarded so that cookie-based sessions remain coherent when the FastAPI stack issues `Set-Cookie`. This pattern avoids exposing the internal API hostname to the browser and simplifies CORS configuration during development. Operators must set `BACKEND_INTERNAL_URL` to the full origin of the Python service in every environment (e.g., `http://127.0.0.1:8000` locally, `https://api.example.com` in production).

### V.C. Dashboard feature modules (user-visible)

| Module | Primary responsibility |
|--------|-------------------------|
| **Dashboard home** | Server-side fetch of pipeline metrics and lead summaries using `BACKEND_INTERNAL_URL` with forwarded cookies. |
| **Leads** | Client-side CRUD against `/api/v1/leads/` for list and create; detail routes hydrate lead threads. |
| **Campaigns** | Defines trigger type (`new_lead` default), optional delay days, subject/body templates; persists via `/api/v1/campaigns/`. |
| **AI Agent** | Calls `/api/v1/ai-agent/*` for draft generation; operator remains accountable for sent content. |
| **Calendly** | OAuth/token flows and booking link creation endpoints; webhook ingestion updates pipeline context. |
| **API keys** | User-scoped programmatic keys stored as **hash + prefix** only (`ApiKey` model). |
| **Settings / Billing** | Profile and placeholder billing surfaces for future monetization. |

### V.D. Backend process model

The ASGI application is served by **Uvicorn** (development with `--reload`; production behind a process manager or container entrypoint). Request lifecycle: routing → optional rate limit → CORS → endpoint → dependency-injected `AsyncSession` → service layer → SQLAlchemy flush/commit. Exceptions map to JSON error bodies suitable for SPA consumption.

### V.E. Authentication and session policy

`ACCESS_TOKEN_EXPIRE_MINUTES` (default 30) and `REFRESH_TOKEN_EXPIRE_DAYS` (default 7) are centralized in `Settings`. Passwords are stored hashed in `users.hashed_password`. Tokens are issued by auth routers (see OpenAPI `/docs`). Refresh and rotation policies should be tightened for high-security tenants.

### V.F. Rate limiting

**SlowAPI** attaches to application state; `RateLimitExceeded` returns HTTP **429** with JSON `{"detail":"Rate limit exceeded"}`. Limits should be tuned per route class: authentication endpoints warrant stricter thresholds than read-only marketing proxies.

### V.G. Database schema (relational core)

PostgreSQL holds authoritative rows for:

- **`users`**: `id` (UUID PK), unique `email`, `hashed_password`, optional `full_name`, `company`, encrypted or opaque `gmail_refresh_token`, `calendly_token`, JSONB `ai_config`, `timezone`, JSONB `working_hours`, timestamps. Relationships: `leads`, `email_logs`, `campaigns`, `calendly_events`, `api_keys`.
- **`leads`**: `id`, `user_id` FK CASCADE, `name`, `email`, optional `company`, `pipeline_stage` (string; canonical values include `New Lead`, `Contacted`, `Meeting Scheduled`, `Closed`), `notes`, `last_contacted_at`, `assigned_agent` boolean, `created_at`. Related `email_history`, `calendly_events`.
- **`campaigns`**: `user_id`, `name`, `trigger_type`, optional `trigger_days`, `subject`, `body`, `created_at`.
- **`email_logs`**: optional `lead_id` SET NULL on lead delete, `user_id`, `subject`, `body`, `sent_at`, `status`, `provider_message_id`, `direction` default `outbound`.
- **`calendly_events`**: optional `lead_id`, `user_id`, `calendly_event_uri`, `status`, `booked_at`, JSONB `raw_payload` for auditing webhook payloads.
- **`api_keys`**: `user_id`, `name`, unique `key_hash`, `key_prefix`, `created_at`, optional `revoked_at`.
- **`waitlist`**: marketing capture for pre-launch emails (see waitlist endpoint).

Foreign keys use `ON DELETE CASCADE` for user-owned children where orphan rows are meaningless; `SET NULL` where historical logs must survive lead deletion.

### V.H. Alembic migrations

Schema evolution is tracked under `backend/alembic/`. Operators must run `alembic upgrade head` on every deploy before serving traffic. Downgrades should be rehearsed in staging.

### V.I. Celery worker surface

`docker-compose.yml` defines a **`celery`** service: `celery -A app.tasks.celery_app worker -l info`, sharing the backend image and `.env`. Tasks include asynchronous email sends and scoring (see `app/tasks`). Workers require Redis connectivity identical to the API.

### V.J. External integrations (engineering detail)

**OpenAI**: `OPENAI_API_KEY` in settings; AI routes must guard against prompt injection by validating and truncating user-supplied strings before model calls. **Gmail**: OAuth client id/secret plus per-user refresh token storage on `User`. **Calendly**: personal token for server operations; webhooks at `/webhooks/calendly` and duplicate mount for path-prefixed proxies. **Contact / waitlist**: dedicated FastAPI routes log or persist submissions.

### V.K. Observability and logging

Python `logging` records contact submissions and operational warnings (e.g., readiness failures). Correlation IDs may be added later via middleware.

### V.L. Frontend environment contract

| Variable | Role |
|----------|------|
| `BACKEND_INTERNAL_URL` | Origin of FastAPI for server-side fetches and proxy target assembly. |
| `NEXT_PUBLIC_API_URL` | Browser-relative API prefix (default `/api/v1`). |
| `NEXT_PUBLIC_APP_NAME` | Branding string in UI. |

---

## VI. DEPLOYMENT ENGINEERING (EXPANDED)

### VI.A. GitHub repository layout

The monorepo hosts `frontend/`, `backend/`, `docs/`, `docker-compose.yml`, `README.md`, and `DEPLOY.md`. Branch **`main`** is production. Feature branches merge via pull request where team policy requires review.

### VI.B. Local Docker Compose topology

| Service | Image / build | Ports | Purpose |
|---------|---------------|-------|---------|
| `db` | `postgres:15` | 5432 | Primary relational store (`ghai` database). |
| `redis` | `redis:7-alpine` | 6379 | Celery broker and cache substrate. |
| `backend` | `./backend` Dockerfile | 8000 | Runs `alembic upgrade head` then `uvicorn`. |
| `celery` | same image as backend | — | Background worker process. |
| `frontend` | `./frontend` Dockerfile | 3000 | Next.js dev/prod server. |

`backend` and `celery` mount `./backend/.env`; `frontend` mounts `./frontend/.env.local`. Persistent Postgres data uses named volume `postgres_data`.

### VI.C. Vercel frontend production

**Root Directory** must be **`frontend`**. Framework auto-detection reads `package.json` `dependencies.next`. **Do not** combine root-level `vercel.json` with `npm ci --prefix frontend` when the project root is already `frontend`—that pattern double-prefixes paths and fails in seconds. Environment variables in Vercel must include production `BACKEND_INTERNAL_URL` and appropriate `CORS_ORIGINS` entries on the API host listing the Vercel hostname.

### VI.D. Backend production hosting (recommended patterns)

Deploy FastAPI on a VM, PaaS container, or Kubernetes with: (1) HTTPS termination; (2) at least two Uvicorn workers or Gunicorn+Uvicorn workers; (3) liveness on `/health`; (4) readiness on `/health/ready` including DB check; (5) secrets from a managed vault; (6) horizontal autoscaling rules based on CPU and p95 latency.

### VI.E. Managed PostgreSQL

Neon/RDS/Cloud SQL: enforce TLS, rotate credentials, enable automated backups, configure `max_connections` to exceed peak API+worker concurrency with headroom.

### VI.F. Rollback strategy

Tag Docker images and Git releases. Database backward compatibility requires additive migrations before destructive drops. Vercel instant rollback promotes a prior deployment artifact.

---

## VII. SECURITY AND PRIVACY (EXPANDED)

### VII.A. Threat catalog (representative)

| Threat ID | Description | Mitigation |
|-----------|-------------|------------|
| T-01 | Credential stuffing on `/api/v1/auth/login` | Rate limits, optional CAPTCHA, lockout policies. |
| T-02 | Token theft via XSS | Content Security Policy headers (future), HttpOnly cookies, strict React escaping. |
| T-03 | CSRF on state-changing routes | SameSite cookies, anti-CSRF tokens if cookie auth without SameSite=strict. |
| T-04 | SQL injection | SQLAlchemy bound parameters exclusively. |
| T-05 | LLM prompt injection | Sanitize/truncate user text; never execute model output as code. |
| T-06 | Webhook spoofing | Verify provider signatures (implement per vendor docs). |

### VII.B. Data classification

User emails, OAuth tokens, API key hashes, lead PII, and Calendly payloads are **confidential**. Logs must redact tokens. Backups must be encrypted at rest.

### VII.C. Compliance note

If EU data subjects are onboarded, maintain Records of Processing Activities, DPIA for AI features, and data subject erasure procedures cascading deletes across `users` and dependent rows.

---

## VIII. TESTING AND VALIDATION (EXPANDED)

### VIII.A. Test pyramid

**Unit**: services (pipeline advance rules, campaign triggers). **Integration**: database transactions with testcontainers Postgres. **API**: schemathesis or pytest-httpx against OpenAPI. **E2E**: Playwright flows for register→login→create lead. **Load**: k6 on read-heavy dashboard endpoints and webhook burst simulations.

### VIII.B. Definition of Done (example)

A feature is releasable when: migrations applied; OpenAPI updated; manual smoke on Docker Compose; no P1 linter violations; rollback steps documented.

---

## IX. LIMITATIONS AND FUTURE WORK (EXPANDED)

Current limitations: single-tenant assumptions; no native mobile apps; AI costs variable; Gmail/Calendly setup requires operator expertise; Celery tasks must be monitored for poison messages.

Roadmap: multi-tenant row-level security; SAML SSO; billing provider integration; granular RBAC; audit log export; webhook signature verification everywhere; canary deploys.

---

## X. CONCLUSION (EXPANDED)

GH.ai operationalizes a **defensible** SaaS architecture: **Next.js** for user experience and edge-friendly delivery, **FastAPI** for typed business logic, **PostgreSQL** for durable state, **Redis/Celery** for asynchronous work, and **explicit** integration boundaries for Gmail, Calendly, and LLM vendors. The deployment story—**GitHub** for source, **Vercel** for the frontend shell, and portable backend containers—matches how lean teams ship revenue software in 2026. Continued investment in **security verification**, **observability**, and **customer-driven prioritization** will determine commercial outcomes beyond the MVP described herein.

---

## XI. API SURFACE CATALOG (REPRESENTATIVE)

The following table summarizes primary **versioned** REST areas mounted under `/api/v1` (exact paths appear in OpenAPI `/docs`). Webhooks are additional.

| Area | Prefix | Notes |
|------|--------|------|
| Authentication | `/api/v1/auth` | Registration, login, token refresh patterns. |
| Users | `/api/v1/users` | `/me` read/update profile. |
| Leads | `/api/v1/leads` | CRUD scoped to current user. |
| Pipeline | `/api/v1/pipeline` | Stage catalog and advance operations. |
| Campaigns | `/api/v1/campaigns` | Triggered outreach definitions. |
| AI Agent | `/api/v1/ai-agent` | Generation endpoints. |
| Calendly | `/api/v1/calendly` | Connect, event types, booking links, webhook receiver. |
| Email | `/api/v1/email` | Sending and logging integration. |
| API keys | `/api/v1/api-keys` | Create/list/revoke hashed keys. |
| Marketing | `/api/v1/waitlist`, `/api/v1/contact` | Also top-level routes in `main.py`. |

Health: `/health` (liveness), `/health/ready` (DB probe).

---

## XII. TRACEABILITY MATRIX (REQUIREMENTS TO COMPONENTS)

| Requirement ID | User story | Primary components |
|------------------|-----------|---------------------|
| FR-01 | Visitor reads marketing pages | Next `(marketing)/*` routes |
| FR-02 | Visitor submits waitlist | `POST /api/v1/waitlist`, `WaitlistEntry` |
| FR-03 | Visitor contacts founders | `POST /api/v1/contact` |
| FR-04 | User registers | Auth router, `users` table |
| FR-05 | User logs in | Auth router, cookies/tokens |
| FR-06 | User lists leads | `leads` router, dashboard page |
| FR-07 | User advances pipeline | `pipeline` router, `Lead.pipeline_stage` |
| FR-08 | User defines campaign | `campaigns` router |
| FR-09 | User requests AI draft | `ai_agent` router, OpenAI |
| FR-10 | User connects Calendly | `calendly` router, token columns |
| FR-11 | System receives Calendly webhook | `webhooks`, `CalendlyEvent` |
| FR-12 | Background email send | Celery tasks, Gmail |
| FR-13 | Admin monitors health | `/health`, `/health/ready` |

---

## XIII. GLOSSARY (EXTENDED)

**ASGI:** Asynchronous Server Gateway Interface standard underpinning Uvicorn+FastAPI. **JSONB:** PostgreSQL binary JSON column type used for flexible payloads (`ai_config`, `raw_payload`). **ORM:** Object-relational mapper (SQLAlchemy). **SSR:** Server-side rendering. **ISR:** Incremental static regeneration (available in Next where configured). **Webhook:** HTTP POST callback from SaaS providers on events.

---
## REFERENCES

[1] Vercel Inc., “Next.js Documentation,” 2025–2026. [Online]. Available: `https://nextjs.org/docs`  

[2] S. Ramírez, “FastAPI,” 2018–2026. [Online]. Available: `https://fastapi.tiangolo.com`  

[3] SQLAlchemy authors, “SQLAlchemy Documentation,” [Online]. Available: `https://docs.sqlalchemy.org`  

[4] P. Kreit and community, “Celery Distributed Task Queue,” [Online]. Available: `https://docs.celeryq.dev`  

[5] Fielding, R., “Architectural Styles and the Design of Network-based Software Architectures,” Ph.D. dissertation, UC Irvine, 2000.  

[6] GH Pvt Ltd, “GH.ai Monorepo,” GitHub repository (example naming). [Online]. Available: `https://github.com/GitwithHaseeb/Full-Stack-SaaS-Website-GH.ai-GH-Pvt-Ltd-`  

[7] GH Pvt Ltd, “GH.ai Production Frontend (Vercel),” 2026. [Online]. Available: `https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/`  

---

## APPENDIX A — URL AND REPOSITORY QUICK LIST

| Resource | URL |
|----------|-----|
| Production frontend | https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/ |
| Source repository | https://github.com/GitwithHaseeb/Full-Stack-SaaS-Website-GH.ai-GH-Pvt-Ltd- |
| Deployment guide (this repo) | `DEPLOY.md` |

---

## APPENDIX B — DIRECTORY MAP (MONOREPO)

```
frontend/     Next.js 15 application (UI, proxy routes)
backend/      FastAPI application (API, workers entry)
docs/         Technical documentation and generated report artifacts
```

---

## APPENDIX C — MODULE-LEVEL DESCRIPTION (EXPANDED)

### C.1 Frontend Route Inventory (Representative)

The marketing surface includes landing, features, pricing, blog index and dynamic `[slug]` posts, about, contact, waitlist, and authentication routes (`/login`, `/register`). The authenticated dashboard subtree implements leads list and detail, campaigns, AI agent playground, API keys, billing placeholder, settings, and a pipeline-oriented home view. Each route is chosen to minimize bundle size through **dynamic imports** where heavy charting libraries are used (e.g., dashboard analytics).

### C.2 API Router Inventory

The backend aggregates routers for **authentication**, **users**, **leads**, **pipeline**, **campaigns**, **AI agent**, **Calendly**, **email**, and **API keys**. Webhooks are mounted at both `/webhooks` and `/api/v1/webhooks` to support reverse-proxy path prefixes without duplicate business logic in separate processes.

### C.3 Persistence and Consistency

Database transactions wrap multi-step mutations (e.g., lead stage advance) to avoid partial updates visible to concurrent readers. Flush and commit boundaries are chosen to align with FastAPI dependency lifecycle for request-scoped sessions.

### C.4 Observability Hooks

Structured logging in the API records contact form submissions and webhook receipt at appropriate levels. Future work attaches OpenTelemetry traces from FastAPI middleware and Next.js fetch spans for cross-service correlation.

### C.5 Configuration Management

Twelve-factor methodology is followed: configuration via environment variables, no secrets in repository, separate `.env` files per process class (web vs worker). Production rotations require coordinated updates to Vercel and API host environment stores.

### C.6 Build and Release Discipline

Semantic versioning of the product is recommended once public APIs stabilize. Until then, commit SHAs act as deployment identifiers across Vercel and API hosts. Changelogs should map customer-visible changes to migration IDs.

### C.7 Disaster Recovery

Backups of PostgreSQL should be automated with point-in-time recovery objectives defined by GH Pvt Ltd policy. Redis may be treated as reconstructible except where Celery task results must be durable—in that case configure result backend persistence policies accordingly.

### C.8 Cost Model Notes

Vercel usage scales with function invocations and bandwidth; OpenAI token usage scales with AI endpoints; managed Postgres scales with storage and IO. Cost attribution tags in cloud accounts should separate **production** vs **preview** environments.

---

## APPENDIX D — ENVIRONMENT VARIABLES (REFERENCE)

Representative variables documented in repository examples include: **`DATABASE_URL`**, **`REDIS_URL`**, **`SECRET_KEY`**, **`ACCESS_TOKEN_EXPIRE_MINUTES`**, **`REFRESH_TOKEN_EXPIRE_DAYS`**, **`CORS_ORIGINS`**, **`OPENAI_API_KEY`**, Gmail and Calendly client identifiers, and Celery broker/result URLs. Frontend variables include **`BACKEND_INTERNAL_URL`** and **`NEXT_PUBLIC_API_URL`**. Operators must validate quoting and escaping when embedding special characters in URLs.

---

## APPENDIX E — ACADEMIC POSITIONING FOR EXTENDED SUBMISSION

For conference or journal extensions, authors should: (1) add quantitative evaluation of pipeline stage transition latency under load; (2) include human factors study on AI draft acceptance rates; (3) compare energy usage of async Python vs alternative stacks; (4) provide formal threat modeling outputs (STRIDE); (5) attach ethics review for automated outreach at scale. These items exceed MVP scope but strengthen peer review outcomes.

---

## APPENDIX F — GLOSSARY

**SaaS:** Software licensed by subscription and delivered over the network. **SSR:** Server-side rendering. **RSC:** React Server Components. **JWT:** JSON Web Token (if used in auth flows—verify implementation). **ORM:** Object-relational mapper. **Webhook:** HTTP callback initiated by an external system upon events.

---

## APPENDIX G — EXTENDED DISCUSSION (PAGE-DEPTH MATERIAL)

### G.1 Software Lifecycle Integration

Within a disciplined lifecycle, GH.ai artifacts move from **local feature branches** into **`main`** through code review, automated formatting where configured, and manual smoke tests against Docker Compose. The lifecycle intentionally mirrors industry practice: short iterations, reversible migrations, and explicit environment promotion (development → staging → production). Stakeholders at GH Pvt Ltd should define **release cadence** (weekly vs biweekly) and **rollback authority** so that production incidents map to known commits.

### G.2 Comparative Technology Evaluation

Alternative stacks considered in early planning included **Django REST Framework** with synchronous workers, **NestJS** with TypeScript-only backend, and **serverless functions** per route. The selected **FastAPI + async SQLAlchemy** pairing optimizes for **typed** request/response contracts and **async IO** under bursty webhook traffic. The **Next.js** selection optimizes for **unified** marketing and dashboard routing, **image optimization**, and **incremental adoption** of React Server Components for latency-sensitive reads.

### G.3 Data Ethics and Responsible AI Use

Automated outreach introduces ethical obligations: anti-spam compliance, truthful representation, opt-out honoring, and transparent disclosure when content is machine-drafted. GH.ai should embed **policy templates** in campaign defaults and require explicit operator acknowledgment before high-volume sends. Academic literature on persuasive systems and dark patterns should inform UX audits.

### G.4 Performance Engineering Notes

Cold start characteristics differ between **Vercel serverless** invocations and **always-on** FastAPI processes. For latency-sensitive dashboard charts, prefer **cached aggregates** or **materialized views** in PostgreSQL. For AI endpoints, apply **token budgets** and **truncation** strategies on inbound text to cap cost and latency.

### G.5 Internationalization and Localization

Future internationalization requires extracting literal strings, adopting locale-aware date formatting, and validating RTL layouts if Middle Eastern markets are targeted. Database collation choices should be documented before multilingual indexes are introduced.

### G.6 Accessibility Statement (Engineering)

Semantic landmarks, focus order, and color contrast for dark mode themes should be validated against WCAG 2.2 AA where feasible. Automated tooling (axe) complements manual keyboard navigation tests.

### G.7 Intellectual Property and Licensing

Proprietary licensing applies to GH Pvt Ltd deliverables unless otherwise stated. Third-party libraries remain under their respective OSS licenses; compliance requires maintaining **`NOTICE`** files if redistribution bundles transitive dependencies in container images.

### G.8 Handover Checklist for New Engineers

New contributors should: clone the monorepo; configure `backend/.env` and `frontend/.env.local`; run Postgres and Redis; execute migrations; start API and Next dev servers; read `DEPLOY.md`; reproduce one successful lead creation in the dashboard; read OpenAPI docs; and document any onboarding gaps in the internal wiki.

### G.9 Sustained Engineering Metrics

Recommended metrics include **p95 API latency** by route, **error rate** by deployment, **build duration** on CI, **mean time to recovery** for incidents, and **customer-reported defect** counts tied to Git issues.

### G.10 Closing Remarks

This appendix supplies narrative depth suitable for expanding the Word export toward the **fifteen- to twenty-page** range expected in capstone or internal R&D reports. Authors should insert **figures** (architecture, ER diagram, deployment topology), **tables** (endpoint matrix, environment matrix), and **appendixed test output** after conversion to `.docx`, then apply **IEEE** reference formatting from Microsoft Word’s citation tools.

---

*End of report body — open `IEEE-GH-AI-Project-Report.docx` in Microsoft Word, insert cover page and figure pages, apply IEEE reference style, then paginate; this yields the final 15–20 page institutional document.*

