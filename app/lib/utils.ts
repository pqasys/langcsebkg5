import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Common currency symbols for fallback
const commonCurrencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CNY: '¥',
  INR: '₹',
  AUD: 'A$',
  CAD: 'C$',
  CHF: 'Fr',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  NZD: 'NZ$',
  SGD: 'S$',
  HKD: 'HK$',
  KRW: '₩',
  BRL: 'R$',
  RUB: '₽',
  ZAR: 'R',
  MXN: 'Mex$',
  TRY: '₺',
  AED: 'د.إ',
  SAR: '﷼',
  THB: '฿',
  MYR: 'RM',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
};

// Get currency symbol using Intl API with fallback
export function getCurrencySymbol(currencyCode: string): string {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    });
    const parts = formatter.formatToParts(0);
    const symbol = parts.find(part => part.type === 'currency')?.value;
    if (symbol) return symbol;
  } catch (error) {
    console.error('Error occurred:', error);
    // // // // // // // // // // // // // // // console.warn(`Failed to get symbol for currency ${currencyCode}:`, error);
  }
  return commonCurrencySymbols[currencyCode] || currencyCode;
}

// Get currency format options
export function getCurrencyFormatOptions(currencyCode: string) {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    const parts = formatter.formatToParts(0);
    const decimalPart = parts.find(part => part.type === 'decimal');
    const fractionPart = parts.find(part => part.type === 'fraction');
    
    return {
      minimumFractionDigits: fractionPart ? fractionPart.value.length : 2,
      maximumFractionDigits: fractionPart ? fractionPart.value.length : 2,
      currency: currencyCode,
      style: 'currency',
    };
  } catch (error) {
    console.error('Error occurred:', error);
    console.warn(`Failed to get format options for currency ${currencyCode}:`, error);
    return {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      currency: currencyCode,
      style: 'currency',
    };
  }
}

// Format currency amount
export function formatCurrency(amount: number, currencyCode: string): string {
  try {
    const options = getCurrencyFormatOptions(currencyCode);
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    console.error('Error occurred:', error);
    console.warn(`Failed to format currency ${currencyCode}:`, error);
    return amount.toString();
  }
}

// Format currency with symbol
export function formatCurrencyWithSymbol(amount: number, currencyCode: string): string {
  try {
    const options = getCurrencyFormatOptions(currencyCode);
    return new Intl.NumberFormat('en-US', options).format(amount);
  } catch (error) {
    console.error('Error occurred:', error);
    console.warn(`Failed to format currency ${currencyCode}:`, error);
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toFixed(2)}`;
  }
}

// Get detailed currency information
export function getCurrencyInfo(currencyCode: string) {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    const parts = formatter.formatToParts(0);
    
    return {
      code: currencyCode,
      symbol: getCurrencySymbol(currencyCode),
      name: new Intl.DisplayNames(['en'], { type: 'currency' }).of(currencyCode) || currencyCode,
      format: parts.map(part => part.type).join(''),
      decimalSeparator: parts.find(part => part.type === 'decimal')?.value || '.',
      groupSeparator: parts.find(part => part.type === 'group')?.value || ',',
      fractionDigits: parts.find(part => part.type === 'fraction')?.value.length || 2,
    };
  } catch (error) {
    console.error('Error occurred:', error);
    console.warn(`Failed to get currency info for ${currencyCode}:`, error);
    return {
      code: currencyCode,
      symbol: commonCurrencySymbols[currencyCode] || currencyCode,
      name: currencyCode,
      format: 'symbol',
      decimalSeparator: '.',
      groupSeparator: ',',
      fractionDigits: 2,
    };
  }
}

// Validate currency code
export function isValidCurrencyCode(currencyCode: string): boolean {
  try {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    });
    return true;
  } catch (error) {
    console.error('Error occurred:', error);
    return false;
  }
} 