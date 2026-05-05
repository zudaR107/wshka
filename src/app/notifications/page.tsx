import type { Metadata } from "next";
import Link from "next/link";
import { requireCurrentUser } from "@/modules/auth/server/current-user";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";
import { getUserNotifications } from "@/modules/notification/server/get-user-notifications";
import { markAllNotificationsRead } from "@/modules/notification/server/mark-notifications-read";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getTranslations("app", locale);
  return {
    title: m.notifications.title,
    robots: { index: false },
  };
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

export default async function NotificationsPage() {
  const [user, locale] = await Promise.all([requireCurrentUser(), getLocale()]);

  const [notifications] = await Promise.all([
    getUserNotifications(user.id),
    markAllNotificationsRead(user.id),
  ]);

  const common = getTranslations("common", locale);
  const messages = getTranslations("app", locale);

  return (
    <div className="content-page">
      <div className="content-page-header">
        <p className="page-brand-label">{common.brand}</p>
        <h1 className="content-page-title">{messages.notifications.title}</h1>
        <p className="content-page-description">{messages.notifications.description}</p>
      </div>

      {notifications.length === 0 ? (
        <div className="dashboard-empty" data-testid="notifications-empty-state">
          <p className="dashboard-empty-title">{messages.notifications.emptyTitle}</p>
          <p className="dashboard-empty-description">{messages.notifications.emptyDescription}</p>
          <Link href="/" className="ui-button ui-button-secondary">
            {messages.notifications.goToWishlist}
          </Link>
        </div>
      ) : (
        <section>
          <ul className="notification-list" data-testid="notification-list">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={`notification-item${n.readAt ? "" : " notification-item--was-unread"}`}
                data-testid="notification-item"
              >
                <span className="notification-item-icon" aria-hidden="true">
                  {n.type === "item_updated" ? "✏️" : "🗑️"}
                </span>
                <div className="notification-item-body">
                  <span className="notification-item-type">
                    {n.type === "item_updated"
                      ? messages.notifications.itemUpdated
                      : messages.notifications.itemDeleted}
                  </span>
                  <span className="notification-item-name">{n.itemTitle}</span>
                  <span className="notification-item-date">
                    {formatDate(n.createdAt, locale)}
                  </span>
                </div>
                {n.itemId ? (
                  <Link
                    href="/reservations"
                    className="notification-item-link ui-button ui-button-ghost"
                  >
                    {messages.notifications.goToWishlist}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
