"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearDemoSession, createDemoSession, requireAdmin, requireViewer } from "@/lib/session";
import {
  activateDemoSubscription,
  authenticateDemoUser,
  createDemoSubscriber,
  deleteUserScore,
  publishMonthlyDraw,
  resyncSubscription,
  reviewWinnerClaim,
  saveUserScore,
  submitWinnerClaim,
  updateUserPreferences,
} from "@/lib/platform";
import type { CharityTier, ClaimStatus, DrawMode, FrequencyBias } from "@/lib/types";

function getRequiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Missing field: ${key}`);
  }
  return value.trim();
}

export async function loginAction(formData: FormData) {
  const email = getRequiredString(formData, "email");
  const password = getRequiredString(formData, "password");
  const profile = authenticateDemoUser(email, password);

  if (!profile) {
    redirect("/sign-in?error=invalid-credentials");
  }

  await createDemoSession(profile);
  redirect(profile.role === "admin" ? "/admin" : "/dashboard");
}

export async function signupAction(formData: FormData) {
  const profile = createDemoSubscriber({
    fullName: getRequiredString(formData, "fullName"),
    email: getRequiredString(formData, "email"),
    password: getRequiredString(formData, "password"),
    selectedCharityId: getRequiredString(formData, "charityId"),
    charityTier: Number(getRequiredString(formData, "charityTier")) as CharityTier,
  });

  await createDemoSession(profile);
  redirect("/pricing?welcome=1");
}

export async function demoSubscriptionAction(formData: FormData) {
  const viewer = await requireViewer();
  activateDemoSubscription(
    viewer.profile.id,
    getRequiredString(formData, "cadence") as "monthly" | "yearly",
    Number(getRequiredString(formData, "charityTier")) as CharityTier,
  );
  revalidatePath("/dashboard");
  redirect("/dashboard?billing=activated");
}

export async function logoutAction() {
  await clearDemoSession();
  redirect("/");
}

export async function saveScoreAction(formData: FormData) {
  const viewer = await requireViewer();
  saveUserScore(viewer.profile.id, {
    id: (formData.get("scoreId") as string) || undefined,
    score: Number(getRequiredString(formData, "score")),
    playedAt: getRequiredString(formData, "playedAt"),
  });
  revalidatePath("/dashboard");
  redirect("/dashboard?status=score-saved");
}

export async function deleteScoreAction(formData: FormData) {
  const viewer = await requireViewer();
  const scoreId = getRequiredString(formData, "scoreId");
  deleteUserScore(viewer.profile.id, scoreId);
  revalidatePath("/dashboard");
  redirect("/dashboard?status=score-deleted");
}

export async function updatePreferencesAction(formData: FormData) {
  const viewer = await requireViewer();
  updateUserPreferences(viewer.profile.id, {
    charityId: getRequiredString(formData, "charityId"),
    charityTier: Number(getRequiredString(formData, "charityTier")) as CharityTier,
  });
  revalidatePath("/dashboard");
  redirect("/dashboard?status=preferences-saved");
}

export async function submitClaimAction(formData: FormData) {
  const viewer = await requireViewer();
  const proof = formData.get("proof");
  submitWinnerClaim(viewer.profile.id, {
    drawResultId: getRequiredString(formData, "drawResultId"),
    proofName: proof instanceof File && proof.name ? proof.name : "demo-proof.png",
  });
  revalidatePath("/dashboard");
  redirect("/dashboard?status=claim-submitted");
}

export async function publishDrawAction(formData: FormData) {
  const viewer = await requireAdmin();
  publishMonthlyDraw({
    actorId: viewer.profile.id,
    monthKey: getRequiredString(formData, "monthKey"),
    mode: getRequiredString(formData, "mode") as DrawMode,
    bias: (formData.get("bias") as FrequencyBias | null) ?? undefined,
  });
  revalidatePath("/admin");
  redirect("/admin?status=draw-published");
}

export async function reviewClaimAction(formData: FormData) {
  const viewer = await requireAdmin();
  await reviewWinnerClaim({
    actorId: viewer.profile.id,
    claimId: getRequiredString(formData, "claimId"),
    status: getRequiredString(formData, "status") as ClaimStatus,
    note: (formData.get("note") as string) || undefined,
  });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
  redirect("/admin?status=claim-reviewed");
}

export async function adminResyncSubscriptionAction(formData: FormData) {
  await requireAdmin();
  resyncSubscription(getRequiredString(formData, "subscriptionId"));
  revalidatePath("/admin");
  redirect("/admin?status=subscription-resynced");
}
