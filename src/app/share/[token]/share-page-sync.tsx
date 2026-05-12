"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refreshes RSC data on the share page every 30 s so that item additions
 * and deletions made by the owner are reflected without a manual reload.
 *
 * Matches the visibilitychange → router.refresh() pattern in SessionSync,
 * but driven by a timer so it also works when the tab stays in the foreground
 * (common on mobile where users don't switch apps between interactions).
 */
export function SharePageSync() {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), 30_000);
    return () => clearInterval(id);
  }, [router]);

  return null;
}
