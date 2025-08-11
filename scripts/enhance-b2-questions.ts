import * as fs from 'fs';
import * as path from 'path';

// B2 Grammar Questions (14 questions)
const B2_GRAMMAR_QUESTIONS = [
  {
    id: 'B2-G-1',
    level: 'B2',
    question: '¿Cuál es la forma correcta del pretérito pluscuamperfecto para "yo comer"?',
    options: ['yo había comido', 'yo he comido', 'yo comí', 'yo comía'],
    correctAnswer: 'yo había comido',
    explanation: 'El pretérito pluscuamperfecto se forma con "haber" en imperfecto + participio pasado.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-2',
    level: 'B2',
    question: '¿Cómo se forma el condicional compuesto?',
    options: ['haber + infinitivo', 'habría + participio', 'haber + participio', 'habría + infinitivo'],
    correctAnswer: 'habría + participio',
    explanation: 'El condicional compuesto se forma con "habría" + participio pasado.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-3',
    level: 'B2',
    question: '¿Qué tiempo verbal se usa para expresar probabilidad en el pasado?',
    options: ['pretérito perfecto', 'condicional simple', 'futuro perfecto', 'pretérito pluscuamperfecto'],
    correctAnswer: 'condicional simple',
    explanation: 'El condicional simple se usa para expresar probabilidad en el pasado (Serían las 3:00).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-4',
    level: 'B2',
    question: '¿Cómo se forma el subjuntivo imperfecto para verbos regulares -ar?',
    options: ['infinitivo sin -ar + ara', 'infinitivo sin -ar + ase', 'infinitivo sin -ar + are', 'infinitivo sin -ar + ase'],
    correctAnswer: 'infinitivo sin -ar + ara',
    explanation: 'Para verbos -ar, se quita -ar y se añade -ara (hablar → hablara).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-5',
    level: 'B2',
    question: '¿Qué conjunción introduce una cláusula concesiva?',
    options: ['aunque', 'porque', 'si', 'cuando'],
    correctAnswer: 'aunque',
    explanation: '"Aunque" introduce una cláusula concesiva (Aunque llueva, iré).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-6',
    level: 'B2',
    question: '¿Cuál es la forma correcta del verbo "estar" en subjuntivo imperfecto para "yo"?',
    options: ['estuviera', 'estuviese', 'estuviera/estuviese', 'estoy'],
    correctAnswer: 'estuviera/estuviese',
    explanation: 'Ambas formas son correctas: "estuviera" y "estuviese".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-7',
    level: 'B2',
    question: '¿Cómo se forma la voz pasiva refleja?',
    options: ['se + verbo en 3ª persona', 'ser + participio', 'estar + participio', 'haber + participio'],
    correctAnswer: 'se + verbo en 3ª persona',
    explanation: 'La voz pasiva refleja se forma con "se" + verbo en tercera persona (Se venden libros).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-8',
    level: 'B2',
    question: '¿Qué tiempo verbal se usa después de "como si"?',
    options: ['subjuntivo imperfecto', 'subjuntivo presente', 'indicativo', 'condicional'],
    correctAnswer: 'subjuntivo imperfecto',
    explanation: 'Después de "como si" se usa el subjuntivo imperfecto (Como si fuera fácil).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-9',
    level: 'B2',
    question: '¿Cómo se forma el gerundio compuesto?',
    options: ['haber + gerundio', 'habiendo + participio', 'estar + gerundio', 'ser + gerundio'],
    correctAnswer: 'habiendo + participio',
    explanation: 'El gerundio compuesto se forma con "habiendo" + participio pasado.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-10',
    level: 'B2',
    question: '¿Qué preposición se usa con "consistir"?',
    options: ['en', 'de', 'con', 'por'],
    correctAnswer: 'en',
    explanation: 'El verbo "consistir" se construye con la preposición "en" (Consiste en estudiar).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-11',
    level: 'B2',
    question: '¿Cuál es la forma correcta del verbo "tener" en futuro perfecto para "yo"?',
    options: ['tendré', 'habré tenido', 'tendría', 'habría tenido'],
    correctAnswer: 'habré tenido',
    explanation: 'La primera persona del singular del futuro perfecto de "tener" es "habré tenido".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-12',
    level: 'B2',
    question: '¿Cómo se forma el imperativo formal (usted)?',
    options: ['subjuntivo presente 3ª persona', 'infinitivo', 'presente 3ª persona', 'condicional'],
    correctAnswer: 'subjuntivo presente 3ª persona',
    explanation: 'El imperativo formal se forma con el subjuntivo presente en tercera persona (Hable usted).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-13',
    level: 'B2',
    question: '¿Qué conjunción introduce una cláusula de causa?',
    options: ['porque', 'aunque', 'si', 'cuando'],
    correctAnswer: 'porque',
    explanation: '"Porque" introduce una cláusula de causa (No fui porque estaba enfermo).',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'B2-G-14',
    level: 'B2',
    question: '¿Cómo se forma el participio de verbos irregulares como "hacer"?',
    options: ['hecho', 'hacido', 'haciendo', 'hacer'],
    correctAnswer: 'hecho',
    explanation: 'El participio de "hacer" es "hecho" (irregular).',
    category: 'grammar',
    difficulty: 'hard'
  }
];

// B2 Vocabulary Questions (13 questions)
const B2_VOCABULARY_QUESTIONS = [
  {
    id: 'B2-V-1',
    level: 'B2',
    question: '¿Qué significa "sostenibilidad"?',
    options: ['sustainability', 'maintenance', 'preservation', 'conservation'],
    correctAnswer: 'sustainability',
    explanation: '"Sostenibilidad" significa "sustainability" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-2',
    level: 'B2',
    question: '¿Cómo se dice "entrepreneurship" en español?',
    options: ['emprendimiento', 'empresa', 'negocio', 'comercio'],
    correctAnswer: 'emprendimiento',
    explanation: '"Entrepreneurship" se dice "emprendimiento" en español.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-3',
    level: 'B2',
    question: '¿Qué significa "globalización"?',
    options: ['globalization', 'internationalization', 'worldwide', 'universal'],
    correctAnswer: 'globalization',
    explanation: '"Globalización" significa "globalization" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-4',
    level: 'B2',
    question: '¿Cómo se dice "infrastructure" en español?',
    options: ['infraestructura', 'estructura', 'construcción', 'edificio'],
    correctAnswer: 'infraestructura',
    explanation: '"Infrastructure" se dice "infraestructura" en español.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-5',
    level: 'B2',
    question: '¿Qué significa "biodiversidad"?',
    options: ['biodiversity', 'biology', 'ecology', 'environment'],
    correctAnswer: 'biodiversity',
    explanation: '"Biodiversidad" significa "biodiversity" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-6',
    level: 'B2',
    question: '¿Cómo se dice "democracy" en español?',
    options: ['democracia', 'gobierno', 'política', 'sociedad'],
    correctAnswer: 'democracia',
    explanation: '"Democracy" se dice "democracia" en español.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-7',
    level: 'B2',
    question: '¿Qué significa "transparencia"?',
    options: ['transparency', 'clarity', 'honesty', 'openness'],
    correctAnswer: 'transparency',
    explanation: '"Transparencia" significa "transparency" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-8',
    level: 'B2',
    question: '¿Cómo se dice "accountability" en español?',
    options: ['responsabilidad', 'rendición de cuentas', 'obligación', 'deber'],
    correctAnswer: 'rendición de cuentas',
    explanation: '"Accountability" se dice "rendición de cuentas" en español.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-9',
    level: 'B2',
    question: '¿Qué significa "innovación"?',
    options: ['innovation', 'creation', 'invention', 'development'],
    correctAnswer: 'innovation',
    explanation: '"Innovación" significa "innovation" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-10',
    level: 'B2',
    question: '¿Cómo se dice "sustainability" en español?',
    options: ['sostenibilidad', 'sustentabilidad', 'durabilidad', 'all of the above'],
    correctAnswer: 'all of the above',
    explanation: '"Sustainability" se puede traducir como "sostenibilidad", "sustentabilidad" o "durabilidad".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-11',
    level: 'B2',
    question: '¿Qué significa "gobernanza"?',
    options: ['governance', 'government', 'management', 'administration'],
    correctAnswer: 'governance',
    explanation: '"Gobernanza" significa "governance" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-12',
    level: 'B2',
    question: '¿Cómo se dice "stakeholder" en español?',
    options: ['parte interesada', 'interesado', 'participante', 'all of the above'],
    correctAnswer: 'all of the above',
    explanation: '"Stakeholder" se puede traducir como "parte interesada", "interesado" o "participante".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'B2-V-13',
    level: 'B2',
    question: '¿Qué significa "resiliencia"?',
    options: ['resilience', 'resistance', 'strength', 'endurance'],
    correctAnswer: 'resilience',
    explanation: '"Resiliencia" significa "resilience" en inglés.',
    category: 'vocabulary',
    difficulty: 'hard'
  }
];

console.log('✅ B2 Grammar Questions:', B2_GRAMMAR_QUESTIONS.length);
console.log('✅ B2 Vocabulary Questions:', B2_VOCABULARY_QUESTIONS.length);
console.log('📝 Total B2 Questions:', B2_GRAMMAR_QUESTIONS.length + B2_VOCABULARY_QUESTIONS.length);
