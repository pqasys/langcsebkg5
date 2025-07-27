import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function createTestAdaptiveQuiz() {
  console.log('🚀 Creating test adaptive quiz...');

  try {
    // Find an existing course to add the quiz to
    const course = await prisma.course.findFirst({
      include: {
        modules: true
      }
    });

    if (!course) {
      console.log('❌ No courses found. Please create a course first.');
      return;
    }

    const module = course.modules[0];
    if (!module) {
      console.log('❌ No modules found in the course. Please create a module first.');
      return;
    }

    console.log(`� Using course: ${course.title}, module: ${module.title}`);

    // Create an adaptive quiz
    const quiz = await prisma.quizzes.create({
      data: {
        id: crypto.randomUUID(),
        module_id: module.id,
        title: 'Test Adaptive Quiz - Mathematics',
        description: 'A comprehensive adaptive quiz to test the IRT-based system',
        passing_score: 70,
        time_limit: 30,
        quiz_type: 'ADAPTIVE',
        difficulty: 'MEDIUM',
        category: 'Mathematics',
        instructions: 'This quiz will adapt to your skill level. Answer each question to the best of your ability.',
        allow_retry: true,
        max_attempts: 3,
        shuffle_questions: false,
        show_results: true,
        show_explanations: true,
        adaptive_config: {
          enabled: true,
          min_questions: 5,
          max_questions: 15,
          target_precision: 0.3,
          initial_ability: 0.0
        },
        min_questions: 5,
        max_questions: 15,
        target_precision: 0.3,
        initial_ability: 0.0
      }
    });

    console.log(` Created adaptive quiz: ${quiz.title}`);

    // Create test questions with different difficulty levels and IRT parameters
    const questions = [
      // Easy questions
      {
        question: 'What is 2 + 3?',
        type: 'MULTIPLE_CHOICE',
        options: ['4', '5', '6', '7'],
        correct_answer: '5',
        points: 1,
        difficulty: 'EASY',
        category: 'Basic Arithmetic',
        irt_difficulty: -1.5,
        irt_discrimination: 0.8,
        irt_guessing: 0.25,
        explanation: '2 + 3 = 5. This is basic addition.',
        hints: ['Count on your fingers', 'Think of 2 objects plus 3 objects']
      },
      {
        question: 'Is 10 greater than 5?',
        type: 'TRUE_FALSE',
        correct_answer: 'true',
        points: 1,
        difficulty: 'EASY',
        category: 'Number Comparison',
        irt_difficulty: -1.2,
        irt_discrimination: 0.7,
        irt_guessing: 0.5,
        explanation: 'Yes, 10 is greater than 5.',
        hints: ['Look at the number line']
      },
      {
        question: 'Fill in the blank: 5 × ___ = 25',
        type: 'FILL_IN_BLANK',
        correct_answer: '5',
        points: 1,
        difficulty: 'EASY',
        category: 'Multiplication',
        irt_difficulty: -1.0,
        irt_discrimination: 0.9,
        irt_guessing: 0.1,
        explanation: '5 × 5 = 25. This is basic multiplication.',
        hints: ['What number times 5 equals 25?']
      },

      // Medium questions
      {
        question: 'What is 15 × 4?',
        type: 'MULTIPLE_CHOICE',
        options: ['45', '50', '60', '65'],
        correct_answer: '60',
        points: 2,
        difficulty: 'MEDIUM',
        category: 'Multiplication',
        irt_difficulty: 0.0,
        irt_discrimination: 1.0,
        irt_guessing: 0.25,
        explanation: '15 × 4 = 60. You can break this down as 10 × 4 + 5 × 4 = 40 + 20 = 60.',
        hints: ['Break it down: 10 × 4 + 5 × 4']
      },
      {
        question: 'What is half of 86?',
        type: 'FILL_IN_BLANK',
        correct_answer: '43',
        points: 2,
        difficulty: 'MEDIUM',
        category: 'Division',
        irt_difficulty: 0.2,
        irt_discrimination: 1.1,
        irt_guessing: 0.1,
        explanation: 'Half of 86 is 43. 86 ÷ 2 = 43.',
        hints: ['Divide 86 by 2']
      },
      {
        question: 'Is 3² equal to 6?',
        type: 'TRUE_FALSE',
        correct_answer: 'false',
        points: 2,
        difficulty: 'MEDIUM',
        category: 'Exponents',
        irt_difficulty: 0.1,
        irt_discrimination: 1.2,
        irt_guessing: 0.5,
        explanation: 'No, 3² = 3 × 3 = 9, not 6.',
        hints: ['Remember: 3² means 3 × 3']
      },

      // Hard questions
      {
        question: 'What is the square root of 144?',
        type: 'MULTIPLE_CHOICE',
        options: ['10', '11', '12', '13'],
        correct_answer: '12',
        points: 3,
        difficulty: 'HARD',
        category: 'Square Roots',
        irt_difficulty: 1.2,
        irt_discrimination: 1.3,
        irt_guessing: 0.25,
        explanation: 'The square root of 144 is 12 because 12 × 12 = 144.',
        hints: ['Think: what number times itself equals 144?']
      },
      {
        question: 'What is 25% of 80?',
        type: 'FILL_IN_BLANK',
        correct_answer: '20',
        points: 3,
        difficulty: 'HARD',
        category: 'Percentages',
        irt_difficulty: 1.0,
        irt_discrimination: 1.4,
        irt_guessing: 0.1,
        explanation: '25% of 80 = 0.25 × 80 = 20.',
        hints: ['Convert 25% to decimal: 0.25, then multiply by 80']
      },
      {
        question: 'Is the sum of angles in a triangle always 180 degrees?',
        type: 'TRUE_FALSE',
        correct_answer: 'true',
        points: 3,
        difficulty: 'HARD',
        category: 'Geometry',
        irt_difficulty: 1.5,
        irt_discrimination: 1.1,
        irt_guessing: 0.5,
        explanation: 'Yes, the sum of interior angles in any triangle is always 180 degrees.',
        hints: ['This is a fundamental geometric property']
      },
      {
        question: 'What is 3³?',
        type: 'MULTIPLE_CHOICE',
        options: ['6', '9', '27', '81'],
        correct_answer: '27',
        points: 3,
        difficulty: 'HARD',
        category: 'Exponents',
        irt_difficulty: 1.3,
        irt_discrimination: 1.2,
        irt_guessing: 0.25,
        explanation: '3³ = 3 × 3 × 3 = 27.',
        hints: ['3³ means 3 × 3 × 3']
      }
    ];

    // Create the questions
    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i];
      await prisma.quiz_questions.create({
        data: {
          id: crypto.randomUUID(),
          quiz_id: quiz.id,
          question: questionData.question,
          type: questionData.type as any,
          options: questionData.options ? JSON.stringify(questionData.options) : null,
          correct_answer: questionData.correct_answer,
          points: questionData.points,
          order_index: i,
          difficulty: questionData.difficulty,
          category: questionData.category,
          explanation: questionData.explanation,
          hints: JSON.stringify(questionData.hints),
          irt_difficulty: questionData.irt_difficulty,
          irt_discrimination: questionData.irt_discrimination,
          irt_guessing: questionData.irt_guessing,
          irt_last_updated: new Date(),
          times_asked: 0,
          times_correct: 0,
          average_time_spent: 0,
          success_rate: 0
        }
      });
    }

    console.log(` Created ${questions.length} test questions with IRT parameters`);
    console.log(` Quiz ID: ${quiz.id}`);
    console.log(` Quiz URL: /student/quiz/${quiz.id}/adaptive`);

    return quiz.id;

  } catch (error) {
    logger.error('❌ Error creating test adaptive quiz:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createTestAdaptiveQuiz()
  .then((quizId) => {
    if (quizId) {
      console.log('🎉 Test adaptive quiz created successfully!');
      console.log(`� You can now test the adaptive quiz with ID: ${quizId}`);
    }
    process.exit(0);
  })
  .catch(() => {
    logger.error('💥 Script failed:');
    process.exit(1);
  }); 