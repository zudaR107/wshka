import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  dbUpdate: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    update: () => ({
      set: () => ({
        where: mocks.dbUpdate,
      }),
    }),
  },
}));

import { updateUserBio, updateUserShowReservations } from "../../src/modules/auth/server/update-bio";

describe("updateUserBio", () => {
  beforeEach(() => {
    mocks.dbUpdate.mockReset();
    mocks.dbUpdate.mockResolvedValue(undefined);
  });

  it("saves a valid bio after trimming whitespace", async () => {
    const result = await updateUserBio("user-1", "  Люблю книги  ", null);

    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });

  it("saves an empty string as null (clears the bio)", async () => {
    const result = await updateUserBio("user-1", "   ", "Старое описание");

    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });

  it("rejects a bio that exceeds 500 characters", async () => {
    const longBio = "а".repeat(501);

    const result = await updateUserBio("user-1", longBio, null);

    expect(result).toEqual({ status: "error", code: "too-long" });
    expect(mocks.dbUpdate).not.toHaveBeenCalled();
  });

  it("accepts a bio of exactly 500 characters", async () => {
    const maxBio = "б".repeat(500);

    const result = await updateUserBio("user-1", maxBio, null);

    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });

  it("returns db-error when the database operation fails", async () => {
    mocks.dbUpdate.mockRejectedValue(new Error("DB down"));

    const result = await updateUserBio("user-1", "Обычное описание", null);

    expect(result).toEqual({ status: "error", code: "db-error" });
  });

  it("saves the record even when bio is unchanged", async () => {
    const result = await updateUserBio("user-1", "Старое описание", "Старое описание");

    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });
});

describe("updateUserShowReservations", () => {
  beforeEach(() => {
    mocks.dbUpdate.mockReset();
    mocks.dbUpdate.mockResolvedValue(undefined);
  });

  it("saves true successfully", async () => {
    const result = await updateUserShowReservations("user-1", true);
    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });

  it("saves false successfully", async () => {
    const result = await updateUserShowReservations("user-1", false);
    expect(result).toEqual({ status: "success" });
    expect(mocks.dbUpdate).toHaveBeenCalledOnce();
  });

  it("returns db-error when the database operation fails", async () => {
    mocks.dbUpdate.mockRejectedValue(new Error("DB down"));

    const result = await updateUserShowReservations("user-1", true);
    expect(result).toEqual({ status: "error", code: "db-error" });
  });
});
