'use client';

import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  UnsavedChangesDialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types";
import { toast } from 'sonner';

interface EditCategoryDialogProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditCategoryDialog({
  category,
  open,
  onOpenChange,
  onSuccess,
}: EditCategoryDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    } else {
      setName('');
      setDescription('');
    }
    setHasUnsavedChanges(false);
  }, [category]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }

      toast.success('Category updated successfully');
      setHasUnsavedChanges(false);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to updating category. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmClose = () => {
    setName('');
    setDescription('');
    setHasUnsavedChanges(false);
  };

  return (
    <UnsavedChangesDialog
      open={open}
      onOpenChange={onOpenChange}
      hasUnsavedChanges={hasUnsavedChanges}
      onConfirmClose={handleConfirmClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              disabled={loading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={handleDescriptionChange}
              disabled={loading}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="update"
              disabled={loading || !hasUnsavedChanges}
              className={!hasUnsavedChanges ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </UnsavedChangesDialog>
  );
} 