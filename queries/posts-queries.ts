"use server";

import { eq, asc, desc, SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { IPost, posts } from "@/schema/posts";
import { categoryPostMap } from "@/schema/category-post-map";
import { users } from "@/schema/users";

export type PostsWithRelationsList = Awaited<
  ReturnType<typeof getPostsWithRelationsList>
>;

export async function getPostsWithRelationsList({
  filters,
  limit,
  offset,
  sortKey,
  sortOrder,
}: {
  filters?: SQL;
  limit?: number;
  offset?: number;
  sortKey?: string;
  sortOrder?: string;
}) {
  let orderBy;
  if (sortKey && sortKey in posts) {
    switch (sortOrder) {
      case "asc":
        orderBy = asc(posts[sortKey as keyof IPost]);
        break;
      case "desc":
        orderBy = desc(posts[sortKey as keyof IPost]);
        break;
    }
  }

  return await db.query.posts.findMany({
    where: filters,
    orderBy: orderBy,
    limit: limit,
    offset: offset,
    with: undefined,
  });
}

export type PostWithRelations = Awaited<
  ReturnType<typeof getPostWithRelations>
>;

export async function getPostWithRelations(id: string) {
  return await db.query.posts.findFirst({
    where: eq(posts.id, id),
    with: undefined,
  });
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select({
      post: posts,
      category: categoryPostMap.category,
      author: users.name,
    })
    .from(posts)
    .where(eq(posts.slug, slug))
    .leftJoin(categoryPostMap, eq(posts.id, categoryPostMap.postId))
    .leftJoin(users, eq(posts.author, users.id));

  if (result.length === 0) return null;

  const post = result[0].post;
  const author = result?.[0]?.author;

  const categories = result.map((row) => row.category).filter(Boolean);

  return { ...post, categories, author };
}
