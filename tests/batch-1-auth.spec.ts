import { test, expect } from '@playwright/test';

test.describe('Batch 1: Authentication Tests', () => {
  test('should load signin page', async ({ page }) => {
    await page.goto('/auth/signin');
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page).toHaveTitle(/Register/);
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveTitle(/Forgot Password/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('should load reset password page', async ({ page }) => {
    await page.goto('/reset-password');
    await expect(page).toHaveTitle(/Reset Password/);
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test('should show auth error page', async ({ page }) => {
    await page.goto('/api/auth/error');
    await expect(page).toBeVisible();
  });

  test('should redirect to signin from protected route', async ({ page }) => {
    await page.goto('/dashboard');
    // Should redirect to signin
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should have working auth forms', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    
    // Check submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have working register form', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.fill('input[name="confirmPassword"]', 'testpassword');
    
    // Check submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have working forgot password form', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com');
    
    // Check submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should have working reset password form', async ({ page }) => {
    await page.goto('/reset-password');
    
    // Fill form
    await page.fill('input[name="password"]', 'newpassword');
    await page.fill('input[name="confirmPassword"]', 'newpassword');
    
    // Check submit button exists
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should handle callback URL in signin page', async ({ page }) => {
    // Test that signin page properly handles callback URL parameter
    const callbackUrl = encodeURIComponent('/courses/78bfbb28-7f43-423d-9454-1910b1fdabcf?enroll=true');
    await page.goto(`/auth/signin?callbackUrl=${callbackUrl}`);
    
    // Check that the page loads correctly
    await expect(page).toHaveTitle(/Sign In/);
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    // Verify the callback URL is in the URL
    await expect(page).toHaveURL(/callbackUrl=/);
  });
}); 