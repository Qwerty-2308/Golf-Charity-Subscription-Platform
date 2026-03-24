export type UserRole = "subscriber" | "admin";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "inactive"
  | "unpaid";

export type PlanCadence = "monthly" | "yearly";

export type CharityTier = 10 | 15 | 20 | 25 | 30;

export type DrawMode = "random" | "algorithmic";

export type FrequencyBias = "most_frequent" | "least_frequent";

export type DrawTier = "five_match" | "four_match" | "three_match";

export type ClaimStatus = "pending" | "approved" | "rejected" | "paid";

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  selectedCharityId: string;
  charityTier: CharityTier;
  countryCode: string;
  currencyCode: string;
  createdAt: string;
}

export interface DemoAccount {
  userId: string;
  password: string;
}

export interface Plan {
  id: string;
  name: string;
  cadence: PlanCadence;
  baseAmountCents: number;
  yearlySavingsLabel?: string;
  stripeLookupKey: string;
  prizePoolBaseCents: number;
  baseCharityPercent: CharityTier;
  enabledTiers: CharityTier[];
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  cadence: PlanCadence;
  status: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  latestInvoiceStatus: string;
  updatedAt: string;
}

export interface CharityEvent {
  id: string;
  charityId: string;
  title: string;
  date: string;
  location: string;
  summary: string;
}

export interface Charity {
  id: string;
  slug: string;
  name: string;
  category: string;
  impactTag: string;
  description: string;
  mission: string;
  featured: boolean;
  images: string[];
  upcomingEvents: CharityEvent[];
  totalRaisedCents: number;
  active: boolean;
}

export interface ScoreEntry {
  id: string;
  userId: string;
  score: number;
  playedAt: string;
  createdAt: string;
}

export interface MonthlyDraw {
  id: string;
  monthKey: string;
  drawMode: DrawMode;
  frequencyBias?: FrequencyBias;
  numbers: number[];
  publishedAt?: string;
  prizePoolCents: number;
  rolloverFromPreviousCents: number;
  fiveMatchPoolCents: number;
  fourMatchPoolCents: number;
  threeMatchPoolCents: number;
  charityTotalCents: number;
  simulationOnly: boolean;
}

export interface DrawResult {
  id: string;
  drawId: string;
  userId: string;
  matchedCount: 3 | 4 | 5;
  tier: DrawTier;
  prizeCents: number;
  numbersMatched: number[];
  claimStatus?: ClaimStatus;
}

export interface WinnerClaim {
  id: string;
  drawResultId: string;
  userId: string;
  proofUrl: string;
  notes?: string;
  status: ClaimStatus;
  createdAt: string;
  reviewedAt?: string;
}

export interface CharityLedgerEntry {
  id: string;
  userId: string;
  charityId: string;
  amountCents: number;
  source: "subscription" | "donation";
  recordedAt: string;
}

export interface DonationLedgerEntry {
  id: string;
  userId: string;
  charityId: string;
  amountCents: number;
  recordedAt: string;
}

export interface PayoutLedgerEntry {
  id: string;
  claimId: string;
  userId: string;
  amountCents: number;
  status: "pending" | "paid";
  recordedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  summary: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  slug: string;
  active: boolean;
}

export interface DemoDatabase {
  profiles: Profile[];
  demoAccounts: DemoAccount[];
  plans: Plan[];
  subscriptions: SubscriptionRecord[];
  charities: Charity[];
  scoreEntries: ScoreEntry[];
  monthlyDraws: MonthlyDraw[];
  drawResults: DrawResult[];
  winnerClaims: WinnerClaim[];
  charityLedger: CharityLedgerEntry[];
  donationLedger: DonationLedgerEntry[];
  payoutLedger: PayoutLedgerEntry[];
  auditLogs: AuditLogEntry[];
  organizations: Organization[];
  campaigns: Campaign[];
}

export interface PrizePoolSnapshot {
  totalPrizePoolCents: number;
  rolloverFromPreviousCents: number;
  fiveMatchPoolCents: number;
  fourMatchPoolCents: number;
  threeMatchPoolCents: number;
}

export interface MonthlyDrawSummary {
  draw: MonthlyDraw;
  provisionalResults: DrawResult[];
  nextRolloverCents: number;
}

export interface DashboardKpis {
  activeSubscribers: number;
  totalPrizePoolCents: number;
  totalCharityCents: number;
  pendingClaims: number;
  rolloverCents: number;
}

export interface ViewerContext {
  profile: Profile;
  subscription?: SubscriptionRecord;
  isActiveSubscriber: boolean;
}
