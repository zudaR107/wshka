import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const notificationsCSS = readFileSync(
  resolve(__dirname, "../../src/app/styles/notifications.css"),
  "utf-8",
);

const notificationListSrc = readFileSync(
  resolve(__dirname, "../../src/app/notifications/notification-list.tsx"),
  "utf-8",
);

describe("notifications page", () => {
  describe("notifications.css — mobile layout", () => {
    it("declares .notification-item base styles", () => {
      expect(notificationsCSS).toContain(".notification-item {");
    });

    it("keeps row layout on mobile (flex-direction not overridden)", () => {
      // Buttons stay inline with the text body — no column switch on mobile
      const mobileBlock = notificationsCSS.slice(
        notificationsCSS.indexOf("max-width: 479px"),
      );
      expect(mobileBlock).not.toContain("flex-direction: column");
    });

    it("uses max-width: 479px breakpoint for mobile override", () => {
      expect(notificationsCSS).toContain("max-width: 479px");
    });

    it("allows item name to wrap on mobile", () => {
      expect(notificationsCSS).toContain("white-space: normal");
    });

    it("matches nav button height to delete button on mobile (space-3 space-5)", () => {
      // .ui-button uses padding: var(--space-3) var(--space-5); nav btn must match
      const mobileBlock = notificationsCSS.slice(
        notificationsCSS.indexOf("max-width: 479px"),
      );
      expect(mobileBlock).toContain("var(--space-3) var(--space-5)");
    });
  });

  describe("notifications.css — nav button", () => {
    it("declares .notification-nav-btn class", () => {
      expect(notificationsCSS).toContain(".notification-nav-btn");
    });

    it("hides .notification-nav-btn-label on mobile", () => {
      expect(notificationsCSS).toContain(".notification-nav-btn-label");
      expect(notificationsCSS).toContain("display: none");
    });

    it("does not define .ui-button-ghost (removed as unused)", () => {
      expect(notificationsCSS).not.toContain(".ui-button-ghost");
    });
  });

  describe("notification-list.tsx — nav button markup", () => {
    it("renders ExternalLinkIcon in the nav link", () => {
      expect(notificationListSrc).toContain("ExternalLinkIcon");
    });

    it("uses notification-nav-btn class (not ui-button-ghost)", () => {
      expect(notificationListSrc).toContain("notification-nav-btn");
      expect(notificationListSrc).not.toContain("ui-button-ghost");
    });

    it("wraps label text in notification-nav-btn-label span", () => {
      expect(notificationListSrc).toContain("notification-nav-btn-label");
    });

    it("sets aria-label on nav links for accessibility", () => {
      expect(notificationListSrc).toContain('aria-label={messages.goToWishlist}');
      expect(notificationListSrc).toContain('aria-label={messages.goToItem}');
    });
  });
});
