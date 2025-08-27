'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: any;
  order_index: number;
  points: number;
}

interface QuizAttempt {
  id: string;
  status: string;
  startedAt: string;
}

interface Restrictions {
  maxQuestions: number;
  showExplanations: boolean;
  allowRetry: boolean;
  trackProgress: boolean;
}

interface CommunityQuizInterfaceProps {
  quizId: string;
  attempt: QuizAttempt;
  questions: Question[];
  restrictions?: Restrictions;
  onComplete: (results: any) => void;
  onExit: () => void;
}

export function CommunityQuizInterface({
  quizId,
  attempt,
  questions,
  restrictions,
  onComplete,
  onExit
}: CommunityQuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
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
      toast.error('Please answer all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/community/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          answers,
          timeSpent
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setShowResults(true);
        onComplete(data);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults && results) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {results.summary.percentage}%
            </div>
            <div className="text-lg mb-4">
              {results.summary.passed ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Passed
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-800">
                  <XCircle className="h-4 w-4 mr-1" />
                  Failed
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{results.summary.totalScore}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{results.summary.maxScore}</div>
              <div className="text-sm text-gray-600">Max Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{results.summary.questionsAnswered}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatTime(results.summary.timeSpent)}</div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>

          {restrictions?.showExplanations && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Question Results</h3>
              {results.results.map((result: any, index: number) => (
                <div key={result.questionId} className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {result.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">Question {index + 1}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Your Answer:</strong> {result.userAnswer}</p>
                    <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>
                    {result.explanation && (
                      <p><strong>Explanation:</strong> {result.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button onClick={onExit} variant="outline">
              Exit Quiz
            </Button>
            {restrictions?.allowRetry && (
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button onClick={onExit} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Exit
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="text-sm">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-gray-600 mt-1">
            {Object.keys(answers).length} of {questions.length} questions answered
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            {currentQuestion.question}
          </h3>

          {currentQuestion.type === 'MULTIPLE_CHOICE' && currentQuestion.options && (
            <div className="space-y-3">
              {JSON.parse(currentQuestion.options).map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="text-left">
                    <div className="font-medium">{option}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < questions.length}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {restrictions && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <p><strong>Free User Restrictions:</strong></p>
            <ul className="list-disc list-inside mt-1">
              <li>Limited to {restrictions.maxQuestions} questions</li>
              <li>No detailed explanations</li>
              <li>No retry attempts</li>
              <li>No progress tracking</li>
            </ul>
            <p className="mt-2 text-orange-600">
              Upgrade to Premium for full access!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
