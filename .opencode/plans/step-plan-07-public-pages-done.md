# Step Plan 07 — Public Pages

## Goal

Build all public-facing pages: landing page (10 sections), About, Contact, Pricing, Features, public listing, public detail.

## Depends on

- Step Plan 01 (public layout + navbar in place)

## Tasks

### Landing page (10 sections)
- [ ] Create `app/(public)/page.tsx` — full landing page with all sections
- [ ] Section 1: Navbar (reuse `components/navbar.tsx`)
- [ ] Section 2: Hero — headline, subheadline, CTA button, 60-70vh height, bg gradient or illustration
- [ ] Section 3: Feature highlights — 3-4 feature cards with icons
- [ ] Section 4: How it works — 3-4 step cards with numbers
- [ ] Section 5: AI capabilities — showcase AI features with examples
- [ ] Section 6: Metrics/stats — animated counters or stats grid
- [ ] Section 7: Testimonials — carousel or grid of testimonial cards
- [ ] Section 8: Pricing preview — 3-tier pricing cards
- [ ] Section 9: FAQ — accordion component
- [ ] Section 10: Footer (reuse `components/footer.tsx`)

### Other public pages
- [ ] Create `app/(public)/about/page.tsx` — company info, mission, team
- [ ] Create `app/(public)/contact/page.tsx` — contact form → POST `/api/contact`
- [ ] Create `app/(public)/pricing/page.tsx` — full pricing table
- [ ] Create `app/(public)/features/page.tsx` — detailed features list
- [ ] Create `app/(public)/items/page.tsx` — public listing, 4 cards per row
- [ ] Create `app/(public)/items/[id]/page.tsx` — public item detail page

### Backend
- [ ] Add POST `/api/contact` endpoint (nodemailer or simple email service)
- [ ] Ensure public item listing endpoints exist (GET /api/items/public, GET /api/items/public/:id)

## Files to create (frontend)
```
components/sections/hero.tsx
components/sections/features.tsx
components/sections/how-it-works.tsx
components/sections/ai-capabilities.tsx
components/sections/metrics.tsx
components/sections/testimonials.tsx
components/sections/pricing.tsx
components/sections/faq.tsx
components/pricing-card.tsx
components/testimonial-card.tsx
components/faq-accordion.tsx
components/public-item-card.tsx
app/(public)/about/page.tsx
app/(public)/contact/page.tsx
app/(public)/pricing/page.tsx
app/(public)/features/page.tsx
app/(public)/items/page.tsx
app/(public)/items/[id]/page.tsx
```

## Backend endpoint additions
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/items/public` | Public items (no auth, no ownerId filter) |
| POST | `/api/contact` | Contact form submission |

## Design
- Load `productmind-design` skill
- Hero: indigo gradient or subtle pattern bg, large headline, white CTA button
- Feature cards: icon top, title, description, `rounded-xl border border-slate-200 bg-white p-6 shadow-sm`
- Pricing cards: 3-column grid, middle card highlighted (popular badge)
- FAQ accordion: `collapse` from daisyUI
- Public item card: 4 per row, image top, title, description, price, category badge, View Details button

## Verify
- `npm run build` passes both sides
- Landing page renders all 10 sections
- About, Contact, Pricing, Features pages render
- Public items listing shows items with 4 per row
- Contact form submits
- Responsive: all public pages look good on mobile
