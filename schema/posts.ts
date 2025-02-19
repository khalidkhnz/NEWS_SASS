import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { users } from "./users";

export const posts = sqliteTable("posts", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text().notNull(),
  slug: text().unique().notNull(),
  subTitle: text().notNull(),
  description: text().notNull(),
  thumbnail: text(),
  delta: text().notNull(),
  views: integer().default(0),
  author: text()
    .notNull()
    .references(() => users.id),
  tags: text()
    .notNull()
    .$default(() => "[]"),
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`)
    .$onUpdate(() => new Date()),
});

export type IPost = typeof posts.$inferSelect;
