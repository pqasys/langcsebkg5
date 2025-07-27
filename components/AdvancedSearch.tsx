'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchResult } from '@/lib/search';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface SearchFilters {
  category?: string;
  level?: string;
  institution?: string;
  priceRange?: [number, number];
  duration?: [number, number];
  tags?: string[];
  framework?: string;
}

interface SearchFacets {
  categories: Array<{ id: string; name: string; count: number }>;
  levels: Array<{ value: string; count: number }>;
  institutions: Array<{ id: string; name: string; count: number }>;
  frameworks: Array<{ value: string; count: number }>;
}

// Custom hook for debouncing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [facets, setFacets] = useState<SearchFacets | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'duration' | 'startDate' | 'popularity'>('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const debouncedQuery = useDebounce(query, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, limit: 5 })
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.data || []);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to fetch suggestions:');
    }
  }, []);

  // Perform search
  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters, page: number = 1) => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      params.set('query', searchQuery);
      params.set('page', page.toString());
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);

      // Add filters to params
      if (searchFilters.category) params.set('category', searchFilters.category);
      if (searchFilters.level) params.set('level', searchFilters.level);
      if (searchFilters.institution) params.set('institution', searchFilters.institution);
      if (searchFilters.framework) params.set('framework', searchFilters.framework);
      if (searchFilters.priceRange) {
        params.set('minPrice', searchFilters.priceRange[0].toString());
        params.set('maxPrice', searchFilters.priceRange[1].toString());
      }
      if (searchFilters.duration) {
        params.set('minDuration', searchFilters.duration[0].toString());
        params.set('maxDuration', searchFilters.duration[1].toString());
      }
      if (searchFilters.tags?.length) {
        params.set('tags', searchFilters.tags.join(','));
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.data.results || []);
        setTotalResults(data.data.total || 0);
        setCurrentPage(data.data.page || 1);
        setFacets(data.data.facets || null);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Search failed:');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  // Update URL with search params
  const updateURL = useCallback((searchQuery: string, searchFilters: SearchFilters) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchFilters.category) params.set('category', searchFilters.category);
    if (searchFilters.level) params.set('level', searchFilters.level);
    if (searchFilters.institution) params.set('institution', searchFilters.institution);
    if (searchFilters.framework) params.set('framework', searchFilters.framework);
    if (searchFilters.priceRange) {
      params.set('minPrice', searchFilters.priceRange[0].toString());
      params.set('maxPrice', searchFilters.priceRange[1].toString());
    }
    if (searchFilters.duration) {
      params.set('minDuration', searchFilters.duration[0].toString());
      params.set('maxDuration', searchFilters.duration[1].toString());
    }
    if (searchFilters.tags?.length) {
      params.set('tags', searchFilters.tags.join(','));
    }

    const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(newURL);
  }, [router]);

  // Handle search input changes
  useEffect(() => {
    if (debouncedQuery) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, fetchSuggestions]);

  // Perform search when query or filters change
  useEffect(() => {
    if (debouncedQuery || Object.keys(filters).length > 0) {
      performSearch(debouncedQuery, filters, 1);
      updateURL(debouncedQuery, filters);
    }
  }, [debouncedQuery, filters, performSearch, updateURL]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    searchInputRef.current?.blur();
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof SearchFilters, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Remove specific filter
  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  // Load more results
  const loadMore = () => {
    performSearch(query, filters, currentPage + 1);
  };

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof SearchFilters] !== undefined && 
    filters[key as keyof SearchFilters] !== null &&
    (Array.isArray(filters[key as keyof SearchFilters]) ? 
      (filters[key as keyof SearchFilters] as any[]).length > 0 : true)
  ).length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="relative search-container-long">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search courses, institutions, or topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pr-20"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1"
            >
              <Filter className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span>{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <Label>Category</Label>
                <Select
                  value={filters.category || ''}
                  onValueChange={(value) => handleFilterChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="">All categories</SelectItem>
                    {facets?.categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Level Filter */}
              <div>
                <Label>Level</Label>
                <Select
                  value={filters.level || ''}
                  onValueChange={(value) => handleFilterChange('level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="">All levels</SelectItem>
                    {facets?.levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.value} ({level.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Institution Filter */}
              <div>
                <Label>Institution</Label>
                <Select
                  value={filters.institution || ''}
                  onValueChange={(value) => handleFilterChange('institution', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All institutions" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="">All institutions</SelectItem>
                    {facets?.institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name} ({institution.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div>
                <Label>Price Range</Label>
                <div className="space-y-2">
                  <Slider
                    value={filters.priceRange || [0, 1000]}
                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                    max={1000}
                    min={0}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{formatCurrency(filters.priceRange?.[0] || 0)}</span>
                    <span>{formatCurrency(filters.priceRange?.[1] || 1000)}</span>
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <Label>Duration (weeks)</Label>
                <div className="space-y-2">
                  <Slider
                    value={filters.duration || [0, 100]}
                    onValueChange={(value) => handleFilterChange('duration', value)}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.duration?.[0] || 0}h</span>
                    <span>{filters.duration?.[1] || 100}h</span>
                  </div>
                </div>
              </div>

              {/* Framework Filter */}
              <div>
                <Label>Framework</Label>
                <Select
                  value={filters.framework || ''}
                  onValueChange={(value) => handleFilterChange('framework', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All frameworks" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    <SelectItem value="">All frameworks</SelectItem>
                    {facets?.frameworks.map((framework) => (
                      <SelectItem key={framework.value} value={framework.value}>
                        {framework.value} ({framework.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {facets?.categories.find(c => c.id === filters.category)?.name}
              <button onClick={() => removeFilter('category')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Level: {filters.level}
              <button onClick={() => removeFilter('level')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.institution && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Institution: {facets?.institutions.find(i => i.id === filters.institution)?.name}
              <button onClick={() => removeFilter('institution')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.framework && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Framework: {filters.framework}
              <button onClick={() => removeFilter('framework')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {loading ? 'Searching...' : `${totalResults} results found`}
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: unknown) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto">
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {loading && results.length === 0 ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Searching...</p>
          </div>
        ) : results.length === 0 && query ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No results found for "{query}"</p>
          </div>
        ) : (
          results.map((result) => (
            <SearchResultCard key={result.id} result={result} />
          ))
        )}

        {/* Load More */}
        {results.length > 0 && results.length < totalResults && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Search Result Card Component
function SearchResultCard({ result }: { result: SearchResult }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/courses/${result.id}`);
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleClick}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {result.title}
            </h3>
            <p className="text-gray-600 mb-3 line-clamp-2">
              {result.description}
            </p>
            
            {/* Highlights */}
            {result.highlights.length > 0 && (
              <div className="mb-3">
                {result.highlights.map((highlight, index) => (
                  <p key={index} className="text-sm text-gray-500 mb-1">
                    <span className="font-medium">{highlight.field}:</span> {highlight.snippet}
                  </p>
                ))}
              </div>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{result.metadata.category}</Badge>
              <Badge variant="outline">{result.metadata.level}</Badge>
              <Badge variant="outline">{result.metadata.institution}</Badge>
              {result.metadata.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatCurrency(result.metadata.price)}</span>
              <span>{result.metadata.duration} weeks</span>
              <span>Starts {new Date(result.metadata.startDate).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="ml-4 text-right">
            <div className="text-sm text-gray-400">
              Relevance: {Math.round(result.score * 10) / 10}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 