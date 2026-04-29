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

  test("body::before pseudo-element is position:fixed", async ({ page }) => {
    const position = await page.evaluate(() =>
      window.getComputedStyle(document.body, "::before").position,
    );
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

  test("WallpaperParallax sets --wp-x and --wp-y after pointer move", async ({
    page,
  }) => {
    await page.mouse.move(400, 300);
    await page.waitForTimeout(50);

    const [wpX, wpY] = await page.evaluate(() => [
      document.documentElement.style.getPropertyValue("--wp-x"),
      document.documentElement.style.getPropertyValue("--wp-y"),
    ]);

    expect(wpX).toMatch(/^-?\d+\.\d+px$/);
    expect(wpY).toMatch(/^-?\d+\.\d+px$/);
  });

  test("--wp-x changes direction when cursor crosses the viewport centre", async ({
    page,
  }) => {
    const width = page.viewportSize()!.width;

    // Move to left edge and wait for RAF to write the CSS var
    await page.mouse.move(10, 300);
    await page.waitForTimeout(50);
    const leftX = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--wp-x"),
    );

    // Move to right edge (stay 10px inside to stay within the viewport)
    await page.mouse.move(width - 10, 300);
    await page.waitForTimeout(50);
    const rightX = await page.evaluate(() =>
      document.documentElement.style.getPropertyValue("--wp-x"),
    );

    const left = parseFloat(leftX);
    const right = parseFloat(rightX);
    // Left-of-centre → positive offset; right-of-centre → negative offset
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
