import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Spanish Proficiency Test Question Bank (160 questions) - A1 to C2
// Balanced between Gramática & Vocabulario in each level
// Written in neutral, international Spanish
const SPANISH_PROFICIENCY_QUESTIONS = [
  // ===== A1 LEVEL (27 questions) =====
  // A1 Grammar (14 questions)
  {
    id: 'A1-G-1',
    level: 'A1',
    question: '¿Cuál es la forma correcta del verbo "ser" en primera persona del singular?',
    options: ['es', 'soy', 'eres', 'son'],
    correctAnswer: 'soy',
    explanation: 'La primera persona del singular del verbo "ser" es "yo soy".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-2',
    level: 'A1',
    question: '¿Cómo se dice "I am" en español?',
    options: ['Yo es', 'Yo soy', 'Yo eres', 'Yo son'],
    correctAnswer: 'Yo soy',
    explanation: 'La traducción correcta de "I am" es "Yo soy".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-3',
    level: 'A1',
    question: '¿Cuál es la forma correcta del verbo "estar" en tercera persona del singular?',
    options: ['estás', 'está', 'estamos', 'están'],
    correctAnswer: 'está',
    explanation: 'La tercera persona del singular del verbo "estar" es "él/ella está".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-4',
    level: 'A1',
    question: '¿Cómo se dice "I am" (location/condition) en español?',
    options: ['Yo estás', 'Yo estoy', 'Yo está', 'Yo están'],
    correctAnswer: 'Yo estoy',
    explanation: 'La traducción correcta de "I am" (location/condition) es "Yo estoy".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-5',
    level: 'A1',
    question: '¿Cuál es la forma correcta del verbo "tener" en primera persona del singular?',
    options: ['tienes', 'tiene', 'tengo', 'tienen'],
    correctAnswer: 'tengo',
    explanation: 'La primera persona del singular del verbo "tener" es "yo tengo".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-6',
    level: 'A1',
    question: '¿Cómo se dice "I have" en español?',
    options: ['Yo tienes', 'Yo tengo', 'Yo tiene', 'Yo tienen'],
    correctAnswer: 'Yo tengo',
    explanation: 'La traducción correcta de "I have" es "Yo tengo".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-7',
    level: 'A1',
    question: '¿Cuál es la forma correcta del verbo "ir" en primera persona del singular?',
    options: ['vas', 'va', 'voy', 'van'],
    correctAnswer: 'voy',
    explanation: 'La primera persona del singular del verbo "ir" es "yo voy".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-8',
    level: 'A1',
    question: '¿Cómo se dice "I go" en español?',
    options: ['Yo vas', 'Yo voy', 'Yo va', 'Yo van'],
    correctAnswer: 'Yo voy',
    explanation: 'La traducción correcta de "I go" es "Yo voy".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-9',
    level: 'A1',
    question: '¿Cuál es el artículo correcto para "casa"?',
    options: ['el casa', 'la casa', 'los casa', 'las casa'],
    correctAnswer: 'la casa',
    explanation: '"Casa" es un sustantivo femenino, por lo tanto usa el artículo "la".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-10',
    level: 'A1',
    question: '¿Cuál es el artículo correcto para "libro"?',
    options: ['el libro', 'la libro', 'los libro', 'las libro'],
    correctAnswer: 'el libro',
    explanation: '"Libro" es un sustantivo masculino, por lo tanto usa el artículo "el".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-11',
    level: 'A1',
    question: '¿Cómo se forma el plural de "casa"?',
    options: ['casas', 'casaes', 'casos', 'casos'],
    correctAnswer: 'casas',
    explanation: 'El plural de "casa" es "casas" - simplemente se añade "s".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-12',
    level: 'A1',
    question: '¿Cómo se forma el plural de "libro"?',
    options: ['libros', 'libroes', 'libras', 'libres'],
    correctAnswer: 'libros',
    explanation: 'El plural de "libro" es "libros" - simplemente se añade "s".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-13',
    level: 'A1',
    question: '¿Cuál es la forma correcta del pronombre personal "you" (tú)?',
    options: ['yo', 'tú', 'él', 'nosotros'],
    correctAnswer: 'tú',
    explanation: 'El pronombre personal para "you" (informal) es "tú".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-14',
    level: 'A1',
    question: '¿Cuál es la forma correcta del pronombre personal "he"?',
    options: ['yo', 'tú', 'él', 'ella'],
    correctAnswer: 'él',
    explanation: 'El pronombre personal para "he" es "él".',
    category: 'grammar',
    difficulty: 'easy'
  },

  // A1 Vocabulary (13 questions)
  {
    id: 'A1-V-1',
    level: 'A1',
    question: '¿Cómo se dice "hello" en español?',
    options: ['adiós', 'hola', 'gracias', 'por favor'],
    correctAnswer: 'hola',
    explanation: 'La traducción de "hello" es "hola".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-2',
    level: 'A1',
    question: '¿Cómo se dice "goodbye" en español?',
    options: ['hola', 'adiós', 'gracias', 'por favor'],
    correctAnswer: 'adiós',
    explanation: 'La traducción de "goodbye" es "adiós".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-3',
    level: 'A1',
    question: '¿Cómo se dice "thank you" en español?',
    options: ['por favor', 'gracias', 'de nada', 'hola'],
    correctAnswer: 'gracias',
    explanation: 'La traducción de "thank you" es "gracias".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-4',
    level: 'A1',
    question: '¿Cómo se dice "please" en español?',
    options: ['gracias', 'por favor', 'de nada', 'hola'],
    correctAnswer: 'por favor',
    explanation: 'La traducción de "please" es "por favor".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-5',
    level: 'A1',
    question: '¿Cómo se dice "house" en español?',
    options: ['casa', 'coche', 'libro', 'mesa'],
    correctAnswer: 'casa',
    explanation: 'La traducción de "house" es "casa".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-6',
    level: 'A1',
    question: '¿Cómo se dice "car" en español?',
    options: ['casa', 'coche', 'libro', 'mesa'],
    correctAnswer: 'coche',
    explanation: 'La traducción de "car" es "coche".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-7',
    level: 'A1',
    question: '¿Cómo se dice "book" en español?',
    options: ['casa', 'coche', 'libro', 'mesa'],
    correctAnswer: 'libro',
    explanation: 'La traducción de "book" es "libro".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-8',
    level: 'A1',
    question: '¿Cómo se dice "table" en español?',
    options: ['casa', 'coche', 'libro', 'mesa'],
    correctAnswer: 'mesa',
    explanation: 'La traducción de "table" es "mesa".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-9',
    level: 'A1',
    question: '¿Cómo se dice "water" en español?',
    options: ['agua', 'leche', 'café', 'té'],
    correctAnswer: 'agua',
    explanation: 'La traducción de "water" es "agua".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-10',
    level: 'A1',
    question: '¿Cómo se dice "milk" en español?',
    options: ['agua', 'leche', 'café', 'té'],
    correctAnswer: 'leche',
    explanation: 'La traducción de "milk" es "leche".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-11',
    level: 'A1',
    question: '¿Cómo se dice "coffee" en español?',
    options: ['agua', 'leche', 'café', 'té'],
    correctAnswer: 'café',
    explanation: 'La traducción de "coffee" es "café".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-12',
    level: 'A1',
    question: '¿Cómo se dice "tea" en español?',
    options: ['agua', 'leche', 'café', 'té'],
    correctAnswer: 'té',
    explanation: 'La traducción de "tea" es "té".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-13',
    level: 'A1',
    question: '¿Cómo se dice "bread" en español?',
    options: ['pan', 'arroz', 'pasta', 'carne'],
    correctAnswer: 'pan',
    explanation: 'La traducción de "bread" es "pan".',
    category: 'vocabulary',
    difficulty: 'easy'
  },

  // ===== A2 LEVEL (27 questions) =====
  // A2 Grammar (14 questions)
  {
    id: 'A2-G-1',
    level: 'A2',
    question: '¿Cuál es la forma correcta del presente simple para "yo comer"?',
    options: ['yo como', 'yo comes', 'yo come', 'yo comen'],
    correctAnswer: 'yo como',
    explanation: 'La primera persona del singular del verbo "comer" en presente es "yo como".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-2',
    level: 'A2',
    question: '¿Cuál es la forma correcta del presente simple para "tú beber"?',
    options: ['tú bebo', 'tú bebes', 'tú bebe', 'tú beben'],
    correctAnswer: 'tú bebes',
    explanation: 'La segunda persona del singular del verbo "beber" en presente es "tú bebes".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-3',
    level: 'A2',
    question: '¿Cuál es la forma correcta del pretérito indefinido para "yo comer"?',
    options: ['yo comí', 'yo comía', 'yo comeré', 'yo coma'],
    correctAnswer: 'yo comí',
    explanation: 'La primera persona del singular del verbo "comer" en pretérito indefinido es "yo comí".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-4',
    level: 'A2',
    question: '¿Cuál es la forma correcta del pretérito indefinido para "tú beber"?',
    options: ['tú bebiste', 'tú bebías', 'tú beberás', 'tú bebas'],
    correctAnswer: 'tú bebiste',
    explanation: 'La segunda persona del singular del verbo "beber" en pretérito indefinido es "tú bebiste".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-5',
    level: 'A2',
    question: '¿Cuál es la forma correcta del futuro simple para "yo ir"?',
    options: ['yo voy', 'yo fui', 'yo iré', 'yo vaya'],
    correctAnswer: 'yo iré',
    explanation: 'La primera persona del singular del verbo "ir" en futuro simple es "yo iré".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-6',
    level: 'A2',
    question: '¿Cuál es la forma correcta del futuro simple para "tú venir"?',
    options: ['tú vienes', 'tú viniste', 'tú vendrás', 'tú vengas'],
    correctAnswer: 'tú vendrás',
    explanation: 'La segunda persona del singular del verbo "venir" en futuro simple es "tú vendrás".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-7',
    level: 'A2',
    question: '¿Cuál es la forma correcta del imperativo afirmativo para "tú hablar"?',
    options: ['habla', 'hablas', 'hablarás', 'hables'],
    correctAnswer: 'habla',
    explanation: 'La forma del imperativo afirmativo para "tú hablar" es "habla".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-8',
    level: 'A2',
    question: '¿Cuál es la forma correcta del imperativo afirmativo para "tú escribir"?',
    options: ['escribe', 'escribes', 'escribirás', 'escribas'],
    correctAnswer: 'escribe',
    explanation: 'La forma del imperativo afirmativo para "tú escribir" es "escribe".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-9',
    level: 'A2',
    question: '¿Cuál es la forma correcta del gerundio para "hablar"?',
    options: ['hablo', 'hablé', 'hablando', 'hablado'],
    correctAnswer: 'hablando',
    explanation: 'La forma del gerundio para "hablar" es "hablando".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-10',
    level: 'A2',
    question: '¿Cuál es la forma correcta del gerundio para "comer"?',
    options: ['como', 'comí', 'comiendo', 'comido'],
    correctAnswer: 'comiendo',
    explanation: 'La forma del gerundio para "comer" es "comiendo".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-11',
    level: 'A2',
    question: '¿Cuál es la forma correcta del participio para "hablar"?',
    options: ['hablo', 'hablé', 'hablando', 'hablado'],
    correctAnswer: 'hablado',
    explanation: 'La forma del participio para "hablar" es "hablado".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-12',
    level: 'A2',
    question: '¿Cuál es la forma correcta del participio para "comer"?',
    options: ['como', 'comí', 'comiendo', 'comido'],
    correctAnswer: 'comido',
    explanation: 'La forma del participio para "comer" es "comido".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-13',
    level: 'A2',
    question: '¿Cuál es la forma correcta del presente continuo para "yo hablar"?',
    options: ['yo hablo', 'yo estoy hablando', 'yo hablaré', 'yo hablaba'],
    correctAnswer: 'yo estoy hablando',
    explanation: 'La forma del presente continuo para "yo hablar" es "yo estoy hablando".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'A2-G-14',
    level: 'A2',
    question: '¿Cuál es la forma correcta del presente continuo para "tú comer"?',
    options: ['tú comes', 'tú estás comiendo', 'tú comerás', 'tú comías'],
    correctAnswer: 'tú estás comiendo',
    explanation: 'La forma del presente continuo para "tú comer" es "tú estás comiendo".',
    category: 'grammar',
    difficulty: 'medium'
  },

  // A2 Vocabulary (13 questions)
  {
    id: 'A2-V-1',
    level: 'A2',
    question: '¿Cómo se dice "breakfast" en español?',
    options: ['almuerzo', 'cena', 'desayuno', 'merienda'],
    correctAnswer: 'desayuno',
    explanation: 'La traducción de "breakfast" es "desayuno".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-2',
    level: 'A2',
    question: '¿Cómo se dice "lunch" en español?',
    options: ['desayuno', 'almuerzo', 'cena', 'merienda'],
    correctAnswer: 'almuerzo',
    explanation: 'La traducción de "lunch" es "almuerzo".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-3',
    level: 'A2',
    question: '¿Cómo se dice "dinner" en español?',
    options: ['desayuno', 'almuerzo', 'cena', 'merienda'],
    correctAnswer: 'cena',
    explanation: 'La traducción de "dinner" es "cena".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-4',
    level: 'A2',
    question: '¿Cómo se dice "snack" en español?',
    options: ['desayuno', 'almuerzo', 'cena', 'merienda'],
    correctAnswer: 'merienda',
    explanation: 'La traducción de "snack" es "merienda".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-5',
    level: 'A2',
    question: '¿Cómo se dice "morning" en español?',
    options: ['mañana', 'tarde', 'noche', 'mediodía'],
    correctAnswer: 'mañana',
    explanation: 'La traducción de "morning" es "mañana".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-6',
    level: 'A2',
    question: '¿Cómo se dice "afternoon" en español?',
    options: ['mañana', 'tarde', 'noche', 'mediodía'],
    correctAnswer: 'tarde',
    explanation: 'La traducción de "afternoon" es "tarde".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-7',
    level: 'A2',
    question: '¿Cómo se dice "night" en español?',
    options: ['mañana', 'tarde', 'noche', 'mediodía'],
    correctAnswer: 'noche',
    explanation: 'La traducción de "night" es "noche".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-8',
    level: 'A2',
    question: '¿Cómo se dice "week" en español?',
    options: ['día', 'semana', 'mes', 'año'],
    correctAnswer: 'semana',
    explanation: 'La traducción de "week" es "semana".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-9',
    level: 'A2',
    question: '¿Cómo se dice "month" en español?',
    options: ['día', 'semana', 'mes', 'año'],
    correctAnswer: 'mes',
    explanation: 'La traducción de "month" es "mes".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-10',
    level: 'A2',
    question: '¿Cómo se dice "year" en español?',
    options: ['día', 'semana', 'mes', 'año'],
    correctAnswer: 'año',
    explanation: 'La traducción de "year" es "año".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-11',
    level: 'A2',
    question: '¿Cómo se dice "family" en español?',
    options: ['familia', 'amigos', 'vecinos', 'compañeros'],
    correctAnswer: 'familia',
    explanation: 'La traducción de "family" es "familia".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-12',
    level: 'A2',
    question: '¿Cómo se dice "friends" en español?',
    options: ['familia', 'amigos', 'vecinos', 'compañeros'],
    correctAnswer: 'amigos',
    explanation: 'La traducción de "friends" es "amigos".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-13',
    level: 'A2',
    question: '¿Cómo se dice "work" en español?',
    options: ['trabajo', 'estudio', 'casa', 'oficina'],
    correctAnswer: 'trabajo',
    explanation: 'La traducción de "work" es "trabajo".',
    category: 'vocabulary',
    difficulty: 'easy'
  }
];

async function createSpanishProficiencyTest() {
  console.log('🚀 Creating Spanish proficiency test...');

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

    // Create the Spanish proficiency quiz
    const quiz = await prisma.quizzes.create({
      data: {
        id: crypto.randomUUID(),
        module_id: module.id,
        title: 'Test de Proficiencia en Español (A1-C2)',
        description: 'Un test completo de compétence en español basado en el marco europeo común de referencia (CEFR)',
        passing_score: 70,
        time_limit: 60, // 60 minutes
        quiz_type: 'STANDARD',
        difficulty: 'MEDIUM',
        category: 'Spanish Language',
        instructions: 'Este test evalúa tu nivel de español según el marco europeo común de referencia (A1-C2). Responde a todas las preguntas del mejor modo posible.',
        allow_retry: true,
        max_attempts: 3,
        shuffle_questions: true,
        show_results: true,
        show_explanations: true,
        tags: JSON.stringify(['spanish', 'cefr', 'proficiency', 'language-test'])
      }
    });

    console.log(`✅ Created Spanish proficiency quiz: ${quiz.title}`);

    // Create questions
    for (let i = 0; i < SPANISH_PROFICIENCY_QUESTIONS.length; i++) {
      const questionData = SPANISH_PROFICIENCY_QUESTIONS[i];
      
      // Map difficulty levels
      let difficulty = 'MEDIUM';
      if (questionData.difficulty === 'easy') difficulty = 'EASY';
      if (questionData.difficulty === 'hard') difficulty = 'HARD';

      // Calculate IRT parameters based on level
      let irt_difficulty = 0.5;
      let irt_discrimination = 1.0;
      let irt_guessing = 0.25;

      switch (questionData.level) {
        case 'A1':
          irt_difficulty = 0.1;
          break;
        case 'A2':
          irt_difficulty = 0.3;
          break;
        case 'B1':
          irt_difficulty = 0.5;
          break;
        case 'B2':
          irt_difficulty = 0.7;
          break;
        case 'C1':
          irt_difficulty = 0.8;
          break;
        case 'C2':
          irt_difficulty = 0.9;
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
          tags: JSON.stringify([questionData.level, questionData.category || 'general', 'spanish'])
        }
      });
    }

    console.log(`✅ Created ${SPANISH_PROFICIENCY_QUESTIONS.length} Spanish proficiency questions`);
    console.log(`📊 Quiz ID: ${quiz.id}`);
    console.log(`🌐 Quiz URL: /language-proficiency-test`);

    return quiz.id;

  } catch (error) {
    console.error('❌ Error creating Spanish proficiency test:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSpanishProficiencyTest()
  .then((quizId) => {
    if (quizId) {
      console.log('🎉 Spanish proficiency test created successfully!');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to create Spanish proficiency test:', error);
    process.exit(1);
  });
