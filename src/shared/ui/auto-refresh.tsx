"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refreshes RSC data on a fixed interval so that server-side changes
 * (reservations, item updates, etc.) are reflected without a manual reload.
 *
 * Renders nothing — mount it anywhere inside a layout or page component.
 */
export function AutoRefresh({ intervalMs = 30_000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
