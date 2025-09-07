# Galley Planner Starter (Next.js + Supabase + Prisma)

A lean starter to build a Paxia-style galley plan tool. Includes:

- Next.js 14 + TypeScript + Tailwind
- Supabase (Auth & DB) client ready
- Prisma schema + seed for demo A320, compartments, container types, products, kit, plan
- Drag-and-drop (dnd-kit) demo grid
- API routes to create plan and save items (stub)

> Note: This is a **starter** focused on structure & patterns. You can evolve it with real auth (Azure SSO via Supabase), role-based access, PDF exports, etc.

---

## 1) Local Setup

**Requirements**: Node 18+, pnpm or npm, a Postgres database (Supabase recommended).

```bash
pnpm install   # or: npm install
```

Create `.env.local` with your Supabase project values:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # optional for admin scripts
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
APP_URL=http://localhost:3000
```

Push schema and seed:

```bash
pnpm db:push
pnpm db:seed
```

Run dev server:

```bash
pnpm dev
```

Open http://localhost:3000

---

## 2) Deploy (Vercel + Supabase)

- Create a **Supabase** project.
- In Vercel project settings, set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `DATABASE_URL` (use Supabase project's connection string)
  - `APP_URL` (your production URL)

- Run Prisma on first deploy (via Vercel CLI or a GitHub Action) to push schema and run the seed (optional).

> For SSO with Azure AD: configure **Supabase Auth** → Authentication → Providers → Azure. Then gate routes and server actions by session checks.

---

## 3) Next Steps

- Replace the demo compartments with data from your DB via API.
- Implement compartment-level drop zones (grid snapping) and placement persistence.
- Add validation rules (max weight, chilled segregation).
- Create pack map PDFs and pick lists.
- Add role-based access (Admin/Planner/Caterer).
- Import aircraft/galley/compartment definitions from LOPA.

---

## Folder Map

```
app/
  api/plan/...
  catalog/
  dashboard/
  layout.tsx
  page.tsx
prisma/
  schema.prisma
  seed.ts
src/
  lib/
    prisma.ts
    supabase-browser.ts
    supabase-server.ts
  styles/
    globals.css
  types/
    index.ts
```

---

## Disclaimer

All dimensions in seed are **illustrative**. Replace with your certified ATLAS/KSSU and aircraft-specific specs before operational use.
