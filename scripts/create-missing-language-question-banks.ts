#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function createMissingLanguageQuestionBanks() {
  try {
    console.log('🚀 Creating missing language proficiency question banks...\n');

    const languagesToCreate = [
      {
        code: 'en',
        name: 'English Language Proficiency Test',
        description: 'Comprehensive English proficiency test with questions covering all CEFR levels (A1-C2)'
      },
      {
        code: 'fr',
        name: 'French Language Proficiency Test',
        description: 'Comprehensive French proficiency test with questions covering all CEFR levels (A1-C2)'
      },
      {
        code: 'it',
        name: 'Italian Language Proficiency Test',
        description: 'Comprehensive Italian proficiency test with questions covering all CEFR levels (A1-C2)'
      }
    ];

    for (const language of languagesToCreate) {
      // Check if question bank already exists
      const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
        where: { languageCode: language.code }
      });

      if (existingBank) {
        console.log(`⚠️ Question bank for ${language.name} already exists.`);
        continue;
      }

      // Create the question bank
      const questionBank = await prisma.languageProficiencyQuestionBank.create({
        data: {
          id: uuidv4(),
          languageCode: language.code,
          name: language.name,
          description: language.description,
          totalQuestions: 0, // Will be updated when questions are added
          isActive: true
        }
      });

      console.log(`✅ Created question bank for ${language.name} (${language.code})`);
      console.log(`   ID: ${questionBank.id}`);
      console.log('');
    }

    console.log('🎉 All missing language question banks have been created!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Add questions to each question bank (similar to what was done for Portuguese)');
    console.log('2. Or update the UI to only show languages that have actual questions');
    console.log('3. Consider creating placeholder questions for testing');

  } catch (error) {
    console.error('❌ Error creating language question banks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMissingLanguageQuestionBanks();
