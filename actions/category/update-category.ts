"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { categories } from "@/schema/categories";
import { eq } from "drizzle-orm"; // Import the `eq` helper function
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";
import { isAdminOrPowerUser } from "@/lib/authorization";

const updateCategorySchema = z.object({
  id: z.string().cuid2(),
  category: z.string().min(1, "Category name is required"),
});

export interface UpdateCategoryState {
  errors?: {
    id?: string[];
    category?: string[];
  };
  message?: string;
}

export async function updateCategory(
  prevState: UpdateCategoryState,
  formData: FormData
): Promise<UpdateCategoryState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdminOrPowerUser(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = updateCategorySchema.safeParse({
    id: formData.get("id"),
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    const { id, category } = validatedFields.data;

    const updatedCategory = await db
      .update(categories)
      .set({ category })
      .where(eq(categories.id, id))
      .returning();

    if (updatedCategory.length === 0) {
      return {
        message: "Category not found",
      };
    }

    revalidateTag(Tags.categories);

    return {
      message: "Category updated successfully",
    };
  } catch (error) {
    return {
      message: "Database error",
    };
  }
}
