import { prisma } from '@/lib/prisma';
import { logger, logError } from '../logger';

// Default payment approval configuration (fallback)
const DEFAULT_PAYMENT_CONFIG = {
  // Whether institutions can approve their own payments
  // Set to false to restrict payment approval to admin-only
  ALLOW_INSTITUTION_PAYMENT_APPROVAL: true,
  
  // Whether to show payment approval buttons to institutions
  SHOW_INSTITUTION_APPROVAL_BUTTONS: true,
  
  // Default payment status for new enrollments
  DEFAULT_PAYMENT_STATUS: 'PENDING',
  
  // Payment methods that can be approved by institutions
  INSTITUTION_APPROVABLE_METHODS: ['MANUAL', 'BANK_TRANSFER', 'CASH'],
  
  // Payment methods that require admin approval
  ADMIN_ONLY_METHODS: ['CREDIT_CARD', 'PAYPAL', 'STRIPE'],
} as const;

// Cache for settings to avoid repeated database calls
let settingsCache: unknown = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get settings from database with caching
async function getPaymentSettings() {
  const now = Date.now();
  
  // Return cached settings if still valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return settingsCache;
  }

  try {
    const settings = await prisma.adminSettings.findFirst({
      where: { id: '1' }
    });

    if (settings) {
      settingsCache = {
        ALLOW_INSTITUTION_PAYMENT_APPROVAL: settings.allowInstitutionPaymentApproval,
        SHOW_INSTITUTION_APPROVAL_BUTTONS: settings.showInstitutionApprovalButtons,
        DEFAULT_PAYMENT_STATUS: settings.defaultPaymentStatus,
        INSTITUTION_APPROVABLE_METHODS: settings.institutionApprovableMethods as string[],
        ADMIN_ONLY_METHODS: settings.adminOnlyMethods as string[],
        INSTITUTION_PAYMENT_APPROVAL_EXEMPTIONS: settings.institutionPaymentApprovalExemptions as string[]
      };
    } else {
      settingsCache = DEFAULT_PAYMENT_CONFIG;
    }
    
    cacheTimestamp = now;
    return settingsCache;
  } catch (error) {
    logger.error('Error fetching payment settings:');
    return DEFAULT_PAYMENT_CONFIG;
  }
}

// Function to clear cache (call this when settings are updated)
export function clearPaymentSettingsCache() {
  settingsCache = null;
  cacheTimestamp = 0;
}

// Helper function to check if institution can approve a payment
export async function canInstitutionApprovePayment(paymentMethod?: string, institutionId?: string): Promise<boolean> {
  const settings = await getPaymentSettings();
  
  // Check if institution payment approval is globally disabled
  if (!settings.ALLOW_INSTITUTION_PAYMENT_APPROVAL) {
    return false;
  }

  // Check if institution is exempted from payment approval
  if (institutionId && settings.INSTITUTION_PAYMENT_APPROVAL_EXEMPTIONS?.includes(institutionId)) {
    return false;
  }

  // If no payment method specified, allow approval
  if (!paymentMethod) {
    return true;
  }

  // Check if payment method is in the approvable list
  return settings.INSTITUTION_APPROVABLE_METHODS.includes(paymentMethod);
}

// Helper function to check if admin approval is required
export async function requiresAdminApproval(paymentMethod?: string): Promise<boolean> {
  const settings = await getPaymentSettings();
  
  if (!paymentMethod) {
    return false;
  }

  return settings.ADMIN_ONLY_METHODS.includes(paymentMethod);
}

// Helper function to check if institution approval buttons should be shown
export async function shouldShowInstitutionApprovalButtons(): Promise<boolean> {
  const settings = await getPaymentSettings();
  return settings.SHOW_INSTITUTION_APPROVAL_BUTTONS;
}

// Helper function to get default payment status
export async function getDefaultPaymentStatus(): Promise<string> {
  const settings = await getPaymentSettings();
  return settings.DEFAULT_PAYMENT_STATUS;
}

// Export the default config for backward compatibility
export const PAYMENT_CONFIG = DEFAULT_PAYMENT_CONFIG; 