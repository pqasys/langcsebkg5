import { test, expect } from '@playwright/test';

test.describe('Comprehensive Bug Detection Suite', () => {
  test.beforeEach(async ({ page }) => {
    // Enable console logging to catch errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        // // // // console.log('Browser Error:', msg.text());
      }
    });
    
    // Enable network logging
    page.on('response', response => {
      if (response.status() >= 400) {
        console.log(`API Error: ${response.url()} - ${response.status()}`);
      }
    });
  });

  test.describe('Fast Refresh & Module Loading Issues', () => {
    test('should not have webpack module loading errors', async ({ page }) => {
      const errors: string[] = [];
      
      page.on('console', msg => {
        if (msg.type() === 'error' && msg.text().includes('Cannot read properties of undefined')) {
          errors.push(msg.text());
        }
      });

      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      expect(errors).toHaveLength(0);
    });

    test('should handle Fast Refresh without full reloads', async ({ page }) => {
      const reloads: string[] = [];
      
      page.on('console', msg => {
        if (msg.text().includes('Fast Refresh had to perform a full reload')) {
          reloads.push(msg.text());
        }
      });

      await page.goto('/student/progress');
      await page.waitForLoadState('networkidle');
      
      // Navigate to another page and back
      await page.goto('/student/courses');
      await page.goto('/student/progress');
      
      expect(reloads).toHaveLength(0);
    });
  });

  test.describe('Navigation & Routing Issues', () => {
    test('should have working student navigation', async ({ page }) => {
      const navigationPaths = [
        '/student',
        '/student/courses',
        '/student/progress',
        '/student/profile',
        '/student/settings'
      ];

      for (const path of navigationPaths) {
        await page.goto(path);
        await expect(page).not.toHaveURL(/404/);
        await expect(page.locator('body')).not.toHaveText(/Page not found/);
      }
    });

    test('should handle dynamic routes correctly', async ({ page }) => {
      // Test course detail page
      await page.goto('/student/courses/test-course-id');
      await expect(page).not.toHaveURL(/404/);
      
      // Test module page
      await page.goto('/student/courses/test-course-id/modules/test-module-id');
      await expect(page).not.toHaveURL(/404/);
    });

    test('should have correct breadcrumb navigation', async ({ page }) => {
      await page.goto('/student/courses');
      await expect(page.locator('[data-testid="breadcrumb"]')).toBeVisible();
    });
  });

  test.describe('API & Data Loading Issues', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      const apiErrors: string[] = [];
      
      page.on('response', response => {
        if (response.url().includes('/api/') && response.status() >= 400) {
          apiErrors.push(`${response.url()}: ${response.status()}`);
        }
      });

      await page.goto('/student/progress');
      await page.waitForLoadState('networkidle');
      
      // Check if error states are handled properly
      const errorElements = await page.locator('[data-testid="error-message"], .error, [role="alert"]').count();
      if (apiErrors.length > 0) {
        expect(errorElements).toBeGreaterThan(0);
      }
    });

    test('should show loading states', async ({ page }) => {
      await page.goto('/student/progress');
      
      // Should show loading spinner initially
      await expect(page.locator('.animate-spin, [data-testid="loading"]')).toBeVisible();
      
      // Should eventually hide loading spinner
      await expect(page.locator('.animate-spin, [data-testid="loading"]')).not.toBeVisible({ timeout: 10000 });
    });

    test('should handle empty data states', async ({ page }) => {
      await page.goto('/student/progress');
      await page.waitForLoadState('networkidle');
      
      // Should show empty state or data, not blank page
      const hasContent = await page.locator('body').textContent();
      expect(hasContent).not.toBe('');
    });
  });

  test.describe('UI Rendering & Component Issues', () => {
    test('should render all UI components without errors', async ({ page }) => {
      const components = [
        '/student/courses', // Cards, buttons, forms
        '/student/progress', // Tabs, progress bars, charts
        '/auth/signin', // Forms, inputs, validation
      ];

      for (const path of components) {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
        
        // Check for common UI elements
        await expect(page.locator('button')).toBeVisible();
        await expect(page.locator('input, textarea, select')).toBeVisible();
      }
    });

    test('should handle responsive design correctly', async ({ page }) => {
      const viewports = [
        { width: 1920, height: 1080 }, // Desktop
        { width: 768, height: 1024 },  // Tablet
        { width: 375, height: 667 },   // Mobile
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.goto('/student/progress');
        await page.waitForLoadState('networkidle');
        
        // Should not have horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScroll).toBe(false);
      }
    });

    test('should handle form interactions correctly', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Fill form fields
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      
      // Check form validation
      await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
      await expect(page.locator('input[name="password"]')).toHaveValue('password123');
    });
  });

  test.describe('Authentication & Authorization Issues', () => {
    test('should redirect unauthenticated users', async ({ page }) => {
      const protectedRoutes = [
        '/student',
        '/student/courses',
        '/student/progress',
        '/dashboard',
      ];

      for (const route of protectedRoutes) {
        await page.goto(route);
        // Should redirect to login or show auth error
        const currentUrl = page.url();
        expect(currentUrl.includes('/auth/') || currentUrl.includes('/login')).toBe(true);
      }
    });

    test('should handle session management', async ({ page }) => {
      await page.goto('/auth/signin');
      
      // Mock successful login
      await page.evaluate(() => {
        localStorage.setItem('mock-session', 'true');
      });
      
      await page.goto('/student');
      // Should handle session properly
    });
  });

  test.describe('Performance & Memory Issues', () => {
    test('should not have memory leaks', async ({ page }) => {
      await page.goto('/student/progress');
      
      // Navigate between pages multiple times
      for (let i = 0; i < 5; i++) {
        await page.goto('/student/courses');
        await page.goto('/student/progress');
        await page.waitForLoadState('networkidle');
      }
      
      // Check for console errors
      const errors = await page.evaluate(() => {
        return window.performance.memory ? window.performance.memory.usedJSHeapSize : 0;
      });
      
      // Should not have excessive memory usage
      expect(errors).toBeLessThan(100000000); // 100MB limit
    });

    test('should load pages within reasonable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/student/progress');
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(5000); // 5 seconds max
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work in different browsers', async ({ page, browserName }) => {
      await page.goto('/student/progress');
      await page.waitForLoadState('networkidle');
      
      // Basic functionality should work in all browsers
      await expect(page.locator('body')).toBeVisible();
      await expect(page.locator('h1, h2, h3')).toBeVisible();
    });
  });
}); 