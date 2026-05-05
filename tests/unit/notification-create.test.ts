import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  insertValues: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    insert: mocks.insert,
  },
}));

// notifications table is a static import in create-notification.ts;
// mock returns a plain object — mocks.insert accepts any argument.
vi.mock("../../src/modules/notification/db/schema", () => ({
  notifications: {},
  NOTIFICATION_TYPES: ["item_updated", "item_deleted"],
}));

import {
  createNotification,
  fanOutNotifications,
} from "../../src/modules/notification/server/create-notification";

const BASE = {
  type: "item_updated" as const,
  itemId: "item-uuid",
  itemTitle: "Cool Sneakers",
  wishlistId: "wishlist-uuid",
};

function setup() {
  mocks.insert.mockReturnValue({ values: mocks.insertValues });
  mocks.insertValues.mockResolvedValue([]);
}

describe("createNotification", () => {
  beforeEach(() => {
    mocks.insert.mockReset();
    mocks.insertValues.mockReset();
    setup();
  });

  it("inserts a notification row for the given user", async () => {
    await createNotification({ userId: "user-1", ...BASE });

    expect(mocks.insert).toHaveBeenCalledOnce();
    expect(mocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "user-1",
        type: "item_updated",
        itemId: "item-uuid",
        itemTitle: "Cool Sneakers",
        wishlistId: "wishlist-uuid",
      }),
    );
  });

  it("does not throw when the DB call fails (best-effort)", async () => {
    mocks.insertValues.mockRejectedValue(new Error("DB error"));

    await expect(createNotification({ userId: "user-1", ...BASE })).resolves.toBeUndefined();
  });

  it("accepts null itemId for deleted items", async () => {
    await createNotification({ userId: "user-1", ...BASE, type: "item_deleted", itemId: null });

    expect(mocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: null, type: "item_deleted" }),
    );
  });
});

describe("fanOutNotifications", () => {
  beforeEach(() => {
    mocks.insert.mockReset();
    mocks.insertValues.mockReset();
    setup();
  });

  it("does nothing when userIds is empty", async () => {
    await fanOutNotifications([], BASE);
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("inserts one row per user", async () => {
    await fanOutNotifications(["user-1", "user-2"], BASE);

    expect(mocks.insertValues).toHaveBeenCalledTimes(2);
    expect(mocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1" }),
    );
    expect(mocks.insertValues).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-2" }),
    );
  });

  it("resolves even when one insert rejects", async () => {
    mocks.insertValues
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce([]);

    await expect(fanOutNotifications(["user-1", "user-2"], BASE)).resolves.toBeUndefined();
  });
});
