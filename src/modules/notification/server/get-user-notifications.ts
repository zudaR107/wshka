import { desc, eq } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";
import type { NotificationType } from "@/modules/notification/db/schema";

export type UserNotification = {
  id: string;
  type: NotificationType;
  itemId: string | null;
  itemTitle: string;
  wishlistId: string;
  readAt: Date | null;
  createdAt: Date;
};

export async function getUserNotifications(userId: string): Promise<UserNotification[]> {
  const { db } = await import("@/shared/db");

  const rows = await db
    .select({
      id: notifications.id,
      type: notifications.type,
      itemId: notifications.itemId,
      itemTitle: notifications.itemTitle,
      wishlistId: notifications.wishlistId,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return rows;
}
