import Stripe from "stripe";
import { env, stripePriceMap } from "@/lib/env";
import type { CharityTier, PlanCadence } from "@/lib/types";

let stripeClient: Stripe | null = null;

export function getStripeServer() {
  if (!env.stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, {
      apiVersion: "2026-02-25.clover",
    });
  }

  return stripeClient;
}

export function resolveStripePriceId(cadence: PlanCadence, tier: CharityTier) {
  return stripePriceMap[cadence][tier];
}
