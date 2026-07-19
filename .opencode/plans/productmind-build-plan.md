# ProductMind AI — Build Plan

## Overview

Production-ready full-stack AI SaaS for e-commerce sales analysis + content generation.
Next.js 16 + Express 5 + MongoDB + Gemini AI + BetterAuth + TanStack Query + Recharts.

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 16.2, React 19, Tailwind v4, daisyUI v5 |
| Backend | Express 5, TypeScript, tsx |
| Database | MongoDB (native driver 7) |
| Auth | BetterAuth (Next.js) + session token validation (Express) |
| AI | Google Gemini (free tier) |
| Server state | TanStack Query |
| Charts | Recharts |
| Deployment | Vercel (frontend + backend) |

## Phases

### Phase 1 — Auth + Layout + Navigation

- [ ] Create `.env` with Gemini API key + other env vars
- [ ] Install TanStack Query, Recharts
- [ ] Build main layout wrapper with sidebar nav (protected) vs top nav (public)
- [ ] Build auth pages: `/login`, `/register` (using BetterAuth `signIn`/`signUp`)
- [ ] Build `/dashboard` — skeleton protected page with `useSession` guard
- [ ] Build navbar (public — logo, Home, Features, Pricing, About, Contact, Login/Register; authenticated — Dashboard, Add Items, Manage Items, Analytics, AI Assistant)
- [ ] Add route protection middleware/pattern (redirect to login if no session)
- [ ] Build placeholder pages for all protected routes (`/add-items`, `/manage-items`, `/analytics`, `/ai-assistant`)

### Phase 2 — Main layout + navigation polish

- [ ] Responsive sidebar/topbar navigation
- [ ] User dropdown (profile, sign out)
- [ ] Loading skeletons for auth check
- [ ] Mobile navigation (hamburger menu)
- [ ] Breadcrumb or active state indicator

### Phase 3 — Upload + normalization flow

- [ ] Build CSV/Excel upload UI with drag-and-drop
- [ ] Backend: file upload endpoint + parsing (multer + csv-parse + xlsx)
- [ ] Schema auto-detection logic
- [ ] Normalize to standard sales schema
- [ ] AI column inference fallback (Gemini)
- [ ] Manual correction UI (only as fallback)
- [ ] Store normalized data in MongoDB `items` collection

### Phase 4 — AI analysis dashboard

- [ ] Analytics page with overview cards (total items, revenue, top products)
- [ ] Recharts: revenue line chart, category bar chart, pricing distribution
- [ ] AI analysis: send data to Gemini, return structured insights
- [ ] Display insights with confidence scores
- [ ] Filter by date range, category, platform

### Phase 5 — AI content generator

- [ ] Content generator UI (select product, choose output type, set length)
- [ ] Gemini prompt templates for: titles, descriptions, SEO copy, social posts
- [ ] Regenerate button
- [ ] Copy-to-clipboard
- [ ] Save generated content to item record

### Phase 6 — Manage items

- [ ] Items list page (table/grid view toggle)
- [ ] View single item detail page
- [ ] Delete item with confirmation
- [ ] Edit item (title, description, price, etc.)
- [ ] Pagination + search

### Phase 7 — Public pages

- [ ] Landing page (10 sections: navbar, hero, features, how it works, AI capabilities, metrics, testimonials, pricing, FAQ, footer)
- [ ] About page
- [ ] Contact page (with backend email endpoint)
- [ ] Pricing page
- [ ] Features page
- [ ] Public listing page (4 cards/row)
- [ ] Public item detail page

### Phase 8 — AI Chat Assistant

- [ ] Chat UI with message history
- [ ] Backend: chat endpoint with Gemini + conversation context
- [ ] Context from uploaded store data
- [ ] Suggested follow-up prompts
- [ ] Session-based conversation memory

### Phase 9 — Responsive QA + polish

- [ ] Mobile, tablet, desktop testing across all pages
- [ ] Loading states everywhere
- [ ] Empty states
- [ ] Error boundaries
- [ ] Form validation (frontend + backend)
- [ ] Auth redirect flows

### Phase 10 — Deployment

- [ ] Vercel config for frontend + backend
- [ ] Environment variables setup
- [ ] MongoDB Atlas production cluster
- [ ] Custom domain (optional)
- [ ] Final build test

## Design references

Use `productmind-design` skill for color palette, component styles, spacing, and layout conventions.
