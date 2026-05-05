import { and, desc, eq } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";
import type { NotificationType } from "@/modules/notification/db/schema";
import { shareLinks } from "@/modules/share/db/schema";

export type UserNotification = {
  id: string;
  type: NotificationType;
  itemId: string | null;
  itemTitle: string;
  wishlistId: string | null;
  /** Active share token for the related wishlist, if available. */
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
      shareToken: shareLinks.token,
      readAt: notifications.readAt,
      createdAt: notifications.createdAt,
    })
    .from(notifications)
    .leftJoin(
      shareLinks,
      and(
        eq(shareLinks.wishlistId, notifications.wishlistId),
        eq(shareLinks.isActive, true),
      ),
    )
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));

  return rows;
}
