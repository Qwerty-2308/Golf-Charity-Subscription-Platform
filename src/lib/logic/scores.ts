import type { ScoreEntry } from "@/lib/types";

export interface SaveScoreInput {
  id?: string;
  userId: string;
  score: number;
  playedAt: string;
}

export function sortScoresDescending(entries: ScoreEntry[]) {
  return [...entries].sort((a, b) => {
    if (a.playedAt !== b.playedAt) {
      return b.playedAt.localeCompare(a.playedAt);
    }

    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function enforceLatestFive(entries: ScoreEntry[]) {
  return sortScoresDescending(entries).slice(0, 5);
}

export function retainOnlyLatestFive(allEntries: ScoreEntry[], userId: string) {
  const userEntries = allEntries.filter((entry) => entry.userId === userId);
  const keepIds = new Set(enforceLatestFive(userEntries).map((entry) => entry.id));

  return allEntries.filter((entry) => entry.userId !== userId || keepIds.has(entry.id));
}

export function validateScore(score: number) {
  return Number.isInteger(score) && score >= 1 && score <= 45;
}

export function upsertUserScore(entries: ScoreEntry[], input: SaveScoreInput) {
  if (!validateScore(input.score)) {
    throw new Error("Stableford scores must be between 1 and 45.");
  }

  const createdAt = new Date().toISOString();
  const nextEntries = [...entries];
  const existingIndex = nextEntries.findIndex((entry) => entry.id === input.id);

  if (existingIndex >= 0) {
    nextEntries[existingIndex] = {
      ...nextEntries[existingIndex],
      score: input.score,
      playedAt: input.playedAt,
    };
  } else {
    nextEntries.push({
      id: `score-${Math.random().toString(36).slice(2, 10)}`,
      userId: input.userId,
      score: input.score,
      playedAt: input.playedAt,
      createdAt,
    });
  }

  return retainOnlyLatestFive(nextEntries, input.userId);
}
