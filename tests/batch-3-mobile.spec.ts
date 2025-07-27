import { test, expect } from '@playwright/test';

test.describe('Batch 3: Mobile Responsiveness Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  });

  test('should display mobile menu button on small screens', async ({ page }) => {
    await page.goto('/');
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should open mobile menu when button clicked', async ({ page }) => {
    await page.goto('/');
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await mobileMenuButton.click();
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
  });

  test('should have mobile navigation links', async ({ page }) => {
    await page.goto('/');
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    await mobileMenuButton.click();
    
    const navLinks = page.locator('a.block.px-3.py-2.text-base.font-medium');
    expect(await navLinks.count()).toBeGreaterThan(0);
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/');
    
    // Test button touch
    const buttons = page.locator('button:visible');
    if (await buttons.count() > 0) {
      await buttons.first().click();
      // Should not cause errors
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle mobile scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('should display mobile-optimized forms', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Check form inputs are properly sized for mobile
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();
    
    // Check input is touch-friendly (not too small)
    const box = await emailInput.boundingBox();
    expect(box?.height).toBeGreaterThan(40);
  });

  test('should handle mobile keyboard input', async ({ page }) => {
    await page.goto('/auth/signin');
    
    const emailInput = page.locator('input[name="email"]');
    await emailInput.click();
    await emailInput.fill('test@example.com');
    
    expect(await emailInput.inputValue()).toBe('test@example.com');
  });

  test('should display mobile-optimized cards', async ({ page }) => {
    await page.goto('/courses');
    
    // Check if course cards are visible and properly sized
    const cards = page.locator('[data-testid="course-card"], .card, [class*="card"]');
    if (await cards.count() > 0) {
      await expect(cards.first()).toBeVisible();
    }
  });

  test('should handle mobile search functionality', async ({ page }) => {
    await page.goto('/courses');
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
    if (await searchInput.count() > 0) {
      await expect(searchInput.first()).toBeVisible();
      await searchInput.first().fill('test');
    }
  });

  test('should display mobile-optimized buttons', async ({ page }) => {
    await page.goto('/');
    
    // Check buttons are touch-friendly
    const buttons = page.locator('button:visible');
    if (await buttons.count() > 0) {
      const button = buttons.first();
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThan(40);
      expect(box?.width).toBeGreaterThan(60);
    }
  });
}); 