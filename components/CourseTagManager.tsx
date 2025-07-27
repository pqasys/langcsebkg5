'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import * as LucideIcons from 'lucide-react';
import { Label } from "@/components/ui/label";
import React from 'react';

export interface Tag {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

interface CourseTagManagerProps {
  selectedTags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  courses?: unknown[];
}

export function CourseTagManager({ selectedTags, onTagsChange, courses }: CourseTagManagerProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Update local tags when selectedTags change
  useEffect(() => {
    console.log('CourseTagManager: selectedTags prop changed:', selectedTags);
    if (selectedTags && Array.isArray(selectedTags)) {
      const validTags = selectedTags.filter(tag => tag && tag.id && tag.name);
      console.log('CourseTagManager: Valid tags from props:', validTags);
      setTags(validTags);
    } else {
      console.log('CourseTagManager: No valid selectedTags provided');
      setTags([]);
    }
  }, [selectedTags]);

  useEffect(() => {
    fetchAvailableTags();
  }, []);

  const fetchAvailableTags = async () => {
    try {
      setIsLoading(true);
      console.log('CourseTagManager: Fetching available tags...');
      const response = await fetch('/api/tags', {
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('CourseTagManager: API response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('CourseTagManager: API error:', error);
        throw new Error(error.error || 'Failed to fetch tags');
      }
      
      const data = await response.json();
      console.log('CourseTagManager: API response data:', data);
      
      if (!Array.isArray(data)) {
        console.error('CourseTagManager: Invalid response format:', data);
        throw new Error(`Invalid response format from server - Context: throw new Error('Invalid response format from serv...`);
      }
      
      const validTags = data.filter(tag => tag && tag.id && tag.name);
      console.log('CourseTagManager: Valid tags found:', validTags.length);
      setAvailableTags(validTags);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to load tags. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : "Failed to load available tags");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async (tag: Tag) => {
    if (tags.some(t => t.id === tag.id)) {
      toast.warning("This tag is already added to the course");
      return;
    }

    try {
      const newTags = [...tags, {
        id: tag.id,
        name: tag.name,
        color: tag.color,
        icon: tag.icon
      }];
      setTags(newTags);
      if (onTagsChange) {
        onTagsChange(newTags);
      }
      toast.success('Tag added successfully');
    } catch (error) {
    console.error('Error occurred:', error);
	  toast.error(`Failed to adding tag. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    try {
      const newTags = tags.filter(tag => tag.id !== tagId);
      setTags(newTags);
      if (onTagsChange) {
        onTagsChange(newTags);
      }
      toast.success('Tag removed successfully');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to removing tag. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to remove tag');
    }
  };

  const handleCreateTag = async () => {
    if (!newTag.trim()) return;

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        credentials: 'include',
        body: JSON.stringify({ 
          name: newTag,
          color: '#3b82f6',
          icon: 'Tag'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create tag');
      }
      
      const createdTag = await response.json();
      await handleAddTag(createdTag);
      setNewTag('');
      await fetchAvailableTags();
      
      toast.success("Tag created successfully");
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating tag. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : "Failed to create tag");
    }
  };

  const filteredTags = availableTags
    .filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !tags.some(t => t.id === tag.id)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      {/* Tag Search and Creation */}
		
		{/* Selected Tags */}
		<div className="flex flex-wrap gap-1 mb-2 max-h-[48px] overflow-y-auto">
			{tags.map(tag => (
			  <Badge 
				key={tag.id} 
				variant="secondary" 
				className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium"
				style={{
				  backgroundColor: tag.color || 'hsl(var(--secondary))',
				  color: tag.color ? '#fff' : 'hsl(var(--secondary-foreground))'
				}}
			  >
				{tag.icon && (
				  <span className="mr-1">
					{React.createElement(LucideIcons[tag.icon as keyof typeof LucideIcons], { size: 12 })}
				  </span>
				)}
				{tag.name}
				<button
				  type="button"
				  onClick={() => handleRemoveTag(tag.id)}
				  className="ml-0.5 hover:text-destructive"
				>
				  <X className="h-2 w-2" />
				</button>
			  </Badge>
			))}
		</div>

		
		<div className="grid grid-cols-1 md:grid-cols-1 gap-6 space-y-2">		  
			<div className="flex gap-2">
			  <Input
				type="text"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				placeholder="Search tags..."
				className="flex-1 text-xs h-8"
			  />
			
			  <Input
				type="text"
				value={newTag}
				onChange={(e) => setNewTag(e.target.value)}
				placeholder="Create new tag..."
				className="flex-1 text-xs h-8"
			  />
			  
			  <Button
				type="button"
				onClick={handleCreateTag}
				disabled={!newTag.trim()}
				className="flex items-center gap-1 text-xs h-8"
			  >
				<Plus className="w-3 h-3" />
				Create
			  </Button>  
			</div>			
		</div>
		
		{/* Tag Selection Listbox */}
		<div className="max-h-[120px] overflow-y-auto border rounded-md">
			{isLoading ? (
				<div className="p-2 text-sm text-muted-foreground">Loading tags...</div>
			) : filteredTags.length === 0 ? (
				<div className="p-2 text-sm text-muted-foreground">No tags available</div>
			) : (
				filteredTags.map(tag => (
			  <button
				key={tag.id}
				type="button"
				onClick={() => handleAddTag(tag)}
				className="w-full text-left px-2 py-1 hover:bg-accent rounded-sm flex items-center text-sm"
			  >
				{tag.icon && (
				  <span className="mr-1">
					{React.createElement(LucideIcons[tag.icon as keyof typeof LucideIcons], { size: 12 })}
				  </span>
				)}
				{tag.name}
			  </button>
				))
			)}
		</div>
    </div>
  );
} 