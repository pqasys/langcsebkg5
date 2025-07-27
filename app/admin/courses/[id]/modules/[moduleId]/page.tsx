'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Target, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: string;
  points: number;
  created_at: string;
  updated_at: string;
}

interface Module {
  id: string;
  title: string;
  description?: string;
  level: string;
  order_index: number;
  estimated_duration: number;
  is_published: boolean;
  vocabulary_list: string | null;
  grammar_points: string | null;
  cultural_notes: string | null;
  contentItems: Array<{
    id: string;
    title: string;
    type: string;
    content: string;
    order_index?: number;
  }>;
  exercises: Array<{
    id: string;
    question: string;
    type: string;
    answer: string;
    order_index?: number;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    description?: string;
    passing_score: number;
    time_limit?: number;
    quiz_type: string;
    difficulty: string;
    quizQuestions: QuizQuestion[];
  }>;
  skills: string[];
}

interface Course {
  id: string;
  title: string;
  institution: {
    name: string;
  };
}

export default function AdminModuleDetailPage({ params }: { params: { id: string; moduleId: string } }) {
  const router = useRouter();
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id, params.moduleId]);

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
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load data. Please try again or contact support if the problem persists.`);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditModule = () => {
    router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/edit`);
  };

  const handleManageContent = () => {
    router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/content`);
  };

  const handleBackToModules = () => {
    router.push(`/admin/courses/${params.id}/modules`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !module || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || 'Module not found'}</p>
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
            onClick={handleBackToModules}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{module.title}</h1>
            <p className="text-muted-foreground">
              Module Details • {course.title} • {course.institution.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEditModule}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Module
          </Button>
          <Button onClick={handleManageContent}>
            <FileText className="w-4 h-4 mr-2" />
            Manage Content
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{module.description || 'No description provided'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Level</h3>
                  <Badge variant="secondary">{module.level}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Status</h3>
                  <Badge variant={module.is_published ? 'default' : 'secondary'}>
                    {module.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Order</h3>
                  <p className="text-muted-foreground">{module.order_index}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">{module.estimated_duration} minutes</p>
                </div>
              </div>

              {module.vocabulary_list && (
                <div>
                  <h3 className="font-semibold mb-2">Vocabulary List</h3>
                  <p className="text-muted-foreground">{module.vocabulary_list}</p>
                </div>
              )}

              {module.grammar_points && (
                <div>
                  <h3 className="font-semibold mb-2">Grammar Points</h3>
                  <p className="text-muted-foreground">{module.grammar_points}</p>
                </div>
              )}

              {module.cultural_notes && (
                <div>
                  <h3 className="font-semibold mb-2">Cultural Notes</h3>
                  <p className="text-muted-foreground">{module.cultural_notes}</p>
                </div>
              )}

              {module.skills && module.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {module.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <h4 className="font-semibold text-blue-900">Content Items</h4>
                  <p className="text-2xl font-bold text-blue-600">{module.contentItems.length}</p>
                  <p className="text-sm text-blue-700">Learning materials</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Target className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <h4 className="font-semibold text-green-900">Exercises</h4>
                  <p className="text-2xl font-bold text-green-600">{module.exercises.length}</p>
                  <p className="text-sm text-green-700">Practice activities</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                  <h4 className="font-semibold text-purple-900">Quizzes</h4>
                  <p className="text-2xl font-bold text-purple-600">{module.quizzes.length}</p>
                  <p className="text-sm text-purple-700">Assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Items List */}
          {module.contentItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Content Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.contentItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">Type: {item.type}</p>
                      </div>
                      <Badge variant="outline">Order: {item.order_index || 'N/A'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exercises List */}
          {module.exercises.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.exercises.map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{exercise.question}</h4>
                        <p className="text-sm text-gray-500">Type: {exercise.type}</p>
                      </div>
                      <Badge variant="outline">Order: {exercise.order_index || 'N/A'}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quizzes List */}
          {module.quizzes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {module.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{quiz.title}</h4>
                        <p className="text-sm text-gray-500">
                          {quiz.description || 'No description'}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                          <span>Type: {quiz.quiz_type}</span>
                          <span>•</span>
                          <span>Difficulty: {quiz.difficulty}</span>
                          <span>•</span>
                          <span>Passing Score: {quiz.passing_score}%</span>
                          {quiz.time_limit && (
                            <>
                              <span>•</span>
                              <span>Time Limit: {quiz.time_limit} mins</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEditModule}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Module
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleManageContent}
              >
                <FileText className="w-4 h-4 mr-2" />
                Manage Content
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes`)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Manage Quizzes
              </Button>
            </CardContent>
          </Card>

          {/* Module Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Module Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Content Items</span>
                <span className="font-semibold">{module.contentItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Exercises</span>
                <span className="font-semibold">{module.exercises.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Quizzes</span>
                <span className="font-semibold">{module.quizzes.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Skills</span>
                <span className="font-semibold">{module.skills.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 