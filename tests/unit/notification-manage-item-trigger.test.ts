import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  // wishlist server
  getWishlistForUser: vi.fn(),
  validateWishlistItemInput: vi.fn(),
  // db
  findWishlistItem: vi.fn(),
  selectReservations: vi.fn(),
  selectFrom: vi.fn(),
  selectWhere: vi.fn(),
  update: vi.fn(),
  updateSet: vi.fn(),
  updateWhere: vi.fn(),
  updateReturning: vi.fn(),
  delete: vi.fn(),
  deleteWhere: vi.fn(),
  deleteReturning: vi.fn(),
  // notification
  fanOutNotifications: vi.fn(),
}));

vi.mock("../../src/modules/wishlist/server/current-wishlist", () => ({
  getWishlistForUser: mocks.getWishlistForUser,
}));

vi.mock("../../src/modules/wishlist/server/item-input", () => ({
  validateWishlistItemInput: mocks.validateWishlistItemInput,
}));

vi.mock("../../src/modules/notification/server/create-notification", () => ({
  fanOutNotifications: mocks.fanOutNotifications,
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    query: {
      wishlistItems: {
        findFirst: mocks.findWishlistItem,
      },
    },
    select: mocks.selectReservations,
    update: mocks.update,
    delete: mocks.delete,
  },
}));

vi.mock("../../src/modules/reservation/db/schema", () => ({
  reservations: {},
}));

vi.mock("../../src/modules/wishlist/db/schema", () => ({
  wishlistItems: {},
}));

import {
  updateCurrentWishlistItem,
  deleteCurrentWishlistItem,
} from "../../src/modules/wishlist/server/manage-item";

const WISHLIST = { id: "wl-1", userId: "owner-1" };
const ITEM = { id: "item-1", title: "Sneakers", wishlistId: "wl-1" };
const RESERVER = { userId: "reserver-1" };

function setupChains() {
  // wishlist lookup
  mocks.getWishlistForUser.mockResolvedValue(WISHLIST);

  // item lookup
  mocks.findWishlistItem.mockResolvedValue(ITEM);

  // select reservations chain: db.select().from().where()
  mocks.selectReservations.mockReturnValue({ from: mocks.selectFrom });
  mocks.selectFrom.mockReturnValue({ where: mocks.selectWhere });
  mocks.selectWhere.mockResolvedValue([RESERVER]);

  // update chain
  mocks.update.mockReturnValue({ set: mocks.updateSet });
  mocks.updateSet.mockReturnValue({ where: mocks.updateWhere });
  mocks.updateWhere.mockReturnValue({ returning: mocks.updateReturning });
  mocks.updateReturning.mockResolvedValue([{ id: "item-1" }]);

  // delete chain
  mocks.delete.mockReturnValue({ where: mocks.deleteWhere });
  mocks.deleteWhere.mockReturnValue({ returning: mocks.deleteReturning });
  mocks.deleteReturning.mockResolvedValue([{ id: "item-1" }]);

  // notification fan-out
  mocks.fanOutNotifications.mockResolvedValue(undefined);
}

describe("updateCurrentWishlistItem notification trigger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChains();
    mocks.validateWishlistItemInput.mockReturnValue({
      status: "success",
      values: { title: "Updated", url: null, note: null, price: null, currency: "RUB", starred: false },
    });
  });

  it("calls fanOutNotifications with item_updated after a successful update", async () => {
    const result = await updateCurrentWishlistItem("owner-1", "wl-1", "item-1", {
      title: "Updated",
      url: "",
      note: "",
      price: "",
      currency: "RUB",
    });

    expect(result.status).toBe("success");
    // fanOutNotifications is called with void (best-effort) so we wait a tick
    await vi.runAllTimersAsync().catch(() => {});
    await Promise.resolve();

    expect(mocks.fanOutNotifications).toHaveBeenCalledWith(
      ["reserver-1"],
      expect.objectContaining({ type: "item_updated", itemId: "item-1" }),
    );
  });

  it("returns item-not-found without notifying if item does not belong to wishlist", async () => {
    mocks.findWishlistItem.mockResolvedValue(null);

    const result = await updateCurrentWishlistItem("owner-1", "wl-1", "item-1", {
      title: "Updated",
      url: "",
      note: "",
      price: "",
      currency: "RUB",
    });

    expect(result.status).toBe("error");
    expect(mocks.fanOutNotifications).not.toHaveBeenCalled();
  });
});

describe("deleteCurrentWishlistItem notification trigger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChains();
  });

  it("calls fanOutNotifications with item_deleted and null itemId after deletion", async () => {
    const result = await deleteCurrentWishlistItem("owner-1", "wl-1", "item-1");

    expect(result.status).toBe("success");
    await Promise.resolve();

    expect(mocks.fanOutNotifications).toHaveBeenCalledWith(
      ["reserver-1"],
      expect.objectContaining({
        type: "item_deleted",
        itemId: null,
        itemTitle: "Sneakers",
      }),
    );
  });

  it("does not notify if the item is not found before deletion", async () => {
    mocks.findWishlistItem.mockResolvedValue(null);

    const result = await deleteCurrentWishlistItem("owner-1", "wl-1", "item-1");

    expect(result.status).toBe("error");
    expect(mocks.fanOutNotifications).not.toHaveBeenCalled();
  });

  it("passes itemTitle snapshot even when no reservers exist", async () => {
    mocks.selectWhere.mockResolvedValue([]);

    const result = await deleteCurrentWishlistItem("owner-1", "wl-1", "item-1");

    expect(result.status).toBe("success");
    await Promise.resolve();

    expect(mocks.fanOutNotifications).toHaveBeenCalledWith(
      [],
      expect.objectContaining({ itemTitle: "Sneakers" }),
    );
  });
});
