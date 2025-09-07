# Galley Planner Starter (Next.js 14 + Auth.js (Azure AD) + Prisma)

A minimal, Paxia-like starter to design and publish aircraft galley plans with Office 365 (Microsoft Entra ID) login.

## What you get
- Next.js 14 (App Router) + Auth.js (NextAuth v5 beta) with **Azure AD**.
- Prisma + PostgreSQL schema for Orgs, Users, Aircraft, Galley Stations, Catalog Items, Plans & Plan Versions.
- Simple **SVG-based designer** with drag, rotate, snap-to-grid.
- Publish read-only plan view with QR label prototype.
- Server Actions + API routes, strict TypeScript.
- Ready for Vercel + Azure Postgres / Supabase.

## Quickstart
1. **Clone and install**  
   ```bash
   pnpm i  # or npm i / yarn
   ```

2. **Configure environment**  
   Copy `.env.example` to `.env.local` and fill:
   - `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID` (use `common` for multi-tenant)
   - `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
   - `DATABASE_URL` for Postgres

3. **Create DB & Prisma**  
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   npx ts-node prisma/seed.ts  # optional sample data
   ```

4. **Run**  
   ```bash
   pnpm dev  # or npm run dev / yarn dev
   ```
   Visit http://localhost:3000 and sign in with an Office 365 account.

## Azure AD (Entra ID) setup (summary)
- Azure Portal → App registrations → *New application registration*.
- Authentication → add Web redirect URL: `http://localhost:3000/api/auth/callback/azure-ad` (and production URL).
- Expose API (optional) / App roles (optional). Keep `AZURE_AD_TENANT_ID=common` for multi-tenant.

## Deploy
- Vercel for Next.js app.
- Azure Database for PostgreSQL Flexible Server (or Supabase).
- Set env vars in your host; run `prisma migrate deploy`.

## Notes
- Designer is intentionally lightweight (no canvas libs). It validates bounds and snap-to-grid. Extend as needed.
- The "publish" flow creates an immutable Plan Version with a tokenized share link for vendors to print maps/labels.
# galleyplanner
