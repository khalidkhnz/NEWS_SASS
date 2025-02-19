"use server";

import { auth } from "@/lib/auth";

export async function currentUser() {
  "use server";
  try {
    return { data: await auth(), message: "Current User" };
  } catch (error) {
    return {
      data: null,
      error: error,
      message: "No Session Found",
    };
  }
}
