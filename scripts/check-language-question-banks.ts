#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLanguageQuestionBanks() {
  try {
    console.log('🔍 Checking existing language proficiency question banks...\n');

    const questionBanks = await prisma.languageProficiencyQuestionBank.findMany({
      include: {
        questions: true
      }
    });

    if (questionBanks.length === 0) {
      console.log('❌ No language proficiency question banks found in the database.');
      console.log('📝 This explains why only Spanish shows up - it was likely added manually.');
      return;
    }

    console.log(`📊 Found ${questionBanks.length} language proficiency question bank(s):\n`);

    for (const bank of questionBanks) {
      console.log(`🏦 Question Bank: ${bank.name}`);
      console.log(`   Language Code: ${bank.languageCode}`);
      console.log(`   Total Questions: ${bank.totalQuestions}`);
      console.log(`   Active Questions: ${bank.questions.length}`);
      console.log(`   Is Active: ${bank.isActive ? 'Yes' : 'No'}`);
      console.log(`   Created: ${bank.createdAt}`);
      console.log(`   Updated: ${bank.updatedAt}`);
      console.log('');
    }

    // Check what languages are marked as available in the UI
    console.log('🎯 Languages marked as "available" in the UI:');
    console.log('- English (en)');
    console.log('- French (fr)');
    console.log('- Spanish (es)');
    console.log('- Italian (it)');
    console.log('- Portuguese (pt) - Just added');
    console.log('');
    console.log('🚧 Languages marked as "coming-soon" in the UI:');
    console.log('- German (de)');
    console.log('- Russian (ru)');
    console.log('- Chinese (zh)');
    console.log('- Japanese (ja)');
    console.log('- Korean (ko)');
    console.log('');

    console.log('💡 Recommendation:');
    console.log('To make all languages functional, you need to:');
    console.log('1. Create question banks for each language (en, fr, it)');
    console.log('2. Add questions to each question bank');
    console.log('3. Or update the UI to only show languages that have question banks');

  } catch (error) {
    console.error('❌ Error checking language question banks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkLanguageQuestionBanks();
