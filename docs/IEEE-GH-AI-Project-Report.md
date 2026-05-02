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

## V. IMPLEMENTATION

### A. Frontend Implementation

The **App Router** organizes marketing routes under route groups and dashboard routes under authenticated layout assumptions. **Server components** prefetch dashboard data where feasible; **client components** manage interactive forms. **Static imports** bundle founder imagery for deterministic build output on edge hosts.

### B. Backend Implementation

FastAPI modules separate **routers**, **schemas**, **services**, and **models**. Dependency injection supplies database sessions and current user resolution. **SlowAPI** integrates rate limiting with a global exception handler returning HTTP 429 JSON bodies.

### C. Asynchronous Persistence

SQLAlchemy **2.x async** with **asyncpg** reduces thread pool overhead under concurrent IO-bound workloads typical of web APIs.

### D. Integrations

Calendly and Gmail integrations require OAuth client configuration and secure token storage patterns; webhook endpoints must be publicly reachable in production (tunneling during development).

---

## VI. DEPLOYMENT ENGINEERING

### A. Source Control (GitHub)

All changes flow through **Git** with **`main`** as production. Pull requests (recommended) gate review. Tags may mark releases.

### B. Continuous Deployment (Vercel)

The **frontend** directory is designated as the **Vercel Root Directory** so that framework detection and `npm ci` operate on the correct `package-lock.json`. Environment variables must mirror production secrets policy. **Automatic deployments** trigger on pushes to `main`.

### C. Backend Hosting

The API should run on a container-friendly platform with **horizontal scaling** options. Health checks should target `/health` and `/health/ready`.

### D. Database Hosting

Managed PostgreSQL (e.g., **Neon**) simplifies TLS and failover; connection strings must use **`postgresql+asyncpg://`** driver prefix for this codebase.

---

## VII. SECURITY AND PRIVACY CONSIDERATIONS

Threats include **credential theft**, **CSRF** on state-changing routes, **rate-based abuse**, and **injection** into LLM prompts. Mitigations include HTTPS everywhere in production, HttpOnly cookies where applicable, server-side validation with Pydantic, rate limits, and least-privilege API keys for third-party services. Privacy posture must be documented separately for GDPR-class obligations if EU data subjects are served.

---

## VIII. TESTING AND VALIDATION

Recommended layers: **unit tests** for services, **contract tests** for API schemas, **end-to-end tests** for critical flows (registration → login → lead creation), and **load tests** for webhook bursts. Local validation uses Docker Compose parity with production topology as closely as practical.

---

## IX. LIMITATIONS AND FUTURE WORK

Limitations include **single-region** default assumptions, **manual** multi-tenant partitioning if required later, and **operator-dependent** configuration of OAuth consent screens. Future work: **role-based access control** granularity, **audit logs** export, **native mobile clients**, and **federated identity** (SAML/OIDC enterprise SSO).

---

## X. CONCLUSION

GH.ai demonstrates a **coherent** full-stack architecture suitable for a commercial SaaS MVP: a modern React server environment, a typed Python API, durable PostgreSQL storage, and Redis-backed asynchronous processing. Deployment guidance emphasizes **correct Vercel root selection** and **secure** cross-service communication. The platform is positioned for iterative enhancement as customer feedback and telemetry inform product decisions.

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

