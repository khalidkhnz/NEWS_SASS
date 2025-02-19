import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { categories } from "./categories";
import { posts } from "./posts";

export const categoryPostMap = sqliteTable(
  "categoryPostMap",
  {
    category: text()
      .notNull()
      .references(() => categories.category),
    postId: text()
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.category, table.postId] })]
);

export type ICategoryPostMap = typeof categoryPostMap.$inferSelect;
