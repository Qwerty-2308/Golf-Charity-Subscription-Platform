import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getCurrentViewer } from "@/lib/session";
import { resolveStripePriceId, getStripeServer } from "@/lib/stripe";
import { activateDemoSubscription } from "@/lib/platform";
import type { CharityTier, PlanCadence } from "@/lib/types";

function getSubscriptionBaseCents(cadence: PlanCadence) {
  // Must match the assignment seed + setup-stripe logic.
  return cadence === "monthly" ? 4900 : 49900;
}

function getPlanPriceCents(subscriptionBaseCents: number, tier: CharityTier) {
  const uplift = Math.max(0, tier - 10);
  return Math.round(subscriptionBaseCents * (1 + uplift / 100));
}

export async function POST(request: Request) {
  const viewer = await getCurrentViewer();

  if (!viewer) {
    return NextResponse.redirect(new URL("/sign-in", env.siteUrl));
  }

  const formData = await request.formData();
  const cadence = String(formData.get("cadence") ?? "monthly") as PlanCadence;
  const charityId = String(formData.get("charityId") ?? viewer.profile.selectedCharityId);
  const charityTier = Number(formData.get("charityTier") ?? viewer.profile.charityTier) as CharityTier;
  const stripe = getStripeServer();
  const priceId = resolveStripePriceId(cadence, charityTier);

  if (stripe && priceId) {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: viewer.profile.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${env.siteUrl}/dashboard?checkout=success`,
      cancel_url: `${env.siteUrl}/pricing?checkout=cancelled`,
      metadata: {
        userId: viewer.profile.id,
        charityId,
        charityTier: String(charityTier),
        cadence,
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }
  }

  // If priceId is not preconfigured, fall back to creating the recurring price inline.
  // This still returns a real Stripe Checkout URL (so the user is redirected to Stripe).
  if (stripe) {
    const subscriptionBaseCents = getSubscriptionBaseCents(cadence);
    const unitAmount = getPlanPriceCents(subscriptionBaseCents, charityTier);
    const productName = cadence === "monthly" ? "Momentum Monthly (Good Drive)" : "Impact Annual (Good Drive)";
    const interval = cadence === "monthly" ? "month" : "year";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: viewer.profile.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: unitAmount,
            recurring: { interval },
            product_data: { name: productName },
          },
        },
      ],
      success_url: `${env.siteUrl}/dashboard?checkout=success`,
      cancel_url: `${env.siteUrl}/pricing?checkout=cancelled`,
      metadata: {
        userId: viewer.profile.id,
        charityId,
        charityTier: String(charityTier),
        cadence,
      },
    });

    if (session.url) {
      return NextResponse.redirect(session.url);
    }
  }

  // Stripe isn't available (or Checkout URL couldn't be created) => demo fallback.
  activateDemoSubscription(viewer.profile.id, cadence, charityTier);
  return NextResponse.redirect(new URL("/dashboard?checkout=demo-success", env.siteUrl));
}
