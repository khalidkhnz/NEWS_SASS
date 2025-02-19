import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const categories = sqliteTable("categories", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  category: text().notNull().unique(),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`)
    .$onUpdate(() => new Date()),
});

export type ICategory = typeof categories.$inferSelect;
