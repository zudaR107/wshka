import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findReservation: vi.fn(),
  findWishlistItem: vi.fn(),
  findWishlist: vi.fn(),
  findUsers: vi.fn(),
  insert: vi.fn(),
  insertValues: vi.fn(),
  insertReturning: vi.fn(),
  createNotification: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    query: {
      reservations: { findFirst: mocks.findReservation },
      wishlistItems: { findFirst: mocks.findWishlistItem },
      wishlists: { findFirst: mocks.findWishlist },
      users: { findFirst: mocks.findUsers },
    },
    insert: mocks.insert,
  },
}));

vi.mock("../../src/modules/auth/db/schema", () => ({ users: {} }));
vi.mock("../../src/modules/notification/server/create-notification", () => ({
  createNotification: mocks.createNotification,
}));

import { createReservation } from "../../src/modules/reservation/server/lifecycle";

const flushAsync = () => new Promise<void>((resolve) => setImmediate(resolve));

describe("reservation_created notification suppression", () => {
  const createdAt = new Date("2026-04-12T00:00:00.000Z");

  beforeEach(() => {
    vi.clearAllMocks();

    // item-1 belongs to owner-1
    mocks.findWishlistItem.mockResolvedValue({ id: "item-1", wishlistId: "wishlist-1" });
    mocks.findWishlist.mockResolvedValue({ id: "wishlist-1", userId: "owner-1" });
    mocks.findReservation.mockResolvedValue(undefined);

    mocks.insert.mockReturnValue({ values: mocks.insertValues });
    mocks.insertValues.mockReturnValue({ returning: mocks.insertReturning });

    // Owner has opted in to see reservations — so the only guard being tested
    // in these cases is the self-reservation check.
    mocks.findUsers.mockResolvedValue({ showReservationsOnDashboard: true });
    mocks.createNotification.mockResolvedValue(undefined);
  });

  it("does not notify owner when they reserve their own item", async () => {
    mocks.insertReturning.mockResolvedValue([
      { id: "res-1", wishlistItemId: "item-1", userId: "owner-1", cancelledAt: null, createdAt },
    ]);

    await createReservation("owner-1", "item-1");
    await flushAsync();

    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("notifies owner when another user reserves their item", async () => {
    mocks.insertReturning.mockResolvedValue([
      { id: "res-1", wishlistItemId: "item-1", userId: "user-2", cancelledAt: null, createdAt },
    ]);

    await createReservation("user-2", "item-1");
    await flushAsync();

    expect(mocks.createNotification).toHaveBeenCalledOnce();
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "owner-1", type: "reservation_created" }),
    );
  });

  it("does not notify when showReservations is false even for cross-user reservation", async () => {
    mocks.findUsers.mockResolvedValue({ showReservationsOnDashboard: false });
    mocks.insertReturning.mockResolvedValue([
      { id: "res-1", wishlistItemId: "item-1", userId: "user-2", cancelledAt: null, createdAt },
    ]);

    await createReservation("user-2", "item-1");
    await flushAsync();

    expect(mocks.createNotification).not.toHaveBeenCalled();
  });
});
