'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Target, 
  Clock, 
  Users, 
  BookOpen,
  FileQuestion,
  BarChart3,
  TrendingUp,
  Calendar
} from 'lucide-react';
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
  module: {
    id: string;
    title: string;
    course: {
      id: string;
      title: string;
    };
  };
  stats?: {
    total_attempts: number;
    average_score: number;
    completion_rate: number;
    last_attempt: string | null;
  };
}

interface QuizStats {
  total_quizzes: number;
  total_questions: number;
  average_difficulty: string;
  most_popular_type: string;
  recent_activity: number;
  completion_rate: number;
}

interface Course {
  id: string;
  title: string;
  modules?: Array<{
    id: string;
    title: string;
  }>;
}

export default function InstitutionQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // Course selection modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<string>('all');
  const [selectedModuleForQuiz, setSelectedModuleForQuiz] = useState<string>('all');
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/quizzes');
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
        setStats(data.stats || null);
      } else {
        toast.error('Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load quizzes. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const response = await fetch('/api/institution/courses');
      if (response.ok) {
        const data = await response.json();
        const coursesArray = Array.isArray(data) ? data : data.courses || [];
        setCourses(coursesArray);
      } else {
        toast.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load courses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch courses');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleViewQuiz = (quiz: Quiz) => {
    router.push(`/institution/courses/${quiz.module.course.id}/modules/${quiz.module.id}/quizzes/${quiz.id}`);
  };

  const handleEditQuiz = (quiz: Quiz) => {
    router.push(`/institution/courses/${quiz.module.course.id}/modules/${quiz.module.id}/quizzes/${quiz.id}/edit`);
  };

  const handleCreateQuiz = () => {
    setShowCreateModal(true);
    fetchCourses();
  };

  const handleCourseSelect = async (courseId: string) => {
    setSelectedCourseForQuiz(courseId);
    setSelectedModuleForQuiz('');
    
    // Fetch modules for the selected course
    try {
      const response = await fetch(`/api/institution/courses/${courseId}/modules`);
      if (response.ok) {
        const modules = await response.json();
        setCourses(prev => prev.map(course => 
          course.id === courseId 
            ? { ...course, modules } 
            : course
        ));
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load modules:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch modules');
    }
  };

  const handleCreateQuizSubmit = () => {
    if (!selectedCourseForQuiz || !selectedModuleForQuiz) {
      toast.error('Please select both a course and module');
      return;
    }
    
    router.push(`/institution/courses/${selectedCourseForQuiz}/modules/${selectedModuleForQuiz}/content/new?tab=quiz`);
    setShowCreateModal(false);
    setSelectedCourseForQuiz('');
    setSelectedModuleForQuiz('');
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
      case 'STANDARD': return '📝';
      case 'ADAPTIVE': return '🎯';
      case 'PRACTICE': return '💡';
      case 'ASSESSMENT': return '📊';
      default: return '❓';
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.module.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.module.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || quiz.quiz_type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    const matchesCourse = selectedCourse === 'all' || quiz.module.course.id === selectedCourse;
    return matchesSearch && matchesType && matchesDifficulty && matchesCourse;
  });

  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { 'EASY': 1, 'MEDIUM': 2, 'HARD': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'questions':
        return b.quizQuestions.length - a.quizQuestions.length;
      default:
        return 0;
    }
  });

  const coursesForFilter = [...new Set(quizzes.map(quiz => quiz.module.course.id))];
  const types = [...new Set(quizzes.map(quiz => quiz.quiz_type))];
  const difficulties = [...new Set(quizzes.map(quiz => quiz.difficulty))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all quizzes across your courses</p>
        </div>
        <Button onClick={handleCreateQuiz} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Quiz
        </Button>
      </div>

      {/* Create Quiz Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Quiz</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Course</label>
              <Select value={selectedCourseForQuiz} onValueChange={handleCourseSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {loadingCourses ? (
                    <SelectItem value="loading" disabled>Loading courses...</SelectItem>
                  ) : courses.length === 0 ? (
                    <SelectItem value="no-courses" disabled>No courses available</SelectItem>
                  ) : (
                    courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCourseForQuiz && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Module</label>
                <Select value={selectedModuleForQuiz} onValueChange={setSelectedModuleForQuiz}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a module" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {(() => {
                      const selectedCourse = courses.find(c => c.id === selectedCourseForQuiz);
                      return selectedCourse?.modules && selectedCourse.modules.length > 0 ? (
                        selectedCourse.modules.map(module => (
                          <SelectItem key={module.id} value={module.id}>
                            {module.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-modules" disabled>No modules available</SelectItem>
                      );
                    })()}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuizSubmit} disabled={!selectedCourseForQuiz || !selectedModuleForQuiz}>
                Create Quiz
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_quizzes}</p>
                </div>
                <FileQuestion className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_questions}</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completion_rate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent_activity}</p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative search-container-long">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Quiz Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                <SelectItem value="all">All Courses</SelectItem>
                {coursesForFilter.map(courseId => {
                  const course = quizzes.find(q => q.module.course.id === courseId)?.module.course;
                  return course ? (
                    <SelectItem key={courseId} value={courseId}>{course.title}</SelectItem>
                  ) : null;
                })}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="questions">Most Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quizzes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5" />
            All Quizzes ({filteredQuizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedQuizzes.length === 0 ? (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCourse !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first quiz to get started'}
              </p>
              {!searchTerm && selectedType === 'all' && selectedDifficulty === 'all' && selectedCourse === 'all' && (
                <Button onClick={handleCreateQuiz}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getQuizTypeIcon(quiz.quiz_type)}</div>
                    <div>
                      <h3 className="font-medium text-lg">{quiz.title}</h3>
                      {quiz.description && (
                        <p className="text-sm text-gray-600 mt-1">{quiz.description}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        <Badge variant="outline">{quiz.quiz_type}</Badge>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          {quiz.quizQuestions.length} questions
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {quiz.passing_score}% passing
                        </span>
                        {quiz.time_limit && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {quiz.time_limit}m
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-500 flex items-center">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {quiz.module.course.title}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{quiz.module.title}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewQuiz(quiz)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditQuiz(quiz)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 