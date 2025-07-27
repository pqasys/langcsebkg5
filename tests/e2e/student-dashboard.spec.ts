import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Student Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.loginAsStudent();
    
    // Ensure we're properly authenticated before proceeding
    await helpers.waitForAuthentication();
  });

  test('should display student dashboard', async ({ page }) => {
    await page.goto('/student');
    
    // Wait for page to load completely
    await helpers.waitForPageLoad();
    
    // Check for dashboard title - more flexible approach
    await expect(page.locator('h1, h2, h3').filter({ hasText: /dashboard/i })).toBeVisible();
    
    // Check for welcome message or user greeting
    await expect(page.locator('text=Welcome, text=Hello, text=Good').first()).toBeVisible();
    
    // Check for statistics cards - look for common dashboard elements
    const statsSelectors = [
      'text=Total Courses',
      'text=Enrolled Courses', 
      'text=My Courses',
      'text=Active Courses',
      'text=Completed Courses',
      'text=In Progress',
      'text=Average Progress'
    ];
    
    // Wait for at least one stats element to be visible
    await helpers.waitForAnyElement(statsSelectors);
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Look for navigation to courses - try multiple possible selectors
    const coursesSelectors = [
      'a[href*="courses"]',
      'text=Courses',
      '[data-testid="courses-link"]',
      'nav a:has-text("Courses")'
    ];
    
    const coursesLink = await helpers.waitForAnyElement(coursesSelectors);
    await page.click(coursesLink);
    
    // Wait for navigation and check URL
    await page.waitForURL(/\/student\/courses/);
    await expect(page).toHaveURL(/\/student\/courses/);
  });

  test('should navigate to progress page', async ({ page }) => {
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Look for progress navigation
    const progressSelectors = [
      'a[href*="progress"]',
      'text=Progress',
      '[data-testid="progress-link"]',
      'nav a:has-text("Progress")'
    ];
    
    const progressLink = await helpers.waitForAnyElement(progressSelectors);
    await page.click(progressLink);
    
    await page.waitForURL(/\/student\/progress/);
    await expect(page).toHaveURL(/\/student\/progress/);
  });

  test('should navigate to payments page', async ({ page }) => {
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Look for payments navigation
    const paymentsSelectors = [
      'a[href*="payments"]',
      'text=Payments',
      '[data-testid="payments-link"]',
      'nav a:has-text("Payments")'
    ];
    
    const paymentsLink = await helpers.waitForAnyElement(paymentsSelectors);
    await page.click(paymentsLink);
    
    await page.waitForURL(/\/student\/payments/);
    await expect(page).toHaveURL(/\/student\/payments/);
  });

  test('should display learning content', async ({ page }) => {
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Check for any learning-related content with multiple options
    const learningSelectors = [
      'text=Learning',
      'text=Progress', 
      'text=Courses',
      'text=Continue',
      'text=Study',
      'text=Modules',
      'text=Recent Modules',
      'text=Continue Learning'
    ];
    
    // Wait for at least one learning-related element
    await helpers.waitForAnyElement(learningSelectors);
  });

  test('should display user information', async ({ page }) => {
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Check for user info - look for name or email with multiple variations
    const userInfoSelectors = [
      'text=Test Student',
      'text=integration.test.student@example.com',
      'text=Welcome back, Test Student',
      'text=Hello, Test Student',
      'text=Good to see you, Test Student'
    ];
    
    // Wait for at least one user info element
    await helpers.waitForAnyElement(userInfoSelectors);
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/student');
    await helpers.waitForPageLoad();
    
    // Check that the page is still functional on mobile
    const mobileSelectors = [
      'text=Dashboard',
      'text=My Courses',
      'text=Welcome',
      'text=Total Courses'
    ];
    
    await helpers.waitForAnyElement(mobileSelectors);
  });
}); 