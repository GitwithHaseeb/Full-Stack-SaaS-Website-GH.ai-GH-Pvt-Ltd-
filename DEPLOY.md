# GH.ai — Deployment Guide (Professional)

This document describes, in order, how the **GH.ai** full-stack SaaS was wired together: **source control (GitHub)**, **frontend (Next.js)**, **backend (FastAPI)**, **data layer (PostgreSQL / Redis)**, **containerization (Docker)**, and **production frontend hosting (Vercel)**. It is written for engineers and operators who need to reproduce or audit the environment.

**Production frontend (reference):** [https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/](https://full-stack-saa-s-website-gh-ai-gh-p.vercel.app/)

---

## 1. Repository and branching

| Step | Action |
|------|--------|
| 1.1 | Create a **GitHub** repository for the monorepo (or use the existing org/user repo). |
| 1.2 | **Clone** the repository locally and open the folder that contains `frontend/` and `backend/` at the same level. |
| 1.3 | Use **`main`** as the default production branch; all fixes and features merge to `main` before production deploys. |
| 1.4 | Never commit **`.env`**, **`frontend/.env.local`**, or real secrets—use `.env.example` / `.env.local.example` only. |

**Remote used in this project (example):** `https://github.com/GitwithHaseeb/Full-Stack-SaaS-Website-GH.ai-GH-Pvt-Ltd-`

---

## 2. PostgreSQL (Neon or any managed host)

| Step | Action |
|------|--------|
| 2.1 | Create a **PostgreSQL 15+** database (e.g. **Neon**, Supabase, RDS, or local Postgres). |
| 2.2 | Copy the provider connection string and convert the SQLAlchemy URL to **`postgresql+asyncpg://`** (this project uses async SQLAlchemy with **asyncpg**). |
| 2.3 | Store the value as **`DATABASE_URL`** in `backend/.env` (see `backend/.env.example`). |
| 2.4 | From `backend/`, run **Alembic** migrations: `alembic upgrade head` (after dependencies are installed). |

---

## 3. Redis and Celery (local / Docker / cloud)

| Step | Action |
|------|--------|
| 3.1 | Run **Redis 7+** (local port 6379 or managed URL). |
| 3.2 | Set **`REDIS_URL`**, **`CELERY_BROKER_URL`**, and **`CELERY_RESULT_BACKEND`** in `backend/.env` as in the example file. |
| 3.3 | Celery workers are started separately from the API process (e.g. `docker compose` service or a process manager in production). |

---

## 4. Backend (FastAPI) — attach and run

| Step | Action |
|------|--------|
| 4.1 | Install **Python 3.12+** and create a virtual environment under `backend/`. |
| 4.2 | `pip install -r requirements.txt` |
| 4.3 | Configure **`SECRET_KEY`**, **`CORS_ORIGINS`**, OAuth/API keys as required (`backend/.env.example`). |
| 4.4 | Start API: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` from the `backend` directory (with `PYTHONPATH` or package layout as in repo). |
| 4.5 | Verify **OpenAPI**: `http://127.0.0.1:8000/docs` and health: `GET /health`, `GET /health/ready`. |

**API prefix:** `/api/v1` for versioned REST; webhooks under `/webhooks` (and duplicate mount under `/api/v1/webhooks` for path-prefixed proxies).

---

## 5. Frontend (Next.js) — attach to backend

| Step | Action |
|------|--------|
| 5.1 | Install **Node.js 20+** and run `npm ci` (or `npm install`) in **`frontend/`**. |
| 5.2 | Copy `frontend/.env.local.example` → **`frontend/.env.local`**. |
| 5.3 | Set **`BACKEND_INTERNAL_URL`** to the FastAPI origin (e.g. `http://127.0.0.1:8000` locally, or `https://api.yourdomain.com` in production). |
| 5.4 | Keep **`NEXT_PUBLIC_API_URL=/api/v1`** so the browser calls the **same-origin** Next route that proxies to FastAPI. |
| 5.5 | Run `npm run dev` — UI on port **3000**; `/api/v1/*` is implemented by `frontend/src/app/api/v1/[...route]/route.ts` and forwards to `BACKEND_INTERNAL_URL`. |

This “attach” pattern avoids exposing the Python server URL to the browser for same-site cookies and CORS simplicity during development.

---

## 6. Docker Compose (full stack locally)

| Step | Action |
|------|--------|
| 6.1 | Install **Docker Desktop** (or Engine) + Compose plugin. |
| 6.2 | From monorepo root: `docker compose up --build`. |
| 6.3 | Services typically include **postgres**, **redis**, **backend**, **frontend**, and **celery worker** (see `docker-compose.yml`). |
| 6.4 | Run **Alembic** inside the backend container once: `docker compose exec backend alembic upgrade head`. |

---

## 7. GitHub → Vercel (frontend production)

| Step | Action |
|------|--------|
| 7.1 | Sign in to **Vercel** and **Import Project** from the same **GitHub** repository. |
| 7.2 | **Framework preset:** **Next.js** (auto-detected from `frontend/package.json`). |
| 7.3 | **Critical:** **Settings → Build & Deployment → Root Directory** = **`frontend`** (not `./`). This ensures `next`, `package-lock.json`, and `next.config.ts` are at the project root for the build. |
| 7.4 | **Production branch:** `main`. |
| 7.5 | **Environment variables** (Vercel project → Environment Variables): mirror `frontend/.env.local.example` — at minimum **`BACKEND_INTERNAL_URL`** must point to a **public HTTPS** API in production. |
| 7.6 | Push to `main` → Vercel builds automatically (~1–2 minutes). Confirm **Deployments** shows **Ready** and the **commit SHA** matches GitHub. |
| 7.7 | If production is stuck on an old commit: **Deployments → Deploy → Create Deployment** → branch **`main`** → select **latest commit** → **Deploy**. Alternately **Promote to Production** on a newer **Ready** deployment. |
| 7.8 | If previews return **401/403**, review **Settings → Deployment Protection** and **Firewall** for the team/plan. |

**Note:** Root-level `vercel.json` with `npm ci --prefix frontend` **conflicts** with **Root Directory = `frontend`** and causes very fast build failures; this repository intentionally uses **frontend-only** root on Vercel.

---

## 8. Backend in production (not on Vercel in default setup)

The API and workers are designed for a **long-running** host (VM, Railway, Render, Fly.io, Kubernetes, etc.) with **PostgreSQL** and **Redis**. Point the Vercel frontend’s **`BACKEND_INTERNAL_URL`** at that HTTPS origin.

---

## 9. Verification checklist

- [ ] GitHub `main` matches Vercel deployment commit.  
- [ ] `GET https://<vercel-host>/` returns marketing shell.  
- [ ] `GET https://<vercel-host>/about` loads (founder section, assets).  
- [ ] Authenticated dashboard flows hit `/api/v1/*` and receive data from live API.  
- [ ] `BACKEND_INTERNAL_URL` and `CORS_ORIGINS` include the Vercel production URL.  

---

## 10. Support references

- **README:** `README.md` — prerequisites, Postgres options, local run.  
- **IEEE-style technical report:** `docs/IEEE-GH-AI-Project-Report.md` — regenerate Word: `python docs/generate_ieee_report.py` → `docs/IEEE-GH-AI-Project-Report.docx`.  

---

*Document version: 1.0 — GH Pvt Ltd — GH.ai*
