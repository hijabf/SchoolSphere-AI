# SchoolSphere AI

**Empowering Schools Through Intelligent Digital Transformation**

AI-powered Educational Intelligence Platform for low-resource schools — with role-based dashboards for Principals, Teachers, Parents, and Students.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, Framer Motion, React Query, Recharts |
| Backend | FastAPI, Pydantic, JWT, SlowAPI rate limiting |
| Database | PostgreSQL (Supabase) — schema in `supabase/migrations` |
| Auth | JWT + Supabase Auth ready |
| AI | Google Gemini (grounded fallbacks when key missing) |
| Deploy | Vercel (frontend) · Render (backend) |

## Quick start (Demo Mode)

Demo mode serves a full Pakistani school dataset (**500 students, 30 teachers, 500 parents, 10 classes, 8 subjects**) without requiring Postgres.

### 1. Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # or: cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
copy .env.example .env.local   # or: cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

### Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@schoolsphere.ai | demo1234 |
| Teacher | teacher@schoolsphere.ai | demo1234 |
| Parent | parent@schoolsphere.ai | demo1234 |
| Student | student@schoolsphere.ai | demo1234 |

## Project structure

```
SchoolSphere-AI/
├── frontend/                 # Next.js SaaS UI
│   └── src/
│       ├── app/              # Landing, auth, role dashboards
│       ├── components/       # UI, charts, landing, layout
│       └── lib/              # api, auth, utils
├── backend/
│   └── app/
│       ├── api/v1/           # REST routes
│       ├── core/             # config, security, rate limit
│       ├── models/           # SQLAlchemy ORM
│       ├── services/         # demo data + Gemini AI
│       └── db/               # sessions
├── supabase/migrations/      # PostgreSQL schema
└── docs/
```

## AI features (20)

All AI endpoints live under `/api/v1/ai/*` and are **grounded in school metrics** (never invent roster data):

1. Report card comments  
2. Parent progress summary  
3. Student performance analyzer  
4. Early warning system  
5. Dropout risk prediction  
6. Principal AI copilot  
7. Teacher performance summary  
8. Monthly school report  
9. Lesson planner  
10. Question paper generator  
11. Quiz analyzer  
12. Study planner  
13. Career guidance  
14. PTM assistant  
15. School health score  
16. Explain charts  
17. Recommendations  
18. Improvement roadmap  
19. Equity dashboard  
20. SDG dashboard  

Set `GEMINI_API_KEY` in `backend/.env` for live Gemini responses. Without it, deterministic grounded fallbacks still work.

## Production / Supabase

1. Create a Supabase project  
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor  
3. Set `DEMO_MODE=false` and configure:

```env
DATABASE_URL=postgresql+asyncpg://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_JWT_SECRET=...
JWT_SECRET=...
GEMINI_API_KEY=...
CORS_ORIGINS=https://your-frontend.vercel.app
```

4. Frontend env:

```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api/v1
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deployment

### Frontend (Vercel)

- Root directory: `frontend`
- Build: `npm run build`
- Env: `NEXT_PUBLIC_API_URL`

### Backend (Render)

- Root: `backend`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Env: copy from `.env.example`

See `render.yaml` and `frontend/vercel.json`.

## License

MIT — portfolio / educational use.
