# Step Plan 01 — Auth + Layout + Navigation

## Goal

Set up the main layout, navigation, auth pages, route protection, and stub pages for all protected routes.

## Depends on

- Project scaffold (done)
- BetterAuth wired on Next.js (done)
- Backend server with auth middleware (done)

## Tasks

### 1. Environment setup
- [ ] Add `GEMINI_API_KEY` to frontend `.env`
- [ ] Install `@tanstack/react-query`, `recharts`
- [ ] Add TanStack Query provider to `app/layout.tsx`

### 2. Protected route guard
- [ ] Create `components/auth-guard.tsx` — wraps children with `useSession`, redirects to `/login` if not authenticated, shows skeleton while loading

### 3. Main layout
- [ ] Create `app/(protected)/layout.tsx` — wraps protected pages with sidebar nav, uses `AuthGuard`
- [ ] Create `app/(public)/layout.tsx` — minimal layout for public pages (no sidebar)
- [ ] Move current `app/page.tsx` to `app/(public)/page.tsx`

### 4. Navigation
- [ ] Create `components/navbar.tsx` — public top nav (Home, Features, Pricing, About, Contact, Login/Register)
- [ ] Create `components/sidebar.tsx` — protected sidebar (Dashboard, Add Items, Manage Items, Analytics, AI Assistant, user info + sign out)
- [ ] Active route highlighting using `usePathname`

### 5. Auth pages
- [ ] Create `app/(public)/login/page.tsx` — login form using `signIn.email` from BetterAuth
- [ ] Create `app/(public)/register/page.tsx` — register form using `signUp.email`
- [ ] Both forms: `react-hook-form` validation, error display, redirect to `/dashboard` on success

### 6. Dashboard stub
- [ ] Create `app/(protected)/dashboard/page.tsx` — skeleton with welcome message, placeholder stats cards

### 7. Protected route stubs
- [ ] Create `app/(protected)/add-items/page.tsx`
- [ ] Create `app/(protected)/manage-items/page.tsx`
- [ ] Create `app/(protected)/analytics/page.tsx`
- [ ] Create `app/(protected)/ai-assistant/page.tsx`

### 8. Navbar update
- [ ] Update navbar to show different links when authenticated vs not (use `useSession`)

## Files to create

```
components/auth-guard.tsx
components/navbar.tsx
components/sidebar.tsx
app/(public)/layout.tsx
app/(public)/login/page.tsx
app/(public)/register/page.tsx
app/(protected)/layout.tsx
app/(protected)/dashboard/page.tsx
app/(protected)/add-items/page.tsx
app/(protected)/manage-items/page.tsx
app/(protected)/analytics/page.tsx
app/(protected)/ai-assistant/page.tsx
```

## Files to modify
- `app/layout.tsx` — add QueryClientProvider
- `app/page.tsx` — move to `app/(public)/page.tsx`
- frontend `.env` — add GEMINI_API_KEY
- `package.json` — add @tanstack/react-query, recharts

## Design

- Load `productmind-design` skill for colors, components, spacing
- Sidebar: indigo active state, slate-600 inactive
- Public navbar: white/glass, fixed top
- Cards: `rounded-xl border border-slate-200 bg-white shadow-sm`

## Verify

- `npm run build` passes
- `/login` renders login form
- `/register` renders register form
- `/dashboard` redirects to `/login` when not authenticated
- `/dashboard` renders when authenticated
- Sidebar shows on protected pages, not on public
