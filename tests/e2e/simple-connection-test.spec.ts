import { test, expect } from '@playwright/test';

test.describe('Simple Connection Test', () => {
  test('should connect to development server', async ({ page }) => {
    // // // // // // // // // // console.log('Starting connection test...');
    
    // Try to navigate to the homepage first
    await page.goto('/');
    console.log('Successfully navigated to homepage');
    
    // Check if we can see the page content
    await expect(page.locator('body')).toBeVisible();
    console.log('Page body is visible');
    
    // Try to navigate to signin page
    await page.goto('/auth/signin');
    console.log('Successfully navigated to signin page');
    
    // Check if signin form is visible
    await expect(page.locator('input[name="email"]')).toBeVisible();
    console.log('Signin form is visible');
  });
}); 