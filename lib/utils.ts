import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function safeJSONparse(delta: string) {
  try {
    return JSON.parse(delta);
  } catch (error) {
    return delta;
  }
}
