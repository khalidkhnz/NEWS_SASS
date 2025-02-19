"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { posts } from "@/schema/posts";
import { eq, and } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";
import { categoryPostMap } from "@/schema/category-post-map";

const updatePostSchema = z.object({
  id: z.coerce.string(),
  title: z.coerce.string().optional(),
  subTitle: z.coerce.string().optional(),
  slug: z.coerce.string().optional(),
  description: z.coerce.string().optional(),
  thumbnail: z.coerce.string().optional(),
  delta: z.coerce.string().optional(),
  tags: z.coerce.string().optional(),
  categories: z.coerce.string().optional(), // Categories will be processed separately
});

export interface UpdatePostState {
  errors?: {
    id?: string[];
    title?: string[];
    subTitle?: string[];
    slug?: string[];
    description?: string[];
    thumbnail?: string[];
    delta?: string[];
    tags?: string[];
    categories?: string[];
  };
  message?: string;
}

export async function updatePost(
  prevState: UpdatePostState,
  formData: FormData
): Promise<UpdatePostState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  const validatedFields = updatePostSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    subTitle: formData.get("subTitle"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    thumbnail: formData.get("thumbnail"),
    delta: formData.get("delta"),
    tags: formData.get("tags"),
    categories: formData.get("categories"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    const { id, categories, ...updateData } = validatedFields.data;

    // Update the post details
    await db.update(posts).set(updateData).where(eq(posts.id, id));

    if (categories !== undefined) {
      // Parse new categories array
      const newCategories = JSON.parse(categories) as string[];

      // Remove old category mappings for this post
      await db.delete(categoryPostMap).where(eq(categoryPostMap.postId, id));

      // Insert new categories if any
      if (newCategories.length > 0) {
        await db.insert(categoryPostMap).values(
          newCategories.map((category) => ({
            category,
            postId: id,
          }))
        );
      }
    }

    // Revalidate cache
    revalidateTag(Tags.latestPosts);
    revalidateTag(Tags.topViewedPosts);

    return {
      message: "Post updated successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
