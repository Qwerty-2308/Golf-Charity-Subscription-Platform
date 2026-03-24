import { loginAction, signupAction } from "@/app/actions";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAvailableCharities, getDemoCredentials } from "@/lib/platform";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const charities = getAvailableCharities();
  const credentials = getDemoCredentials();

  return (
    <div className="section-shell space-y-10 py-14 md:py-20">
      <SectionHeading
        eyebrow="Access"
        title="Reviewer-ready sign in with seeded user and admin journeys."
        description="Use the test credentials below or create a new demo subscriber account directly from this screen."
      />
      {params.error ? (
        <Card className="border border-danger/30 bg-danger/8 text-sm text-danger">
          Sign in failed. Try one of the demo credentials shown below.
        </Card>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="mesh-card space-y-5">
          <Badge tone="warning">Demo credentials</Badge>
          <div className="space-y-4 text-sm text-muted">
            <div className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="font-semibold text-foreground">Subscriber</p>
              <p>{credentials.user.email}</p>
              <p>{credentials.user.password}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="font-semibold text-foreground">Administrator</p>
              <p>{credentials.admin.email}</p>
              <p>{credentials.admin.password}</p>
            </div>
            <p className="leading-7">
              In live mode, this page is ready to hand off to Supabase email/password, OAuth, and magic-link flows. In demo mode, it stays fully testable without external credentials.
            </p>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="space-y-5">
            <div>
              <h2 className="display-font text-3xl font-semibold">Sign in</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                Access the subscriber dashboard or the admin control center.
              </p>
            </div>
            <form action={loginAction} className="space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input
                  name="email"
                  defaultValue={credentials.user.email}
                  className="h-12 rounded-2xl border border-line bg-white px-4 outline-none"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Password
                <input
                  name="password"
                  type="password"
                  defaultValue={credentials.user.password}
                  className="h-12 rounded-2xl border border-line bg-white px-4 outline-none"
                />
              </label>
              <button className="h-12 w-full rounded-full bg-primary font-medium text-white">
                Sign in
              </button>
            </form>
          </Card>

          <Card className="mesh-card space-y-5">
            <div>
              <h2 className="display-font text-3xl font-semibold">Create a demo subscriber</h2>
              <p className="mt-2 text-sm leading-7 text-muted">
                Sign up, pick a charity, and jump straight into a seeded production-style flow.
              </p>
            </div>
            <form action={signupAction} className="space-y-4">
              <label className="grid gap-2 text-sm font-medium">
                Full name
                <input name="fullName" className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Email
                <input name="email" type="email" className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Password
                <input name="password" type="password" className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Charity
                  <select name="charityId" className="h-12 rounded-2xl border border-line bg-white px-4 outline-none">
                    {charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Charity tier
                  <select name="charityTier" defaultValue="10" className="h-12 rounded-2xl border border-line bg-white px-4 outline-none">
                    {[10, 15, 20, 25, 30].map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}%
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button className="h-12 w-full rounded-full bg-foreground font-medium text-background">
                Create account
              </button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
