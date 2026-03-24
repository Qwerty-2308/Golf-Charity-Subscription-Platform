import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getSubscriberSubscription } from "@/lib/platform";
import { getCurrentViewer } from "@/lib/session";
import { getStripeServer } from "@/lib/stripe";

export async function POST() {
  const viewer = await getCurrentViewer();
  if (!viewer) {
    return NextResponse.redirect(new URL("/sign-in", env.siteUrl));
  }

  const subscription = getSubscriberSubscription(viewer.profile.id);
  const stripe = getStripeServer();

  if (stripe && subscription?.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${env.siteUrl}/dashboard`,
    });

    return NextResponse.redirect(session.url);
  }

  return NextResponse.redirect(new URL("/dashboard?billing=portal-demo", env.siteUrl));
}
