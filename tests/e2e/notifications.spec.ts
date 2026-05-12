import { randomUUID } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

type Credentials = { email: string; password: string };

function createCredentials(prefix: string): Credentials {
  const id = randomUUID().slice(0, 12);
  return { email: `${prefix}-${id}@example.com`, password: `Password!${id}` };
}

async function registerUser(page: Page, credentials: Credentials) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Пароль", { exact: true }).fill(credentials.password);
  await page.getByLabel("Повторите пароль").fill(credentials.password);
  await page.locator("#consent").check();
  await page.getByRole("button", { name: "Создать аккаунт" }).click();
  await expect(page).toHaveURL(/\/(?:\?.*)?$/);
}

async function enableShowReservations(page: Page): Promise<void> {
  await page.goto("/settings");
  await page.locator("label.settings-toggle-label").click();
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByTestId("settings-save-btn")).toContainText("Сохранено");
  await page.goto("/");
}

async function createWishlistItem(page: Page, title: string): Promise<void> {
  await page.getByTestId("add-item-toggle").click();
  const form = page.getByTestId("wishlist-create-form");
  await form.getByLabel("Название").fill(title);
  await form.getByRole("button", { name: "Добавить", exact: true }).click();
  await expect(page.getByTestId("wishlist-item-count")).toContainText("1");
}

async function updateWishlistItem(
  page: Page,
  oldTitle: string,
  newTitle: string,
): Promise<void> {
  const card = page.locator("li").filter({
    has: page.getByRole("heading", { name: oldTitle, exact: true }),
  });
  await card.getByTestId("edit-item-toggle").click();
  const form = card.locator("form").filter({
    has: page.getByRole("button", { name: "Сохранить" }),
  });
  await form.getByLabel("Название").fill(newTitle);
  await form.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("heading", { name: newTitle, exact: true })).toBeVisible();
}

// ─── Test 1 ────────────────────────────────────────────────────────────────

test("notification badge appears when a reservation is made on owner's item", async ({
  browser,
}) => {
  const owner = createCredentials("owner");
  const reserver = createCredentials("reserver");
  const itemTitle = `Badge item ${randomUUID().slice(0, 8)}`;

  const ownerCtx = await browser.newContext();
  const reserverCtx = await browser.newContext();
  const ownerPage = await ownerCtx.newPage();
  const reserverPage = await reserverCtx.newPage();

  try {
    await registerUser(ownerPage, owner);
    await enableShowReservations(ownerPage);
    await createWishlistItem(ownerPage, itemTitle);
    const shareUrl = await ownerPage.getByTestId("share-link-url").inputValue();

    await registerUser(reserverPage, reserver);
    await reserverPage.goto(shareUrl);
    await reserverPage.getByRole("button", { name: "Забронировать" }).click();
    await expect(reserverPage.getByText("Статус: забронировано мной")).toBeVisible();

    // Owner reloads to receive fresh notification data from the server
    await ownerPage.reload();

    await expect(ownerPage.locator(".site-nav-bell-badge")).toBeVisible();
    await expect(ownerPage.locator(".site-nav-bell-badge")).toContainText("1");
  } finally {
    await Promise.all([ownerCtx.close(), reserverCtx.close()]);
  }
});

// ─── Test 2 ────────────────────────────────────────────────────────────────

test("badge resets after visiting /notifications and stays 0 when navigating away", async ({
  browser,
}) => {
  const owner = createCredentials("owner");
  const reserver = createCredentials("reserver");
  const itemTitle = `Stale-badge item ${randomUUID().slice(0, 8)}`;

  const ownerCtx = await browser.newContext();
  const reserverCtx = await browser.newContext();
  const ownerPage = await ownerCtx.newPage();
  const reserverPage = await reserverCtx.newPage();

  try {
    // Setup: reserver makes a reservation so the owner has an unread notification
    await registerUser(ownerPage, owner);
    await enableShowReservations(ownerPage);
    await createWishlistItem(ownerPage, itemTitle);
    const shareUrl = await ownerPage.getByTestId("share-link-url").inputValue();

    await registerUser(reserverPage, reserver);
    await reserverPage.goto(shareUrl);
    await reserverPage.getByRole("button", { name: "Забронировать" }).click();
    await expect(reserverPage.getByText("Статус: забронировано мной")).toBeVisible();

    // Owner reloads to see the badge
    await ownerPage.reload();
    await expect(ownerPage.locator(".site-nav-bell-badge")).toBeVisible();

    // Owner opens bell dropdown and clicks "Все уведомления" — client-side navigation
    await ownerPage.getByRole("button", { name: "Уведомления" }).click();
    await ownerPage.getByRole("link", { name: "Все уведомления" }).click();
    await expect(ownerPage).toHaveURL(/\/notifications/);

    // Badge must be gone while on /notifications
    await expect(ownerPage.locator(".site-nav-bell-badge")).toHaveCount(0);

    // Navigate back to Мой вишлист via nav link — still client-side, no reload
    await ownerPage.getByRole("link", { name: "Мой вишлист" }).click();
    await expect(ownerPage).toHaveURL(/\/(?:\?.*)?$/);

    // Badge must remain 0 — this verifies the stale-count bug fix
    await expect(ownerPage.locator(".site-nav-bell-badge")).toHaveCount(0);
  } finally {
    await Promise.all([ownerCtx.close(), reserverCtx.close()]);
  }
});

// ─── Test 3 ────────────────────────────────────────────────────────────────

test("item_updated notification links back to the share page", async ({ browser }) => {
  const owner = createCredentials("owner");
  const reserver = createCredentials("reserver");
  const itemTitle = `Nav item ${randomUUID().slice(0, 8)}`;
  const updatedTitle = `${itemTitle} updated`;

  const ownerCtx = await browser.newContext();
  const reserverCtx = await browser.newContext();
  const ownerPage = await ownerCtx.newPage();
  const reserverPage = await reserverCtx.newPage();

  try {
    // Owner creates item; reserver reserves it
    await registerUser(ownerPage, owner);
    await createWishlistItem(ownerPage, itemTitle);
    const shareUrl = await ownerPage.getByTestId("share-link-url").inputValue();

    await registerUser(reserverPage, reserver);
    await reserverPage.goto(shareUrl);
    await reserverPage.getByRole("button", { name: "Забронировать" }).click();
    await expect(reserverPage.getByText("Статус: забронировано мной")).toBeVisible();

    // Owner updates the item — triggers item_updated notification for the reserver
    await ownerPage.goto("/");
    await updateWishlistItem(ownerPage, itemTitle, updatedTitle);

    // Reserver navigates to /notifications
    await reserverPage.goto("/notifications");
    await expect(reserverPage.getByTestId("notification-list")).toBeVisible();

    // The notification stores the item title as it was at creation time (before update).
    const notifItem = reserverPage
      .getByTestId("notification-item")
      .filter({ hasText: itemTitle });

    await expect(notifItem).toBeVisible();
    await notifItem.getByRole("link", { name: "Перейти к вишлисту" }).click();

    // Reserver should land on the share page
    await expect(reserverPage).toHaveURL(/\/share\//);
    await expect(reserverPage.getByRole("heading", { name: "Вишлист" })).toBeVisible();
  } finally {
    await Promise.all([ownerCtx.close(), reserverCtx.close()]);
  }
});
