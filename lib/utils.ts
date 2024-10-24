import { clsx, type ClassValue } from "clsx"
import { Models } from "node-appwrite";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseStringify = (value: Models.Document[]) => JSON.parse(JSON.stringify(value));