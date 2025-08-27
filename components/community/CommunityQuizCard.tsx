'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, Clock, Users, BookOpen, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  description?: string;
  passing_score: number;
  time_limit?: number;
  difficulty: string;
  quiz_type: string;
  questionCount: number;
  module: {
    title: string;
    course: {
      title: string;
      institution: {
        name: string;
      };
    };
  };
}

interface CommunityQuizCardProps {
  quiz: Quiz;
  onStartQuiz: (quizId: string) => void;
  monthlyUsage: number;
}

export function CommunityQuizCard({ quiz, onStartQuiz, monthlyUsage }: CommunityQuizCardProps) {
  const [loading, setLoading] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ASSESSMENT': return <Target className="h-4 w-4" />;
      case 'PRACTICE': return <BookOpen className="h-4 w-4" />;
      case 'ADAPTIVE': return <Trophy className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleStartQuiz = async () => {
    if (monthlyUsage >= 1) {
      toast.error('Monthly free quiz limit reached. Upgrade to Premium for unlimited access!');
      return;
    }

    setLoading(true);
    try {
      onStartQuiz(quiz.id);
    } catch (error) {
      console.error('Error starting quiz:', error);
      toast.error('Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-2">{quiz.title}</CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              From {quiz.module.course.institution.name}
            </p>
            {quiz.description && (
              <p className="text-sm text-gray-700 mb-3">{quiz.description}</p>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Quiz Info */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              {getQuizTypeIcon(quiz.quiz_type)}
              <span className="capitalize">{quiz.quiz_type.toLowerCase()}</span>
            </div>
            
            <Badge variant="secondary" className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty}
            </Badge>
            
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{quiz.questionCount} questions</span>
            </div>
            
            {quiz.time_limit && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{quiz.time_limit}m</span>
              </div>
            )}
          </div>

          {/* Course Info */}
          <div className="text-sm text-gray-600">
            <p><strong>Course:</strong> {quiz.module.course.title}</p>
            <p><strong>Module:</strong> {quiz.module.title}</p>
          </div>

          {/* Passing Score */}
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm">
              Passing Score: <strong>{quiz.passing_score}%</strong>
            </span>
          </div>

          {/* Usage Info */}
          <div className="text-sm text-gray-600">
            <p>Monthly Usage: {monthlyUsage}/1 free</p>
          </div>

          {/* Start Button */}
          <Button 
            onClick={handleStartQuiz}
            disabled={loading || monthlyUsage >= 1}
            className="w-full"
          >
            {loading ? 'Starting...' : monthlyUsage >= 1 ? 'Limit Reached' : 'Start Quiz'}
          </Button>

          {monthlyUsage >= 1 && (
            <p className="text-xs text-center text-orange-600">
              Upgrade to Premium for unlimited quiz access!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
