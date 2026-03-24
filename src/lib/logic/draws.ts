import { toMonthKey } from "@/lib/utils";
import type {
  DrawResult,
  DrawTier,
  FrequencyBias,
  MonthlyDraw,
  MonthlyDrawSummary,
  Plan,
  PrizePoolSnapshot,
  Profile,
  ScoreEntry,
  SubscriptionRecord,
} from "@/lib/types";

function tallyFrequencies(scores: number[]) {
  const counts = new Map<number, number>();

  for (let number = 1; number <= 45; number += 1) {
    counts.set(number, 0);
  }

  for (const score of scores) {
    counts.set(score, (counts.get(score) ?? 0) + 1);
  }

  return counts;
}

function weightedPick(available: number[], counts: Map<number, number>, bias: FrequencyBias) {
  const weighted = available.map((value) => {
    const frequency = counts.get(value) ?? 0;
    const weight = bias === "most_frequent" ? frequency + 1 : Math.max(1, 12 - frequency);
    return { value, weight };
  });

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let cursor = Math.random() * totalWeight;

  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) {
      return item.value;
    }
  }

  return weighted[weighted.length - 1]?.value ?? available[0] ?? 1;
}

export function generateDrawNumbers(scores: number[], mode: MonthlyDraw["drawMode"], bias: FrequencyBias = "most_frequent") {
  const counts = tallyFrequencies(scores);
  const available = Array.from({ length: 45 }, (_, index) => index + 1);
  const result: number[] = [];

  while (result.length < 5) {
    const next =
      mode === "random"
        ? available[Math.floor(Math.random() * available.length)] ?? available[0]
        : weightedPick(available, counts, bias);

    result.push(next);
    const index = available.indexOf(next);
    available.splice(index, 1);
  }

  return result.sort((a, b) => a - b);
}

export function calculateMatchedNumbers(userScores: number[], drawNumbers: number[]) {
  const drawSet = new Set(drawNumbers);
  return Array.from(new Set(userScores.filter((value) => drawSet.has(value)))).sort((a, b) => a - b);
}

export function resolveTier(matchedCount: number): DrawTier | null {
  if (matchedCount === 5) {
    return "five_match";
  }

  if (matchedCount === 4) {
    return "four_match";
  }

  if (matchedCount === 3) {
    return "three_match";
  }

  return null;
}

export function createPrizePoolSnapshot(activeSubscriptions: SubscriptionRecord[], plans: Plan[], rolloverFromPreviousCents: number): PrizePoolSnapshot {
  const totalPrizePoolCents =
    activeSubscriptions.reduce((sum, subscription) => {
      const plan = plans.find((candidate) => candidate.id === subscription.planId);
      return sum + (plan?.prizePoolBaseCents ?? 0);
    }, 0) + rolloverFromPreviousCents;

  const fiveMatchPoolCents = Math.round(totalPrizePoolCents * 0.4);
  const fourMatchPoolCents = Math.round(totalPrizePoolCents * 0.35);
  const threeMatchPoolCents = totalPrizePoolCents - fiveMatchPoolCents - fourMatchPoolCents;

  return {
    totalPrizePoolCents,
    rolloverFromPreviousCents,
    fiveMatchPoolCents,
    fourMatchPoolCents,
    threeMatchPoolCents,
  };
}

export function simulateDrawSummary(args: {
  monthKey?: string;
  mode: MonthlyDraw["drawMode"];
  bias?: FrequencyBias;
  subscriptions: SubscriptionRecord[];
  plans: Plan[];
  profiles: Profile[];
  scores: ScoreEntry[];
  charityTotalCents: number;
  rolloverFromPreviousCents: number;
}) {
  const monthKey = args.monthKey ?? toMonthKey();
  const eligibleSubscriptions = args.subscriptions.filter((subscription) => subscription.status === "active");
  const eligibleUserIds = new Set(eligibleSubscriptions.map((subscription) => subscription.userId));
  const eligibleScores = args.scores.filter((score) => eligibleUserIds.has(score.userId));
  const userScoreMap = new Map<string, number[]>();

  for (const score of eligibleScores) {
    const scores = userScoreMap.get(score.userId) ?? [];
    scores.push(score.score);
    userScoreMap.set(score.userId, scores);
  }

  const rolledScores = Array.from(userScoreMap.values()).flat();
  const numbers = generateDrawNumbers(rolledScores, args.mode, args.bias);
  const pool = createPrizePoolSnapshot(eligibleSubscriptions, args.plans, args.rolloverFromPreviousCents);
  const provisional: Omit<DrawResult, "prizeCents">[] = [];

  for (const profile of args.profiles) {
    if (!eligibleUserIds.has(profile.id)) {
      continue;
    }

    const scores = userScoreMap.get(profile.id) ?? [];
    if (scores.length < 5) {
      continue;
    }

    const numbersMatched = calculateMatchedNumbers(scores, numbers);
    const tier = resolveTier(numbersMatched.length);

    if (!tier) {
      continue;
    }

    provisional.push({
      id: `preview-${profile.id}`,
      drawId: `preview-${monthKey}`,
      userId: profile.id,
      matchedCount: numbersMatched.length as 3 | 4 | 5,
      tier,
      numbersMatched,
      claimStatus: "pending",
    });
  }

  const tierCounts = {
    five_match: provisional.filter((entry) => entry.tier === "five_match").length,
    four_match: provisional.filter((entry) => entry.tier === "four_match").length,
    three_match: provisional.filter((entry) => entry.tier === "three_match").length,
  };

  const results: DrawResult[] = provisional.map((entry) => {
    const prizeCents =
      entry.tier === "five_match"
        ? Math.floor(pool.fiveMatchPoolCents / Math.max(tierCounts.five_match, 1))
        : entry.tier === "four_match"
          ? Math.floor(pool.fourMatchPoolCents / Math.max(tierCounts.four_match, 1))
          : Math.floor(pool.threeMatchPoolCents / Math.max(tierCounts.three_match, 1));

    return {
      ...entry,
      prizeCents,
    };
  });

  const nextRolloverCents = tierCounts.five_match === 0 ? pool.fiveMatchPoolCents : 0;

  return {
    draw: {
      id: `preview-${monthKey}`,
      monthKey,
      drawMode: args.mode,
      frequencyBias: args.mode === "algorithmic" ? args.bias : undefined,
      numbers,
      prizePoolCents: pool.totalPrizePoolCents,
      rolloverFromPreviousCents: pool.rolloverFromPreviousCents,
      fiveMatchPoolCents: pool.fiveMatchPoolCents,
      fourMatchPoolCents: pool.fourMatchPoolCents,
      threeMatchPoolCents: pool.threeMatchPoolCents,
      charityTotalCents: args.charityTotalCents,
      simulationOnly: true,
    },
    provisionalResults: results,
    nextRolloverCents,
  } satisfies MonthlyDrawSummary;
}
