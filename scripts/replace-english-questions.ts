#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// Function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Function to randomize answer positions
function randomizeAnswers(correctAnswer: string, wrongAnswers: string[]): {
  options: string[];
  correctAnswer: string;
  correctAnswerIndex: number;
} {
  const allAnswers = [correctAnswer, ...wrongAnswers];
  const shuffled = shuffleArray(allAnswers);
  const correctAnswerIndex = shuffled.indexOf(correctAnswer);
  
  return {
    options: shuffled,
    correctAnswer: correctAnswer,
    correctAnswerIndex: correctAnswerIndex
  };
}

// Import the questions data
import { ENGLISH_QUESTIONS_DATA, generateRemainingEnglishQuestions } from './english-questions-data';

// Parse the questions from the user's data
function parseEnglishQuestions(): any[] {
  const questions = [...ENGLISH_QUESTIONS_DATA];
  const remainingQuestions = generateRemainingEnglishQuestions();
  return [...questions, ...remainingQuestions];
}

async function replaceEnglishQuestions() {
  try {
    console.log('🚀 Replacing English Proficiency Test Questions...');
    
    // Find the English question bank
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'en' }
    });

    if (!existingBank) {
      console.log('❌ English question bank not found. Please run the create-missing-language-question-banks script first.');
      return;
    }

    // Delete existing questions for English
    await prisma.languageProficiencyQuestion.deleteMany({
      where: { bankId: existingBank.id }
    });
    console.log('✅ Deleted existing English questions');

    // Parse and add all 160 questions
    const ENGLISH_QUESTIONS = parseEnglishQuestions();
    
    for (let i = 0; i < ENGLISH_QUESTIONS.length; i++) {
      const q = ENGLISH_QUESTIONS[i];
      const randomized = randomizeAnswers(q.correctAnswer, q.wrongAnswers);
      
      await prisma.languageProficiencyQuestion.create({
        data: {
          id: uuidv4(),
          bankId: existingBank.id,
          level: q.level,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          options: randomized.options,
          correctAnswer: randomized.correctAnswer,
          explanation: q.explanation,
          isActive: true
        }
      });

      if ((i + 1) % 20 === 0) {
        console.log(`✅ Added ${i + 1} questions...`);
      }
    }

    // Update the question bank with the correct total
    await prisma.languageProficiencyQuestionBank.update({
      where: { id: existingBank.id },
      data: { totalQuestions: ENGLISH_QUESTIONS.length }
    });

    console.log(`🎉 Successfully replaced with ${ENGLISH_QUESTIONS.length} English questions!`);
    console.log(`📊 Question bank ID: ${existingBank.id}`);
    
  } catch (error) {
    console.error('❌ Error replacing English questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

replaceEnglishQuestions();
