'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, LayoutGrid, List, Settings, FileText, Pencil, BookOpen, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  UnsavedChangesDialog,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CourseTagManager } from '@/components/CourseTagManager';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getFrameworkLevels, getFrameworkInfo, type Framework, frameworkMappings } from '@/lib/framework-utils';
import { InstitutionCourseForm } from './components/InstitutionCourseForm';
import { useSession } from 'next-auth/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WeeklyPricingTable } from './components/WeeklyPricingTable';
import { MonthlyPricingTable } from './components/MonthlyPricingTable';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface Course {
  id: string;
  title: string;
  description: string;
  base_price: number;
  duration: number;
  level: string;
  status: string;
  categoryId: string;
  subcategoryId: string | null;
  departmentId: string | null;
  startDate: string;
  endDate: string;
  maxStudents: number;
  framework?: string;
  pricingPeriod?: string;
  _count: {
    bookings: number;
  };
  courseTags?: {
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    }
  }[];
  modules?: {
    id: string;
    title: string;
    description: string | null;
    order_index: number;
    level: string;
    estimated_duration: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
  }[];
  category?: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function InstitutionCoursesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCourseForSettings, setSelectedCourseForSettings] = useState<Course | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedCourseForModules, setSelectedCourseForModules] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    framework: 'CEFR' as Framework,
    level: 'CEFR_A1',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    maxStudents: '15',
    base_price: '0',
    pricingPeriod: 'FULL_COURSE' as 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY',
    duration: '',
    tags: [],
    institutionId: session?.user?.institutionId || ''
  });
  const [isWeeklyPricingOpen, setIsWeeklyPricingOpen] = useState(false);
  const [selectedCourseForPricing, setSelectedCourseForPricing] = useState<any>(null);
  const [weeklyPrices, setWeeklyPrices] = useState<any[]>([]);
  const [isMonthlyPricingOpen, setIsMonthlyPricingOpen] = useState(false);
  const [monthlyPrices, setMonthlyPrices] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (session?.user?.institutionId) {
      setFormData(prev => ({
        ...prev,
        institutionId: session.user.institutionId
      }));
    }
  }, [session]);

  const fetchCourses = useCallback(async () => {
    try {
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Fetching courses...');
      setLoading(true);
      const startTime = Date.now();
      
      const response = await fetch('/api/institution/courses', {
        // Add cache control headers to ensure fresh data when needed
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      const endTime = Date.now();
      console.log(`Courses API response status: ${response.status} (${endTime - startTime}ms)`);
      
      if (!response.ok) {
        const error = await response.json();
        toast.error(`Failed to load courses. Please try again or contact support if the problem persists.`);
        throw new Error(error.error || 'Failed to fetch courses');
      }

      const data = await response.json();
      console.log('Raw API response:', data);
      
      // Ensure we have a valid array of courses
      const coursesArray = Array.isArray(data) ? data : data.courses || [];
      console.log('Processed courses array:', coursesArray);
      
      if (!Array.isArray(coursesArray)) {
        toast.error('Invalid courses data structure:');
        throw new Error(`Invalid courses data structure received from API - Context: throw new Error('Invalid courses data structure re...`);
      }
      
      setCourses(coursesArray);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to in fetchCourses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to fetch courses');
      setCourses([]); // Ensure courses is always an array
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error(`Failed to fetch categories - Context: const response = await fetch('/api/categories');...`);
      const data = await response.json();
      console.log('Fetched categories:', data);
      setCategories(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load categories. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load categories');
    }
  }, []);

  const handleSubmit = async (formData: unknown) => {
    try {
      setIsSubmitting(true);
      
      // Get institution ID from session
      const institutionId = session?.user?.institutionId;
      if (!institutionId) {
        toast.error('No institution ID found in session:');
        toast.error('Institution ID not found. Please try logging in again.');
        setIsSubmitting(false);
        return;
      }

      console.log('Form submission started with data:', JSON.stringify(formData, null, 2));
      console.log('Session user:', session?.user);

      // Validate required fields
      const requiredFields = ['title', 'description', 'categoryId', 'framework', 'level', 'status'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      const courseData = {
        ...formData,
        base_price: parseFloat(formData.base_price),
        duration: parseInt(formData.duration),
        maxStudents: parseInt(formData.maxStudents),
        institutionId: institutionId  // Use the institution ID from session
      };

      console.log('Processed course data:', JSON.stringify(courseData, null, 2));
      console.log('Selected course:', selectedCourse ? JSON.stringify(selectedCourse, null, 2) : 'No course selected');
      console.log('Request URL:', `/api/institution/courses${selectedCourse ? `/${selectedCourse.id}` : ''}`);
      console.log('Request method:', selectedCourse ? 'PUT' : 'POST');

      const response = await fetch(`/api/institution/courses${selectedCourse ? `/${selectedCourse.id}` : ''}`, {
        method: selectedCourse ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const responseData = await response.json();
      console.log('API Response:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        toast.error('API Error:');
        throw new Error(responseData.error || 'Failed to save course');
      }

      console.log('Course saved successfully:', JSON.stringify(responseData, null, 2));
      toast.success(selectedCourse ? 'Course updated successfully' : 'Course created successfully');
      setHasUnsavedChanges(false);
      setIsCourseModalOpen(false);
      fetchCourses();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to in handleSubmit. Please try again or contact support if the problem persists.`);
      if (error instanceof Error) {
        toast.error(`Failed to details. Please try again or contact support if the problem persists.`);
      }
      toast.error(error instanceof Error ? error.message : 'Failed to save course');
      // Don't close the dialog on error
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      categoryId: course.categoryId,
      framework: course.framework || 'CEFR',
      level: course.level,
      status: course.status,
      startDate: new Date(course.startDate).toISOString().split('T')[0],
      endDate: new Date(course.endDate).toISOString().split('T')[0],
      maxStudents: course.maxStudents.toString(),
      base_price: course.base_price.toString(),
      pricingPeriod: course.pricingPeriod || 'FULL_COURSE',
      duration: course.duration.toString(),
      tags: course.courseTags?.map(ct => ({
        id: ct.tag.id,
        name: ct.tag.name,
        color: ct.tag.color,
        icon: ct.tag.icon
      })),
      institutionId: course.institutionId
    });
    setIsCourseModalOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/institution/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');
      
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to deleting course. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete course');
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && hasUnsavedChanges) {
      // Don't close if there are unsaved changes
      return;
    }
    if (!open) {
      // Only reset form data when explicitly closing without unsaved changes
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        framework: 'CEFR' as Framework,
        level: 'CEFR_A1',
        status: 'DRAFT',
        startDate: '',
        endDate: '',
        maxStudents: '15',
        base_price: '0',
        pricingPeriod: 'FULL_COURSE' as 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY',
        duration: '',
        tags: [],
        institutionId: session?.user?.institutionId || ''
      });
      setSelectedCourse(null);
    }
    setIsCourseModalOpen(open);
  };

  const handleSettingsClick = (course: Course) => {
    setSelectedCourseForSettings(course);
    setIsSettingsModalOpen(true);
  };

  const handleModulesClick = (course: Course) => {
    console.log('Opening module management for course:', {
      id: course.id,
      title: course.title,
      moduleCount: course.modules?.length,
      modules: course.modules
    });
    setSelectedCourseForModules(course);
    setIsModuleModalOpen(true);
  };

  const handleSettingsSubmit = async (settings: unknown) => {
    try {
      const response = await fetch(`/api/institution/courses/${selectedCourseForSettings?.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update course settings');
      
      toast.success('Course settings updated successfully');
      fetchCourses();
      setIsSettingsModalOpen(false);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating course settings. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update course settings');
    }
  };

  const handlePricingManagement = (type: 'WEEKLY' | 'MONTHLY') => {
    console.log('handlePricingManagement called with type:', type);
    console.log('selectedCourseForSettings:', selectedCourseForSettings);
    
    if (!selectedCourseForSettings) {
      toast.error('No course selected for pricing management');
      toast.error('No course selected');
      return;
    }

    try {
      setSelectedCourseForPricing(selectedCourseForSettings);
      setIsWeeklyPricingOpen(type === 'WEEKLY');
      setIsMonthlyPricingOpen(type === 'MONTHLY');
      console.log('Pricing modal state updated:', {
        isWeeklyPricingOpen: type === 'WEEKLY',
        isMonthlyPricingOpen: type === 'MONTHLY',
        selectedCourseForPricing: selectedCourseForSettings
      });
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to in handlePricingManagement. Please try again or contact support if the problem persists.`);
      toast.error('Failed to open pricing management');
    }
  };

  const handleWeeklyPricingChange = useCallback((prices: unknown[]) => {
    console.log('handleWeeklyPricingChange called with prices:', prices);
    setWeeklyPrices(prices);
  }, []);

  const handleWeeklyPricingClose = useCallback(() => {
    console.log('handleWeeklyPricingClose called');
    setIsWeeklyPricingOpen(false);
    setSelectedCourseForPricing(null);
    if (selectedCourseForSettings?.id) {
      console.log('Refreshing courses after pricing close');
      fetchCourses();
    }
  }, [selectedCourseForSettings?.id, fetchCourses]);

  const handleWeeklyPricingUnsavedChanges = useCallback((hasChanges: boolean) => {
    // This will be called by the WeeklyPricingTable component
    // We don't need to set hasUnsavedChanges here as it's handled internally
  }, []);

  const handleMonthlyPricingChange = useCallback((prices: unknown[]) => {
    console.log('handleMonthlyPricingChange called with prices:', prices);
    setMonthlyPrices(prices);
    setHasUnsavedChanges(true);
  }, []);

  const handleMonthlyPricingClose = useCallback(() => {
    console.log('handleMonthlyPricingClose called');
    setIsMonthlyPricingOpen(false);
    setSelectedCourseForPricing(null);
    if (selectedCourseForSettings?.id) {
      console.log('Refreshing courses after pricing close');
      fetchCourses();
    }
  }, [selectedCourseForSettings?.id, fetchCourses]);

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      return matchesSearch && matchesStatus && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.base_price - b.base_price;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-96 mb-2" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Course Management</h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your courses and modules</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Button 
            className="bg-gray-800 hover:bg-gray-900 text-white text-sm sm:text-base px-3 sm:px-4 py-2 h-8 sm:h-10"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                categoryId: '',
                framework: 'CEFR',
                level: 'CEFR_A1',
                status: 'DRAFT',
                startDate: '',
                endDate: '',
                maxStudents: '15',
                base_price: '0',
                pricingPeriod: 'FULL_COURSE',
                duration: '',
                tags: [],
                institutionId: session?.user?.institutionId || ''
              });
              setIsCourseModalOpen(true);
            }}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Course</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 search-container-long">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-32 h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full sm:w-32 h-10">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="CEFR_A1">A1</SelectItem>
              <SelectItem value="CEFR_A2">A2</SelectItem>
              <SelectItem value="CEFR_B1">B1</SelectItem>
              <SelectItem value="CEFR_B2">B2</SelectItem>
              <SelectItem value="CEFR_C1">C1</SelectItem>
              <SelectItem value="CEFR_C2">C2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-32 h-10">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="level">Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Course Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-sm sm:text-base line-clamp-2 flex-1 mr-2">{course.title}</h3>
                    <Badge 
                      variant={course.status === 'PUBLISHED' ? 'default' : 
                              course.status === 'DRAFT' ? 'secondary' : 'outline'}
                      className="text-xs flex-shrink-0"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{course.category?.name || 'Uncategorized'}</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">${course.base_price}</span>
                    <span className="text-xs text-muted-foreground">{course.maxStudents} students</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(course)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleModulesClick(course)}
                      className="flex-1 h-8 text-xs"
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Modules</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSettingsClick(course)}
                      className="h-8 w-8 p-0"
                    >
                      <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{course.title}</h3>
                      <Badge 
                        variant={course.status === 'PUBLISHED' ? 'default' : 
                                course.status === 'DRAFT' ? 'secondary' : 'outline'}
                        className="text-xs ml-2 flex-shrink-0"
                      >
                        {course.status}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{course.description}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span>{course.category?.name || 'Uncategorized'}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>${course.base_price}</span>
                      <span>•</span>
                      <span>{course.maxStudents} students</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(course)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Course</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModulesClick(course)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          >
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                            <span className="hidden sm:inline">Modules</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Manage Modules</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm max-w-2xl">
          <DialogHeader>
            <DialogTitle>Course Settings</DialogTitle>
            <DialogDescription>
              Configure advanced settings for {selectedCourseForSettings?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pricing Period</Label>
                <Select
                  value={selectedCourseForSettings?.pricingPeriod || 'FULL_COURSE'}
                  onValueChange={(value) => {
                    console.log('Pricing period changed to:', value);
                    handleSettingsSubmit({ pricingPeriod: value });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_COURSE">Full Course</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Max Students</Label>
                <Input
                  type="number"
                  value={selectedCourseForSettings?.maxStudents || 15}
                  onChange={(e) => handleSettingsSubmit({ maxStudents: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>

            {/* Add Pricing Management Buttons */}
            {selectedCourseForSettings?.pricingPeriod !== 'FULL_COURSE' && (
              <div className="flex gap-4">
                {/* Test button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    alert('Test button clicked');
                    console.log('Test button clicked');
                  }}
                >
                  Test Button
                </Button>

                {selectedCourseForSettings?.pricingPeriod === 'WEEKLY' && (
                  <div 
                    onClick={() => {
                      alert('Container clicked');
                      console.log('Container clicked');
                    }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        alert('Weekly pricing button clicked');
                        console.log('Weekly pricing button clicked');
                        e.stopPropagation();
                        if (!selectedCourseForSettings) {
                          toast.error('No course selected');
                          return;
                        }
                        setSelectedCourseForPricing(selectedCourseForSettings);
                        setIsWeeklyPricingOpen(true);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                      style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}
                    >
                      <Calendar className="h-4 w-4" />
                      Manage Weekly Prices
                    </Button>
                  </div>
                )}
                {selectedCourseForSettings?.pricingPeriod === 'MONTHLY' && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      alert('Monthly pricing button clicked');
                      console.log('Monthly pricing button clicked');
                      if (!selectedCourseForSettings) {
                        toast.error('No course selected');
                        return;
                      }
                      setSelectedCourseForPricing(selectedCourseForSettings);
                      setIsMonthlyPricingOpen(true);
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1000 }}
                  >
                    <Calendar className="h-4 w-4" />
                    Manage Monthly Prices
                  </Button>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Settings modal cancel clicked');
                  setIsSettingsModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log('Settings modal save clicked');
                  handleSettingsSubmit();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isModuleModalOpen} onOpenChange={setIsModuleModalOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-sm max-w-4xl max-h-[90vh] overflow-y-auto">
          {console.log('Rendering module management dialog with course:', {
            id: selectedCourseForModules?.id,
            title: selectedCourseForModules?.title,
            moduleCount: selectedCourseForModules?.modules?.length,
            modules: selectedCourseForModules?.modules
          })}
          <DialogHeader>
            <DialogTitle>Module Management</DialogTitle>
            <DialogDescription>
              Manage modules for {selectedCourseForModules?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Modules</h3>
              <Button
                onClick={() => {
                  router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/new`);
                }}
                className="bg-gray-800 hover:bg-gray-900 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Module
              </Button>
            </div>
            <div className="space-y-2">
              {selectedCourseForModules?.modules && selectedCourseForModules.modules.length > 0 ? (
                selectedCourseForModules.modules.map((module) => (
                  <div
                    key={module.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-gray-500">{module.description || 'No description'}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                        <span>Level: {module.level}</span>
                        <span>•</span>
                        <span>Duration: {module.estimated_duration} mins</span>
                        <span>•</span>
                        <span>Status: {module.is_published ? 'Published' : 'Draft'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/${module.id}/edit`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/${module.id}/content`);
                        }}
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-4">No modules found for this course.</p>
                  <Button
                    onClick={() => {
                      router.push(`/institution/courses/${selectedCourseForModules?.id}/modules/new`);
                    }}
                    className="bg-gray-800 hover:bg-gray-900 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Module
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        open={isCourseModalOpen}
        onOpenChange={handleDialogOpenChange}
        hasUnsavedChanges={hasUnsavedChanges}
        onConfirmClose={() => {
          setHasUnsavedChanges(false);
          setIsCourseModalOpen(false);
          setSelectedCourse(null);
          setFormData({
            title: '',
            description: '',
            categoryId: '',
            framework: 'CEFR' as Framework,
            level: 'CEFR_A1',
            status: 'DRAFT',
            startDate: '',
            endDate: '',
            maxStudents: '15',
            base_price: '0',
            pricingPeriod: 'FULL_COURSE' as 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY',
            duration: '',
            tags: [],
            institutionId: session?.user?.institutionId || ''
          });
        }}
      >
        <DialogContent className="bg-white/95 backdrop-blur-sm max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedCourse ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {selectedCourse
                ? 'Update the course details below. All fields marked with * are required.'
                : 'Fill in the course details below. All fields marked with * are required.'}
            </DialogDescription>
          </DialogHeader>
          <div className="pr-4">
            <InstitutionCourseForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              selectedCourse={selectedCourse}
              onSubmit={handleSubmit}
              institutionId={session?.user?.institutionId || ''}
              onUnsavedChangesChange={setHasUnsavedChanges}
              onPricingManagement={(type) => {
                console.log('Pricing management requested:', type);
                if (!selectedCourse) {
                  toast.error('No course selected');
                  return;
                }
                setSelectedCourseForPricing(selectedCourse);
                setIsWeeklyPricingOpen(type === 'WEEKLY');
                setIsMonthlyPricingOpen(type === 'MONTHLY');
              }}
              courses={courses}
              onClose={() => handleDialogOpenChange(false)}
            />
          </div>
        </DialogContent>
      </UnsavedChangesDialog>

      <Dialog 
        open={isWeeklyPricingOpen} 
        onOpenChange={(open) => {
          console.log('Weekly pricing dialog onOpenChange:', open);
          if (!open) {
            handleWeeklyPricingClose();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Weekly Pricing</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Manage weekly prices for the course. Set different prices for each week.
            </DialogDescription>
          </DialogHeader>
          {selectedCourseForPricing && (
            <WeeklyPricingTable
              courseId={selectedCourseForPricing.id}
              initialPrices={selectedCourseForPricing.weeklyPrices || []}
              basePrice={selectedCourseForPricing.base_price || 0}
              onPricesChange={handleWeeklyPricingChange}
              onClose={handleWeeklyPricingClose}
              onUnsavedChangesChange={handleWeeklyPricingUnsavedChanges}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isMonthlyPricingOpen} 
        onOpenChange={(open) => {
          console.log('Monthly pricing dialog onOpenChange:', open);
          if (!open) {
            handleMonthlyPricingClose();
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900">Monthly Pricing</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Manage monthly prices for the course. Set different prices for each month.
            </DialogDescription>
          </DialogHeader>
          {selectedCourseForPricing && (
            <MonthlyPricingTable
              courseId={selectedCourseForPricing.id}
              initialPrices={selectedCourseForPricing.monthlyPrices || []}
              basePrice={selectedCourseForPricing.base_price || 0}
              onPricesChange={handleMonthlyPricingChange}
              onClose={handleMonthlyPricingClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 