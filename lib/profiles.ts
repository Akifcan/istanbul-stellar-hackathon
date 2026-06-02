"use client";
import { useSyncExternalStore } from "react";

import { PROFILES, type DemoProfile } from "@/lib/profiles-data";

export { PROFILES };
export type { DemoProfile };

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
