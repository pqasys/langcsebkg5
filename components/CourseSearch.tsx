import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import TagSelector from './TagSelector';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  institution: {
    name: string;
    logoUrl?: string;
    country?: string;
    city?: string;
    address?: string;
    description?: string;
  };
  courseTags: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
  department?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface CourseSearchProps {
  onCoursesChange: (courses: Course[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  className?: string;
}

export default function CourseSearch({ onCoursesChange, onLoadingChange, onError, className = '' }: CourseSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [durationRange, setDurationRange] = useState({ min: '', max: '' });

  useEffect(() => {
    const searchCourses = async () => {
      setIsLoading(true);
      onLoadingChange(true);
      setError(null);
      onError(null);

      try {
        const params = new URLSearchParams({
          query: searchQuery,
          ...(selectedTags.length > 0 && { tagIds: selectedTags.join(',') }),
          ...(priceRange.min && { minPrice: priceRange.min }),
          ...(priceRange.max && { maxPrice: priceRange.max }),
          ...(durationRange.min && { minDuration: durationRange.min }),
          ...(durationRange.max && { maxDuration: durationRange.max })
        });

        // // // // // // console.log('Fetching courses with params:', params.toString());
        const response = await fetch(`/api/courses/search?${params}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to search courses');
        }
        
        const data = await response.json();
        console.log('Received courses data:', data);
        
        if (!data.courses || !Array.isArray(data.courses)) {
          throw new Error(`Invalid response format: courses array is missing - Context: throw new Error('Invalid response format: courses ...`);
        }

        onCoursesChange(data.courses);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search courses';
        toast.error(`Failed to in CourseSearch:. Please try again or contact support if the problem persists.`));
        setError(errorMessage);
        onError(errorMessage);
      } finally {
        setIsLoading(false);
        onLoadingChange(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchCourses, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedTags, priceRange, durationRange, onCoursesChange, onLoadingChange, onError]);

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  const handleDurationChange = (type: 'min' | 'max', value: string) => {
    setDurationRange(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative search-container-long">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range ($)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Duration (weeks)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  value={durationRange.min}
                  onChange={(e) => handleDurationChange('min', e.target.value)}
                  placeholder="Min"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={durationRange.max}
                  onChange={(e) => handleDurationChange('max', e.target.value)}
                  placeholder="Max"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <TagSelector
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        className="mt-4"
      />

      {isLoading && (
        <div className="text-center text-gray-500">Searching...</div>
      )}

      {error && (
        <div className="text-center text-red-500">Error: {error}</div>
      )}
    </div>
  );
} 