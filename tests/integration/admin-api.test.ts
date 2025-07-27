import { test, expect } from '@playwright/test';
import { prisma, createTestData } from './setup';

test.describe('Admin API Database Operations', () => {
  let testAdminId: string;
  let testInstitutionId: string;
  let testCourseId: string;
  let testCategoryId: string;

  test.beforeAll(async () => {
    const testData = await createTestData();
    testAdminId = testData.adminUser.id;
    testInstitutionId = testData.institution.id;
    testCourseId = testData.course.id;
    testCategoryId = testData.category.id;
  });

  test.describe('User Management', () => {
    test('should return list of users', async () => {
      const users = await prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });

    test('should support pagination', async () => {
      const page1 = await prisma.user.findMany({
        take: 5,
        skip: 0,
        orderBy: { createdAt: 'desc' }
      });

      const page2 = await prisma.user.findMany({
        take: 5,
        skip: 5,
        orderBy: { createdAt: 'desc' }
      });

      expect(page1.length).toBeLessThanOrEqual(5);
      expect(page2.length).toBeLessThanOrEqual(5);
      
      // Pages should have different users
      const page1Ids = page1.map(u => u.id);
      const page2Ids = page2.map(u => u.id);
      const intersection = page1Ids.filter(id => page2Ids.includes(id));
      expect(intersection.length).toBe(0);
    });

    test('should filter by role', async () => {
      const adminUsers = await prisma.user.findMany({
        where: { role: 'ADMIN' }
      });

      const studentUsers = await prisma.user.findMany({
        where: { role: 'STUDENT' }
      });

      expect(adminUsers.every(u => u.role === 'ADMIN')).toBe(true);
      expect(studentUsers.every(u => u.role === 'STUDENT')).toBe(true);
    });

    test('should update user status', async () => {
      const testUser = await prisma.user.create({
        data: {
          email: 'status.test@example.com',
          name: 'Status Test User',
          password: 'hashedpassword',
          role: 'STUDENT',
          status: 'ACTIVE'
        }
      });

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

  test.describe('Institution Management', () => {
    test('should return list of institutions', async () => {
      const institutions = await prisma.institution.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      expect(Array.isArray(institutions)).toBe(true);
      expect(institutions.length).toBeGreaterThan(0);
    });

    test('should include institution details', async () => {
      const institution = await prisma.institution.findFirst({
        where: { id: testInstitutionId },
        include: {
          users: true
        }
      });

      expect(institution).toBeDefined();
      expect(institution).toHaveProperty('name');
      expect(institution).toHaveProperty('email');
      expect(institution).toHaveProperty('users');
    });
  });

  test.describe('Course Management', () => {
    test('should return list of courses', async () => {
      const courses = await prisma.course.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' }
      });

      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
    });

    test('should include course details with relations', async () => {
      const course = await prisma.course.findFirst({
        where: { id: testCourseId },
        include: {
          institution: true,
          category: true,
          courseTags: {
            include: {
              tag: true
            }
          }
        }
      });

      expect(course).toBeDefined();
      expect(course).toHaveProperty('title');
      expect(course).toHaveProperty('institution');
      expect(course).toHaveProperty('category');
    });

    test('should filter by institution', async () => {
      const institutionCourses = await prisma.course.findMany({
        where: { institutionId: testInstitutionId }
      });

      expect(institutionCourses.every(c => c.institutionId === testInstitutionId)).toBe(true);
    });
  });

  test.describe('Admin Statistics', () => {
    test('should return admin statistics', async () => {
      const userCount = await prisma.user.count();
      const institutionCount = await prisma.institution.count();
      const courseCount = await prisma.course.count();
      const studentCount = await prisma.user.count({
        where: { role: 'STUDENT' }
      });

      const stats = {
        totalUsers: userCount,
        totalInstitutions: institutionCount,
        totalCourses: courseCount,
        totalStudents: studentCount
      };

      expect(stats.totalUsers).toBeGreaterThan(0);
      expect(stats.totalInstitutions).toBeGreaterThan(0);
      expect(stats.totalCourses).toBeGreaterThan(0);
      expect(stats.totalStudents).toBeGreaterThanOrEqual(0);
    });
  });
}); 