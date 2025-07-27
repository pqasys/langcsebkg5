import { test, expect } from '@playwright/test';

test.describe('Batch 2: Navigation Tests', () => {
  test('should navigate from home to courses', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/courses"]');
    await expect(page).toHaveURL('/courses');
    await expect(page).toHaveTitle(/Courses/);
  });

  test('should navigate from home to institutions', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/institutions"]');
    await expect(page).toHaveURL('/institutions');
    await expect(page).toHaveTitle(/Institutions/);
  });

  test('should navigate from home to about', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page).toHaveTitle(/About/);
  });

  test('should navigate from home to contact', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page).toHaveTitle(/Contact/);
  });

  test('should navigate from home to pricing', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/pricing"]');
    await expect(page).toHaveURL('/pricing');
    await expect(page).toHaveTitle(/Pricing/);
  });

  test('should navigate from home to features', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/features"]');
    await expect(page).toHaveURL('/features');
    await expect(page).toHaveTitle(/Features/);
  });

  test('should navigate from home to students-public', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/students-public"]');
    await expect(page).toHaveURL('/students-public');
    await expect(page).toHaveTitle(/For Students/);
  });

  test('should navigate from home to institutions-public', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/institutions-public"]');
    await expect(page).toHaveURL('/institutions-public');
    await expect(page).toHaveTitle(/For Institutions/);
  });

  test('should navigate from home to auth signin', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/auth/signin"]');
    await expect(page).toHaveURL('/auth/signin');
    await expect(page).toHaveTitle(/Sign In/);
  });

  test('should navigate from home to auth register', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/auth/register"]');
    await expect(page).toHaveURL('/auth/register');
    await expect(page).toHaveTitle(/Register/);
  });
}); 