'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Timer
} from 'lucide-react';

interface QuizQuestion {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_IN_BLANK' | 'SHORT_ANSWER' | 'MATCHING' | 'ESSAY' | 'DRAG_AND_DROP' | 'HOTSPOT';
  question: string;
  options?: string[];
  correct_answer?: string;
  points: number;
  explanation?: string;
  hints?: string;
  order_index: number;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  time_limit?: number;
  mediaUrl?: string | null;
  quiz_type: string;
  difficulty: string;
  instructions?: string;
  allow_retry: boolean;
  max_attempts: number;
  show_results: boolean;
  show_explanations: boolean;
  quizQuestions: QuizQuestion[];
}

interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  startedAt: string;
  completedAt?: string;
  score?: number;
  maxScore?: number;
  percentage?: number;
  timeSpent: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  attemptNumber: number;
}

interface QuizInterfaceProps {
  quiz: Quiz;
  moduleId: string;
  courseId: string;
  onComplete: (result: unknown) => void;
  onClose: () => void;
}

export function QuizInterface({ quiz, moduleId, courseId, onComplete, onClose }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit ? quiz.time_limit * 60 : 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [startAttemptCalledRef, setStartAttemptCalledRef] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const questions = quiz.quizQuestions;
  const currentQuestion = questions[currentQuestionIndex];

  // Debug: Log quiz data on component mount
  useEffect(() => {
    // console.log('Quiz data:', {
    //   quizId: quiz.id,
    //   title: quiz.title,
    //   totalQuestions: questions.length,
    //   questions: questions.map((q, index) => ({
    //     index,
    //     id: q.id,
    //     type: q.type,
    //     question: q.question.substring(0, 50) + '...',
    //     options: q.options,
    //     hasOptions: Array.isArray(q.options),
    //     optionsLength: Array.isArray(q.options) ? q.options.length : 0
    //   }))
    // });
  }, [quiz, questions]);

  // Debug: Log current question when it changes
  useEffect(() => {
    console.log('Current question changed:', {
      index: currentQuestionIndex,
      question: currentQuestion,
      type: currentQuestion?.type,
      options: currentQuestion?.options,
      hasOptions: Array.isArray(currentQuestion?.options)
    });
  }, [currentQuestionIndex, currentQuestion]);

  // Timer effect
  useEffect(() => {
    if (!quiz.time_limit || isPaused || isSubmitted) return;

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
  }, [quiz.time_limit, isPaused, isSubmitted]);

  // Start quiz attempt - only once
  useEffect(() => {
    if (!startAttemptCalledRef && !attempt && !loading && !error) {
      console.log('=== QUIZ INTERFACE: Starting quiz attempt ===');
      setStartAttemptCalledRef(true);
      startQuizAttempt();
    }
  }, [attempt, loading, error]);

  const startQuizAttempt = async () => {
    if (loading || attempt || startAttemptCalledRef) {
      console.log('Start attempt called but already loading, has attempt, or already called:', { 
        loading, 
        hasAttempt: !!attempt, 
        alreadyCalled: startAttemptCalledRef 
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('=== QUIZ INTERFACE: Making API call to start quiz ===');
      console.log('Starting quiz attempt for:', { courseId, moduleId, quizId: quiz.id });
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const fetchPromise = fetch(`/api/student/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

      console.log('Quiz start response status:', response.status);

      if (response.ok) {
        const attemptData = await response.json();
        console.log('Quiz attempt started successfully:', attemptData);
        setAttempt(attemptData);
      } else {
        const errorText = await response.text();
        toast.error('Failed to start quiz:');
        setError(`Failed to start quiz: ${errorText}`);
        toast.error(`Failed to start quiz: ${errorText}`);
        // Reset the ref if the call failed so we can retry
        setStartAttemptCalledRef(false);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to starting quiz. Please try again or contact support if the problem persists.');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Failed to start quiz: ${errorMessage}`);
      toast.error('Failed to start quiz');
      // Reset the ref if the call failed so we can retry
      setStartAttemptCalledRef(false);
    } finally {
      setLoading(false);
    }
  };

  const retryStartAttempt = () => {
    setError(null);
    setStartAttemptCalledRef(false);
    startQuizAttempt();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: unknown) => {
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
    if (!attempt) {
      toast.error('No attempt available for submission');
      toast.error('No quiz attempt available');
      return;
    }

    if (loading) {
      console.log('Submit called but already loading');
      return;
    }

    try {
      setLoading(true);
      console.log('=== QUIZ INTERFACE: Submitting quiz ===');
      console.log('Attempt ID:', attempt.id);
      console.log('Answers:', answers);
      
      const response = await fetch(`/api/student/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers,
          timeSpent: quiz.time_limit ? (quiz.time_limit * 60) - timeRemaining : 0
        })
      });

      console.log('Quiz submit response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Quiz submitted successfully:', result);
        setIsSubmitted(true);
        setShowResults(true);
        onComplete(result);
        toast.success('Quiz submitted successfully!');
      } else {
        const errorText = await response.text();
        toast.error('Failed to submit quiz:');
        toast.error(`Failed to submit quiz: ${errorText}`);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to submitting quiz. Please try again or contact support if the problem persists.');
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: QuizQuestion) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [textAnswer, setTextAnswer] = useState<string>('');

    useEffect(() => {
      setSelectedAnswer(answers[question.id] || '');
      setTextAnswer(answers[question.id] || '');
    }, [question.id, answers]);

    const handleLocalAnswerChange = (answer: string) => {
      setSelectedAnswer(answer);
      setTextAnswer(answer);
      handleAnswerChange(question.id, answer);
    };

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <CardTitle className="text-base md:text-lg">
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {question.type.replace('_', ' ')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {question.points} pts
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-sm md:text-base leading-relaxed">{question.question}</p>
          </div>

          {/* Question-specific input */}
          {question.type === 'MULTIPLE_CHOICE' && question.options && (
            <div className="space-y-3">
              {question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <input
                    type="radio"
                    id={`q${question.id}-option-${index}`}
                    name={`question-${question.id}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => handleLocalAnswerChange(e.target.value)}
                    disabled={isSubmitted}
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                  />
                  <label htmlFor={`q${question.id}-option-${index}`} className="flex-1 cursor-pointer text-sm md:text-base leading-relaxed">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'TRUE_FALSE' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors flex-1">
                <input
                  type="radio"
                  id={`q${question.id}-true`}
                  name={`question-${question.id}`}
                  value="true"
                  checked={selectedAnswer === 'true'}
                  onChange={(e) => handleLocalAnswerChange(e.target.value)}
                  disabled={isSubmitted}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <label htmlFor={`q${question.id}-true`} className="flex-1 cursor-pointer text-sm md:text-base">
                  True
                </label>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors flex-1">
                <input
                  type="radio"
                  id={`q${question.id}-false`}
                  name={`question-${question.id}`}
                  value="false"
                  checked={selectedAnswer === 'false'}
                  onChange={(e) => handleLocalAnswerChange(e.target.value)}
                  disabled={isSubmitted}
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                />
                <label htmlFor={`q${question.id}-false`} className="flex-1 cursor-pointer text-sm md:text-base">
                  False
                </label>
              </div>
            </div>
          )}

          {(question.type === 'FILL_IN_BLANK' || question.type === 'SHORT_ANSWER') && (
            <div className="space-y-3">
              <textarea
                value={textAnswer}
                onChange={(e) => handleLocalAnswerChange(e.target.value)}
                placeholder="Enter your answer..."
                rows={4}
                disabled={isSubmitted}
                className="w-full p-3 border rounded-lg text-sm md:text-base resize-none"
              />
            </div>
          )}

          {/* Hints */}
          {question.hints && (
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHints(prev => ({ ...prev, [question.id]: !prev[question.id] }))}
                className="text-xs"
              >
                {showHints[question.id] ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                {showHints[question.id] ? 'Hide Hint' : 'Show Hint'}
              </Button>
              {showHints[question.id] && (
                <Alert>
                  <AlertDescription className="text-xs md:text-sm">
                    {question.hints}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderResults = () => {
    const totalQuestions = questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const correctAnswers = Object.keys(answers).filter(qId => {
      const question = questions.find(q => q.id === qId);
      return question && answers[qId] === question.correct_answer;
    }).length;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-center">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl md:text-3xl font-bold">{correctAnswers}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{totalQuestions - correctAnswers}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Incorrect</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{totalQuestions}</div>
                <div className="text-xs md:text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">
                  {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground">Score</div>
              </div>
            </div>
            
            <Progress value={(correctAnswers / totalQuestions) * 100} className="h-3" />
            
            <div className="text-center">
              <p className="text-sm md:text-base">
                {correctAnswers >= Math.ceil(totalQuestions * (quiz.passing_score / 100)) 
                  ? 'Congratulations! You passed the quiz!' 
                  : 'You did not meet the passing score. Keep practicing!'}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onClose} className="w-full sm:w-auto h-10">
            Close Quiz
          </Button>
          {quiz.allow_retry && (
            <Button 
              variant="outline" 
              onClick={() => {
                // Reset all state for a fresh quiz attempt
                setCurrentQuestionIndex(0);
                setAnswers({});
                setShowResults(false);
                setTimeRemaining(quiz.time_limit ? quiz.time_limit * 60 : 0);
                setIsSubmitted(false);
                setAttempt(null);
                setStartAttemptCalledRef(false);
                setError(null);
                setLoading(false);
              }}
              className="w-full sm:w-auto h-10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Quiz
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (loading && !attempt) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-600">Starting quiz...</p>
      </div>
    );
  }

  if (error && !attempt) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Failed to Start Quiz</h3>
          <p className="text-gray-600 max-w-md">{error}</p>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={retryStartAttempt}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>{loading ? 'Retrying...' : 'Retry'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <span>Close</span>
          </Button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return renderResults();
  }

  return (
    <div className="space-y-6">
      {/* Mobile-optimized header with timer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5" />
            <span className="font-medium text-sm md:text-base">Quiz Progress</span>
          </div>
          {quiz.time_limit && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm md:text-base">
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
            disabled={!quiz.time_limit}
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

      {/* Mobile-optimized navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="w-full sm:w-auto h-10"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center space-x-2">
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
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 