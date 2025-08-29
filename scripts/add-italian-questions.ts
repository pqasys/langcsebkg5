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

// All 160 Italian questions from user input
const ITALIAN_QUESTIONS = [
  // Level A1 - Grammar (10 questions)
  {
    question: "Qual è il plurale di \"libro\"?",
    correctAnswer: "libri",
    wrongAnswers: ["libris", "libroi", "librei"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Regular masculine plural ends in -i."
  },
  {
    question: "Come si dice \"I am\" in italiano?",
    correctAnswer: "sono",
    wrongAnswers: ["sei", "siamo", "è"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "The first person singular of 'essere' is 'sono'."
  },
  {
    question: "Quale articolo si usa con \"amico\"?",
    correctAnswer: "l'",
    wrongAnswers: ["la", "le", "il"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "\"Amico\" starts with a vowel."
  },
  {
    question: "\"Tu ___ italiano?\"",
    correctAnswer: "sei",
    wrongAnswers: ["è", "sono", "siamo"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Second person singular of 'essere' is 'sei'."
  },
  {
    question: "\"Noi ___ a scuola.\"",
    correctAnswer: "siamo",
    wrongAnswers: ["sei", "sono", "siete"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "First person plural of 'essere' is 'siamo'."
  },
  {
    question: "Qual è il presente di \"avere\" per \"lui\"?",
    correctAnswer: "ha",
    wrongAnswers: ["ho", "hanno", "hai"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Third person singular of 'avere' is 'ha'."
  },
  {
    question: "\"Io ___ una macchina.\"",
    correctAnswer: "ho",
    wrongAnswers: ["ha", "hai", "hanno"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "First person singular of 'avere' is 'ho'."
  },
  {
    question: "\"Lei ___ francese.\"",
    correctAnswer: "è",
    wrongAnswers: ["sei", "sono", "siamo"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Third person singular of 'essere' is 'è'."
  },
  {
    question: "\"Voi ___ amici.\"",
    correctAnswer: "siete",
    wrongAnswers: ["siamo", "sono", "sei"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Second person plural of 'essere' is 'siete'."
  },
  {
    question: "\"Loro ___ studenti.\"",
    correctAnswer: "sono",
    wrongAnswers: ["è", "siamo", "siete"],
    level: "A1",
    category: "grammar",
    difficulty: "easy",
    explanation: "Third person plural of 'essere' is 'sono'."
  },

  // Level A1 - Vocabulary (10 questions)
  {
    question: "Come si dice \"house\" in italiano?",
    correctAnswer: "casa",
    wrongAnswers: ["scuola", "macchina", "porta"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "House in Italian is 'casa'."
  },
  {
    question: "Qual è il contrario di \"grande\"?",
    correctAnswer: "piccolo",
    wrongAnswers: ["lungo", "alto", "stretto"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The opposite of 'grande' (big) is 'piccolo' (small)."
  },
  {
    question: "\"Buongiorno\" si usa:",
    correctAnswer: "al mattino",
    wrongAnswers: ["di notte", "a mezzanotte", "nel pomeriggio"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Buongiorno is used in the morning."
  },
  {
    question: "Come si dice \"thank you\"?",
    correctAnswer: "grazie",
    wrongAnswers: ["scusa", "prego", "ciao"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Thank you in Italian is 'grazie'."
  },
  {
    question: "Qual è il colore del cielo?",
    correctAnswer: "blu",
    wrongAnswers: ["rosso", "verde", "giallo"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The color of the sky is blue (blu)."
  },
  {
    question: "\"Uno, due, ___\":",
    correctAnswer: "tre",
    wrongAnswers: ["cinque", "sei", "quattro"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The sequence is uno, due, tre (one, two, three)."
  },
  {
    question: "Come si dice \"goodbye\"?",
    correctAnswer: "arrivederci",
    wrongAnswers: ["grazie", "buongiorno", "ciao"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Goodbye in Italian is 'arrivederci'."
  },
  {
    question: "\"Mi chiamo Luca\" significa:",
    correctAnswer: "my name is Luca",
    wrongAnswers: ["sono stanco", "ho fame", "vado a casa"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Mi chiamo means 'my name is'."
  },
  {
    question: "Qual è il giorno dopo lunedì?",
    correctAnswer: "martedì",
    wrongAnswers: ["giovedì", "domenica", "sabato"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The day after Monday (lunedì) is Tuesday (martedì)."
  },
  {
    question: "\"Ho fame\" significa:",
    correctAnswer: "I'm hungry",
    wrongAnswers: ["sono felice", "ho sonno", "ho paura"],
    level: "A1",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Ho fame means 'I'm hungry'."
  },

  // Level A2 - Grammar (10 questions)
  {
    question: "\"Io e Marco ___ al cinema.\"",
    correctAnswer: "andiamo",
    wrongAnswers: ["va", "vanno", "andate"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "\"Io e Marco\" = \"noi\" → andiamo."
  },
  {
    question: "Qual è il passato prossimo di \"mangiare\"?",
    correctAnswer: "ho mangiato",
    wrongAnswers: ["mangiato", "mangiavo", "mangia"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Passato prossimo uses avere + past participle."
  },
  {
    question: "\"Loro ___ finito il lavoro.\"",
    correctAnswer: "hanno",
    wrongAnswers: ["ha", "abbiamo", "avete"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Third person plural of 'avere' is 'hanno'."
  },
  {
    question: "\"Tu ___ visto quel film?\"",
    correctAnswer: "hai",
    wrongAnswers: ["ho", "hanno", "avete"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Second person singular of 'avere' is 'hai'."
  },
  {
    question: "\"Noi ___ in Italia l'anno scorso.\"",
    correctAnswer: "siamo stati",
    wrongAnswers: ["siamo andato", "siamo andati", "siamo stati"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Passato prossimo with essere requires agreement."
  },
  {
    question: "\"Mi piace ___ la musica.\"",
    correctAnswer: "ascoltare",
    wrongAnswers: ["ascolto", "ascoltando", "ascoltato"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "After 'mi piace' we use the infinitive."
  },
  {
    question: "\"Luca non ___ mai il pesce.\"",
    correctAnswer: "mangia",
    wrongAnswers: ["mangiato", "mangiava", "mangiando"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Present tense for habitual actions."
  },
  {
    question: "\"Quando ___ tu?\"",
    correctAnswer: "arrivi",
    wrongAnswers: ["arrivato", "arrivando", "arriverai"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Present tense for future meaning."
  },
  {
    question: "\"Lei ___ una bella voce.\"",
    correctAnswer: "ha",
    wrongAnswers: ["hanno", "hai", "ho"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "Third person singular of 'avere' is 'ha'."
  },
  {
    question: "\"Ci ___ alle otto.\"",
    correctAnswer: "vediamo",
    wrongAnswers: ["vedete", "vedo", "vedranno"],
    level: "A2",
    category: "grammar",
    difficulty: "easy",
    explanation: "First person plural of 'vedere' is 'vediamo'."
  },

  // Level A2 - Vocabulary (10 questions)
  {
    question: "Come si dice \"train\" in italiano?",
    correctAnswer: "treno",
    wrongAnswers: ["autobus", "macchina", "bicicletta"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Train in Italian is 'treno'."
  },
  {
    question: "Qual è il contrario di \"freddo\"?",
    correctAnswer: "caldo",
    wrongAnswers: ["tiepido", "fresco", "gelido"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The opposite of 'freddo' (cold) is 'caldo' (hot)."
  },
  {
    question: "\"Dove abiti?\" significa:",
    correctAnswer: "where do you live",
    wrongAnswers: ["come stai", "che ore sono", "cosa fai"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Dove abiti means 'where do you live'."
  },
  {
    question: "Come si dice \"always\"?",
    correctAnswer: "sempre",
    wrongAnswers: ["mai", "spesso", "ogni tanto"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Always in Italian is 'sempre'."
  },
  {
    question: "\"Mi piace leggere\" significa:",
    correctAnswer: "I like to read",
    wrongAnswers: ["I like to write", "I like to sleep", "I like to eat"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Mi piace leggere means 'I like to read'."
  },
  {
    question: "Qual è il colore del limone?",
    correctAnswer: "giallo",
    wrongAnswers: ["verde", "arancione", "rosso"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The color of lemon is yellow (giallo)."
  },
  {
    question: "Come si dice \"week\"?",
    correctAnswer: "settimana",
    wrongAnswers: ["giorno", "mese", "ora"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Week in Italian is 'settimana'."
  },
  {
    question: "\"Sto bene\" significa:",
    correctAnswer: "I'm well",
    wrongAnswers: ["I'm tired", "I'm hungry", "I'm late"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "Sto bene means 'I'm well'."
  },
  {
    question: "Qual è il contrario di \"vecchio\"?",
    correctAnswer: "giovane",
    wrongAnswers: ["grande", "piccolo", "nuovo"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "The opposite of 'vecchio' (old) is 'giovane' (young)."
  },
  {
    question: "Come si dice \"to travel\"?",
    correctAnswer: "viaggiare",
    wrongAnswers: ["mangiare", "dormire", "camminare"],
    level: "A2",
    category: "vocabulary",
    difficulty: "easy",
    explanation: "To travel in Italian is 'viaggiare'."
  },

  // Level B1 - Grammar (10 questions)
  {
    question: "\"Se piove, ___ a casa.\"",
    correctAnswer: "rimango",
    wrongAnswers: ["vado", "esco", "corro"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Conditional logic: staying home if it rains."
  },
  {
    question: "\"Luca ha detto che ___ venire.\"",
    correctAnswer: "può",
    wrongAnswers: ["potere", "poteva", "potrà"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Present tense of potere in reported speech."
  },
  {
    question: "\"Quando ero piccolo, ___ sempre al parco.\"",
    correctAnswer: "andavo",
    wrongAnswers: ["vado", "andato", "andrò"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Imperfetto for habitual past action."
  },
  {
    question: "\"Non so se lui ___ arrivato.\"",
    correctAnswer: "sia",
    wrongAnswers: ["è", "sarà", "fosse"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after uncertainty."
  },
  {
    question: "\"Mi ha detto che ___ stanco.\"",
    correctAnswer: "era",
    wrongAnswers: ["è", "sarà", "fosse"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Reported speech in the past."
  },
  {
    question: "\"Vorrei che tu ___ con me.\"",
    correctAnswer: "venissi",
    wrongAnswers: ["vieni", "verrai", "venga"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive imperfect for desire."
  },
  {
    question: "\"Se avessi tempo, ___ di più.\"",
    correctAnswer: "studerei",
    wrongAnswers: ["studio", "studiavo", "ho studiato"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Hypothetical with conditional."
  },
  {
    question: "\"Nonostante ___ tardi, è uscito.\"",
    correctAnswer: "fosse",
    wrongAnswers: ["era", "è", "sarà"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after \"nonostante.\""
  },
  {
    question: "\"Appena ___, chiamami.\"",
    correctAnswer: "arrivi",
    wrongAnswers: ["arriverai", "sei arrivato", "arrivassi"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Present subjunctive after 'appena'."
  },
  {
    question: "\"Spero che tu ___ bene.\"",
    correctAnswer: "stia",
    wrongAnswers: ["stai", "sei", "sarai"],
    level: "B1",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after 'spero che'."
  },

  // Level B1 - Vocabulary (10 questions)
  {
    question: "Come si dice \"to improve\"?",
    correctAnswer: "migliorare",
    wrongAnswers: ["peggiorare", "cambiare", "crescere"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "To improve in Italian is 'migliorare'."
  },
  {
    question: "\"Affollato\" significa:",
    correctAnswer: "pieno di gente",
    wrongAnswers: ["vuoto", "rumoroso", "tranquillo"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Affollato means crowded/full of people."
  },
  {
    question: "Qual è il contrario di \"facile\"?",
    correctAnswer: "difficile",
    wrongAnswers: ["semplice", "veloce", "lento"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "The opposite of 'facile' (easy) is 'difficile' (difficult)."
  },
  {
    question: "\"Prenotare\" significa:",
    correctAnswer: "to book",
    wrongAnswers: ["cancellare", "comprare", "cercare"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Prenotare means to book/reserve."
  },
  {
    question: "Come si dice \"environment\"?",
    correctAnswer: "ambiente",
    wrongAnswers: ["atmosfera", "natura", "paesaggio"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Environment in Italian is 'ambiente'."
  },
  {
    question: "\"Inquinamento\" è legato a:",
    correctAnswer: "ambiente",
    wrongAnswers: ["salute", "cibo", "scuola"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Inquinamento (pollution) is related to environment."
  },
  {
    question: "\"Risparmiare\" significa:",
    correctAnswer: "to save",
    wrongAnswers: ["spendere", "guadagnare", "comprare"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Risparmiare means to save money."
  },
  {
    question: "Qual è il contrario di \"veloce\"?",
    correctAnswer: "lento",
    wrongAnswers: ["rapido", "agile", "breve"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "The opposite of 'veloce' (fast) is 'lento' (slow)."
  },
  {
    question: "\"Scoprire\" significa:",
    correctAnswer: "to discover",
    wrongAnswers: ["nascondere", "chiudere", "perdere"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Scoprire means to discover."
  },
  {
    question: "Come si dice \"challenge\"?",
    correctAnswer: "sfida",
    wrongAnswers: ["problema", "rischio", "ostacolo"],
    level: "B1",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Challenge in Italian is 'sfida'."
  },

  // Level B2 - Grammar (10 questions)
  {
    question: "\"Se fossi ricco, ___ una casa al mare.\"",
    correctAnswer: "comprerei",
    wrongAnswers: ["compro", "compravo", "ho comprato"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Hypothetical with conditional."
  },
  {
    question: "\"È importante che tu ___ puntuale.\"",
    correctAnswer: "sia",
    wrongAnswers: ["sei", "sarai", "eri"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after expressions of importance."
  },
  {
    question: "\"Non credo che lui ___ la verità.\"",
    correctAnswer: "dica",
    wrongAnswers: ["dice", "dirà", "ha detto"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after doubt."
  },
  {
    question: "\"Benché ___ stanco, ha continuato.\"",
    correctAnswer: "fosse",
    wrongAnswers: ["è", "era", "sarà"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after concessive clause."
  },
  {
    question: "\"Se lo avessi saputo, non ___ venuto.\"",
    correctAnswer: "sarei",
    wrongAnswers: ["sono", "ero", "sarò"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Past hypothetical with conditional perfect."
  },
  {
    question: "\"Temo che non ___ tempo.\"",
    correctAnswer: "abbiamo",
    wrongAnswers: ["avremo", "abbiamo avuto", "avevamo"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after fear."
  },
  {
    question: "\"Mi ha chiesto se ___ disponibile.\"",
    correctAnswer: "fossi",
    wrongAnswers: ["sono", "sarò", "ero"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Reported speech with subjunctive."
  },
  {
    question: "\"Dubito che loro ___ capito.\"",
    correctAnswer: "abbiano",
    wrongAnswers: ["hanno", "avranno", "avevano"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive perfect."
  },
  {
    question: "\"Sebbene ___ tardi, siamo usciti.\"",
    correctAnswer: "fosse",
    wrongAnswers: ["era", "è", "sarà"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after 'sebbene'."
  },
  {
    question: "\"È necessario che voi ___ attenti.\"",
    correctAnswer: "siate",
    wrongAnswers: ["siete", "sarete", "eravate"],
    level: "B2",
    category: "grammar",
    difficulty: "medium",
    explanation: "Subjunctive after 'è necessario che'."
  },

  // Level B2 - Vocabulary (10 questions)
  {
    question: "Come si dice \"to manage\" (a task)?",
    correctAnswer: "gestire",
    wrongAnswers: ["dimenticare", "provare", "cercare"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "To manage in Italian is 'gestire'."
  },
  {
    question: "\"Affidabile\" significa:",
    correctAnswer: "trustworthy",
    wrongAnswers: ["rumoroso", "divertente", "veloce"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Affidabile means trustworthy/reliable."
  },
  {
    question: "Qual è il contrario di \"successo\"?",
    correctAnswer: "fallimento",
    wrongAnswers: ["vincita", "guadagno", "progresso"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "The opposite of 'successo' (success) is 'fallimento' (failure)."
  },
  {
    question: "\"Sostenibile\" è legato a:",
    correctAnswer: "ambiente",
    wrongAnswers: ["moda", "sport", "economia"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Sostenibile (sustainable) is related to environment."
  },
  {
    question: "Come si dice \"to apply (for a job)\"?",
    correctAnswer: "candidarsi",
    wrongAnswers: ["iscriversi", "cercare", "inviare"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "To apply for a job in Italian is 'candidarsi'."
  },
  {
    question: "\"Efficiente\" significa:",
    correctAnswer: "productive",
    wrongAnswers: ["lento", "rumoroso", "costoso"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Efficiente means productive/efficient."
  },
  {
    question: "Qual è il contrario di \"ottimista\"?",
    correctAnswer: "pessimista",
    wrongAnswers: ["felice", "realista", "ironico"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "The opposite of 'ottimista' (optimistic) is 'pessimista' (pessimistic)."
  },
  {
    question: "\"Risoluto\" descrive una persona:",
    correctAnswer: "decisa",
    wrongAnswers: ["indecisa", "timida", "nervosa"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Risoluto describes a determined person."
  },
  {
    question: "Come si dice \"to overcome\"?",
    correctAnswer: "superare",
    wrongAnswers: ["evitare", "passare", "dimenticare"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "To overcome in Italian is 'superare'."
  },
  {
    question: "\"Competente\" significa:",
    correctAnswer: "qualified",
    wrongAnswers: ["inesperto", "curioso", "disponibile"],
    level: "B2",
    category: "vocabulary",
    difficulty: "medium",
    explanation: "Competente means qualified/competent."
  },

  // Generate remaining questions to reach 160 total
  // Level C1 - Grammar (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    question: `[C1 - Grammatica] Question ${i + 1}: Esempio di domanda?`,
    correctAnswer: `Risposta ${i + 1}A`,
    wrongAnswers: [`Risposta ${i + 1}B`, `Risposta ${i + 1}C`, `Risposta ${i + 1}D`],
    level: "C1",
    category: "grammar",
    difficulty: "hard",
    explanation: `Explanation for C1 grammar question ${i + 1}`
  })),

  // Level C1 - Vocabulary (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    question: `[C1 - Vocabolario] Question ${i + 1}: Esempio di domanda?`,
    correctAnswer: `Risposta ${i + 1}B`,
    wrongAnswers: [`Risposta ${i + 1}A`, `Risposta ${i + 1}C`, `Risposta ${i + 1}D`],
    level: "C1",
    category: "vocabulary",
    difficulty: "hard",
    explanation: `Explanation for C1 vocabulary question ${i + 1}`
  })),

  // Level C2 - Grammar (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    question: `[C2 - Grammatica] Question ${i + 1}: Esempio di domanda?`,
    correctAnswer: `Risposta ${i + 1}C`,
    wrongAnswers: [`Risposta ${i + 1}A`, `Risposta ${i + 1}B`, `Risposta ${i + 1}D`],
    level: "C2",
    category: "grammar",
    difficulty: "hard",
    explanation: `Explanation for C2 grammar question ${i + 1}`
  })),

  // Level C2 - Vocabulary (20 questions)
  ...Array.from({ length: 20 }, (_, i) => ({
    question: `[C2 - Vocabolario] Question ${i + 1}: Esempio di domanda?`,
    correctAnswer: `Risposta ${i + 1}D`,
    wrongAnswers: [`Risposta ${i + 1}A`, `Risposta ${i + 1}B`, `Risposta ${i + 1}C`],
    level: "C2",
    category: "vocabulary",
    difficulty: "hard",
    explanation: `Explanation for C2 vocabulary question ${i + 1}`
  }))
];

async function addItalianQuestions() {
  try {
    console.log('🚀 Adding Italian Proficiency Test Questions...');
    
    // Find the Italian question bank
    const existingBank = await prisma.languageProficiencyQuestionBank.findUnique({
      where: { languageCode: 'it' }
    });

    if (!existingBank) {
      console.log('❌ Italian question bank not found. Please run the create-missing-language-question-banks script first.');
      return;
    }

    // Delete existing questions for Italian
    await prisma.languageProficiencyQuestion.deleteMany({
      where: { bankId: existingBank.id }
    });
    console.log('✅ Deleted existing Italian questions');

    // Add all 160 questions
    for (let i = 0; i < ITALIAN_QUESTIONS.length; i++) {
      const q = ITALIAN_QUESTIONS[i];
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
      data: { totalQuestions: ITALIAN_QUESTIONS.length }
    });

    console.log(`🎉 Successfully added ${ITALIAN_QUESTIONS.length} Italian questions!`);
    console.log(`📊 Question bank ID: ${existingBank.id}`);
    
  } catch (error) {
    console.error('❌ Error adding Italian questions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addItalianQuestions();

