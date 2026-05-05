import { and, count, eq, isNull } from "drizzle-orm";
import { notifications } from "@/modules/notification/db/schema";

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  const { db } = await import("@/shared/db");

  const [row] = await db
    .select({ value: count() })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

  return row?.value ?? 0;
}
