import { PrismaClient } from '@prisma/client';
import { logger } from '../lib/logger';

const prisma = new PrismaClient();

async function initializeIRTParameters() {
  console.log('🚀 Initializing IRT parameters for existing quiz questions...');

  try {
    // Get all quiz questions that don't have IRT parameters
    const questions = await prisma.quiz_questions.findMany({
      where: {
        OR: [
          { irt_difficulty: null },
          { irt_discrimination: null },
          { irt_guessing: null }
        ]
      }
    });

    console.log(`Found ${questions.length} questions to initialize`);

    let updatedCount = 0;

    for (const question of questions) {
      // Initialize IRT parameters based on question difficulty
      let irtDifficulty = 0; // Default to medium difficulty
      let irtDiscrimination = 1.0; // Default discrimination
      let irtGuessing = 0.25; // Default guessing parameter

      // Adjust based on question difficulty
      switch (question.difficulty) {
        case 'EASY':
          irtDifficulty = -1.0;
          irtDiscrimination = 0.8;
          irtGuessing = 0.3;
          break;
        case 'MEDIUM':
          irtDifficulty = 0.0;
          irtDiscrimination = 1.0;
          irtGuessing = 0.25;
          break;
        case 'HARD':
          irtDifficulty = 1.0;
          irtDiscrimination = 1.2;
          irtGuessing = 0.2;
          break;
      }

      // Adjust based on question type
      switch (question.type) {
        case 'MULTIPLE_CHOICE':
          // Multiple choice has higher guessing probability
          irtGuessing = Math.max(irtGuessing, 0.25);
          break;
        case 'TRUE_FALSE':
          // True/False has 50% guessing probability
          irtGuessing = 0.5;
          break;
        case 'FILL_BLANK':
          // Fill in the blank has lower guessing probability
          irtGuessing = 0.1;
          break;
        case 'MATCHING':
          // Matching has moderate guessing probability
          irtGuessing = 0.15;
          break;
      }

      // Update the question with IRT parameters
      await prisma.quiz_questions.update({
        where: { id: question.id },
        data: {
          irt_difficulty: irtDifficulty,
          irt_discrimination: irtDiscrimination,
          irt_guessing: irtGuessing,
          irt_last_updated: new Date()
        }
      });

      updatedCount++;
      
      if (updatedCount % 10 === 0) {
        console.log(`Updated ${updatedCount} questions...`);
      }
    }

    console.log(` Successfully initialized IRT parameters for ${updatedCount} questions`);

    // Also update quizzes to support adaptive mode
    const quizzes = await prisma.quizzes.findMany({
      where: {
        quiz_type: 'STANDARD' // Only update standard quizzes
      }
    });

    console.log(`Found ${quizzes.length} standard quizzes to update`);

    for (const quiz of quizzes) {
      await prisma.quizzes.update({
        where: { id: quiz.id },
        data: {
          adaptive_config: {
            enabled: false, // Default to disabled
            min_questions: 5,
            max_questions: 20,
            target_precision: 0.3,
            initial_ability: 0.0
          }
        }
      });
    }

    console.log(` Successfully updated ${quizzes.length} quizzes with adaptive configuration`);

  } catch (error) {
    logger.error('❌ Error initializing IRT parameters:');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
initializeIRTParameters()
  .then(() => {
    console.log('🎉 IRT parameter initialization complete!');
    process.exit(0);
  })
  .catch(() => {
    logger.error('💥 Script failed:');
    process.exit(1);
  }); 