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
import { Plus, Edit, Trash2, Eye, Search, Filter, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: unknown;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  created_by: string;
}

export default function QuestionBanksPage() {
  const router = useRouter();
  const [banks, setBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingBank, setEditingBank] = useState<QuestionBank | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    is_public: false
  });

  useEffect(() => {
    fetchQuestionBanks();
  }, []);

  const fetchQuestionBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/question-banks');
      if (response.ok) {
        const data = await response.json();
        setBanks(data);
      } else {
        toast.error('Failed to fetch question banks');
      }
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to load question banks:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch question banks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBank = async () => {
    if (!formData.name.trim()) {
      toast.error('Bank name is required');
      return;
    }

    try {
      const response = await fetch('/api/admin/question-banks', {
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
      toast.error(`Failed to creating question bank:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create question bank');
    }
  };

  const handleEditBank = async () => {
    if (!editingBank || !formData.name.trim()) {
      toast.error('Bank name is required');
      return;
    }

    try {
      const response = await fetch(`/api/admin/question-banks/${editingBank.id}`, {
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
      toast.error(`Failed to updating question bank:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update question bank');
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    if (!confirm('Are you sure you want to delete this question bank?')) return;

    try {
      const response = await fetch(`/api/admin/question-banks/${bankId}`, {
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
      toast.error(`Failed to deleting question bank:. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete question bank');
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

  const filteredBanks = banks.filter(bank => {
    const matchesSearch = bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bank.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || bank.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(banks.map(bank => bank.category).filter(Boolean))];

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
            Manage collections of reusable questions for quizzes
          </p>
        </div>
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
                <div className="flex-1">
                  <CardTitle className="text-lg">{bank.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bank.description || 'No description'}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/admin/question-banks/${bank.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(bank)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBank(bank.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
                  {bank.questions_count || 0} questions
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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

      {filteredBanks.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No question banks found</p>
        </div>
      )}
    </div>
  );
} 