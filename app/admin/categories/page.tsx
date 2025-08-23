'use client';
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react';
import { category } from '@prisma/client';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryList } from '@/components/admin/categories/CategoryList';
import { CategoryGrid } from '@/components/admin/categories/CategoryGrid';
import { EditCategoryDialog } from '@/components/admin/categories/EditCategoryDialog';
import { useToast } from '@/components/ui/use-toast';
import { AddCategoryDialog } from '@/components/admin/categories/AddCategoryDialog';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [editingCategory, setEditingCategory] = useState<category | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: category) => {
    setEditingCategory(category);
  };

  const handleDelete = async (category: category) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete category');

      setCategories(categories.filter((c) => c.id !== category.id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      console.error('Error occurred:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-none container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 overflow-auto">
        {viewMode === 'list' ? (
          <CategoryList
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <CategoryGrid
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      <AddCategoryDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={fetchCategories}
      />

      <EditCategoryDialog
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSuccess={fetchCategories}
      />
    </div>
  );
} 