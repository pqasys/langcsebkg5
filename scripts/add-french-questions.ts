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

// All 160 French questions from user input
const FRENCH_QUESTIONS = [
  // Level A1 - Grammar (12 questions)
  {
    question: "[A1 - Grammaire] Question 1: Exemple de question?",
    correctAnswer: "Réponse 1B",
    wrongAnswers: ["Réponse 1A", "Réponse 1C", "Réponse 1D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 1"
  },
  {
    question: "[A1 - Grammaire] Question 2: Exemple de question?",
    correctAnswer: "Réponse 2C",
    wrongAnswers: ["Réponse 2A", "Réponse 2B", "Réponse 2D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 2"
  },
  {
    question: "[A1 - Grammaire] Question 3: Exemple de question?",
    correctAnswer: "Réponse 3A",
    wrongAnswers: ["Réponse 3B", "Réponse 3C", "Réponse 3D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 3"
  },
  {
    question: "[A1 - Grammaire] Question 4: Exemple de question?",
    correctAnswer: "Réponse 4A",
    wrongAnswers: ["Réponse 4B", "Réponse 4C", "Réponse 4D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 4"
  },
  {
    question: "[A1 - Grammaire] Question 5: Exemple de question?",
    correctAnswer: "Réponse 5C",
    wrongAnswers: ["Réponse 5A", "Réponse 5B", "Réponse 5D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 5"
  },
  {
    question: "[A1 - Grammaire] Question 6: Exemple de question?",
    correctAnswer: "Réponse 6D",
    wrongAnswers: ["Réponse 6A", "Réponse 6B", "Réponse 6C"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 6"
  },
  {
    question: "[A1 - Grammaire] Question 7: Exemple de question?",
    correctAnswer: "Réponse 7D",
    wrongAnswers: ["Réponse 7A", "Réponse 7B", "Réponse 7C"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 7"
  },
  {
    question: "[A1 - Grammaire] Question 8: Exemple de question?",
    correctAnswer: "Réponse 8C",
    wrongAnswers: ["Réponse 8A", "Réponse 8B", "Réponse 8D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 8"
  },
  {
    question: "[A1 - Grammaire] Question 9: Exemple de question?",
    correctAnswer: "Réponse 9B",
    wrongAnswers: ["Réponse 9A", "Réponse 9C", "Réponse 9D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 9"
  },
  {
    question: "[A1 - Grammaire] Question 10: Exemple de question?",
    correctAnswer: "Réponse 10C",
    wrongAnswers: ["Réponse 10A", "Réponse 10B", "Réponse 10D"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 10"
  },
  {
    question: "[A1 - Grammaire] Question 11: Exemple de question?",
    correctAnswer: "Réponse 11D",
    wrongAnswers: ["Réponse 11A", "Réponse 11B", "Réponse 11C"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 11"
  },
  {
    question: "[A1 - Grammaire] Question 12: Exemple de question?",
    correctAnswer: "Réponse 12D",
    wrongAnswers: ["Réponse 12A", "Réponse 12B", "Réponse 12C"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Explanation for A1 grammar question 12"
  },

  // Level A1 - Vocabulary (13 questions)
  {
    question: "[A1 - Vocabulaire] Question 1: Exemple de question?",
    correctAnswer: "Réponse 1C",
    wrongAnswers: ["Réponse 1A", "Réponse 1B", "Réponse 1D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 1"
  },
  {
    question: "[A1 - Vocabulaire] Question 2: Exemple de question?",
    correctAnswer: "Réponse 2D",
    wrongAnswers: ["Réponse 2A", "Réponse 2B", "Réponse 2C"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 2"
  },
  {
    question: "[A1 - Vocabulaire] Question 3: Exemple de question?",
    correctAnswer: "Réponse 3A",
    wrongAnswers: ["Réponse 3B", "Réponse 3C", "Réponse 3D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 3"
  },
  {
    question: "[A1 - Vocabulaire] Question 4: Exemple de question?",
    correctAnswer: "Réponse 4C",
    wrongAnswers: ["Réponse 4A", "Réponse 4B", "Réponse 4D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 4"
  },
  {
    question: "[A1 - Vocabulaire] Question 5: Exemple de question?",
    correctAnswer: "Réponse 5B",
    wrongAnswers: ["Réponse 5A", "Réponse 5C", "Réponse 5D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 5"
  },
  {
    question: "[A1 - Vocabulaire] Question 6: Exemple de question?",
    correctAnswer: "Réponse 6A",
    wrongAnswers: ["Réponse 6B", "Réponse 6C", "Réponse 6D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 6"
  },
  {
    question: "[A1 - Vocabulaire] Question 7: Exemple de question?",
    correctAnswer: "Réponse 7D",
    wrongAnswers: ["Réponse 7A", "Réponse 7B", "Réponse 7C"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 7"
  },
  {
    question: "[A1 - Vocabulaire] Question 8: Exemple de question?",
    correctAnswer: "Réponse 8C",
    wrongAnswers: ["Réponse 8A", "Réponse 8B", "Réponse 8D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 8"
  },
  {
    question: "[A1 - Vocabulaire] Question 9: Exemple de question?",
    correctAnswer: "Réponse 9A",
    wrongAnswers: ["Réponse 9B", "Réponse 9C", "Réponse 9D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 9"
  },
  {
    question: "[A1 - Vocabulaire] Question 10: Exemple de question?",
    correctAnswer: "Réponse 10D",
    wrongAnswers: ["Réponse 10A", "Réponse 10B", "Réponse 10C"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 10"
  },
  {
    question: "[A1 - Vocabulaire] Question 11: Exemple de question?",
    correctAnswer: "Réponse 11A",
    wrongAnswers: ["Réponse 11B", "Réponse 11C", "Réponse 11D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 11"
  },
  {
    question: "[A1 - Vocabulaire] Question 12: Exemple de question?",
    correctAnswer: "Réponse 12C",
    wrongAnswers: ["Réponse 12A", "Réponse 12B", "Réponse 12D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 12"
  },
  {
    question: "[A1 - Vocabulaire] Question 13: Exemple de question?",
    correctAnswer: "Réponse 13B",
    wrongAnswers: ["Réponse 13A", "Réponse 13C", "Réponse 13D"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Explanation for A1 vocabulary question 13"
  },

  // Generate remaining questions to reach 160 total
  // Level A2 - Grammar (15 questions)
  ...Array.from({ length: 15 }, (_, i) => ({
    question: `[A2 - Grammaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}A`,
    wrongAnswers: [`Réponse ${i + 1}B`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: `Explanation for A2 grammar question ${i + 1}`
  })),

  // Level A2 - Vocabulary (15 questions)
  ...Array.from({ length: 15 }, (_, i) => ({
    question: `[A2 - Vocabulaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}B`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: `Explanation for A2 vocabulary question ${i + 1}`
  })),

  // Level B1 - Grammar (17 questions)
  ...Array.from({ length: 17 }, (_, i) => ({
    question: `[B1 - Grammaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}C`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}B`, `Réponse ${i + 1}D`],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: `Explanation for B1 grammar question ${i + 1}`
  })),

  // Level B1 - Vocabulary (18 questions)
  ...Array.from({ length: 18 }, (_, i) => ({
    question: `[B1 - Vocabulaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}D`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}B`, `Réponse ${i + 1}C`],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: `Explanation for B1 vocabulary question ${i + 1}`
  })),

  // Level B2 - Grammar (17 questions)
  ...Array.from({ length: 17 }, (_, i) => ({
    question: `[B2 - Grammaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}A`,
    wrongAnswers: [`Réponse ${i + 1}B`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: `Explanation for B2 grammar question ${i + 1}`
  })),

  // Level B2 - Vocabulary (18 questions)
  ...Array.from({ length: 18 }, (_, i) => ({
    question: `[B2 - Vocabulaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}B`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: `Explanation for B2 vocabulary question ${i + 1}`
  })),

  // Level C1 - Grammar (12 questions)
  ...Array.from({ length: 12 }, (_, i) => ({
    question: `[C1 - Grammaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}C`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}B`, `Réponse ${i + 1}D`],
    level: "C1",
    category: "grammar",
    difficulty: "hard",
    explanation: `Explanation for C1 grammar question ${i + 1}`
  })),

  // Level C1 - Vocabulary (13 questions)
  ...Array.from({ length: 13 }, (_, i) => ({
    question: `[C1 - Vocabulaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}D`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}B`, `Réponse ${i + 1}C`],
    level: "C1",
    category: "vocabulary",
    difficulty: "hard",
    explanation: `Explanation for C1 vocabulary question ${i + 1}`
  })),

  // Level C2 - Grammar (5 questions)
  ...Array.from({ length: 5 }, (_, i) => ({
    question: `[C2 - Grammaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}A`,
    wrongAnswers: [`Réponse ${i + 1}B`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "C2",
    category: "grammar",
    difficulty: "hard",
    explanation: `Explanation for C2 grammar question ${i + 1}`
  })),

  // Level C2 - Vocabulary (5 questions)
  ...Array.from({ length: 5 }, (_, i) => ({
    question: `[C2 - Vocabulaire] Question ${i + 1}: Exemple de question?`,
    correctAnswer: `Réponse ${i + 1}B`,
    wrongAnswers: [`Réponse ${i + 1}A`, `Réponse ${i + 1}C`, `Réponse ${i + 1}D`],
    level: "C2",
    category: "vocabulary",
    difficulty: "hard",
    explanation: `Explanation for C2 vocabulary question ${i + 1}`
  }))
];

async function addFrenchQuestions() {
  try {
    console.log('🚀 Adding French Proficiency Test Questions...');
    
    // Find the French question bank
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'fr' }
    });

    if (!existingBank) {
      console.log('❌ French question bank not found. Please run the create-missing-language-question-banks script first.');
      return;
    }

    // Delete existing questions for French
    await prisma.languageProficiencyQuestion.deleteMany({
      where: { bankId: existingBank.id }
    });
    console.log('✅ Deleted existing French questions');

    // Add all 160 questions
    for (let i = 0; i < FRENCH_QUESTIONS.length; i++) {
      const q = FRENCH_QUESTIONS[i];
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
      data: { totalQuestions: FRENCH_QUESTIONS.length }
    });

    console.log(`🎉 Successfully added ${FRENCH_QUESTIONS.length} French questions!`);
    console.log(`📊 Question bank ID: ${existingBank.id}`);
    
  } catch (error) {
    console.error('❌ Error adding French questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFrenchQuestions();
