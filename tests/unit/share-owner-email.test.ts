import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentSrc = readFileSync(
  resolve(__dirname, "../../src/app/share/[token]/owner-email.tsx"),
  "utf-8",
);
const shareCss = readFileSync(
  resolve(__dirname, "../../src/app/styles/share.css"),
  "utf-8",
);

describe("OwnerEmail component", () => {
  describe("source — client component", () => {
    it("is marked as a client component", () => {
      expect(componentSrc).toContain('"use client"');
    });
  });

  describe("source — email truncation", () => {
    it('splits the email at "@" to derive the displayed username', () => {
      expect(componentSrc).toContain('email.split("@")[0]');
    });
  });

  describe("source — accessibility", () => {
    it("exposes the full email as aria-label", () => {
      expect(componentSrc).toContain("aria-label={email}");
    });

    it('sets role="button" for keyboard and assistive technology users', () => {
      expect(componentSrc).toContain('role="button"');
    });

    it("handles Enter and Space key presses to toggle the tooltip", () => {
      expect(componentSrc).toContain('"Enter"');
      expect(componentSrc).toContain('" "');
    });
  });

  describe("source — tooltip interaction", () => {
    it("uses data-open attribute to drive CSS tooltip visibility", () => {
      expect(componentSrc).toContain("data-open={open}");
    });

    it("closes the tooltip when clicking outside the component", () => {
      expect(componentSrc).toContain("mousedown");
      expect(componentSrc).toContain("touchstart");
    });

    it("cancels outside-click listeners on cleanup", () => {
      expect(componentSrc).toContain("removeEventListener");
    });
  });

  describe("share.css — tooltip styles", () => {
    it("positions the tooltip absolutely relative to the email element", () => {
      expect(shareCss).toContain(".share-owner-email-tooltip");
      expect(shareCss).toContain("position: absolute");
    });

    it("hides the tooltip by default via opacity: 0", () => {
      const tooltipBlock = shareCss.match(
        /\.share-owner-email-tooltip\s*\{([^}]+)\}/,
      );
      expect(tooltipBlock).not.toBeNull();
      expect(tooltipBlock![1]).toContain("opacity: 0");
    });

    it("reveals the tooltip on hover", () => {
      expect(shareCss).toContain(
        ".share-page-owner-email:hover .share-owner-email-tooltip",
      );
    });

    it("reveals the tooltip when data-open is true", () => {
      expect(shareCss).toContain(
        '.share-page-owner-email[data-open="true"] .share-owner-email-tooltip',
      );
    });

    it("truncates the username text with ellipsis", () => {
      expect(shareCss).toContain(".share-page-owner-email-text");
      expect(shareCss).toContain("text-overflow: ellipsis");
    });
  });
});
