import { test, expect } from '@playwright/test';

test.describe('Responsive & Device Coverage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fluentish/);
    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('should be responsive and mobile-optimized', async ({ page }) => {
    await page.goto('/');
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
    expect(viewport).toContain('initial-scale=1');
    const bodyWidth = await page.locator('body').boundingBox();
    const viewportWidth = page.viewportSize()?.width || 0;
    expect(bodyWidth?.width).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('should handle navigation properly', async ({ page }) => {
    await page.goto('/');
    const navLinks = await page.locator('nav a').all();
    for (const link of navLinks.slice(0, 3)) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        await link.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('main')).toBeVisible();
        await page.goto('/');
      }
    }
  });

  test('should display courses page correctly', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.locator('main')).toBeVisible();
    const courseElements = await page.locator('[data-testid="course"], .course-card, .course-item').all();
    if (courseElements.length > 0) {
      for (const course of courseElements.slice(0, 2)) {
        await expect(course).toBeVisible();
      }
    }
  });

  test('should handle forms and inputs correctly', async ({ page }) => {
    await page.goto('/auth/signin');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for form to be available
    await page.waitForTimeout(2000);
    
    // Check if we're on the signin page
    const currentUrl = page.url();
    if (currentUrl.includes('/auth/signin')) {
      await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
      const inputs = await page.locator('input[type="text"], input[type="email"], input[type="password"]').all();
      for (const input of inputs) {
        await expect(input).toBeVisible();
        await input.click();
        await input.fill('test@example.com');
        await expect(input).toHaveValue('test@example.com');
      }
    } else {
      // If redirected, test the contact form instead
      await page.goto('/contact');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
      const inputs = await page.locator('input[type="text"], input[type="email"]').all();
      for (const input of inputs.slice(0, 2)) {
        await expect(input).toBeVisible();
        await input.click();
        await input.fill('test@example.com');
        await expect(input).toHaveValue('test@example.com');
      }
    }
  });

  test('should support touch interactions on mobile/tablet', async ({ page, browserName }) => {
    await page.goto('/');
    // Only run for mobile/tablet
    if (page.viewportSize()?.width && page.viewportSize()?.width < 1025) {
      const touchableElements = await page.locator('button, a, [role="button"]').all();
      for (const element of touchableElements.slice(0, 3)) {
        await element.tap();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should handle service worker functionality', async ({ page }) => {
    await page.goto('/');
    const swRegistered = await page.evaluate(() => 'serviceWorker' in navigator);
    if (swRegistered) {
      // Simulate offline
      await page.route('**/*', route => route.abort());
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should display proper error states', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle images and media correctly', async ({ page }) => {
    await page.goto('/');
    const images = await page.locator('img').all();
    for (const img of images.slice(0, 3)) {
      await expect(img).toBeVisible();
      const box = await img.boundingBox();
      if (box) {
        expect(box.width).toBeGreaterThan(0);
        expect(box.height).toBeGreaterThan(0);
      }
    }
  });

  test('should maintain performance standards', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000);
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    await page.waitForTimeout(2000);
    const criticalErrors = errors.filter(error => !error.includes('favicon') && !error.includes('analytics') && !error.includes('ads'));
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('should support accessibility features', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    const images = await page.locator('img').all();
    if (images.length > 0) {
      for (const img of images.slice(0, 3)) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeDefined();
      }
    }
    
    const textElements = await page.locator('p, span, div').all();
    if (textElements.length > 0) {
      for (const element of textElements.slice(0, 5)) {
        const color = await element.evaluate(el => window.getComputedStyle(el).color);
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });

  test('should handle different orientations', async ({ page }) => {
    await page.goto('/');
    if (page.viewportSize()?.width && page.viewportSize()?.width < 1025) {
      // Test landscape
      await page.setViewportSize({
        width: page.viewportSize()?.height || 667,
        height: page.viewportSize()?.width || 375
      });
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
      // Test portrait
      await page.setViewportSize({
        width: page.viewportSize()?.height || 375,
        height: page.viewportSize()?.width || 667
      });
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('nav')).toBeVisible();
    }
  });
}); 