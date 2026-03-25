# Good Drive Club

Good Drive Club is a mobile-first golf charity subscription platform built for the Digital Heroes trainee assignment. It includes:

- subscriber auth with Supabase
- dedicated admin auth and first-admin bootstrap
- Stripe-ready subscription and donation flows
- score tracking with latest-five retention
- monthly draw simulation and publishing
- winner claim verification
- charity management and reporting

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4 + custom design tokens
- Supabase Auth / Postgres / Storage
- Stripe test mode
- Resend
- Vitest

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Fill in your real Supabase, Stripe, and Resend values.

4. Run the database migration in your Supabase project:

- [schema migration](/Users/divyeshkarthik/Desktop/assignment/supabase/migrations/20260324130000_initial_schema.sql)
- [starter seed](/Users/divyeshkarthik/Desktop/assignment/supabase/seed.sql)

5. Start the app:

```bash
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Environment Variables

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_ENABLE_DEMO_MODE=false
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_MONTHLY_10=
STRIPE_PRICE_MONTHLY_15=
STRIPE_PRICE_MONTHLY_20=
STRIPE_PRICE_MONTHLY_25=
STRIPE_PRICE_MONTHLY_30=
STRIPE_PRICE_YEARLY_10=
STRIPE_PRICE_YEARLY_15=
STRIPE_PRICE_YEARLY_20=
STRIPE_PRICE_YEARLY_25=
STRIPE_PRICE_YEARLY_30=
RESEND_API_KEY=
```

## Admin Setup

- Visit `/admin/bootstrap` once to create the first admin account.
- After that, use `/admin/login` for admin sign-in.
- Additional admin accounts can be created from the admin dashboard.

## Seed Data Policy

- The runtime no longer ships with seeded users, seeded admin credentials, or fabricated dashboard data.
- The optional seed file only provides starter charity and plan configuration so the product can be exercised against a real Supabase project.

## Deployment Notes

For the assignment submission:

1. Use a fresh Supabase project.
2. Use a fresh Vercel project.
3. Add all environment variables in Vercel.
4. Run the migration and starter seed against that Supabase project.
5. Point Stripe webhooks to `/api/stripe/webhook`.
6. Create at least one admin through `/admin/bootstrap`.

## Current Notes

- Auth, dashboards, and data flows are designed for live Supabase-backed usage.
- If Supabase or Stripe is not configured, the app now shows setup errors instead of fake-success demo behavior.
