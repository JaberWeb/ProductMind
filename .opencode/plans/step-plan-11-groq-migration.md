# Step Plan 11 — Groq Migration (Replace Gemini)

## Goal

Replace Gemini 2.0 Flash with Groq's free API (Llama 3.3 70B) for both AI insights and column mapping. Gemini's free tier rate-limited us immediately due to token quotas. Groq offers a permanent free tier with no credit card and better JSON mode support.

## Why Groq

| Factor | Gemini Free | Groq Free |
|--------|-------------|-----------|
| Credit card | Not required | Not required |
| Rate limits | 15 RPM, low token quota | 30 RPM, 1K RPD, 12K TPM |
| Model | `gemini-2.0-flash` | `llama-3.3-70b-versatile` |
| API format | Google-specific REST | OpenAI-compatible |
| JSON mode | Prompt-based (unreliable) | `response_format: {type:"json_object"}` — guaranteed valid JSON |

The OpenAI-compatible format means we can switch providers later by just changing the base URL and model name.

## Prerequisites

- [ ] Sign up at https://console.groq.com (Google/GitHub/email — no credit card)
- [ ] Copy the `gsk_...` API key from the dashboard

## Files to create

### `backend/src/utils/llm.ts`

Shared LLM utility wrapping Groq's OpenAI-compatible endpoint:

```ts
const BASE = "https://api.groq.com/openai/v1";

export async function callLLM(
  system: string,
  user: string,
  opts?: { json?: boolean; model?: string; maxTokens?: number }
): Promise<string>
```

- Sends POST to `{BASE}/chat/completions`
- Auth via `Authorization: Bearer` header using `process.env.GROQ_API_KEY`
- When `json: true`, sets `response_format: { type: "json_object" }` — forces valid JSON
- Default model: `llama-3.3-70b-versatile`
- Default maxTokens: 4096
- Returns the content string from `choices[0].message.content`
- Throws on non-2xx with the API error message

## Files to modify

### `backend/src/routes/analytics.ts` — Insights endpoint

- Replace the raw Gemini `fetch()` call with `callLLM()`
- Remove the regex `text.match(/\[[\s\S]*\]/)` JSON extraction hack
- With `response_format: "json_object"`, the response is guaranteed valid JSON
- The prompt compresses further since Groq handles JSON natively
- Keep the same data payload shape — just change the transport

### `backend/src/utils/gemini.ts` — Column mapping

- Replace the Gemini `fetch()` with `callLLM()`
- `inferColumnsWithAI()` keeps the same signature — only internal implementation changes
- This file can optionally be renamed to `utils/column-mapper.ts` later

### `backend/.env`

- Add `GROQ_API_KEY=gsk_...`

### Optional: `frontend/.env`

- Add `GROQ_API_KEY=gsk_...` (only for reference — backend handles all LLM calls)

## Test plan

1. Restart backend
2. Open `/analytics` — insights should load without rate limit errors
3. Check confidence badges and metric labels render correctly
4. Upload a CSV with unmapped columns — AI column mapping should work

## Rollback

If Groq doesn't work, switch back to Gemini by:
1. Setting `GEMINI_API_KEY` instead of `GROQ_API_KEY` in `.env`
2. Reverting `utils/llm.ts` or pointing it back at Gemini's endpoint
