# Step Plan 05 — AI Content Generator

## Goal

Build the AI content generation feature: generate product titles, descriptions, SEO copy, and social posts using Gemini, with adjustable length and regeneration.

## Depends on

- Step Plan 03 (items exist in DB)

## Backend tasks

- [ ] Create `src/routes/content.ts` — POST `/api/content/generate`
- [ ] Accept: `itemId`, `contentType` (title|description|short_description|seo|social), `length` (short|medium|long), `tone` (professional|casual|persuasive)
- [ ] Fetch item data from DB (name, description, category, price)
- [ ] Build structured Gemini prompt per content type
- [ ] Return generated text + `generatedAt` timestamp

## Frontend tasks

- [ ] Create `app/(protected)/ai-assistant/page.tsx` — content generator layout
- [ ] Item selector dropdown (searchable, populated from `/api/items`)
- [ ] Content type selector: tabs or radio group (Title, Description, Short Description, SEO Copy, Social Post)
- [ ] Length toggle: Short / Medium / Long
- [ ] Tone selector: Professional / Casual / Persuasive
- [ ] Generate button → calls `/api/content/generate`
- [ ] Output card: generated text with copy-to-clipboard button
- [ ] Regenerate button (same inputs → new generation)
- [ ] Save button → saves to item record in DB
- [ ] History of recent generations per item

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/content/generate` | Generate content with Gemini |
| GET | `/api/items` | List items for selector |
| POST | `/api/items/:id/content` | Save generated content to item |

## Files to create (backend)
- `src/routes/content.ts`

## Files to create (frontend)
- `components/content-generator.tsx`
- `components/item-selector.tsx`
- `components/content-output.tsx`
- `components/content-history.tsx`
- `services/content.ts`

## Design
- Load `productmind-design` skill
- Item selector: styled select with search input
- Content type tabs: `rounded-xl px-4 py-2 text-sm`, active=`bg-indigo-100 text-indigo-700`
- Output card: monospace or slightly different bg for generated text
- Copy button: lucide `Copy` icon, `clipboard` -> `check` animation on click
- History: accordion or list, each entry shows type + preview + timestamp

## Verify
- `npm run build` passes both sides
- Select an item, choose type/length/tone, generate content
- Copy-to-clipboard works
- Regenerate returns different text
- Save persists to DB
