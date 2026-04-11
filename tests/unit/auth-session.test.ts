import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  insert: vi.fn(),
  insertValues: vi.fn(),
  deleteSession: vi.fn(),
  deleteWhere: vi.fn(),
  randomBytes: vi.fn(),
}));

vi.mock("node:crypto", () => ({
  randomBytes: mocks.randomBytes,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    set: mocks.cookieSet,
  })),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    insert: mocks.insert,
    delete: mocks.deleteSession,
  },
}));

import {
  AUTH_SESSION_COOKIE_NAME,
  clearSessionCookie,
  createSession,
  deleteSession,
  setSessionCookie,
} from "../../src/modules/auth/server/session";

describe("auth session helpers", () => {
  beforeEach(() => {
    vi.useRealTimers();
    mocks.cookieSet.mockReset();
    mocks.insert.mockReset();
    mocks.insertValues.mockReset();
    mocks.deleteSession.mockReset();
    mocks.deleteWhere.mockReset();
    mocks.randomBytes.mockReset();

    mocks.insert.mockReturnValue({
      values: mocks.insertValues,
    });
    mocks.deleteSession.mockReturnValue({
      where: mocks.deleteWhere,
    });
    mocks.randomBytes.mockReturnValue(Buffer.alloc(32, 1));
  });

  it("creates a persistent server-side session record", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-11T00:00:00.000Z"));
    mocks.insertValues.mockResolvedValue(undefined);

    const result = await createSession("user-1");

    expect(result.sessionToken).toBeTypeOf("string");
    expect(result.expiresAt).toEqual(new Date("2026-05-11T00:00:00.000Z"));
    expect(mocks.insertValues).toHaveBeenCalledWith({
      userId: "user-1",
      sessionToken: result.sessionToken,
      expiresAt: new Date("2026-05-11T00:00:00.000Z"),
    });
  });

  it("deletes a session by token", async () => {
    mocks.deleteWhere.mockResolvedValue(undefined);

    await expect(deleteSession("session-token")).resolves.toBeUndefined();
    expect(mocks.deleteWhere).toHaveBeenCalled();
  });

  it("sets the auth cookie for a valid session", async () => {
    const expiresAt = new Date("2026-05-01T00:00:00.000Z");

    await expect(setSessionCookie("session-token", expiresAt)).resolves.toBeUndefined();
    expect(mocks.cookieSet).toHaveBeenCalledWith(AUTH_SESSION_COOKIE_NAME, "session-token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expires: expiresAt,
    });
  });

  it("clears the auth cookie on logout", async () => {
    await expect(clearSessionCookie()).resolves.toBeUndefined();
    expect(mocks.cookieSet).toHaveBeenCalledWith(AUTH_SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expires: new Date(0),
    });
  });
});
