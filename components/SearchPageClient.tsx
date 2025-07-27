'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Users, Star, BookOpen, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
// import { toast } from 'sonner';
import { TagFilter } from '@/components/TagFilter';

interface SearchResult {
  id: string;
  type: 'course' | 'institution';
  title: string;
  description: string;
  location?: string;
  price?: number;
  rating?: number;
  students?: number;
  duration?: string;
  level?: string;
  tags?: string[];
  image?: string;
}

export default function SearchPageClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'courses' | 'institutions'>('all');
  const [location, setLocation] = useState('');
  const [level, setLevel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const params = new URLSearchParams({
        query: searchTerm,
        ...(level && { level }),
        ...(location && { institution: location }),
        ...(selectedTags.length > 0 && { tags: selectedTags.join(',') }),
        ...(priceRange && { 
          minPrice: priceRange === 'free' ? '0' : 
                   priceRange === '0-50' ? '0' : 
                   priceRange === '50-100' ? '50' : 
                   priceRange === '100-200' ? '100' : 
                   priceRange === '200+' ? '200' : '',
          maxPrice: priceRange === 'free' ? '0' : 
                   priceRange === '0-50' ? '50' : 
                   priceRange === '50-100' ? '100' : 
                   priceRange === '100-200' ? '200' : 
                   priceRange === '200+' ? '999999' : ''
        })
      });

      const response = await fetch(`/api/search?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Transform the search results to match the expected format
          const transformedResults = data.data.results?.map((result: any) => ({
            id: result.id,
            type: 'course',
            title: result.title,
            description: result.description,
            location: result.metadata?.institution,
            price: result.metadata?.price,
            rating: 4.5, // Default rating
            students: undefined, // Remove sensitive enrollment data
            duration: `${result.metadata?.duration || 0} weeks`,
            level: result.metadata?.level,
            tags: result.metadata?.tags || []
          })) || [];
          setResults(transformedResults);
        } else {
          setResults([]);
        }
      } else {
        // toast.error('Search failed');
        setResults([]);
      }
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error('Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    // Auto-search when filters change if there's already a search term
    if (hasSearched && searchTerm.trim()) {
      handleSearch();
    }
  }, [searchType, location, level, priceRange, selectedTags]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Language Learning Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Search through thousands of courses and institutions to find the right fit for your learning journey.
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Input
                placeholder="Search for courses, institutions, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger>
                <SelectValue placeholder="Search type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="courses">Courses Only</SelectItem>
                <SelectItem value="institutions">Institutions Only</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleSearch} disabled={loading} className="w-full">
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Advanced Filters */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Advanced Filters</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-200">$100 - $200</SelectItem>
                  <SelectItem value="200+">$200+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tag Filter */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">Filter by tags</span>
              </div>
              <TagFilter
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              Search Results
            </h2>
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${results.length} results found`}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : results.length === 0 && hasSearched ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button onClick={() => setHasSearched(false)} variant="outline">
            Clear Search
          </Button>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <Card key={result.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {result.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">
                        {result.type === 'course' ? 'Course' : 'Institution'}
                      </Badge>
                      {result.level && (
                        <Badge variant="outline">{result.level}</Badge>
                      )}
                    </div>
                  </div>
                  {result.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{result.rating}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                  {result.description}
                </CardDescription>
                
                <div className="space-y-3 mb-4">
                  {result.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{result.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = result.rating || 4.5;
                        return (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  {result.duration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{result.duration}</span>
                    </div>
                  )}
                  
                  {result.price !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        {result.price === 0 ? 'Free' : `$${result.price}`}
                      </span>
                    </div>
                  )}
                </div>

                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {result.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button asChild className="w-full">
                  <Link href={`/${result.type}s/${result.id}`}>
                    View Details
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Default content when no search has been performed */
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Start Your Search
          </h3>
          <p className="text-gray-600 mb-6">
            Enter your search terms above to find courses and institutions that match your needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-medium">Courses</h4>
              <p className="text-sm text-gray-600">Find language courses</p>
            </div>
            <div className="text-center p-4">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-medium">Institutions</h4>
              <p className="text-sm text-gray-600">Discover learning centers</p>
            </div>
            <div className="text-center p-4">
              <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-medium">Location</h4>
              <p className="text-sm text-gray-600">Search by area</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 