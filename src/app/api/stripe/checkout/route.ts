import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getCurrentViewer } from "@/lib/session";
import { resolveStripePriceId, getStripeServer } from "@/lib/stripe";
import type { CharityTier, PlanCadence } from "@/lib/types";

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

  return NextResponse.redirect(new URL("/pricing?error=stripe-checkout-not-configured", env.siteUrl));
}
