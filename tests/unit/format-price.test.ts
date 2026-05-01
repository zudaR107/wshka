import { describe, expect, it } from "vitest";
import { formatPrice } from "../../src/app/format-price";

describe("formatPrice", () => {
  it("formats a four-digit price with non-breaking space thousands separator", () => {
    expect(formatPrice("1990")).toBe("1\u00a0990\u00a0₽");
  });

  it("formats a seven-digit price with two non-breaking space separators", () => {
    expect(formatPrice("1000000")).toBe("1\u00a0000\u00a0000\u00a0₽");
  });

  it("formats a three-digit price without a thousands separator", () => {
    expect(formatPrice("990")).toBe("990\u00a0₽");
  });

  it("formats zero price", () => {
    expect(formatPrice("0")).toBe("0\u00a0₽");
  });

  it("rounds a decimal price up when the fraction is >= 0.5", () => {
    expect(formatPrice("9.7")).toBe("10\u00a0₽");
  });

  it("rounds a decimal price down when the fraction is < 0.5", () => {
    expect(formatPrice("9.2")).toBe("9\u00a0₽");
  });

  it("formats a large price stored as a string from the database", () => {
    expect(formatPrice("9990")).toBe("9\u00a0990\u00a0₽");
  });

  it("uses the provided currency symbol instead of the default", () => {
    expect(formatPrice("1990", "$")).toBe("1\u00a0990\u00a0$");
    expect(formatPrice("500", "€")).toBe("500\u00a0€");
  });
});
