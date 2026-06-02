"use client";
import { useSyncExternalStore } from "react";

// Mock on-device user profiles. Each has interests and a ZK secret used to
// generate eligibility proofs. The profile NEVER leaves the device — only a
// proof that an interest condition holds is sent.
export type DemoProfile = {
  id: string;
  name: string;
  tagline: string;
  interests: string[];
  // Fixed per-profile secret (decimal string) for Groth16 proof generation.
  secret: string;
};

export const PROFILES: DemoProfile[] = [
  {
    id: "p_tech",
    name: "Deniz",
    tagline: "Tech & Gaming",
    interests: ["technology", "gaming", "finance"],
    secret: "111111111111111111",
  },
  {
    id: "p_life",
    name: "Ece",
    tagline: "Food & Fitness",
    interests: ["food", "fitness", "sports"],
    secret: "222222222222222222",
  },
  {
    id: "p_style",
    name: "Mert",
    tagline: "Fashion & Travel",
    interests: ["fashion", "travel", "music"],
    secret: "333333333333333333",
  },
  {
    id: "p_learn",
    name: "Aylin",
    tagline: "Finance & Learning",
    interests: ["finance", "education", "technology"],
    secret: "444444444444444444",
  },
];

const STORAGE_KEY = "adproof.profile";
const listeners = new Set<() => void>();
let cache: string | undefined;

function read(): string {
  if (typeof window === "undefined") return PROFILES[0].id;
  if (cache !== undefined) return cache;
  cache = window.localStorage.getItem(STORAGE_KEY) ?? PROFILES[0].id;
  return cache;
}

export function setSelectedProfileId(id: string) {
  cache = id;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, id);
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useSelectedProfile(): DemoProfile {
  const id = useSyncExternalStore(subscribe, read, () => PROFILES[0].id);
  return PROFILES.find((p) => p.id === id) ?? PROFILES[0];
}
