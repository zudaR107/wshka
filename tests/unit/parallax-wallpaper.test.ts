import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseCSS = readFileSync(
  resolve(__dirname, "../../src/app/styles/base.css"),
  "utf-8",
);
const darkCSS = readFileSync(
  resolve(__dirname, "../../src/app/styles/dark.css"),
  "utf-8",
);
const layoutCSS = readFileSync(
  resolve(__dirname, "../../src/app/styles/layout.css"),
  "utf-8",
);
const componentSrc = readFileSync(
  resolve(__dirname, "../../src/shared/ui/wallpaper-parallax.tsx"),
  "utf-8",
);

describe("parallax wallpaper", () => {
  describe("base.css — fixed layer", () => {
    it("declares .wallpaper-bg CSS class for the background element", () => {
      expect(baseCSS).toContain(".wallpaper-bg");
    });

    it("fixes the pseudo-element to the viewport", () => {
      expect(baseCSS).toContain("position: fixed");
    });

    it("places the wallpaper layer behind content", () => {
      expect(baseCSS).toContain("z-index: -1");
    });

    it("extends beyond viewport edges so shifts stay covered", () => {
      expect(baseCSS).toContain("inset: -120px");
    });

    it("does not set background-color on body (would cover z-index:-1 layer)", () => {
      const bodyBlockMatch = baseCSS.match(/\bbody\s*\{([^}]+)\}/);
      expect(bodyBlockMatch).not.toBeNull();
      expect(bodyBlockMatch![1]).not.toContain("background-color");
    });

    it("serves the wallpaper via .wallpaper-bg, not via body background-image", () => {
      const bgClassIndex = baseCSS.indexOf(".wallpaper-bg");
      const wallpaperIndex = baseCSS.indexOf("url('/wallpaper.svg')");
      expect(bgClassIndex).toBeGreaterThan(-1);
      expect(wallpaperIndex).toBeGreaterThan(-1);
      expect(wallpaperIndex).toBeGreaterThan(bgClassIndex);
    });
  });

  describe("base.css — pointer-driven parallax", () => {
    it("sets transform directly on the element from JS (no CSS variable cascade)", () => {
      expect(baseCSS).not.toContain("--wp-x");
      expect(baseCSS).not.toContain("--wp-y");
      expect(componentSrc).toContain("bg.style.transform");
    });

    it("applies offset via transform translate for composited animation", () => {
      expect(componentSrc).toContain("bg.style.transform");
      expect(componentSrc).toContain("translate(");
    });

    it("promotes the layer to a GPU compositor layer via will-change", () => {
      expect(baseCSS).toContain("will-change: transform");
    });
  });

  describe("base.css — accessibility", () => {
    it("respects prefers-reduced-motion in the client component", () => {
      expect(componentSrc).toContain("prefers-reduced-motion");
    });
  });

  describe("dark.css — dark mode integration", () => {
    it("dims the wallpaper background element in dark mode via opacity", () => {
      expect(darkCSS).toContain(".dark .wallpaper-bg");
      expect(darkCSS).toContain("opacity");
    });

    it("does not override body background-image in dark mode", () => {
      expect(darkCSS).not.toContain("url('/wallpaper.svg')");
    });
  });

  describe("wallpaper-parallax.tsx — client component", () => {
    it("is marked as a client component", () => {
      expect(componentSrc).toContain('"use client"');
    });

    it("listens for pointermove events", () => {
      expect(componentSrc).toContain("pointermove");
    });

    it("listens for wheel events (Mac trackpad incl. momentum scrolling)", () => {
      expect(componentSrc).toContain('"wheel"');
    });

    it("listens for scroll events (mobile touch scroll)", () => {
      expect(componentSrc).toContain('"scroll"');
    });

    it("uses window.scrollY as ground truth, not accumulated wheel deltas", () => {
      expect(componentSrc).toContain("window.scrollY");
      expect(componentSrc).not.toContain("wheelAccum");
    });

    it("maps scroll to a fraction of total page height for even distribution", () => {
      expect(componentSrc).toContain("scrollable");
      expect(componentSrc).toContain("fraction");
    });

    it("guards against division by zero on non-scrollable pages", () => {
      expect(componentSrc).toContain("scrollable > 0");
    });

    it("applies initial state on mount without waiting for the first event", () => {
      expect(componentSrc).toContain("update()");
    });

    it("uses requestAnimationFrame for throttling", () => {
      expect(componentSrc).toContain("requestAnimationFrame");
    });

    it("sets transform directly on the background element ref (no CSS variable cascade)", () => {
      expect(componentSrc).toContain("bg.style.transform");
      expect(componentSrc).not.toContain("--wp-x");
      expect(componentSrc).not.toContain("--wp-y");
    });

    it("respects prefers-reduced-motion", () => {
      expect(componentSrc).toContain("prefers-reduced-motion");
    });

    it("removes the event listener on unmount", () => {
      expect(componentSrc).toContain("removeEventListener");
    });
  });

  describe("base.css — overscroll", () => {
    it("disables rubber-band overscroll to prevent gaps behind header and footer", () => {
      expect(baseCSS).toContain("overscroll-behavior: none");
    });
  });

  describe("layout.css — site header", () => {
    it("does not use backdrop-filter (removed for performance)", () => {
      expect(layoutCSS).not.toContain("backdrop-filter");
    });
  });

  describe("layout.css — mobile logo", () => {
    it("hides logo text on all nav states at <=479px", () => {
      // Selector must be simple .site-logo-text, not scoped to auth-only
      expect(layoutCSS).toContain(".site-logo-text");
      expect(layoutCSS).not.toContain("site-nav--guest");
    });
  });
});
