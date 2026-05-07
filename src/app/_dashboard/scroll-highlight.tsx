"use client";

import { useEffect } from "react";

/**
 * Scrolls a dashboard item into the center of the viewport and briefly
 * applies a highlight animation. The target item id is resolved from:
 *   1. sessionStorage key "scroll-to-item" (set before cross-page navigation,
 *      keeps the URL clean — no hash in the address bar)
 *   2. URL hash (#item-<id>) as a fallback for direct links
 *
 * Also listens for hashchange to support SPA in-page hash navigation.
 */
export function ScrollHighlight() {
  useEffect(() => {
    function scrollAndHighlight(itemId: string) {
      const el = document.getElementById(`item-${itemId}`);
      if (!el) return undefined;

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Reset any in-progress animation so re-triggering works.
      el.classList.remove("item-card--highlight");
      // Force reflow so removing + adding the class restarts the animation.
      void el.offsetWidth;
      el.classList.add("item-card--highlight");

      return setTimeout(() => el.classList.remove("item-card--highlight"), 1800);
    }

    function resolveItemId(): string | null {
      // Prefer sessionStorage (clean URL navigation from /notifications).
      const stored = sessionStorage.getItem("scroll-to-item");
      if (stored) {
        sessionStorage.removeItem("scroll-to-item");
        return stored;
      }
      // Fallback: URL hash (#item-<id>).
      const hash = window.location.hash;
      if (hash.startsWith("#item-")) return hash.slice("#item-".length);
      return null;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    const id = resolveItemId();
    if (id) timer = scrollAndHighlight(id);

    function handleHashChange() {
      if (timer !== undefined) clearTimeout(timer);
      const hash = window.location.hash;
      if (hash.startsWith("#item-")) {
        timer = scrollAndHighlight(hash.slice("#item-".length));
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  return null;
}
