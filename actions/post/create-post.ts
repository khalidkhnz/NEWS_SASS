"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { posts } from "@/schema/posts";
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";
import { categoryPostMap } from "@/schema/category-post-map";
import { isAdminOrPowerUser } from "@/lib/authorization";

const insertPostSchema = z.object({
  title: z.coerce.string(),
  subTitle: z.coerce.string(),
  slug: z.coerce.string(),
  description: z.coerce.string(),
  thumbnail: z.coerce.string(),
  delta: z.coerce.string(),
  parsedDelta: z.coerce.string(),
  tags: z.coerce.string(),
  categories: z.coerce.string(), // Categories will be parsed as an array
  status: z.coerce.string(),
});

export interface CreatePostState {
  errors?: {
    title?: string[];
    subTitle?: string[];
    slug?: string[];
    description?: string[];
    thumbnail?: string[];
    delta?: string[];
    parsedDelta?: string[];
    tags?: string[];
    categories?: string[];
    status?: string[];
  };
  message?: string;
}

export async function createPost(
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdminOrPowerUser(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = insertPostSchema.safeParse({
    title: formData.get("title"),
    subTitle: formData.get("subTitle"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    thumbnail: formData.get("thumbnail"),
    delta: formData.get("delta"),
    parsedDelta: formData.get("parsedDelta"),
    tags: formData.get("tags"),
    categories: formData.get("categories"),
    status: formData.get("status") || "DRAFT",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    // Insert the post first and get the inserted post ID
    const [insertedPost] = await db
      .insert(posts)
      .values({
        ...validatedFields.data,
        author: session.user.id,
      })
      .returning({ id: posts.id });

    if (!insertedPost) {
      throw new Error("Failed to insert post");
    }

    const postId = insertedPost.id;

    // Parse categories into an array
    const categories = JSON.parse(validatedFields.data.categories) as string[];

    // Insert each category into the categoryPostMap table
    if (categories.length > 0) {
      await db.insert(categoryPostMap).values(
        categories.map((category) => ({
          category,
          postId,
        }))
      );
    }

    // Revalidate cache
    revalidateTag(Tags.latestPosts);

    return {
      message: "Post created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
