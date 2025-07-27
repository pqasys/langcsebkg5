import { chromium, FullConfig } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function globalSetup(config: FullConfig) {
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('🚀 Starting global setup...');

  try {
    // Clean up any existing test data
    await cleanupTestData();

    // Create test users
    await createTestUsers();

    // Create test institutions
    await createTestInstitutions();

    // Create test courses
    await createTestCourses();

    // Verify test data was created successfully
    await verifyTestData();

    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function cleanupTestData() {
  console.log('🧹 Cleaning up test data...');
  
  // Delete in reverse order to handle foreign key constraints
  await prisma.quizResponse.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.quizAttempt.deleteMany({
    where: {
      student_id: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.studentAchievement.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.learningSession.deleteMany({
    where: {
      moduleProgressId: {
        in: await prisma.moduleProgress.findMany({
          where: {
            studentId: {
              in: await prisma.student.findMany({
                where: { email: { contains: 'test.' } },
                select: { id: true }
              }).then(students => students.map(s => s.id))
            }
          },
          select: { id: true }
        }).then(moduleProgresses => moduleProgresses.map(mp => mp.id))
      }
    }
  });
  
  await prisma.moduleProgress.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.payment.deleteMany({
    where: {
      enrollmentId: {
        in: await prisma.studentCourseEnrollment.findMany({
          where: {
            studentId: {
              in: await prisma.student.findMany({
                where: { email: { contains: 'test.' } },
                select: { id: true }
              }).then(students => students.map(s => s.id))
            }
          },
          select: { id: true }
        }).then(enrollments => enrollments.map(e => e.id))
      }
    }
  });
  
  await prisma.studentCourseEnrollment.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.studentCourseCompletion.deleteMany({
    where: {
      studentId: {
        in: await prisma.student.findMany({
          where: { email: { contains: 'test.' } },
          select: { id: true }
        }).then(students => students.map(s => s.id))
      }
    }
  });
  
  await prisma.user.deleteMany({
    where: { email: { contains: 'test.' } }
  });
  
  await prisma.institution.deleteMany({
    where: { name: { contains: 'Test Institution' } }
  });
  
  await prisma.course.deleteMany({
    where: { title: { contains: 'Test Course' } }
  });
}

async function createTestUsers() {
  console.log('👥 Creating test users...');
  
  const hashedPassword = await hash('testpassword123', 10);
  
  // Create test admin
  const testAdmin = await prisma.user.upsert({
    where: { email: 'test.admin@example.com' },
    update: {
      name: 'Test Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    },
    create: {
      email: 'test.admin@example.com',
      name: 'Test Admin',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });
  
  console.log(` Created admin user: ${testAdmin.email}`);
  
  // Create test institution user
  const testInstitution = await prisma.institution.create({
    data: {
      name: 'Test Institution',
      description: 'Test institution for E2E testing',
      address: '123 Test St',
      city: 'Test City',
      country: 'Test Country',
      email: 'test@institution.com',
      status: 'APPROVED',
      isApproved: true
    }
  });
  
  const testInstitutionUser = await prisma.user.upsert({
    where: { email: 'test.institution@example.com' },
    update: {
      name: 'Test Institution User',
      password: hashedPassword,
      role: 'INSTITUTION',
      institutionId: testInstitution.id,
      status: 'ACTIVE'
    },
    create: {
      email: 'test.institution@example.com',
      name: 'Test Institution User',
      password: hashedPassword,
      role: 'INSTITUTION',
      institutionId: testInstitution.id,
      status: 'ACTIVE'
    }
  });
  
  console.log(` Created institution user: ${testInstitutionUser.email}`);
  
  // Create test student
  const testStudent = await prisma.user.upsert({
    where: { email: 'test.student@example.com' },
    update: {
      name: 'Test Student',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE'
    },
    create: {
      email: 'test.student@example.com',
      name: 'Test Student',
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE'
    }
  });

  console.log(` Created student user: ${testStudent.email}`);

  // Create student profile with the same ID as the user
  const existingStudent = await prisma.student.findFirst({
    where: { 
      OR: [
        { id: testStudent.id },
        { email: testStudent.email }
      ]
    }
  });

  if (!existingStudent) {
    await prisma.student.create({
      data: {
        id: testStudent.id, // Use the same ID as the user
        email: testStudent.email,
        name: testStudent.name,
        status: 'active'
      }
    });
    console.log(` Created student profile for: ${testStudent.email}`);
  } else if (existingStudent.id !== testStudent.id) {
    // If student exists but with different ID, update it
    await prisma.student.update({
      where: { id: existingStudent.id },
      data: {
        id: testStudent.id,
        email: testStudent.email,
        name: testStudent.name,
        status: 'active'
      }
    });
    console.log(` Updated student profile for: ${testStudent.email}`);
  } else {
    console.log(` Student profile already exists for: ${testStudent.email}`);
  }
}

async function createTestInstitutions() {
  console.log('🏫 Creating test institutions...');

  // Check if the institution exists by email
  const existing = await prisma.institution.findFirst({
    where: { email: 'test2@institution.com' }
  });

  if (existing) {
    // Optionally update it if you want to ensure fields are correct
    await prisma.institution.update({
      where: { id: existing.id },
      data: {
        name: 'Test Institution 2',
        description: 'Second test institution for E2E testing',
        address: '456 Test Ave',
        city: 'Test City 2',
        country: 'Test Country',
        status: 'APPROVED',
        isApproved: true
      }
    });
    console.log('✅ Updated Test Institution 2');
  } else {
    await prisma.institution.create({
      data: {
        name: 'Test Institution 2',
        description: 'Second test institution for E2E testing',
        address: '456 Test Ave',
        city: 'Test City 2',
        country: 'Test Country',
        email: 'test2@institution.com',
        status: 'APPROVED',
        isApproved: true
      }
    });
    console.log('✅ Created Test Institution 2');
  }
}

async function createTestCourses() {
  console.log('📚 Creating test courses...');
  
  const institution = await prisma.institution.findFirst({
    where: { name: 'Test Institution' }
  });
  
  const category = await prisma.category.findFirst();
  
  if (!institution || !category) {
    console.log('⚠️ Skipping course creation - missing institution or category');
    return;
  }
  
  // Check if the course exists by title and institution
  const existing = await prisma.course.findFirst({
    where: { 
      title: 'Test Course - E2E Testing',
      institutionId: institution.id
    }
  });

  let course;
  if (existing) {
    // Update the existing course
    course = await prisma.course.update({
      where: { id: existing.id },
      data: {
        description: 'A test course for E2E testing scenarios',
        duration: 30,
        level: 'BEGINNER',
        status: 'ACTIVE',
        categoryId: category.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxStudents: 20,
        base_price: 100,
        pricingPeriod: 'FULL_COURSE'
      }
    });
    console.log('✅ Updated Test Course - E2E Testing');
  } else {
    course = await prisma.course.create({
      data: {
        title: 'Test Course - E2E Testing',
        description: 'A test course for E2E testing scenarios',
        duration: 30,
        level: 'BEGINNER',
        status: 'ACTIVE',
        institutionId: institution.id,
        categoryId: category.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        maxStudents: 20,
        base_price: 100,
        pricingPeriod: 'FULL_COURSE'
      }
    });
    console.log('✅ Created Test Course - E2E Testing');
  }

  // Create course enrollment for test student
  const testStudent = await prisma.student.findFirst({
    where: { email: 'test.student@example.com' }
  });

  if (testStudent && course) {
    // Check if enrollment already exists
    const existingEnrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        studentId: testStudent.id,
        courseId: course.id
      }
    });

    if (!existingEnrollment) {
      await prisma.studentCourseEnrollment.create({
        data: {
          studentId: testStudent.id,
          courseId: course.id,
          status: 'ACTIVE',
          progress: 25,
          startDate: new Date()
        }
      });
      console.log('✅ Created course enrollment for test student');
    } else {
      console.log('✅ Course enrollment already exists for test student');
    }
  }
}

async function verifyTestData() {
  console.log('🔍 Verifying test data...');
  
  // Verify users exist
  const admin = await prisma.user.findUnique({
    where: { email: 'test.admin@example.com' }
  });
  const student = await prisma.user.findUnique({
    where: { email: 'test.student@example.com' }
  });
  const institution = await prisma.user.findUnique({
    where: { email: 'test.institution@example.com' }
  });
  
  if (!admin || !student || !institution) {
    throw new Error(`Test users not created properly - Context: throw new Error('Test users not created properly')...`);
  }
  
  // Verify student profile exists
  const studentProfile = await prisma.student.findUnique({
    where: { email: 'test.student@example.com' }
  });
  
  if (!studentProfile) {
    throw new Error(`Student profile not created properly - Context: where: { email: 'test.student@example.com' }...`);
  }
  
  // Verify institutions exist
  const testInstitution = await prisma.institution.findFirst({
    where: { name: 'Test Institution' }
  });
  
  if (!testInstitution) {
    throw new Error(`Test institution not created properly - Context: const testInstitution = await prisma.institution.f...`);
  }
  
  // Verify course exists
  const testCourse = await prisma.course.findFirst({
    where: { title: 'Test Course - E2E Testing' }
  });
  
  if (!testCourse) {
    console.log('⚠️ Test course not created - this is optional');
  }
  
  console.log('✅ All test data verified successfully');
}

export default globalSetup; 