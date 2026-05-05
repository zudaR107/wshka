"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";

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
