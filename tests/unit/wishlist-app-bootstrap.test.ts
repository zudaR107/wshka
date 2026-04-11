import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireCurrentUser: vi.fn(),
  getOrCreateCurrentWishlist: vi.fn(),
}));

vi.mock("../../src/modules/auth/server/current-user", () => ({
  requireCurrentUser: mocks.requireCurrentUser,
}));

vi.mock("../../src/modules/wishlist/server/current-wishlist", () => ({
  getOrCreateCurrentWishlist: mocks.getOrCreateCurrentWishlist,
}));

describe("owner app wishlist bootstrap", () => {
  beforeEach(() => {
    Object.assign(globalThis, { React });
    mocks.requireCurrentUser.mockReset();
    mocks.getOrCreateCurrentWishlist.mockReset();

    mocks.requireCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "user@example.com",
    });
    mocks.getOrCreateCurrentWishlist.mockResolvedValue({
      id: "wishlist-1",
      userId: "user-1",
      isActive: true,
      createdAt: new Date("2026-04-11T00:00:00.000Z"),
      updatedAt: new Date("2026-04-11T00:00:00.000Z"),
    });
  });

  it("bootstraps the current wishlist for the authenticated owner on /app", async () => {
    const { default: AppPage } = await import("../../src/app/app/page");

    await AppPage();

    expect(mocks.requireCurrentUser).toHaveBeenCalled();
    expect(mocks.getOrCreateCurrentWishlist).toHaveBeenCalledWith("user-1");
  });
});
