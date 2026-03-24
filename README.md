# Good Drive Club

Good Drive Club is a production-shaped, mobile-first golf charity subscription platform built for the Digital Heroes trainee assignment. It combines:

- recurring subscriptions with Stripe-ready checkout and billing portal flows
- score-based monthly draw participation
- prize pool calculations and rollover logic
- charity selection plus independent donations
- member and admin dashboards
- a concrete Supabase schema with RLS policies and storage rules

The app runs end-to-end in `demo mode` out of the box so reviewers can test the flows immediately even before real third-party credentials are added.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4 + custom design tokens
- Supabase-ready auth/data/storage structure
- Stripe test mode route handlers
- Resend-ready email utilities
- Vitest for business-logic tests

## Demo Credentials

- Subscriber: `player@gooddrive.club` / `Player@2026`
- Admin: `admin@gooddrive.club` / `Admin@2026`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run lint
npm run test
npm run build
```

## Supabase Schema

The Supabase schema lives in:

- [supabase/migrations/20260324130000_initial_schema.sql](/Users/divyeshkarthik/Desktop/assignment/supabase/migrations/20260324130000_initial_schema.sql)
- [supabase/seed.sql](/Users/divyeshkarthik/Desktop/assignment/supabase/seed.sql)

### Schema Highlights

- `profiles` stores role, charity selection, tier, locale, and optional `auth_user_id`
- `plans` stores cadence, base pricing, prize-pool contribution, and enabled tiers
- `subscriptions` stores Stripe metadata and lifecycle status
- `score_entries` keeps Stableford history and uses a trigger to retain only the latest five rows per user
- `monthly_draws`, `draw_results`, and `winner_claims` power simulation, publish, payout, and verification workflows
- `charity_ledger`, `donation_ledger`, and `payout_ledger` preserve auditable financial records
- RLS policies protect user-owned data while allowing admin control
- storage policies lock the private `winner-proofs` bucket to owners and admins

## Environment Variables

Fill these in for live integrations:

```bash
NEXT_PUBLIC_SITE_URL=
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

If you leave them blank, the app stays fully navigable in seeded demo mode.

## Stripe / Supabase Notes

- `POST /api/stripe/checkout` creates a hosted Stripe subscription session when live price IDs exist, otherwise it activates a demo subscription immediately.
- `POST /api/stripe/donations/checkout` does the same for one-time donations.
- `POST /api/stripe/customer-portal` opens a real billing portal session when Stripe metadata exists, otherwise it redirects back to the dashboard with demo messaging.
- `POST /api/stripe/webhook` is ready for verified webhook handling and currently logs verified event types.

## Features Implemented

- public marketing site with how-it-works explainer and charity discovery
- searchable charity directory and detail pages
- sign-in and demo signup flows
- subscriber dashboard with:
  - subscription status
  - score entry, update, delete
  - latest-five score retention logic
  - charity preference management
  - winnings and claim submission
  - independent donation flow
- admin dashboard with:
  - KPI cards
  - draw simulation preview
  - draw publish action
  - claim review workflow
  - subscriber overview
  - charity oversight
- Supabase schema and seed files
- business-logic tests for score retention and draw calculations

## Deployment Notes

For the assignment’s strict deployment constraints:

1. Create a fresh Supabase project.
2. Run the migration SQL and optional seed SQL.
3. Create a fresh Vercel account/project.
4. Add all environment variables to Vercel.
5. Point Stripe webhook events to `/api/stripe/webhook`.
6. Configure the Supabase `winner-proofs` bucket if you want live proof uploads.

## Known Gaps / Assumptions

- The repository is ready for real Supabase and Stripe credentials, but without those secrets it intentionally uses demo-mode fallbacks so the product remains testable.
- Webhook event handling is scaffolded and verified, but event-to-database synchronization should be extended once live Stripe objects are created.
- The current admin console focuses on the highest-value management flows rather than deep CMS tooling.
