import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/dashboard";

    if (!code) {
      return NextResponse.redirect(new URL("/sign-in?error=missing-code", env.siteUrl));
    }

    const supabase = await createSupabaseServerClient();
    if (!supabase) {
      return NextResponse.redirect(new URL("/sign-in?error=server-error", env.siteUrl));
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/sign-in?error=oauth-failed", env.siteUrl));
    }

    // Determine role and redirect accordingly
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      return NextResponse.redirect(new URL("/sign-in?error=oauth-user-failed", env.siteUrl));
    }

    const user = userData.user;
    if (user) {
      // Use maybeSingle() so a missing profile row doesn't crash the callback.
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", env.siteUrl));
      }
    }

    return NextResponse.redirect(new URL(next, env.siteUrl));
  } catch {
    return NextResponse.redirect(new URL("/sign-in?error=oauth-callback-crashed", env.siteUrl));
  }
}
