# Step Plan 02 — Layout + Navigation Polish

## Goal

Refine the navigation UX: responsive sidebar, user dropdown, loading skeletons, mobile hamburger, active state indicators.

## Depends on

- Step Plan 01 (auth, layout, nav stubs in place)

## Tasks

- [ ] Responsive sidebar: collapse to hamburger on mobile (< 1024px), overlay drawer
- [ ] User dropdown in sidebar bottom: avatar, name, email, sign out button
- [ ] Loading skeletons for auth check (before session resolves)
- [ ] Mobile hamburger button with animated icon (lucide `Menu` / `X`)
- [ ] Breadcrumb or active-state indicator on sidebar links
- [ ] Public navbar scroll behavior: `backdrop-blur-md` on scroll, transparent at top
- [ ] Footer for public pages (minimal: logo, links, copyright)

## Files to create
- `components/footer.tsx`
- `components/mobile-sidebar.tsx`

## Files to modify
- `components/sidebar.tsx`
- `components/navbar.tsx`
- `app/(public)/layout.tsx` — add footer
- `app/(protected)/layout.tsx` — add mobile sidebar overlay

## Design
- Load `productmind-design` skill
- Sidebar overlay: `bg-black/30 backdrop-blur-sm`, animate slide-in
- User dropdown: `avatar` daisyUI component
- Skeleton: `animate-pulse rounded-xl bg-slate-200`

## Verify
- `npm run build` passes
- Mobile view: hamburger opens/closes sidebar overlay
- User dropdown shows name and sign out
- Public footer renders on public pages only
