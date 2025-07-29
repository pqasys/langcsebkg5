'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Send,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Target,
  Trophy,
  Timer,
  Brain,
  Award
} from 'lucide-react';

interface TestQuestion {
  id: string;
  level: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface TestResult {
  score: number;
  level: string;
  description: string;
  emailSent: boolean;
}

interface LanguageProficiencyTestInterfaceProps {
  onComplete: (results: TestResult) => void;
  onExit: () => void;
  language?: string;
}

// CEFR Level descriptions
const CEFR_DESCRIPTIONS = {
  'A1': 'You are a beginner learner. You can understand and use familiar everyday expressions and very basic phrases. Focus on building basic vocabulary and simple sentence structures.',
  'A2': 'You are an elementary learner. You can communicate in simple and routine tasks requiring a simple exchange of information. Continue practicing basic grammar and expanding your vocabulary.',
  'B1': 'You are an intermediate learner. You can deal with most situations likely to arise while traveling. Work on more complex grammar structures and idiomatic expressions.',
  'B2': 'You are an upper-intermediate learner. You can interact with a degree of fluency and spontaneity. Focus on advanced vocabulary and nuanced language use.',
  'C1': 'You are an advanced learner. You can express ideas fluently and spontaneously without much searching for expressions. Continue refining your language skills.',
  'C2': 'You are a proficient learner. You can understand with ease virtually everything heard or read. You can express yourself very fluently and precisely.'
};

// Test questions data - All 80 questions organized by CEFR level
const TEST_QUESTIONS: TestQuestion[] = [
  // A1 Level Questions (Beginner)
  {
    id: '1',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.'
  },
  {
    id: '2',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".'
  },
  {
    id: '3',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.'
  },
  {
    id: '4',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".'
  },
  {
    id: '5',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.'
  },
  {
    id: '6',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".'
  },
  {
    id: '7',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.'
  },
  {
    id: '8',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".'
  },
  {
    id: '9',
    level: 'A1',
    question: 'What is the plural of "book"?',
    options: ['bookes', 'books', 'bookies', 'bookz'],
    correctAnswer: 'books',
    explanation: 'The plural of "book" is "books" - simply add "s" to make it plural.'
  },
  {
    id: '10',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['She are happy.', 'She is happy.', 'She happy is.', 'Is she happy.'],
    correctAnswer: 'She is happy.',
    explanation: 'The correct form is "She is happy" - third person singular uses "is".'
  },

  // A2 Level Questions (Elementary)
  {
    id: '11',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'In English, questions with "do" follow the pattern: Do + subject + verb + object?'
  },
  {
    id: '12',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"Ate" is the past tense form of "eat".'
  },
  {
    id: '13',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'In English, questions with "do" follow the pattern: Do + subject + verb + object?'
  },
  {
    id: '14',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"Ate" is the past tense form of "eat".'
  },
  {
    id: '15',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'In English, questions with "do" follow the pattern: Do + subject + verb + object?'
  },
  {
    id: '16',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"Ate" is the past tense form of "eat".'
  },
  {
    id: '17',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'In English, questions with "do" follow the pattern: Do + subject + verb + object?'
  },
  {
    id: '18',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"Ate" is the past tense form of "eat".'
  },
  {
    id: '19',
    level: 'A2',
    question: 'Choose the correct question form.',
    options: ['You like pizza?', 'Do you like pizza?', 'Like you pizza?', 'Do pizza you like?'],
    correctAnswer: 'Do you like pizza?',
    explanation: 'In English, questions with "do" follow the pattern: Do + subject + verb + object?'
  },
  {
    id: '20',
    level: 'A2',
    question: 'Which sentence is in the past tense?',
    options: ['He eat dinner.', 'He is eating dinner.', 'He ate dinner.', 'He will eat dinner.'],
    correctAnswer: 'He ate dinner.',
    explanation: '"Ate" is the past tense form of "eat".'
  },

  // B1 Level Questions (Intermediate)
  {
    id: '21',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" is used to show a result or consequence. The studying led to passing the exam.'
  },
  {
    id: '22',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: 'The passive voice uses "was built" - the object becomes the subject.'
  },
  {
    id: '23',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" is used to show a result or consequence. The studying led to passing the exam.'
  },
  {
    id: '24',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: 'The passive voice uses "was built" - the object becomes the subject.'
  },
  {
    id: '25',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" is used to show a result or consequence. The studying led to passing the exam.'
  },
  {
    id: '26',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: 'The passive voice uses "was built" - the object becomes the subject.'
  },
  {
    id: '27',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" is used to show a result or consequence. The studying led to passing the exam.'
  },
  {
    id: '28',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: 'The passive voice uses "was built" - the object becomes the subject.'
  },
  {
    id: '29',
    level: 'B1',
    question: 'Choose the best connector: "She studied hard, ___ she passed the exam."',
    options: ['but', 'so', 'because', 'although'],
    correctAnswer: 'so',
    explanation: '"So" is used to show a result or consequence. The studying led to passing the exam.'
  },
  {
    id: '30',
    level: 'B1',
    question: 'Identify the correct passive sentence.',
    options: ['They build a house.', 'A house was built.', 'They was building a house.', 'House is build.'],
    correctAnswer: 'A house was built.',
    explanation: 'The passive voice uses "was built" - the object becomes the subject.'
  },

  // B2 Level Questions (Upper Intermediate)
  {
    id: '31',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is a colloquial idiom meaning to die.'
  },
  {
    id: '32',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense: "am" becomes "was".'
  },
  {
    id: '33',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is a colloquial idiom meaning to die.'
  },
  {
    id: '34',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense: "am" becomes "was".'
  },
  {
    id: '35',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is a colloquial idiom meaning to die.'
  },
  {
    id: '36',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense: "am" becomes "was".'
  },
  {
    id: '37',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is a colloquial idiom meaning to die.'
  },
  {
    id: '38',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense: "am" becomes "was".'
  },
  {
    id: '39',
    level: 'B2',
    question: 'What is the meaning of the idiom "kick the bucket"?',
    options: ['Start something new', 'Break something', 'Die', 'Be happy'],
    correctAnswer: 'Die',
    explanation: '"Kick the bucket" is a colloquial idiom meaning to die.'
  },
  {
    id: '40',
    level: 'B2',
    question: 'Choose the correct reported speech: "I am tired," she said.',
    options: ['She said she is tired.', 'She said she was tired.', 'She says she tired.', 'She said tired.'],
    correctAnswer: 'She said she was tired.',
    explanation: 'In reported speech, present tense becomes past tense: "am" becomes "was".'
  },

  // C1 Level Questions (Advanced)
  {
    id: '41',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere - synonymous with widespread.'
  },
  {
    id: '42',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, we use present tense in the "if" clause and future in the main clause.'
  },
  {
    id: '43',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere - synonymous with widespread.'
  },
  {
    id: '44',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, we use present tense in the "if" clause and future in the main clause.'
  },
  {
    id: '45',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere - synonymous with widespread.'
  },
  {
    id: '46',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, we use present tense in the "if" clause and future in the main clause.'
  },
  {
    id: '47',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere - synonymous with widespread.'
  },
  {
    id: '48',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, we use present tense in the "if" clause and future in the main clause.'
  },
  {
    id: '49',
    level: 'C1',
    question: 'Identify the word closest in meaning to "ubiquitous".',
    options: ['Rare', 'Widespread', 'Temporary', 'Unreliable'],
    correctAnswer: 'Widespread',
    explanation: 'Ubiquitous means present, appearing, or found everywhere - synonymous with widespread.'
  },
  {
    id: '50',
    level: 'C1',
    question: 'Choose the correct sentence with a conditional clause.',
    options: ['If he will come, we will start.', 'If he comes, we will start.', 'We start if he comes.', 'He come, we start.'],
    correctAnswer: 'If he comes, we will start.',
    explanation: 'In conditional sentences, we use present tense in the "if" clause and future in the main clause.'
  },

  // C2 Level Questions (Proficient)
  {
    id: '51',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.'
  },
  {
    id: '52',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.'
  },
  {
    id: '53',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.'
  },
  {
    id: '54',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.'
  },
  {
    id: '55',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.'
  },
  {
    id: '56',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.'
  },
  {
    id: '57',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.'
  },
  {
    id: '58',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.'
  },
  {
    id: '59',
    level: 'C2',
    question: 'What does the phrase "a Pyrrhic victory" mean?',
    options: ['A total defeat', 'A victory won at too great a cost', 'An easy win', 'A controversial result'],
    correctAnswer: 'A victory won at too great a cost',
    explanation: 'A Pyrrhic victory is a victory that inflicts such a devastating toll on the victor that it is tantamount to defeat.'
  },
  {
    id: '60',
    level: 'C2',
    question: 'Which of the following is a correct usage of a subjunctive mood?',
    options: ['If I was you, I would go.', 'If I were you, I would go.', 'If I am you, I would go.', 'If I will be you, I go.'],
    correctAnswer: 'If I were you, I would go.',
    explanation: 'The subjunctive mood uses "were" instead of "was" in hypothetical situations.'
  },

  // Additional questions to reach 80 total
  {
    id: '61',
    level: 'A1',
    question: 'What is the plural of "cat"?',
    options: ['cats', 'cates', 'caties', 'catz'],
    correctAnswer: 'cats',
    explanation: 'The plural of "cat" is "cats" - simply add "s" to make it plural.'
  },
  {
    id: '62',
    level: 'A1',
    question: 'Choose the correct sentence.',
    options: ['I am student.', 'I is student.', 'I are student.', 'I am a student.'],
    correctAnswer: 'I am a student.',
    explanation: 'The correct form is "I am a student" - use "a" before singular countable nouns.'
  },
  {
    id: '63',
    level: 'A2',
    question: 'Which word is a color?',
    options: ['happy', 'blue', 'fast', 'big'],
    correctAnswer: 'blue',
    explanation: '"Blue" is a color, while the others are adjectives describing different qualities.'
  },
  {
    id: '64',
    level: 'A2',
    question: 'Complete the sentence: "I ___ to school every day."',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 'go',
    explanation: 'Use "go" for first person singular present tense.'
  },
  {
    id: '65',
    level: 'B1',
    question: 'Choose the correct form: "She ___ English for five years."',
    options: ['study', 'studies', 'has studied', 'is studying'],
    correctAnswer: 'has studied',
    explanation: 'Use present perfect for actions that started in the past and continue to the present.'
  },
  {
    id: '66',
    level: 'B1',
    question: 'Which sentence uses the present continuous correctly?',
    options: ['I am work now.', 'I am working now.', 'I working now.', 'I work now.'],
    correctAnswer: 'I am working now.',
    explanation: 'Present continuous uses "am/is/are + verb-ing" for actions happening now.'
  },
  {
    id: '67',
    level: 'B2',
    question: 'What does "break the ice" mean?',
    options: ['To start a conversation', 'To break something', 'To be cold', 'To be angry'],
    correctAnswer: 'To start a conversation',
    explanation: '"Break the ice" means to start a conversation in a social situation.'
  },
  {
    id: '68',
    level: 'B2',
    question: 'Choose the correct comparative form: "This book is ___ than that one."',
    options: ['more interesting', 'most interesting', 'interestinger', 'more interest'],
    correctAnswer: 'more interesting',
    explanation: 'Use "more + adjective" for adjectives with more than two syllables.'
  },
  {
    id: '69',
    level: 'C1',
    question: 'What is the meaning of "serendipity"?',
    options: ['Bad luck', 'Good luck', 'Finding something valuable by chance', 'Hard work'],
    correctAnswer: 'Finding something valuable by chance',
    explanation: 'Serendipity means finding something valuable or pleasant when not looking for it.'
  },
  {
    id: '70',
    level: 'C1',
    question: 'Which sentence uses the subjunctive mood correctly?',
    options: ['I suggest that he goes.', 'I suggest that he go.', 'I suggest that he going.', 'I suggest that he went.'],
    correctAnswer: 'I suggest that he go.',
    explanation: 'After "suggest," use the base form of the verb in the subjunctive mood.'
  },
  {
    id: '71',
    level: 'C2',
    question: 'What does "quintessential" mean?',
    options: ['Typical', 'Perfect example', 'Rare', 'Important'],
    correctAnswer: 'Perfect example',
    explanation: 'Quintessential means representing the most perfect or typical example of a quality or class.'
  },
  {
    id: '72',
    level: 'C2',
    question: 'Which sentence demonstrates correct use of the past perfect?',
    options: ['I had eaten before I went.', 'I ate before I went.', 'I have eaten before I went.', 'I was eating before I went.'],
    correctAnswer: 'I had eaten before I went.',
    explanation: 'Past perfect (had + past participle) shows an action completed before another past action.'
  },
  {
    id: '73',
    level: 'A1',
    question: 'What is the opposite of "big"?',
    options: ['small', 'tall', 'long', 'wide'],
    correctAnswer: 'small',
    explanation: 'The opposite of "big" is "small" - they are antonyms.'
  },
  {
    id: '74',
    level: 'A1',
    question: 'Complete: "This is ___ apple."',
    options: ['a', 'an', 'the', 'some'],
    correctAnswer: 'an',
    explanation: 'Use "an" before words that begin with a vowel sound.'
  },
  {
    id: '75',
    level: 'A2',
    question: 'Which is correct: "I ___ my homework yesterday."',
    options: ['do', 'did', 'done', 'doing'],
    correctAnswer: 'did',
    explanation: 'Use "did" (past tense) for actions completed in the past.'
  },
  {
    id: '76',
    level: 'A2',
    question: 'What is the question form of "She likes coffee"?',
    options: ['Do she like coffee?', 'Does she like coffee?', 'Is she like coffee?', 'She like coffee?'],
    correctAnswer: 'Does she like coffee?',
    explanation: 'For third person singular, use "does" + base form of the verb.'
  },
  {
    id: '77',
    level: 'B1',
    question: 'Choose the correct modal: "You ___ study hard to pass the exam."',
    options: ['can', 'must', 'might', 'would'],
    correctAnswer: 'must',
    explanation: '"Must" expresses necessity or obligation.'
  },
  {
    id: '78',
    level: 'B1',
    question: 'What does "look up to" mean?',
    options: ['To search for', 'To admire', 'To look above', 'To find'],
    correctAnswer: 'To admire',
    explanation: '"Look up to" means to admire or respect someone.'
  },
  {
    id: '79',
    level: 'B2',
    question: 'Which sentence uses the passive voice correctly?',
    options: ['The letter was written by John.', 'The letter wrote by John.', 'The letter is writing by John.', 'The letter writes by John.'],
    correctAnswer: 'The letter was written by John.',
    explanation: 'Passive voice uses "be + past participle" with the agent introduced by "by".'
  },
  {
    id: '80',
    level: 'B2',
    question: 'What is the meaning of "hit the nail on the head"?',
    options: ['To be exactly right', 'To work hard', 'To make a mistake', 'To be angry'],
    correctAnswer: 'To be exactly right',
    explanation: '"Hit the nail on the head" means to be exactly right about something.'
  }
];

export function LanguageProficiencyTestInterface({ onComplete, onExit, language = 'en' }: LanguageProficiencyTestInterfaceProps) {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const questions = TEST_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (isPaused || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isSubmitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setLoading(true);
    setIsSubmitted(true);

    try {
      // Calculate score
      let correctAnswers = 0;
      questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });

      const score = correctAnswers;
      const percentage = (score / questions.length) * 80; // Scale to 80 points

      // Determine CEFR level
      let level = 'A1';
      if (percentage >= 71) level = 'C2';
      else if (percentage >= 56) level = 'C1';
      else if (percentage >= 41) level = 'B2';
      else if (percentage >= 26) level = 'B1';
      else if (percentage >= 11) level = 'A2';

      const results: TestResult = {
        score: Math.round(percentage),
        level,
        description: CEFR_DESCRIPTIONS[level as keyof typeof CEFR_DESCRIPTIONS],
        emailSent: false
      };

      // Save test attempt
      await fetch('/api/language-proficiency-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.id,
          score: results.score,
          level: results.level,
          answers,
          timeSpent: 60 * 60 - timeRemaining
        })
      });

      setShowResults(true);
      onComplete(results);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: TestQuestion) => {
    const selectedAnswer = answers[question.id] || '';

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-base md:text-lg">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {question.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Multiple Choice
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-sm md:text-base leading-relaxed">{question.question}</p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <input
                  type="radio"
                  id={`q${question.id}-option-${index}`}
                  name={`question-${question.id}`}
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  disabled={isSubmitted}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <label htmlFor={`q${question.id}-option-${index}`} className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed">
                  {option}
                </label>
              </div>
            ))}
          </div>

          {isSubmitted && question.explanation && (
            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>Explanation:</strong> {question.explanation}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 80);
    let level = 'A1';
    if (score >= 71) level = 'C2';
    else if (score >= 56) level = 'C1';
    else if (score >= 41) level = 'B2';
    else if (score >= 26) level = 'B1';
    else if (score >= 11) level = 'A2';

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Award className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl">Test Complete!</CardTitle>
            <p className="text-muted-foreground">Here are your results</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {score}/80
                </div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {level}
                </div>
                <div className="text-sm text-gray-600">CEFR Level</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round((score / 80) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Percentage</div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Your Level: {level}</h3>
              <p className="text-gray-700">{CEFR_DESCRIPTIONS[level as keyof typeof CEFR_DESCRIPTIONS]}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Question Breakdown:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(cefrLevel => {
                  const levelQuestions = questions.filter(q => q.level === cefrLevel);
                  const levelCorrect = levelQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
                  const levelPercentage = levelQuestions.length > 0 ? Math.round((levelCorrect / levelQuestions.length) * 100) : 0;
                  
                  return (
                    <div key={cefrLevel} className="text-center p-3 border rounded-lg">
                      <div className="text-lg font-semibold">{cefrLevel}</div>
                      <div className="text-sm text-gray-600">{levelCorrect}/{levelQuestions.length}</div>
                      <div className="text-xs text-gray-500">{levelPercentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={onExit}>
                Back to Test Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (showResults) {
    return renderResults();
  }

  return (
    <div className="space-y-6">
      {/* Header with timer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span className="font-medium text-sm md:text-base">
              {language === 'en' ? 'English' : 
               language === 'es' ? 'Spanish' :
               language === 'fr' ? 'French' :
               language === 'de' ? 'German' :
               language === 'it' ? 'Italian' :
               language === 'pt' ? 'Portuguese' :
               language === 'ru' ? 'Russian' :
               language === 'zh' ? 'Chinese' :
               language === 'ja' ? 'Japanese' :
               language === 'ko' ? 'Korean' : 'Language'} Proficiency Test
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm md:text-base">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            className="h-8 px-3 text-xs"
          >
            {isPaused ? <Play className="h-3 w-3 mr-1" /> : <Pause className="h-3 w-3 mr-1" />}
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
      </div>

      {/* Current question */}
      {currentQuestion && renderQuestion(currentQuestion)}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={onExit}
          className="w-full sm:w-auto h-10"
        >
          Exit Test
        </Button>
        
        <div className="flex space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto h-10"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className="w-full sm:w-auto h-10"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length || loading}
              className="w-full sm:w-auto h-10"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}