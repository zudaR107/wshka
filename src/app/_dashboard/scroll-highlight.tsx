"use client";

import { useEffect } from "react";

/**
 * Reads the URL hash on mount and after hash changes.
 * If the hash matches an item anchor (#item-<id>), scrolls the element to the
 * center of the viewport and briefly applies a highlight animation.
 */
export function ScrollHighlight() {
  useEffect(() => {
    function activate() {
      const hash = window.location.hash;
      if (!hash.startsWith("#item-")) return;

      const el = document.getElementById(hash.slice(1));
      if (!el) return;

      el.scrollIntoView({ behavior: "smooth", block: "center" });

      // Reset any in-progress animation first so re-triggering works.
      el.classList.remove("item-card--highlight");
      // Force reflow so removing + adding the class restarts the animation.
      void el.offsetWidth;
      el.classList.add("item-card--highlight");

      const timer = setTimeout(
        () => el.classList.remove("item-card--highlight"),
        1800,
      );
      return timer;
    }

    let timer = activate();

    function handleHashChange() {
      if (timer !== undefined) clearTimeout(timer);
      timer = activate();
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, []);

  return null;
}
