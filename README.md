# ProductMind

Upload store data, analyze sales, generate AI content, chat with your data.

## Table of contents

- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API overview](#api-overview)
- [Architecture](#architecture)
- [Deployment](#deployment)

## User flow

1. **Sign up / Log in.** Create an account or log in. Your data is private — you only see what you upload.

2. **Upload your file.** Drop a CSV or Excel file from any store (Shopify, WooCommerce, Amazon, Etsy — or a plain list). The system accepts `.csv`, `.xlsx`, and `.xls`.

3. **Auto-detect & map.** The system reads your column names and tries to match them to its own fields (product name, price, quantity, date, etc.). If some columns aren't recognised, you can map them manually or let the AI figure it out.

4. **Preview & confirm.** You see a preview of how your data will look. If it's correct, click save. The data goes into the database.

5. **Manage items.** View, search, edit, or delete your uploaded records from the items page.

6. **See analytics.** Charts show your revenue, top products, best categories, and sales over time. The AI can also generate plain-English business insights ("Your highest revenue category is Electronics at $12,400").

7. **Generate content.** Pick a product and ask the AI to write a title, description, SEO snippet, or social media post. Choose tone and length.

8. **Chat with your data.** Ask questions like "What was my best-selling product last month?" or "Which category has the lowest margin?" — the AI answers based on your actual uploaded data.

## Tech stack

| Layer | What |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, daisyUI v5 |
| Backend | Express 5, TypeScript, MongoDB native driver |
| Auth | BetterAuth (server-side in Next.js) |
| AI | Groq API (llama-3.3-70b-versatile) |
| File uploads | UploadThing |
| Charts | Recharts |
| Server state | TanStack Query |
| Forms | react-hook-form |

## Project structure

```
├── frontend/                    Next.js 16 App Router
│   ├── app/
│   │   ├── (public)/            Landing, login, register, about, contact, pricing, features
│   │   ├── (protected)/         Dashboard, upload, items, analytics, AI assistant
│   │   └── api/
│   │       ├── auth/[...all]/   BetterAuth handler
│   │       └── backend-proxy/   Forwards auth + requests to Express
│   ├── components/              React components (layout, upload, items, charts, chat, sections)
│   ├── services/                API client functions (calls backend-proxy)
│   └── lib/                     Auth client config, UploadThing helpers
│
├── backend/                     Express 5 API server
│   └── src/
│       ├── server.ts            Entry point, middleware, route registration
│       ├── db.ts                MongoDB connection singleton
│       ├── routes/              Contact, upload, items, analytics, content, chat, dashboard
│       ├── utils/               LLM client (Groq), CSV/XLSX parsers, schema detector
│       └── types/               Shared interfaces
│
└── .opencode/                   Dev tooling config
```

## Getting started

**Prerequisites:** Node.js 20+, a MongoDB instance (Atlas or local).

```bash
git clone https://github.com/JaberWeb/ProductMind.git
cd productmind

# frontend
cd frontend
npm install
cp .env.example .env
# edit .env with your values
npm run dev              # http://localhost:3000

# backend (separate terminal)
cd backend
npm install
cp .env.example .env
# edit .env with your values
npm run dev              # http://localhost:5000
```

## Environment variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `DATABASE_NAME` | Yes | Database name |
| `GROQ_API_KEY` | Yes | Groq API key (AI features) |
| `GEMINI_API_KEY` | No | Gemini API key (unused fallback) |
| `SMTP_HOST` | For contact | SMTP server |
| `SMTP_USER` | For contact | SMTP username |
| `SMTP_PASS` | For contact | SMTP password |
| `CONTACT_EMAIL` | For contact | Where contact form submissions go |
| `PORT` | No | Defaults to 5000 |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_URL` | Yes | Auth URL (usually `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Yes | Run `npx auth secret` to generate one |
| `NEXT_PUBLIC_BACKEND_URI` | Yes | Backend URL (`http://localhost:5000`) |
| `UPLOADTHING_TOKEN` | For uploads | UploadThing API token |

## Scripts

| Dir | Command | What it does |
|---|---|---|
| `frontend` | `npm run dev` | Dev server on :3000 |
| `frontend` | `npm run build` | Type check + Turbopack build |
| `frontend` | `npm run lint` | ESLint |
| `frontend` | `npm start` | Production server on :3000 |
| `backend` | `npm run dev` | Dev server on :5000 (tsx watch) |
| `backend` | `npm run build` | tsc to `dist/` |
| `backend` | `npm start` | Run compiled `dist/server.js` |

## API overview

All authenticated endpoints require a valid session. Frontend should call them through the backend proxy (`/api/backend-proxy/<path>`) — never directly. The proxy handles token forwarding server-side.

Public endpoints:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/contact` | Contact form (saves to DB + sends email) |
| GET | `/api/test` | Health check |
| GET | `/health` | Health check |

Authenticated endpoints:

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/upload/preview` | Parse CSV/XLSX, detect schema, return preview |
| POST | `/api/upload/confirm` | Accept mapping, save rows to `items` collection |
| GET | `/api/items?page=&limit=&search=` | Paginated, searchable item list |
| GET | `/api/items/:id` | Single item detail |
| PUT | `/api/items/:id` | Update item fields |
| DELETE | `/api/items/:id` | Delete item (owner-scoped) |
| POST | `/api/analytics/stats` | Aggregated stats (revenue, counts, categories, trends) |
| POST | `/api/analytics/insights` | AI-generated business insights (Groq) |
| GET | `/api/dashboard/stats` | Dashboard summary counts |
| POST | `/api/content/generate` | AI content generation (title, description, SEO, social) |
| POST | `/api/content/save` | Persist generated content to item |
| POST | `/api/chat/message` | Send message, get AI response with store context |
| GET | `/api/chat/conversations` | List user's chat conversations |
| GET | `/api/chat/conversations/:id` | Full conversation with messages |
| DELETE | `/api/chat/conversations/:id` | Delete conversation |

## Architecture

**Auth flow.** BetterAuth lives in Next.js (`app/api/auth/[...all]/route.ts`). It creates sessions in MongoDB's `session` collection. The session token goes into an HttpOnly cookie (`better-auth.session_token`). The frontend never touches this cookie directly.

**Backend proxy pattern.** Frontend services call `/api/backend-proxy/<endpoint>`. The proxy route in Next.js reads the session cookie server-side via `auth.api.getSession()`, extracts the token, and forwards it as `Authorization: Bearer <token>` to Express. This avoids CORS issues and keeps token handling out of client JS.

**Express auth.** Express has its own auth middleware that validates the Bearer token by querying the MongoDB `session` collection. It never creates sessions — it's read-only on auth. The middleware normalises the MongoDB document `_id` to `id` so all routes use a consistent `req.user.id`. The contact endpoint is registered before the auth middleware so it stays public.

**Upload pipeline.** Files go to UploadThing, which returns a URL. That URL is sent to `/api/upload/preview`, which downloads the file (capped at 10MB, 10s timeout), parses it (CSV via csv-parse, XLSX via the xlsx library), runs rule-based schema detection against 40+ known column name variants, and falls back to Groq for unmapped columns if confidence is below 80%. The user reviews the mapping, then `/api/upload/confirm` re-downloads, normalises (dates are stored as ISODate objects), and bulk-inserts into the `items` collection.

**AI features.** All AI runs through Groq's API (`llama-3.3-70b-versatile`) via two utilities in `backend/src/utils/llm.ts`: `callLLM()` for single-turn generation (content, insights) and `callLLMChat()` for multi-turn chat. AI does four things:
1. Column mapping fallback when rules don't match
2. Content generation (product titles, descriptions, SEO, social posts) with configurable length/tone
3. Analytics insights — sends structured store data to Groq, gets back 5 business insights with confidence levels
4. Chat assistant — streams store context (total items, revenue, top categories/products) into the system prompt so the model answers questions about the user's actual data

**MongoDB collections.** `session` and `user` (BetterAuth), `items` (uploaded product data), `conversations` (chat history with messages), `contacts` (form submissions).

**Performance.** Indexes are created lazily on first request (not at deploy time) via `ensureIndexes()` in `server.ts`: `session.token`, `items.ownerId+createdAt`, `items.ownerId+date`, `conversations.userId+updatedAt`. Analytics endpoints use `$facet` aggregation pipelines to consolidate what used to be 10+ separate round trips into a single query. External calls (Groq API, file download, SMTP) have explicit timeouts (10-15s) to prevent cold-start functions from hanging.

## Deployment

**Frontend** goes to Vercel. Point it at `frontend/`, set the env vars (especially `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_BACKEND_URI` pointing to the deployed backend). Build command: `cd frontend && npm run build`. The `backend-proxy` route needs to reach the backend — make sure the backend URL is accessible from Vercel's network.

**Backend** can go to Render, Railway, Fly.io, or any Node.js host. Set env vars, then `npm run build && npm start`. The Express server is a standard Node process — Vercel also supports it via the `vercel.json` in `backend/` which deploys through `@vercel/node`.

**MongoDB** — Atlas works fine. Just put the connection string in `MONGODB_URI`. The driver connects, creates collections on first write, no schema migrations needed.

**UploadThing** needs the token set in both frontend and backend env vars. The frontend uploads files to UploadThing CDN, then passes the URL to the backend for processing.
