import type {
  CharityLedgerEntry,
  DashboardKpis,
  DonationLedgerEntry,
  MonthlyDraw,
  PayoutLedgerEntry,
  SubscriptionRecord,
} from "@/lib/types";

export function buildDashboardKpis(args: {
  subscriptions: SubscriptionRecord[];
  draws: MonthlyDraw[];
  charityLedger: CharityLedgerEntry[];
  donations: DonationLedgerEntry[];
  payouts: PayoutLedgerEntry[];
}): DashboardKpis {
  const activeSubscribers = args.subscriptions.filter((subscription) => subscription.status === "active").length;
  const totalPrizePoolCents = args.draws.reduce((sum, draw) => sum + draw.prizePoolCents, 0);
  const totalCharityCents = args.charityLedger.reduce((sum, entry) => sum + entry.amountCents, 0);
  const pendingClaims = args.payouts.filter((payout) => payout.status === "pending").length;
  const rolloverCents = args.draws.at(-1)?.fiveMatchPoolCents ?? 0;

  return {
    activeSubscribers,
    totalPrizePoolCents,
    totalCharityCents,
    pendingClaims,
    rolloverCents,
  };
}
