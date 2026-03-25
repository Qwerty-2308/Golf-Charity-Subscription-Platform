import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const secretKey = env.stripeSecretKey;
    if (!secretKey) return NextResponse.json({ error: "No Stripe Key found" });

    const stripeReq = async (path: string, bodyParams: Record<string, unknown>) => {
      const body = new URLSearchParams();
      for (const [k, v] of Object.entries(bodyParams)) body.append(k, String(v));
      
      const res = await fetch(`https://api.stripe.com/v1/${path}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      return res.json();
    };

    const pMonthly = await stripeReq("products", { name: "Momentum Monthly (Good Drive)" });
    const pYearly = await stripeReq("products", { name: "Impact Annual (Good Drive)" });

    const mBase = 4900;
    const yBase = 49900;
    const tiers = [10, 15, 20, 25, 30] as const;

    const results = { monthly: {} as Record<number, string>, yearly: {} as Record<number, string> };

    for (const t of tiers) {
      const uplift = Math.max(0, t - 10);
      const mCents = Math.round(mBase * (1 + uplift / 100));
      const mPrice = await stripeReq("prices", {
        product: pMonthly.id,
        currency: "inr",
        unit_amount: mCents,
        "recurring[interval]": "month"
      });
      results.monthly[t] = mPrice.id;

      const yCents = Math.round(yBase * (1 + uplift / 100));
      const yPrice = await stripeReq("prices", {
        product: pYearly.id,
        currency: "inr",
        unit_amount: yCents,
        "recurring[interval]": "year"
      });
      results.yearly[t] = yPrice.id;
    }

    const envCode = `export const stripePriceMap = {
  monthly: {
    10: "${results.monthly[10]}",
    15: "${results.monthly[15]}",
    20: "${results.monthly[20]}",
    25: "${results.monthly[25]}",
    30: "${results.monthly[30]}",
  },
  yearly: {
    10: "${results.yearly[10]}",
    15: "${results.yearly[15]}",
    20: "${results.yearly[20]}",
    25: "${results.yearly[25]}",
    30: "${results.yearly[30]}",
  },
} as const;`;

    return new NextResponse(envCode, { headers: { "Content-Type": "text/plain" } });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Stripe setup failed";
    return NextResponse.json({ error: message });
  }
}
