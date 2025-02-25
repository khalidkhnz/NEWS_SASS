"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { categories } from "@/schema/categories";
import { revalidateTag } from "next/cache";
import { Tags } from "@/lib/constants";
import { isAdminOrPowerUser } from "@/lib/authorization";

const insertCategorySchema = z.object({
  category: z.coerce.string(),
});

export interface CreateCategoryState {
  errors?: {
    id?: string[];
    category?: string[];
  };
  message?: string;
}

export async function createCategory(
  prevState: CreateCategoryState,
  formData: FormData
): Promise<CreateCategoryState> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("unauthenticated");
  }

  if (!isAdminOrPowerUser(session)) {
    throw new Error("unauthorized");
  }

  const validatedFields = insertCategorySchema.safeParse({
    category: formData.get("category"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid data",
    };
  }

  try {
    await db.insert(categories).values(validatedFields.data);

    revalidateTag(Tags.categories);

    return {
      message: "Category created successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Database error",
    };
  }
}
