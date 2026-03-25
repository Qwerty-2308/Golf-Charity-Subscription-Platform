import Link from "next/link";
import { redirect } from "next/navigation";
import { bootstrapFirstAdminAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { hasSupabaseConfig } from "@/lib/env";
import { getAdminBootstrapState } from "@/lib/live-platform";

export default async function AdminBootstrapPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabaseConfigured = hasSupabaseConfig();

  if (!supabaseConfigured) {
    return (
      <div className="section-shell space-y-10 py-14 md:py-20">
        <SectionHeading
          eyebrow="Admin bootstrap"
          title="Configure Supabase before creating the first admin."
          description="The bootstrap flow needs a real Supabase project and server-side credentials."
        />
        <Card className="border border-warning/30 bg-warning/10 text-sm text-foreground">
          Add your Supabase environment variables, redeploy, and then return to this page.
        </Card>
      </div>
    );
  }

  const bootstrapState = await getAdminBootstrapState();
  if (!bootstrapState.configured) {
    return (
      <div className="section-shell space-y-10 py-14 md:py-20">
        <SectionHeading
          eyebrow="Admin bootstrap"
          title="Server-side admin access is not configured."
          description="The bootstrap flow needs the Supabase service role key so it can create the first admin safely."
        />
        <Card className="border border-warning/30 bg-warning/10 text-sm text-foreground">
          Add `SUPABASE_SERVICE_ROLE_KEY` to your environment and redeploy before using this page.
        </Card>
      </div>
    );
  }

  if (bootstrapState.hasAdmin) {
    redirect("/admin/login?status=admin-account-already-exists");
  }

  return (
    <div className="section-shell space-y-10 py-14 md:py-20">
      <SectionHeading
        eyebrow="Admin bootstrap"
        title="Create the first admin account."
        description="This one-time flow is only available before any admin exists. After that, additional admin accounts are created from inside the admin dashboard."
      />
      {params.error ? (
        <Card className="border border-danger/30 bg-danger/8 text-sm text-danger">
          {params.error.replaceAll("-", " ")}.
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="mesh-card space-y-5">
          <Badge tone="warning">One-time setup</Badge>
          <p className="text-sm leading-7 text-muted">
            Use a secure email and password here. Once the first admin exists, this route locks itself and the normal admin login takes over.
          </p>
          <Link href="/admin/login" className="inline-flex text-sm font-semibold text-secondary hover:text-primary">
            Back to admin login
          </Link>
        </Card>

        <Card className="space-y-5">
          <h2 className="display-font text-3xl font-semibold">Create first admin</h2>
          <form action={bootstrapFirstAdminAction} className="space-y-4">
            <label className="grid gap-2 text-sm font-medium">
              Full name
              <input name="fullName" required className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input name="email" type="email" required className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input
                name="password"
                type="password"
                minLength={8}
                required
                className="h-12 rounded-2xl border border-line bg-white px-4 outline-none"
              />
            </label>
            <button className="h-12 w-full rounded-full bg-foreground font-medium text-background">
              Create admin account
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}
