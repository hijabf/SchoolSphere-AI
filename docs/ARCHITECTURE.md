# Architecture overview

## Auth flow

1. User signs in via `POST /api/v1/auth/login`
2. Backend returns JWT with `sub`, `role`, `email`, `school_id`
3. Frontend stores token in `localStorage` + `ss_token` cookie
4. Middleware protects `/admin|/teacher|/parent|/student`
5. API calls send `Authorization: Bearer <token>`
6. FastAPI `deps.require_roles` enforces RBAC

## Demo vs production

- `DEMO_MODE=true`: rich in-memory Pakistani dataset, no Postgres required
- `DEMO_MODE=false`: SQLAlchemy + Supabase Postgres + optional Supabase Auth JWT validation

## AI grounding

`app/services/ai/gemini.py` always injects `school_context_for_ai()` (counts, attendance, GPA, fees, weak subjects). Gemini is optional; fallbacks use the same metrics.
