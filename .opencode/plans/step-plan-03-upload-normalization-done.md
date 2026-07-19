# Step Plan 03 — Upload + Normalization Flow (Uploadthing)

## Goal

Build the CSV/Excel upload UI, backend file parsing, schema auto-detection, AI column inference fallback, and normalized data storage. Files are uploaded via **Uploadthing** (CDN) to avoid Vercel's 10 MB serverless body limit.

## Depends on

- Step Plan 01 (protected routes exist)
- Backend server with Express routes
- `UPLOADTHING_TOKEN` set in **both** `frontend/.env` and `backend/.env` (already done)

---

## Architecture

```
User drops file
  → Uploadthing React SDK (direct-to-CDN, no Vercel body limit)
  → Returns file URL
  → POST /api/upload/preview { fileUrl, fileName }
  → Express backend fetches file from Uploadthing CDN
  → Parses CSV / XLSX → returns preview + column mapping
  → POST /api/upload/confirm → saves to MongoDB `items` collection
```

---

## Backend tasks

- [ ] Install `csv-parse`, `xlsx` in backend (remove mulch — no file-body needed)
- [ ] Create `src/routes/upload.ts`
  - `POST /api/upload/preview` — accepts `{ fileUrl, fileName }`, fetches the file from Uploadthing CDN via `fetch()`, parses, returns preview (first 5 rows) + stats + confidence
  - `POST /api/upload/confirm` — accepts `{ fileUrl, fileName, rows[] }`, saves all normalized rows to MongoDB `items` collection with `ownerId`, `sourceFile`, `confidenceScore`, `createdAt`
- [ ] Create `src/utils/fetch-file.ts` — helper that `fetch(fileUrl)` → buffer (handles errors, size limits)
- [ ] Create `src/utils/csv-parser.ts` — parse buffer with `csv-parse`
- [ ] Create `src/utils/xlsx-parser.ts` — parse buffer with `xlsx`
- [ ] Create `src/utils/schema-detector.ts` — map known column names to normalized schema
- [ ] Create `src/utils/gemini.ts` — Gemini API helper for AI column inference fallback
- [ ] Schema auto-detection: known fields — `orderId`, `productName`, `quantity`, `price`, `revenue`, `date`, `category`, `customerEmail`, `sourcePlatform`
- [ ] AI fallback: if columns don't match known names, send headers row to Gemini for mapping
- [ ] Normalize parsed rows to standard sales schema

## Frontend tasks

- [ ] Install `uploadthing` and `@uploadthing/react` in frontend
- [ ] Create `app/api/uploadthing/core.ts` — define file route (accept `.csv`, `.xlsx`, `.xls` only)
- [ ] Create `app/api/uploadthing/route.ts` — `export { GET, POST }` from uploadthing's Next.js handler
- [ ] Create `lib/uploadthing.ts` — client-side Uploadthing config (export `useUploadThing` hook)
- [ ] Add `UPLOADTHING_TOKEN` to `frontend/.env` (already in backend `.env`)
- [ ] Create `app/(protected)/add-items/page.tsx` — upload UI with Uploadthing drop zone
- [ ] Create `components/upload-zone.tsx` — uses `<UploadDropzone />` from `@uploadthing/react`
  - File type validation (.csv, .xlsx, .xls only) via Uploadthing route config
  - On success → sends `{ fileUrl, fileName }` to Express `/api/upload/preview`
- [ ] Create `components/preview-table.tsx` — shows first 5 normalized rows
- [ ] Create `components/column-mapper.tsx` — manual correction if confidence < 80%
- [ ] Create `services/upload.ts` — API call helpers (preview, confirm)
- [ ] Upload progress: Uploadthing shows built-in progress bar
- [ ] Confirm & save button → `POST /api/upload/confirm`
- [ ] Success notification + redirect to `/manage-items`
- [ ] Update `frontend/.env.example` with `UPLOADTHING_TOKEN`

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/upload/preview` | Accepts `{ fileUrl, fileName }`, fetches + parses file, returns preview + mapping |
| POST | `/api/upload/confirm` | Accepts `{ fileUrl, fileName, rows[] }`, saves to MongoDB |

## Files to create (backend)
- `src/routes/upload.ts`
- `src/utils/fetch-file.ts`
- `src/utils/csv-parser.ts`
- `src/utils/xlsx-parser.ts`
- `src/utils/schema-detector.ts`
- `src/utils/gemini.ts`

## Files to create/configure (frontend)
- `app/api/uploadthing/core.ts`
- `app/api/uploadthing/route.ts`
- `lib/uploadthing.ts`
- `components/upload-zone.tsx`
- `components/preview-table.tsx`
- `components/column-mapper.tsx`
- `services/upload.ts`
- `app/(protected)/add-items/page.tsx`

## Design
- Upload zone: uses `@uploadthing/react` `<UploadDropzone />` with custom styling
  - Dashed border, `border-dashed border-2 border-slate-300 rounded-xl p-12 text-center`
- Preview table: standard table component from design skill
- Column mapper: two-column layout with source → target select dropdowns

## Env

Both `.env` files already have `UPLOADTHING_TOKEN`. Add to `frontend/.env.example` for new devs.

## Verify

- `npm run build` passes on both sides
- Upload a test CSV via the Uploadthing drop zone
- See preview with normalized columns returned from Express
- Confirm saves to MongoDB `items` collection
- Non-matching columns trigger Gemini AI mapping fallback
- No file data passes through Vercel serverless body — only the URL
