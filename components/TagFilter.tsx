'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  usageCount: number;
}

interface TagFilterProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export function TagFilter({ selectedTags, onTagsChange, className }: TagFilterProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      // Fetch all tags used in published courses, regardless of featured status
      const response = await fetch('/api/tags/public?limit=50', {
        cache: 'no-store' // Ensure fresh data
      });
      if (!response.ok) throw new Error('Failed to fetch tags');
      
      const data = await response.json();
      // Sort tags alphabetically by name
      const sortedData = data.sort((a: Tag, b: Tag) => a.name.localeCompare(b.name));
      setTags(sortedData);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tags when popover opens to ensure fresh data
  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  // Also fetch on initial mount
  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagToggle = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTags.filter(id => id !== tagId));
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  const filteredTags = tags
    .filter(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const selectedTagObjects = tags.filter(tag => selectedTags.includes(tag.id));

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected Tags Display */}
      {selectedTagObjects.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTagObjects.map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 text-xs"
              style={{
                backgroundColor: tag.color || 'hsl(var(--secondary))',
                color: tag.color ? '#fff' : 'hsl(var(--secondary-foreground))'
              }}
            >
              {tag.name}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="ml-1 hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllTags}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Tag Filter Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between"
          >
            {selectedTags.length > 0 
              ? `${selectedTags.length} tag${selectedTags.length === 1 ? '' : 's'} selected`
              : "Filter by tags"
            }
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white border border-gray-200 shadow-lg" align="start">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 bg-white flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchTags}
                disabled={isLoading}
                className="h-8 w-8 p-0"
                title="Refresh tags"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <ScrollArea className="h-64">
            <div className="p-2">
              {isLoading ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  Loading tags...
                </div>
              ) : filteredTags.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No tags found
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.id)}
                      className={cn(
                        "flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                        selectedTags.includes(tag.id) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: tag.color || undefined,
                            color: tag.color || undefined
                          }}
                        >
                          {tag.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({tag.usageCount})
                        </span>
                      </div>
                      {selectedTags.includes(tag.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
} 