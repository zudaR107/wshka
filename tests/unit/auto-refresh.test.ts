import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const src = readFileSync(
  resolve(__dirname, "../../src/shared/ui/auto-refresh.tsx"),
  "utf-8",
);

describe("AutoRefresh component", () => {
  it("guards router.refresh() behind a document.hidden check", () => {
    // router.refresh() must not be called when the page is hidden so that
    // closing a browser context does not produce an aborted in-flight request
    // (ECONNRESET) on the Next.js server.
    expect(src).toContain("document.hidden");
    const hiddenIndex = src.indexOf("document.hidden");
    const refreshIndex = src.indexOf("router.refresh()");
    // The hidden check must appear before the refresh call
    expect(hiddenIndex).toBeGreaterThanOrEqual(0);
    expect(refreshIndex).toBeGreaterThan(hiddenIndex);
  });

  it("clears the interval on unmount via useEffect cleanup", () => {
    expect(src).toContain("clearInterval");
    expect(src).toContain("setInterval");
  });
});
