# Step Plan 06 — Manage Items

## Goal

Build the full items management page: list/table view, search, pagination, detail view, edit, delete.

## Depends on

- Step Plan 03 (items in MongoDB)

## Backend tasks

- [ ] Create `src/routes/items.ts`
- [ ] GET `/api/items` — paginated list with search, filter by ownerId
- [ ] GET `/api/items/:id` — single item detail
- [ ] PUT `/api/items/:id` — update item fields
- [ ] DELETE `/api/items/:id` — delete item with confirmation

## Frontend tasks

- [ ] Create `app/(protected)/manage-items/page.tsx` — items list page
- [ ] Table view with columns: image, title, price, category, platform, date, actions
- [ ] Grid view toggle (table ↔ cards, 4 per row on desktop)
- [ ] Search input with debounce
- [ ] Pagination (page numbers + prev/next)
- [ ] View action → navigate to `/manage-items/:id`
- [ ] Delete action → confirmation modal → delete from DB → refresh list
- [ ] Create `app/(protected)/manage-items/[id]/page.tsx` — item detail/edit page
- [ ] Detail view: read-only fields with edit button
- [ ] Edit mode: inline form with save/cancel

## Backend endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/items` | Paginated items list |
| GET | `/api/items/:id` | Single item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

## Files to create (backend)
- `src/routes/items.ts`

## Files to create (frontend)
- `components/items-table.tsx`
- `components/items-grid.tsx`
- `components/item-card.tsx`
- `components/delete-modal.tsx`
- `components/item-detail.tsx`
- `components/item-edit-form.tsx`
- `components/pagination.tsx`
- `components/search-input.tsx`
- `components/view-toggle.tsx`
- `services/items.ts`

## Design
- Load `productmind-design` skill
- View toggle: segmented button `rounded-xl border border-slate-200`, active=`bg-indigo-100 text-indigo-700`
- Delete modal: centered overlay, red destructive button
- Item edit form: standard form layout from design skill, pre-filled with current values
- Empty state: illustration + "No items yet" + link to upload

## Verify
- `npm run build` passes both sides
- Items list loads with pagination
- Search filters results
- Delete shows confirmation and removes item
- Edit saves and reflects changes
- Grid/table toggle works
