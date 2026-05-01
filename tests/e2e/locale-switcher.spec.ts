import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

// ── Guest locale switcher ──────────────────────────────────────────────────

test("guest sees Russian UI by default", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Поделись желаниями/i })).toBeVisible();
  await context.close();
});

test("guest can switch to English via the globe button", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  await page.getByRole("button", { name: /Сменить язык|Switch language/i }).click();

  await expect(page.getByRole("heading", { name: /Share your wishes/i })).toBeVisible();
  await context.close();
});

test("locale preference persists after page reload", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  await page.getByRole("button", { name: /Сменить язык|Switch language/i }).click();
  await expect(page.getByRole("heading", { name: /Share your wishes/i })).toBeVisible();

  await page.reload();

  await expect(page.getByRole("heading", { name: /Share your wishes/i })).toBeVisible();
  await context.close();
});

test("guest can switch back to Russian", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("/");
  await page.getByRole("button", { name: /Сменить язык|Switch language/i }).click();
  await expect(page.getByRole("heading", { name: /Share your wishes/i })).toBeVisible();

  // Switch back
  await page.getByRole("button", { name: /Switch language|Сменить язык/i }).click();

  await expect(page.getByRole("heading", { name: /Поделись желаниями/i })).toBeVisible();
  await context.close();
});

// ── Browser auto-detect ───────────────────────────────────────────────────

test("first visit with Accept-Language en sets English locale", async ({ browser }) => {
  const context = await browser.newContext({
    locale: "en-US",
    extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
  });
  const page = await context.newPage();

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Share your wishes/i })).toBeVisible();
  await context.close();
});

// ── Authenticated locale switcher ─────────────────────────────────────────

test("authenticated user can switch to English via gear dropdown", async ({ page }) => {
  await registerUser(page);

  await page.getByRole("button", { name: "Меню аккаунта" }).click();
  await page.getByRole("button", { name: "Сменить язык" }).click();

  await expect(page.getByRole("button", { name: /Account menu/i })).toBeVisible();
});

// ── Helpers ───────────────────────────────────────────────────────────────

async function registerUser(page: Page) {
  const runId = randomUUID().slice(0, 12);
  await page.goto("/register");
  await page.getByLabel("Email").fill(`locale-${runId}@example.com`);
  await page.getByLabel("Пароль", { exact: true }).fill(`Locale!${runId}`);
  await page.getByLabel("Повторите пароль").fill(`Locale!${runId}`);
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await expect(page).toHaveURL(/\/(?:\?.*)?$/);
}
