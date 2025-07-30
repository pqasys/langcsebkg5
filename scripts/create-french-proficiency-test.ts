import { PrismaClient } from '@prisma/client';
import { FRENCH_PROFICIENCY_QUESTIONS } from '../lib/data/french-proficiency-questions';

const prisma = new PrismaClient();

async function createFrenchProficiencyTest() {
  console.log('🚀 Creating French proficiency test...');

  try {
    // Find an existing course to add the quiz to
    const course = await prisma.course.findFirst({
      include: {
        modules: true
      }
    });

    if (!course) {
      console.log('❌ No courses found. Please create a course first.');
      return null;
    }

    const module = course.modules[0];
    if (!module) {
      console.log('❌ No modules found in the course. Please create a module first.');
      return null;
    }

    console.log(`📚 Using course: ${course.title}, module: ${module.title}`);

    // Create the French proficiency quiz
    const quiz = await prisma.quizzes.create({
      data: {
        id: crypto.randomUUID(),
        module_id: module.id,
        title: 'Test de Proficience en Français (A1-C2)',
        description: 'Un test complet de compétence en français basé sur le cadre européen commun de référence (CEFR)',
        passing_score: 70,
        time_limit: 60, // 60 minutes
        quiz_type: 'STANDARD',
        difficulty: 'MEDIUM',
        category: 'French Language',
        instructions: 'Ce test évalue votre niveau de français selon le cadre européen commun de référence (A1-C2). Répondez à toutes les questions du mieux que vous pouvez.',
        allow_retry: true,
        max_attempts: 3,
        shuffle_questions: true,
        show_results: true,
        show_explanations: true,
        tags: JSON.stringify(['french', 'cefr', 'proficiency', 'language-test'])
      }
    });

    console.log(`✅ Created French proficiency quiz: ${quiz.title}`);

    // Create the questions
    for (let i = 0; i < FRENCH_PROFICIENCY_QUESTIONS.length; i++) {
      const questionData = FRENCH_PROFICIENCY_QUESTIONS[i];
      
      // Determine difficulty based on level
      let difficulty = 'MEDIUM';
      if (questionData.level === 'A1' || questionData.level === 'A2') {
        difficulty = 'EASY';
      } else if (questionData.level === 'C1' || questionData.level === 'C2') {
        difficulty = 'HARD';
      }

      // Calculate IRT parameters based on level
      let irt_difficulty = 0;
      let irt_discrimination = 1.0;
      let irt_guessing = 0.25;

      switch (questionData.level) {
        case 'A1':
          irt_difficulty = -2.0;
          irt_discrimination = 0.8;
          irt_guessing = 0.25;
          break;
        case 'A2':
          irt_difficulty = -1.5;
          irt_discrimination = 0.9;
          irt_guessing = 0.25;
          break;
        case 'B1':
          irt_difficulty = -0.5;
          irt_discrimination = 1.0;
          irt_guessing = 0.25;
          break;
        case 'B2':
          irt_difficulty = 0.5;
          irt_discrimination = 1.1;
          irt_guessing = 0.25;
          break;
        case 'C1':
          irt_difficulty = 1.5;
          irt_discrimination = 1.2;
          irt_guessing = 0.25;
          break;
        case 'C2':
          irt_difficulty = 2.0;
          irt_discrimination = 1.3;
          irt_guessing = 0.25;
          break;
      }

      await prisma.quiz_questions.create({
        data: {
          id: crypto.randomUUID(),
          quiz_id: quiz.id,
          question: questionData.question,
          type: 'MULTIPLE_CHOICE',
          options: JSON.stringify(questionData.options),
          correct_answer: questionData.correctAnswer,
          points: 1,
          order_index: i,
          difficulty,
          category: questionData.category || 'general',
          explanation: questionData.explanation,
          hints: JSON.stringify([]),
          irt_difficulty,
          irt_discrimination,
          irt_guessing,
          irt_last_updated: new Date(),
          times_asked: 0,
          times_correct: 0,
          average_time_spent: 0,
          success_rate: 0,
          tags: JSON.stringify([questionData.level, questionData.category || 'general', 'french'])
        }
      });
    }

    console.log(`✅ Created ${FRENCH_PROFICIENCY_QUESTIONS.length} French proficiency questions`);
    console.log(`📊 Quiz ID: ${quiz.id}`);
    console.log(`🌐 Quiz URL: /language-proficiency-test`);

    return quiz.id;

  } catch (error) {
    console.error('❌ Error creating French proficiency test:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createFrenchProficiencyTest()
  .then((quizId) => {
    if (quizId) {
      console.log('🎉 French proficiency test created successfully!');
      console.log(`🔗 You can now access the French test with ID: ${quizId}`);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }); 