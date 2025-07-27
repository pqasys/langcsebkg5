import { test, expect } from '@playwright/test';

test.describe('Fast Core Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should load courses page', async ({ page }) => {
    await page.goto('/courses');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load institutions page', async ({ page }) => {
    await page.goto('/institutions');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load features page', async ({ page }) => {
    await page.goto('/features');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check mobile menu button
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForSelector('[data-testid="mobile-menu"]', { state: 'visible' });
      expect(await page.locator('a.block.px-3.py-2.text-base.font-medium').count()).toBeGreaterThan(0);
    }
  });

  test('should handle responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('nav')).toBeVisible();
  });
}); 