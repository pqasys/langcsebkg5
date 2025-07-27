import { useState, useEffect } from 'react';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Tag {
  id: string;
  name: string;
  description?: string;
  featured?: boolean;
  priority?: number;
}

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[]) => void;
  className?: string;
}

const CATEGORY_TAGS = ['Technology', 'Business', 'Design', 'Language', 'Science', 'Arts', 'Health'];

export default function TagSelector({ selectedTags, onTagsChange, className = '' }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) throw new Error(`Failed to fetch tags - Context: if (!response.ok) throw new Error('Failed to fetch...`);
        const data = await response.json();
        
        // Ensure category tags are featured and have high priority
        const processedTags = data.map((tag: Tag) => ({
          ...tag,
          featured: CATEGORY_TAGS.includes(tag.name) ? true : tag.featured,
          priority: CATEGORY_TAGS.includes(tag.name) ? 100 : (tag.priority || 0)
        }));

        // Sort tags by featured status and priority
        const sortedTags = processedTags.sort((a: Tag, b: Tag) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (b.priority || 0) - (a.priority || 0);
        });

        setTags(sortedTags);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tags');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  const toggleTag = (tagId: string) => {
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newSelectedTags);
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading tags...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const featuredTags = tags.filter(tag => tag.featured);
  const regularTags = tags.filter(tag => !tag.featured);
  const displayedTags = showAllTags ? tags : featuredTags;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {displayedTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors
              ${selectedTags.includes(tag.id)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {selectedTags.includes(tag.id) ? (
              <Check className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
            {tag.name}
          </button>
        ))}
      </div>
      
      {regularTags.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAllTags(!showAllTags)}
          className="mt-2 text-sm text-gray-500 hover:text-gray-700"
        >
          {showAllTags ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" />
              Show Less Tags
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" />
              Show All Tags ({regularTags.length} more)
            </>
          )}
        </Button>
      )}
    </div>
  );
} 