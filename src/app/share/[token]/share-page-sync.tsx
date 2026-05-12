"use client";

import { AutoRefresh } from "@/shared/ui/auto-refresh";

/**
 * Refreshes RSC data on the share page every 30 s so that item additions
 * and deletions made by the owner are reflected without a manual reload.
 */
export function SharePageSync() {
  return <AutoRefresh />;
}
