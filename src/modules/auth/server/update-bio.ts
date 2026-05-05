import { and, eq, isNull, ne } from "drizzle-orm";
import { users } from "@/modules/auth/db/schema";

const BIO_MAX_LENGTH = 500;

export type UpdateBioResult =
  | { status: "success" }
  | { status: "error"; code: "too-long" | "db-error" };

export async function updateUserBio(
  userId: string,
  rawBio: string,
): Promise<UpdateBioResult> {
  const bio = rawBio.trim() || null;

  if (bio !== null && bio.length > BIO_MAX_LENGTH) {
    return { status: "error", code: "too-long" };
  }

  try {
    const { db } = await import("@/shared/db");

    await db
      .update(users)
      .set({ bio, updatedAt: new Date() })
      .where(eq(users.id, userId));

    void notifyBioReservers(userId);
    return { status: "success" };
  } catch {
    return { status: "error", code: "db-error" };
  }
}

/**
 * Best-effort: notify all users with active reservations on the owner's
 * wishlists that the owner updated their profile ("About me").
 */
async function notifyBioReservers(ownerId: string): Promise<void> {
  try {
    const { db } = await import("@/shared/db");

    const owner = await db.query.users.findFirst({
      columns: { email: true },
      where: eq(users.id, ownerId),
    });
    if (!owner) return;

    const { reservations } = await import("@/modules/reservation/db/schema");
    const { wishlistItems, wishlists } = await import("@/modules/wishlist/db/schema");

    const rows = await db
      .select({ userId: reservations.userId, wishlistId: wishlists.id })
      .from(reservations)
      .innerJoin(wishlistItems, eq(reservations.wishlistItemId, wishlistItems.id))
      .innerJoin(wishlists, eq(wishlistItems.wishlistId, wishlists.id))
      .where(
        and(
          eq(wishlists.userId, ownerId),
          isNull(reservations.cancelledAt),
          ne(reservations.userId, ownerId),
        ),
      );

    if (rows.length === 0) return;

    // Deduplicate: one notification per reserver, keeping first wishlistId seen.
    const byUser = new Map<string, string>();
    for (const r of rows) {
      if (!byUser.has(r.userId)) byUser.set(r.userId, r.wishlistId);
    }

    const { shareLinks } = await import("@/modules/share/db/schema");
    const { createNotification } = await import(
      "@/modules/notification/server/create-notification"
    );

    // Cache share token lookups per wishlistId (multiple reservers may share one wishlist).
    const tokenCache = new Map<string, string | null>();

    for (const [userId, wishlistId] of byUser) {
      if (!tokenCache.has(wishlistId)) {
        const link = await db.query.shareLinks.findFirst({
          columns: { token: true },
          where: and(eq(shareLinks.wishlistId, wishlistId), eq(shareLinks.isActive, true)),
        });
        tokenCache.set(wishlistId, link?.token ?? null);
      }
      await createNotification({
        userId,
        type: "owner_updated",
        itemId: null,
        itemTitle: owner.email,
        wishlistId,
        shareToken: tokenCache.get(wishlistId) ?? null,
      });
    }
  } catch {
    // Notifications are best-effort; do not block the main operation.
  }
}

export type UpdatePreferredCurrencyResult =
  | { status: "success" }
  | { status: "error"; code: "db-error" };

export async function updateUserPreferredCurrency(
  userId: string,
  currency: string,
): Promise<UpdatePreferredCurrencyResult> {
  try {
    const { db } = await import("@/shared/db");

    await db
      .update(users)
      .set({ preferredCurrency: currency, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return { status: "success" };
  } catch {
    return { status: "error", code: "db-error" };
  }
}

export async function getUserProfile(
  userId: string,
): Promise<{ id: string; email: string; bio: string | null; preferredCurrency: string } | null> {
  const { db } = await import("@/shared/db");

  const user = await db.query.users.findFirst({
    columns: { id: true, email: true, bio: true, preferredCurrency: true },
    where: eq(users.id, userId),
  });

  return user ?? null;
}
