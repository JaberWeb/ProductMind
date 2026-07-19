# ProductMind

AI-powered product management platform. Upload store data, analyze sales, generate content, and chat with your data.

## Tech stack

| Layer | What |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4, daisyUI v5 |
| Backend | Express 5, TypeScript, MongoDB (native driver) |
| Auth | BetterAuth (Next.js) |
| AI | Groq API (llama-3.3-70b) |
| Uploads | UploadThing |

## Structure

```
├── frontend/          Next.js app (App Router)
│   ├── app/           Pages, API routes, layouts
│   ├── components/    React components
│   └── services/      API client functions
├── backend/           Express API server
│   └── src/
│       ├── routes/    Route handlers
│       ├── utils/     LLM client, parsers, schema detection
│       └── types/     TypeScript interfaces
└── .opencode/         Development tooling config
```

## Getting started

**Prerequisites:** Node.js 20+, MongoDB instance.

```bash
# clone
git clone <repo-url>
cd productmind

# frontend
cd frontend
npm install
cp .env.example .env   # fill in your env vars
npm run dev            # http://localhost:3000

# backend (separate terminal)
cd backend
npm install
cp .env.example .env
npm run dev            # http://localhost:5000
```

### Environment variables

**Backend** (`backend/.env`):

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `DATABASE_NAME` | Yes | Database name |
| `GROQ_API_KEY` | Yes | Groq API key for AI features |

**Frontend** (`frontend/.env`):

| Variable | Required | Description |
|---|---|---|
| `BETTER_AUTH_URL` | Yes | Auth URL (usually `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Yes | Auth secret (generate via `npx auth secret`) |
| `NEXT_PUBLIC_BACKEND_URI` | Yes | Backend URL (`http://localhost:5000`) |
| `UPLOADTHING_TOKEN` | For uploads | UploadThing API token |

## Scripts

| Directory | Command | What it does |
|---|---|---|
| `frontend` | `npm run dev` | Start dev server on :3000 |
| `frontend` | `npm run build` | Type-check + Turbopack build |
| `frontend` | `npm run lint` | ESLint |
| `backend` | `npm run dev` | Start dev server on :5000 (tsx watch) |
| `backend` | `npm run build` | TypeScript compile to `dist/` |

## API overview

All authenticated routes are behind `/api/backend-proxy` on the frontend. The Next.js proxy reads the session cookie and forwards the Bearer token to Express.

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/items` | GET | Yes | List items (paginated, searchable) |
| `/api/items/:id` | GET / PUT / DELETE | Yes | CRUD single item |
| `/api/upload/preview` | POST | Yes | Parse file, detect schema |
| `/api/upload/confirm` | POST | Yes | Save parsed rows |
| `/api/analytics/stats` | POST | Yes | Aggregated store stats |
| `/api/analytics/insights` | POST | Yes | AI-generated insights |
| `/api/content/generate` | POST | Yes | AI content generation |
| `/api/chat/message` | POST | Yes | Chat with your store data |
| `/api/chat/conversations` | GET / DELETE | Yes | Manage chat history |
| `/api/contact` | POST | No | Contact form |

## Architecture notes

- **Auth**: BetterAuth runs server-side in Next.js. Express validates tokens by querying MongoDB `session` collection directly — it never creates sessions.
- **Backend proxy**: Frontend services call `/api/backend-proxy/<endpoint>` instead of hitting Express directly. The proxy route reads the HttpOnly session cookie server-side and forwards the Bearer token. No client-side token juggling.
- **AI**: All AI features (content generation, analytics insights, chat assistant) use Groq's OpenAI-compatible API. The `callLLM()` and `callLLMChat()` utilities in `backend/src/utils/llm.ts` handle API calls.
- **Column mapping**: File uploads use rule-based schema detection (40+ known column name variants) with AI fallback via Groq for unmatched columns.

## Deployment

- **Backend**: Deploy `backend/` to any Node.js host (Render, Railway, Fly.io). Set env vars, run `npm run build && npm start`.
- **Frontend**: Deploy `frontend/` to Vercel. Set env vars, the build command is `npm run build`.
- MongoDB: Atlas or any MongoDB-compatible host.
