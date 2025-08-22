import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = [
    {
      id: uuidv4(),
      name: 'General Language',
      description: 'Courses for everyday language communication',
      slug: 'general-language',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Business Language',
      description: 'Courses for professional and business language',
      slug: 'business-language',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Exam Preparation',
      description: 'Courses for language proficiency exams (IELTS, TOEFL, Cambridge, DELF, DELE, etc.)',
      slug: 'exam-preparation',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Conversation Skills',
      description: 'Courses focused on speaking and listening',
      slug: 'conversation-skills',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Categories seeded successfully');

  // Seed tags
  const tags = [
    { id: uuidv4(), name: 'Beginner', description: 'For beginners', slug: 'beginner' },
    { id: uuidv4(), name: 'Intermediate', description: 'For intermediate learners', slug: 'intermediate' },
    { id: uuidv4(), name: 'Advanced', description: 'For advanced learners', slug: 'advanced' },
    { id: uuidv4(), name: 'IELTS', description: 'IELTS exam prep', slug: 'ielts' },
    { id: uuidv4(), name: 'TOEFL', description: 'TOEFL exam prep', slug: 'toefl' },
    { id: uuidv4(), name: 'Cambridge', description: 'Cambridge exam prep', slug: 'cambridge' },
    { id: uuidv4(), name: 'Speaking', description: 'Speaking skills', slug: 'speaking' },
    { id: uuidv4(), name: 'Writing', description: 'Writing skills', slug: 'writing' },
    { id: uuidv4(), name: 'Listening', description: 'Listening skills', slug: 'listening' },
    { id: uuidv4(), name: 'Reading', description: 'Reading skills', slug: 'reading' },
    { id: uuidv4(), name: 'Business', description: 'Business English', slug: 'business' },
    { id: uuidv4(), name: 'Grammar', description: 'Grammar focus', slug: 'grammar' },
    { id: uuidv4(), name: 'Vocabulary', description: 'Vocabulary building', slug: 'vocabulary' }
  ];
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: {
        id: uuidv4(),
        ...tag,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
  console.log('Tags seeded successfully');

  // Seed institutions (using your existing ones and one more for demo)
  const institutions = [
    {
      id: uuidv4(),
      name: 'XYZ Language School',
      description: 'A leading language school in London',
      address: '123 Education Street',
      city: 'London',
      state: 'Greater London',
      country: 'United Kingdom',
      postcode: 'SW1A 1AA',
      email: 'jbloggs@xyz.com',
      website: 'https://xyz-languageschool.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      institutionEmail: 'contact@xyz-languageschool.com',
      telephone: '+44 20 1234 5678',
      contactName: 'John Bloggs',
      contactJobTitle: 'Director',
      contactPhone: '+44 20 1234 5678',
      contactEmail: 'jbloggs@xyz.com',
      logoUrl: null,
      facilities: 'Library, Computer Lab, Student Lounge',
      status: 'APPROVED',
      isApproved: true,
      currency: 'GBP',
      commissionRate: 10,
      socialMedia: {},
      metadata: {},
      discountSettings: {
        enabled: true,
        startingRate: 5,
        incrementRate: 2.5,
        incrementPeriodWeeks: 4,
        maxDiscountCap: 50
      }
    },
    {
      id: uuidv4(),
      name: 'ABC Academy',
      description: 'International English academy in Manchester',
      address: '456 Academy Road',
      city: 'Manchester',
      state: 'Greater Manchester',
      country: 'United Kingdom',
      postcode: 'M1 2AB',
      email: 'tjones@abc.ac.uk',
      website: 'https://abc-academy.co.uk',
      createdAt: new Date(),
      updatedAt: new Date(),
      institutionEmail: 'info@abc-academy.co.uk',
      telephone: '+44 161 123 4567',
      contactName: 'Tom Jones',
      contactJobTitle: 'Principal',
      contactPhone: '+44 161 123 4567',
      contactEmail: 'tjones@abc.ac.uk',
      logoUrl: null,
      facilities: 'Cafeteria, Study Rooms, WiFi',
      status: 'APPROVED',
      isApproved: true,
      currency: 'GBP',
      commissionRate: 12,
      socialMedia: {},
      metadata: {},
      discountSettings: {
        enabled: true,
        startingRate: 7,
        incrementRate: 3,
        incrementPeriodWeeks: 4,
        maxDiscountCap: 40
      }
    }
  ];
  for (const inst of institutions) {
    await prisma.institution.upsert({
      where: { id: inst.id },
      update: {},
      create: inst,
    });
  }
  console.log('Institutions seeded successfully');

  // Save admin settings (relevant section) for future re-use
  const adminSettings = {
    categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
    tags: tags.map(t => ({ id: t.id, name: t.name, slug: t.slug })),
    institutions: institutions.map(i => ({ id: i.id, name: i.name, email: i.email }))
  };
  fs.writeFileSync(path.join(__dirname, 'admin_settings.json'), JSON.stringify(adminSettings, null, 2));
  console.log('Admin settings saved to admin_settings.json');

  // Seed users (admin and institution users)
  const users = [
    {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE'
    },
    {
      id: uuidv4(),
      name: 'John Bloggs',
      email: 'jbloggs@xyz.com',
      password: await bcrypt.hash('jbloggs', 10),
      role: 'INSTITUTION',
      institutionId: institutions[0].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE'
    },
    {
      id: uuidv4(),
      name: 'Tom Jones',
      email: 'tjones@abc.ac.uk',
      password: await bcrypt.hash('tjones', 10),
      role: 'INSTITUTION',
      institutionId: institutions[1].id,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE'
    }
  ];
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
  console.log('Users seeded successfully');

  // Note: live conversations are seeded via a separate one-off script to avoid touching other tables

  // Seed students first
  const students = [
    {
      id: uuidv4(),
      name: 'Student One',
      email: 'student1@test.com',
      phone: '+44 20 1234 5678',
      address: '789 Student Lane, London',
      bio: 'Learning English for work',
      status: 'active' as const,
      created_at: new Date(),
      updated_at: new Date(),
      last_active: new Date()
    },
    {
      id: uuidv4(),
      name: 'Student Two',
      email: 'student2@test.com',
      phone: '+44 20 8765 4321',
      address: '101 Student Road, Manchester',
      bio: 'Learning English for travel',
      status: 'active' as const,
      created_at: new Date(),
      updated_at: new Date(),
      last_active: new Date()
    }
  ];

  // Create students first
  for (const student of students) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: {},
      create: student
    });
  }
  console.log('Students seeded successfully');

  // Seed courses
  const courses = [];
  for (const inst of institutions) {
    for (let i = 0; i < 3; i++) {
      const course = await prisma.course.create({
        data: {
          id: uuidv4(),
          title: `${inst.name} Course ${i + 1}`,
          description: `A comprehensive course at ${inst.name}`,
          duration: 12,
          level: 'INTERMEDIATE',
          status: 'ACTIVE',
          institutionId: inst.id,
          categoryId: categories[i % categories.length].id,
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          maxStudents: 20,
          base_price: 299.99,
          pricingPeriod: 'WEEKLY',
          framework: 'CEFR'
        }
      });
      courses.push(course);
    }
  }
  console.log('Courses seeded successfully');

  // Link courses to tags via CourseTag
  for (const course of courses) {
    for (let i = 0; i < 3; i++) {
      await prisma.courseTag.create({
        data: {
          id: uuidv4(),
          courseId: course.id,
          tagId: tags[i % tags.length].id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  }
  console.log('Course tags linked successfully');

  // Seed modules
  const modules = [];
  for (const course of courses) {
    for (let i = 0; i < 3; i++) {
      const module = await prisma.modules.create({
        data: {
          id: uuidv4(),
          course_id: course.id,
          title: `Module ${i + 1} for ${course.title}`,
          description: `Description for module ${i + 1}`,
          level: 'CEFR_B1',
          order_index: i,
          estimated_duration: 2,
          vocabulary_list: 'Key vocabulary for this module',
          grammar_points: 'Key grammar for this module',
          cultural_notes: 'Cultural insights for this module',
          is_published: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      modules.push(module);
    }
  }
  console.log('Modules seeded successfully');

  // Seed module skills
  const skillSet = ['Speaking', 'Listening', 'Reading'];
  for (const module of modules) {
    for (const skill of skillSet) {
      await prisma.module_skills.create({
        data: {
          module_id: module.id,
          skill
        }
      });
    }
  }
  console.log('Module skills seeded successfully');

  // Seed quizzes
  const quizzes = [];
  for (const module of modules) {
    for (let i = 0; i < 3; i++) {
      const quiz = await prisma.quizzes.create({
        data: {
          id: uuidv4(),
          module_id: module.id,
          title: `Quiz ${i + 1} for ${module.title}`,
          description: `Description for quiz ${i + 1}`,
          passing_score: 70,
          time_limit: 30,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      quizzes.push(quiz);
    }
  }
  console.log('Quizzes seeded successfully');

  // Seed quiz questions
  for (const quiz of quizzes) {
    for (let i = 0; i < 3; i++) {
      await prisma.quiz_questions.create({
        data: {
          id: uuidv4(),
          quiz_id: quiz.id,
          type: 'MULTIPLE_CHOICE',
          question: `Question ${i + 1} for ${quiz.title}`,
          options: JSON.stringify(['Option A', 'Option B', 'Option C', 'Option D']),
          correct_answer: 'Option A',
          points: 10,
          order_index: i,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }
  }
  console.log('Quiz questions seeded successfully');

  // Update enrollment creation to use student IDs
  for (const course of courses) {
    for (const student of students) {
      const enrollment = await prisma.studentCourseEnrollment.create({
        data: {
          id: uuidv4(),
          studentId: student.id,
          courseId: course.id,
          status: 'ACTIVE',
          progress: 0,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          paymentStatus: 'COMPLETED',
          paymentDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      // Create payment for the enrollment
      await prisma.payment.create({
        data: {
          id: uuidv4(),
          amount: course.base_price,
          status: 'COMPLETED',
          paymentMethod: 'CREDIT_CARD',
          institutionId: course.institutionId,
          enrollmentId: enrollment.id,
          commissionAmount: course.base_price * 0.1, // 10% commission
          institutionAmount: course.base_price * 0.9, // 90% to institution
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }
  }
  console.log('Enrollments seeded successfully');

  // Save admin settings (relevant section) for future re-use
  const finalAdminSettings = {
    categories: categories.map(c => ({ id: c.id, name: c.name, slug: c.slug })),
    tags: tags.map(t => ({ id: t.id, name: t.name, slug: t.slug })),
    institutions: institutions.map(i => ({ id: i.id, name: i.name, email: i.email })),
    courses: courses.map(c => ({ id: c.id, title: c.title, institutionId: c.institutionId })),
    modules: modules.map(m => ({ id: m.id, title: m.title, course_id: m.course_id })),
    quizzes: quizzes.map(q => ({ id: q.id, title: q.title, module_id: q.module_id }))
  };
  fs.writeFileSync(path.join(__dirname, 'admin_settings.json'), JSON.stringify(finalAdminSettings, null, 2));
  console.log('Final admin settings saved to admin_settings.json');

  // Create admin user if it doesn't exist
  const adminEmail = 'admin@example.com';
  const adminPassword = await hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      id: '1',
      email: adminEmail,
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create default email settings if they don't exist
  const emailSettings = await prisma.emailSettings.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      host: 'smtp.example.com',
      port: 587,
      secure: true,
      username: 'your-email@example.com',
      password: 'your-password',
      fromEmail: 'your-email@example.com',
      fromName: 'Your Name'
    },
  });

  console.log({ admin, emailSettings });

  console.log('Starting progress initialization...');

  // Get all active enrollments first
  const enrollments = await prisma.studentCourseEnrollment.findMany({
    where: {
      status: 'ACTIVE'
    }
  });

  console.log(`Found ${enrollments.length} active enrollments`);

  // Filter enrollments with valid courses and get course data
  const validEnrollments = [];
  for (const enrollment of enrollments) {
    try {
      const course = await prisma.course.findUnique({
        where: { id: enrollment.courseId },
        include: {
          modules: true
        }
      });
      
      if (course) {
        validEnrollments.push({
          ...enrollment,
          course
        });
      } else {
        console.log(`Skipping enrollment ${enrollment.id} - course ${enrollment.courseId} not found`);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      console.log(`Error fetching course for enrollment ${enrollment.id}:`, error.message);
    }
  }

  console.log(`Found ${validEnrollments.length} valid enrollments with courses`);

  // Initialize progress for each module in each enrollment
  for (const enrollment of validEnrollments) {
    console.log(`Processing enrollment ${enrollment.id} for course ${enrollment.course.title}`);
    
    for (const module of enrollment.course.modules) {
      // Check if progress already exists
      const existingProgress = await prisma.moduleProgress.findFirst({
        where: {
          AND: [
            { moduleId: module.id },
            { studentId: enrollment.studentId }
          ]
        }
      });

      if (!existingProgress) {
        // Create initial progress record
        await prisma.moduleProgress.create({
          data: {
            moduleId: module.id,
            studentId: enrollment.studentId,
            contentCompleted: false,
            exercisesCompleted: false,
            quizCompleted: false,
            startedAt: new Date()
          }
        });
        console.log(`Created progress for module ${module.title}`);
      } else {
        console.log(`Progress already exists for module ${module.title}`);
      }
    }
  }

  console.log('Progress initialization completed');
}

main()
  .catch((e) => {
    console.error('Error during progress initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 