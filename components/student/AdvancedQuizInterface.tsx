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
  Move,
  Target,
  CheckSquare,
  FileText,
  AlignLeft
} from 'lucide-react';

interface QuestionOption {
  id?: string;
  option_type: string;
  content: string;
  media_url?: string;
  order_index: number;
  is_correct: boolean;
  points: number;
  metadata?: unknown;
}

interface AdvancedQuizQuestion {
  id: string;
  type: string;
  question: string;
  options?: string | string[];
  correct_answer?: string;
  points: number;
  explanation?: string;
  hints?: string;
  order_index: number;
  difficulty?: string;
  category?: string;
  question_config?: unknown;
  media_url?: string;
  media_type?: string;
  questionOptions?: QuestionOption[];
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
  quizQuestions: AdvancedQuizQuestion[];
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

interface AdvancedQuizInterfaceProps {
  quiz: Quiz;
  moduleId: string;
  courseId: string;
  onComplete: (result: unknown) => void;
  onClose: () => void;
}

export function AdvancedQuizInterface({ quiz, moduleId, courseId, onComplete, onClose }: AdvancedQuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit ? quiz.time_limit * 60 : 0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHints, setShowHints] = useState<Record<string, boolean>>({});
  const [dragItems, setDragItems] = useState<string[]>([]);
  const [dropZones, setDropZones] = useState<string[]>([]);
  const [hotspotCoords, setHotspotCoords] = useState<{ x: number; y: number } | null>(null);
  const [orderItems, setOrderItems] = useState<string[]>([]);
  const [multipleAnswers, setMultipleAnswers] = useState<Record<string, string[]>>({});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const questions = quiz.quizQuestions;
  const currentQuestion = questions[currentQuestionIndex];

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

  // Start quiz attempt
  useEffect(() => {
    startQuizAttempt();
  }, []);

  // Initialize question-specific state when question changes
  useEffect(() => {
    if (currentQuestion) {
      initializeQuestionState();
    }
  }, [currentQuestion]);

  const startQuizAttempt = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const attemptData = await response.json();
        setAttempt(attemptData);
      } else {
        toast.error('Failed to start quiz');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to starting quiz:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const initializeQuestionState = () => {
    if (!currentQuestion) return;

    switch (currentQuestion.type) {
      case 'DRAG_DROP':
        if (currentQuestion.question_config?.dragItems) {
          setDragItems([...currentQuestion.question_config.dragItems]);
        }
        if (currentQuestion.question_config?.dropZones) {
          setDropZones([...currentQuestion.question_config.dropZones]);
        }
        break;
      case 'ORDERING':
        if (currentQuestion.question_config?.orderItems) {
          setOrderItems([...currentQuestion.question_config.orderItems]);
        }
        break;
      case 'HOTSPOT':
        setHotspotCoords(null);
        break;
      case 'MULTIPLE_ANSWER':
        if (!multipleAnswers[currentQuestion.id]) {
          setMultipleAnswers(prev => ({ ...prev, [currentQuestion.id]: [] }));
        }
        break;
    }
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

  const handleMultipleAnswerChange = (questionId: string, option: string, checked: boolean) => {
    setMultipleAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...currentAnswers, option] };
      } else {
        return { ...prev, [questionId]: currentAnswers.filter(a => a !== option) };
      }
    });
  };

  const handleDragDrop = (dragItem: string, dropZone: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], [dragItem]: dropZone }
    }));
  };

  const handleHotspotClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setHotspotCoords({ x, y });
    handleAnswerChange(currentQuestion.id, `${x},${y}`);
  };

  const handleOrderChange = (fromIndex: number, toIndex: number) => {
    const newOrder = [...orderItems];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setOrderItems(newOrder);
    handleAnswerChange(currentQuestion.id, newOrder);
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
    if (!attempt) return;

    // Prepare answers for submission
    const finalAnswers = { ...answers };
    
    // Add multiple answer responses
    Object.keys(multipleAnswers).forEach(questionId => {
      if (multipleAnswers[questionId].length > 0) {
        finalAnswers[questionId] = multipleAnswers[questionId];
      }
    });

    try {
      setLoading(true);
      const response = await fetch(`/api/student/courses/${courseId}/modules/${moduleId}/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers: finalAnswers,
          timeSpent: quiz.time_limit ? (quiz.time_limit * 60) - timeRemaining : 0
        })
      });

      if (response.ok) {
        const result = await response.json();
        setIsSubmitted(true);
        setShowResults(true);
        onComplete(result);
        toast.success('Quiz submitted successfully!');
      } else {
        toast.error('Failed to submit quiz');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to submitting quiz:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question: AdvancedQuizQuestion) => {
    const currentAnswer = answers[question.id];

    // Render media if present
    const renderMedia = () => {
      if (!question.media_url) return null;

      switch (question.media_type) {
        case 'image':
          return (
            <div className="mb-4">
              <img 
                src={question.media_url} 
                alt="Question media" 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          );
        case 'video':
          return (
            <div className="mb-4">
              <video 
                src={question.media_url} 
                controls 
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          );
        case 'audio':
          return (
            <div className="mb-4">
              <audio 
                src={question.media_url} 
                controls 
                className="w-full"
              />
            </div>
          );
        default:
          return null;
      }
    };

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="space-y-3">
            {renderMedia()}
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-3">
            {renderMedia()}
            {['True', 'False'].map((option) => (
              <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="radio"
                  name={question.id}
                  value={option.toLowerCase()}
                  checked={currentAnswer === option.toLowerCase()}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'FILL_IN_BLANK':
        return (
          <div className="space-y-3">
            {renderMedia()}
            <input
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-3 border rounded-lg"
            />
          </div>
        );

      case 'ESSAY':
        return (
          <div className="space-y-3">
            {renderMedia()}
            <textarea
              value={currentAnswer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Write your answer here..."
              rows={6}
              className="w-full p-3 border rounded-lg resize-none"
            />
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-4">
            {renderMedia()}
            <p className="text-sm text-muted-foreground">Match the items on the left with the correct answers on the right:</p>
            {question.question_config?.leftItems?.map((item: string, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="font-medium">{item}</span>
                <span>→</span>
                <select
                  value={currentAnswer?.[index] || ''}
                  onChange={(e) => {
                    const newAnswers = { ...currentAnswer } || {};
                    newAnswers[index] = e.target.value;
                    handleAnswerChange(question.id, newAnswers);
                  }}
                  className="flex-1 p-2 border rounded"
                >
                  <option value="">Select match...</option>
                  {question.question_config?.rightItems?.map((rightItem: string, rightIndex: number) => (
                    <option key={rightIndex} value={rightItem}>{rightItem}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );

      case 'DRAG_DROP':
        return (
          <div className="space-y-4">
            {renderMedia()}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Drag Items</h4>
                {dragItems.map((item, index) => (
                  <div key={index} className="p-2 border rounded bg-blue-50">
                    {item}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Drop Zones</h4>
                {dropZones.map((zone, index) => (
                  <div key={index} className="p-2 border-2 border-dashed border-gray-300 rounded min-h-[40px]">
                    {currentAnswer?.[dragItems[index]] || zone}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'HOTSPOT':
        return (
          <div className="space-y-4">
            {renderMedia()}
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border rounded cursor-crosshair"
                onClick={handleHotspotClick}
              />
              {hotspotCoords && (
                <div className="absolute bg-red-500 w-4 h-4 rounded-full -translate-x-2 -translate-y-2 pointer-events-none"
                     style={{ left: hotspotCoords.x, top: hotspotCoords.y }} />
              )}
            </div>
            <p className="text-sm text-muted-foreground">Click on the image to mark the hotspot</p>
          </div>
        );

      case 'ORDERING':
        return (
          <div className="space-y-4">
            {renderMedia()}
            <p className="text-sm text-muted-foreground">Drag to reorder the items:</p>
            <div className="space-y-2">
              {orderItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded bg-gray-50">
                  <Move className="w-4 h-4 text-gray-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'MULTIPLE_ANSWER':
        return (
          <div className="space-y-3">
            {renderMedia()}
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <input
                  type="checkbox"
                  value={option}
                  checked={multipleAnswers[question.id]?.includes(option) || false}
                  onChange={(e) => handleMultipleAnswerChange(question.id, option, e.target.checked)}
                  className="w-4 h-4"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">Question type not supported yet.</p>
          </div>
        );
    }
  };

  const renderResults = () => {
    if (!attempt) return null;

    const percentage = attempt.percentage || 0;
    const passed = percentage >= quiz.passing_score;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Quiz Results
              <Badge variant={passed ? "default" : "destructive"}>
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm text-muted-foreground">Your Score</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{quiz.passing_score}%</div>
                <div className="text-sm text-muted-foreground">Passing Score</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time Spent:</span>
                <span>{formatTime(attempt.timeSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Attempt Number:</span>
                <span>{attempt.attemptNumber}</span>
              </div>
            </div>

            {quiz.show_explanations && (
              <div className="space-y-4">
                <h4 className="font-semibold">Question Review</h4>
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Question {index + 1}</span>
                      <Badge variant="outline">{question.points} points</Badge>
                    </div>
                    <p className="mb-2">{question.question}</p>
                    {question.explanation && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium mb-1">Explanation:</p>
                        <p className="text-sm">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading && !attempt) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResults) {
    return renderResults();
  }

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title}</CardTitle>
              {quiz.description && (
                <p className="text-muted-foreground mt-1">{quiz.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {quiz.time_limit && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-mono">{formatTime(timeRemaining)}</span>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                disabled={!quiz.time_limit}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{currentQuestion.type.replace('_', ' ')}</Badge>
              {currentQuestion.difficulty && (
                <Badge variant="secondary">{currentQuestion.difficulty}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">{currentQuestion.points} points</span>
              {currentQuestion.hints && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHints(prev => ({ ...prev, [currentQuestion.id]: !prev[currentQuestion.id] }))}
                >
                  {showHints[currentQuestion.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose max-w-none">
            <p className="text-lg">{currentQuestion.question}</p>
          </div>

          {showHints[currentQuestion.id] && currentQuestion.hints && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Hint:</strong> {currentQuestion.hints}
              </AlertDescription>
            </Alert>
          )}

          {renderQuestion(currentQuestion)}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 