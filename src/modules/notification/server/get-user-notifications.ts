import { desc, eq } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";
import type { NotificationType } from "@/modules/notification/db/schema";

export type UserNotification = {
  id: string;
  type: NotificationType;
  itemId: string | null;
  itemTitle: string;
  wishlistId: string | null;
  /** Snapshot of the share token at notification creation time. */
  shareToken: string | null;
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
      shareToken: notifications.shareToken,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return rows;
}
