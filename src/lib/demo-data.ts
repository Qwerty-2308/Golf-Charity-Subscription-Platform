import type { DemoDatabase } from "@/lib/types";

const currentMonth = new Date().toISOString().slice(0, 7);

export const demoDatabaseSeed: DemoDatabase = {
  profiles: [],
  demoAccounts: [],
  plans: [],
  subscriptions: [],
  charities: [],
  scoreEntries: [],
  monthlyDraws: [],
  drawResults: [],
  winnerClaims: [],
  charityLedger: [],
  donationLedger: [],
  payoutLedger: [],
  auditLogs: [],
  organizations: [],
  campaigns: [],
};

export const seededCurrentMonth = currentMonth;
