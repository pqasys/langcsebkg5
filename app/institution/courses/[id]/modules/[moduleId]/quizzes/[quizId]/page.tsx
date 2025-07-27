'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Target, Clock, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  points: number;
  options?: string[];
  correct_answer?: string;
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

export default function QuizDetailPage({ params }: { params: { id: string; moduleId: string; quizId: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      // // // // // // // // // console.log('Fetching quiz with ID:', params.quizId);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        toast.error('API Error:');
        throw new Error(`Failed to fetch quiz: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Quiz data:', data);
      setQuiz(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load quiz. Please try again or contact support if the problem persists.`);
      setError(error instanceof Error ? error.message : 'Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [params.quizId]);

  const handleEditQuiz = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/edit`);
  };

  const handleDeleteQuiz = async () => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete quiz - Context: method: 'DELETE',...`);
      }

      toast.success('Quiz deleted successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting quiz. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete quiz');
    }
  };

  const handleAddQuestion = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/new`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'MULTIPLE_CHOICE': return '🔘';
      case 'TRUE_FALSE': return '✅';
      case 'SHORT_ANSWER': return '✏️';
      case 'ESSAY': return '📝';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Quiz not found'}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
            <p className="text-muted-foreground">
              Quiz details and questions
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEditQuiz}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Quiz
          </Button>
          <Button variant="destructive" onClick={handleDeleteQuiz}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Quiz
          </Button>
        </div>
      </div>

      {/* Quiz Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Quiz Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Type</p>
              <Badge variant="outline">{quiz.quiz_type}</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Difficulty</p>
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Passing Score</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium">{quiz.passing_score}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Time Limit</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">
                  {quiz.time_limit ? `${quiz.time_limit} minutes` : 'No limit'}
                </span>
              </div>
            </div>
          </div>
          
          {quiz.description && (
            <div className="mt-6">
              <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
              <p className="text-sm">{quiz.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Questions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({quiz.quizQuestions.length})</CardTitle>
            <Button onClick={handleAddQuestion}>
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quiz.quizQuestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No questions yet</h3>
                <p className="text-sm mb-4">
                  Add questions to make this quiz functional.
                </p>
                <Button onClick={handleAddQuestion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Question
                </Button>
              </div>
            ) : (
              quiz.quizQuestions.map((question, index) => (
                <div
                  key={question.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getQuestionTypeIcon(question.type)}</span>
                          <Badge variant="outline" className="text-xs">
                            {question.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.points} pts
                          </Badge>
                        </div>
                        <p className="font-medium">{question.question}</p>
                        
                        {question.options && Array.isArray(question.options) && question.options.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center gap-2 p-2 rounded ${
                                  option === question.correct_answer 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-gray-50'
                                }`}
                              >
                                <span className="text-sm font-medium">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="text-sm">{option}</span>
                                {option === question.correct_answer && (
                                  <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${question.id}/edit`)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 