'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Filter, Globe, Users, Lock, Copy, Eye, Star, Download, Share2, Building } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SharedQuestion {
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
  is_shared: boolean;
  shared_with: string[];
  sharing_permissions: {
    allowCopy: boolean;
    allowModify: boolean;
  };
  shared_message?: string;
  shared_by: string;
  shared_at: string;
  questionBank: {
    id: string;
    name: string;
    description?: string;
    category?: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
  };
  institution: {
    id: string;
    name: string;
    country?: string;
  };
  usage_count: number;
  rating: number;
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

export default function SharedQuestionsPage() {
  const router = useRouter();
  const [sharedQuestions, setSharedQuestions] = useState<SharedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SharedQuestion | null>(null);

  useEffect(() => {
    fetchSharedQuestions();
  }, []);

  const fetchSharedQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/shared-questions');
      if (response.ok) {
        const data = await response.json();
        setSharedQuestions(data);
      } else {
        toast.error('Failed to fetch shared questions');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load shared questions. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch shared questions');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyQuestion = async (questionId: string) => {
    try {
      const response = await fetch(`/api/institution/questions/${questionId}/copy`, {
        method: 'POST'
      });

      if (response.ok) {
        toast.success('Question copied to your question banks successfully');
        fetchSharedQuestions(); // Refresh to update usage count
      } else {
        toast.error('Failed to copy question');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to copying question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to copy question');
    }
  };

  const handleRateQuestion = async (questionId: string, rating: number) => {
    try {
      const response = await fetch(`/api/institution/questions/${questionId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        toast.success('Rating submitted successfully');
        fetchSharedQuestions(); // Refresh to update rating
      } else {
        toast.error('Failed to submit rating');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to rating question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to submit rating');
    }
  };

  const openQuestionDialog = (question: SharedQuestion) => {
    setSelectedQuestion(question);
    setShowQuestionDialog(true);
  };

  const filteredQuestions = sharedQuestions.filter(question => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.explanation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.questionBank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.institution.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || question.question_type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesInstitution = selectedInstitution === 'all' || question.institution.id === selectedInstitution;
    return matchesSearch && matchesType && matchesDifficulty && matchesCategory && matchesInstitution;
  });

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.shared_at).getTime() - new Date(a.shared_at).getTime();
      case 'popular':
        return b.usage_count - a.usage_count;
      case 'rating':
        return b.rating - a.rating;
      case 'difficulty':
        const difficultyOrder = { 'EASY': 1, 'MEDIUM': 2, 'HARD': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const types = [...new Set(sharedQuestions.map(question => question.question_type))];
  const difficulties = [...new Set(sharedQuestions.map(question => question.difficulty))];
  const categories = [...new Set(sharedQuestions.map(question => question.category).filter(Boolean))];
  const institutions = [...new Set(sharedQuestions.map(question => question.institution.id))];

  // Analytics data
  const analytics = {
    totalQuestions: sharedQuestions.length,
    byType: types.reduce((acc, type) => {
      acc[type] = sharedQuestions.filter(q => q.question_type === type).length;
      return acc;
    }, {} as Record<string, number>),
    byDifficulty: difficulties.reduce((acc, difficulty) => {
      acc[difficulty] = sharedQuestions.filter(q => q.difficulty === difficulty).length;
      return acc;
    }, {} as Record<string, number>),
    totalInstitutions: institutions.length,
    averageRating: sharedQuestions.length > 0 ? 
      (sharedQuestions.reduce((sum, q) => sum + q.rating, 0) / sharedQuestions.length).toFixed(1) : 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Questions</h1>
          <p className="text-muted-foreground">
            Discover and use questions shared by other institutions
          </p>
        </div>
        <Button onClick={() => router.push('/institution/question-banks')}>
          <Plus className="w-4 h-4 mr-2" />
          My Question Banks
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
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
              <Building className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Institutions</p>
                <p className="text-2xl font-bold">{analytics.totalInstitutions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{analytics.averageRating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Copy className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Most Used</p>
                <p className="text-2xl font-bold">
                  {sharedQuestions.length > 0 ? Math.max(...sharedQuestions.map(q => q.usage_count)) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Recently Added</p>
                <p className="text-2xl font-bold">
                  {sharedQuestions.filter(q => {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(q.shared_at) > oneWeekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search questions, banks, or institutions..."
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
            <div>
              <Label htmlFor="institution-filter">Institution</Label>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {institutions.map(institutionId => {
                    const institution = sharedQuestions.find(q => q.institution.id === institutionId)?.institution;
                    return (
                      <SelectItem key={institutionId} value={institutionId}>
                        {institution?.name || 'Unknown'}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="sort-filter">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="difficulty">Difficulty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{question.question_text}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: {question.questionBank.name}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openQuestionDialog(question)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyQuestion(question.id)}
                          disabled={!question.sharing_permissions.allowCopy}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-50"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{question.sharing_permissions.allowCopy ? 'Copy Question' : 'Copying Not Allowed'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {QUESTION_TYPES.find(t => t.value === question.question_type)?.label || question.question_type}
                  </Badge>
                  <Badge variant="outline">{question.difficulty}</Badge>
                  <Badge variant="outline">{question.points} pts</Badge>
                  {question.category && (
                    <Badge variant="outline">{question.category}</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4" />
                    <span>{question.institution.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{question.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Copy className="w-4 h-4" />
                    <span>{question.usage_count} uses</span>
                  </div>
                  <span>{new Date(question.shared_at).toLocaleDateString()}</span>
                </div>

                {question.tags && Array.isArray(question.tags) && question.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {question.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{question.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {question.shared_message && (
                  <p className="text-sm text-muted-foreground italic">
                    "{question.shared_message}"
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Question Detail Dialog */}
      <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuestion && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Question</Label>
                <p className="mt-1">{selectedQuestion.question_text}</p>
              </div>
              
              {selectedQuestion.explanation && (
                <div>
                  <Label className="text-sm font-medium">Explanation</Label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedQuestion.explanation}</p>
                </div>
              )}

              {selectedQuestion.options && Array.isArray(selectedQuestion.options) && selectedQuestion.options.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Options</Label>
                  <div className="mt-1 space-y-1">
                    {selectedQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`text-sm p-2 rounded ${
                          option === selectedQuestion.correct_answer
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Question Bank</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.questionBank.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Institution</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.institution.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.difficulty}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Points</Label>
                  <p className="mt-1 text-sm">{selectedQuestion.points}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">{selectedQuestion.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Copy className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedQuestion.usage_count} uses</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRateQuestion(selectedQuestion.id, 5)}
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Rate 5★
                  </Button>
                  <Button
                    onClick={() => handleCopyQuestion(selectedQuestion.id)}
                    disabled={!selectedQuestion.sharing_permissions.allowCopy}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy Question
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {sortedQuestions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No shared questions found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedType !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all' || selectedInstitution !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No questions have been shared yet'
            }
          </p>
        </div>
      )}
    </div>
  );
} 