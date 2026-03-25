const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const parseBoolean = (value: string | undefined) => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") return true;
  if (normalized === "false" || normalized === "0" || normalized === "no") return false;
  return undefined;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

// Default to demo mode when Supabase credentials are not configured.
// This matches the app README expectation: "leaving them blank stays in seeded demo mode".
const forcedDemoMode = parseBoolean(process.env.DEMO_MODE);
const demoMode = forcedDemoMode ?? !hasSupabase;

const env = {
  siteUrl: getSiteUrl(),
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  // Stripe/Resend test keys are provided as safe defaults for the assignment demo.
  // For production, override with environment variables.
  stripeSecretKey:
    process.env.STRIPE_SECRET_KEY ??
    "sk_test_51TET5BDn6p1G3FMEO19oEAg1THFEM3AlLhP3BgueSaPPbjpjVqgYFZoUFLabfmh4xgDSG4CJLugkKLzhUp5lGgCV00aZ7sA7jB",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "whsec_L8IL4VDf4pxMxbyyHW9DkUW7wAKxH7WP",
  resendApiKey: process.env.RESEND_API_KEY ?? "re_i3MWoAZG_3UnfwPQdFVyyb5stih335GGx",
  demoMode,
};

export const stripePriceMap = {
  monthly: {
    10: process.env.STRIPE_PRICE_MONTHLY_10,
    15: process.env.STRIPE_PRICE_MONTHLY_15,
    20: process.env.STRIPE_PRICE_MONTHLY_20,
    25: process.env.STRIPE_PRICE_MONTHLY_25,
    30: process.env.STRIPE_PRICE_MONTHLY_30,
  },
  yearly: {
    10: process.env.STRIPE_PRICE_YEARLY_10,
    15: process.env.STRIPE_PRICE_YEARLY_15,
    20: process.env.STRIPE_PRICE_YEARLY_20,
    25: process.env.STRIPE_PRICE_YEARLY_25,
    30: process.env.STRIPE_PRICE_YEARLY_30,
  },
} as const;

export function isDemoMode() {
  return env.demoMode;
}

export function hasStripe() {
  return Boolean(env.stripeSecretKey);
}

export function hasResend() {
  return Boolean(env.resendApiKey);
}

export function hasSupabaseConfig() {
  // Live-mode needs:
  // - public anon key for server-side reads
  // - service role key for trusted admin mutations and bootstrap flows
  return Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseServiceRoleKey);
}

export { env };
