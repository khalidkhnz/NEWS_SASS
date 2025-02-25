"use server";

import { and, asc, desc, eq, like, or, sql, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/schema/posts";
import { users } from "@/schema/users";
import { IPostPlatforms, IPostStatus } from "@/types/post";

export interface GetPostsParams {
  search?: string;
  limit?: number;
  page?: number;
  sortKey?: keyof typeof posts;
  sortOrder?: "asc" | "desc";
  status?: IPostStatus | null;
  platform?: IPostPlatforms | null;
  withAuthor?: boolean;
}

type IPostType = typeof posts.$inferSelect;

interface IReturnDataType extends IPostType {
  authorInfo?: typeof users.$inferSelect | null;
}

export interface GetPostsResponse {
  data: IReturnDataType[] | IPostType[];
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
  status,
  platform,
  withAuthor = false,
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
    const lowerSearch = search.toLowerCase(); // Ensure search term is lowercase
    filters = or(
      like(sql`LOWER(${posts.title})`, `%${lowerSearch}%`), // Case-insensitive title search
      like(sql`LOWER(${posts.description})`, `%${lowerSearch}%`), // Case-insensitive description search
      like(sql`LOWER(${posts.tags})`, `%${JSON.stringify(lowerSearch)}%`) // Case-insensitive JSON array search
    );
  }

  // Apply sorting
  orderBy = sortOrder === "asc" ? asc(column as any) : desc(column as any);

  if (status && status != null) {
    filters = and(eq(posts.status, status), filters);
  }

  if (platform && platform != null) {
    filters = and(eq(posts.platform, platform), filters);
  }

  // Fetch total count of items using raw SQL
  const totalItemsResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(posts)
    .where(filters);
  const totalItems = totalItemsResult[0]?.count ?? 0;

  const totalPages = Math.ceil(totalItems / limit);

  if (withAuthor) {
    const dataWithAuthor = (
      await db
        .select()
        .from(posts)
        .leftJoin(users, eq(posts.author, users.id))
        .where(filters)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset)
    ).map((data) => ({ ...data?.posts, authorInfo: data?.users }));

    return {
      data: dataWithAuthor,
      totalItems,
      totalPages,
      currentPage: page,
      currentLimit: limit,
    };
  } else {
    const data = await db.query.posts.findMany({
      where: filters,
      orderBy,
      limit,
      offset,
    });
    return {
      data: data,
      totalItems,
      totalPages,
      currentPage: page,
      currentLimit: limit,
    };
  }
}
