'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Target, Clock, CheckCircle, Save, Plus, Trash2 } from 'lucide-react';
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

export default function EditQuizPage({ params }: { params: { id: string; moduleId: string; quizId: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz - Context: throw new Error('Failed to fetch quiz');...`);
      }
      
      const data = await response.json();
      setQuiz(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load quiz. Please try again or contact support if the problem persists.`);
      setError('Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [params.quizId]);

  const handleSave = async () => {
    if (!quiz) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error(`Failed to update quiz - Context: body: JSON.stringify(quiz),...`);
      }

      toast.success('Quiz updated successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating quiz. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
  };

  const updateQuizField = (field: keyof Quiz, value: unknown) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [field]: value });
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
            onClick={handleCancel}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
            <p className="text-muted-foreground">
              Update quiz settings and details
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Quiz Details */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                value={quiz.title}
                onChange={(e) => updateQuizField('title', e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiz_type">Quiz Type</Label>
              <Select value={quiz.quiz_type} onValueChange={(value) => updateQuizField('quiz_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quiz type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                  <SelectItem value="PRACTICE">Practice</SelectItem>
                  <SelectItem value="ADAPTIVE">Adaptive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={quiz.difficulty} onValueChange={(value) => updateQuizField('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score (%)</Label>
              <Input
                id="passing_score"
                type="number"
                min="0"
                max="100"
                value={quiz.passing_score}
                onChange={(e) => updateQuizField('passing_score', parseInt(e.target.value) || 0)}
                placeholder="70"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time_limit">Time Limit (minutes)</Label>
              <Input
                id="time_limit"
                type="number"
                min="0"
                value={quiz.time_limit || ''}
                onChange={(e) => updateQuizField('time_limit', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="No limit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_attempts">Max Attempts</Label>
              <Input
                id="max_attempts"
                type="number"
                min="1"
                value={quiz.max_attempts}
                onChange={(e) => updateQuizField('max_attempts', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={quiz.description || ''}
              onChange={(e) => updateQuizField('description', e.target.value)}
              placeholder="Enter quiz description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allow_retry"
                checked={quiz.allow_retry}
                onChange={(e) => updateQuizField('allow_retry', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="allow_retry">Allow Retry</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_results"
                checked={quiz.show_results}
                onChange={(e) => updateQuizField('show_results', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="show_results">Show Results</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show_explanations"
                checked={quiz.show_explanations}
                onChange={(e) => updateQuizField('show_explanations', e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="show_explanations">Show Explanations</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({quiz.quizQuestions.length})</CardTitle>
            <Button variant="outline" onClick={() => router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions`)}>
              <Plus className="w-4 h-4 mr-2" />
              Manage Questions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.quizQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No questions added yet. Add questions to make this quiz functional.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {quiz.quizQuestions.slice(0, 3).map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">{index + 1}.</span>
                    <span className="text-sm">{question.question.substring(0, 50)}...</span>
                    <Badge variant="outline" className="text-xs">
                      {question.points} pts
                    </Badge>
                  </div>
                </div>
              ))}
              {quiz.quizQuestions.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{quiz.quizQuestions.length - 3} more questions
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 