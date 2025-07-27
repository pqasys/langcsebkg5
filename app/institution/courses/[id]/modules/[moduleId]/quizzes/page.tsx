'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowLeft, Edit, Trash2, Eye, Target, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

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
  quizQuestions: Array<{
    id: string;
    question: string;
    type: string;
    points: number;
  }>;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  title: string;
  description: string | null;
}

export default function ModuleQuizzesPage({ params }: { params: { id: string; moduleId: string } }) {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id, params.moduleId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch module details
      const moduleResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}`);
      if (!moduleResponse.ok) {
        throw new Error(`Failed to fetch module - Context: throw new Error('Failed to fetch module');...`);
      }
      const moduleData = await moduleResponse.json();
      setModule(moduleData);

      // Fetch quizzes
      const quizzesResponse = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes`);
      if (!quizzesResponse.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      const quizzesData = await quizzesResponse.json();
      setQuizzes(quizzesData);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content/new?tab=quiz`);
  };

  const handleEditQuiz = (quizId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${quizId}/edit`);
  };

  const handleViewQuiz = (quizId: string) => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${quizId}`);
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes?quizId=${quizId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      toast.success('Quiz deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting quiz. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete quiz');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQuizTypeIcon = (type: string) => {
    switch (type) {
      case 'ASSESSMENT': return <Target className="h-4 w-4" />;
      case 'PRACTICE': return <Users className="h-4 w-4" />;
      case 'ADAPTIVE': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold tracking-tight">
              {module?.title} - Quizzes
            </h1>
            <p className="text-muted-foreground">
              Manage quizzes for this module
            </p>
          </div>
        </div>
        <Button onClick={handleCreateQuiz}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quizzes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
                <p className="text-sm mb-4">
                  Create your first quiz to assess student learning in this module.
                </p>
                <Button onClick={handleCreateQuiz}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Quiz
                </Button>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getQuizTypeIcon(quiz.quiz_type)}
                      <div>
                        <h3 className="font-medium text-lg">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {quiz.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {quiz.quiz_type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {quiz.quizQuestions.length} questions
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {quiz.passing_score}% passing score
                          </span>
                          {quiz.time_limit && (
                            <span className="text-sm text-muted-foreground flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {quiz.time_limit}m
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewQuiz(quiz.id)}
                      title="View Quiz"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditQuiz(quiz.id)}
                      title="Edit Quiz"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteQuiz(quiz.id)}
                      title="Delete Quiz"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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