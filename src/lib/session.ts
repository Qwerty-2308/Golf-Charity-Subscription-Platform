"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDemoStore } from "@/lib/demo-store";
import type { Profile, ViewerContext } from "@/lib/types";

const DEMO_SESSION_COOKIE = "good-drive-demo-session";
const DEMO_ROLE_COOKIE = "good-drive-demo-role";

function encode(payload: { userId: string }) {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decode(value?: string) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as { userId: string };
  } catch {
    return null;
  }
}

export async function getCurrentViewer(): Promise<ViewerContext | null> {
  const cookieStore = await cookies();
  const session = decode(cookieStore.get(DEMO_SESSION_COOKIE)?.value);

  if (!session) {
    return null;
  }

  const store = getDemoStore();
  const profile = store.profiles.find((candidate) => candidate.id === session.userId);

  if (!profile) {
    return null;
  }

  const subscription = store.subscriptions.find((candidate) => candidate.userId === profile.id);

  return {
    profile,
    subscription,
    isActiveSubscriber: subscription?.status === "active" || profile.role === "admin",
  };
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
  const cookieStore = await cookies();
  cookieStore.set(DEMO_SESSION_COOKIE, encode({ userId: profile.id }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  cookieStore.set(DEMO_ROLE_COOKIE, profile.role, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearDemoSession() {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE);
  cookieStore.delete(DEMO_ROLE_COOKIE);
}
