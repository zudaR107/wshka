import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  // bio save
  dbUpdate: vi.fn(),
  // notifyBioReservers
  findUser: vi.fn(),
  selectReservers: vi.fn(),
  selectFrom: vi.fn(),
  selectInnerJoin1: vi.fn(),
  selectInnerJoin2: vi.fn(),
  selectWhere: vi.fn(),
  findShareLink: vi.fn(),
  createNotification: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    update: () => ({ set: () => ({ where: mocks.dbUpdate }) }),
    query: {
      users: { findFirst: mocks.findUser },
      shareLinks: { findFirst: mocks.findShareLink },
    },
    select: mocks.selectReservers,
  },
}));

vi.mock("../../src/modules/auth/db/schema", () => ({ users: {} }));
vi.mock("../../src/modules/reservation/db/schema", () => ({ reservations: {} }));
vi.mock("../../src/modules/wishlist/db/schema", () => ({ wishlistItems: {}, wishlists: {} }));
vi.mock("../../src/modules/share/db/schema", () => ({ shareLinks: {} }));
vi.mock("../../src/modules/notification/server/create-notification", () => ({
  createNotification: mocks.createNotification,
}));

import { updateUserBio } from "../../src/modules/auth/server/update-bio";

const OWNER = { email: "owner@example.com" };
const flushAsync = () => new Promise<void>((resolve) => setImmediate(resolve));

function setupChains(
  reserverRows: Array<{ userId: string; wishlistId: string }> = [
    { userId: "reserver-1", wishlistId: "wl-1" },
  ],
) {
  mocks.dbUpdate.mockResolvedValue(undefined);
  mocks.findUser.mockResolvedValue(OWNER);

  // db.select().from().innerJoin().innerJoin().where()
  mocks.selectReservers.mockReturnValue({ from: mocks.selectFrom });
  mocks.selectFrom.mockReturnValue({ innerJoin: mocks.selectInnerJoin1 });
  mocks.selectInnerJoin1.mockReturnValue({ innerJoin: mocks.selectInnerJoin2 });
  mocks.selectInnerJoin2.mockReturnValue({ where: mocks.selectWhere });
  mocks.selectWhere.mockResolvedValue(reserverRows);

  mocks.findShareLink.mockResolvedValue({ token: "share-token-1" });
  mocks.createNotification.mockResolvedValue(undefined);
}

describe("updateUserBio owner_updated notification trigger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupChains();
  });

  it("triggers an owner_updated notification for an active reserver", async () => {
    const result = await updateUserBio("owner-1", "Новое описание");

    expect(result).toEqual({ status: "success" });
    await flushAsync();

    expect(mocks.createNotification).toHaveBeenCalledOnce();
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "reserver-1",
        type: "owner_updated",
        itemId: null,
        itemTitle: OWNER.email,
        wishlistId: "wl-1",
        shareToken: "share-token-1",
      }),
    );
  });

  it("deduplicates: sends one notification per unique reserver", async () => {
    setupChains([
      { userId: "reserver-1", wishlistId: "wl-1" },
      { userId: "reserver-1", wishlistId: "wl-2" }, // same user, different wishlist
      { userId: "reserver-2", wishlistId: "wl-1" },
    ]);

    await updateUserBio("owner-1", "Bio");
    await flushAsync();

    expect(mocks.createNotification).toHaveBeenCalledTimes(2);
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "reserver-1", wishlistId: "wl-1" }),
    );
    expect(mocks.createNotification).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "reserver-2", wishlistId: "wl-1" }),
    );
  });

  it("skips notification when no active reservers exist", async () => {
    setupChains([]);

    await updateUserBio("owner-1", "Bio");
    await flushAsync();

    expect(mocks.createNotification).not.toHaveBeenCalled();
  });

  it("caches share token lookup: one DB call per unique wishlist", async () => {
    setupChains([
      { userId: "reserver-1", wishlistId: "wl-1" },
      { userId: "reserver-2", wishlistId: "wl-1" }, // same wishlist
    ]);

    await updateUserBio("owner-1", "Bio");
    await flushAsync();

    expect(mocks.findShareLink).toHaveBeenCalledTimes(1);
    expect(mocks.createNotification).toHaveBeenCalledTimes(2);
  });

  it("does not block bio save when notification fails", async () => {
    mocks.findUser.mockRejectedValue(new Error("DB error"));

    const result = await updateUserBio("owner-1", "Bio");

    expect(result).toEqual({ status: "success" });
  });
});
