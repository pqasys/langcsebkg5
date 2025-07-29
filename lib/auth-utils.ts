import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextRequest } from 'next/server';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one character from each category
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // number
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // special character
  
  // Fill the rest with random characters
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
} 

/**
 * Safely get server session, handling build-time scenarios where headers are not available
 */
export async function getSafeServerSession(request?: NextRequest) {
  try {
    // Check if we're in a build context (no headers available)
    if (isBuildTime(request)) {
      return null;
    }
    
    return await getServerSession(authOptions);
  } catch (error) {
    // During build time or when headers are not available, return null
    console.warn('Failed to get server session:', error);
    return null;
  }
}

/**
 * Check if the current request is during build time
 */
export function isBuildTime(request?: NextRequest): boolean {
  if (!request) return true;
  
  try {
    // Check if headers object exists and has any authentication-related headers
    const headers = request.headers;
    if (!headers) return true;
    
    const authHeader = headers.get('authorization');
    const cookieHeader = headers.get('cookie');
    
    // If no auth headers are present, we're likely in build time
    return !authHeader && !cookieHeader;
  } catch (error) {
    // If we can't access headers at all, we're definitely in build time
    return true;
  }
} 