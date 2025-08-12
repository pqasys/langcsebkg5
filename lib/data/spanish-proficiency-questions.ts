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
  // Additional B1 Grammar Questions
  {
    "id": "B1-G-16",
    "level": "B1",
    "question": "Cuando era niño, ___ al parque todos los domingos.",
    "options": [
      "fui",
      "iré",
      "he ido",
      "iba"
    ],
    "correctAnswer": "iba",
    "explanation": "Se usa el imperfecto 'iba' para expresar una acción habitual en el pasado.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-17",
    "level": "B1",
    "question": "Este regalo es ___ ti.",
    "options": [
      "por",
      "para",
      "hacia",
      "a"
    ],
    "correctAnswer": "para",
    "explanation": "Se usa 'para' para indicar destinatario o finalidad.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-18",
    "level": "B1",
    "question": "Es importante que ustedes ___ temprano.",
    "options": [
      "llegan",
      "llegarán",
      "lleguen",
      "llegando"
    ],
    "correctAnswer": "lleguen",
    "explanation": "Se usa el subjuntivo 'lleguen' después de 'es importante que'.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-19",
    "level": "B1",
    "question": "Voy a ___ mañana.",
    "options": [
      "te llamo",
      "llamarte",
      "llamándote",
      "llamar te"
    ],
    "correctAnswer": "llamarte",
    "explanation": "Se usa el infinitivo 'llamarte' después de 'voy a'.",
    "category": "grammar",
    "difficulty": "medium"
  },
  {
    "id": "B1-G-20",
    "level": "B1",
    "question": "En España ___ tarde.",
    "options": [
      "cenan",
      "se cena",
      "se cenan",
      "se cene"
    ],
    "correctAnswer": "se cena",
    "explanation": "Se usa la forma impersonal 'se cena' para expresar costumbre general.",
    "category": "grammar",
    "difficulty": "medium"
  },
  // Additional B1 Vocabulary Questions
  {
    "id": "B1-V-16",
    "level": "B1",
    "question": "¿Cuál es un sinónimo de 'empleo'?",
    "options": [
      "viaje",
      "noticia",
      "trabajo",
      "cuenta"
    ],
    "correctAnswer": "trabajo",
    "explanation": "'Trabajo' es sinónimo de 'empleo'.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-17",
    "level": "B1",
    "question": "¿Qué expresión es correcta para preparar un viaje?",
    "options": [
      "Tomar la maleta",
      "Poner la maleta",
      "Coger la maleta",
      "Hacer la maleta"
    ],
    "correctAnswer": "Hacer la maleta",
    "explanation": "'Hacer la maleta' es la expresión correcta para preparar equipaje.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-18",
    "level": "B1",
    "question": "Me duele la ___.",
    "options": [
      "coche",
      "mesa",
      "mano",
      "cabeza"
    ],
    "correctAnswer": "cabeza",
    "explanation": "Se dice 'me duele la cabeza' para expresar dolor de cabeza.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-19",
    "level": "B1",
    "question": "___, llegamos tarde por el tráfico.",
    "options": [
      "Aunque",
      "Por eso",
      "Además",
      "Sin embargo"
    ],
    "correctAnswer": "Por eso",
    "explanation": "'Por eso' indica consecuencia: llegamos tarde como resultado del tráfico.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  {
    "id": "B1-V-20",
    "level": "B1",
    "question": "¿Qué significa 'actualmente'?",
    "options": [
      "en la actualidad",
      "en realidad",
      "de hecho",
      "exactamente"
    ],
    "correctAnswer": "en la actualidad",
    "explanation": "'Actualmente' significa 'en la actualidad' o 'en el presente'.",
    "category": "vocabulary",
    "difficulty": "medium"
  },
  // Additional B2 Grammar Questions
  {
    "id": "B2-G-16",
    "level": "B2",
    "question": "Busco a alguien que ___ francés.",
    "options": [
      "habla",
      "habló",
      "hablará",
      "hable"
    ],
    "correctAnswer": "hable",
    "explanation": "Se usa el subjuntivo 'hable' después de 'busco a alguien que'.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-17",
    "level": "B2",
    "question": "Si tuviera más tiempo, ___ más.",
    "options": [
      "viajo",
      "viajaré",
      "viajaría",
      "haya viajado"
    ],
    "correctAnswer": "viajaría",
    "explanation": "Se usa el condicional 'viajaría' en la apódosis de una oración condicional irreal.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-18",
    "level": "B2",
    "question": "La novela ___ por García Márquez.",
    "options": [
      "fue escrita",
      "fue escribir",
      "era escrita",
      "ha escrito"
    ],
    "correctAnswer": "fue escrita",
    "explanation": "Se usa la voz pasiva 'fue escrita' para indicar que García Márquez escribió la novela.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-19",
    "level": "B2",
    "question": "La ciudad en ___ nací es pequeña.",
    "options": [
      "qué",
      "cual",
      "que",
      "donde"
    ],
    "correctAnswer": "donde",
    "explanation": "Se usa 'donde' para referirse al lugar donde ocurrió algo.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "B2-G-20",
    "level": "B2",
    "question": "A María le gustaron las flores que le ___.",
    "options": [
      "envié",
      "enviaron",
      "enviaba",
      "envío"
    ],
    "correctAnswer": "envié",
    "explanation": "Se usa el pretérito 'envié' para indicar una acción completada en el pasado.",
    "category": "grammar",
    "difficulty": "hard"
  },
  // Additional B2 Vocabulary Questions
  {
    "id": "B2-V-16",
    "level": "B2",
    "question": "¿Qué conector expresa contraste en registro formal?",
    "options": [
      "por consiguiente",
      "por lo tanto",
      "asimismo",
      "no obstante"
    ],
    "correctAnswer": "no obstante",
    "explanation": "'No obstante' es un conector formal que expresa contraste o oposición.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-17",
    "level": "B2",
    "question": "'Abarcar' se acerca más a:",
    "options": [
      "incluir",
      "evitar",
      "revelar",
      "descartar"
    ],
    "correctAnswer": "incluir",
    "explanation": "'Abarcar' significa 'incluir' o 'comprender' algo en su totalidad.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-18",
    "level": "B2",
    "question": "¿Qué colocación es correcta?",
    "options": [
      "levantar un problema",
      "plantear un problema",
      "sembrar un problema",
      "cosechar un problema"
    ],
    "correctAnswer": "plantear un problema",
    "explanation": "'Plantear un problema' es la colocación correcta para presentar o exponer un problema.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-19",
    "level": "B2",
    "question": "¿Cuál es más formal que 'pedir'?",
    "options": [
      "rogar",
      "exigir",
      "solicitar",
      "preguntar"
    ],
    "correctAnswer": "solicitar",
    "explanation": "'Solicitar' es más formal que 'pedir' y se usa en contextos oficiales.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "B2-V-20",
    "level": "B2",
    "question": "¿Qué expresión significa iniciar un proyecto?",
    "options": [
      "dar en el clavo",
      "echar de menos",
      "andar con ojo",
      "poner en marcha"
    ],
    "correctAnswer": "poner en marcha",
    "explanation": "'Poner en marcha' significa 'iniciar' o 'comenzar' un proyecto.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  // Additional C1 Grammar Questions
  {
    "id": "C1-G-16",
    "level": "C1",
    "question": "Aunque ___ caro, lo compraré.",
    "options": [
      "es",
      "será",
      "sea",
      "haya sido"
    ],
    "correctAnswer": "sea",
    "explanation": "Se usa el subjuntivo 'sea' después de 'aunque' para expresar concesión.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-17",
    "level": "C1",
    "question": "Se me ___ las llaves.",
    "options": [
      "perdí",
      "fueron perdidas",
      "perdieron",
      "perdieronse"
    ],
    "correctAnswer": "perdieron",
    "explanation": "Se usa 'se me perdieron' para expresar pérdida accidental con 'se' impersonal.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-18",
    "level": "C1",
    "question": "Lo ___ difícil fue empezar.",
    "options": [
      "más",
      "muy",
      "tan",
      "tanto"
    ],
    "correctAnswer": "más",
    "explanation": "Se usa 'más' para formar el superlativo: 'lo más difícil'.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-19",
    "level": "C1",
    "question": "Llevo dos años ___ español.",
    "options": [
      "estudiar",
      "estudiado",
      "estudiando",
      "a estudiar"
    ],
    "correctAnswer": "estudiando",
    "explanation": "Se usa el gerundio 'estudiando' después de 'llevar + tiempo'.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C1-G-20",
    "level": "C1",
    "question": "No hay nadie que ___ de acuerdo.",
    "options": [
      "está",
      "estaría",
      "estuviera",
      "esté"
    ],
    "correctAnswer": "esté",
    "explanation": "Se usa el subjuntivo 'esté' después de 'no hay nadie que'.",
    "category": "grammar",
    "difficulty": "hard"
  },
  // Additional C1 Vocabulary Questions
  {
    "id": "C1-V-16",
    "level": "C1",
    "question": "'Por ende' equivale a:",
    "options": [
      "sin embargo",
      "a pesar de",
      "en cambio",
      "por lo tanto"
    ],
    "correctAnswer": "por lo tanto",
    "explanation": "'Por ende' es un conector formal que significa 'por lo tanto' o 'en consecuencia'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-17",
    "level": "C1",
    "question": "¿Qué expresión es correcta?",
    "options": [
      "montar una conversación",
      "armar una conversación",
      "entablar una conversación",
      "fabricar una conversación"
    ],
    "correctAnswer": "entablar una conversación",
    "explanation": "'Entablar una conversación' es la expresión correcta para iniciar una conversación.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-18",
    "level": "C1",
    "question": "'A grandes rasgos' significa:",
    "options": [
      "con detalle",
      "sin razón",
      "de manera general",
      "a regañadientes"
    ],
    "correctAnswer": "de manera general",
    "explanation": "'A grandes rasgos' significa 'de manera general' o 'sin entrar en detalles'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-19",
    "level": "C1",
    "question": "¿Cuál es el término más preciso para 'malo para la salud'?",
    "options": [
      "fastidioso",
      "molesto",
      "leve",
      "perjudicial"
    ],
    "correctAnswer": "perjudicial",
    "explanation": "'Perjudicial' es el término más preciso para expresar que algo es malo para la salud.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C1-V-20",
    "level": "C1",
    "question": "'Dar por sentado' significa:",
    "options": [
      "explicar con detalle",
      "negar rotundamente",
      "celebrar un logro",
      "suponer como cierto"
    ],
    "correctAnswer": "suponer como cierto",
    "explanation": "'Dar por sentado' significa 'suponer como cierto' o 'dar por hecho'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  // Additional C2 Grammar Questions
  {
    "id": "C2-G-16",
    "level": "C2",
    "question": "Si lo hubiera sabido, no ___.",
    "options": [
      "iría",
      "fui",
      "habría ido",
      "hubiera ido"
    ],
    "correctAnswer": "habría ido",
    "explanation": "Se usa el condicional compuesto 'habría ido' en la apódosis de una oración condicional irreal del pasado.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-17",
    "level": "C2",
    "question": "Ojalá ___ más tiempo.",
    "options": [
      "tenga",
      "tuviera",
      "tendría",
      "hubo tenido"
    ],
    "correctAnswer": "tuviera",
    "explanation": "Se usa el imperfecto de subjuntivo 'tuviera' después de 'ojalá' para expresar deseo.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-18",
    "level": "C2",
    "question": "Por mucho que ___, no cambiará de opinión.",
    "options": [
      "insistes",
      "insististe",
      "insistieras",
      "insistas"
    ],
    "correctAnswer": "insistas",
    "explanation": "Se usa el presente de subjuntivo 'insistas' después de 'por mucho que'.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-19",
    "level": "C2",
    "question": "La autora, cuyos libros ___ premiados, asistirá al acto.",
    "options": [
      "han sido",
      "son sido",
      "fueron sido",
      "han estado"
    ],
    "correctAnswer": "han sido",
    "explanation": "Se usa 'han sido' para expresar una acción pasada con relevancia en el presente.",
    "category": "grammar",
    "difficulty": "hard"
  },
  {
    "id": "C2-G-20",
    "level": "C2",
    "question": "'Viene a costar cien euros' expresa:",
    "options": [
      "exactitud",
      "obligación",
      "aproximación",
      "sorpresa"
    ],
    "correctAnswer": "aproximación",
    "explanation": "'Viene a costar' expresa aproximación o estimación de un precio.",
    "category": "grammar",
    "difficulty": "hard"
  },
  // Additional C2 Vocabulary Questions
  {
    "id": "C2-V-18",
    "level": "C2",
    "question": "¿Qué expresión equivale a 'sin perjuicio de'?",
    "options": [
      "sin embargo",
      "a falta de",
      "por el contrario",
      "sin menoscabo de"
    ],
    "correctAnswer": "sin menoscabo de",
    "explanation": "'Sin menoscabo de' es equivalente formal a 'sin perjuicio de'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-19",
    "level": "C2",
    "question": "'Proclive a' significa:",
    "options": [
      "inclinado a",
      "contrario a",
      "reacio a",
      "ajeno a"
    ],
    "correctAnswer": "inclinado a",
    "explanation": "'Proclive a' significa 'inclinado a' o 'tendente a' algo.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-20",
    "level": "C2",
    "question": "'Cuando menos' significa:",
    "options": [
      "a duras penas",
      "como mínimo",
      "por lo visto",
      "sin remedio"
    ],
    "correctAnswer": "como mínimo",
    "explanation": "'Cuando menos' significa 'como mínimo' o 'al menos'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-21",
    "level": "C2",
    "question": "¿Qué frase mantiene el registro y significado de 'El contrato quedará sin efecto'?",
    "options": [
      "El contrato se deshace",
      "El contrato se borra",
      "El contrato se cae",
      "El contrato se anulará"
    ],
    "correctAnswer": "El contrato se anulará",
    "explanation": "'El contrato se anulará' mantiene el registro formal y el significado de 'quedará sin efecto'.",
    "category": "vocabulary",
    "difficulty": "hard"
  },
  {
    "id": "C2-V-22",
    "level": "C2",
    "question": "¿Cuál es la combinación más precisa?",
    "options": [
      "reparar de daños",
      "compensar en daños",
      "subsanar a los daños",
      "resarcir los daños"
    ],
    "correctAnswer": "resarcir los daños",
    "explanation": "'Resarcir los daños' es la combinación más precisa y formal para compensar daños.",
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
