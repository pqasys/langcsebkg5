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

// Complete Italian Proficiency Test Question Bank (160 questions) - Clean Version
export const ITALIAN_PROFICIENCY_QUESTIONS: TestQuestion[] = [
  // A1 Level – Beginner
  // Grammar (10 questions)
  {
    id: 'A1-G-1',
    level: 'A1',
    question: 'Qual è il plurale di "libro"?',
    options: ['libris', 'libri', 'libroi', 'librei'],
    correctAnswer: 'libri',
    explanation: 'Regular masculine plural ends in -i.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-2',
    level: 'A1',
    question: 'Come si dice "I am" in italiano?',
    options: ['sei', 'sono', 'siamo', 'è'],
    correctAnswer: 'sono',
    explanation: '"Sono" is the first person singular form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-3',
    level: 'A1',
    question: 'Quale articolo si usa con "amico"?',
    options: ['la', 'le', 'l\'', 'il'],
    correctAnswer: 'l\'',
    explanation: '"Amico" starts with a vowel, so we use "l\'".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-4',
    level: 'A1',
    question: '"Tu ___ italiano?"',
    options: ['è', 'sei', 'sono', 'siamo'],
    correctAnswer: 'sei',
    explanation: '"Sei" is the second person singular form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-5',
    level: 'A1',
    question: '"Noi ___ a scuola."',
    options: ['sei', 'siamo', 'sono', 'siete'],
    correctAnswer: 'siamo',
    explanation: '"Siamo" is the first person plural form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-6',
    level: 'A1',
    question: 'Qual è il presente di "avere" per "lui"?',
    options: ['ho', 'ha', 'hanno', 'hai'],
    correctAnswer: 'ha',
    explanation: '"Ha" is the third person singular form of "avere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-7',
    level: 'A1',
    question: '"Io ___ una macchina."',
    options: ['ha', 'ho', 'hai', 'hanno'],
    correctAnswer: 'ho',
    explanation: '"Ho" is the first person singular form of "avere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-8',
    level: 'A1',
    question: '"Lei ___ francese."',
    options: ['sei', 'è', 'sono', 'siamo'],
    correctAnswer: 'è',
    explanation: '"È" is the third person singular form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-9',
    level: 'A1',
    question: '"Voi ___ amici."',
    options: ['siamo', 'siete', 'sono', 'sei'],
    correctAnswer: 'siete',
    explanation: '"Siete" is the second person plural form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A1-G-10',
    level: 'A1',
    question: '"Loro ___ studenti."',
    options: ['è', 'sono', 'siamo', 'siete'],
    correctAnswer: 'sono',
    explanation: '"Sono" is the third person plural form of "essere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  // A1 Level – Vocabulary (10 questions)
  {
    id: 'A1-V-11',
    level: 'A1',
    question: 'Come si dice "house" in italiano?',
    options: ['scuola', 'macchina', 'casa', 'porta'],
    correctAnswer: 'casa',
    explanation: '"Casa" means house in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-12',
    level: 'A1',
    question: 'Qual è il contrario di "grande"?',
    options: ['lungo', 'piccolo', 'alto', 'stretto'],
    correctAnswer: 'piccolo',
    explanation: '"Piccolo" is the opposite of "grande" (big).',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-13',
    level: 'A1',
    question: '"Buongiorno" si usa:',
    options: ['di notte', 'al mattino', 'a mezzanotte', 'nel pomeriggio'],
    correctAnswer: 'al mattino',
    explanation: '"Buongiorno" is used in the morning.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-14',
    level: 'A1',
    question: 'Come si dice "thank you"?',
    options: ['scusa', 'grazie', 'prego', 'ciao'],
    correctAnswer: 'grazie',
    explanation: '"Grazie" means thank you in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-15',
    level: 'A1',
    question: 'Qual è il colore del cielo?',
    options: ['rosso', 'verde', 'blu', 'giallo'],
    correctAnswer: 'blu',
    explanation: 'The sky is blue ("blu").',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-16',
    level: 'A1',
    question: '"Uno, due, ___":',
    options: ['cinque', 'tre', 'sei', 'quattro'],
    correctAnswer: 'tre',
    explanation: 'The sequence is: uno, due, tre (one, two, three).',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-17',
    level: 'A1',
    question: 'Come si dice "goodbye"?',
    options: ['grazie', 'arrivederci', 'buongiorno', 'ciao'],
    correctAnswer: 'arrivederci',
    explanation: '"Arrivederci" is a formal way to say goodbye.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-18',
    level: 'A1',
    question: '"Mi chiamo Luca" significa:',
    options: ['sono stanco', 'my name is Luca', 'ho fame', 'vado a casa'],
    correctAnswer: 'my name is Luca',
    explanation: '"Mi chiamo" means "my name is".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-19',
    level: 'A1',
    question: 'Qual è il giorno dopo lunedì?',
    options: ['giovedì', 'martedì', 'domenica', 'sabato'],
    correctAnswer: 'martedì',
    explanation: 'Tuesday (martedì) comes after Monday (lunedì).',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A1-V-20',
    level: 'A1',
    question: '"Ho fame" significa:',
    options: ['sono felice', 'I\'m hungry', 'ho sonno', 'ho paura'],
    correctAnswer: 'I\'m hungry',
    explanation: '"Ho fame" means "I\'m hungry".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  // A2 Level – Elementary
  // Grammar (10 questions)
  {
    id: 'A2-G-21',
    level: 'A2',
    question: '"Io e Marco ___ al cinema."',
    options: ['va', 'andiamo', 'vanno', 'andate'],
    correctAnswer: 'andiamo',
    explanation: '"Io e Marco" = "noi" → andiamo.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-22',
    level: 'A2',
    question: 'Qual è il passato prossimo di "mangiare"?',
    options: ['mangiato', 'ho mangiato', 'mangiavo', 'mangia'],
    correctAnswer: 'ho mangiato',
    explanation: 'The present perfect of "mangiare" is "ho mangiato".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-23',
    level: 'A2',
    question: '"Loro ___ finito il lavoro."',
    options: ['ha', 'hanno', 'abbiamo', 'avete'],
    correctAnswer: 'hanno',
    explanation: '"Hanno" is the third person plural form of "avere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-24',
    level: 'A2',
    question: '"Tu ___ visto quel film?"',
    options: ['hai', 'ha', 'ho', 'hanno'],
    correctAnswer: 'hai',
    explanation: '"Hai" is the second person singular form of "avere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-25',
    level: 'A2',
    question: '"Noi ___ in Italia l\'anno scorso."',
    options: ['siamo stati', 'siamo andato', 'siamo andati', 'siamo stati'],
    correctAnswer: 'siamo stati',
    explanation: '"Siamo stati" is the present perfect of "essere" (to be).',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-26',
    level: 'A2',
    question: '"Mi piace ___ la musica."',
    options: ['ascoltare', 'ascolto', 'ascoltando', 'ascoltato'],
    correctAnswer: 'ascoltare',
    explanation: 'After "mi piace" we use the infinitive form.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-27',
    level: 'A2',
    question: '"Luca non ___ mai il pesce."',
    options: ['mangia', 'mangiato', 'mangiava', 'mangiando'],
    correctAnswer: 'mangia',
    explanation: 'Present tense is used for habitual actions.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-28',
    level: 'A2',
    question: '"Quando ___ tu?"',
    options: ['arrivi', 'arrivato', 'arrivando', 'arrivare'],
    correctAnswer: 'arrivi',
    explanation: 'Present tense is used for future meaning in Italian.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-29',
    level: 'A2',
    question: '"Lei ___ una bella voce."',
    options: ['ha', 'hanno', 'hai', 'ho'],
    correctAnswer: 'ha',
    explanation: '"Ha" is the third person singular form of "avere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: 'A2-G-30',
    level: 'A2',
    question: '"Ci ___ alle otto."',
    options: ['vediamo', 'vedete', 'vedo', 'vedono'],
    correctAnswer: 'vediamo',
    explanation: '"Vediamo" is the first person plural form of "vedere".',
    category: 'grammar',
    difficulty: 'easy'
  },
  // A2 Level – Vocabulary (10 questions)
  {
    id: 'A2-V-31',
    level: 'A2',
    question: 'Come si dice "train" in italiano?',
    options: ['autobus', 'treno', 'macchina', 'bicicletta'],
    correctAnswer: 'treno',
    explanation: '"Treno" means train in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-32',
    level: 'A2',
    question: 'Qual è il contrario di "freddo"?',
    options: ['tiepido', 'caldo', 'fresco', 'gelido'],
    correctAnswer: 'caldo',
    explanation: '"Caldo" is the opposite of "freddo" (cold).',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-33',
    level: 'A2',
    question: '"Dove abiti?" significa:',
    options: ['come stai', 'where do you live', 'che ore sono', 'cosa fai'],
    correctAnswer: 'where do you live',
    explanation: '"Dove abiti?" means "Where do you live?".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-34',
    level: 'A2',
    question: 'Come si dice "always"?',
    options: ['mai', 'sempre', 'spesso', 'ogni tanto'],
    correctAnswer: 'sempre',
    explanation: '"Sempre" means always in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-35',
    level: 'A2',
    question: '"Mi piace leggere" significa:',
    options: ['I like to write', 'I like to read', 'I like to sleep', 'I like to eat'],
    correctAnswer: 'I like to read',
    explanation: '"Leggere" means to read.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-36',
    level: 'A2',
    question: 'Qual è il colore del limone?',
    options: ['verde', 'giallo', 'arancione', 'rosso'],
    correctAnswer: 'giallo',
    explanation: 'Lemons are yellow ("giallo").',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-37',
    level: 'A2',
    question: 'Come si dice "week"?',
    options: ['giorno', 'mese', 'settimana', 'ora'],
    correctAnswer: 'settimana',
    explanation: '"Settimana" means week in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-38',
    level: 'A2',
    question: '"Sto bene" significa:',
    options: ['I\'m tired', 'I\'m well', 'I\'m hungry', 'I\'m late'],
    correctAnswer: 'I\'m well',
    explanation: '"Sto bene" means "I\'m well" or "I\'m fine".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-39',
    level: 'A2',
    question: 'Qual è il contrario di "vecchio"?',
    options: ['grande', 'giovane', 'piccolo', 'nuovo'],
    correctAnswer: 'giovane',
    explanation: '"Giovane" is the opposite of "vecchio" (old).',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: 'A2-V-40',
    level: 'A2',
    question: 'Come si dice "to travel"?',
    options: ['mangiare', 'dormire', 'viaggiare', 'camminare'],
    correctAnswer: 'viaggiare',
    explanation: '"Viaggiare" means to travel in Italian.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  // B1 Level – Intermediate
  // Grammar (10 questions)
  {
    id: 'B1-G-41',
    level: 'B1',
    question: '"Se piove, ___ a casa."',
    options: ['vado', 'rimango', 'esco', 'corro'],
    correctAnswer: 'rimango',
    explanation: 'Conditional logic: staying home if it rains.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-42',
    level: 'B1',
    question: '"Luca ha detto che ___ venire."',
    options: ['può', 'potere', 'poteva', 'potrà'],
    correctAnswer: 'può',
    explanation: 'Present tense is used in reported speech.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-43',
    level: 'B1',
    question: '"Quando ero piccolo, ___ sempre al parco."',
    options: ['vado', 'andavo', 'andato', 'andrò'],
    correctAnswer: 'andavo',
    explanation: 'Imperfetto for habitual past action.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-44',
    level: 'B1',
    question: '"Non so se lui ___ arrivato."',
    options: ['è', 'sia', 'sarà', 'fosse'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after uncertainty.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-45',
    level: 'B1',
    question: '"Mi ha detto che ___ stanco."',
    options: ['è', 'era', 'sarà', 'fosse'],
    correctAnswer: 'era',
    explanation: 'Reported speech in the past.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-46',
    level: 'B1',
    question: '"Vorrei che tu ___ con me."',
    options: ['vieni', 'venissi', 'verrai', 'venga'],
    correctAnswer: 'venissi',
    explanation: 'Subjunctive imperfect for desire.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-47',
    level: 'B1',
    question: '"Se avessi tempo, ___ di più."',
    options: ['studio', 'studerei', 'studiavo', 'ho studiato'],
    correctAnswer: 'studerei',
    explanation: 'Hypothetical with conditional.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-48',
    level: 'B1',
    question: '"Nonostante ___ tardi, è uscito."',
    options: ['era', 'fosse', 'è', 'sarà'],
    correctAnswer: 'fosse',
    explanation: 'Subjunctive after "nonostante."',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-49',
    level: 'B1',
    question: '"Appena ___, chiamami."',
    options: ['arrivi', 'arriverai', 'sei arrivato', 'arrivavi'],
    correctAnswer: 'arrivi',
    explanation: 'Subjunctive after "appena".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B1-G-50',
    level: 'B1',
    question: '"Spero che tu ___ bene."',
    options: ['stai', 'stia', 'sei', 'sarai'],
    correctAnswer: 'stia',
    explanation: 'Subjunctive after "spero".',
    category: 'grammar',
    difficulty: 'medium'
  },
  // B1 Level – Vocabulary (10 questions)
  {
    id: 'B1-V-51',
    level: 'B1',
    question: 'Come si dice "to improve"?',
    options: ['peggiorare', 'migliorare', 'cambiare', 'crescere'],
    correctAnswer: 'migliorare',
    explanation: '"Migliorare" means to improve.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-52',
    level: 'B1',
    question: '"Affollato" significa:',
    options: ['vuoto', 'pieno di gente', 'rumoroso', 'tranquillo'],
    correctAnswer: 'pieno di gente',
    explanation: '"Affollato" means crowded.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-53',
    level: 'B1',
    question: 'Qual è il contrario di "facile"?',
    options: ['semplice', 'difficile', 'veloce', 'lento'],
    correctAnswer: 'difficile',
    explanation: '"Difficile" is the opposite of "facile" (easy).',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-54',
    level: 'B1',
    question: '"Prenotare" significa:',
    options: ['cancellare', 'to book', 'comprare', 'cercare'],
    correctAnswer: 'to book',
    explanation: '"Prenotare" means to book or reserve.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-55',
    level: 'B1',
    question: 'Come si dice "environment"?',
    options: ['atmosfera', 'ambiente', 'natura', 'paesaggio'],
    correctAnswer: 'ambiente',
    explanation: '"Ambiente" means environment.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-56',
    level: 'B1',
    question: '"Inquinamento" è legato a:',
    options: ['salute', 'ambiente', 'cibo', 'scuola'],
    correctAnswer: 'ambiente',
    explanation: '"Inquinamento" means pollution, related to environment.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-57',
    level: 'B1',
    question: '"Risparmiare" significa:',
    options: ['spendere', 'to save', 'guadagnare', 'comprare'],
    correctAnswer: 'to save',
    explanation: '"Risparmiare" means to save money.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-58',
    level: 'B1',
    question: 'Qual è il contrario di "veloce"?',
    options: ['rapido', 'lento', 'agile', 'breve'],
    correctAnswer: 'lento',
    explanation: '"Lento" is the opposite of "veloce" (fast).',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-59',
    level: 'B1',
    question: '"Scoprire" significa:',
    options: ['nascondere', 'to discover', 'chiudere', 'perdere'],
    correctAnswer: 'to discover',
    explanation: '"Scoprire" means to discover.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B1-V-60',
    level: 'B1',
    question: 'Come si dice "challenge"?',
    options: ['problema', 'sfida', 'rischio', 'ostacolo'],
    correctAnswer: 'sfida',
    explanation: '"Sfida" means challenge.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  // B2 Level – Upper Intermediate
  // Grammar (10 questions)
  {
    id: 'B2-G-61',
    level: 'B2',
    question: '"Se fossi ricco, ___ una casa al mare."',
    options: ['compro', 'comprerei', 'compravo', 'ho comprato'],
    correctAnswer: 'comprerei',
    explanation: 'Hypothetical with conditional.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-62',
    level: 'B2',
    question: '"È importante che tu ___ puntuale."',
    options: ['sei', 'sia', 'sarai', 'eri'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after expressions of importance.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-63',
    level: 'B2',
    question: '"Non credo che lui ___ la verità."',
    options: ['dice', 'dica', 'dirà', 'ha detto'],
    correctAnswer: 'dica',
    explanation: 'Subjunctive after doubt.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-64',
    level: 'B2',
    question: '"Benché ___ stanco, ha continuato."',
    options: ['è', 'fosse', 'era', 'sarà'],
    correctAnswer: 'fosse',
    explanation: 'Subjunctive after concessive clause.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-65',
    level: 'B2',
    question: '"Se lo avessi saputo, non ___ venuto."',
    options: ['sono', 'sarei', 'ero', 'sarò'],
    correctAnswer: 'sarei',
    explanation: 'Past hypothetical with conditional perfect.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-66',
    level: 'B2',
    question: '"Temo che non ___ tempo."',
    options: ['abbiamo', 'avremo', 'abbiamo avuto', 'avevamo'],
    correctAnswer: 'abbiamo',
    explanation: 'Subjunctive after fear.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-67',
    level: 'B2',
    question: '"Mi ha chiesto se ___ disponibile."',
    options: ['sono', 'fossi', 'sarò', 'ero'],
    correctAnswer: 'fossi',
    explanation: 'Reported speech with subjunctive.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-68',
    level: 'B2',
    question: '"Dubito che loro ___ capito."',
    options: ['hanno', 'abbiano', 'avranno', 'avevano'],
    correctAnswer: 'abbiano',
    explanation: 'Subjunctive perfect.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-69',
    level: 'B2',
    question: '"Sebbene ___ tardi, siamo usciti."',
    options: ['era', 'fosse', 'è', 'sarà'],
    correctAnswer: 'fosse',
    explanation: 'Subjunctive after "sebbene".',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: 'B2-G-70',
    level: 'B2',
    question: '"È necessario che voi ___ attenti."',
    options: ['siete', 'siate', 'sarete', 'eravate'],
    correctAnswer: 'siate',
    explanation: 'Subjunctive after "è necessario".',
    category: 'grammar',
    difficulty: 'medium'
  },
  // B2 Level – Vocabulary (10 questions)
  {
    id: 'B2-V-71',
    level: 'B2',
    question: 'Come si dice "to manage" (a task)?',
    options: ['dimenticare', 'gestire', 'provare', 'cercare'],
    correctAnswer: 'gestire',
    explanation: '"Gestire" means to manage.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-72',
    level: 'B2',
    question: '"Affidabile" significa:',
    options: ['rumoroso', 'trustworthy', 'divertente', 'veloce'],
    correctAnswer: 'trustworthy',
    explanation: '"Affidabile" means trustworthy.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-73',
    level: 'B2',
    question: 'Qual è il contrario di "successo"?',
    options: ['vincita', 'fallimento', 'guadagno', 'progresso'],
    correctAnswer: 'fallimento',
    explanation: '"Fallimento" is the opposite of "successo" (success).',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-74',
    level: 'B2',
    question: '"Sostenibile" è legato a:',
    options: ['moda', 'ambiente', 'sport', 'economia'],
    correctAnswer: 'ambiente',
    explanation: '"Sostenibile" means sustainable, related to environment.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-75',
    level: 'B2',
    question: 'Come si dice "to apply (for a job)"?',
    options: ['iscriversi', 'candidarsi', 'cercare', 'inviare'],
    correctAnswer: 'candidarsi',
    explanation: '"Candidarsi" means to apply for a job.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-76',
    level: 'B2',
    question: '"Efficiente" significa:',
    options: ['lento', 'productive', 'rumoroso', 'costoso'],
    correctAnswer: 'productive',
    explanation: '"Efficiente" means efficient or productive.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-77',
    level: 'B2',
    question: 'Qual è il contrario di "ottimista"?',
    options: ['felice', 'pessimista', 'realista', 'ironico'],
    correctAnswer: 'pessimista',
    explanation: '"Pessimista" is the opposite of "ottimista" (optimistic).',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-78',
    level: 'B2',
    question: '"Risoluto" descrive una persona:',
    options: ['indecisa', 'decisa', 'timida', 'nervosa'],
    correctAnswer: 'decisa',
    explanation: '"Risoluto" means determined or resolute.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-79',
    level: 'B2',
    question: 'Come si dice "to overcome"?',
    options: ['evitare', 'superare', 'passare', 'dimenticare'],
    correctAnswer: 'superare',
    explanation: '"Superare" means to overcome.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: 'B2-V-80',
    level: 'B2',
    question: '"Competente" significa:',
    options: ['inesperto', 'qualified', 'curioso', 'disponibile'],
    correctAnswer: 'qualified',
    explanation: '"Competente" means competent or qualified.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  // C1 Level – Advanced
  // Grammar (20 questions)
  {
    id: 'C1-G-81',
    level: 'C1',
    question: '"Qualunque cosa tu ___, sarò con te."',
    options: ['fai', 'faccia', 'farai', 'facevi'],
    correctAnswer: 'faccia',
    explanation: 'Subjunctive after "qualunque cosa."',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-82',
    level: 'C1',
    question: '"È il libro più interessante che io ___ mai letto."',
    options: ['ho', 'abbia', 'abbia avuto', 'leggo'],
    correctAnswer: 'abbia',
    explanation: 'Subjunctive in superlative constructions.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-83',
    level: 'C1',
    question: '"Pur ___ stanco, ha continuato."',
    options: ['essendo', 'essere', 'stato', 'stava'],
    correctAnswer: 'essendo',
    explanation: 'Gerund form after "pur".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-84',
    level: 'C1',
    question: '"Sebbene lui ___, non lo ammette."',
    options: ['sbaglia', 'sbagli', 'sbagliava', 'sbagliato'],
    correctAnswer: 'sbagli',
    explanation: 'Subjunctive after "sebbene".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-85',
    level: 'C1',
    question: '"Temo che non ci ___ tempo."',
    options: ['sia', 'sarà', 'è', 'fosse'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after "temo".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-86',
    level: 'C1',
    question: '"È improbabile che loro ___ d\'accordo."',
    options: ['siano', 'sono', 'saranno', 'fossero'],
    correctAnswer: 'siano',
    explanation: 'Subjunctive after "è improbabile".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-87',
    level: 'C1',
    question: '"Nonostante tu ___, ti rispetto."',
    options: ['sbagli', 'sbagliato', 'sbagliavi', 'sbaglierai'],
    correctAnswer: 'sbagli',
    explanation: 'Subjunctive after "nonostante".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-88',
    level: 'C1',
    question: '"È giusto che noi ___ la verità."',
    options: ['diciamo', 'diremo', 'diciamo', 'abbiamo detto'],
    correctAnswer: 'diciamo',
    explanation: 'Subjunctive after "è giusto".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-89',
    level: 'C1',
    question: '"Avrei preferito che tu ___ prima."',
    options: ['arrivi', 'fossi arrivato', 'arrivavi', 'sei arrivato'],
    correctAnswer: 'fossi arrivato',
    explanation: 'Subjunctive perfect in past hypothetical.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-90',
    level: 'C1',
    question: '"Non pensavo che lui ___ così bravo."',
    options: ['è', 'fosse', 'sarà', 'sia'],
    correctAnswer: 'fosse',
    explanation: 'Subjunctive imperfect in past thought.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-91',
    level: 'C1',
    question: '"Qualora tu ___ bisogno, chiamami."',
    options: ['hai', 'abbia', 'avrai', 'avevi'],
    correctAnswer: 'abbia',
    explanation: 'Subjunctive after "qualora".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-92',
    level: 'C1',
    question: '"A meno che non ___ tardi, usciamo."',
    options: ['è', 'sia', 'sarà', 'fosse'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after "a meno che non".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-93',
    level: 'C1',
    question: '"È possibile che lei ___ già partita."',
    options: ['è', 'sia', 'sarà', 'fosse'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after "è possibile".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-94',
    level: 'C1',
    question: '"Sarei felice se tu mi ___."',
    options: ['aiuti', 'aiutassi', 'aiutavi', 'hai aiutato'],
    correctAnswer: 'aiutassi',
    explanation: 'Subjunctive imperfect in conditional.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-95',
    level: 'C1',
    question: '"Mi piacerebbe che voi ___ qui."',
    options: ['siete', 'foste', 'sarete', 'eravate'],
    correctAnswer: 'foste',
    explanation: 'Subjunctive imperfect after "mi piacerebbe".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-96',
    level: 'C1',
    question: '"Nonostante ___ piovuto, siamo usciti."',
    options: ['ha', 'abbia', 'è', 'fosse'],
    correctAnswer: 'abbia',
    explanation: 'Subjunctive perfect after "nonostante".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-97',
    level: 'C1',
    question: '"È importante che tu ___ presente."',
    options: ['sei', 'sia', 'sarai', 'eri'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after "è importante".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-98',
    level: 'C1',
    question: '"Temevo che non ___ capito."',
    options: ['hai', 'avessi', 'avevi', 'hai avuto'],
    correctAnswer: 'avessi',
    explanation: 'Subjunctive imperfect after "temevo".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-99',
    level: 'C1',
    question: '"Speravo che voi ___ venire."',
    options: ['potete', 'poteste', 'potevate', 'potete'],
    correctAnswer: 'poteste',
    explanation: 'Subjunctive imperfect after "speravo".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C1-G-100',
    level: 'C1',
    question: '"Vorrei che tu mi ___."',
    options: ['aiuti', 'aiutassi', 'aiutavi', 'aiutare'],
    correctAnswer: 'aiutassi',
    explanation: 'Subjunctive imperfect after "vorrei".',
    category: 'grammar',
    difficulty: 'hard'
  },
  // C1 Level – Vocabulary (20 questions)
  {
    id: 'C1-V-101',
    level: 'C1',
    question: '"Esauriente" significa:',
    options: ['breve', 'completo e chiaro', 'confuso', 'superficiale'],
    correctAnswer: 'completo e chiaro',
    explanation: '"Esauriente" means comprehensive and clear.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-102',
    level: 'C1',
    question: 'Come si dice "nuance"?',
    options: ['sfumatura', 'tonalità', 'dettaglio', 'particolare'],
    correctAnswer: 'sfumatura',
    explanation: '"Sfumatura" means nuance.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-103',
    level: 'C1',
    question: '"Intransigente" descrive una persona:',
    options: ['flessibile', 'rigida', 'gentile', 'calma'],
    correctAnswer: 'rigida',
    explanation: '"Intransigente" means uncompromising or rigid.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-104',
    level: 'C1',
    question: '"Ambiguo" significa:',
    options: ['chiaro', 'dubbio o poco definito', 'diretto', 'semplice'],
    correctAnswer: 'dubbio o poco definito',
    explanation: '"Ambiguo" means ambiguous or unclear.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-105',
    level: 'C1',
    question: 'Come si dice "to emphasize"?',
    options: ['ignorare', 'sottolineare', 'evitare', 'ridurre'],
    correctAnswer: 'sottolineare',
    explanation: '"Sottolineare" means to emphasize.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-106',
    level: 'C1',
    question: '"Disinvolto" descrive una persona:',
    options: ['nervosa', 'sicura e rilassata', 'timida', 'aggressiva'],
    correctAnswer: 'sicura e rilassata',
    explanation: '"Disinvolto" means confident and relaxed.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-107',
    level: 'C1',
    question: '"Raffinato" significa:',
    options: ['semplice', 'elegante e sofisticato', 'rozzo', 'banale'],
    correctAnswer: 'elegante e sofisticato',
    explanation: '"Raffinato" means refined and sophisticated.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-108',
    level: 'C1',
    question: 'Come si dice "to cope"?',
    options: ['evitare', 'affrontare', 'superare', 'dimenticare'],
    correctAnswer: 'affrontare',
    explanation: '"Affrontare" means to cope or face.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-109',
    level: 'C1',
    question: '"Inadeguato" è il contrario di:',
    options: ['giusto', 'adeguato', 'corretto', 'utile'],
    correctAnswer: 'adeguato',
    explanation: '"Inadeguato" is the opposite of "adeguato" (adequate).',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-110',
    level: 'C1',
    question: '"Eloquente" descrive:',
    options: ['silenzioso', 'che parla bene e con efficacia', 'confuso', 'banale'],
    correctAnswer: 'che parla bene e con efficacia',
    explanation: '"Eloquente" means eloquent or well-spoken.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-111',
    level: 'C1',
    question: 'Come si dice "to trigger"?',
    options: ['evitare', 'scatenare', 'fermare', 'ridurre'],
    correctAnswer: 'scatenare',
    explanation: '"Scatenare" means to trigger or unleash.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-112',
    level: 'C1',
    question: '"Controverso" significa:',
    options: ['chiaro', 'discusso e divisivo', 'semplice', 'evidente'],
    correctAnswer: 'discusso e divisivo',
    explanation: '"Controverso" means controversial.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-113',
    level: 'C1',
    question: '"Sottinteso" è qualcosa:',
    options: ['detto chiaramente', 'implicito', 'gridato', 'scritto'],
    correctAnswer: 'implicito',
    explanation: '"Sottinteso" means implied or understood.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-114',
    level: 'C1',
    question: 'Come si dice "to mislead"?',
    options: ['guidare', 'ingannare', 'aiutare', 'correggere'],
    correctAnswer: 'ingannare',
    explanation: '"Ingannare" means to mislead or deceive.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-115',
    level: 'C1',
    question: '"Capzioso" significa:',
    options: ['onesto', 'ingannevole o fuorviante', 'diretto', 'semplice'],
    correctAnswer: 'ingannevole o fuorviante',
    explanation: '"Capzioso" means misleading or deceptive.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-116',
    level: 'C1',
    question: '"Empatico" descrive una persona:',
    options: ['fredda', 'comprensiva', 'aggressiva', 'distante'],
    correctAnswer: 'comprensiva',
    explanation: '"Empatico" means empathetic or understanding.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-117',
    level: 'C1',
    question: 'Come si dice "to unravel"?',
    options: ['cucire', 'districare', 'legare', 'nascondere'],
    correctAnswer: 'districare',
    explanation: '"Districare" means to unravel or untangle.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-118',
    level: 'C1',
    question: '"Sprezzante" significa:',
    options: ['rispettoso', 'disprezzante o arrogante', 'gentile', 'educato'],
    correctAnswer: 'disprezzante o arrogante',
    explanation: '"Sprezzante" means contemptuous or arrogant.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-119',
    level: 'C1',
    question: '"Indole" si riferisce a:',
    options: ['aspetto fisico', 'carattere naturale', 'lavoro', 'famiglia'],
    correctAnswer: 'carattere naturale',
    explanation: '"Indole" refers to natural character or disposition.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C1-V-120',
    level: 'C1',
    question: 'Come si dice "to foster"?',
    options: ['ignorare', 'favorire', 'evitare', 'ridurre'],
    correctAnswer: 'favorire',
    explanation: '"Favorire" means to foster or promote.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  // C2 Level – Mastery
  // Grammar (20 questions)
  {
    id: 'C2-G-121',
    level: 'C2',
    question: '"Qualora tu ___ deciso, fammelo sapere."',
    options: ['hai', 'abbia', 'avrai', 'avevi'],
    correctAnswer: 'abbia',
    explanation: 'Subjunctive after "qualora."',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-122',
    level: 'C2',
    question: '"Fosse stato più attento, non ___ quell\'errore."',
    options: ['faceva', 'avrebbe fatto', 'farà', 'ha fatto'],
    correctAnswer: 'avrebbe fatto',
    explanation: 'Past hypothetical with conditional perfect.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-123',
    level: 'C2',
    question: '"È improbabile che lui ___ a quell\'evento."',
    options: ['va', 'vada', 'andrà', 'è andato'],
    correctAnswer: 'vada',
    explanation: 'Subjunctive after "è improbabile".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-124',
    level: 'C2',
    question: '"Pur ___ consapevole, ha agito."',
    options: ['essendo', 'essere', 'stato', 'stava'],
    correctAnswer: 'essendo',
    explanation: 'Gerund form after "pur".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-125',
    level: 'C2',
    question: '"Avrei voluto che tu mi ___ prima."',
    options: ['chiami', 'avessi chiamato', 'chiamavi', 'hai chiamato'],
    correctAnswer: 'avessi chiamato',
    explanation: 'Subjunctive perfect in past wish.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-126',
    level: 'C2',
    question: '"Benché ___ tutto, non si è arreso."',
    options: ['perde', 'abbia perso', 'perdeva', 'ha perso'],
    correctAnswer: 'abbia perso',
    explanation: 'Subjunctive perfect after "benché".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-127',
    level: 'C2',
    question: '"Nonostante lui ___ contrario, abbiamo deciso."',
    options: ['è', 'fosse', 'sarà', 'era'],
    correctAnswer: 'fosse',
    explanation: 'Subjunctive after "nonostante".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-128',
    level: 'C2',
    question: '"Sarei venuto, se me lo ___."',
    options: ['dicevi', 'avessi detto', 'hai detto', 'dice'],
    correctAnswer: 'avessi detto',
    explanation: 'Past hypothetical with subjunctive perfect.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-129',
    level: 'C2',
    question: '"Temevo che tu non ___ pronto."',
    options: ['sei', 'fossi', 'sarai', 'eri'],
    correctAnswer: 'fossi',
    explanation: 'Subjunctive imperfect after "temevo".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-130',
    level: 'C2',
    question: '"Nel caso in cui ___ problemi, chiamami."',
    options: ['hai', 'avessi', 'avrai', 'avevi'],
    correctAnswer: 'avessi',
    explanation: 'Subjunctive after "nel caso in cui".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-131',
    level: 'C2',
    question: '"A patto che tu ___ d\'accordo, procediamo."',
    options: ['sei', 'sia', 'sarai', 'eri'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive after "a patto che".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-132',
    level: 'C2',
    question: '"Qualunque cosa tu ___, ti sosterrò."',
    options: ['fai', 'faccia', 'farai', 'facevi'],
    correctAnswer: 'faccia',
    explanation: 'Subjunctive after "qualunque cosa".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-133',
    level: 'C2',
    question: '"Speravo che voi ___ capito."',
    options: ['avete', 'aveste', 'avevate', 'avete avuto'],
    correctAnswer: 'aveste',
    explanation: 'Subjunctive imperfect after "speravo".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-134',
    level: 'C2',
    question: '"Se solo lui ___ ascoltato."',
    options: ['ha', 'avesse', 'aveva', 'avrà'],
    correctAnswer: 'avesse',
    explanation: 'Subjunctive perfect in wish.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-135',
    level: 'C2',
    question: '"È il miglior risultato che si ___ ottenuto."',
    options: ['ha', 'sia', 'è', 'sarà'],
    correctAnswer: 'sia',
    explanation: 'Subjunctive in superlative with impersonal "si".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-136',
    level: 'C2',
    question: '"Non è detto che lui ___ venire."',
    options: ['può', 'possa', 'potrà', 'poteva'],
    correctAnswer: 'possa',
    explanation: 'Subjunctive after "non è detto".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-137',
    level: 'C2',
    question: '"Avrei preferito che voi ___ più chiari."',
    options: ['siete', 'foste stati', 'sarete', 'eravate'],
    correctAnswer: 'foste stati',
    explanation: 'Subjunctive perfect in past preference.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-138',
    level: 'C2',
    question: '"Nel caso in cui non ___, avvisami."',
    options: ['arrivi', 'arrivassi', 'arriverai', 'sei arrivato'],
    correctAnswer: 'arrivassi',
    explanation: 'Subjunctive after "nel caso in cui".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-139',
    level: 'C2',
    question: '"È improbabile che lui ___ capito."',
    options: ['ha', 'abbia', 'aveva', 'avrà'],
    correctAnswer: 'abbia',
    explanation: 'Subjunctive after "è improbabile".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: 'C2-G-140',
    level: 'C2',
    question: '"Sarei felice se tu mi ___ aiutare."',
    options: ['puoi', 'potessi', 'potevi', 'hai potuto'],
    correctAnswer: 'potessi',
    explanation: 'Subjunctive imperfect in conditional.',
    category: 'grammar',
    difficulty: 'hard'
  },
  // C2 Level – Vocabulary (20 questions)
  {
    id: 'C2-V-141',
    level: 'C2',
    question: '"Ineluttabile" significa:',
    options: ['evitabile', 'inevitabile', 'probabile', 'discutibile'],
    correctAnswer: 'inevitabile',
    explanation: '"Ineluttabile" means inevitable.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-142',
    level: 'C2',
    question: '"Sofisticato" descrive qualcosa di:',
    options: ['semplice', 'complesso ed elegante', 'banale', 'rozzo'],
    correctAnswer: 'complesso ed elegante',
    explanation: '"Sofisticato" means sophisticated.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-143',
    level: 'C2',
    question: '"Ostico" significa:',
    options: ['facile', 'difficile da affrontare', 'divertente', 'utile'],
    correctAnswer: 'difficile da affrontare',
    explanation: '"Ostico" means difficult to deal with.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-144',
    level: 'C2',
    question: 'Come si dice "to dissect" (a concept)?',
    options: ['ignorare', 'analizzare', 'semplificare', 'confondere'],
    correctAnswer: 'analizzare',
    explanation: '"Analizzare" means to analyze or dissect.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-145',
    level: 'C2',
    question: '"Ponderare" significa:',
    options: ['agire impulsivamente', 'riflettere attentamente', 'ignorare', 'decidere in fretta'],
    correctAnswer: 'riflettere attentamente',
    explanation: '"Ponderare" means to ponder or reflect carefully.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-146',
    level: 'C2',
    question: '"Intransigente" è il contrario di:',
    options: ['rigido', 'flessibile', 'deciso', 'coerente'],
    correctAnswer: 'flessibile',
    explanation: '"Intransigente" is the opposite of "flessibile" (flexible).',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-147',
    level: 'C2',
    question: '"Disamina" significa:',
    options: ['sintesi', 'analisi dettagliata', 'opinione', 'critica'],
    correctAnswer: 'analisi dettagliata',
    explanation: '"Disamina" means detailed analysis.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-148',
    level: 'C2',
    question: 'Come si dice "to nuance"?',
    options: ['semplificare', 'sfumare', 'chiarire', 'confondere'],
    correctAnswer: 'sfumare',
    explanation: '"Sfumare" means to nuance or shade.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-149',
    level: 'C2',
    question: '"Ermetico" descrive qualcosa di:',
    options: ['aperto', 'chiuso e difficile da capire', 'trasparente', 'evidente'],
    correctAnswer: 'chiuso e difficile da capire',
    explanation: '"Ermetico" means hermetic or difficult to understand.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-150',
    level: 'C2',
    question: '"Retorico" significa:',
    options: ['pratico', 'stilisticamente elaborato', 'diretto', 'semplice'],
    correctAnswer: 'stilisticamente elaborato',
    explanation: '"Retorico" means rhetorical or stylistically elaborate.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-151',
    level: 'C2',
    question: '"Disinibito" descrive una persona:',
    options: ['timida', 'libera da freni sociali', 'nervosa', 'riservata'],
    correctAnswer: 'libera da freni sociali',
    explanation: '"Disinibito" means uninhibited.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-152',
    level: 'C2',
    question: '"Sagace" significa:',
    options: ['lento', 'intelligente e perspicace', 'distratto', 'ingenuo'],
    correctAnswer: 'intelligente e perspicace',
    explanation: '"Sagace" means sagacious or intelligent and perceptive.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-153',
    level: 'C2',
    question: 'Come si dice "to extrapolate"?',
    options: ['ignorare', 'estrapolare', 'confondere', 'semplificare'],
    correctAnswer: 'estrapolare',
    explanation: '"Estrapolare" means to extrapolate.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-154',
    level: 'C2',
    question: '"Laconico" descrive uno stile:',
    options: ['prolisso', 'breve e conciso', 'confuso', 'elaborato'],
    correctAnswer: 'breve e conciso',
    explanation: '"Laconico" means laconic or brief and concise.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-155',
    level: 'C2',
    question: '"Disilluso" significa:',
    options: ['ottimista', 'deluso dalla realtà', 'felice', 'fiducioso'],
    correctAnswer: 'deluso dalla realtà',
    explanation: '"Disilluso" means disillusioned.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-156',
    level: 'C2',
    question: '"Ambivalente" significa:',
    options: ['chiaro', 'con sentimenti contrastanti', 'deciso', 'coerente'],
    correctAnswer: 'con sentimenti contrastanti',
    explanation: '"Ambivalente" means ambivalent or having mixed feelings.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-157',
    level: 'C2',
    question: 'Come si dice "to encapsulate"?',
    options: ['ignorare', 'riassumere', 'confondere', 'espandere'],
    correctAnswer: 'riassumere',
    explanation: '"Riassumere" means to summarize or encapsulate.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-158',
    level: 'C2',
    question: '"Ineffabile" descrive qualcosa:',
    options: ['banale', 'che non si può esprimere a parole', 'evidente', 'rumoroso'],
    correctAnswer: 'che non si può esprimere a parole',
    explanation: '"Ineffabile" means ineffable or indescribable.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-159',
    level: 'C2',
    question: '"Prolifico" significa:',
    options: ['pigro', 'produttivo e creativo', 'lento', 'distratto'],
    correctAnswer: 'produttivo e creativo',
    explanation: '"Prolifico" means prolific or productive and creative.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: 'C2-V-160',
    level: 'C2',
    question: '"Disgregare" significa:',
    options: ['unire', 'frammentare o separare', 'rafforzare', 'costruire'],
    correctAnswer: 'frammentare o separare',
    explanation: '"Disgregare" means to disintegrate or fragment.',
    category: 'vocabulary',
    difficulty: 'hard'
  }
];



// Utility functions
export function getRandomQuestions(count: number, level?: string, category?: string): TestQuestion[] {
  let filteredQuestions = ITALIAN_PROFICIENCY_QUESTIONS;
  
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
  return ITALIAN_PROFICIENCY_QUESTIONS.filter(q => q.level === level);
}

export function getQuestionsByCategory(category: string): TestQuestion[] {
  return ITALIAN_PROFICIENCY_QUESTIONS.filter(q => q.category === category);
}

export function getBalancedQuestionSet(count: number = 80): TestQuestion[] {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const categories = ['grammar', 'vocabulary'];
  const questionsPerLevel = Math.floor(count / levels.length);
  const questionsPerCategory = Math.floor(questionsPerLevel / categories.length);
  
  let balancedQuestions: TestQuestion[] = [];
  
  for (const level of levels) {
    for (const category of categories) {
      const levelCategoryQuestions = ITALIAN_PROFICIENCY_QUESTIONS.filter(
        q => q.level === level && q.category === category
      );
      const selectedQuestions = getRandomQuestions(
        Math.min(questionsPerCategory, levelCategoryQuestions.length),
        level,
        category
      );
      balancedQuestions.push(...selectedQuestions);
    }
  }
  
  // Fill remaining slots with random questions
  const remaining = count - balancedQuestions.length;
  if (remaining > 0) {
    const usedIds = new Set(balancedQuestions.map(q => q.id));
    const availableQuestions = ITALIAN_PROFICIENCY_QUESTIONS.filter(q => !usedIds.has(q.id));
    const additionalQuestions = getRandomQuestions(remaining);
    balancedQuestions.push(...additionalQuestions);
  }
  
  return balancedQuestions.slice(0, count);
}
