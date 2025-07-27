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
import { Plus, Edit, Trash2, Eye, Search, Filter, Database, Download, Upload, Users, FileText, Copy, Share2, CheckSquare, Square, BarChart3, Target, Clock, Award, AlertTriangle } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Zap, Globe, Lock, Unlock } from 'lucide-react';

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
  total_questions: number;
  access_level: 'private' | 'institution' | 'public';
  difficulty_distribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  usage_stats: {
    total_attempts: number;
    average_score: number;
    completion_rate: number;
  };
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
  difficulty_level: 'easy' | 'medium' | 'hard';
  is_active: boolean;
  usage_count: number;
  average_score: number;
  time_to_complete: number;
}

interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  template_data: unknown;
  created_at: string;
  usage_count: number;
}

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

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export default function QuestionBankDetailPage() {
  const router = useRouter();
  const params = useParams();
  const questionBankId = params.id as string;

  const [questionBank, setQuestionBank] = useState<QuestionBank | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showBulkEditDialog, setShowBulkEditDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [bulkEditData, setBulkEditData] = useState({
    points: '',
    difficulty_level: '',
    tags: '',
    is_active: true
  });
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    if (questionBankId) {
      fetchQuestionBank();
      fetchQuestions();
      fetchTemplates();
    }
  }, [questionBankId]);

  useEffect(() => {
    // Update select all state based on filtered questions
    const filteredQuestions = questions.filter(question => {
      const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           question.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || question.question_type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
      return matchesSearch && matchesType && matchesDifficulty && matchesCategory;
    });
    
    setSelectAll(selectedQuestions.length > 0 && selectedQuestions.length === filteredQuestions.length);
  }, [selectedQuestions, questions, searchTerm, selectedType, selectedDifficulty, selectedCategory]);

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

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/institution/question-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load templates. Please try again or contact support if the problem persists.`);
    }
  };

  const handleCreateQuestion = async () => {
    if (!formData.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }

    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        toast.success('Question created successfully');
        setShowCreateDialog(false);
        setFormData({
          question_text: '',
          question_type: 'MULTIPLE_CHOICE',
          options: ['', '', '', ''],
          correct_answer: '',
          explanation: '',
          difficulty: 'MEDIUM',
          category: '',
          tags: '',
          points: 1
        });
        fetchQuestions();
      } else {
        toast.error('Failed to create question');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question');
    }
  };

  const handleEditQuestion = async () => {
    if (!editingQuestion || !formData.question_text.trim()) {
      toast.error('Question text is required');
      return;
    }

    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions/${editingQuestion.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        toast.success('Question updated successfully');
        setEditingQuestion(null);
        setFormData({
          question_text: '',
          question_type: 'MULTIPLE_CHOICE',
          options: ['', '', '', ''],
          correct_answer: '',
          explanation: '',
          difficulty: 'MEDIUM',
          category: '',
          tags: '',
          points: 1
        });
        fetchQuestions();
      } else {
        toast.error('Failed to update question');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions/${questionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Question deleted successfully');
        fetchQuestions();
      } else {
        toast.error('Failed to delete question');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete question');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      toast.error('No questions selected');
      return;
    }

    try {
      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions/bulk-delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIds: selectedQuestions })
      });

      if (response.ok) {
        toast.success(`${selectedQuestions.length} question(s) deleted successfully`);
        setSelectedQuestions([]);
        setShowBulkDeleteDialog(false);
        fetchQuestions();
      } else {
        toast.error('Failed to delete questions');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting questions. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete questions');
    }
  };

  const handleImportQuestions = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch(`/api/institution/question-banks/${questionBankId}/questions/import`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success('Questions imported successfully');
        setShowImportDialog(false);
        setImportFile(null);
        fetchQuestions();
      } else {
        toast.error('Failed to import questions');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to importing questions:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to import questions');
    }
  };

  const openEditDialog = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      question_type: question.question_type,
      options: Array.isArray(question.options) ? question.options : ['', '', '', ''],
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      difficulty: question.difficulty,
      category: question.category || '',
      tags: Array.isArray(question.tags) ? question.tags.join(', ') : '',
      points: question.points
    });
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
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;
      const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
      return matchesSearch && matchesType && matchesDifficulty && matchesCategory;
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
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty_level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    return matchesSearch && matchesType && matchesDifficulty && matchesCategory;
  });

  const types = [...new Set(questions.map(question => question.question_type))];
  const difficulties = [...new Set(questions.map(question => question.difficulty_level))];
  const categories = [...new Set(questions.map(question => question.category).filter(Boolean))];

  // Analytics data
  const analytics = {
    totalQuestions: questions.length,
    byType: types.reduce((acc, type) => {
      acc[type] = questions.filter(q => q.question_type === type).length;
      return acc;
    }, {} as Record<string, number>),
    byDifficulty: difficulties.reduce((acc, difficulty) => {
      acc[difficulty] = questions.filter(q => q.difficulty_level === difficulty).length;
      return acc;
    }, {} as Record<string, number>),
    averagePoints: questions.length > 0 ? 
      (questions.reduce((sum, q) => sum + q.points, 0) / questions.length).toFixed(1) : 0,
    totalPoints: questions.reduce((sum, q) => sum + q.points, 0)
  };

  const formData = {
    question_text: '',
    question_type: 'MULTIPLE_CHOICE',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    difficulty: 'MEDIUM',
    category: '',
    tags: '',
    points: 1
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
              onClick={() => router.push('/institution/question-banks')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Question Banks
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{questionBank.name}</h1>
          <p className="text-muted-foreground">
            {questionBank.description || 'No description'}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import Questions
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Import Questions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="import-file">Select JSON file</Label>
                  <Input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleImportQuestions} disabled={!importFile}>
                    Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="question-text">Question Text</Label>
                  <Textarea
                    id="question-text"
                    value={formData.question_text}
                    onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="question-type">Question Type</Label>
                    <Select value={formData.question_type} onValueChange={(value) => setFormData({ ...formData, question_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DIFFICULTY_LEVELS.map(level => (
                          <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {formData.question_type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...formData.options];
                            newOptions[index] = e.target.value;
                            setFormData({ ...formData, options: newOptions });
                          }}
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="radio"
                          name="correct_answer"
                          checked={formData.correct_answer === option}
                          onChange={() => setFormData({ ...formData, correct_answer: option })}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Grammar, Vocabulary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., beginner, grammar, vocabulary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explain why this answer is correct..."
                    rows={2}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateQuestion}>
                    Add Question
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Question Bank Info */}
      <div className="flex items-center space-x-4">
        {questionBank.category && (
          <Badge variant="secondary">{questionBank.category}</Badge>
        )}
        {questionBank.is_public && (
          <Badge variant="outline">Public</Badge>
        )}
        {questionBank.tags && Array.isArray(questionBank.tags) && questionBank.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {questionBank.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
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
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold">{analytics.totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Points</p>
                <p className="text-2xl font-bold">{analytics.averagePoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold">{new Date(questionBank.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations Bar */}
      {selectedQuestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedQuestions.length} question(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedQuestions([])}
                  className="text-blue-600 border-blue-300 hover:bg-blue-100"
                >
                  Clear Selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBulkDeleteDialog(true)}
                        className="text-red-600 border-red-300 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete Selected
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete selected questions</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Label htmlFor="category-filter">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
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
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
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
                                onClick={() => openEditDialog(question)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Question</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}
                      </Badge>
                      <Badge variant="outline">{question.difficulty_level}</Badge>
                      <Badge variant="outline">{question.points} pts</Badge>
                      {question.category && (
                        <Badge variant="outline">{question.category}</Badge>
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
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
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

      {/* Edit Question Dialog */}
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question-text">Question Text</Label>
              <Textarea
                id="edit-question-text"
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-question-type">Question Type</Label>
                <Select value={formData.question_type} onValueChange={(value) => setFormData({ ...formData, question_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.question_type === 'MULTIPLE_CHOICE' && (
              <div className="space-y-2">
                <Label>Options</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.options];
                        newOptions[index] = e.target.value;
                        setFormData({ ...formData, options: newOptions });
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                    <input
                      type="radio"
                      name="edit-correct_answer"
                      checked={formData.correct_answer === option}
                      onChange={() => setFormData({ ...formData, correct_answer: option })}
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Grammar, Vocabulary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-points">Points</Label>
                <Input
                  id="edit-points"
                  type="number"
                  min="1"
                  value={formData.points}
                  onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., beginner, grammar, vocabulary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-explanation">Explanation (Optional)</Label>
              <Textarea
                id="edit-explanation"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explain why this answer is correct..."
                rows={2}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditQuestion}>
                Update Question
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Delete {selectedQuestions.length} Question(s)</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedQuestions.length} question(s) from this question bank.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {filteredQuestions.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first question'
            }
          </p>
          {!searchTerm && selectedType === 'all' && selectedDifficulty === 'all' && selectedCategory === 'all' && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Question
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 