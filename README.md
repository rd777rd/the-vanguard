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

## Notes

This ships configured for local development only: `DEBUG=True`, a placeholder `SECRET_KEY`, and CORS/allowed-hosts opened up to the Vite dev server. Set real values via environment variables (`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `DJANGO_CORS_ALLOWED_ORIGINS`) before deploying anywhere real. There's also no password-reset flow yet ("forgot password") — worth adding (email-based reset, or a magic link) before this handles real members' accounts.
