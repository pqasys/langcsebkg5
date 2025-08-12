const { PrismaClient } = require('@prisma/client');
const { SPANISH_PROFICIENCY_QUESTIONS } = require('../lib/data/spanish-proficiency-questions.ts');

const prisma = new PrismaClient();

async function initializeSpanishProficiencyTest() {
  try {
    console.log('🌐 Initializing Spanish Proficiency Test...');

    // Check if Spanish question bank already exists
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'es' }
    });

    if (existingBank) {
      console.log('✅ Spanish question bank already exists');
      return existingBank.id;
    }

    // Create the question bank
    const bank = await prisma.languageProficiencyQuestionBank.create({
      data: {
        languageCode: 'es',
        name: 'Spanish Language Proficiency Test',
        description: 'Comprehensive Spanish proficiency test with questions covering all CEFR levels (A1-C2)',
        totalQuestions: 0
      }
    });

    console.log(`📚 Created question bank: ${bank.id}`);

    // Import Spanish questions
    let questionCount = 0;
    for (const question of SPANISH_PROFICIENCY_QUESTIONS) {
      await prisma.languageProficiencyQuestion.create({
        data: {
          bankId: bank.id,
          level: question.level,
          category: question.category || 'grammar',
          difficulty: question.difficulty || 'medium',
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation
        }
      });
      questionCount++;
    }

    // Update total questions count
    await prisma.languageProficiencyQuestionBank.update({
      where: { id: bank.id },
      data: { totalQuestions: questionCount }
    });

    console.log(`✅ Successfully initialized Spanish proficiency test with ${questionCount} questions`);
    console.log(`📊 Question Bank ID: ${bank.id}`);
    console.log(`🌐 Test URL: /language-proficiency-test`);

    return bank.id;

  } catch (error) {
    console.error('❌ Error initializing Spanish proficiency test:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initializeSpanishProficiencyTest()
    .then(() => {
      console.log('🎉 Spanish proficiency test initialization completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initializeSpanishProficiencyTest };
