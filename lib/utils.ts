import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parses facilities data that might be stored as JSON or comma-separated string
 * @param facilities - The facilities data to parse
 * @returns Array of facility strings
 */
export function parseFacilities(facilities: unknown): string[] {
  if (!facilities) return [];
  
  try {
    // If it's already an array, return it
    if (Array.isArray(facilities)) {
      return facilities;
    }
    
    // If it's a string, try to parse as JSON first
    if (typeof facilities === 'string') {
      // Try JSON.parse first
      const parsed = JSON.parse(facilities);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // If parsed result is not an array, treat as comma-separated string
      return facilities.split(',').map(f => f.trim()).filter(f => f);
    }
    
    // If it's not a string or array, return empty array
    return [];
  } catch (parseError) {
    // If JSON.parse fails, treat as comma-separated string
    // // // // // // console.warn('Failed to parse facilities JSON, treating as string:', facilities);
    if (typeof facilities === 'string') {
      return facilities.split(',').map(f => f.trim()).filter(f => f);
    }
    return [];
  }
}

export function removeInstitutionNameFromTitle(title: string, institutionName: string): string {
  // Remove the institution name from the title if it exists
  const cleanTitle = title.replace(new RegExp(institutionName, 'gi'), '').trim();
  // Remove any double spaces that might have been created
  return cleanTitle.replace(/\s+/g, ' ');
}

export function formatDate(date: Date | string) {
  if (!date) return '';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatCurrencyWithSymbol(amount: number, currencyCode: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  } catch (error) {
    console.error('Error occurred:', error);
    console.warn(`Failed to format currency ${currencyCode}:`, error);
    const symbol = currencyCode === 'USD' ? '$' : currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
} 