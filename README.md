# GH.ai — GH Pvt Ltd

Production-style full-stack SaaS: **Next.js 15** (App Router) + **FastAPI** + **PostgreSQL** + **Redis** + **Celery**.

## Prerequisites

Pick one:

- **Recommended without Docker:** PostgreSQL **15+**, Redis **7+** (default `127.0.0.1:5432` / `127.0.0.1:6379`), Python **3.12+**, Node **20+**.
- **Optional:** [Docker](https://docs.docker.com/get-docker/) + Compose if you prefer containers later.

## Run locally (PostgreSQL + Redis — no Docker)

1. **PostgreSQL:** create database `ghai` (e.g. `CREATE DATABASE ghai;`) and a user/password that match your URL.

2. **Redis:** start `redis-server` listening on **6379** (Windows: [Memurai](https://www.memurai.com/) developer, WSL Redis, or a native port of Redis). Celery and the app expect Redis at **`redis://127.0.0.1:6379/0`** unless you override.

3. **Backend env:** copy `backend/.env.example` → `backend/.env` and edit `DATABASE_URL` if your Postgres user/password differ.

4. **Frontend env:** copy `frontend/.env.local.example` → `frontend/.env.local` (keeps `BACKEND_INTERNAL_URL=http://127.0.0.1:8000` for the Next.js API proxy).

5. **Migrations & API** (from `backend/`):

```powershell
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

6. **Celery worker** (second terminal, same venv + `backend/`):

```powershell
celery -A app.tasks.celery_app worker -l info
```

7. **Frontend** (third terminal, from `frontend/`):

```powershell
npm install
npm run dev
```

- **UI:** http://localhost:3000  
- **API docs:** http://localhost:8000/docs  
- **API base (browser → Next proxy):** `/api/v1` on port 3000, forwarded to FastAPI on 8000.

## Quick start (Docker — optional)

From this directory:

```bash
docker compose up --build
```

### First-time database migrations (Docker)

```bash
docker compose exec backend alembic upgrade head
# or
docker compose exec backend python -m alembic upgrade head
```

## Gmail webhooks (ngrok)

For Gmail `users.watch`, Google must reach a public HTTPS URL. For local development, expose the backend with [ngrok](https://ngrok.com/) (or similar) and set the watch callback to your tunnel URL pointing at `POST /webhooks/gmail`. Document the URL in your Google Cloud Console OAuth consent and Gmail API configuration.

## Environment variables

**`backend/.env`** — see `backend/.env.example` in the repo (copy to `.env`).

**`frontend/.env.local`** — see `frontend/.env.local.example` (copy to `.env.local`).

## Founders

- **Ghania Tanveer** — ghaniatanveer061@gmail.com  
- **Muhammad Haseeb** — haseebch8130@gmail.com  

## Troubleshooting

- **`npm install` / `npm run build` fails with `ENOSPC`**: free disk space on the drive hosting `node_modules` and the npm cache (often `C:\\Users\\<you>\\AppData\\Local\\npm-cache`), then retry.
- **`favicon.ico`**: the app also ships `src/app/icon.tsx` (GH monogram) and `public/logo.svg` for branding in the UI.

## License

Proprietary — GH Pvt Ltd.
