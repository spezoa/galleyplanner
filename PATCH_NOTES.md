# Patch Notes (2025-09-06)

- **Prisma schema fixes**: Added back-relations to satisfy Prisma 5.22 validation
  - `Product.kitItems: KitItem[]`
  - `Aircraft.loadPlans: LoadPlan[]`
  - `Compartment.planItems: PlanItem[]`
- **Deps**: Upgraded `prisma` and `@prisma/client` to `5.22.0` (to match Vercel's CLI runtime)
- **Next layout import**: Fixed `globals.css` import path in `app/layout.tsx`

After deploying, ensure `DATABASE_URL` is set in Vercel env. First run after deploy should execute:
```
npx prisma db push
# optionally:
node --loader tsx prisma/seed.ts
```
