import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  select: vi.fn(),
  selectFrom: vi.fn(),
  selectWhere: vi.fn(),
  selectOrderBy: vi.fn(),
  update: vi.fn(),
  updateSet: vi.fn(),
  updateWhere: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    select: mocks.select,
    update: mocks.update,
  },
}));

vi.mock("../../src/modules/notification/db/schema", () => ({
  notifications: {},
}));

import { getUserNotifications } from "../../src/modules/notification/server/get-user-notifications";
import { getUnreadNotificationCount } from "../../src/modules/notification/server/get-unread-count";
import {
  markAllNotificationsRead,
  markNotificationsRead,
} from "../../src/modules/notification/server/mark-notifications-read";

describe("getUserNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    const row = {
      id: "n-1",
      type: "item_updated",
      itemId: "item-1",
      itemTitle: "Sneakers",
      wishlistId: "wl-1",
      readAt: null,
      createdAt: new Date("2026-01-01"),
    };
    // chain: select → from → where → orderBy → resolves
    mocks.select.mockReturnValue({ from: mocks.selectFrom });
    mocks.selectFrom.mockReturnValue({ where: mocks.selectWhere });
    mocks.selectWhere.mockReturnValue({ orderBy: mocks.selectOrderBy });
    mocks.selectOrderBy.mockResolvedValue([row]);
  });

  it("returns rows in the shape of UserNotification", async () => {
    const result = await getUserNotifications("user-1");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "n-1",
      type: "item_updated",
      itemTitle: "Sneakers",
    });
  });
});

describe("getUnreadNotificationCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // chain: select → from → where → resolves (no orderBy)
    mocks.select.mockReturnValue({ from: mocks.selectFrom });
    mocks.selectFrom.mockReturnValue({ where: mocks.selectWhere });
    mocks.selectWhere.mockResolvedValue([{ value: 3 }]);
  });

  it("returns the count of unread notifications", async () => {
    const count = await getUnreadNotificationCount("user-1");
    expect(count).toBe(3);
  });

  it("returns 0 when the query returns no rows", async () => {
    mocks.selectWhere.mockResolvedValue([]);
    const count = await getUnreadNotificationCount("user-1");
    expect(count).toBe(0);
  });
});

describe("markAllNotificationsRead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.update.mockReturnValue({ set: mocks.updateSet });
    mocks.updateSet.mockReturnValue({ where: mocks.updateWhere });
    mocks.updateWhere.mockResolvedValue([]);
  });

  it("calls update with the userId and sets readAt", async () => {
    await markAllNotificationsRead("user-1");
    expect(mocks.update).toHaveBeenCalledOnce();
    expect(mocks.updateSet).toHaveBeenCalledWith(
      expect.objectContaining({ readAt: expect.any(Date) }),
    );
  });
});

describe("markNotificationsRead", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.update.mockReturnValue({ set: mocks.updateSet });
    mocks.updateSet.mockReturnValue({ where: mocks.updateWhere });
    mocks.updateWhere.mockResolvedValue([]);
  });

  it("does nothing when notificationIds is empty", async () => {
    await markNotificationsRead("user-1", []);
    expect(mocks.update).not.toHaveBeenCalled();
  });

  it("calls update when ids are provided", async () => {
    await markNotificationsRead("user-1", ["n-1", "n-2"]);
    expect(mocks.update).toHaveBeenCalledOnce();
  });
});
