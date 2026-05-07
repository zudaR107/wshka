import { NextResponse } from "next/server";
import { getCurrentUser } from "@/modules/auth/server/current-user";
import { getUnreadNotificationCount } from "@/modules/notification/server/get-unread-count";
import { getUserNotifications } from "@/modules/notification/server/get-user-notifications";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ unreadCount: 0, recent: [] });
  }

  const [unreadCount, notifications] = await Promise.all([
    getUnreadNotificationCount(user.id),
    getUserNotifications(user.id),
  ]);

  const recent = notifications
    .filter((n) => !n.readAt)
    .slice(0, 5)
    .map((n) => ({
      id: n.id,
      type: n.type,
      itemId: n.itemId,
      itemTitle: n.itemTitle,
      wishlistId: n.wishlistId,
      readAt: null,
      createdAt: n.createdAt.toISOString(),
    }));

  return NextResponse.json({ unreadCount, recent });
}
