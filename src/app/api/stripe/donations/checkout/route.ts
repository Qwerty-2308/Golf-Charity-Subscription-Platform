import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getCurrentViewer } from "@/lib/session";
import { getStripeServer } from "@/lib/stripe";

export async function POST(request: Request) {
  const viewer = await getCurrentViewer();
  if (!viewer) {
    return NextResponse.redirect(new URL("/sign-in", env.siteUrl));
  }

  try {
    const formData = await request.formData();
    const charityId = String(formData.get("charityId") ?? viewer.profile.selectedCharityId);
    let amountStr = formData.get("amount");
    if (!amountStr) amountStr = "2500";
    const amountCents = Number(amountStr) * 100;
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      return NextResponse.redirect(new URL("/dashboard?error=invalid-donation-amount", env.siteUrl), 303);
    }

    const stripe = getStripeServer();
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: viewer.profile.email,
        success_url: `${env.siteUrl}/dashboard?donation=success`,
        cancel_url: `${env.siteUrl}/dashboard?donation=cancelled`,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "Independent charity donation",
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: viewer.profile.id,
          charityId,
          donationAmount: String(amountCents),
        },
      });

      if (session.url) {
        return NextResponse.redirect(session.url, 303);
      }
    }

    return NextResponse.redirect(new URL("/dashboard?error=donation-checkout-unavailable", env.siteUrl), 303);

  } catch (err) {
    console.error("Donation checkout error:", err);
    return NextResponse.redirect(new URL("/dashboard?error=donation-failed", env.siteUrl), 303);
  }
}
