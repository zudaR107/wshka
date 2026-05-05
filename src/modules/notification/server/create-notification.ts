import { notifications } from "@/modules/notification/db/schema";
import type { NotificationType } from "@/modules/notification/db/schema";

export type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  itemId: string | null;
  itemTitle: string;
  /** null for profile-level events (owner_updated) */
  wishlistId: string | null;
};

/**
 * Internal helper — fan-out one notification per reserver.
 * Never throws; silently swallows DB errors so callers are not interrupted.
 */
export async function createNotification(input: CreateNotificationInput): Promise<void> {
  try {
    const db = await getDb();

    await db.insert(notifications).values({
      userId: input.userId,
      type: input.type,
      itemId: input.itemId,
      itemTitle: input.itemTitle,
      wishlistId: input.wishlistId,
    });
  } catch {
    // Notifications are best-effort; do not block the main operation.
  }
}

async function getDb() {
  const { db } = await import("@/shared/db");
  return db;
}

/**
 * Fan-out notifications to multiple users sequentially (best-effort).
 * Sequential to keep test behavior deterministic; item reservers are
 * at most one per item in practice.
 */
export async function fanOutNotifications(
  userIds: string[],
  base: Omit<CreateNotificationInput, "userId">,
): Promise<void> {
  for (const userId of userIds) {
    await createNotification({ ...base, userId });
  }
}
