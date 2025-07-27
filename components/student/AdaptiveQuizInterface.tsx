'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  Brain,
  BarChart3
} from 'lucide-react';

interface AdaptiveQuizInterfaceProps {
  quizId: string;
  onComplete: (results: unknown) => void;
  onExit: () => void;
}

interface Question {
  id: string;
  question: string;
  type: string;
  options?: string[] | string; // Can be array or JSON string
  correctAnswer?: string;
  points: number;
  difficulty: string;
  category?: string;
  explanation?: string;
  hints?: string[];
}

interface AdaptiveState {
  currentQuestion: Question | null;
  abilityEstimate: number;
  confidence: number;
  questionsAnswered: number;
  isComplete: boolean;
  results: unknown;
  loading: boolean;
  error: string | null;
}

export default function AdaptiveQuizInterface({ 
  quizId, 
  onComplete, 
  onExit 
}: AdaptiveQuizInterfaceProps) {
  const [state, setState] = useState<AdaptiveState>({
    currentQuestion: null,
    abilityEstimate: 0,
    confidence: 0,
    questionsAnswered: 0,
    isComplete: false,
    results: null,
    loading: true,
    error: null
  });

  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Start the adaptive quiz
  useEffect(() => {
    startQuiz();
  }, []);

  // Timer for tracking time spent on current question
  useEffect(() => {
    if (state.currentQuestion && !state.isComplete) {
      const timer = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - questionStartTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [state.currentQuestion, questionStartTime, state.isComplete]);

  const startQuiz = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`/api/student/quizzes/${quizId}/adaptive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start' })
      });

      if (!response.ok) throw new Error(`Failed to start quiz - Context: if (!response.ok) throw new Error('Failed to start...`);

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        currentQuestion: data.currentQuestion,
        abilityEstimate: data.abilityEstimate,
        confidence: data.confidence,
        questionsAnswered: 0,
        loading: false
      }));

      setQuestionStartTime(Date.now());
    } catch (error) {
    console.error('Error occurred:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to start adaptive quiz' 
      }));
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !state.currentQuestion) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      
      const response = await fetch(`/api/student/quizzes/${quizId}/adaptive`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          questionId: state.currentQuestion.id,
          answer: selectedAnswer,
          responseTime: timeSpent
        })
      });

      if (!response.ok) throw new Error(`Failed to submit answer - Context: responseTime: timeSpent...`);

      const data = await response.json();
      
      if (data.completed) {
        // Quiz is complete
        setState(prev => ({
          ...prev,
          isComplete: true,
          results: data.results,
          abilityEstimate: data.abilityEstimate,
          confidence: data.confidence,
          loading: false
        }));
        onComplete(data.results);
      } else {
        // Continue with next question
        setState(prev => ({
          ...prev,
          currentQuestion: data.nextQuestion,
          abilityEstimate: data.abilityEstimate,
          confidence: data.confidence,
          questionsAnswered: prev.questionsAnswered + 1,
          loading: false
        }));
        
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimeSpent(0);
        setQuestionStartTime(Date.now());
      }
    } catch (error) {
    console.error('Error occurred:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Failed to submit answer' 
      }));
    }
  };

  const renderQuestion = () => {
    if (!state.currentQuestion) return null;

    const { currentQuestion } = state;

    // Helper function to parse options
    const getOptions = (): string[] => {
      if (!currentQuestion.options) return [];
      
      if (Array.isArray(currentQuestion.options)) {
        return currentQuestion.options;
      }
      
      // If options is a string, try to parse it as JSON
      if (typeof currentQuestion.options === 'string') {
        try {
          const parsed = JSON.parse(currentQuestion.options);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          // If parsing fails, treat it as a single option
          return [currentQuestion.options];
        }
      }
      
      return [];
    };

    switch (currentQuestion.type) {
      case 'MULTIPLE_CHOICE':
        // Parse options - handle both array and JSON string
        const options = (() => {
          if (!currentQuestion.options) return [];
          if (Array.isArray(currentQuestion.options)) return currentQuestion.options;
          if (typeof currentQuestion.options === 'string') {
            try {
              const parsed = JSON.parse(currentQuestion.options);
              return Array.isArray(parsed) ? parsed : [];
            } catch {
              return [currentQuestion.options];
            }
          }
          return [];
        })();
        
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium">{currentQuestion.question}</div>
            <div className="space-y-2">
              {options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => setSelectedAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium">{currentQuestion.question}</div>
            <div className="flex gap-4">
              <Button
                variant={selectedAnswer === 'true' ? "default" : "outline"}
                onClick={() => setSelectedAnswer('true')}
                className="flex-1"
              >
                True
              </Button>
              <Button
                variant={selectedAnswer === 'false' ? "default" : "outline"}
                onClick={() => setSelectedAnswer('false')}
                className="flex-1"
              >
                False
              </Button>
            </div>
          </div>
        );

      case 'FILL_BLANK':
        return (
          <div className="space-y-4">
            <div className="text-lg font-medium">{currentQuestion.question}</div>
            <input
              type="text"
              placeholder="Enter your answer..."
              className="w-full p-3 border rounded-lg"
              value={selectedAnswer || ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  const renderResults = () => {
    if (!state.results) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">
                  {state.results.score}%
                </div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600">
                  {state.results.proficiency}
                </div>
                <div className="text-sm text-muted-foreground">Proficiency Level</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-purple-600">
                  {state.results.confidence}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </CardContent>
            </Card>
          </div>
          
          {state.results.recommendations && (
            <div className="text-left">
              <h3 className="text-lg font-semibold mb-2">Recommendations:</h3>
              <ul className="space-y-1">
                {state.results.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (state.loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading adaptive quiz...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
          <Button onClick={onExit} className="mt-4">
            Exit Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state.isComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          {renderResults()}
          <div className="flex justify-center gap-4 mt-6">
            <Button onClick={onExit}>
              Exit Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Adaptive Quiz</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{timeSpent}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Q{state.questionsAnswered + 1}</span>
            </div>
          </div>
        </div>
        
        {/* Adaptive Quiz Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Ability Estimate: {state.abilityEstimate.toFixed(2)}</span>
            <span>Confidence: {(state.confidence * 100).toFixed(1)}%</span>
          </div>
          <Progress value={state.confidence * 100} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {state.currentQuestion && (
          <>
            {/* Question Info */}
            <div className="flex gap-2">
              <Badge variant="outline">{state.currentQuestion.difficulty}</Badge>
              {state.currentQuestion.category && (
                <Badge variant="secondary">{state.currentQuestion.category}</Badge>
              )}
              <Badge variant="outline">{state.currentQuestion.points} pts</Badge>
            </div>

            {/* Question */}
            {renderQuestion()}

            {/* Hints */}
            {state.currentQuestion.hints && state.currentQuestion.hints.length > 0 && (
              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>Hint:</strong> {state.currentQuestion.hints[0]}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={onExit}>
                Exit Quiz
              </Button>
              <Button 
                onClick={submitAnswer}
                disabled={!selectedAnswer || state.loading}
              >
                {state.loading ? 'Submitting...' : 'Submit Answer'}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 