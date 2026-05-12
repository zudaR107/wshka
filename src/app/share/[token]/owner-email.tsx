"use client";

import { useEffect, useRef, useState } from "react";

interface OwnerEmailProps {
  email: string;
}

/**
 * Displays the local part of an email address (before "@").
 *
 * Desktop: shows a styled tooltip with the full address on hover.
 * Mobile:  toggles the tooltip on tap; closes when tapping outside.
 */
export function OwnerEmail({ email }: OwnerEmailProps) {
  const username = email.split("@")[0];
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  return (
    <span
      ref={ref}
      className="share-page-owner-email"
      data-open={open}
      onClick={() => setOpen((v) => !v)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
      }}
      aria-label={email}
    >
      <span className="share-page-owner-email-text">{username}</span>
      <span className="share-owner-email-tooltip" role="tooltip">
        {email}
      </span>
    </span>
  );
}
