import Link from "next/link";
import { loginAction, signupAction } from "@/app/actions";
import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";
import { getAvailableCharities } from "@/lib/platform";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const params = await searchParams;
  const charities = await getAvailableCharities();

  return (
    <div className="section-shell space-y-10 py-14 md:py-20">
      <SectionHeading
        eyebrow="Access"
        title="Sign in to your account."
        description="Access your dashboard or create a new subscriber account."
      />
      {params.error ? (
        <Card className="mx-auto max-w-4xl border border-danger/30 bg-danger/8 text-sm text-danger">
          Authentication failed. Please check your credentials and try again.
        </Card>
      ) : null}
      {params.info ? (
        <Card className="mx-auto max-w-4xl border border-secondary/20 bg-secondary-soft/40 text-sm text-secondary">
          {params.info.replaceAll("-", " ")}.
        </Card>
      ) : null}
      
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <Card className="space-y-6">
          <div>
            <h2 className="display-font text-3xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Access the subscriber dashboard or admin control center.
            </p>
          </div>
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="requestedRole" value="subscriber" />
            <label className="grid gap-2 text-sm font-medium">
              Email
              <input name="email" type="email" required className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Password
              <input name="password" type="password" required className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
            </label>
            <button className="h-12 w-full rounded-full bg-primary font-medium text-white">
              Sign in
            </button>
          </form>

          <div className="relative my-1 flex items-center gap-3">
            <div className="h-px flex-1 bg-line" />
            <span className="text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          <a
            href="/api/auth/google"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-white font-medium text-foreground hover:bg-gray-50"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>
        </Card>

        <Card className="mesh-card space-y-6">
          <div>
            <h2 className="display-font text-3xl font-semibold">Create account</h2>
            <p className="mt-2 text-sm leading-7 text-muted">
              Create a new subscriber account and select your charity.
            </p>
          </div>
          <form action={signupAction} className="space-y-4">
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
              <input name="password" type="password" required minLength={6} className="h-12 rounded-2xl border border-line bg-white px-4 outline-none" />
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
  );
}
