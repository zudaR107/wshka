/**
 * Scrolls an item card element to the center of the viewport and briefly
 * applies the `item-card--highlight` pulse animation.
 *
 * Resets any in-progress animation before re-triggering so calling this
 * on an already-highlighted element works correctly.
 *
 * Returns a cleanup function that cancels the pending class-removal timer.
 * Call it if the element unmounts before the animation finishes.
 */
export function scrollAndHighlight(el: HTMLElement): () => void {
  el.scrollIntoView({ behavior: "smooth", block: "center" });

  // Reset any in-progress animation before re-triggering.
  el.classList.remove("item-card--highlight");
  // Force reflow so removing + adding the class restarts the animation.
  void el.offsetWidth;
  el.classList.add("item-card--highlight");

  const timer = setTimeout(() => el.classList.remove("item-card--highlight"), 1800);
  return () => clearTimeout(timer);
}
