# AI Analytics — Rate Limit Issue

The AI Insights panel on `/analytics` currently returns:

```
Gemini API error (429): Quota exceeded for metric:
generativelanguage.googleapis.com/generate_content_free_tier_input_token_count
```

## Cause

Gemini 2.0 Flash **free tier** has tight rate limits:
- ~60 requests per minute
- ~30,000 input tokens per minute

Our insights prompt sends a large structured payload (overview + category breakdown + top products + monthly trend + pricing data) which exhausts the free token quota in 1–2 requests. The free tier resets after ~60 seconds, but subsequent page loads / filter changes consume the quota again immediately.

## Impact

- The insights query auto-fires when stats finish loading (`enabled: !!stats`)
- Every filter change triggers a new Gemini API call
- The 429 error is surfaced in the UI: red banner with the error message
- The stats endpoint (charts, stat cards, filters) **still works** — only AI insights are affected

## Fix Options (deferred — choose one)

| Option | Effort | Effect |
|--------|--------|--------|
| Upgrade to paid Gemini tier (e.g. `gemini-2.0-flash` pay-as-you-go) | Low | No more quota errors |
| Switch to `gemini-2.0-flash-lite` (smaller model) | Low | Reduces token cost, slightly lower quality |
| Cache insight results per filter combo (1hr TTL) | Medium | Avoids refetching identical queries |
| Rate-limit the insights query (debounce, cooldown) | Low | Prevents rapid refire but still hits quota on first load |

## Current implementation

- Model: `gemini-2.0-flash`
- Auth: `X-Goog-Api-Key` header
- Prompt: compact, no sample items, ~800 tokens
- Data payload: overview, categories, top products, platforms, monthly revenue, pricing distribution

## To restore functionality

1. Set `GEMINI_API_KEY` to a paid-tier key in `backend/.env`
2. Restart the backend
3. Insights will start working immediately
