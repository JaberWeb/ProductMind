---
name: productmind
description: Build ProductMind AI, a production-ready full-stack agentic AI SaaS for e-commerce sales data analysis and AI content generation.
---

# ProductMind AI Context

You are helping build a completely new project called **ProductMind AI**.

## Goal
Build a production-ready full-stack agentic AI web application for e-commerce sellers. The app helps users:
- Upload sales data from Shopify, WooCommerce, CRM, or CSV.
- Normalize and analyze sales data with AI.
- Generate product descriptions and marketing copy.
- Get AI recommendations for pricing, inventory, and product performance.
- Chat with an AI assistant about their store data.

## Important constraints
- Use Next.js + React + TypeScript on the frontend.
- Use Node.js + Express.js + TypeScript on the backend.
- Use MongoDB for data storage.
- Use JWT authentication or a modern auth system.
- Use Tailwind CSS for styling.
- Use TanStack Query for server state.
- Use Recharts or Chart.js for analytics charts.
- Use at least 2 substantial AI features.
- The app must be real, polished, and production-ready.
- No lorem ipsum, no dummy placeholders, no fake buttons.
- Fully responsive on mobile, tablet, and desktop.
- Keep the UI to max 3 primary colors plus neutral.

## Core product idea
ProductMind AI is a SaaS platform for small and medium e-commerce businesses. It solves two major problems:
1. Turning messy sales data into useful insights.
2. Helping sellers create better product content faster.

## AI features to implement
### 1. AI data analyzer
- Accept CSV, Excel, or pasted sales data.
- Auto-detect columns and normalize messy formats.
- Analyze trends, product performance, revenue, pricing, and stock risk.
- Return clear actionable insights.

### 2. AI content generator
- Generate product titles, descriptions, short descriptions, SEO copy, and social media posts.
- Support adjustable output length.
- Support regenerate response.
- Use structured prompts.

### 3. Optional AI chat assistant
- Chat about uploaded store data.
- Keep conversation history.
- Suggest follow-up prompts.
- Provide contextual answers.

## Upload data handling
Do not assume the uploaded data has one fixed format.
Users may upload:
- Shopify exports
- WooCommerce exports
- CRM-style sales exports
- Custom CSV files

The system should:
- Detect schema automatically.
- Normalize to a standard internal structure.
- If needed, use AI to infer columns and format.
- Support manual correction only as a fallback.
- Never block the app because of file format differences.

## Standard normalized sales schema
Use a normalized structure like:
- orderId
- productName
- quantity
- price
- revenue
- date
- category
- customerEmail
- sourcePlatform
- confidenceScore

## Pages required
### Public pages
- Home / landing page
- About
- Contact
- Pricing
- Features

### Auth pages
- Login
- Register

### Protected pages
- Dashboard
- Add Items
- Manage Items
- Analytics
- AI Assistant

### Detail pages
- Public listing page
- Public details page for each item

## Landing page design direction
The frontend design should be modern, SaaS-like, clean, and easy to understand.

### Design style
- Professional B2B SaaS look.
- Soft shadows, rounded cards, clean spacing.
- Light background with contrast sections.
- Clear CTA buttons.
- Subtle gradients only if needed.
- Avoid clutter.

### Color palette
Use only:
- Primary: Indigo or blue
- Secondary: Emerald or green
- Accent: Amber or orange
- Neutral: Slate / gray

### Layout rules
- Use a fixed or sticky navbar.
- Full-width hero section.
- Hero should take about 60 to 70 percent of viewport height.
- Include at least 7 meaningful landing page sections.
- Use a consistent card layout everywhere.
- Desktop listing page should show 4 cards per row.
- Card sizes and border radius must be consistent.

### Landing page sections
1. Navbar
2. Hero section with CTA
3. Feature highlights
4. How it works
5. AI capabilities
6. Metrics / stats
7. Testimonials
8. Pricing preview
9. FAQ
10. Footer

## UI component rules
- Use the same card style across the app.
- Use the same spacing scale across pages.
- Use skeleton loaders while data is loading.
- Buttons should be clearly distinguishable.
- Forms should have strong validation and helpful error messages.

## Listing card requirements
Each card must show:
- Image
- Title
- Short description
- Meta info like price, rating, category, or date
- View Details button

## Manage Items page
- Display items in a clean table or grid.
- Include View and Delete actions.
- Make it responsive.

## Add Items page
Protected route only.
Fields:
- Title
- Short description
- Full description
- Price
- Optional image URL
- Priority or date field
- Submit button

## Technical notes
- Use clean architecture and reusable components.
- Separate API, service, and UI layers.
- Use env vars for secrets.
- Add validation on backend and frontend.
- Include proper error handling.
- Add loading and empty states.
- Use charts for analytics dashboard.

## AI implementation advice
Do not build AI as a toy feature.
Make it feel agentic:
- Analyze input before responding.
- Use structured outputs.
- Support memory or conversation history where relevant.
- Prefer reliable extraction and schema inference.
- If AI is uncertain, return a confidence score.

## Suggested SaaS positioning
ProductMind AI should feel like:
- A product intelligence platform for sellers.
- A content and analytics assistant for commerce teams.
- A practical AI tool with real business value.

## What to build first
1. Project scaffold
2. Auth
3. Main layout and navigation
4. Upload + normalization flow
5. AI analysis dashboard
6. Content generator
7. Manage items
8. Landing page polish
9. Responsive QA
10. Deployment

## Output expectations
When building, prioritize:
- Production quality
- Clean UI
- Clear UX
- Real data flows
- Strong validation
- Maintainable code
- No placeholders