"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { posts } from "@/schema/posts";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";
import { isAdminOrPowerUser } from "@/lib/authorization";

const deletePostSchema = z.object({
  id: z.string().cuid2(),
});

export interface DeletePostState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deletePost(
  prevState: DeletePostState,
  formData: FormData
): Promise<DeletePostState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdminOrPowerUser(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = deletePostSchema.safeParse({
    id: formData.get("id"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    const { id } = validatedFields.data;

    const deletedPost = await db
      .delete(posts)
      .where(eq(posts.id, id))
      .returning();

    if (deletedPost.length === 0) {
      return {
        message: "Post not found",
      };
    }

    revalidateTag(Tags.latestPosts);
    revalidateTag(Tags.topViewedPosts);

    return {
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
