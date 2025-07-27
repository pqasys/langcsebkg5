'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdaptiveQuizInterface from '@/components/student/AdaptiveQuizInterface';
import { Brain, Target, TrendingUp, Clock } from 'lucide-react';

const TEST_QUIZ_ID = '8bc8ad6c-db4c-44dd-bbbc-4825c76b5339';

export default function TestAdaptiveQuizPage() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  const handleQuizComplete = (results: unknown) => {
    setQuizResults(results);
    setShowQuiz(false);
  };

  const handleExitQuiz = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <div className="container mx-auto p-6">
        <AdaptiveQuizInterface
          quizId={TEST_QUIZ_ID}
          onComplete={handleQuizComplete}
          onExit={handleExitQuiz}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🧪 Adaptive Quiz System Test</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Test the IRT-based adaptive quiz system with a mathematics quiz
        </p>
      </div>

      {quizResults ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">🎉 Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {quizResults.score}%
                </div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {quizResults.proficiency}
                </div>
                <div className="text-sm text-muted-foreground">Proficiency Level</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {quizResults.confidence}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
            </div>

            {quizResults.recommendations && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations:</h3>
                <ul className="space-y-1">
                  {quizResults.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-green-500" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center gap-4">
              <Button onClick={() => setQuizResults(null)}>
                Take Quiz Again
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Test Adaptive Quiz - Mathematics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">📚 Quiz Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <Badge variant="outline">Adaptive (IRT-based)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Subject:</span>
                      <span>Mathematics</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Questions:</span>
                      <span>5-15 (adaptive)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Limit:</span>
                      <span>30 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Score:</span>
                      <span>70%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">🧠 Adaptive Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-blue-500" />
                      <span>Dynamic difficulty adjustment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Real-time ability estimation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>Optimal question selection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span>Precision-based termination</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">ℹ️ How it works:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• The quiz starts with a medium-difficulty question</li>
                  <li>• Based on your answer, it estimates your ability level</li>
                  <li>• Subsequent questions are selected to maximize information about your ability</li>
                  <li>• The quiz ends when your ability is estimated with sufficient precision</li>
                  <li>• You'll receive a proficiency level and personalized recommendations</li>
                </ul>
              </div>

              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  onClick={() => setShowQuiz(true)}
                  className="px-8 py-3"
                >
                  🚀 Start Adaptive Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 