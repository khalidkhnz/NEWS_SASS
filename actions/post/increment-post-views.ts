"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { posts } from "@/schema/posts";
import { eq, sql } from "drizzle-orm";

const updatePostSchema = z.object({
  slug: z.coerce.string(),
});

export interface UpdatePostViewsState {
  errors?: {
    slug?: string[];
  };
  message?: string;
}

export async function incrementPostViews(
  prevState: UpdatePostViewsState,
  slug: string
): Promise<UpdatePostViewsState> {
  const validatedFields = updatePostSchema.safeParse({
    slug: slug,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    const { slug } = validatedFields.data;

    await db
      .update(posts)
      .set({ views: sql`${posts.views} + 1` })
      .where(eq(posts.slug, slug));

    return {
      message: "Post views incremented successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
