import { demoDatabaseSeed } from "@/lib/demo-data";
import type { DemoDatabase } from "@/lib/types";

declare global {
  var __goodDriveDemoStore: DemoDatabase | undefined;
}

export function getDemoStore() {
  if (!global.__goodDriveDemoStore) {
    global.__goodDriveDemoStore = structuredClone(demoDatabaseSeed);
  }

  return global.__goodDriveDemoStore;
}

export function mutateDemoStore<T>(mutator: (store: DemoDatabase) => T) {
  const store = getDemoStore();
  return mutator(store);
}

export function resetDemoStore() {
  global.__goodDriveDemoStore = structuredClone(demoDatabaseSeed);
}
