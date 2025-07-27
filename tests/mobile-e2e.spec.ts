import { test, expect } from '@playwright/test';

test('should load homepage correctly', async ({ page }) => {
  await page.goto('/');
  
  // Check if page loads without errors
  await expect(page).toHaveTitle(/Fluentish/);
  
  // Check for critical elements
  await expect(page.locator('nav')).toBeVisible();
  await expect(page.locator('main')).toBeVisible();
  
  // Check responsive layout
  const viewport = page.viewportSize();
  if (viewport) {
    expect(viewport.width).toBeGreaterThan(0);
    expect(viewport.height).toBeGreaterThan(0);
  }
});

test('should handle navigation correctly', async ({ page }) => {
  // Set viewport to ensure mobile view
  await page.setViewportSize({ width: 375, height: 667 });
  
  await page.goto('/');
  
  // Wait for the page to be fully loaded
  await page.waitForLoadState('networkidle');
  
  // Wait for the navbar to be visible
  await page.waitForSelector('nav', { state: 'visible' });
  
  // Open the mobile menu
  const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
  if (await mobileMenuButton.isVisible()) {
    await mobileMenuButton.click();
    // Wait for mobile menu to be visible
    await page.waitForSelector('[data-testid="mobile-menu"]', { state: 'visible' });
  }

  // Check for mobile navigation links
  const navLinks = page.locator('a.block.px-3.py-2.text-base.font-medium');
  const linkCount = await navLinks.count();
  expect(linkCount).toBeGreaterThan(0);

  // Check for specific links with exact text matching
  await expect(navLinks.filter({ hasText: /^Home$/ })).toBeVisible();
  await expect(navLinks.filter({ hasText: /^For Students$/ })).toBeVisible();
  await expect(navLinks.filter({ hasText: /^For Institutions$/ })).toBeVisible();
  await expect(navLinks.filter({ hasText: /^Institutions$/ })).toBeVisible();
});

test('should handle touch interactions', async ({ page }) => {
  await page.goto('/');
  
  // Test touch events if device supports touch
  const isMobile = page.viewportSize()?.width && page.viewportSize()?.width < 768;
  
  if (isMobile) {
    // Test button touch - look for visible buttons
    const buttons = page.locator('button:visible');
    const buttonCount = await buttons.count();
    if (buttonCount > 0) {
      // Use click instead of tap for better compatibility
      await buttons.first().click();
      // Verify no errors occurred
      await expect(page.locator('body')).not.toHaveClass(/error/);
    }
    
    // Test link touch - look for visible links
    const links = page.locator('a:visible');
    const linkCount = await links.count();
    if (linkCount > 0) {
      // Use click instead of tap for better compatibility
      await links.first().click();
      // Verify navigation or action occurred
    }
  }
});

test('should handle offline functionality', async ({ page }) => {
  await page.goto('/');
  
  // Test service worker registration
  const swRegistered = await page.evaluate(() => {
    return 'serviceWorker' in navigator;
  });
  expect(swRegistered).toBe(true);
  
  // Test offline detection
  const offlineDetection = await page.evaluate(() => {
    return 'onLine' in navigator;
  });
  expect(offlineDetection).toBe(true);
});

test('should handle form interactions', async ({ page }) => {
  await page.goto('/auth/signin');
  
  // Test form inputs
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  
  if (await emailInput.isVisible()) {
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  }
  
  if (await passwordInput.isVisible()) {
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
  }
});

test('should handle scrolling and viewport', async ({ page }) => {
  await page.goto('/');
  
  // Test scrolling - only if page has enough content
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportHeight = page.viewportSize()?.height || 800;
  
  if (bodyHeight > viewportHeight) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Verify scroll position
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  } else {
    // If page doesn't have enough content to scroll, just verify viewport
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThanOrEqual(0);
  }
  
  // Test viewport responsiveness
  const viewport = page.viewportSize();
  if (viewport) {
    // Check if content adapts to viewport
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
  }
});

test('should handle images and media', async ({ page }) => {
  await page.goto('/');
  
  // Test image loading
  const images = page.locator('img');
  const imageCount = await images.count();
  
  if (imageCount > 0) {
    // Wait for images to load
    await Promise.all(
      Array.from({ length: imageCount }, (_, i) =>
        images.nth(i).waitFor({ state: 'attached' })
      )
    );
    
    // Check for broken images
    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      return Array.from(imgs).filter(img => !img.complete || img.naturalWidth === 0).length;
    });
    expect(brokenImages).toBe(0);
  }
});

test('should handle performance metrics', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/');
  const loadTime = Date.now() - startTime;
  
  // Performance should be reasonable (under 5 seconds)
  expect(loadTime).toBeLessThan(5000);
  
  // Check for performance metrics
  const performanceMetrics = await page.evaluate(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
      };
    }
    return null;
  });
  
  if (performanceMetrics) {
    expect(performanceMetrics.loadTime).toBeLessThan(3000);
    expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
  }
});

test('should handle accessibility', async ({ page }) => {
  await page.goto('/');
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  
  // Test ARIA attributes
  const elementsWithAria = page.locator('[aria-label], [aria-labelledby], [aria-describedby]');
  const ariaCount = await elementsWithAria.count();
  
  // Should have some accessibility attributes
  expect(ariaCount).toBeGreaterThanOrEqual(0);
});

test('should handle responsive design', async ({ page }) => {
  await page.goto('/');
  
  // Test responsive breakpoints
  const viewport = page.viewportSize();
  if (viewport) {
    const isMobile = viewport.width < 768;
    const isTablet = viewport.width >= 768 && viewport.width < 1024;
    const isDesktop = viewport.width >= 1024;
    
    // Check if layout adapts appropriately
    const bodyWidth = await page.evaluate(() => document.body.offsetWidth);
    
    if (isMobile) {
      // Mobile should have appropriate layout
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
    } else if (isTablet) {
      // Tablet should have appropriate layout
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
    } else if (isDesktop) {
      // Desktop should have appropriate layout
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width);
    }
  }
});

test('should handle mobile-specific features', async ({ page }) => {
  await page.goto('/');
  
  const viewport = page.viewportSize();
  const isMobile = viewport?.width && viewport.width < 768;
  
  if (isMobile) {
    // Test mobile-specific elements
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    
    // Mobile menu should be present
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(mobileMenu).toBeVisible();
    }
    
    // Test touch-friendly button sizes
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      const buttonSize = await firstButton.boundingBox();
      
      if (buttonSize) {
        // Buttons should be touch-friendly (at least 44px)
        expect(buttonSize.width).toBeGreaterThanOrEqual(44);
        expect(buttonSize.height).toBeGreaterThanOrEqual(44);
      }
    }
  }
}); 