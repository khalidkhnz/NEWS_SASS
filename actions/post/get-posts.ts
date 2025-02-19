"use server";

import { asc, desc, like, sql, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/schema/posts";

export interface GetPostsParams {
  search?: string;
  limit?: number;
  page?: number;
  sortKey?: keyof typeof posts;
  sortOrder?: "asc" | "desc";
}

export interface GetPostsResponse {
  data: (typeof posts.$inferSelect)[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
}

export async function getPosts({
  search,
  limit = 10,
  page = 1,
  sortKey = "createdAt",
  sortOrder = "desc",
}: GetPostsParams): Promise<GetPostsResponse> {
  let filters: SQL | undefined;
  let orderBy: SQL | undefined;
  const offset = (page - 1) * limit; // Calculate offset for pagination

  // Ensure sortKey is a valid column before using it
  const column = posts[sortKey as keyof typeof posts];

  if (!column) {
    throw new Error(`Invalid sort key: ${sortKey}`);
  }

  // Apply search filter if search query is provided (searches title & description)
  if (search) {
    filters = like(posts.title, `%${search}%`);
  }

  // Apply sorting
  orderBy = sortOrder === "asc" ? asc(column as any) : desc(column as any);

  // Fetch total count of items using raw SQL
  const totalItemsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(posts)
    .where(filters);
  const totalItems = totalItemsResult[0]?.count ?? 0;

  // Fetch paginated data
  const data = await db.query.posts.findMany({
    where: filters,
    orderBy,
    limit,
    offset,
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    totalItems,
    totalPages,
    currentPage: page,
    currentLimit: limit,
  };
}
