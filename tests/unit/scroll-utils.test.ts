import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollAndHighlight } from "../../src/app/_dashboard/scroll-utils";

/** Minimal HTMLElement-like stub that works in Node (no jsdom required). */
function makeEl() {
  const classes = new Set<string>();
  const el = {
    scrollIntoView: vi.fn(),
    offsetWidth: 0, // read by void el.offsetWidth — triggers reflow in browser, no-op here
    classList: {
      add: (cls: string) => classes.add(cls),
      remove: (cls: string) => classes.delete(cls),
      contains: (cls: string) => classes.has(cls),
    },
  } as unknown as HTMLElement;
  return el;
}

describe("scrollAndHighlight", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("scrolls the element to center of viewport", () => {
    const el = makeEl();
    scrollAndHighlight(el);
    expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
  });

  it("adds item-card--highlight class immediately", () => {
    const el = makeEl();
    scrollAndHighlight(el);
    expect(el.classList.contains("item-card--highlight")).toBe(true);
  });

  it("removes item-card--highlight class after 1800 ms", () => {
    const el = makeEl();
    scrollAndHighlight(el);
    expect(el.classList.contains("item-card--highlight")).toBe(true);
    vi.advanceTimersByTime(1800);
    expect(el.classList.contains("item-card--highlight")).toBe(false);
  });

  it("returned cleanup cancels the timer so class stays until unmount", () => {
    const el = makeEl();
    const cleanup = scrollAndHighlight(el);
    cleanup();
    vi.advanceTimersByTime(1800);
    // Timer was cancelled — class remains (would be removed by unmount anyway)
    expect(el.classList.contains("item-card--highlight")).toBe(true);
  });

  it("resets in-progress animation when called again on the same element", () => {
    const el = makeEl();
    scrollAndHighlight(el);
    vi.advanceTimersByTime(500);
    // Call again before first timer fires
    scrollAndHighlight(el);
    expect(el.classList.contains("item-card--highlight")).toBe(true);
    // Second timer fires after another 1800 ms
    vi.advanceTimersByTime(1800);
    expect(el.classList.contains("item-card--highlight")).toBe(false);
  });
});
