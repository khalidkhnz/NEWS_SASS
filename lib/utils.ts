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

export function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024 * 1024) {
    // If file size is less than 1MB, show in KB
    return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  } else {
    // If file size is more than 1MB, show in MB
    return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export function capitalizeString(str: string) {
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
}

export function formatDateString(dateString: string | Date): string {
  try {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Get hours, minutes, and format AM/PM
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Format the time as HH:MM AM/PM
    const time = `${hours}:${minutes} ${ampm}`;

    return `${day}-${month}-${year} ${time}`;
  } catch (error) {
    return "Invalid Date";
  }
}

export function postUrlWithSlug(slug: string) {
  return `/post/${slug}`;
}
