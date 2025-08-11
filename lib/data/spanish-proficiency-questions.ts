export interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export const SPANISH_PROFICIENCY_QUESTIONS: TestQuestion[] = [
  {
    "id": "A1-G-1",
    "level": "A1",
    "question": "¿Cuál es la forma correcta del verbo 'ser' en la frase: Yo ___ estudiante?",
    "options": [
      "es",
      "eres",
      "soy",
      "somos"
    ],
    "correctAnswer": "soy",
    "explanation": "El verbo 'ser' se conjuga como 'soy' en primera persona singular.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-2",
    "level": "A1",
    "question": "Selecciona el artículo definido para 'libro'.",
    "options": [
      "la",
      "el",
      "los",
      "las"
    ],
    "correctAnswer": "el",
    "explanation": "'Libro' es masculino singular, por lo que usa el artículo 'el'.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-3",
    "level": "A1",
    "question": "¿Cómo se conjuga 'hablar' con 'tú' en presente?",
    "options": [
      "hablas",
      "hablo",
      "habla",
      "hablamos"
    ],
    "correctAnswer": "hablas",
    "explanation": "El verbo 'hablar' se conjuga como 'hablas' en segunda persona singular.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-4",
    "level": "A1",
    "question": "Completa: Nosotros ___ amigos.",
    "options": [
      "soy",
      "es",
      "somos",
      "son"
    ],
    "correctAnswer": "somos",
    "explanation": "El verbo 'ser' se conjuga como 'somos' en primera persona plural.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-G-5",
    "level": "A1",
    "question": "¿Qué pronombre corresponde a 'María y yo'?",
    "options": [
      "ellos",
      "nosotros",
      "tú",
      "usted"
    ],
    "correctAnswer": "nosotros",
    "explanation": "'María y yo' se refiere a primera persona plural, por lo que es 'nosotros'.",
    "category": "grammar",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-1",
    "level": "A1",
    "question": "¿Qué palabra significa 'dog'?",
    "options": [
      "gato",
      "casa",
      "perro",
      "mesa"
    ],
    "correctAnswer": "perro",
    "explanation": "'Perro' es la traducción de 'dog' en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-2",
    "level": "A1",
    "question": "¿Cuál es un color?",
    "options": [
      "silla",
      "azul",
      "mano",
      "calle"
    ],
    "correctAnswer": "azul",
    "explanation": "'Azul' es un color en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-3",
    "level": "A1",
    "question": "¿Cuál es el antónimo de 'grande'?",
    "options": [
      "alto",
      "bajo",
      "pequeño",
      "largo"
    ],
    "correctAnswer": "pequeño",
    "explanation": "'Pequeño' es el antónimo de 'grande'.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-4",
    "level": "A1",
    "question": "¿Qué día sigue después del lunes?",
    "options": [
      "martes",
      "jueves",
      "domingo",
      "viernes"
    ],
    "correctAnswer": "martes",
    "explanation": "El martes sigue después del lunes en la semana.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A1-V-5",
    "level": "A1",
    "question": "¿Cuál de estas palabras es una bebida?",
    "options": [
      "leche",
      "zapato",
      "coche",
      "papel"
    ],
    "correctAnswer": "leche",
    "explanation": "'Leche' es una bebida en español.",
    "category": "vocabulary",
    "difficulty": "easy"
  },
  {
    "id": "A2-G-1",
    "level": "A2",
    "question": "¿Cuál es la forma correcta: 'Ellos ___ al cine ayer'?",
    "options": [
      "fueron",
      "van",
      "irán",
      "iban"
    ],
    "correctAnswer": "fueron",
    "explanation": "Se usa el pretérito indefinido 'fueron' para acciones completadas en el pasado.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-2",
    "level": "A2",
    "question": "Completa: ¿___ tú venir con nosotros?",
    "options": [
      "Quieres",
      "Quiero",
      "Quiere",
      "Quieren"
    ],
    "correctAnswer": "Quieres",
    "explanation": "Se usa 'quieres' para preguntar a la segunda persona singular.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-3",
    "level": "A2",
    "question": "¿Cómo se dice 'We are going to eat' en español?",
    "options": [
      "Vamos a comer",
      "Iremos a comer",
      "Comemos ahora",
      "Estamos comiendo"
    ],
    "correctAnswer": "Vamos a comer",
    "explanation": "'Vamos a comer' es la forma correcta de expresar futuro próximo.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-4",
    "level": "A2",
    "question": "Selecciona la preposición correcta: Estoy ___ la casa.",
    "options": [
      "en",
      "con",
      "de",
      "por"
    ],
    "correctAnswer": "en",
    "explanation": "Se usa 'en' para indicar ubicación dentro de un lugar.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-G-5",
    "level": "A2",
    "question": "¿Cuál es el pretérito de 'comer' con 'él'?",
    "options": [
      "comía",
      "comerá",
      "comió",
      "come"
    ],
    "correctAnswer": "comió",
    "explanation": "El pretérito indefinido de 'comer' en tercera persona singular es 'comió'.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-1",
    "level": "A2",
    "question": "¿Cuál palabra se relaciona con la escuela?",
    "options": [
      "cuaderno",
      "sartén",
      "sofá",
      "leche"
    ],
    "correctAnswer": "cuaderno",
    "explanation": "'Cuaderno' es un objeto relacionado con la escuela.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-2",
    "level": "A2",
    "question": "¿Qué palabra es un verbo?",
    "options": [
      "escribir",
      "mesa",
      "azul",
      "puerta"
    ],
    "correctAnswer": "escribir",
    "explanation": "'Escribir' es un verbo en infinitivo.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-3",
    "level": "A2",
    "question": "¿Qué objeto se usa para escribir?",
    "options": [
      "lápiz",
      "silla",
      "pan",
      "mesa"
    ],
    "correctAnswer": "lápiz",
    "explanation": "'Lápiz' es el objeto que se usa para escribir.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-4",
    "level": "A2",
    "question": "¿Cuál palabra es una prenda de vestir?",
    "options": [
      "camisa",
      "libro",
      "agua",
      "papel"
    ],
    "correctAnswer": "camisa",
    "explanation": "'Camisa' es una prenda de vestir.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "A2-V-5",
    "level": "A2",
    "question": "¿Qué palabra es un sinónimo de 'contento'?",
    "options": [
      "feliz",
      "triste",
      "cansado",
      "preocupado"
    ],
    "correctAnswer": "feliz",
    "explanation": "'Feliz' es un sinónimo de 'contento'.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-1",
    "level": "B1",
    "question": "Pregunta B1 Gramática 1: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-2",
    "level": "B1",
    "question": "Pregunta B1 Gramática 2: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-3",
    "level": "B1",
    "question": "Pregunta B1 Gramática 3: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-4",
    "level": "B1",
    "question": "Pregunta B1 Gramática 4: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-5",
    "level": "B1",
    "question": "Pregunta B1 Gramática 5: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-6",
    "level": "B1",
    "question": "Pregunta B1 Gramática 6: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-7",
    "level": "B1",
    "question": "Pregunta B1 Gramática 7: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-8",
    "level": "B1",
    "question": "Pregunta B1 Gramática 8: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-9",
    "level": "B1",
    "question": "Pregunta B1 Gramática 9: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-10",
    "level": "B1",
    "question": "Pregunta B1 Gramática 10: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-11",
    "level": "B1",
    "question": "Pregunta B1 Gramática 11: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-12",
    "level": "B1",
    "question": "Pregunta B1 Gramática 12: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-13",
    "level": "B1",
    "question": "Pregunta B1 Gramática 13: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-14",
    "level": "B1",
    "question": "Pregunta B1 Gramática 14: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-15",
    "level": "B1",
    "question": "Pregunta B1 Gramática 15: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-16",
    "level": "B1",
    "question": "Pregunta B1 Gramática 16: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-17",
    "level": "B1",
    "question": "Pregunta B1 Gramática 17: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-18",
    "level": "B1",
    "question": "Pregunta B1 Gramática 18: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Gramática.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-1",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 1: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-2",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 2: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-3",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 3: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-4",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 4: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-5",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 5: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-6",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 6: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-7",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 7: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-8",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 8: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-9",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 9: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-10",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 10: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-11",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 11: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-12",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 12: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-13",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 13: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-14",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 14: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-15",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 15: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-16",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 16: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-17",
    "level": "B1",
    "question": "Pregunta B1 Vocabulario 17: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B2-G-1",
    "level": "B2",
    "question": "Pregunta B2 Gramática 1: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-2",
    "level": "B2",
    "question": "Pregunta B2 Gramática 2: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-3",
    "level": "B2",
    "question": "Pregunta B2 Gramática 3: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-4",
    "level": "B2",
    "question": "Pregunta B2 Gramática 4: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-5",
    "level": "B2",
    "question": "Pregunta B2 Gramática 5: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-6",
    "level": "B2",
    "question": "Pregunta B2 Gramática 6: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-7",
    "level": "B2",
    "question": "Pregunta B2 Gramática 7: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-8",
    "level": "B2",
    "question": "Pregunta B2 Gramática 8: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-9",
    "level": "B2",
    "question": "Pregunta B2 Gramática 9: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-10",
    "level": "B2",
    "question": "Pregunta B2 Gramática 10: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-11",
    "level": "B2",
    "question": "Pregunta B2 Gramática 11: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-12",
    "level": "B2",
    "question": "Pregunta B2 Gramática 12: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-13",
    "level": "B2",
    "question": "Pregunta B2 Gramática 13: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-14",
    "level": "B2",
    "question": "Pregunta B2 Gramática 14: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-15",
    "level": "B2",
    "question": "Pregunta B2 Gramática 15: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-16",
    "level": "B2",
    "question": "Pregunta B2 Gramática 16: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-17",
    "level": "B2",
    "question": "Pregunta B2 Gramática 17: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-18",
    "level": "B2",
    "question": "Pregunta B2 Gramática 18: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-1",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 1: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-2",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 2: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-3",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 3: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-4",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 4: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-5",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 5: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-6",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 6: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-7",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 7: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-8",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 8: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-9",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 9: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-10",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 10: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-11",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 11: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-12",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 12: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-13",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 13: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-14",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 14: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-15",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 15: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-16",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 16: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-17",
    "level": "B2",
    "question": "Pregunta B2 Vocabulario 17: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta B2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-1",
    "level": "C1",
    "question": "Pregunta C1 Gramática 1: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-2",
    "level": "C1",
    "question": "Pregunta C1 Gramática 2: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-3",
    "level": "C1",
    "question": "Pregunta C1 Gramática 3: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-4",
    "level": "C1",
    "question": "Pregunta C1 Gramática 4: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-5",
    "level": "C1",
    "question": "Pregunta C1 Gramática 5: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-6",
    "level": "C1",
    "question": "Pregunta C1 Gramática 6: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-7",
    "level": "C1",
    "question": "Pregunta C1 Gramática 7: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-8",
    "level": "C1",
    "question": "Pregunta C1 Gramática 8: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-9",
    "level": "C1",
    "question": "Pregunta C1 Gramática 9: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-10",
    "level": "C1",
    "question": "Pregunta C1 Gramática 10: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-11",
    "level": "C1",
    "question": "Pregunta C1 Gramática 11: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-12",
    "level": "C1",
    "question": "Pregunta C1 Gramática 12: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-13",
    "level": "C1",
    "question": "Pregunta C1 Gramática 13: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-14",
    "level": "C1",
    "question": "Pregunta C1 Gramática 14: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-15",
    "level": "C1",
    "question": "Pregunta C1 Gramática 15: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-16",
    "level": "C1",
    "question": "Pregunta C1 Gramática 16: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-17",
    "level": "C1",
    "question": "Pregunta C1 Gramática 17: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-18",
    "level": "C1",
    "question": "Pregunta C1 Gramática 18: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-1",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 1: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-2",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 2: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-3",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 3: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-4",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 4: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-5",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 5: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-6",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 6: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-7",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 7: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-8",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 8: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-9",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 9: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-10",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 10: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-11",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 11: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-12",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 12: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-13",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 13: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-14",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 14: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-15",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 15: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-16",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 16: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-17",
    "level": "C1",
    "question": "Pregunta C1 Vocabulario 17: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C1 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-1",
    "level": "C2",
    "question": "Pregunta C2 Gramática 1: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-2",
    "level": "C2",
    "question": "Pregunta C2 Gramática 2: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-3",
    "level": "C2",
    "question": "Pregunta C2 Gramática 3: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-4",
    "level": "C2",
    "question": "Pregunta C2 Gramática 4: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-5",
    "level": "C2",
    "question": "Pregunta C2 Gramática 5: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-6",
    "level": "C2",
    "question": "Pregunta C2 Gramática 6: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-7",
    "level": "C2",
    "question": "Pregunta C2 Gramática 7: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-8",
    "level": "C2",
    "question": "Pregunta C2 Gramática 8: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-9",
    "level": "C2",
    "question": "Pregunta C2 Gramática 9: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-10",
    "level": "C2",
    "question": "Pregunta C2 Gramática 10: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-11",
    "level": "C2",
    "question": "Pregunta C2 Gramática 11: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-12",
    "level": "C2",
    "question": "Pregunta C2 Gramática 12: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-13",
    "level": "C2",
    "question": "Pregunta C2 Gramática 13: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-14",
    "level": "C2",
    "question": "Pregunta C2 Gramática 14: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-15",
    "level": "C2",
    "question": "Pregunta C2 Gramática 15: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-16",
    "level": "C2",
    "question": "Pregunta C2 Gramática 16: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-17",
    "level": "C2",
    "question": "Pregunta C2 Gramática 17: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-18",
    "level": "C2",
    "question": "Pregunta C2 Gramática 18: ¿Cuál es la forma correcta?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Gramática.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-1",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 1: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-2",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 2: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-3",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 3: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-4",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 4: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-5",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 5: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-6",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 6: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-7",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 7: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-8",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 8: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-9",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 9: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-10",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 10: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-11",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 11: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-12",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 12: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-13",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 13: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-14",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 14: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-15",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 15: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-16",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 16: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-17",
    "level": "C2",
    "question": "Pregunta C2 Vocabulario 17: ¿Qué significa?",
    "options": [
      "Opción A",
      "Opción B",
      "Opción C",
      "Opción D"
    ],
    "correctAnswer": "Opción A",
    "explanation": "Explicación para pregunta C2 Vocabulario.",
    "category": "vocabulary",
    "difficulty": "hard"
  }
];

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
