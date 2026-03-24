import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getStripeServer } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !env.stripeWebhookSecret || !signature) {
    return NextResponse.json({ received: true, mode: "demo" });
  }

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, env.stripeWebhookSecret);
    console.info("Stripe webhook received", event.type);
    return NextResponse.json({ received: true, type: event.type });
  } catch (error) {
    return NextResponse.json(
      {
        received: false,
        error: error instanceof Error ? error.message : "Invalid webhook signature",
      },
      { status: 400 },
    );
  }
}
