'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, Search, Filter, Database, Download, Upload, Users, FileText, Copy, Share2, CheckSquare, Square, Download as DownloadIcon, Tag, AlertTriangle } from 'lucide-react';
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

interface QuestionTemplate {
  id: string;
  name: string;
  description?: string;
  type: string;
  template_config: unknown;
  category?: string;
  difficulty: string;
  tags?: unknown;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
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

export default function InstitutionQuestionBanksPage() {
  const router = useRouter();
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [questionTemplates, setQuestionTemplates] = useState<QuestionTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showBulkCategoryDialog, setShowBulkCategoryDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<QuestionTemplate | null>(null);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [bulkCategory, setBulkCategory] = useState('');
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    is_public: false
  });
  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    description: '',
    type: 'MULTIPLE_CHOICE',
    template_config: {},
    category: '',
    difficulty: 'MEDIUM',
    tags: '',
    is_public: false
  });
  const [importFile, setImportFile] = useState<File | null>(null);

  useEffect(() => {
    fetchQuestionBanks();
    fetchQuestionTemplates();
  }, []);

  useEffect(() => {
    // Update select all state based on filtered banks
    const filteredBanks = questionBanks.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || bank.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    setSelectAll(selectedBanks.length > 0 && selectedBanks.length === filteredBanks.length);
  }, [selectedBanks, questionBanks, searchTerm, selectedCategory]);

  const fetchQuestionBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/question-banks');
      if (response.ok) {
        const data = await response.json();
        setQuestionBanks(data);
      } else {
        toast.error('Failed to fetch question banks');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load question banks. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch question banks');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionTemplates = async () => {
    try {
      const response = await fetch('/api/institution/question-templates');
      if (response.ok) {
        const data = await response.json();
        setQuestionTemplates(data);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load question templates. Please try again or contact support if the problem persists.`);
    }
  };

  const handleCreateBank = async () => {
    if (!formData.name.trim()) {
      toast.error('Question bank name is required');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-banks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        toast.success('Question bank created successfully');
        setShowCreateDialog(false);
        setFormData({ name: '', description: '', category: '', tags: '', is_public: false });
        fetchQuestionBanks();
      } else {
        toast.error('Failed to create question bank');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question bank');
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateFormData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...templateFormData,
          tags: templateFormData.tags ? templateFormData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        toast.success('Question template created successfully');
        setShowTemplateDialog(false);
        setTemplateFormData({ name: '', description: '', type: 'MULTIPLE_CHOICE', template_config: {}, category: '', difficulty: 'MEDIUM', tags: '', is_public: false });
        fetchQuestionTemplates();
      } else {
        toast.error('Failed to create question template');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating question template. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question template');
    }
  };

  const handleEditBank = async () => {
    if (!editingBank || !formData.name.trim()) {
      toast.error('Question bank name is required');
      return;
    }

    try {
      const response = await fetch(`/api/institution/question-banks/${editingBank.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
        })
      });

      if (response.ok) {
        toast.success('Question bank updated successfully');
        setEditingBank(null);
        setFormData({ name: '', description: '', category: '', tags: '', is_public: false });
        fetchQuestionBanks();
      } else {
        toast.error('Failed to update question bank');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update question bank');
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this question bank? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/institution/question-banks/${bankId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Question bank deleted successfully');
        fetchQuestionBanks();
      } else {
        toast.error('Failed to delete question bank');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete question bank');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBanks.length === 0) {
      toast.error('No question banks selected');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-banks/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankIds: selectedBanks })
      });

      if (response.ok) {
        toast.success(`${selectedBanks.length} question bank(s) deleted successfully`);
        setSelectedBanks([]);
        setShowBulkDeleteDialog(false);
        fetchQuestionBanks();
      } else {
        toast.error('Failed to delete question banks');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to deleting question banks. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete question banks');
    }
  };

  const handleBulkCategoryUpdate = async () => {
    if (selectedBanks.length === 0) {
      toast.error('No question banks selected');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-banks/bulk-update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          bankIds: selectedBanks,
          updates: { category: bulkCategory }
        })
      });

      if (response.ok) {
        toast.success(`Category updated for ${selectedBanks.length} question bank(s)`);
        setSelectedBanks([]);
        setShowBulkCategoryDialog(false);
        setBulkCategory('');
        fetchQuestionBanks();
      } else {
        toast.error('Failed to update question banks');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to updating question banks. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update question banks');
    }
  };

  const handleBulkExport = async () => {
    if (selectedBanks.length === 0) {
      toast.error('No question banks selected');
      return;
    }

    try {
      const response = await fetch('/api/institution/question-banks/bulk-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankIds: selectedBanks })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question-banks-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success(`${selectedBanks.length} question bank(s) exported successfully`);
      } else {
        toast.error('Failed to export question banks');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to exporting question banks. Please try again or contact support if the problem persists.`);
      toast.error('Failed to export question banks');
    }
  };

  const handleImportBank = async () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', importFile);

      const response = await fetch('/api/institution/question-banks/import', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success('Question bank imported successfully');
        setShowImportDialog(false);
        setImportFile(null);
        fetchQuestionBanks();
      } else {
        toast.error('Failed to import question bank');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to importing question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to import question bank');
    }
  };

  const handleCopyBank = async (bankId: string) => {
    try {
      const response = await fetch(`/api/institution/question-banks/${bankId}/copy`, {
        method: 'POST'
      });

      if (response.ok) {
        toast.success('Question bank copied successfully');
        fetchQuestionBanks();
      } else {
        toast.error('Failed to copy question bank');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to copying question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to copy question bank');
    }
  };

  const handleExportBank = async (bankId: string) => {
    try {
      const response = await fetch(`/api/institution/question-banks/${bankId}/export`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `question-bank-${bankId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Question bank exported successfully');
      } else {
        toast.error('Failed to export question bank');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to exporting question bank. Please try again or contact support if the problem persists.`);
      toast.error('Failed to export question bank');
    }
  };

  const openEditDialog = (bank: QuestionBank) => {
    setEditingBank(bank);
    setFormData({
      name: bank.name,
      description: bank.description || '',
      category: bank.category || '',
      tags: Array.isArray(bank.tags) ? bank.tags.join(', ') : '',
      is_public: bank.is_public
    });
  };

  const handleSelectBank = (bankId: string) => {
    setSelectedBanks(prev => 
      prev.includes(bankId) 
        ? prev.filter(id => id !== bankId)
        : [...prev, bankId]
    );
  };

  const handleSelectAll = () => {
    const filteredBanks = questionBanks.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bank.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || bank.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    if (selectAll) {
      setSelectedBanks([]);
    } else {
      setSelectedBanks(filteredBanks.map(bank => bank.id));
    }
  };

  const filteredBanks = questionBanks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || bank.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(questionBanks.map(bank => bank.category).filter(Boolean))];

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
          <h1 className="text-3xl font-bold tracking-tight">Question Banks</h1>
          <p className="text-muted-foreground">
            Manage collections of reusable questions and templates for your institution
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Question Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={templateFormData.name}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={templateFormData.description}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, description: e.target.value })}
                    placeholder="Enter template description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Question Type</Label>
                    <Select value={templateFormData.type} onValueChange={(value) => setTemplateFormData({ ...templateFormData, type: value })}>
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
                    <Label htmlFor="template-difficulty">Difficulty</Label>
                    <Select value={templateFormData.difficulty} onValueChange={(value) => setTemplateFormData({ ...templateFormData, difficulty: value })}>
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
                <div className="space-y-2">
                  <Label htmlFor="template-category">Category</Label>
                  <Input
                    id="template-category"
                    value={templateFormData.category}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, category: e.target.value })}
                    placeholder="e.g., Grammar, Vocabulary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="template-tags">Tags (comma-separated)</Label>
                  <Input
                    id="template-tags"
                    value={templateFormData.tags}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, tags: e.target.value })}
                    placeholder="e.g., beginner, grammar, vocabulary"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="template-is_public"
                    checked={templateFormData.is_public}
                    onChange={(e) => setTemplateFormData({ ...templateFormData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="template-is_public">Make public (available to all institutions)</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTemplate}>
                    Create Template
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Import Question Bank</DialogTitle>
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
                  <Button onClick={handleImportBank} disabled={!importFile}>
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
                Create Question Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Question Bank</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter question bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description"
                    rows={3}
                  />
                </div>
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
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="e.g., beginner, grammar, vocabulary"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={formData.is_public}
                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_public">Make public (available to all institutions)</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBank}>
                    Create Bank
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Banks</p>
                <p className="text-2xl font-bold">{questionBanks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Templates</p>
                <p className="text-2xl font-bold">{questionTemplates.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Public Banks</p>
                <p className="text-2xl font-bold">{questionBanks.filter(bank => bank.is_public).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Share2 className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{questionBanks.reduce((sum, bank) => sum + (bank.question_count || 0), 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations Bar */}
      {selectedBanks.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedBanks.length} question bank(s) selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBanks([])}
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
                        onClick={() => setShowBulkCategoryDialog(true)}
                        className="text-green-600 border-green-300 hover:bg-green-100"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        Update Category
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Update category for selected banks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkExport}
                        className="text-orange-600 border-orange-300 hover:bg-orange-100"
                      >
                        <DownloadIcon className="w-4 h-4 mr-1" />
                        Export Selected
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Export selected question banks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                      <p>Delete selected question banks</p>
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative search-container-long">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search question banks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Label htmlFor="category-filter">Category</Label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-input rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Banks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBanks.map((bank) => (
          <Card key={bank.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <button
                    onClick={() => handleSelectBank(bank.id)}
                    className="mt-1 text-gray-400 hover:text-gray-600"
                  >
                    {selectedBanks.includes(bank.id) ? (
                      <CheckSquare className="w-4 h-4" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{bank.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {bank.description || 'No description'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/institution/question-banks/${bank.id}`)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Bank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(bank)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-green-600 hover:bg-green-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Bank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyBank(bank.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-purple-600 hover:bg-purple-50"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy Bank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportBank(bank.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export Bank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBank(bank.id)}
                          className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Bank</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {bank.category && (
                  <Badge variant="secondary">{bank.category}</Badge>
                )}
                {bank.is_public && (
                  <Badge variant="outline">Public</Badge>
                )}
                <div className="text-sm text-muted-foreground">
                  {bank.question_count || 0} questions
                </div>
                {bank.tags && Array.isArray(bank.tags) && bank.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bank.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {bank.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{bank.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Created {new Date(bank.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Select All Bar */}
      {filteredBanks.length > 0 && (
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
              {selectAll ? 'Deselect All' : 'Select All'} ({filteredBanks.length} banks)
            </span>
          </div>
          {selectedBanks.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedBanks.length} selected
            </span>
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingBank} onOpenChange={() => setEditingBank(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Question Bank</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter question bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
                rows={3}
              />
            </div>
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
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., beginner, grammar, vocabulary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-is_public">Make public (available to all institutions)</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingBank(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditBank}>
                Update Bank
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Category Update Dialog */}
      <Dialog open={showBulkCategoryDialog} onOpenChange={setShowBulkCategoryDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Category for {selectedBanks.length} Question Bank(s)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-category">Category</Label>
              <Input
                id="bulk-category"
                value={bulkCategory}
                onChange={(e) => setBulkCategory(e.target.value)}
                placeholder="Enter new category"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBulkCategoryDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleBulkCategoryUpdate}>
                Update Category
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
              <span>Delete {selectedBanks.length} Question Bank(s)</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedBanks.length} question bank(s) and all their questions.
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

      {filteredBanks.length === 0 && !loading && (
        <div className="text-center py-12">
          <Database className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No question banks found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first question bank'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Question Bank
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 