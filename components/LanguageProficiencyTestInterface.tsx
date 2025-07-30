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
import { TestQuestion, getBalancedQuestionSet, getRandomQuestions } from '@/lib/data/english-proficiency-questions';
import { FRENCH_PROFICIENCY_QUESTIONS, getBalancedQuestionSet as getFrenchBalancedQuestionSet } from '@/lib/data/french-proficiency-questions';
import { LanguageProficiencyService, TestQuestion as ServiceTestQuestion } from '@/lib/services/language-proficiency-service';

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

export function LanguageProficiencyTestInterface({ onComplete, onExit, language = 'en' }: LanguageProficiencyTestInterfaceProps) {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes
  const [isPaused, setIsPaused] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [questions, setQuestions] = useState<ServiceTestQuestion[]>([]);

  // Initialize questions when component mounts
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Try to get questions from database first, fallback to static questions
        const selectedQuestions = await LanguageProficiencyService.getBalancedQuestionSet(language, 80);
        setQuestions(selectedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to static questions based on language
        let staticQuestions: ServiceTestQuestion[] = [];
        
        if (language === 'fr') {
          // Use French questions
          const frenchQuestions = getFrenchBalancedQuestionSet(80);
          staticQuestions = frenchQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            level: q.level,
            category: q.category,
            difficulty: q.difficulty
          }));
        } else {
          // Default to English questions
          const { getBalancedQuestionSet } = await import('@/lib/data/english-proficiency-questions');
          const englishQuestions = getBalancedQuestionSet(80);
          staticQuestions = englishQuestions.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            level: q.level,
            category: q.category,
            difficulty: q.difficulty
          }));
        }
        
        setQuestions(staticQuestions);
      }
    };

    loadQuestions();
  }, [language]);

  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (isPaused || isCompleted) return;

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
  }, [isPaused, isCompleted]);

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

    setIsCompleted(true);

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

      // Save test attempt using the service
      if (session?.user?.id) {
        await LanguageProficiencyService.saveTestAttempt({
          userId: session.user.id,
          languageCode: language,
          score: results.score,
          level: results.level,
          answers,
          timeSpent: 60 * 60 - timeRemaining
        });
      }

      onComplete(results);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Failed to submit test. Please try again.');
    }
  };

  const renderQuestion = (question: ServiceTestQuestion) => {
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
                  disabled={isCompleted}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <label htmlFor={`q${question.id}-option-${index}`} className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed">
                  {option}
                </label>
              </div>
            ))}
          </div>

          {isCompleted && question.explanation && (
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

  if (isCompleted) {
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
              disabled={Object.keys(answers).length < questions.length}
              className="w-full sm:w-auto h-10"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}