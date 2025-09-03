import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortByField<T>(array: T[], field: keyof T): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }

    return 0;
  });
}

export const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "full",
  timeStyle: "short",
});
