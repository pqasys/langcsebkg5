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
    correctAnswer: shuffled[correctAnswerIndex],
    correctAnswerIndex
  };
}

// Sample English questions for testing
const ENGLISH_QUESTIONS = [
  {
    question: 'What is the correct article for the word "book"?',
    correctAnswer: 'A',
    wrongAnswers: ['An', 'The', 'Some'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: 'The word "book" starts with a consonant sound, so we use "a".'
  },
  {
    question: 'What is the plural of "child"?',
    correctAnswer: 'Children',
    wrongAnswers: ['Childs', 'Childes', 'Childen'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: '"Child" is an irregular noun, so the plural is "children".'
  },
  {
    question: 'Which sentence is grammatically correct?',
    correctAnswer: 'I am going to the store.',
    wrongAnswers: ['I going to the store.', 'I goes to the store.', 'I go to the store.'],
    level: 'A2',
    category: 'grammar',
    difficulty: 'medium',
    explanation: 'The present continuous tense requires "am/is/are" + verb + -ing.'
  },
  {
    question: 'What is the meaning of the word "happy"?',
    correctAnswer: 'Joyful',
    wrongAnswers: ['Sad', 'Angry', 'Tired'],
    level: 'A1',
    category: 'vocabulary',
    difficulty: 'easy',
    explanation: '"Happy" means feeling or showing pleasure or contentment.'
  },
  {
    question: 'Which word is a verb?',
    correctAnswer: 'Run',
    wrongAnswers: ['Fast', 'Quickly', 'Speed'],
    level: 'A1',
    category: 'grammar',
    difficulty: 'easy',
    explanation: '"Run" is a verb that indicates action, while the others are adjectives or adverbs.'
  }
];

async function addEnglishPlaceholderQuestions() {
  try {
    console.log('🚀 Adding English placeholder questions...\n');

    // Check if English question bank exists
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'en' }
    });

    if (!existingBank) {
      console.log('❌ English question bank not found. Please create it first.');
      return;
    }

    console.log(`✅ Found English question bank: ${existingBank.name}`);

    // Add questions
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

      console.log(`✅ Added question ${i + 1}: ${q.question.substring(0, 50)}...`);
    }

    // Update the question bank with correct total
    await prisma.languageProficiencyQuestionBank.update({
      where: { id: existingBank.id },
      data: { totalQuestions: ENGLISH_QUESTIONS.length }
    });

    console.log(`\n🎉 Successfully added ${ENGLISH_QUESTIONS.length} English questions!`);
    console.log(`📊 Question bank ID: ${existingBank.id}`);

  } catch (error) {
    console.error('❌ Error adding English questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addEnglishPlaceholderQuestions();
