import { test, expect } from '@playwright/test';
import { TestHelpers } from './utils/test-helpers';

test.describe('Admin Dashboard', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.loginAsAdmin();
    
    // Ensure we're properly authenticated before proceeding
    await helpers.waitForAuthentication();
  });

  test('should display admin dashboard', async ({ page }) => {
    await page.goto('/admin/dashboard');
    
    // Wait for page to load completely
    await helpers.waitForPageLoad();
    
    // Check for dashboard title - more flexible approach
    await expect(page.locator('h1, h2, h3').filter({ hasText: /dashboard|admin/i })).toBeVisible();
    
    // Check for admin-specific content with multiple options
    const adminSelectors = [
      'text=Admin',
      'text=Dashboard', 
      'text=Overview',
      'text=Statistics',
      'text=Management',
      'text=Control Panel'
    ];
    
    // Wait for at least one admin element to be visible
    await helpers.waitForAnyElement(adminSelectors);
  });

  test('should navigate to users management', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Look for users management navigation with multiple options
    const usersSelectors = [
      'a[href*="users"]',
      'text=Users',
      '[data-testid="users-link"]',
      'nav a:has-text("Users")',
      'text=User Management'
    ];
    
    const usersLink = await helpers.waitForAnyElement(usersSelectors);
    await page.click(usersLink);
    
    await page.waitForURL(/\/admin\/users/);
    await expect(page).toHaveURL(/\/admin\/users/);
  });

  test('should navigate to courses management', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Look for courses management navigation with multiple options
    const coursesSelectors = [
      'a[href*="courses"]',
      'text=Courses',
      '[data-testid="courses-link"]',
      'nav a:has-text("Courses")',
      'text=Course Management'
    ];
    
    const coursesLink = await helpers.waitForAnyElement(coursesSelectors);
    await page.click(coursesLink);
    
    await page.waitForURL(/\/admin\/courses/);
    await expect(page).toHaveURL(/\/admin\/courses/);
  });

  test('should navigate to institutions management', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Look for institutions management navigation with multiple options
    const institutionsSelectors = [
      'a[href*="institutions"]',
      'text=Institutions',
      '[data-testid="institutions-link"]',
      'nav a:has-text("Institutions")',
      'text=Institution Management'
    ];
    
    const institutionsLink = await helpers.waitForAnyElement(institutionsSelectors);
    await page.click(institutionsLink);
    
    await page.waitForURL(/\/admin\/institutions/);
    await expect(page).toHaveURL(/\/admin\/institutions/);
  });

  test('should display admin statistics', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Check for statistics or overview content with multiple options
    const statsSelectors = [
      'text=Statistics',
      'text=Overview',
      'text=Total',
      'text=Count',
      'text=Summary',
      'text=Reports'
    ];
    
    // Wait for at least one stats element to be visible
    await helpers.waitForAnyElement(statsSelectors);
  });

  test('should display admin navigation', async ({ page }) => {
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Check for navigation elements with multiple options
    const navSelectors = [
      'nav',
      '[role="navigation"]',
      '.sidebar',
      '.menu',
      '.navigation',
      '[data-testid="navigation"]'
    ];
    
    // Wait for at least one navigation element to be visible
    await helpers.waitForAnyElement(navSelectors);
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');
    await helpers.waitForPageLoad();
    
    // Check that the page loads without horizontal scroll
    const body = await page.locator('body');
    const overflow = await body.evaluate(el => window.getComputedStyle(el).overflowX);
    expect(overflow).not.toBe('auto');
    
    // Also check that some admin content is visible on mobile
    const mobileSelectors = [
      'text=Admin',
      'text=Dashboard',
      'text=Overview',
      'text=Statistics'
    ];
    
    await helpers.waitForAnyElement(mobileSelectors);
  });
}); 