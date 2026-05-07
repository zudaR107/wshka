import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "@/modules/auth/db/schema";
import { wishlistItems } from "@/modules/wishlist/db/schema";
import { wishlists } from "@/modules/wishlist/db/schema";

export const NOTIFICATION_TYPES = [
  "item_updated",
  "item_deleted",
  "reservation_created",
  "reservation_cancelled",
  "owner_updated",
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 32 }).notNull().$type<NotificationType>(),
    /** null when item has been deleted (cascade would remove the FK target) */
    itemId: uuid("item_id").references(() => wishlistItems.id, { onDelete: "set null" }),
    /** snapshot of item title at the moment the event occurred */
    itemTitle: varchar("item_title", { length: 255 }).notNull(),
    /** null for profile-level events (e.g. owner_updated) */
    wishlistId: uuid("wishlist_id")
      .references(() => wishlists.id, { onDelete: "cascade" }),
    /**
     * Snapshot of the active share token at the time the event occurred.
     * Stored statically so link regeneration revokes navigation from old notifications.
     * null for notification types that don't navigate to a share page.
     */
    shareToken: varchar("share_token", { length: 255 }),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userIdIndex: index("notifications_user_id_idx").on(table.userId),
    userIdCreatedAtIndex: index("notifications_user_id_created_at_idx").on(
      table.userId,
      table.createdAt,
    ),
  }),
);
