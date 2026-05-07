import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const src = readFileSync(
  resolve(__dirname, "../../src/shared/ui/price-input.tsx"),
  "utf-8",
);
const css = readFileSync(
  resolve(__dirname, "../../src/app/styles/ui.css"),
  "utf-8",
);

describe("PriceInput component", () => {
  it("wraps input and hint in a div instead of a React fragment", () => {
    expect(src).toContain('className="price-input-wrapper"');
    // Fragment shorthand should not be the root return anymore
    expect(src).not.toMatch(/return\s*\(\s*<>/);
  });

  it("does not use --color-status-reserved for hint text", () => {
    expect(src).not.toContain("color-status-reserved");
  });

  it("hint paragraphs use ui-note ui-note-error classes without inline color override", () => {
    expect(src).toContain('className="ui-note ui-note-error"');
    // Must not carry a style prop with color
    const pMatches = src.match(/<p className="ui-note[^"]*"[^>]*>/g) ?? [];
    for (const tag of pMatches) {
      expect(tag).not.toContain("style=");
    }
  });
});

describe("price-input-wrapper CSS", () => {
  it("defines .price-input-wrapper with flex column layout", () => {
    expect(css).toContain(".price-input-wrapper");
    expect(css).toContain("flex-direction: column");
  });

  it("ensures the wrapper grows in its flex container", () => {
    expect(css).toContain("flex: 1");
  });
});
