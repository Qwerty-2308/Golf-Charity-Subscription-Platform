import { describe, expect, it } from "vitest";
import {
  calculateMatchedNumbers,
  createPrizePoolSnapshot,
  generateDrawNumbers,
  resolveTier,
  simulateDrawSummary,
} from "./draws";
import type { Plan, Profile, ScoreEntry, SubscriptionRecord } from "../types";

describe("draw engine logic", () => {
  it("resolves tiers from matched numbers", () => {
    expect(resolveTier(5)).toBe("five_match");
    expect(resolveTier(4)).toBe("four_match");
    expect(resolveTier(3)).toBe("three_match");
    expect(resolveTier(2)).toBeNull();
  });

  it("creates a five-number unique draw", () => {
    const numbers = generateDrawNumbers([1, 1, 2, 3, 4, 5, 6], "algorithmic", "most_frequent");
    expect(numbers).toHaveLength(5);
    expect(new Set(numbers).size).toBe(5);
  });

  it("calculates tier pool splits with rollover", () => {
    const plans: Plan[] = [
      {
        id: "plan-a",
        name: "A",
        cadence: "monthly",
        baseAmountCents: 4900,
        stripeLookupKey: "plan-a",
        prizePoolBaseCents: 1800,
        baseCharityPercent: 10,
        enabledTiers: [10, 15, 20, 25, 30],
      },
    ];
    const subscriptions: SubscriptionRecord[] = [
      {
        id: "sub-a",
        userId: "user-a",
        planId: "plan-a",
        cadence: "monthly",
        status: "active",
        currentPeriodStart: "2026-03-01T00:00:00.000Z",
        currentPeriodEnd: "2026-04-01T00:00:00.000Z",
        cancelAtPeriodEnd: false,
        latestInvoiceStatus: "paid",
        updatedAt: "2026-03-01T00:00:00.000Z",
      },
    ];

    const snapshot = createPrizePoolSnapshot(subscriptions, plans, 2000);
    expect(snapshot.totalPrizePoolCents).toBe(3800);
    expect(snapshot.fiveMatchPoolCents + snapshot.fourMatchPoolCents + snapshot.threeMatchPoolCents).toBe(3800);
  });

  it("simulates a summary with winner matches", () => {
    const profiles: Profile[] = [
      {
        id: "user-a",
        fullName: "User A",
        email: "user-a@example.com",
        role: "subscriber",
        selectedCharityId: "charity-a",
        charityTier: 10,
        countryCode: "IN",
        currencyCode: "INR",
        createdAt: "2026-03-01T00:00:00.000Z",
      },
    ];
    const scores: ScoreEntry[] = [1, 2, 3, 4, 5].map((score) => ({
      id: `score-${score}`,
      userId: "user-a",
      score,
      playedAt: `2026-03-0${score}`,
      createdAt: `2026-03-0${score}T00:00:00.000Z`,
    }));
    const plans: Plan[] = [
      {
        id: "plan-a",
        name: "A",
        cadence: "monthly",
        baseAmountCents: 4900,
        stripeLookupKey: "plan-a",
        prizePoolBaseCents: 1800,
        baseCharityPercent: 10,
        enabledTiers: [10, 15, 20, 25, 30],
      },
    ];
    const subscriptions: SubscriptionRecord[] = [
      {
        id: "sub-a",
        userId: "user-a",
        planId: "plan-a",
        cadence: "monthly",
        status: "active",
        currentPeriodStart: "2026-03-01T00:00:00.000Z",
        currentPeriodEnd: "2026-04-01T00:00:00.000Z",
        cancelAtPeriodEnd: false,
        latestInvoiceStatus: "paid",
        updatedAt: "2026-03-01T00:00:00.000Z",
      },
    ];

    const summary = simulateDrawSummary({
      monthKey: "2026-03",
      mode: "random",
      subscriptions,
      plans,
      profiles,
      scores,
      charityTotalCents: 1000,
      rolloverFromPreviousCents: 500,
    });

    expect(summary.draw.prizePoolCents).toBe(2300);
    expect(summary.provisionalResults.every((result) => calculateMatchedNumbers([1, 2, 3, 4, 5], summary.draw.numbers).length >= result.matchedCount)).toBe(true);
  });
});
