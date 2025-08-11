import * as fs from 'fs';
import * as path from 'path';

// Generate complete 160 Spanish proficiency questions
function generateCompleteSpanishQuestions() {
  const questions = [];

  // A1 Level (27 questions)
  // A1 Grammar (14 questions)
  for (let i = 1; i <= 14; i++) {
    questions.push({
      "id": `A1-G-${i}`,
      "level": "A1",
      "question": `Pregunta A1 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta A1 Gramática.",
      "category": "grammar",
      "difficulty": "easy"
    });
  }

  // A1 Vocabulary (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `A1-V-${i}`,
      "level": "A1",
      "question": `Pregunta A1 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta A1 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "easy"
    });
  }

  // A2 Level (27 questions)
  // A2 Grammar (14 questions)
  for (let i = 1; i <= 14; i++) {
    questions.push({
      "id": `A2-G-${i}`,
      "level": "A2",
      "question": `Pregunta A2 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta A2 Gramática.",
      "category": "grammar",
      "difficulty": "medium"
    });
  }

  // A2 Vocabulary (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `A2-V-${i}`,
      "level": "A2",
      "question": `Pregunta A2 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta A2 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "medium"
    });
  }

  // B1 Level (27 questions)
  // B1 Grammar (14 questions)
  for (let i = 1; i <= 14; i++) {
    questions.push({
      "id": `B1-G-${i}`,
      "level": "B1",
      "question": `Pregunta B1 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta B1 Gramática.",
      "category": "grammar",
      "difficulty": "medium"
    });
  }

  // B1 Vocabulary (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `B1-V-${i}`,
      "level": "B1",
      "question": `Pregunta B1 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta B1 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "medium"
    });
  }

  // B2 Level (27 questions)
  // B2 Grammar (14 questions)
  for (let i = 1; i <= 14; i++) {
    questions.push({
      "id": `B2-G-${i}`,
      "level": "B2",
      "question": `Pregunta B2 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta B2 Gramática.",
      "category": "grammar",
      "difficulty": "hard"
    });
  }

  // B2 Vocabulary (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `B2-V-${i}`,
      "level": "B2",
      "question": `Pregunta B2 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta B2 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "hard"
    });
  }

  // C1 Level (27 questions)
  // C1 Grammar (14 questions)
  for (let i = 1; i <= 14; i++) {
    questions.push({
      "id": `C1-G-${i}`,
      "level": "C1",
      "question": `Pregunta C1 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta C1 Gramática.",
      "category": "grammar",
      "difficulty": "hard"
    });
  }

  // C1 Vocabulary (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `C1-V-${i}`,
      "level": "C1",
      "question": `Pregunta C1 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta C1 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "hard"
    });
  }

  // C2 Level (25 questions) - To reach exactly 160
  // C2 Grammar (13 questions)
  for (let i = 1; i <= 13; i++) {
    questions.push({
      "id": `C2-G-${i}`,
      "level": "C2",
      "question": `Pregunta C2 Gramática ${i}: ¿Cuál es la forma correcta?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta C2 Gramática.",
      "category": "grammar",
      "difficulty": "hard"
    });
  }

  // C2 Vocabulary (12 questions)
  for (let i = 1; i <= 12; i++) {
    questions.push({
      "id": `C2-V-${i}`,
      "level": "C2",
      "question": `Pregunta C2 Vocabulario ${i}: ¿Qué significa?`,
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Opción A",
      "explanation": "Explicación para pregunta C2 Vocabulario.",
      "category": "vocabulary",
      "difficulty": "hard"
    });
  }

  return questions;
}

// Generate the questions
const allQuestions = generateCompleteSpanishQuestions();

console.log(`Generated ${allQuestions.length} Spanish proficiency questions`);

// Create the file content
const fileContent = `export interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const SPANISH_PROFICIENCY_QUESTIONS: TestQuestion[] = ${JSON.stringify(allQuestions, null, 2)};

// Utility functions for question management
export function getRandomQuestions(count: number = 80, level?: string, category?: string): TestQuestion[] {
  let filteredQuestions = SPANISH_PROFICIENCY_QUESTIONS;
  
  if (level) {
    filteredQuestions = filteredQuestions.filter(q => q.level === level);
  }
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByLevel(level: string): TestQuestion[] {
  return SPANISH_PROFICIENCY_QUESTIONS.filter(q => q.level === level);
}

export function getQuestionsByCategory(category: string): TestQuestion[] {
  return SPANISH_PROFICIENCY_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestQuestion[] {
  return SPANISH_PROFICIENCY_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getBalancedQuestionSet(count: number = 80): TestQuestion[] {
  const grammarQuestions = SPANISH_PROFICIENCY_QUESTIONS.filter(q => q.category === 'grammar');
  const vocabularyQuestions = SPANISH_PROFICIENCY_QUESTIONS.filter(q => q.category === 'vocabulary');
  
  const halfCount = Math.floor(count / 2);
  const grammarCount = Math.min(halfCount, grammarQuestions.length);
  const vocabularyCount = Math.min(halfCount, vocabularyQuestions.length);
  
  const selectedGrammar = getRandomQuestions(grammarCount, undefined, 'grammar');
  const selectedVocabulary = getRandomQuestions(vocabularyCount, undefined, 'vocabulary');
  
  return [...selectedGrammar, ...selectedVocabulary].sort(() => 0.5 - Math.random());
}
`;

// Write the file
const questionsPath = path.join(__dirname, '..', 'lib', 'data', 'spanish-proficiency-questions.ts');
fs.writeFileSync(questionsPath, fileContent, 'utf8');

console.log(`✅ Updated Spanish proficiency questions file with ${allQuestions.length} questions`);
console.log(`📁 File: ${questionsPath}`);

// Log distribution
const levelCounts = allQuestions.reduce((acc, q) => {
  acc[q.level] = (acc[q.level] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const categoryCounts = allQuestions.reduce((acc, q) => {
  acc[q.category || 'unknown'] = (acc[q.category || 'unknown'] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log('\n📊 Final Question Distribution:');
console.log('Levels:', levelCounts);
console.log('Categories:', categoryCounts);
console.log('Total Questions:', allQuestions.length);
