# GH.ai — GH Pvt Ltd

Production-oriented full-stack SaaS: **Next.js 15** (App Router) · **FastAPI** · **PostgreSQL** · **Redis** · **Celery** (async SQLAlchemy + **asyncpg**).

**Production (Vercel — frontend):** [https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/](https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/)

**Documentation:** step-by-step deployment → [`DEPLOY.md`](./DEPLOY.md). IEEE-style technical report (Markdown + Word generator) → [`docs/IEEE-GH-AI-Project-Report.md`](./docs/IEEE-GH-AI-Project-Report.md); generate Word with `python docs/generate_ieee_report.py` → `docs/IEEE-GH-AI-Project-Report.docx`. **Asaan user flow (Roman Urdu):** [`docs/ASAAN-GUIDE.md`](./docs/ASAAN-GUIDE.md).

## Architecture

| Layer | Technology | Role |
|--------|------------|------|
| Web UI | Next.js 15, React 19, Tailwind | Marketing site, auth UI, dashboard; browser calls same-origin `/api/v1/*` proxied to FastAPI |
| API | FastAPI, Pydantic v2 | REST + webhooks; **all application entities persist in PostgreSQL** |
| Data | **PostgreSQL 15+** via `postgresql+asyncpg://` | Single source of truth (users, leads, campaigns, Calendly events, etc.) |
| Jobs | Celery + Redis | Background email and scoring tasks |
| Cache / broker | Redis 7+ | Celery broker and optional app caching |

There is **no SQLite or file-based database** in this codebase: a running PostgreSQL instance (local, Docker, or managed cloud) is **required** for the API and Alembic migrations.

## Prerequisites

- **PostgreSQL 15+** (listening URL must use driver prefix `postgresql+asyncpg://` in `DATABASE_URL`)
- **Redis 7+** on port **6379** (or override `REDIS_URL` / Celery URLs)
- **Python 3.12+** (backend)
- **Node.js 20+** (frontend)

Optional: **Docker** + Compose to run Postgres + Redis + app containers (see below).

## Vercel (frontend only)

**One-time setup (Settings)**

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → select project **full-stack-saa-s-website-gh-ai-gh-pvt-ltd** (or your project name).
2. **Settings** (top) → **Build & Deployment** → **Root Directory** → **Edit**.
3. Clear `./` and set **`frontend`** (the folder that contains `frontend/package.json`) → **Save**.

**Deploy the latest commit from `main` (when production is stuck on an old SHA)**

1. **Deployments** tab (left sidebar).
2. Top right: **Deploy** menu → **Create Deployment** (if you see it).  
   - **Branch:** `main`  
   - Open the **commit** dropdown and choose the **top / newest** row (same short SHA as on GitHub `main`, e.g. `a3a24ba` or whatever is latest).  
   - Enable **Production** if asked → **Deploy**.
3. **Alternate:** open the latest row that already built from GitHub (green **Ready**) → open it → **⋯** (three dots) → **Promote to Production** (if your “Current” is older).
4. **Alternate:** **Redeploy** on any deployment → leave branch **`main`** → turn **“Use existing Build Cache”** **off** → **Redeploy** (rebuilds latest linked commit depending on UI).

**After every `git push` to `main`**

- Vercel usually starts a new deployment automatically in ~1–2 minutes. Open **Deployments** and confirm the newest row shows **Ready** and the **commit** matches GitHub.

**Env**

- Add frontend env vars (see `frontend/.env.local.example`); set `BACKEND_INTERNAL_URL` to your hosted API when FastAPI is not on Vercel.

## PostgreSQL: choose one setup

### A. Local install (no Docker)

1. Create role/database, e.g.:

   ```sql
   CREATE DATABASE ghai;
   ```

2. Set `DATABASE_URL` in `backend/.env` to match user, password, host, and database name.

### B. Docker Compose (Postgres + Redis + apps)

From the repository root:

```bash
docker compose up --build
```

Postgres is defined as `postgres:15` with database `ghai`, user/password `postgres`/`postgres` (override in `docker-compose.yml` or env for production).

**First-time migrations:**

```bash
docker compose exec backend alembic upgrade head
```

### C. Managed PostgreSQL (Neon, Supabase, Railway, AWS RDS, …)

1. Create a database and obtain the connection string (often `postgresql://…`).
2. For this project, **change the scheme** to **`postgresql+asyncpg://`** so SQLAlchemy uses the async driver already declared in `requirements.txt`.
3. If the provider requires TLS, append query parameters as documented by the host (e.g. `?ssl=require`).

Example shape (values are illustrative only):

```env
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@ep-example.region.aws.neon.tech/neondb?ssl=require
```

## Environment files

| File | Purpose |
|------|---------|
| `backend/.env.example` | Template for FastAPI — copy to `backend/.env` |
| `frontend/.env.local.example` | Template for Next.js — copy to `frontend/.env.local` |

Never commit real `.env` or `.env.local` files (they are listed in `.gitignore`).

## Run locally (PostgreSQL + Redis already running)

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Health checks**

- `GET http://localhost:8000/health` — process liveness (no DB).
- `GET http://localhost:8000/health/ready` — **PostgreSQL** connectivity (`SELECT 1`); returns **503** if the database is unreachable.

### Celery worker (second terminal, same venv, `backend/`)

```powershell
celery -A app.tasks.celery_app worker -l info
```

### Frontend (third terminal)

```powershell
cd frontend
npm install
copy .env.local.example .env.local
npm run dev
```

- **Marketing / app UI:** http://localhost:3000  
- **OpenAPI:** http://localhost:8000/docs  
- **Browser API path:** `/api/v1` on port 3000 (Next.js route forwards to FastAPI on 8000 via `BACKEND_INTERNAL_URL`).

## Gmail webhooks (ngrok)

For Gmail `users.watch`, Google needs a public HTTPS URL. Expose the backend (e.g. [ngrok](https://ngrok.com/)) and point the watch callback to `POST /webhooks/gmail` (direct backend) or `POST /api/v1/webhooks/gmail` when the API is only routed under `/api` (e.g. Vercel Services). Register the tunnel hostname in Google Cloud Console (OAuth + Gmail API) as required.

## Troubleshooting

- **`DATABASE_URL` validation error on startup:** URL must start with `postgresql+asyncpg://`. Hosted strings that start with `postgresql://` must be adjusted as described above.
- **`npm install` / `npm run build` fails with `ENOSPC`:** Free disk space for `node_modules` and the npm cache (often `%LocalAppData%\npm-cache` on Windows).
- **Branding:** Favicon is set in `frontend/src/app/layout.tsx` (`/logo.svg`); the same `frontend/public/logo.svg` is used in the UI.

## Founders

- **Ghania Tanveer** — ghaniatanveer061@gmail.com  
- **Muhammad Haseeb** — haseebch8130@gmail.com  

## License

Proprietary — GH Pvt Ltd.
