"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { categories } from "@/schema/categories";
import { eq } from "drizzle-orm"; // Import the `eq` helper function

const deleteCategorySchema = z.object({
  id: z.string().cuid2(),
});

export interface DeleteCategoryState {
  errors?: {
    id?: string[];
  };
  message?: string;
}

export async function deleteCategory(
  prevState: DeleteCategoryState,
  formData: FormData
): Promise<DeleteCategoryState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  const validatedFields = deleteCategorySchema.safeParse({
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

    const deletedCategory = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (deletedCategory.length === 0) {
      return {
        message: "Category not found",
      };
    }

    return {
      message: "Category deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
