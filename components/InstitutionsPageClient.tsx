'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Users, Star, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Institution {
  id: string;
  name: string;
  description: string;
  country: string;
  city: string;
  logoUrl?: string;
  mainImageUrl?: string;
  isApproved: boolean;
  status: string;
  commissionRate: number;
  subscriptionPlan: string;
  isFeatured: boolean;
  courseCount: number;
  studentCount: number;
}

export default function InstitutionsPageClient() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    filterAndSortInstitutions();
  }, [institutions, searchTerm, sortBy, filterBy]);

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institutions');
      if (response.ok) {
        const data = await response.json();
        setInstitutions(data.institutions || []);
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Failed to fetch institutions:');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortInstitutions = () => {
    let filtered = institutions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(institution =>
        institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        institution.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (filterBy !== 'all') {
      filtered = filtered.filter(institution => institution.status === filterBy);
    }

    // Sort institutions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'featured':
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
        case 'rating':
          const getRating = (inst: Institution) => {
            return inst.isFeatured ? 5 : 
                   inst.subscriptionPlan === 'ENTERPRISE' ? 4 :
                   inst.subscriptionPlan === 'PROFESSIONAL' ? 4 :
                   inst.courseCount > 2 ? 3 : 2;
          };
          return getRating(b) - getRating(a);
        case 'courses':
          return (b.courseCount || 0) - (a.courseCount || 0);
        default:
          return 0;
      }
    });

    setFilteredInstitutions(filtered);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Language Learning Institutions
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with top language learning institutions offering diverse courses, 
          experienced teachers, and flexible learning options.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 search-container-long">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search institutions by name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="courses">Number of Courses</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredInstitutions.length} of {institutions.length} institutions
        </p>
      </div>

      {/* Institutions Grid */}
      {filteredInstitutions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No institutions found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((institution) => (
            <Card key={institution.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {institution.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{institution.city}, {institution.country}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {institution.isFeatured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant={institution.status === 'ACTIVE' ? 'default' : 'secondary'}
                      className={
                        institution.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : institution.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {institution.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                  {institution.description}
                </CardDescription>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Courses</span>
                    </div>
                    <span className="font-medium">{institution.courseCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = institution.isFeatured ? 5 : 
                                     institution.subscriptionPlan === 'ENTERPRISE' ? 4 :
                                     institution.subscriptionPlan === 'PROFESSIONAL' ? 4 :
                                     institution.courseCount > 2 ? 3 : 2;
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
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Experience</span>
                    </div>
                    <span className="font-medium">
                      {institution.isFeatured ? '5+ years' : 
                       institution.subscriptionPlan === 'ENTERPRISE' ? '4+ years' :
                       institution.subscriptionPlan === 'PROFESSIONAL' ? '3+ years' : '2+ years'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/institutions/${institution.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/institutions/${institution.id}/courses`}>
                      Browse Courses
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our featured institutions and find the perfect language learning 
            experience for your needs. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/courses">
                Browse All Courses
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/auth/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 