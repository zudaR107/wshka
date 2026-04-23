import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getOrCreateCurrentWishlist: vi.fn(),
  insert: vi.fn(),
  insertValues: vi.fn(),
}));

vi.mock("../../src/modules/wishlist/server/current-wishlist", () => ({
  getOrCreateCurrentWishlist: mocks.getOrCreateCurrentWishlist,
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    insert: mocks.insert,
  },
}));

import {
  createCurrentWishlistItem,
  validateCreateWishlistItemInput,
} from "../../src/modules/wishlist/server/create-item";

describe("wishlist item creation validation", () => {
  it("requires a non-empty title", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "   ",
        url: "",
        note: "",
        price: "",
      }),
    ).toEqual({ status: "error", code: "invalid-title" });
  });

  it("rejects invalid urls when provided", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "not a valid url",
        note: "",
        price: "",
      }),
    ).toEqual({ status: "error", code: "invalid-url" });
  });

  it("rejects bare words without a dot as urls", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "helloworld",
        note: "",
        price: "",
      }),
    ).toEqual({ status: "error", code: "invalid-url" });
  });

  it("rejects negative prices", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "",
        note: "",
        price: "-1",
      }),
    ).toEqual({ status: "error", code: "invalid-price" });
  });

  it("rejects non-numeric prices", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "",
        note: "",
        price: "abc",
      }),
    ).toEqual({ status: "error", code: "invalid-price" });
  });

  it("accepts a url without protocol and prepends https://", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "example.com",
        note: "",
        price: "",
      }),
    ).toEqual({
      status: "valid",
      values: { title: "Наушники", url: "https://example.com", note: null, price: null },
    });
  });

  it("rejects a price that exceeds the maximum allowed value", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "",
        note: "",
        price: "1000000000000",
      }),
    ).toEqual({ status: "error", code: "invalid-price" });
  });

  it("accepts a price equal to the maximum allowed value", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "",
        note: "",
        price: "999999999999",
      }),
    ).toEqual({
      status: "valid",
      values: { title: "Наушники", url: null, note: null, price: "999999999999" },
    });
  });

  it("accepts a zero price", () => {
    expect(
      validateCreateWishlistItemInput({
        title: "Наушники",
        url: "",
        note: "",
        price: "0",
      }),
    ).toEqual({
      status: "valid",
      values: { title: "Наушники", url: null, note: null, price: "0" },
    });
  });
});

describe("wishlist item creation flow", () => {
  beforeEach(() => {
    mocks.getOrCreateCurrentWishlist.mockReset();
    mocks.insert.mockReset();
    mocks.insertValues.mockReset();

    mocks.insert.mockReturnValue({
      values: mocks.insertValues,
    });
  });

  it("creates an item in the current owner wishlist", async () => {
    mocks.getOrCreateCurrentWishlist.mockResolvedValue({
      id: "wishlist-1",
      userId: "user-1",
      isActive: true,
      createdAt: new Date("2026-04-11T00:00:00.000Z"),
      updatedAt: new Date("2026-04-11T00:00:00.000Z"),
    });
    mocks.insertValues.mockResolvedValue(undefined);

    await expect(
      createCurrentWishlistItem("user-1", {
        title: " Наушники ",
        url: "https://example.com/item",
        note: " Беспроводные ",
        price: "1990",
      }),
    ).resolves.toEqual({ status: "success" });

    expect(mocks.getOrCreateCurrentWishlist).toHaveBeenCalledWith("user-1");
    expect(mocks.insertValues).toHaveBeenCalledWith({
      wishlistId: "wishlist-1",
      title: "Наушники",
      url: "https://example.com/item",
      note: "Беспроводные",
      price: "1990",
    });
  });
});
