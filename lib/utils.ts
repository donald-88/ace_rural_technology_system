import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to format current date in the required format (yyyy-MM-dd'T'HH:mm:ssZ)
export function getCurrentDateFormatted() {
  const now = new Date();
  const offset = now.getTimezoneOffset(); // Get the time zone offset in minutes
  const sign = offset > 0 ? '-' : '+'; // Determine the sign of the time zone offset
  const hours = Math.floor(Math.abs(offset) / 60); // Get the offset hours
  const minutes = Math.abs(offset) % 60; // Get the offset minutes

  // Format the date as YYYY-MM-DDTHH:00:00+hh:mm
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:00:00${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
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

//comodity chart data function
export const calculatePieChartData = (commodities: { seed: string; quantity: number; fill: string }[]) => {
  const totalBags = commodities.reduce((sum, item) => sum + item.quantity, 0);

  return commodities.map(item => ({
    ...item,
    percentage: totalBags > 0 ? ((item.quantity / totalBags) * 100).toFixed(1) + "%" : "0%",
  }));
};


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