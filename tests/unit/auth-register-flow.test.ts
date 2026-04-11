import { beforeEach, describe, expect, it, vi } from "vitest";
import { DatabaseError } from "pg";

const mocks = vi.hoisted(() => ({
  findFirst: vi.fn(),
  insert: vi.fn(),
  insertValues: vi.fn(),
  hashPassword: vi.fn(),
}));

vi.mock("../../src/shared/db", () => ({
  db: {
    query: {
      users: {
        findFirst: mocks.findFirst,
      },
    },
    insert: mocks.insert,
  },
}));

vi.mock("../../src/modules/auth/server/password", () => ({
  hashPassword: mocks.hashPassword,
}));

import { registerUser } from "../../src/modules/auth/server/register";

describe("register user flow", () => {
  beforeEach(() => {
    mocks.findFirst.mockReset();
    mocks.insert.mockReset();
    mocks.insertValues.mockReset();
    mocks.hashPassword.mockReset();

    mocks.insert.mockReturnValue({
      values: mocks.insertValues,
    });
  });

  it("rejects invalid input before querying the database", async () => {
    await expect(registerUser({ email: "bad-email", password: "short" })).resolves.toEqual({
      status: "error",
      code: "invalid-email",
    });
    expect(mocks.findFirst).not.toHaveBeenCalled();
    expect(mocks.hashPassword).not.toHaveBeenCalled();
  });

  it("creates a user for valid new credentials", async () => {
    mocks.findFirst.mockResolvedValue(undefined);
    mocks.hashPassword.mockResolvedValue("hashed-password");
    mocks.insertValues.mockResolvedValue(undefined);

    await expect(
      registerUser({ email: " User@Example.com ", password: "password123" }),
    ).resolves.toEqual({ status: "success" });
    expect(mocks.hashPassword).toHaveBeenCalledWith("password123");
    expect(mocks.insertValues).toHaveBeenCalledWith({
      email: "user@example.com",
      passwordHash: "hashed-password",
    });
  });

  it("returns duplicate email when the user already exists", async () => {
    mocks.findFirst.mockResolvedValue({ id: "user-1" });

    await expect(
      registerUser({ email: "user@example.com", password: "password123" }),
    ).resolves.toEqual({
      status: "error",
      code: "email-taken",
    });
    expect(mocks.hashPassword).not.toHaveBeenCalled();
    expect(mocks.insert).not.toHaveBeenCalled();
  });

  it("maps unique email insert races to duplicate email", async () => {
    const error = new DatabaseError("duplicate key", 0, "error");
    error.code = "23505";

    mocks.findFirst.mockResolvedValue(undefined);
    mocks.hashPassword.mockResolvedValue("hashed-password");
    mocks.insertValues.mockRejectedValue(error);

    await expect(
      registerUser({ email: "user@example.com", password: "password123" }),
    ).resolves.toEqual({
      status: "error",
      code: "email-taken",
    });
  });
});
