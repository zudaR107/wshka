"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { UserNotification } from "@/modules/notification/server/get-user-notifications";
import {
  deleteNotification,
  deleteAllNotifications,
} from "@/modules/notification/server/mark-notifications-read";

/* ── Icons (same style as wishlist items) ── */

function EditIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale === "en" ? "en-US" : "ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Messages = {
  itemUpdated: string;
  itemDeleted: string;
  goToWishlist: string;
  goToItem: string;
  deleteLabel: string;
  clearAll: string;
  emptyTitle: string;
  emptyDescription: string;
  reservationCreated: string;
  reservationCancelled: string;
};

type Props = {
  userId: string;
  initialNotifications: UserNotification[];
  messages: Messages;
  locale: string;
  emptyAction: React.ReactNode;
};

export function NotificationList({
  userId,
  initialNotifications,
  messages,
  locale,
  emptyAction,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initialNotifications);
  // Which items get the unread highlight animation on first render.
  // If sessionStorage has a "notif-highlight" id (set by the bell dropdown
  // before navigating), only that notification is animated; otherwise all
  // unread are animated (navigation via "All notifications").
  const [unreadIds] = useState(() => {
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("notif-highlight");
      if (id) {
        sessionStorage.removeItem("notif-highlight");
        return new Set([id]);
      }
    }
    return new Set(initialNotifications.filter((n) => !n.readAt).map((n) => n.id));
  });
  // After mount, animate unread → read
  const [allRead, setAllRead] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Small delay so the browser paints the blue state first,
    // making the fade-out visible to the user.
    const id = setTimeout(() => setAllRead(true), 80);
    return () => clearTimeout(id);
  }, []);

  function handleDelete(notificationId: string) {
    startTransition(async () => {
      await deleteNotification(userId, notificationId);
      setItems((prev) => prev.filter((n) => n.id !== notificationId));
      router.refresh();
    });
  }

  function handleClearAll() {
    startTransition(async () => {
      await deleteAllNotifications(userId);
      setItems([]);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <div className="dashboard-empty" data-testid="notifications-empty-state">
        <p className="dashboard-empty-title">{messages.emptyTitle}</p>
        <p className="dashboard-empty-description">{messages.emptyDescription}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <section>
      <div className="notification-list-header">
        <button
          type="button"
          className="ui-button ui-button-danger"
          onClick={handleClearAll}
        >
          {messages.clearAll}
        </button>
      </div>
      <ul className="notification-list" data-testid="notification-list">
        {items.map((n) => {
          const wasUnread = unreadIds.has(n.id);
          const isHighlighted = wasUnread && !allRead;
          return (
            <li
              key={n.id}
              className={`notification-item${isHighlighted ? " notification-item--unread" : ""}`}
              data-testid="notification-item"
            >
              <div className="notification-item-body">
                <span className="notification-item-type">
                  {n.type === "item_updated"
                    ? messages.itemUpdated
                    : n.type === "item_deleted"
                      ? messages.itemDeleted
                      : n.type === "reservation_created"
                        ? messages.reservationCreated
                        : messages.reservationCancelled}
                </span>
                <span className="notification-item-name">{n.itemTitle}</span>
                <span className="notification-item-date">
                  {formatDate(n.createdAt, locale)}
                </span>
              </div>
              <div className="notification-item-actions">
                {n.itemId && (n.type === "item_updated") ? (
                  <Link
                    href="/reservations"
                    className="notification-item-link ui-button ui-button-ghost"
                  >
                    {messages.goToWishlist}
                  </Link>
                ) : n.itemId && (n.type === "reservation_created" || n.type === "reservation_cancelled") ? (
                  <Link
                    href="/"
                    className="notification-item-link ui-button ui-button-ghost"
                    onClick={() => {
                      if (n.itemId) sessionStorage.setItem("scroll-to-item", n.itemId);
                    }}
                  >
                    {messages.goToItem}
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="ui-button ui-button-danger"
                  aria-label={messages.deleteLabel}
                  onClick={() => handleDelete(n.id)}
                >
                  <TrashIcon />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
