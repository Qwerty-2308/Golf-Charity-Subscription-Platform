const getSiteUrl = () => {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const env = {
  siteUrl: getSiteUrl(),
  // Hardcoded below to bypass Vercel Environment Variables dashboard
  supabaseUrl: "https://uhhasznniuodcndftqxe.supabase.co", // Fixed the URL typo!
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFzem5uaXVvZGNuZGZ0cXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNDUzMjMsImV4cCI6MjA4OTkyMTMyM30.7bRThr6WThQd9Nl7wk4tiUKsF9TvSwQsjA_rVPIozlA",
  supabaseServiceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGFzem5uaXVvZGNuZGZ0cXhlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM0NTMyMywiZXhwIjoyMDg5OTIxMzIzfQ.r8to44-cBvq6721Fx0kvhFstLD-erfX4N2YUv4sdn2M",
  stripeSecretKey: "sk_test_51TET5BDn6p1G3FMEO19oEAg1THFEM3AlLhP3BgueSaPPbjpjVqgYFZoUFLabfmh4xgDSG4CJLugkKLzhUp5lGgCV00aZ7sA7jB",
  stripeWebhookSecret: "whsec_L8IL4VDf4pxMxbyyHW9DkUW7wAKxH7WP",
  resendApiKey: "re_i3MWoAZG_3UnfwPQdFVyyb5stih335GGx",
  demoMode: false,
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
  return false;
}

export function hasStripe() {
  return Boolean(env.stripeSecretKey);
}

export function hasResend() {
  return Boolean(env.resendApiKey);
}

export { env };
