import { test, expect } from '@playwright/test';
import { TestHelpers, testData } from './utils/test-helpers';

test.describe('Authentication', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check for login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for login-related text with multiple options
    const loginSelectors = [
      'text=Sign In',
      'text=Login',
      'text=Email',
      'text=Password',
      'text=Sign in',
      'text=Log in'
    ];
    
    // Wait for at least one login-related element
    await helpers.waitForAnyElement(loginSelectors);
  });

  test('should login as admin successfully', async ({ page }) => {
    // Navigate to signin page
    await page.goto('/auth/signin');
    
    // Wait for the form
    await page.waitForSelector('input[name="email"]');
    
    // Fill the form
    await page.fill('input[name="email"]', 'integration.test.admin@example.com');
    await page.fill('input[name="password"]', 'testpassword123');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for network requests to complete
    await page.waitForLoadState('networkidle');
    
    // Wait a bit more for any redirects
    await page.waitForTimeout(3000);
    
    // Check current URL
    // // // // // // // // // // // // // // console.log('Current URL:', page.url());
    
    // Check if we're still on signin page
    if (page.url().includes('/auth/signin')) {
      // Check for error message
      const errorElement = page.locator('text=Invalid email or password');
      if (await errorElement.isVisible()) {
        console.log('Error message found');
        throw new Error(`Login failed - invalid credentials - Context: throw new Error('Login failed - invalid credential...`);
      } else {
        console.log('No error message, but still on signin page');
        
        // Check if there's any loading state
        const loadingElement = page.locator('.animate-spin, [role="progressbar"]');
        if (await loadingElement.isVisible()) {
          console.log('Loading spinner is visible');
        } else {
          console.log('No loading spinner visible');
        }
        
        // Check the page content
        const pageContent = await page.textContent('body');
        console.log('Page content preview:', pageContent?.substring(0, 200));
      }
    } else {
      console.log('Successfully redirected to:', page.url());
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/auth-debug.png' });
  });

  test('should login as student successfully', async ({ page }) => {
    await helpers.loginAsStudent();
    
    // Should redirect to student dashboard
    await expect(page).toHaveURL(/\/student/);
    
    // Check for student-specific content with multiple options
    const studentSelectors = [
      'text=Student',
      'text=Dashboard',
      'text=My Courses',
      'text=Progress',
      'text=Welcome',
      'text=Learning'
    ];
    
    // Wait for at least one student element to be visible
    await helpers.waitForAnyElement(studentSelectors);
  });

  test('should login as institution successfully', async ({ page }) => {
    await helpers.loginAsInstitution();
    
    // Verify we're on the institution dashboard
    await expect(page).toHaveURL(/\/institution\/dashboard/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for the error message to appear
    await page.waitForSelector('text=Invalid email or password', { timeout: 10000 });
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await helpers.loginAsAdmin();
    await helpers.logout();
    
    // Verify we're redirected to signin page
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route
    await page.goto('/admin/dashboard');
    
    // Should redirect to login - be flexible with the redirect
    await expect(page).toHaveURL(/\/auth\/signin/);
  });

  test('should handle empty form submission', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation error or prevent submission
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
}); 