'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  MoreHorizontal,
  FileText,
  CheckSquare,
  Square,
  Target,
  BookOpen,
  Users,
  Calendar,
  Star,
  Zap,
  Shield,
  Globe,
  Lock,
  BarChart3,
  TrendingUp,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface QuestionTemplate {
  id: string;
  name: string;
  description: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'essay';
  template_data: unknown;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  usage_count: number;
  created_by: string;
  version: number;
}

interface QuestionBank {
  id: string;
  name: string;
  description: string;
  category: string;
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
  { value: 'ORDERING', label: 'Ordering' },
  { value: 'MULTIPLE_ANSWER', label: 'Multiple Answer' },
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export default function InstitutionQuestionTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<QuestionTemplate[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    question_type: 'multiple_choice' as const,
    template_data: {
      question_text: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      difficulty_level: 'medium' as const,
      points: 1,
      tags: []
    },
    is_public: false
  });

  useEffect(() => {
    fetchTemplates();
    fetchQuestionBanks();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/question-templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      } else {
        toast.error('Failed to fetch question templates');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load question templates. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch question templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionBanks = async () => {
    try {
      const response = await fetch('/api/institution/question-banks');
      if (response.ok) {
        const data = await response.json();
        setQuestionBanks(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load question banks. Please try again or contact support if the problem persists.`);
    }
  };

  const handleCreateTemplate = async () => {
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Question template created successfully');
        setShowCreateDialog(false);
        setFormData({
          name: '',
          description: '',
          question_type: 'multiple_choice',
          template_data: {
            question_text: '',
            options: ['', '', '', ''],
            correct_answer: '',
            explanation: '',
            difficulty_level: 'medium',
            points: 1,
            tags: []
          },
          is_public: false
        });
        fetchTemplates();
      } else {
        toast.error('Failed to create question template');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating question template. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question template');
    }
  };

  const handleCopyTemplate = async (questionBankId: string) => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/institution/question-templates/${selectedTemplate.id}/copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionBankId })
      });

      if (response.ok) {
        toast.success('Question created from template');
        setShowCopyDialog(false);
        setSelectedTemplate(null);
      } else {
        toast.error('Failed to create question from template');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to copying template. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question from template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this question template?')) return;

    try {
      const response = await fetch(`/api/institution/question-templates/${templateId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Question template deleted successfully');
        fetchTemplates();
      } else {
        toast.error('Failed to delete question template');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting question template. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete question template');
    }
  };

  const getQuestionTypeIcon = (type: string) => {
    switch (type) {
      case 'multiple_choice': return <CheckSquare className="w-4 h-4" />;
      case 'true_false': return <Square className="w-4 h-4" />;
      case 'fill_blank': return <Target className="w-4 h-4" />;
      case 'essay': return <BookOpen className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || template.question_type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || template.template_data.difficulty_level === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || template.template_data.tags.includes(selectedCategory);
    return matchesSearch && matchesType && matchesDifficulty && matchesCategory;
  });

  const types = [...new Set(templates.map(template => template.question_type))];
  const difficulties = [...new Set(templates.map(template => template.template_data.difficulty_level))];
  const categories = [...new Set(templates.map(template => template.template_data.tags).flat())];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Templates</h1>
          <p className="text-gray-600">Create and manage reusable question templates</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Public Templates</p>
                <p className="text-2xl font-bold">{templates.filter(t => t.is_public).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{templates.reduce((sum, t) => sum + t.usage_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Most Used</p>
                <p className="text-2xl font-bold">
                  {templates.length > 0 ? Math.max(...templates.map(t => t.usage_count)) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 search-container-long">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
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
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getQuestionTypeIcon(template.question_type)}
                  <Badge variant="outline" className="text-xs">
                    {template.question_type.replace('_', ' ')}
                  </Badge>
                  <Badge variant={template.is_public ? 'default' : 'secondary'} className="text-xs">
                    {template.is_public ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                    {template.is_public ? 'Public' : 'Private'}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/institution/question-templates/${template.id}/analytics`)}
                    title="View Analytics"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowCopyDialog(true);
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteTemplate(template.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium">Question:</span>
                  <p className="text-gray-600 mt-1">{template.template_data.question_text}</p>
                </div>
                
                {template.template_data.options && template.template_data.options.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Options:</span>
                    <ul className="text-gray-600 mt-1 space-y-1">
                      {template.template_data.options.map((option: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Used {template.usage_count} times</span>
                  <span>{new Date(template.created_at).toLocaleDateString()}</span>
                  <span className="flex items-center space-x-1">
                    <History className="w-3 h-3" />
                    <span>v{template.version}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {template.template_data.difficulty_level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.template_data.points} pts
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first question template'
              }
            </p>
            {!searchTerm && selectedType === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Question Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Template Name</label>
              <Input
                placeholder="Enter template name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe the template"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Question Type</label>
              <Select 
                value={formData.question_type} 
                onValueChange={(value: unknown) => setFormData(prev => ({ ...prev, question_type: value }))}
              >
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
            <div>
              <label className="text-sm font-medium">Question Text</label>
              <Textarea
                placeholder="Enter the question text"
                value={formData.template_data.question_text}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  template_data: { ...prev.template_data, question_text: e.target.value }
                }))}
              />
            </div>
            {formData.question_type === 'multiple_choice' && (
              <div>
                <label className="text-sm font-medium">Options</label>
                {formData.template_data.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...formData.template_data.options];
                        newOptions[index] = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          template_data: { ...prev.template_data, options: newOptions }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select 
                  value={formData.template_data.difficulty_level}
                  onValueChange={(value: unknown) => setFormData(prev => ({
                    ...prev,
                    template_data: { ...prev.template_data, difficulty_level: value }
                  }))}
                >
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
              <div>
                <label className="text-sm font-medium">Points</label>
                <Input
                  type="number"
                  placeholder="Points"
                  value={formData.template_data.points}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    template_data: { ...prev.template_data, points: parseInt(e.target.value) || 1 }
                  }))}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_public" className="text-sm font-medium">
                Make template public
              </label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>Create Template</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Template Dialog */}
      <Dialog open={showCopyDialog} onOpenChange={setShowCopyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Question from Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Question Bank</label>
              <Select onValueChange={(value) => handleCopyTemplate(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a question bank" />
                </SelectTrigger>
                <SelectContent>
                  {questionBanks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setShowCopyDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 