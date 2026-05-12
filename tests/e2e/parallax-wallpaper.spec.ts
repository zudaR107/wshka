import { expect, test } from "@playwright/test";

/**
 * E2E tests for the parallax wallpaper feature (M10-I2).
 *
 * Unit tests verify CSS file content; these tests verify that the CSS and
 * the WallpaperParallax client component actually behave correctly in a
 * real browser.
 */

test.describe("parallax wallpaper", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for Next.js client-side hydration so WallpaperParallax mounts
    await page.waitForLoadState("networkidle");
  });

  test(".wallpaper-bg element is position:fixed", async ({ page }) => {
    const position = await page.evaluate(() => {
      const bg = document.querySelector(".wallpaper-bg");
      return bg ? window.getComputedStyle(bg).position : null;
    });
    expect(position).toBe("fixed");
  });

  test("html element has overscroll-behavior: none", async ({ page }) => {
    const value = await page.evaluate(
      () => window.getComputedStyle(document.documentElement).overscrollBehavior,
    );
    expect(value).toBe("none");
  });

  test("site header has no backdrop-filter", async ({ page }) => {
    const value = await page.evaluate(() => {
      const header = document.querySelector(".site-header");
      return header ? window.getComputedStyle(header).backdropFilter : null;
    });
    expect(value).toBe("none");
  });

  test("WallpaperParallax sets transform on .wallpaper-bg after pointer move", async ({
    page,
  }) => {
    await page.mouse.move(400, 300);
    await page.waitForTimeout(50);

    const transform = await page.evaluate(() => {
      const bg = document.querySelector<HTMLElement>(".wallpaper-bg");
      return bg ? bg.style.transform : "";
    });

    // Expects: translate(Xpx, Ypx)
    expect(transform).toMatch(/^translate\(-?\d+\.\d+px, -?\d+\.\d+px\)$/);
  });

  test("x offset changes direction when cursor crosses the viewport centre", async ({
    page,
  }) => {
    const width = page.viewportSize()!.width;

    // Move to left edge and wait for RAF to write the transform
    await page.mouse.move(10, 300);
    await page.waitForTimeout(50);
    const leftTransform = await page.evaluate(() => {
      const bg = document.querySelector<HTMLElement>(".wallpaper-bg");
      return bg ? bg.style.transform : "";
    });

    // Move to right edge (stay 10 px inside viewport)
    await page.mouse.move(width - 10, 300);
    await page.waitForTimeout(50);
    const rightTransform = await page.evaluate(() => {
      const bg = document.querySelector<HTMLElement>(".wallpaper-bg");
      return bg ? bg.style.transform : "";
    });

    const parseX = (t: string) =>
      parseFloat(t.match(/translate\((-?\d+\.\d+)px/)?.[1] ?? "NaN");
    const left = parseX(leftTransform);
    const right = parseX(rightTransform);

    // Left-of-centre → positive x offset; right-of-centre → negative x offset
    expect(left).toBeGreaterThan(0);
    expect(right).toBeLessThan(0);
  });

  test("logo text is hidden on mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator(".site-logo-text")).toBeHidden();
  });

  test("logo text is visible on desktop viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.locator(".site-logo-text")).toBeVisible();
  });
});
