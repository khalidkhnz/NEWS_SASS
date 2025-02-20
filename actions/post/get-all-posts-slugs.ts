"use server";

import { db } from "@/lib/db";
import { posts } from "@/schema/posts";

export async function getAllPostsSlugs(limit: number = 100) {
  try {
    const data = await db.select({ slug: posts.slug }).from(posts).limit(limit);
    return data.map((post) => post.slug);
  } catch (error) {
    console.log("Error while fetchig slugs: ", { error });
    return [];
  }
}
