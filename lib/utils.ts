import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B"; // Billions
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M"; // Millions
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "k"; // Thousands
  }
  return value.toString(); // Less than 1,000, no suffix
}

export function getInitials(name: string): string {
  // Return empty string if no name provided
  if (!name) return '';

  // Split the name into parts, handling multiple spaces and trim
  const nameParts = name.trim().split(/\s+/);
  
  // For single word, return first character
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  // For multiple words, take first character of each word up to 2 characters
  return nameParts
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}