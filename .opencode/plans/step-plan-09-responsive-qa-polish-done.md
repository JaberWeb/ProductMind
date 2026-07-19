# Step Plan 09 — Responsive QA + Polish

## Goal

Test and polish every page across mobile, tablet, and desktop. Fill all missing states: loading, empty, error, and edge cases.

## Depends on

- All previous step plans complete

## Tasks

### Responsive testing
- [ ] Test every page at 375px, 768px, 1024px, 1440px widths
- [ ] Fix any layout breaks, overlapping elements, or overflow
- [ ] Ensure sidebar collapses properly on mobile
- [ ] Ensure tables have horizontal scroll on mobile
- [ ] Ensure card grids collapse to 2 → 1 columns on smaller screens

### Loading states
- [ ] Add skeleton loaders to every page that fetches data
- [ ] Add loading state for auth check (before session resolves)
- [ ] Add loading state for file uploads (progress indicator)
- [ ] Add loading state for AI generation (typing indicator or spinner)

### Empty states
- [ ] Empty items list: illustration + "No items yet" + upload CTA
- [ ] Empty analytics: "Upload data to see insights" message
- [ ] Empty chat: welcome message with suggested prompts
- [ ] Empty search results: "No results found" with suggestion

### Error states
- [ ] Add error boundaries around major sections
- [ ] Error banner for failed API calls (with retry button)
- [ ] Form validation error messages (frontend + backend)
- [ ] 404 page styling
- [ ] 500 fallback page

### Form validation
- [ ] Login form: email format, password min length
- [ ] Register form: name required, email format, password match
- [ ] Upload: file type check (.csv/.xlsx), file size limit (10MB)
- [ ] Content generator: item required, type required
- [ ] Contact form: all fields required, email format
- [ ] Edit item: title required, price positive number

### Auth flows
- [ ] Redirect to login when accessing protected route unauthenticated
- [ ] Redirect to dashboard after successful login
- [ ] Redirect to dashboard after successful register
- [ ] Sign out → redirect to home
- [ ] Session expiry → redirect to login with message

### Polish
- [ ] Smooth page transitions (optional)
- [ ] Consistent spacing across all pages
- [ ] Consistent button styles (primary, secondary, ghost)
- [ ] Consistent card styles
- [ ] Consistent font sizes and weights
- [ ] No lorem ipsum, no placeholders, no fake buttons
- [ ] All links work
- [ ] All forms submit correctly

## Files to modify
- Review every page component from previous steps
- `app/not-found.tsx` — custom 404
- `app/error.tsx` — custom error boundary
- `app/global-error.tsx` — root error boundary

## Design
- Load `productmind-design` skill
- Error banner: `rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700`
- Empty state: centered, `py-20`, illustration/message/CTA
- Skeleton: `animate-pulse rounded-xl bg-slate-200`

## Verify
- `npm run build` passes on both sides
- Every page tested at 375px, 768px, 1024px, 1440px
- No layout breaks
- Empty states render when no data
- Errors show friendly messages with retry
- Auth redirects work correctly
