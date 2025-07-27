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
import { ArrowLeft, Target, Save, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface QuizQuestion {
  id: string;
  type: string;
  question: string;
  points: number;
  options?: string | string[];
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

interface Module {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  institution: {
    name: string;
  };
}

export default function AdminEditQuizPage({ params }: { params: { id: string; moduleId: string; quizId: string } }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch course details
      const courseResponse = await fetch(`/api/admin/courses/${params.id}`);
      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course');
      }
      const courseData = await courseResponse.json();
      setCourse(courseData);

      // Fetch module details
      const moduleResponse = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}`);
      if (!moduleResponse.ok) {
        throw new Error('Failed to fetch module');
      }
      const moduleData = await moduleResponse.json();
      setModule(moduleData);

      // Fetch quiz details
      const quizResponse = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const quizData = await quizResponse.json();
      setQuiz(quizData);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.quizId]);

  const handleSave = async () => {
    if (!quiz) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quiz),
      });

      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }

      toast.success('Quiz updated successfully');
      router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to updating quiz. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
  };

  const updateQuizField = (field: keyof Quiz, value: unknown) => {
    if (!quiz) return;
    setQuiz({ ...quiz, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !quiz || !module || !course) {
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
              {module.title} • {course.title} • {course.institution.name}
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
                  <SelectItem value="STANDARD">Standard</SelectItem>
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
        </CardContent>
      </Card>

      {/* Questions Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({quiz.quizQuestions.length})</CardTitle>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/new`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {quiz.quizQuestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No questions yet</h3>
              <p className="text-sm mb-4">
                Add questions to make this quiz functional.
              </p>
              <Button 
                onClick={() => router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {quiz.quizQuestions.slice(0, 5).map((question, index) => (
                <div key={question.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium">{index + 1}.</span>
                    <span className="text-sm">{question.question.substring(0, 60)}...</span>
                    <Badge variant="outline" className="text-xs">
                      {question.points} pts
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {question.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${question.id}/edit`)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
              {quiz.quizQuestions.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{quiz.quizQuestions.length - 5} more questions
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 