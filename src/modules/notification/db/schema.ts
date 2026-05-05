import { index, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "@/modules/auth/db/schema";
import { wishlistItems } from "@/modules/wishlist/db/schema";
import { wishlists } from "@/modules/wishlist/db/schema";

export const NOTIFICATION_TYPES = ["item_updated", "item_deleted"] as const;
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
    wishlistId: uuid("wishlist_id")
      .notNull()
      .references(() => wishlists.id, { onDelete: "cascade" }),
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
