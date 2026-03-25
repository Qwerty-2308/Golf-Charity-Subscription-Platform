import Link from "next/link";
import { loginAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { hasSupabaseConfig } from "@/lib/env";
import { getAdminBootstrapState } from "@/lib/live-platform";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; status?: string }>;
}) {
  const params = await searchParams;
  const supabaseConfigured = hasSupabaseConfig();
  const bootstrapState = supabaseConfigured
    ? await getAdminBootstrapState()
    : { configured: false, hasAdmin: false };

  return (
    <div className="section-shell space-y-10 py-14 md:py-20">
      <SectionHeading
        eyebrow="Admin access"
        title="Dedicated login for operators, reviewers, and management accounts."
        description="Admin authentication is fully separated from the public member login, with a first-admin bootstrap path when the workspace is brand new."
      />
      {params.status ? (
        <Card className="border border-success/30 bg-success/8 text-sm text-success">
          {params.status.replaceAll("-", " ")}.
        </Card>
      ) : null}
      {params.error ? (
        <Card className="border border-danger/30 bg-danger/8 text-sm text-danger">
          {params.error.replaceAll("-", " ")}.
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="mesh-card space-y-5">
          <Badge tone="warning">Admin route</Badge>
          <p className="text-sm leading-7 text-muted">
            This page is for admin-only accounts. Subscribers should continue through the standard member sign-in flow.
          </p>
          {!supabaseConfigured ? (
            <p className="rounded-[1.5rem] bg-white/80 p-4 text-sm leading-7 text-muted">
              Supabase authentication is not configured yet. Add your environment variables before testing admin access.
            </p>
          ) : !bootstrapState.configured ? (
            <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm leading-7 text-muted">
              <p className="font-semibold text-foreground">Admin provisioning is incomplete.</p>
              <p className="mt-2">
                Add the Supabase service role key before creating or bootstrapping admin accounts.
              </p>
            </div>
          ) : !bootstrapState.hasAdmin ? (
            <div className="rounded-[1.5rem] bg-white/80 p-4 text-sm leading-7 text-muted">
              <p className="font-semibold text-foreground">No admin exists yet.</p>
              <p className="mt-2">
                Use the first-admin bootstrap flow once, then come back here to sign in normally.
              </p>
              <Link href="/admin/bootstrap" className="mt-4 inline-flex font-semibold text-secondary hover:text-primary">
                Open admin bootstrap
              </Link>
            </div>
          ) : (
            <p className="rounded-[1.5rem] bg-white/80 p-4 text-sm leading-7 text-muted">
              Additional admin accounts can be created later from the admin dashboard team management section.
            </p>
          )}
          <Link href="/sign-in" className="inline-flex text-sm font-semibold text-secondary hover:text-primary">
            Back to member login
          </Link>
        </Card>

        <Card className="space-y-5">
          <h2 className="display-font text-3xl font-semibold">Admin sign in</h2>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="requestedRole" value="admin" />
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input
                name="email"
                type="email"
                required
                className="h-12 rounded-2xl border border-line bg-white px-4 outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                required
                className="h-12 rounded-2xl border border-line bg-white px-4 outline-none"
              />
            </label>
            <button
              disabled={!supabaseConfigured || !bootstrapState.configured || !bootstrapState.hasAdmin}
              className="h-12 w-full rounded-full bg-foreground font-medium text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enter admin dashboard
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
