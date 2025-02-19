"use server";

import { eq, asc, desc, like, and, sql, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/schema/categories";

export interface GetCategoriesParams {
  search?: string;
  limit?: number;
  page?: number;
  sortKey?: keyof typeof categories;
  sortOrder?: "asc" | "desc";
}

export interface GetCategoriesResponse {
  data: (typeof categories.$inferSelect)[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  currentLimit: number;
}

export async function getCategories({
  search,
  limit = 10,
  page = 1,
  sortKey = "id",
  sortOrder = "asc",
}: GetCategoriesParams): Promise<GetCategoriesResponse> {
  let filters: SQL | undefined;
  let orderBy: SQL | undefined;
  const offset = (page - 1) * limit; // Calculate offset for pagination

  // Ensure sortKey is a valid column before using it
  const column = categories[sortKey as keyof typeof categories];

  if (!column) {
    throw new Error(`Invalid sort key: ${sortKey}`);
  }

  // Apply search filter if search query is provided
  if (search) {
    filters = like(categories.category, `%${search}%`);
  }

  // Apply sorting
  orderBy = sortOrder === "asc" ? asc(column as any) : desc(column as any);

  // Fetch total count of items using raw SQL
  const totalItemsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(categories)
    .where(filters);
  const totalItems = totalItemsResult[0]?.count ?? 0;

  // Fetch paginated data
  const data = await db.query.categories.findMany({
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
