'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Share2, Users, Globe, Lock, CheckCircle, XCircle, Search, Filter, Copy, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: unknown;
  is_public: boolean;
  question_count: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

interface Question {
  id: string;
  question_text: string;
  question_type: string;
  options?: unknown;
  correct_answer: unknown;
  explanation?: string;
  difficulty: string;
  category?: string;
  tags?: unknown;
  points: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_shared: boolean;
  shared_with: string[];
}

interface Course {
  id: string;
  name: string;
  description?: string;
  category?: string;
  is_active: boolean;
}

interface Institution {
  id: string;
  name: string;
  description?: string;
  country?: string;
  is_verified: boolean;
}

const SHARING_LEVELS = [
  { value: 'PRIVATE', label: 'Private', icon: Lock, description: 'Only you can access' },
  { value: 'INSTITUTION', label: 'Institution', icon: Users, description: 'All users in your institution' },
  { value: 'PUBLIC', label: 'Public', icon: Globe, description: 'All institutions can access' },
];

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'SHORT_ANSWER', label: 'Short Answer' },
  { value: 'ESSAY', label: 'Essay' },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank' },
  { value: 'MATCHING', label: 'Matching' },
  { value: 'DRAG_DROP', label: 'Drag & Drop' },
  { value: 'HOTSPOT', label: 'Hotspot' },
];

export default function QuestionBankSharePage() {
  const router = useRouter();
  const params = useParams();
  const questionBankId = params.id as string;

  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedSharingLevel, setSelectedSharingLevel] = useState('all');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showBulkShareDialog, setShowBulkShareDialog] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [shareFormData, setShareFormData] = useState({
    sharingLevel: 'INSTITUTION',
    selectedCourses: [] as string[],
    selectedInstitutions: [] as string[],
    message: '',
    allowCopy: true,
    allowModify: false
  });

  useEffect(() => {
    if (questionBankId) {
      fetchQuestionBank();
      fetchQuestions();
      fetchCourses();
      fetchInstitutions();
    }
  }, [questionBankId]);

  useEffect(() => {
    // Update select all state based on filtered questions
    const filteredQuestions = questions.filter(question => {
      const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || question.question_type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      const matchesSharing = selectedSharingLevel === 'all' || 
        (selectedSharingLevel === 'PRIVATE' && !question.is_shared) ||
        (selectedSharingLevel === 'INSTITUTION' && question.is_shared && question.shared_with.length > 0) ||
        (selectedSharingLevel === 'PUBLIC' && question.is_shared && question.shared_with.includes('PUBLIC'));
      return matchesSearch && matchesType && matchesDifficulty && matchesSharing;
    });
    
    setSelectAll(selectedQuestions.length > 0 && selectedQuestions.length === filteredQuestions.length);
  }, [selectedQuestions, questions, searchTerm, selectedType, selectedDifficulty, selectedSharingLevel]);

  const fetchQuestionBank = async () => {
    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}`);
      if (response.ok) {
        const data = await response.json();
        setQuestionBank(data);
      } else {
        toast.error('Failed to fetch question bank');
        router.push('/institution/question-banks');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch question bank');
      router.push('/institution/question-banks');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        toast.error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load questions. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/institution/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load courses. Please try again or contact support if the problem persists.`);
    }
  };

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institution/institutions');
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load institutions. Please try again or contact support if the problem persists.`);
    }
  };

  const handleShareQuestions = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('No questions selected');
      return;
    }

    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIds: selectedQuestions,
          ...shareFormData
        })
      });

      if (response.ok) {
        toast.success(`${selectedQuestions.length} question(s) shared successfully`);
        setSelectedQuestions([]);
        setShowShareDialog(false);
        setShareFormData({
          sharingLevel: 'INSTITUTION',
          selectedCourses: [],
          selectedInstitutions: [],
          message: '',
          allowCopy: true,
          allowModify: false
        });
        fetchQuestions();
      } else {
        toast.error('Failed to share questions');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to sharing questions:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to share questions');
    }
  };

  const handleCopyToCourse = async (questionId: string, courseId: string) => {
    try {
      const response = await fetch(`/api/institution/questions/${questionId}/copy-to-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      });

      if (response.ok) {
        toast.success('Question copied to course successfully');
      } else {
        toast.error('Failed to copy question to course');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to copying question to course:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to copy question to course');
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    const filteredQuestions = questions.filter(question => {
      const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || question.question_type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      const matchesSharing = selectedSharingLevel === 'all' || 
        (selectedSharingLevel === 'PRIVATE' && !question.is_shared) ||
        (selectedSharingLevel === 'INSTITUTION' && question.is_shared && question.shared_with.length > 0) ||
        (selectedSharingLevel === 'PUBLIC' && question.is_shared && question.shared_with.includes('PUBLIC'));
      return matchesSearch && matchesType && matchesDifficulty && matchesSharing;
    });
    
    if (selectAll) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(filteredQuestions.map(question => question.id));
    }
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || question.question_type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesSharing = selectedSharingLevel === 'all' || 
      (selectedSharingLevel === 'PRIVATE' && !question.is_shared) ||
      (selectedSharingLevel === 'INSTITUTION' && question.is_shared && question.shared_with.length > 0) ||
      (selectedSharingLevel === 'PUBLIC' && question.is_shared && question.shared_with.includes('PUBLIC'));
    return matchesSearch && matchesType && matchesDifficulty && matchesSharing;
  });

  const types = [...new Set(questions.map(question => question.question_type))];
  const difficulties = [...new Set(questions.map(question => question.difficulty))];

  // Analytics data
  const analytics = {
    totalQuestions: questions.length,
    sharedQuestions: questions.filter(q => q.is_shared).length,
    privateQuestions: questions.filter(q => !q.is_shared).length,
    publicQuestions: questions.filter(q => q.shared_with.includes('PUBLIC')).length,
    institutionQuestions: questions.filter(q => q.is_shared && q.shared_with.length > 0 && !q.shared_with.includes('PUBLIC')).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!questionBank) {
    return (
      <div className="text-center py-12">
        <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Question bank not found</h3>
        <Button onClick={() => router.push('/institution/question-banks')}>
          Back to Question Banks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/institution/question-banks/${questionBankId}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Question Bank
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Share Questions</h1>
          <p className="text-muted-foreground">
            Share questions from "{questionBank.name}" across courses and institutions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button disabled={selectedQuestions.length === 0}>
                <Share2 className="w-4 h-4 mr-2" />
                Share Selected ({selectedQuestions.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Share Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Sharing Level</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {SHARING_LEVELS.map((level) => {
                      const Icon = level.icon;
                      return (
                        <div
                          key={level.value}
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            shareFormData.sharingLevel === level.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setShareFormData({ ...shareFormData, sharingLevel: level.value })}
                        >
                          <Icon className="w-5 h-5 text-gray-500" />
                          <div className="flex-1">
                            <div className="font-medium">{level.label}</div>
                            <div className="text-sm text-gray-500">{level.description}</div>
                          </div>
                          {shareFormData.sharingLevel === level.value && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {shareFormData.sharingLevel === 'INSTITUTION' && (
                  <div className="space-y-2">
                    <Label>Share with Courses</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {courses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`course-${course.id}`}
                            checked={shareFormData.selectedCourses.includes(course.id)}
                            onChange={(e) => {
                              const newCourses = e.target.checked
                                ? [...shareFormData.selectedCourses, course.id]
                                : shareFormData.selectedCourses.filter(id => id !== course.id);
                              setShareFormData({ ...shareFormData, selectedCourses: newCourses });
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={`course-${course.id}`} className="text-sm">
                            {course.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {shareFormData.sharingLevel === 'PUBLIC' && (
                  <div className="space-y-2">
                    <Label>Share with Institutions</Label>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {institutions.map((institution) => (
                        <div key={institution.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`institution-${institution.id}`}
                            checked={shareFormData.selectedInstitutions.includes(institution.id)}
                            onChange={(e) => {
                              const newInstitutions = e.target.checked
                                ? [...shareFormData.selectedInstitutions, institution.id]
                                : shareFormData.selectedInstitutions.filter(id => id !== institution.id);
                              setShareFormData({ ...shareFormData, selectedInstitutions: newInstitutions });
                            }}
                            className="rounded"
                          />
                          <Label htmlFor={`institution-${institution.id}`} className="text-sm">
                            {institution.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={shareFormData.message}
                    onChange={(e) => setShareFormData({ ...shareFormData, message: e.target.value })}
                    placeholder="Add a message for recipients..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allow-copy"
                        checked={shareFormData.allowCopy}
                        onChange={(e) => setShareFormData({ ...shareFormData, allowCopy: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="allow-copy">Allow copying</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allow-modify"
                        checked={shareFormData.allowModify}
                        onChange={(e) => setShareFormData({ ...shareFormData, allowModify: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="allow-modify">Allow modification</Label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleShareQuestions}>
                    Share Questions
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{analytics.totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Shared</p>
                <p className="text-2xl font-bold">{analytics.sharedQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Private</p>
                <p className="text-2xl font-bold">{analytics.privateQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Institution</p>
                <p className="text-2xl font-bold">{analytics.institutionQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Public</p>
                <p className="text-2xl font-bold">{analytics.publicQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="type-filter">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>
                      {QUESTION_TYPES.find(t => t.value === type)?.label || type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {difficulties.map(difficulty => (
                    <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sharing-filter">Sharing Level</Label>
              <Select value={selectedSharingLevel} onValueChange={setSelectedSharingLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="INSTITUTION">Institution</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleSelectQuestion(question.id)}
                    className="mt-1 text-gray-400 hover:text-gray-600"
                  >
                    {selectedQuestions.includes(question.id) ? (
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded" />
                    )}
                  </button>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.question_text}</p>
                        {question.explanation && (
                          <p className="text-sm text-muted-foreground mt-1">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 ml-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/institution/question-banks/${questionBankId}/questions/${question.id}`)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedQuestions([question.id])}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share Question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}
                      </Badge>
                      <Badge variant="outline">{question.difficulty}</Badge>
                      <Badge variant="outline">{question.points} pts</Badge>
                      {question.category && (
                        <Badge variant="outline">{question.category}</Badge>
                      )}
                      {question.is_shared ? (
                        question.shared_with.includes('PUBLIC') ? (
                          <Badge variant="default" className="bg-orange-100 text-orange-800">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="default" className="bg-purple-100 text-purple-800">
                            <Users className="w-3 h-3 mr-1" />
                            Shared
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                    {question.options && Array.isArray(question.options) && question.options.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Options:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`text-sm p-2 rounded ${
                                option === question.correct_answer
                                  ? 'bg-green-100 text-green-800 border border-green-200'
                                  : 'bg-gray-50 text-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + index)}. {option}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {question.tags && Array.isArray(question.tags) && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {question.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Select All Bar */}
      {filteredQuestions.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-gray-400 hover:text-gray-600"
            >
              {selectAll ? (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              ) : (
                <div className="w-5 h-5 border-2 border-gray-300 rounded" />
              )}
            </button>
            <span className="text-sm font-medium">
              {selectAll ? 'Deselect All' : 'Select All'} ({filteredQuestions.length} questions)
            </span>
          </div>
          {selectedQuestions.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedQuestions.length} selected
            </span>
          )}
        </div>
      )}

      {filteredQuestions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Share2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedSharingLevel !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No questions available for sharing'
            }
          </p>
        </div>
      )}
    </div>
  );
} 