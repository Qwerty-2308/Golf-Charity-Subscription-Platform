import { describe, expect, it } from "vitest";
import { sortScoresDescending, upsertUserScore } from "./scores";
import type { ScoreEntry } from "../types";

const seedEntries: ScoreEntry[] = [
  { id: "1", userId: "user-1", score: 11, playedAt: "2026-03-01", createdAt: "2026-03-01T00:00:00.000Z" },
  { id: "2", userId: "user-1", score: 12, playedAt: "2026-03-02", createdAt: "2026-03-02T00:00:00.000Z" },
  { id: "3", userId: "user-1", score: 13, playedAt: "2026-03-03", createdAt: "2026-03-03T00:00:00.000Z" },
  { id: "4", userId: "user-1", score: 14, playedAt: "2026-03-04", createdAt: "2026-03-04T00:00:00.000Z" },
  { id: "5", userId: "user-1", score: 15, playedAt: "2026-03-05", createdAt: "2026-03-05T00:00:00.000Z" },
];

describe("score management logic", () => {
  it("sorts scores in reverse chronological order", () => {
    const sorted = sortScoresDescending(seedEntries);
    expect(sorted.map((entry) => entry.score)).toEqual([15, 14, 13, 12, 11]);
  });

  it("keeps only the latest five entries when a sixth score is added", () => {
    const nextEntries = upsertUserScore(seedEntries, {
      userId: "user-1",
      score: 16,
      playedAt: "2026-03-06",
    });

    expect(nextEntries).toHaveLength(5);
    expect(nextEntries.map((entry) => entry.score)).toContain(16);
    expect(nextEntries.map((entry) => entry.score)).not.toContain(11);
  });

  it("rejects scores outside the stableford range", () => {
    expect(() =>
      upsertUserScore(seedEntries, {
        userId: "user-1",
        score: 99,
        playedAt: "2026-03-06",
      }),
    ).toThrow("Stableford scores must be between 1 and 45.");
  });
});
