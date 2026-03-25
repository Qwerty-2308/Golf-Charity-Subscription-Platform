import { NextResponse, type NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSupabaseSession(request);
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) {
    return response;
  }

  if (!user) {
    const loginUrl = new URL(pathname.startsWith("/admin") ? "/admin/login" : "/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
