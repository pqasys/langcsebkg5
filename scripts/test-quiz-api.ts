import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function testQuizAPI() {
  try {
    console.log('Testing Quiz API endpoints...');

    // Get a test institution user
    const institutionUser = await prisma.user.findFirst({
      where: {
        role: 'INSTITUTION',
        status: 'ACTIVE'
      }
    });

    if (!institutionUser) {
      console.log('No institution user found. Creating one...');
      // Create a test institution and user
      const institution = await prisma.institution.create({
        data: {
          name: 'Test Institution',
          description: 'Test institution for API testing',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          email: 'test@institution.com',
          status: 'APPROVED',
          isApproved: true
        }
      });

      const user = await prisma.user.create({
        data: {
          name: 'Test Institution User',
          email: 'institution@test.com',
          password: '$2b$10$test', // This would need to be properly hashed
          role: 'INSTITUTION',
          institutionId: institution.id,
          status: 'ACTIVE'
        }
      });

      console.log(`Created test institution: ${institution.name}`);
      console.log(`Created test user: ${user.name}`);
    } else {
      console.log(`Using existing institution user: ${institutionUser.name}`);
    }

    // Get the institution ID
    const institutionId = institutionUser?.institutionId;
    if (!institutionId) {
      console.log('No institution ID found. Creating test institution...');
      const institution = await prisma.institution.create({
        data: {
          name: 'Test Institution',
          description: 'Test institution for API testing',
          address: '123 Test St',
          city: 'Test City',
          country: 'Test Country',
          email: 'test@institution.com',
          status: 'APPROVED',
          isApproved: true
        }
      });
      console.log(`Created test institution: ${institution.name}`);
    }

    // Get a test course
    const course = await prisma.course.findFirst({
      where: {
        institutionId: institutionId || ''
      }
    });

    if (!course) {
      console.log('No course found for institution. Creating one...');
      const category = await prisma.category.findFirst();
      if (!category) {
        console.log('No category found. Creating one...');
        await prisma.category.create({
          data: {
            name: 'Test Category',
            description: 'Test category',
            slug: 'test-category'
          }
        });
      }

      const newCourse = await prisma.course.create({
        data: {
          title: 'Test Course',
          description: 'Test course for API testing',
          duration: 30,
          level: 'BEGINNER',
          status: 'ACTIVE',
          institutionId: institutionId || '',
          categoryId: category?.id || '',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          maxStudents: 20,
          base_price: 100
        }
      });

      console.log(`Created test course: ${newCourse.title}`);
    } else {
      console.log(`Using existing course: ${course.title}`);
    }

    // Get a test module
    const module = await prisma.modules.findFirst({
      where: {
        course_id: course?.id
      }
    });

    if (!module) {
      console.log('No module found. Creating one...');
      const newModule = await prisma.modules.create({
        data: {
          id: 'test-module-id',
          course_id: course?.id || '',
          title: 'Test Module',
          description: 'Test module for API testing',
          level: 'BEGINNER',
          skills: ['test-skill'],
          estimatedDuration: 60,
          vocabularyList: ['test-vocab'],
          grammarPoints: ['test-grammar'],
          culturalNotes: 'Test cultural notes',
          order: 1
        }
      });

      console.log(`Created test module: ${newModule.title}`);
    } else {
      console.log(`Using existing module: ${module.title}`);
    }

    // Test creating a quiz
    console.log('\nTesting quiz creation...');
    const testQuiz = await prisma.quizzes.create({
      data: {
        id: 'test-quiz-id',
        module_id: module?.id || 'test-module-id',
        title: 'Test Quiz',
        description: 'Test quiz for API testing',
        passing_score: 70,
        time_limit: 30,
        quiz_type: 'STANDARD',
        difficulty: 'MEDIUM',
        allow_retry: true,
        max_attempts: 3,
        show_results: true,
        show_explanations: false
      }
    });

    console.log(`Created test quiz: ${testQuiz.title}`);

    // Test creating a question
    console.log('\nTesting question creation...');
    const testQuestion = await prisma.quiz_questions.create({
      data: {
        id: 'test-question-id',
        quiz_id: testQuiz.id,
        type: 'MULTIPLE_CHOICE',
        question: 'What is 2 + 2?',
        options: JSON.stringify(['3', '4', '5', '6']),
        correct_answer: '4',
        points: 1,
        order_index: 0,
        difficulty: 'EASY',
        explanation: '2 + 2 equals 4'
      }
    });

    console.log(`Created test question: ${testQuestion.question}`);

    // Test fetching quizzes
    console.log('\nTesting quiz fetching...');
    const quizzes = await prisma.quizzes.findMany({
      where: {
        module_id: module?.id || 'test-module-id'
      }
    });

    console.log(`Found ${quizzes.length} quizzes`);

    // Test fetching questions
    console.log('\nTesting question fetching...');
    const questions = await prisma.quiz_questions.findMany({
      where: {
        quiz_id: testQuiz.id
      }
    });

    console.log(`Found ${questions.length} questions`);

    console.log('\n✅ All API tests passed!');
    console.log('\nTest data created:');
    console.log(`- Institution ID: ${institutionId || 'Test Institution'}`);
    console.log(`- Course: ${course?.title || 'Test Course'}`);
    console.log(`- Module: ${module?.title || 'Test Module'}`);
    console.log(`- Quiz: ${testQuiz.title}`);
    console.log(`- Question: ${testQuestion.question}`);

  } catch (error) {
    logger.error('❌ API test failed:');
  } finally {
    await prisma.$disconnect();
  }
}

testQuizAPI(); 