"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Profile, ViewerContext } from "@/lib/types";

const DEMO_SESSION_COOKIE = "good-drive-demo-session";
const DEMO_ROLE_COOKIE = "good-drive-demo-role";

async function getLiveViewer(): Promise<ViewerContext | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .single();

  if (!profile) return null;

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();

  const mapped: Profile = {
    id: profile.id,
    fullName: profile.full_name,
    email: profile.email,
    role: profile.role,
    selectedCharityId: profile.selected_charity_id,
    charityTier: profile.charity_tier,
    countryCode: profile.country_code,
    currencyCode: profile.currency_code,
    createdAt: profile.created_at,
  };

  const mappedSub = subscription
    ? {
        id: subscription.id,
        userId: subscription.user_id,
        planId: subscription.plan_id,
        cadence: subscription.cadence,
        status: subscription.status,
        stripeCustomerId: subscription.stripe_customer_id,
        stripeSubscriptionId: subscription.stripe_subscription_id,
        stripePriceId: subscription.stripe_price_id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        latestInvoiceStatus: subscription.latest_invoice_status,
        updatedAt: subscription.updated_at,
      }
    : undefined;

  return {
    profile: mapped,
    subscription: mappedSub,
    isActiveSubscriber: mappedSub?.status === "active" || mapped.role === "admin",
  };
}

export async function getCurrentViewer(): Promise<ViewerContext | null> {
  return getLiveViewer();
}

export async function requireViewer() {
  const viewer = await getCurrentViewer();
  if (!viewer) {
    redirect("/sign-in");
  }
  return viewer;
}

export async function requireAdmin() {
  const viewer = await requireViewer();
  if (viewer.profile.role !== "admin") {
    redirect("/dashboard?error=admin-only");
  }
  return viewer;
}

export async function createDemoSession(profile: Profile) {
  void profile;
  await clearDemoSession();
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(DEMO_ROLE_COOKIE);
}
