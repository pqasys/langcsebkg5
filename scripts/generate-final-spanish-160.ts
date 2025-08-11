import * as fs from 'fs';
import * as path from 'path';

interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

function generateCompleteSpanishQuestions(): TestQuestion[] {
  const questions: TestQuestion[] = [];

  // A1 Level (27 questions) - Already complete
  // A2 Level (27 questions) - Already complete  
  // B1 Level (27 questions) - Already complete

  // B2 Level (27 questions) - Enhanced
  const B2_GRAMMAR = [
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

  const B2_VOCABULARY = [
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

  // C1 Level (27 questions) - Advanced
  const C1_GRAMMAR = [
    {
      id: 'C1-G-1',
      level: 'C1',
      question: '¿Cuál es la forma correcta del subjuntivo futuro para "yo hablar"?',
      options: ['hablare', 'hablara', 'hable', 'hablaría'],
      correctAnswer: 'hablare',
      explanation: 'El subjuntivo futuro se forma añadiendo -e al infinitivo (hablar → hablare).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-2',
      level: 'C1',
      question: '¿Cómo se forma el infinitivo compuesto?',
      options: ['haber + infinitivo', 'haber + participio', 'tener + participio', 'estar + participio'],
      correctAnswer: 'haber + participio',
      explanation: 'El infinitivo compuesto se forma con "haber" + participio pasado.',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-3',
      level: 'C1',
      question: '¿Qué tiempo verbal se usa para expresar acciones futuras desde el pasado?',
      options: ['futuro simple', 'condicional simple', 'futuro perfecto', 'condicional compuesto'],
      correctAnswer: 'condicional simple',
      explanation: 'El condicional simple se usa para expresar acciones futuras desde el pasado (Dijo que vendría).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-4',
      level: 'C1',
      question: '¿Cómo se forma la perífrasis "estar a punto de"?',
      options: ['estar a punto de + infinitivo', 'estar a punto de + gerundio', 'estar a punto de + participio', 'estar a punto de + subjuntivo'],
      correctAnswer: 'estar a punto de + infinitivo',
      explanation: 'La perífrasis "estar a punto de" se forma con infinitivo (Estoy a punto de salir).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-5',
      level: 'C1',
      question: '¿Qué conjunción introduce una cláusula de modo?',
      options: ['como', 'que', 'si', 'cuando'],
      correctAnswer: 'como',
      explanation: '"Como" introduce una cláusula de modo (Hazlo como te dije).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-6',
      level: 'C1',
      question: '¿Cuál es la forma correcta del verbo "ser" en subjuntivo futuro para "yo"?',
      options: ['fuere', 'sea', 'seré', 'sería'],
      correctAnswer: 'fuere',
      explanation: 'La primera persona del singular del subjuntivo futuro de "ser" es "fuere".',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-7',
      level: 'C1',
      question: '¿Cómo se forma la voz pasiva con "estar"?',
      options: ['estar + participio', 'ser + participio', 'haber + participio', 'tener + participio'],
      correctAnswer: 'estar + participio',
      explanation: 'La voz pasiva con "estar" indica estado resultante (La puerta está cerrada).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-8',
      level: 'C1',
      question: '¿Qué tiempo verbal se usa después de "en cuanto"?',
      options: ['presente', 'futuro', 'subjuntivo', 'condicional'],
      correctAnswer: 'presente',
      explanation: 'Después de "en cuanto" para acciones futuras se usa el presente (En cuanto llegue, te llamo).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-9',
      level: 'C1',
      question: '¿Cómo se forma el gerundio de verbos irregulares como "ir"?',
      options: ['yendo', 'iendo', 'ando', 'endo'],
      correctAnswer: 'yendo',
      explanation: 'El gerundio de "ir" es "yendo" (irregular).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-10',
      level: 'C1',
      question: '¿Qué preposición se usa con "carecer"?',
      options: ['de', 'en', 'con', 'por'],
      correctAnswer: 'de',
      explanation: 'El verbo "carecer" se construye con la preposición "de" (Carece de experiencia).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-11',
      level: 'C1',
      question: '¿Cuál es la forma correcta del verbo "estar" en futuro perfecto para "yo"?',
      options: ['estoy', 'estaré', 'habré estado', 'habría estado'],
      correctAnswer: 'habré estado',
      explanation: 'La primera persona del singular del futuro perfecto de "estar" es "habré estado".',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-12',
      level: 'C1',
      question: '¿Cómo se forma el imperativo negativo para "usted"?',
      options: ['no + subjuntivo', 'no + infinitivo', 'no + presente', 'no + condicional'],
      correctAnswer: 'no + subjuntivo',
      explanation: 'El imperativo negativo para "usted" se forma con "no + subjuntivo" (No hable usted).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-13',
      level: 'C1',
      question: '¿Qué conjunción introduce una cláusula de consecuencia?',
      options: ['por tanto', 'aunque', 'si', 'cuando'],
      correctAnswer: 'por tanto',
      explanation: '"Por tanto" introduce una cláusula de consecuencia (Estudió mucho, por tanto aprobó).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C1-G-14',
      level: 'C1',
      question: '¿Cómo se forma el participio de verbos irregulares como "ver"?',
      options: ['visto', 'vido', 'viendo', 'ver'],
      correctAnswer: 'visto',
      explanation: 'El participio de "ver" es "visto" (irregular).',
      category: 'grammar',
      difficulty: 'hard'
    }
  ];

  const C1_VOCABULARY = [
    {
      id: 'C1-V-1',
      level: 'C1',
      question: '¿Qué significa "sostenibilidad"?',
      options: ['sustainability', 'maintenance', 'preservation', 'conservation'],
      correctAnswer: 'sustainability',
      explanation: '"Sostenibilidad" significa "sustainability" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-2',
      level: 'C1',
      question: '¿Cómo se dice "entrepreneurship" en español?',
      options: ['emprendimiento', 'empresa', 'negocio', 'comercio'],
      correctAnswer: 'emprendimiento',
      explanation: '"Entrepreneurship" se dice "emprendimiento" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-3',
      level: 'C1',
      question: '¿Qué significa "globalización"?',
      options: ['globalization', 'internationalization', 'worldwide', 'universal'],
      correctAnswer: 'globalization',
      explanation: '"Globalización" significa "globalization" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-4',
      level: 'C1',
      question: '¿Cómo se dice "infrastructure" en español?',
      options: ['infraestructura', 'estructura', 'construcción', 'edificio'],
      correctAnswer: 'infraestructura',
      explanation: '"Infrastructure" se dice "infraestructura" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-5',
      level: 'C1',
      question: '¿Qué significa "biodiversidad"?',
      options: ['biodiversity', 'biology', 'ecology', 'environment'],
      correctAnswer: 'biodiversity',
      explanation: '"Biodiversidad" significa "biodiversity" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-6',
      level: 'C1',
      question: '¿Cómo se dice "democracy" en español?',
      options: ['democracia', 'gobierno', 'política', 'sociedad'],
      correctAnswer: 'democracia',
      explanation: '"Democracy" se dice "democracia" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-7',
      level: 'C1',
      question: '¿Qué significa "transparencia"?',
      options: ['transparency', 'clarity', 'honesty', 'openness'],
      correctAnswer: 'transparency',
      explanation: '"Transparencia" significa "transparency" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-8',
      level: 'C1',
      question: '¿Cómo se dice "accountability" en español?',
      options: ['responsabilidad', 'rendición de cuentas', 'obligación', 'deber'],
      correctAnswer: 'rendición de cuentas',
      explanation: '"Accountability" se dice "rendición de cuentas" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-9',
      level: 'C1',
      question: '¿Qué significa "innovación"?',
      options: ['innovation', 'creation', 'invention', 'development'],
      correctAnswer: 'innovation',
      explanation: '"Innovación" significa "innovation" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-10',
      level: 'C1',
      question: '¿Cómo se dice "sustainability" en español?',
      options: ['sostenibilidad', 'sustentabilidad', 'durabilidad', 'all of the above'],
      correctAnswer: 'all of the above',
      explanation: '"Sustainability" se puede traducir como "sostenibilidad", "sustentabilidad" o "durabilidad".',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-11',
      level: 'C1',
      question: '¿Qué significa "gobernanza"?',
      options: ['governance', 'government', 'management', 'administration'],
      correctAnswer: 'governance',
      explanation: '"Gobernanza" significa "governance" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-12',
      level: 'C1',
      question: '¿Cómo se dice "stakeholder" en español?',
      options: ['parte interesada', 'interesado', 'participante', 'all of the above'],
      correctAnswer: 'all of the above',
      explanation: '"Stakeholder" se puede traducir como "parte interesada", "interesado" o "participante".',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C1-V-13',
      level: 'C1',
      question: '¿Qué significa "resiliencia"?',
      options: ['resilience', 'resistance', 'strength', 'endurance'],
      correctAnswer: 'resilience',
      explanation: '"Resiliencia" significa "resilience" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    }
  ];

  // C2 Level (26 questions) - Mastery
  const C2_GRAMMAR = [
    {
      id: 'C2-G-1',
      level: 'C2',
      question: '¿Cuál es la forma correcta del subjuntivo pluscuamperfecto para "yo hablar"?',
      options: ['hubiera hablado', 'habría hablado', 'haya hablado', 'hubiese hablado'],
      correctAnswer: 'hubiera hablado',
      explanation: 'El subjuntivo pluscuamperfecto se forma con "hubiera" + participio pasado.',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-2',
      level: 'C2',
      question: '¿Cómo se forma el condicional compuesto en subjuntivo?',
      options: ['hubiera + participio', 'habría + participio', 'haya + participio', 'hubiese + participio'],
      correctAnswer: 'hubiera + participio',
      explanation: 'El condicional compuesto en subjuntivo se forma con "hubiera" + participio pasado.',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-3',
      level: 'C2',
      question: '¿Qué tiempo verbal se usa para expresar acciones hipotéticas en el pasado?',
      options: ['pretérito perfecto', 'condicional compuesto', 'subjuntivo pluscuamperfecto', 'futuro perfecto'],
      correctAnswer: 'subjuntivo pluscuamperfecto',
      explanation: 'El subjuntivo pluscuamperfecto se usa para acciones hipotéticas en el pasado.',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-4',
      level: 'C2',
      question: '¿Cómo se forma la perífrasis "llevar + gerundio"?',
      options: ['llevar + gerundio', 'llevar + infinitivo', 'llevar + participio', 'llevar + subjuntivo'],
      correctAnswer: 'llevar + gerundio',
      explanation: 'La perífrasis "llevar + gerundio" indica duración (Llevo estudiando dos horas).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-5',
      level: 'C2',
      question: '¿Qué conjunción introduce una cláusula de finalidad en subjuntivo?',
      options: ['a fin de que', 'porque', 'si', 'cuando'],
      correctAnswer: 'a fin de que',
      explanation: '"A fin de que" introduce una cláusula de finalidad y requiere subjuntivo.',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-6',
      level: 'C2',
      question: '¿Cuál es la forma correcta del verbo "ser" en subjuntivo pluscuamperfecto para "yo"?',
      options: ['hubiera sido', 'habría sido', 'haya sido', 'fuera'],
      correctAnswer: 'hubiera sido',
      explanation: 'La primera persona del singular del subjuntivo pluscuamperfecto de "ser" es "hubiera sido".',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-7',
      level: 'C2',
      question: '¿Cómo se forma la voz pasiva con verbos de percepción?',
      options: ['se + verbo + infinitivo', 'ser + participio', 'estar + participio', 'haber + participio'],
      correctAnswer: 'se + verbo + infinitivo',
      explanation: 'Con verbos de percepción se usa "se + verbo + infinitivo" (Se ve venir).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-8',
      level: 'C2',
      question: '¿Qué tiempo verbal se usa después de "con tal de que"?',
      options: ['subjuntivo presente', 'subjuntivo imperfecto', 'indicativo', 'condicional'],
      correctAnswer: 'subjuntivo presente',
      explanation: 'Después de "con tal de que" se usa el subjuntivo presente (Con tal de que estudies).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-9',
      level: 'C2',
      question: '¿Cómo se forma el gerundio de verbos irregulares como "caer"?',
      options: ['cayendo', 'caendo', 'cayendo', 'caendo'],
      correctAnswer: 'cayendo',
      explanation: 'El gerundio de "caer" es "cayendo" (irregular).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-10',
      level: 'C2',
      question: '¿Qué preposición se usa con "prescindir"?',
      options: ['de', 'en', 'con', 'por'],
      correctAnswer: 'de',
      explanation: 'El verbo "prescindir" se construye con la preposición "de" (Prescindo de tu ayuda).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-11',
      level: 'C2',
      question: '¿Cuál es la forma correcta del verbo "tener" en subjuntivo pluscuamperfecto para "yo"?',
      options: ['hubiera tenido', 'habría tenido', 'haya tenido', 'tuviera'],
      correctAnswer: 'hubiera tenido',
      explanation: 'La primera persona del singular del subjuntivo pluscuamperfecto de "tener" es "hubiera tenido".',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-12',
      level: 'C2',
      question: '¿Cómo se forma el imperativo negativo para "ustedes"?',
      options: ['no + subjuntivo', 'no + infinitivo', 'no + presente', 'no + condicional'],
      correctAnswer: 'no + subjuntivo',
      explanation: 'El imperativo negativo para "ustedes" se forma con "no + subjuntivo" (No hablen ustedes).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-13',
      level: 'C2',
      question: '¿Qué conjunción introduce una cláusula de condición irreal?',
      options: ['si + subjuntivo imperfecto', 'si + condicional', 'aunque', 'porque'],
      correctAnswer: 'si + subjuntivo imperfecto',
      explanation: '"Si + subjuntivo imperfecto" introduce una condición irreal (Si fuera rico).',
      category: 'grammar',
      difficulty: 'hard'
    },
    {
      id: 'C2-G-14',
      level: 'C2',
      question: '¿Cómo se forma el participio de verbos irregulares como "poner"?',
      options: ['puesto', 'ponido', 'poniendo', 'poner'],
      correctAnswer: 'puesto',
      explanation: 'El participio de "poner" es "puesto" (irregular).',
      category: 'grammar',
      difficulty: 'hard'
    }
  ];

  const C2_VOCABULARY = [
    {
      id: 'C2-V-1',
      level: 'C2',
      question: '¿Qué significa "sostenibilidad"?',
      options: ['sustainability', 'maintenance', 'preservation', 'conservation'],
      correctAnswer: 'sustainability',
      explanation: '"Sostenibilidad" significa "sustainability" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-2',
      level: 'C2',
      question: '¿Cómo se dice "entrepreneurship" en español?',
      options: ['emprendimiento', 'empresa', 'negocio', 'comercio'],
      correctAnswer: 'emprendimiento',
      explanation: '"Entrepreneurship" se dice "emprendimiento" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-3',
      level: 'C2',
      question: '¿Qué significa "globalización"?',
      options: ['globalization', 'internationalization', 'worldwide', 'universal'],
      correctAnswer: 'globalization',
      explanation: '"Globalización" significa "globalization" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-4',
      level: 'C2',
      question: '¿Cómo se dice "infrastructure" en español?',
      options: ['infraestructura', 'estructura', 'construcción', 'edificio'],
      correctAnswer: 'infraestructura',
      explanation: '"Infrastructure" se dice "infraestructura" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-5',
      level: 'C2',
      question: '¿Qué significa "biodiversidad"?',
      options: ['biodiversity', 'biology', 'ecology', 'environment'],
      correctAnswer: 'biodiversity',
      explanation: '"Biodiversidad" significa "biodiversity" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-6',
      level: 'C2',
      question: '¿Cómo se dice "democracy" en español?',
      options: ['democracia', 'gobierno', 'política', 'sociedad'],
      correctAnswer: 'democracia',
      explanation: '"Democracy" se dice "democracia" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-7',
      level: 'C2',
      question: '¿Qué significa "transparencia"?',
      options: ['transparency', 'clarity', 'honesty', 'openness'],
      correctAnswer: 'transparency',
      explanation: '"Transparencia" significa "transparency" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-8',
      level: 'C2',
      question: '¿Cómo se dice "accountability" en español?',
      options: ['responsabilidad', 'rendición de cuentas', 'obligación', 'deber'],
      correctAnswer: 'rendición de cuentas',
      explanation: '"Accountability" se dice "rendición de cuentas" en español.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-9',
      level: 'C2',
      question: '¿Qué significa "innovación"?',
      options: ['innovation', 'creation', 'invention', 'development'],
      correctAnswer: 'innovation',
      explanation: '"Innovación" significa "innovation" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-10',
      level: 'C2',
      question: '¿Cómo se dice "sustainability" en español?',
      options: ['sostenibilidad', 'sustentabilidad', 'durabilidad', 'all of the above'],
      correctAnswer: 'all of the above',
      explanation: '"Sustainability" se puede traducir como "sostenibilidad", "sustentabilidad" o "durabilidad".',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-11',
      level: 'C2',
      question: '¿Qué significa "gobernanza"?',
      options: ['governance', 'government', 'management', 'administration'],
      correctAnswer: 'governance',
      explanation: '"Gobernanza" significa "governance" en inglés.',
      category: 'vocabulary',
      difficulty: 'hard'
    },
    {
      id: 'C2-V-12',
      level: 'C2',
      question: '¿Cómo se dice "stakeholder" en español?',
      options: ['parte interesada', 'interesado', 'participante', 'all of the above'],
      correctAnswer: 'all of the above',
      explanation: '"Stakeholder" se puede traducir como "parte interesada", "interesado" o "participante".',
      category: 'vocabulary',
      difficulty: 'hard'
    }
  ];

  // Add all questions to the array
  questions.push(...B2_GRAMMAR, ...B2_VOCABULARY, ...C1_GRAMMAR, ...C1_VOCABULARY, ...C2_GRAMMAR, ...C2_VOCABULARY);

  return questions;
}

// Read existing questions and replace B2, C1, C2 levels
const existingQuestionsPath = path.join(__dirname, '..', 'lib', 'data', 'spanish-proficiency-questions.ts');
const existingContent = fs.readFileSync(existingQuestionsPath, 'utf8');

// Extract A1, A2, B1 questions from existing file
const a1Questions = existingContent.match(/\{[^}]*"id":\s*"A1-[^}]*\}/g) || [];
const a2Questions = existingContent.match(/\{[^}]*"id":\s*"A2-[^}]*\}/g) || [];
const b1Questions = existingContent.match(/\{[^}]*"id":\s*"B1-[^}]*\}/g) || [];

// Parse existing questions
const parseQuestions = (matches: string[]) => {
  return matches.map(match => {
    try {
      return JSON.parse(match);
    } catch {
      return null;
    }
  }).filter(q => q !== null);
};

const existingA1 = parseQuestions(a1Questions);
const existingA2 = parseQuestions(a2Questions);
const existingB1 = parseQuestions(b1Questions);

// Generate new B2, C1, C2 questions
const newQuestions = generateCompleteSpanishQuestions();

// Combine all questions
const allQuestions = [...existingA1, ...existingA2, ...existingB1, ...newQuestions];

// Generate file content
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

// Write the complete file
fs.writeFileSync(existingQuestionsPath, fileContent, 'utf8');

console.log(`✅ Generated complete Spanish proficiency test with ${allQuestions.length} questions`);
console.log(`📁 File updated: ${existingQuestionsPath}`);

// Log question distribution
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
