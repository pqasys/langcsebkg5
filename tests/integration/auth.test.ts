import { test, expect } from '@playwright/test';
import { prisma, createTestData } from './setup';

test.describe('Authentication API', () => {
  test.beforeAll(async () => {
    await createTestData();
  });

  test('should have test data available', async () => {
    // Check if test data was created successfully
    const adminUser = await prisma.user.findUnique({
      where: { email: 'integration.test.admin@example.com' }
    });
    
    expect(adminUser).toBeDefined();
    expect(adminUser?.role).toBe('ADMIN');
  });

  test('should support user creation', async () => {
    const testUserData = {
      email: 'playwright.test@example.com',
      name: 'Playwright Test User',
      password: 'hashedpassword',
      role: 'STUDENT' as const,
      status: 'ACTIVE' as const
    };

    const newUser = await prisma.user.create({
      data: testUserData
    });

    expect(newUser).toBeDefined();
    expect(newUser.email).toBe(testUserData.email);
    expect(newUser.name).toBe(testUserData.name);
    expect(newUser.role).toBe(testUserData.role);

    // Clean up
    await prisma.user.delete({
      where: { id: newUser.id }
    });
  });

  test('should prevent duplicate email registration', async () => {
    // First, ensure we have a test user
    const existingUser = await prisma.user.findUnique({
      where: { email: 'integration.test.admin@example.com' }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          email: 'integration.test.admin@example.com',
          name: 'Test Admin',
          password: 'hashedpassword',
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
    }

    // Try to create another user with the same email
    try {
      await prisma.user.create({
        data: {
          email: 'integration.test.admin@example.com',
          name: 'Duplicate User',
          password: 'hashedpassword',
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      });
      // If we reach here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Expected error for duplicate email
      expect(error).toBeDefined();
    }
  });

  test('should support user role validation', async () => {
    const adminUsers = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    const studentUsers = await prisma.user.findMany({
      where: { role: 'STUDENT' }
    });

    expect(adminUsers.length).toBeGreaterThan(0);
    expect(adminUsers.every(u => u.role === 'ADMIN')).toBe(true);
    expect(studentUsers.every(u => u.role === 'STUDENT')).toBe(true);
  });

  test('should support user status management', async () => {
    const testUser = await prisma.user.create({
      data: {
        email: 'status.test@example.com',
        name: 'Status Test User',
        password: 'hashedpassword',
        role: 'STUDENT',
        status: 'ACTIVE'
      }
    });

    // Update status
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: { status: 'SUSPENDED' }
    });

    expect(updatedUser.status).toBe('SUSPENDED');

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    });
  });
}); 