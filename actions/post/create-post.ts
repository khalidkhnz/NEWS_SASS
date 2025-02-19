"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { posts } from "@/schema/posts";
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";

const insertPostSchema = z.object({
  title: z.coerce.string(),
  subTitle: z.coerce.string(),
  slug: z.coerce.string(),
  description: z.coerce.string(),
  thumbnail: z.coerce.string(),
  delta: z.coerce.string(),
  tags: z.coerce.string(),
  categories: z.coerce.string(),
});

export interface CreatePostState {
  errors?: {
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

export async function createPost(
  prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  const validatedFields = insertPostSchema.safeParse({
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
    await db.insert(posts).values({
      ...validatedFields.data,
      author: session.user.id,
    });

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
