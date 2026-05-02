# GH.ai — GH Pvt Ltd

Production-oriented full-stack SaaS: **Next.js 15** (App Router) · **FastAPI** · **PostgreSQL** · **Redis** · **Celery** (async SQLAlchemy + **asyncpg**).

**Live (Vercel — frontend):** [https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/](https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/)

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

1. Import the **same GitHub repo** you push to (`GitwithHaseeb/Full-Stack-SaaS-Website-GH.ai-GH-Pvt-Ltd-`, branch **`main`**).
2. **Root Directory** — either works:
   - **Repository root** `.` (default): root `package.json` + `vercel.json` install/build `./frontend` (committed in this repo).
   - **`frontend`**: leave Framework **Next.js**; no need for root overrides.
3. **Deployments → Redeploy** and confirm the deployment **commit** is the latest on GitHub.
4. Add env vars for the frontend (see `frontend/.env.local.example`); set `BACKEND_INTERNAL_URL` to your hosted API when FastAPI is not on Vercel.

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
