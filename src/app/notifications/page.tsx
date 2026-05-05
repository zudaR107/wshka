import type { Metadata } from "next";
import Link from "next/link";
import { requireCurrentUser } from "@/modules/auth/server/current-user";
import { getTranslations } from "@/modules/i18n";
import { getLocale } from "@/modules/i18n/server";
import { getUserNotifications } from "@/modules/notification/server/get-user-notifications";
import { markAllNotificationsRead } from "@/modules/notification/server/mark-notifications-read";
import { NotificationList } from "@/app/notifications/notification-list";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const m = getTranslations("app", locale);
  return {
    title: m.notifications.title,
    robots: { index: false },
  };
}

export default async function NotificationsPage() {
  const [user, locale] = await Promise.all([requireCurrentUser(), getLocale()]);

  // Fetch notifications first so we know which were unread,
  // then mark all as read in the DB (badge clears on next nav).
  const notifications = await getUserNotifications(user.id);
  void markAllNotificationsRead(user.id);

  const common = getTranslations("common", locale);
  const messages = getTranslations("app", locale);

  return (
    <div className="content-page">
      <div className="content-page-header">
        <p className="page-brand-label">{common.brand}</p>
        <h1 className="content-page-title">{messages.notifications.title}</h1>
        <p className="content-page-description">{messages.notifications.description}</p>
      </div>

      <NotificationList
        userId={user.id}
        initialNotifications={notifications}
        locale={locale}
        messages={{
          itemUpdated: messages.notifications.itemUpdated,
          itemDeleted: messages.notifications.itemDeleted,
          reservationCreated: messages.notifications.reservationCreated,
          reservationCancelled: messages.notifications.reservationCancelled,
          ownerUpdated: messages.notifications.ownerUpdated,
          goToWishlist: messages.notifications.goToWishlist,
          goToItem: messages.notifications.goToItem,
          deleteLabel: messages.notifications.deleteLabel,
          clearAll: messages.notifications.clearAll,
          emptyTitle: messages.notifications.emptyTitle,
          emptyDescription: messages.notifications.emptyDescription,
        }}
        emptyAction={
          <Link href="/" className="ui-button ui-button-secondary">
            {messages.notifications.goToWishlist}
          </Link>
        }
      />
    </div>
  );
}
