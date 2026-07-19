# Step Plan 10 — Deployment

## Goal

Deploy both frontend and backend to Vercel, configure environment variables, set up MongoDB Atlas production cluster, and verify everything works.

## Depends on

- All previous step plans complete
- Vercel account
- MongoDB Atlas account

## Tasks

### MongoDB Atlas
- [ ] Create production MongoDB Atlas cluster (M0 free tier or higher)
- [ ] Create database user with strong password
- [ ] Whitelist Vercel deployment IPs (or 0.0.0.0/0 for dev)
- [ ] Get connection string
- [ ] Create `productmind` database
- [ ] Test connection locally with production URI

### Vercel — Frontend
- [ ] Push code to GitHub repository
- [ ] Import frontend repo to Vercel
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `.next`
- [ ] Add environment variables:
  - `NEXT_PUBLIC_BACKEND_URI` → backend deployment URL
  - `MONGODB_URI` → Atlas production URI
  - `DATABASE_NAME` → `productmind`
  - `BETTER_AUTH_SECRET` → strong random secret
  - `BETTER_AUTH_URL` → frontend deployment URL
  - `GEMINI_API_KEY` → Gemini API key
- [ ] Deploy

### Vercel — Backend
- [ ] Import backend repo to Vercel (or same repo with monorepo settings)
- [ ] Set root directory: `backend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Add environment variables:
  - `PORT` → (Vercel handles this)
  - `MONGODB_URI` → Atlas production URI
  - `DATABASE_NAME` → `productmind`
  - `CORS_ORIGIN` → frontend deployment URL
  - `GEMINI_API_KEY` → Gemini API key
  - SMTP config (if contact form active)
- [ ] Deploy

### Verify
- [ ] Frontend URL loads without errors
- [ ] Backend `/api/test` returns OK
- [ ] Auth: register, login, session persist
- [ ] Upload: file upload works end-to-end
- [ ] Analytics: charts render with data
- [ ] Content generator: AI generates content
- [ ] Chat: messages send and receive
- [ ] Public pages: landing, about, contact, pricing, features render
- [ ] Responsive: all pages work on mobile
- [ ] No console errors

### Post-deployment
- [ ] Set up custom domain (optional)
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up monitoring / error tracking (optional)
- [ ] Update `.env.example` with production-ready comments
- [ ] Add deployment URLs to README/AGENTS.md

## Files to modify
- `vercel.json` (backend) — verify config is correct
- `next.config.ts` — add any production-specific config
- `AGENTS.md` — add deployment URLs

## Verify
- Frontend and backend both return 200 on production URLs
- Auth flow works end-to-end
- All CRUD operations work against production DB
- File upload works with production limits
