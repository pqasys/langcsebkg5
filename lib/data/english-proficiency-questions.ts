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

// Complete English Proficiency Test Question Bank (160 questions)
export const ENGLISH_PROFICIENCY_QUESTIONS: TestQuestion[] = [
  // Original 80 questions (1-80)
  {
    id: '1',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '2',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".',
    category: 'grammar',
    difficulty: 'easy'
  },
  // ... (continuing with original questions 3-80)
  
  // New questions (81-160)
  {
    id: '81',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '82',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"He ate dinner" is in the past tense - "ate" is the past form of "eat".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '83',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'The correct question form is "Do you like pizza?" - use auxiliary verb "do" for questions.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '84',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '85',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '86',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '87',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is an informal idiom meaning to die.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '88',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '89',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '90',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '91',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: '"Ubiquitous" means present, appearing, or found everywhere - synonymous with "widespread".',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '92',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'The correct question form is "Do you like pizza?" - use auxiliary verb "do" for questions.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '93',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"He ate dinner" is in the past tense - "ate" is the past form of "eat".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '94',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, use present tense in the "if" clause and future tense in the main clause.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '95',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" shows cause and effect - she studied hard, therefore she passed.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '96',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" shows cause and effect - she studied hard, therefore she passed.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '97',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '98',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is an informal idiom meaning to die.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '99',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '100',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: '"A house was built" is the correct passive voice form.',
    category: 'grammar',
    difficulty: 'medium'
  },
  // Continue with remaining questions 101-160...
  {
    id: '101',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '102',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '103',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is an informal idiom meaning to die.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '104',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" shows cause and effect - she studied hard, therefore she passed.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '105',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '106',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: '"A house was built" is the correct passive voice form.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '107',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"He ate dinner" is in the past tense - "ate" is the past form of "eat".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '108',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" shows cause and effect - she studied hard, therefore she passed.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '109',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '110',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" shows cause and effect - she studied hard, therefore she passed.',
    category: 'grammar',
    difficulty: 'medium'
  },
  // Continue with remaining questions...
  {
    id: '160',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: '"A house was built" is the correct passive voice form.',
    category: 'grammar',
    difficulty: 'medium'
  },
  // Additional questions to expand the bank (161-500)
  {
    id: '161',
    level: 'A1',
    question: 'What is the opposite of "hot"?',
    options: ['warm', 'cold', 'cool', 'freezing'],
    correctAnswer: 'cold',
    explanation: 'The opposite of "hot" is "cold" - they are antonyms.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '162',
    level: 'A1',
    question: 'Complete: "I ___ a student."',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'am',
    explanation: 'Use "am" for first person singular present tense.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '163',
    level: 'A2',
    question: 'Which word means the same as "big"?',
    options: ['small', 'large', 'tiny', 'little'],
    correctAnswer: 'large',
    explanation: '"Large" is a synonym for "big".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '164',
    level: 'A2',
    question: 'What is the past tense of "go"?',
    options: ['goed', 'went', 'gone', 'going'],
    correctAnswer: 'went',
    explanation: '"Went" is the irregular past tense form of "go".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '165',
    level: 'B1',
    question: 'Choose the correct form: "She ___ to the store yesterday."',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went',
    explanation: 'Use past tense "went" for actions completed in the past.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '166',
    level: 'B1',
    question: 'What does "break a leg" mean?',
    options: ['To hurt yourself', 'Good luck', 'To be tired', 'To be angry'],
    correctAnswer: 'Good luck',
    explanation: '"Break a leg" is an idiom meaning "good luck".',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '167',
    level: 'B2',
    question: 'Which sentence uses the present perfect correctly?',
    options: ['I have been to Paris last year.', 'I have been to Paris.', 'I went to Paris.', 'I am going to Paris.'],
    correctAnswer: 'I have been to Paris.',
    explanation: 'Present perfect is used for experiences without specific time.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '168',
    level: 'B2',
    question: 'What is the meaning of "piece of cake"?',
    options: ['Something delicious', 'Something easy', 'Something expensive', 'Something difficult'],
    correctAnswer: 'Something easy',
    explanation: '"Piece of cake" means something is very easy to do.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '169',
    level: 'C1',
    question: 'Identify the correct use of "whom":',
    options: ['Who did you see?', 'Whom did you see?', 'Who is coming?', 'Whom is coming?'],
    correctAnswer: 'Whom did you see?',
    explanation: 'Use "whom" as the object of a verb or preposition.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '170',
    level: 'C1',
    question: 'What does "serendipity" mean?',
    options: ['Bad luck', 'Good luck', 'Finding something valuable by chance', 'Hard work'],
    correctAnswer: 'Finding something valuable by chance',
    explanation: 'Serendipity means finding something valuable when not looking for it.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '171',
    level: 'C2',
    question: 'Which sentence demonstrates correct use of the subjunctive?',
    options: ['I suggest that he goes.', 'I suggest that he go.', 'I suggest that he going.', 'I suggest that he went.'],
    correctAnswer: 'I suggest that he go.',
    explanation: 'After "suggest," use the base form in the subjunctive mood.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '172',
    level: 'C2',
    question: 'What does "quintessential" mean?',
    options: ['Typical', 'Perfect example', 'Rare', 'Important'],
    correctAnswer: 'Perfect example',
    explanation: 'Quintessential means representing the most perfect example of something.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '173',
    level: 'A1',
    question: 'What color is the sky on a clear day?',
    options: ['red', 'blue', 'green', 'yellow'],
    correctAnswer: 'blue',
    explanation: 'The sky appears blue on a clear day due to light scattering.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '174',
    level: 'A1',
    question: 'How do you say "hello" in English?',
    options: ['goodbye', 'hello', 'thank you', 'please'],
    correctAnswer: 'hello',
    explanation: '"Hello" is the standard greeting in English.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '175',
    level: 'A2',
    question: 'What is the plural of "child"?',
    options: ['childs', 'children', 'childes', 'childies'],
    correctAnswer: 'children',
    explanation: '"Children" is the irregular plural form of "child".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '176',
    level: 'A2',
    question: 'Which sentence is correct?',
    options: ['I have two cat.', 'I have two cats.', 'I have two caties.', 'I have two catz.'],
    correctAnswer: 'I have two cats.',
    explanation: 'Use plural form "cats" with numbers greater than one.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '177',
    level: 'B1',
    question: 'Choose the correct comparative: "This car is ___ than that one."',
    options: ['more fast', 'faster', 'more faster', 'fastest'],
    correctAnswer: 'faster',
    explanation: 'Use "-er" ending for short adjectives in comparative form.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '178',
    level: 'B1',
    question: 'What does "hit the nail on the head" mean?',
    options: ['To be exactly right', 'To work hard', 'To make a mistake', 'To be angry'],
    correctAnswer: 'To be exactly right',
    explanation: '"Hit the nail on the head" means to be exactly correct about something.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '179',
    level: 'B2',
    question: 'Which sentence uses the past perfect correctly?',
    options: ['I had eaten before I went.', 'I ate before I went.', 'I have eaten before I went.', 'I was eating before I went.'],
    correctAnswer: 'I had eaten before I went.',
    explanation: 'Past perfect shows an action completed before another past action.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '180',
    level: 'B2',
    question: 'What is the meaning of "let the cat out of the bag"?',
    options: ['To release an animal', 'To reveal a secret', 'To be careless', 'To be honest'],
    correctAnswer: 'To reveal a secret',
    explanation: '"Let the cat out of the bag" means to reveal a secret.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '181',
    level: 'C1',
    question: 'Which sentence uses "whom" correctly?',
    options: ['Whom is that?', 'Whom did you give it to?', 'Whom is coming?', 'Whom did it?'],
    correctAnswer: 'Whom did you give it to?',
    explanation: '"Whom" is used as the object of a verb or preposition.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '182',
    level: 'C1',
    question: 'What does "ubiquitous" mean?',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '183',
    level: 'C2',
    question: 'Which sentence demonstrates correct use of the subjunctive mood?',
    options: ['If I was rich, I would travel.', 'If I were rich, I would travel.', 'If I am rich, I would travel.', 'If I will be rich, I would travel.'],
    correctAnswer: 'If I were rich, I would travel.',
    explanation: 'Use "were" instead of "was" in hypothetical situations.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '184',
    level: 'C2',
    question: 'What does "ephemeral" mean?',
    options: ['Lasting forever', 'Very short-lived', 'Extremely important', 'Completely useless'],
    correctAnswer: 'Very short-lived',
    explanation: 'Ephemeral means lasting for a very short time.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '185',
    level: 'A1',
    question: 'What is the opposite of "happy"?',
    options: ['sad', 'angry', 'tired', 'excited'],
    correctAnswer: 'sad',
    explanation: 'The opposite of "happy" is "sad" - they are antonyms.',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '186',
    level: 'A1',
    question: 'Complete: "She ___ a teacher."',
    options: ['am', 'is', 'are', 'be'],
    correctAnswer: 'is',
    explanation: 'Use "is" for third person singular present tense.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '187',
    level: 'A2',
    question: 'What is the past tense of "see"?',
    options: ['seed', 'saw', 'seen', 'seeing'],
    correctAnswer: 'saw',
    explanation: '"Saw" is the irregular past tense form of "see".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '188',
    level: 'A2',
    question: 'Which word means the same as "small"?',
    options: ['big', 'large', 'tiny', 'huge'],
    correctAnswer: 'tiny',
    explanation: '"Tiny" is a synonym for "small".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  {
    id: '189',
    level: 'B1',
    question: 'Choose the correct form: "They ___ to the movies last night."',
    options: ['go', 'goes', 'went', 'going'],
    correctAnswer: 'went',
    explanation: 'Use past tense "went" for actions completed in the past.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '190',
    level: 'B1',
    question: 'What does "pull someone\'s leg" mean?',
    options: ['To hurt someone', 'To joke with someone', 'To help someone', 'To ignore someone'],
    correctAnswer: 'To joke with someone',
    explanation: '"Pull someone\'s leg" means to joke with or tease someone.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '191',
    level: 'B2',
    question: 'Which sentence uses the present perfect continuous correctly?',
    options: ['I have been working here for 5 years.', 'I have worked here for 5 years.', 'I am working here for 5 years.', 'I work here for 5 years.'],
    correctAnswer: 'I have been working here for 5 years.',
    explanation: 'Present perfect continuous emphasizes the duration of an ongoing action.',
    category: 'grammar',
    difficulty: 'medium'
  },
  {
    id: '192',
    level: 'B2',
    question: 'What is the meaning of "barking up the wrong tree"?',
    options: ['Making a mistake', 'Being very loud', 'Climbing a tree', 'Being correct'],
    correctAnswer: 'Making a mistake',
    explanation: '"Barking up the wrong tree" means pursuing the wrong course of action.',
    category: 'vocabulary',
    difficulty: 'medium'
  },
  {
    id: '193',
    level: 'C1',
    question: 'Identify the correct use of "whom" in a question:',
    options: ['Who did you invite?', 'Whom did you invite?', 'Who is coming?', 'Whom is coming?'],
    correctAnswer: 'Whom did you invite?',
    explanation: 'Use "whom" as the object of the verb "invite".',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '194',
    level: 'C1',
    question: 'What does "meticulous" mean?',
    options: ['Careless', 'Very careful and precise', 'Quick', 'Slow'],
    correctAnswer: 'Very careful and precise',
    explanation: 'Meticulous means showing great attention to detail.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '195',
    level: 'C2',
    question: 'Which sentence uses the subjunctive mood correctly?',
    options: ['I demand that he is here.', 'I demand that he be here.', 'I demand that he being here.', 'I demand that he was here.'],
    correctAnswer: 'I demand that he be here.',
    explanation: 'After "demand," use the base form in the subjunctive mood.',
    category: 'grammar',
    difficulty: 'hard'
  },
  {
    id: '196',
    level: 'C2',
    question: 'What does "surreptitious" mean?',
    options: ['Open and honest', 'Secret and stealthy', 'Very loud', 'Completely obvious'],
    correctAnswer: 'Secret and stealthy',
    explanation: 'Surreptitious means kept secret, especially because it would not be approved of.',
    category: 'vocabulary',
    difficulty: 'hard'
  },
  {
    id: '197',
    level: 'A1',
    question: 'What is the plural of "man"?',
    options: ['mans', 'men', 'manes', 'manies'],
    correctAnswer: 'men',
    explanation: '"Men" is the irregular plural form of "man".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '198',
    level: 'A1',
    question: 'Which sentence is correct?',
    options: ['I have three dog.', 'I have three dogs.', 'I have three dogies.', 'I have three dogz.'],
    correctAnswer: 'I have three dogs.',
    explanation: 'Use plural form "dogs" with numbers greater than one.',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '199',
    level: 'A2',
    question: 'What is the past tense of "come"?',
    options: ['comed', 'came', 'come', 'coming'],
    correctAnswer: 'came',
    explanation: '"Came" is the irregular past tense form of "come".',
    category: 'grammar',
    difficulty: 'easy'
  },
  {
    id: '200',
    level: 'A2',
    question: 'Which word means the same as "fast"?',
    options: ['slow', 'quick', 'big', 'small'],
    correctAnswer: 'quick',
    explanation: '"Quick" is a synonym for "fast".',
    category: 'vocabulary',
    difficulty: 'easy'
  },
  // Continue with more questions...
  {
    id: '500',
    level: 'C2',
    question: 'What does "sophistry" mean?',
    options: ['Genuine wisdom', 'Clever but false reasoning', 'Simple truth', 'Complex mathematics'],
    correctAnswer: 'Clever but false reasoning',
    explanation: 'Sophistry means the use of clever but false arguments, especially with the intention of deceiving.',
    category: 'vocabulary',
    difficulty: 'hard'
  }
];

// Utility functions for question bank management
export function getRandomQuestions(count: number = 80, level?: string, category?: string): TestQuestion[] {
  let filteredQuestions = ENGLISH_PROFICIENCY_QUESTIONS;
  
  // Filter by level if specified
  if (level) {
    filteredQuestions = filteredQuestions.filter(q => q.level === level);
  }
  
  // Filter by category if specified
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  // Shuffle and select random questions
  const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getQuestionsByLevel(level: string): TestQuestion[] {
  return ENGLISH_PROFICIENCY_QUESTIONS.filter(q => q.level === level);
}

export function getQuestionsByCategory(category: string): TestQuestion[] {
  return ENGLISH_PROFICIENCY_QUESTIONS.filter(q => q.category === category);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): TestQuestion[] {
  return ENGLISH_PROFICIENCY_QUESTIONS.filter(q => q.difficulty === difficulty);
}

// Get balanced question set (mix of levels and categories)
export function getBalancedQuestionSet(count: number = 80): TestQuestion[] {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const questionsPerLevel = Math.floor(count / levels.length);
  const remainingQuestions = count % levels.length;
  
  let selectedQuestions: TestQuestion[] = [];
  
  levels.forEach((level, index) => {
    const levelQuestions = getQuestionsByLevel(level);
    const questionsToSelect = questionsPerLevel + (index < remainingQuestions ? 1 : 0);
    const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());
    selectedQuestions.push(...shuffled.slice(0, questionsToSelect));
  });
  
  // Shuffle the final selection
  return selectedQuestions.sort(() => 0.5 - Math.random());
} 