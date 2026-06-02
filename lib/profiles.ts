"use client";
import { useSyncExternalStore } from "react";

import { PROFILES, type DemoProfile } from "@/lib/profiles-data";

export { PROFILES };
export type { DemoProfile };

const STORAGE_KEY = "adproof.profile";
// The full on-device profile (interests + ZK secret) — persisted so it is
// visibly stored on the user's device and NEVER sent to the server. Open
// DevTools → Application → Local Storage to inspect it during the demo.
const DEVICE_KEY = "adproof.device_profile";
const listeners = new Set<() => void>();
let cache: string | undefined;

function persistDeviceProfile(id: string) {
  if (typeof window === "undefined") return;
  const profile = PROFILES.find((p) => p.id === id) ?? PROFILES[0];
  window.localStorage.setItem(DEVICE_KEY, JSON.stringify(profile));
}

function read(): string {
  if (typeof window === "undefined") return PROFILES[0].id;
  if (cache !== undefined) return cache;
  cache = window.localStorage.getItem(STORAGE_KEY) ?? PROFILES[0].id;
  persistDeviceProfile(cache);
  return cache;
}

export function setSelectedProfileId(id: string) {
  cache = id;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, id);
    persistDeviceProfile(id);
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
