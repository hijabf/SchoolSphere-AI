# Deploy guide

GitHub repo: https://github.com/hijabf/SchoolSphere-AI

## 1. Backend → Render (do this first)

1. Open: https://dashboard.render.com/blueprint/new?repo=https://github.com/hijabf/SchoolSphere-AI
2. Connect GitHub if prompted and allow access to `SchoolSphere-AI`
3. Apply the Blueprint (`schoolsphere-api`)
4. Set env var `CORS_ORIGINS` to your Vercel URL after step 2 (e.g. `https://schoolsphere-ai.vercel.app`)
5. Wait for deploy → copy the service URL, e.g. `https://schoolsphere-api.onrender.com`

Health check: `https://YOUR-SERVICE.onrender.com/health`

## 2. Frontend → Vercel

1. Open: https://vercel.com/new/clone?repository-url=https://github.com/hijabf/SchoolSphere-AI&project-name=schoolsphere-ai&root-directory=frontend
2. Import the repo, set **Root Directory** to `frontend`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://YOUR-SERVICE.onrender.com/api/v1`
4. Deploy

## 3. Connect CORS

In Render → Environment → set:

```
CORS_ORIGINS=https://YOUR-APP.vercel.app,http://localhost:3000
```

Redeploy the API if needed.

## Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@schoolsphere.ai | demo1234 |
| Teacher | teacher@schoolsphere.ai | demo1234 |
| Parent | parent@schoolsphere.ai | demo1234 |
| Student | student@schoolsphere.ai | demo1234 |
