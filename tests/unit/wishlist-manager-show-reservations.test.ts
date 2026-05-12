import { readFileSync } from "fs";
import { resolve } from "path";
import { describe, it, expect } from "vitest";

const src = readFileSync(
  resolve(__dirname, "../../src/app/_dashboard/wishlist-manager.tsx"),
  "utf-8",
);

describe("WishlistManager showReservations prop", () => {
  it("declares showReservations in WishlistManagerProps", () => {
    expect(src).toContain("showReservations: boolean");
  });

  it("shows self-reservation strip unconditionally", () => {
    // isOwn check comes first, before showReservations
    expect(src).toContain("item.reservation.status === \"reserved\" && item.reservation.isOwn");
  });

  it("shows available and reserved strips only when showReservations is true", () => {
    expect(src).toContain("showReservations && item.reservation.status === \"reserved\"");
    expect(src).toContain("showReservations ? (");
  });

  it("renders null when showReservations is false and item is not self-reserved", () => {
    expect(src).toContain(": null}");
  });

  it("shows ReserveItemButton for hidden reservations", () => {
    expect(src).toContain("!item.reservation.isOwn && !showReservations");
  });

  it("self-reservations cancel button always present", () => {
    expect(src).toContain("item.reservation.isOwn ?");
  });
});
