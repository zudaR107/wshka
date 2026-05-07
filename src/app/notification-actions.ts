"use server";

import { revalidatePath } from "next/cache";

export async function markAllReadAction() {
  const [{ getCurrentUser }, { markAllNotificationsRead }] = await Promise.all([
    import("@/modules/auth/server/current-user"),
    import("@/modules/notification/server/mark-notifications-read"),
  ]);

  const user = await getCurrentUser();

  if (!user) return;

  await markAllNotificationsRead(user.id);
  revalidatePath("/", "layout");
}
