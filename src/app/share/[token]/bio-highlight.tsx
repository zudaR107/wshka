"use client";

import { useEffect } from "react";

/**
 * Reads sessionStorage["highlight-bio"] on mount.
 * If present, scrolls the owner-bio card into the center of the viewport
 * and briefly applies a highlight animation.
 * Set by the notifications page before navigating here.
 */
export function BioHighlight() {
  useEffect(() => {
    const flag = sessionStorage.getItem("highlight-bio");
    if (!flag) return;
    sessionStorage.removeItem("highlight-bio");

    const el = document.getElementById("owner-bio");
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("share-owner-card--highlight");
    const timer = setTimeout(
      () => el.classList.remove("share-owner-card--highlight"),
      1800,
    );
    return () => clearTimeout(timer);
  }, []);

  return null;
}
