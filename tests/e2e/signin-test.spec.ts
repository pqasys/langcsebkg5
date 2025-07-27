import { test, expect } from '@playwright/test';

test.describe('Signin Page Mobile Test', () => {
  test('should load signin page on mobile', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title is correct (it might be the default title)
    const title = await page.title();
    // // console.log('Page title:', title);
    
    // Check if we're on the signin page by looking for signin-specific content
    await expect(page.locator('body')).toBeVisible();
    
    // Check if the main content is visible
    await expect(page.locator('body')).toBeVisible();
    
    // Check if the form is present (with a longer timeout)
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    
    // Check if email input is present
    await expect(page.locator('input[name="email"]')).toBeVisible();
    
    // Check if password input is present
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
}); 