"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Refreshes server components on tab visibility change.
 * Handles cross-tab login/logout so the header reflects the current session.
 * Notification polling is handled separately in NavLinks via a direct API call.
 */
export function SessionSync() {
  const router = useRouter();

  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [router]);

  return null;
}
