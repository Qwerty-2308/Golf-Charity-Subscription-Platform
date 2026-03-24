import { SectionHeading } from "@/components/section-heading";
import { Card } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="section-shell space-y-10 py-14 md:py-20">
      <SectionHeading
        eyebrow="Mechanics"
        title="Designed like a premium impact product, not a traditional golf site."
        description="Every step is deliberately simple for members and deliberately auditable for administrators."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5">
          <h2 className="display-font text-3xl font-semibold">Member flow</h2>
          <ol className="space-y-4 text-sm leading-7 text-muted">
            <li>1. Pick a monthly or yearly subscription, choose a charity, and set your contribution tier.</li>
            <li>2. Enter your latest five Stableford scores as you play. The system always keeps only your most recent five.</li>
            <li>3. Join the monthly draw automatically while your subscription stays active.</li>
            <li>4. View winnings in the dashboard and upload proof if you land in a winning tier.</li>
          </ol>
        </Card>
        <Card className="mesh-card space-y-5">
          <h2 className="display-font text-3xl font-semibold">Admin flow</h2>
          <ol className="space-y-4 text-sm leading-7 text-muted">
            <li>1. Review subscriber health, charities, donations, and score activity.</li>
            <li>2. Run a simulation before the official monthly draw publish.</li>
            <li>3. Publish once satisfied, locking the draw, prize pool split, and winner records.</li>
            <li>4. Verify proof uploads manually and mark approved winners as paid.</li>
          </ol>
        </Card>
      </div>
      <Card className="space-y-4">
        <h2 className="display-font text-3xl font-semibold">Prize and charity rules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "5-match winners split 40% of the pool.",
            "4-match winners split 35% of the pool.",
            "3-match winners split 25% of the pool.",
            "No 5-match winner means that portion rolls into the next month.",
          ].map((item) => (
            <div key={item} className="rounded-[1.5rem] border border-line bg-white/80 p-4 text-sm leading-7 text-muted">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
