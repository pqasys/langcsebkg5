import { PrismaClient } from '@prisma/client';
import { test } from '@playwright/test';

const prisma = new PrismaClient();

export { prisma };

export async function cleanupTestData() {
  // // // // console.log('🧹 Cleaning up integration test data...');

  // Delete in reverse order to handle foreign key constraints
  await prisma.quizResponse.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'integration.test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });

  await prisma.quizAttempt.deleteMany({
    where: {
      student_id: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'integration.test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });

  await prisma.studentCourseEnrollment.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'integration.test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });

  await prisma.studentCourseCompletion.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'integration.test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });

  await prisma.booking.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'integration.test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });

  await prisma.student.deleteMany({
    where: { email: { contains: 'integration.test.' } }
  });

  await prisma.user.deleteMany({
    where: { email: { contains: 'integration.test.' } }
  });

  await prisma.course.deleteMany({
    where: { title: { contains: 'Integration Test Course' } }
  });

  await prisma.institution.deleteMany({
    where: { name: { contains: 'Integration Test Institution' } }
  });

  await prisma.category.deleteMany({
    where: { name: { contains: 'Test Category' } }
  });

  console.log('✅ Test data cleanup completed');
}

export async function createTestData() {
  // Institution
  let institution = await prisma.institution.findFirst({
    where: { name: 'Integration Test Institution' }
  });
  if (!institution) {
    institution = await prisma.institution.create({
      data: {
        name: 'Integration Test Institution',
        description: 'Test institution for integration tests',
        address: '123 Test St',
        city: 'Test City',
        country: 'Test Country',
        email: 'test@institution.com',
        status: 'APPROVED',
        isApproved: true
      }
    });
  }

  // Admin user
  let adminUser = await prisma.user.findUnique({
    where: { email: 'integration.test.admin@example.com' }
  });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: 'integration.test.admin@example.com',
        name: 'Test Admin',
        password: 'hashedpassword',
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
  }

  // Category
  let category = await prisma.category.findFirst({
    where: { name: 'Test Category' }
  });
  if (!category) {
    category = await prisma.category.create({
      data: {
        name: 'Test Category',
        description: 'Test category for integration tests',
        slug: 'test-category'
      }
    });
  }

  // Course
  let course = await prisma.course.findFirst({
    where: { title: 'Integration Test Course' }
  });
  if (!course) {
    course = await prisma.course.create({
      data: {
        title: 'Integration Test Course',
        description: 'Test course for integration tests',
        duration: 30,
        level: 'BEGINNER',
        status: 'PUBLISHED',
        institutionId: institution.id,
        categoryId: category.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxStudents: 20,
        base_price: 99.99,
        pricingPeriod: 'WEEKLY',
        framework: 'CEFR'
      }
    });
  }

  return { institution, adminUser, category, course };
}

// Only run cleanup before all and after all tests
test.beforeAll(async () => {
  await cleanupTestData();
});
test.afterAll(async () => {
  await cleanupTestData();
  await prisma.$disconnect();
}); 