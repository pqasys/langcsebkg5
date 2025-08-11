import * as fs from 'fs';
import * as path from 'path';

// Real A1 and A2 questions provided by the user
const realA1Questions = [
  // A1 Grammar
  {
    "id": "A1-G-1",
    "level": "A1",
    "question": "¿Cuál es la forma correcta del verbo 'ser' en la frase: Yo ___ estudiante?",
    "options": ["es", "eres", "soy", "somos"],
    "correctAnswer": "soy",
    "explanation": "El verbo 'ser' se conjuga como 'soy' en primera persona singular.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-2",
    "level": "A1",
    "question": "Selecciona el artículo definido para 'libro'.",
    "options": ["la", "el", "los", "las"],
    "correctAnswer": "el",
    "explanation": "'Libro' es masculino singular, por lo que usa el artículo 'el'.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-3",
    "level": "A1",
    "question": "¿Cómo se conjuga 'hablar' con 'tú' en presente?",
    "options": ["hablas", "hablo", "habla", "hablamos"],
    "correctAnswer": "hablas",
    "explanation": "El verbo 'hablar' se conjuga como 'hablas' en segunda persona singular.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-4",
    "level": "A1",
    "question": "Completa: Nosotros ___ amigos.",
    "options": ["soy", "es", "somos", "son"],
    "correctAnswer": "somos",
    "explanation": "El verbo 'ser' se conjuga como 'somos' en primera persona plural.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-5",
    "level": "A1",
    "question": "¿Qué pronombre corresponde a 'María y yo'?",
    "options": ["ellos", "nosotros", "tú", "usted"],
    "correctAnswer": "nosotros",
    "explanation": "'María y yo' se refiere a primera persona plural, por lo que es 'nosotros'.",
    "category": "grammar",
    "difficulty": "easy"
  },
  // A1 Vocabulary
  {
    "id": "A1-V-1",
    "level": "A1",
    "question": "¿Qué palabra significa 'dog'?",
    "options": ["gato", "casa", "perro", "mesa"],
    "correctAnswer": "perro",
    "explanation": "'Perro' es la traducción de 'dog' en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-2",
    "level": "A1",
    "question": "¿Cuál es un color?",
    "options": ["silla", "azul", "mano", "calle"],
    "correctAnswer": "azul",
    "explanation": "'Azul' es un color en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-3",
    "level": "A1",
    "question": "¿Cuál es el antónimo de 'grande'?",
    "options": ["alto", "bajo", "pequeño", "largo"],
    "correctAnswer": "pequeño",
    "explanation": "'Pequeño' es el antónimo de 'grande'.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-4",
    "level": "A1",
    "question": "¿Qué día sigue después del lunes?",
    "options": ["martes", "jueves", "domingo", "viernes"],
    "correctAnswer": "martes",
    "explanation": "El martes sigue después del lunes en la semana.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-5",
    "level": "A1",
    "question": "¿Cuál de estas palabras es una bebida?",
    "options": ["leche", "zapato", "coche", "papel"],
    "correctAnswer": "leche",
    "explanation": "'Leche' es una bebida en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  }
];

const realA2Questions = [
  // A2 Grammar
  {
    "id": "A2-G-1",
    "level": "A2",
    "question": "¿Cuál es la forma correcta: 'Ellos ___ al cine ayer'?",
    "options": ["fueron", "van", "irán", "iban"],
    "correctAnswer": "fueron",
    "explanation": "Se usa el pretérito indefinido 'fueron' para acciones completadas en el pasado.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-2",
    "level": "A2",
    "question": "Completa: ¿___ tú venir con nosotros?",
    "options": ["Quieres", "Quiero", "Quiere", "Quieren"],
    "correctAnswer": "Quieres",
    "explanation": "Se usa 'quieres' para preguntar a la segunda persona singular.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-3",
    "level": "A2",
    "question": "¿Cómo se dice 'We are going to eat' en español?",
    "options": ["Vamos a comer", "Iremos a comer", "Comemos ahora", "Estamos comiendo"],
    "correctAnswer": "Vamos a comer",
    "explanation": "'Vamos a comer' es la forma correcta de expresar futuro próximo.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-4",
    "level": "A2",
    "question": "Selecciona la preposición correcta: Estoy ___ la casa.",
    "options": ["en", "con", "de", "por"],
    "correctAnswer": "en",
    "explanation": "Se usa 'en' para indicar ubicación dentro de un lugar.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-5",
    "level": "A2",
    "question": "¿Cuál es el pretérito de 'comer' con 'él'?",
    "options": ["comía", "comerá", "comió", "come"],
    "correctAnswer": "comió",
    "explanation": "El pretérito indefinido de 'comer' en tercera persona singular es 'comió'.",
    "category": "grammar",
    "difficulty": "medium"
  },
  // A2 Vocabulary
  {
    "id": "A2-V-1",
    "level": "A2",
    "question": "¿Cuál palabra se relaciona con la escuela?",
    "options": ["cuaderno", "sartén", "sofá", "leche"],
    "correctAnswer": "cuaderno",
    "explanation": "'Cuaderno' es un objeto relacionado con la escuela.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-2",
    "level": "A2",
    "question": "¿Qué palabra es un verbo?",
    "options": ["escribir", "mesa", "azul", "puerta"],
    "correctAnswer": "escribir",
    "explanation": "'Escribir' es un verbo en infinitivo.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-3",
    "level": "A2",
    "question": "¿Qué objeto se usa para escribir?",
    "options": ["lápiz", "silla", "pan", "mesa"],
    "correctAnswer": "lápiz",
    "explanation": "'Lápiz' es el objeto que se usa para escribir.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-4",
    "level": "A2",
    "question": "¿Cuál palabra es una prenda de vestir?",
    "options": ["camisa", "libro", "agua", "papel"],
    "correctAnswer": "camisa",
    "explanation": "'Camisa' es una prenda de vestir.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-5",
    "level": "A2",
    "question": "¿Qué palabra es un sinónimo de 'contento'?",
    "options": ["feliz", "triste", "cansado", "preocupado"],
    "correctAnswer": "feliz",
    "explanation": "'Feliz' es un sinónimo de 'contento'.",
    "category": "vocabulary",
    "difficulty": "medium"
  }
];

// Generate placeholder questions for remaining levels (B1-C2)
function generatePlaceholderQuestions() {
  const questions = [];
  
  // We need 140 placeholder questions to reach 160 total (10 A1 + 10 A2 + 140 B1-C2)
  
  // B1 Level (27 questions: 14 Grammar, 13 Vocabulary)
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
  
  // B2 Level (27 questions: 14 Grammar, 13 Vocabulary)
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
  
  // C1 Level (27 questions: 14 Grammar, 13 Vocabulary)
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
  
  // C2 Level (25 questions: 13 Grammar, 12 Vocabulary) - To reach exactly 160
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

// Combine real A1/A2 questions with placeholder B1-C2 questions
const allQuestions = [
  ...realA1Questions,
  ...realA2Questions,
  ...generatePlaceholderQuestions()
];

// Generate the file content
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
export function getRandomQuestions(questions: TestQuestion[], count: number): TestQuestion[] {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByLevel(questions: TestQuestion[], level: string): TestQuestion[] {
  return questions.filter(q => q.level === level);
}

export function getQuestionsByCategory(questions: TestQuestion[], category: string): TestQuestion[] {
  return questions.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(questions: TestQuestion[], difficulty: string): TestQuestion[] {
  return questions.filter(q => q.difficulty === difficulty);
}

export function getBalancedQuestionSet(count: number): TestQuestion[] {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const categories = ['grammar', 'vocabulary'];
  const questionsPerLevel = Math.floor(count / levels.length);
  const questionsPerCategory = Math.floor(questionsPerLevel / categories.length);
  
  let balancedQuestions: TestQuestion[] = [];
  
  levels.forEach(level => {
    categories.forEach(category => {
      const levelCategoryQuestions = SPANISH_PROFICIENCY_QUESTIONS.filter(
        q => q.level === level && q.category === category
      );
      const selected = getRandomQuestions(levelCategoryQuestions, questionsPerCategory);
      balancedQuestions.push(...selected);
    });
  });
  
  // Fill remaining slots with random questions
  const remaining = count - balancedQuestions.length;
  if (remaining > 0) {
    const usedIds = new Set(balancedQuestions.map(q => q.id));
    const availableQuestions = SPANISH_PROFICIENCY_QUESTIONS.filter(q => !usedIds.has(q.id));
    const additional = getRandomQuestions(availableQuestions, remaining);
    balancedQuestions.push(...additional);
  }
  
  return balancedQuestions;
}
`;

// Write the file
const questionsPath = path.join(__dirname, '..', 'lib', 'data', 'spanish-proficiency-questions.ts');
fs.writeFileSync(questionsPath, fileContent, 'utf8');

console.log(`✅ Updated Spanish proficiency questions file with ${allQuestions.length} questions`);
console.log(`📊 Distribution:`);
console.log(`   A1: ${realA1Questions.length} questions (${realA1Questions.filter(q => q.category === 'grammar').length} grammar, ${realA1Questions.filter(q => q.category === 'vocabulary').length} vocabulary)`);
console.log(`   A2: ${realA2Questions.length} questions (${realA2Questions.filter(q => q.category === 'grammar').length} grammar, ${realA2Questions.filter(q => q.category === 'vocabulary').length} vocabulary)`);
console.log(`   B1-C2: ${generatePlaceholderQuestions().length} placeholder questions`);
console.log(`   Total: ${allQuestions.length} questions`);
console.log(`\n📝 Note: A1 and A2 questions are now authentic. B1-C2 questions are placeholders awaiting content.`);
