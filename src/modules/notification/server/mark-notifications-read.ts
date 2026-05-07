"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";

/** Delete a single notification (only if it belongs to userId). */
export async function deleteNotification(userId: string, notificationId: string): Promise<void> {
  const { db } = await import("@/shared/db");

  await db
    .delete(notifications)
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
}

/** Delete all notifications for a user. */
export async function deleteAllNotifications(userId: string): Promise<void> {
  const { db } = await import("@/shared/db");

  await db.delete(notifications).where(eq(notifications.userId, userId));
}

/** Mark all unread notifications for a user as read. */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const { db } = await import("@/shared/db");

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
}

/** Mark specific notifications as read (for dropdown click). */
export async function markNotificationsRead(
  userId: string,
  notificationIds: string[],
): Promise<void> {
  if (notificationIds.length === 0) return;

  const { db } = await import("@/shared/db");

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(
      and(
        eq(notifications.userId, userId),
        inArray(notifications.id, notificationIds),
        isNull(notifications.readAt),
      ),
    );
}
