# The Vanguard

> **Power Over Everything**

A community platform where minorities connect, inform, support, and supply one another.

## What's here

The app is organized around four pillars:

- **Connect** — a member directory and discussion feed, filterable by identity/interest tag and city.
- **Inform** — a searchable resource library (Know Your Rights, Financial Literacy, Health & Wellness, Education, Civic Power).
- **Support** — a backing board (calls for backup / backing offered), member to member.
- **Supply** — a marketplace for goods/services/jobs, and a minority-owned business directory.

Plus a community **Events** calendar with RSVP, an **About** page telling the platform's story, and a full membership system — signup, login, and profile.

## Architecture

This is a two-part app: a React frontend and a Django REST API backend, run as separate processes locally.

```
thevanguard/
├── src/                # React app (Vite)
├── backend/            # Django REST API
│   ├── accounts/       #   custom User model, signup/login/me
│   └── core/            #   discussions, backing board, listings,
│                        #   businesses, events, resource library
└── .env                 # VITE_API_URL for the frontend
```

- **Frontend**: React 19 + Vite + Tailwind CSS v4 + React Router + lucide-react icons.
- **Backend**: Django 6 + Django REST Framework, SQLite, token auth (`rest_framework.authtoken`), `django-cors-headers` for the cross-origin dev setup.
- All content — members, discussions, the backing board, marketplace listings, businesses, events (with real RSVPs), and the resource library — is real data served by the Django API, not mock/local data. Only static brand content (the four pillar taglines, the identity-tag vocabulary, and the marketing stat strip) lives in the frontend (`src/data/seed.js`).

### Auth model

Real password auth: signup requires a password (checked against Django's configured validators — 8+ characters, not too common, not entirely numeric), and login checks it with Django's standard `authenticate()`. The backend issues a DRF auth token on successful signup/login, which the frontend stores in `localStorage` and sends as `Authorization: Token <key>` on every write; logging out deletes the token server-side. A token that's been revoked (or belongs to a deleted account) is treated as "logged out" rather than breaking the app — see `src/lib/api.js`.

## Getting started

You need two terminals — one for the backend, one for the frontend.

### 1. Backend (Django API)

```bash
cd backend
python -m venv .venv
./.venv/Scripts/pip install -r requirements.txt   # Windows
# source .venv/bin/activate && pip install -r requirements.txt   # macOS/Linux

./.venv/Scripts/python manage.py migrate
./.venv/Scripts/python manage.py seed_demo_data     # loads the demo members/content
./.venv/Scripts/python manage.py runserver 0.0.0.0:8000
```

The API is now at `http://localhost:8000/api/`. Django admin is at `http://localhost:8000/admin/` — use `manage.py createsuperuser` to make your own login, or use the seeded one:

- email: `admin@thevanguard.local`
- password: `vanguard-admin`

To log in as a member **in the app itself** (not admin), use any of the seeded personas (Amara Johnson, Marcus Lee, Sofia Reyes, Dominique Carter, Leilani Kahale, Jordan Vance, Priya Natarajan, Elena Okafor — see `core/management/commands/seed_demo_data.py` for their emails) with password:

- password: `vanguard-demo`

Re-running `seed_demo_data` is safe — it skips demo content it's already created, but always (re)sets the seeded members' passwords back to `vanguard-demo`, so it also doubles as a way to reset them. Pass `--flush` to wipe and fully reseed the demo members and content from scratch.

### 2. Frontend (React)

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to `http://localhost:5173`). The frontend reads the API base URL from `.env` (`VITE_API_URL`, defaults to `http://localhost:8000/api`) — update it if you run the backend somewhere else.

`npm run build` produces a static production build in `dist/`.

## What's manageable via Django admin

Because discussions, backing calls, listings, businesses, events, and resources are real models, anything seeded (or added by members) can be moderated, edited, or added to directly at `/admin/` — including adding a brand-new `Resource` with a new category, which will automatically show up as a filter chip on the Inform page with no code changes.

## Deployment (Render)

Live at **https://the-vanguard.onrender.com** — one Render web service running the whole app, not two:

- `build.sh` runs `npm run build` first, then the Django build steps (`pip install`, `collectstatic`, `migrate`, `seed_demo_data`).
- Django serves its own API under `/api/` and `/admin/` as usual. `whitenoise` also serves the built frontend's `dist/assets/*` directly (via `WHITENOISE_ROOT` in `settings.py`), and a catch-all view (`backend/config/views_spa.py`) returns `dist/index.html` for every other path, so React Router's client-side routes (`/connect`, `/support`, etc.) resolve correctly on a direct hit or page refresh — not just when navigated to client-side.
- This exists because Render's static-site product needs its rewrite/redirect rules configured through the Dashboard UI (or a `render.yaml` blueprint) — there's no API for it — so a plain two-service split (API + static site) would 404 on every route but `/` with no way to fix it from here. Frontend and API being same-origin in production also means no CORS is actually in play there, even though `django-cors-headers` stays configured for local dev.
- Database is SQLite on Render's ephemeral disk (by choice, to avoid the cost of a second Postgres instance) — **any real signups, posts, or listings created on the live site are wiped on the next deploy**, since `build.sh` re-seeds fresh demo data every time. Swap in a real Postgres (`DATABASE_URL` env var — `dj-database-url` already reads it) whenever that tradeoff stops being acceptable.
- A separate static site, `the-vanguard-frontend` (https://the-vanguard-frontend.onrender.com), was created before this consolidation and is no longer used — it has the same unfixable routing problem described above. Safe to delete from the Render dashboard.

## Notes

This ships configured for local development only: `DEBUG=True`, a placeholder `SECRET_KEY`, and CORS/allowed-hosts opened up to the Vite dev server. Production values are set as environment variables directly on the Render service (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CSRF_TRUSTED_ORIGINS`) rather than committed. There's also no password-reset flow yet ("forgot password") — worth adding (email-based reset, or a magic link) before this handles real members' accounts.
