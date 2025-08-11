'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  Award,
  Zap,
  Star,
  Flame,
  Sparkles,
  Lightbulb,
  Bookmark,
  Flag,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  CheckSquare,
  Square
} from 'lucide-react';
import { LanguageProficiencyService, TestQuestion as ServiceTestQuestion } from '@/lib/services/language-proficiency-service';
import { FRENCH_PROFICIENCY_QUESTIONS, getBalancedQuestionSet as getFrenchBalancedQuestionSet } from '@/lib/data/french-proficiency-questions';

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
  timeLimit?: number; // in minutes, default 60
}

// CEFR Level descriptions with enhanced styling
const CEFR_DESCRIPTIONS = {
  'A1': 'You are a beginner learner. You can understand and use familiar everyday expressions and very basic phrases. Focus on building basic vocabulary and simple sentence structures.',
  'A2': 'You are an elementary learner. You can communicate in simple and routine tasks requiring a simple exchange of information. Continue practicing basic grammar and expanding your vocabulary.',
  'B1': 'You are an intermediate learner. You can deal with most situations likely to arise while traveling. Work on more complex grammar structures and idiomatic expressions.',
  'B2': 'You are an upper-intermediate learner. You can interact with a degree of fluency and spontaneity. Focus on advanced vocabulary and nuanced language use.',
  'C1': 'You are an advanced learner. You can express ideas fluently and spontaneously without much searching for expressions. Continue refining your language skills.',
  'C2': 'You are a proficient learner. You can understand with ease virtually everything heard or read. You can express yourself very fluently and precisely.'
};

const CEFR_COLORS = {
  'A1': 'bg-red-100 text-red-800 border-red-200',
  'A2': 'bg-orange-100 text-orange-800 border-orange-200',
  'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'B2': 'bg-blue-100 text-blue-800 border-blue-200',
  'C1': 'bg-purple-100 text-purple-800 border-purple-200',
  'C2': 'bg-green-100 text-green-800 border-green-200'
};

export function EnhancedLanguageProficiencyTestInterface({ 
  onComplete, 
  onExit, 
  language = 'en',
  timeLimit = 60 
}: LanguageProficiencyTestInterfaceProps) {
  const { data: session } = useSession();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  const [isPaused, setIsPaused] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [questions, setQuestions] = useState<ServiceTestQuestion[]>([]);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [timePerQuestion, setTimePerQuestion] = useState<number[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentQuestion = questions[currentQuestionIndex];

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
        } else if (language === 'es') {
          // Use Spanish questions
          const { getBalancedQuestionSet } = await import('@/lib/data/spanish-proficiency-questions');
          const spanishQuestions = getBalancedQuestionSet(80);
          staticQuestions = spanishQuestions.map(q => ({
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

  // Enhanced timer effect with warnings
  useEffect(() => {
    if (isPaused || isCompleted) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = prev - 1;
        
        // Show warning when 10 minutes remaining
        if (newTime === 600) {
          setShowTimeWarning(true);
          toast.warning('⚠️ 10 minutes remaining!', {
            duration: 5000,
            action: {
              label: 'Dismiss',
              onClick: () => setShowTimeWarning(false)
            }
          });
        }
        
        // Show critical warning when 5 minutes remaining
        if (newTime === 300) {
          toast.error('🚨 5 minutes remaining! Please submit your test soon.', {
            duration: 8000
          });
        }
        
        // Auto-submit when time runs out
        if (newTime <= 0) {
          handleSubmit();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, isCompleted]);

  // Track time per question
  useEffect(() => {
    if (currentQuestion && isStarted && !isCompleted) {
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, isStarted, isCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number) => {
    if (seconds <= 300) return 'text-red-600'; // 5 minutes
    if (seconds <= 600) return 'text-orange-600'; // 10 minutes
    if (seconds <= 1800) return 'text-yellow-600'; // 30 minutes
    return 'text-green-600';
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      // Record time spent on current question
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = timeSpent;
        return newTimes;
      });
      
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Record time spent on current question
      const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
      setTimePerQuestion(prev => {
        const newTimes = [...prev];
        newTimes[currentQuestionIndex] = timeSpent;
        return newTimes;
      });
      
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleBookmark = (questionIndex: number) => {
    setBookmarkedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      toast.error(`Please answer all questions before submitting. You have ${unanswered} unanswered questions.`);
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
          timeSpent: timeLimit * 60 - timeRemaining
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
    const isBookmarked = bookmarkedQuestions.has(currentQuestionIndex);

    return (
      <Card className="w-full shadow-lg border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg md:text-xl font-bold text-gray-800">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleBookmark(currentQuestionIndex)}
                className={`p-1 h-8 w-8 ${isBookmarked ? 'text-yellow-600' : 'text-gray-400'}`}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${CEFR_COLORS[question.level as keyof typeof CEFR_COLORS]} font-semibold`}>
                {question.level}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium">
                <Target className="h-3 w-3 mr-1" />
                {question.category}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="prose max-w-none">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">{currentQuestionIndex + 1}</span>
              </div>
              <p className="text-base md:text-lg leading-relaxed text-gray-800 font-medium">
                {question.question}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = isCompleted && option === question.correctAnswer;
              const isIncorrect = isCompleted && isSelected && option !== question.correctAnswer;
              
              return (
                <div 
                  key={index} 
                  className={`flex items-start space-x-3 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer hover:shadow-md ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  } ${
                    isCompleted && isCorrect ? 'border-green-500 bg-green-50' : ''
                  } ${
                    isCompleted && isIncorrect ? 'border-red-500 bg-red-50' : ''
                  }`}
                  onClick={() => !isCompleted && handleAnswerChange(question.id, option)}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5">
                    {isSelected ? (
                      <CheckSquare className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Square className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <label className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed font-medium">
                    {option}
                  </label>
                  {isCompleted && isCorrect && (
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  )}
                  {isCompleted && isIncorrect && (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {isCompleted && question.explanation && (
            <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
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

    const averageTimePerQuestion = timePerQuestion.length > 0 
      ? Math.round(timePerQuestion.reduce((a, b) => a + b, 0) / timePerQuestion.length)
      : 0;

    return (
      <div className="space-y-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Award className="h-20 w-20 text-yellow-500" />
                <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</CardTitle>
            <p className="text-lg text-gray-600">Congratulations on completing your language proficiency test</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Score Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-md border">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {score}/80
                </div>
                <div className="text-sm text-gray-600 font-medium">Total Score</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md border">
                <div className={`text-4xl font-bold mb-2 ${CEFR_COLORS[level as keyof typeof CEFR_COLORS].split(' ')[1]}`}>
                  {level}
                </div>
                <div className="text-sm text-gray-600 font-medium">CEFR Level</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md border">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {Math.round((score / 80) * 100)}%
                </div>
                <div className="text-sm text-gray-600 font-medium">Percentage</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md border">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {formatTime(timeLimit * 60 - timeRemaining)}
                </div>
                <div className="text-sm text-gray-600 font-medium">Time Used</div>
              </div>
            </div>

            {/* Level Description */}
            <div className="p-6 bg-white rounded-xl shadow-md border">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Level: {level}
              </h3>
              <p className="text-gray-700 leading-relaxed">{CEFR_DESCRIPTIONS[level as keyof typeof CEFR_DESCRIPTIONS]}</p>
            </div>

            {/* Question Breakdown */}
            <div className="p-6 bg-white rounded-xl shadow-md border">
              <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Performance Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(cefrLevel => {
                  const levelQuestions = questions.filter(q => q.level === cefrLevel);
                  const levelCorrect = levelQuestions.filter(q => answers[q.id] === q.correctAnswer).length;
                  const levelPercentage = levelQuestions.length > 0 ? Math.round((levelCorrect / levelQuestions.length) * 100) : 0;
                  
                  return (
                    <div key={cefrLevel} className="text-center p-4 border rounded-lg bg-gray-50">
                      <div className={`text-lg font-bold mb-1 ${CEFR_COLORS[cefrLevel as keyof typeof CEFR_COLORS].split(' ')[1]}`}>
                        {cefrLevel}
                      </div>
                      <div className="text-sm text-gray-600">{levelCorrect}/{levelQuestions.length}</div>
                      <div className="text-xs text-gray-500 font-medium">{levelPercentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button 
                variant="outline" 
                onClick={onExit}
                className="px-8 py-3 text-lg font-semibold"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
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
      {/* Enhanced Header with timer */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Timer className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {language === 'en' ? 'English' : 
                   language === 'fr' ? 'French' :
                   language === 'es' ? 'Spanish' :
                   language === 'de' ? 'German' :
                   language === 'it' ? 'Italian' :
                   language === 'pt' ? 'Portuguese' :
                   language === 'ru' ? 'Russian' :
                   language === 'zh' ? 'Chinese' :
                   language === 'ja' ? 'Japanese' :
                   language === 'ko' ? 'Korean' : 'Language'} Proficiency Test
                </h2>
                <p className="text-blue-100 text-sm">CEFR Aligned Assessment</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-right">
                <div className={`font-mono text-xl font-bold ${getTimeColor(timeRemaining)}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-blue-100 text-xs">Time Remaining</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExitDialog(true)}
              className="bg-red-500/20 border-red-300 text-white hover:bg-red-500/30"
            >
              Exit Test
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Progress indicator */}
      <div className="bg-white rounded-xl p-4 shadow-md border">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-gray-700">Progress</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {Object.keys(answers).length} of {questions.length} answered
            </span>
            <span className="text-sm font-semibold text-gray-800">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
        </div>
        <Progress 
          value={((currentQuestionIndex + 1) / questions.length) * 100} 
          className="h-3 bg-gray-200"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Start</span>
          <span>Finish</span>
        </div>
      </div>

      {/* Time Warning Alert */}
      {showTimeWarning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Time Warning:</strong> You have less than 10 minutes remaining. Please review your answers and submit your test soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Current question */}
      {currentQuestion && renderQuestion(currentQuestion)}

      {/* Enhanced Navigation */}
      <div className="bg-white rounded-xl p-4 shadow-md border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 font-semibold"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-600 hidden sm:block">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          
          <div className="flex space-x-3">
            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="px-8 py-3 font-semibold bg-blue-600 hover:bg-blue-700"
              >
                Next Question
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < questions.length}
                className="px-8 py-3 font-semibold bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Test
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Exit Test?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to exit the test? Your progress will be lost and you'll need to start over.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onExit}>
              Exit Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 