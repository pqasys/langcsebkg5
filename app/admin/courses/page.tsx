'use client';

import { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Plus, Search, Trash2, LayoutGrid, List, Loader2, Pencil, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Badge } from '@/components/ui/badge';
import type { Framework } from '@/lib/framework-utils';
import { WeeklyPricingTable } from '@/app/institution/courses/components/WeeklyPricingTable';
import { MonthlyPricingTable } from '@/components/MonthlyPricingTable';
import { useInView } from 'react-intersection-observer';
import { fetchWithCache } from '@/lib/cache-utils';
import { AdminCourseForm } from './components/CourseForm';
import { z } from 'zod';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { debounce } from 'lodash';
import { getStudentTier } from '@/lib/subscription-pricing';

interface Course {
  id: string;
  title: string;
  description: string;
  base_price: number;
  duration: number;
  level: string;
  status: string;
  institution?: {
    id: string;
    name: string;
  } | null;
  _count: {
    bookings: number;
    enrollments: number;
    completions: number;
    courseTags: number;
    weeklyPrices: number;
    pricingRules: number;
  };
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string | null;
  };
  courseTags: {
    id: string;
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    }
  }[];
  startDate: string;
  endDate: string;
  maxStudents: number;
  framework?: Framework;
  pricingPeriod?: string;
  weeklyPrices?: {
    date: string;
    price: number;
  }[];
  // Subscription fields
  requiresSubscription?: boolean;
  subscriptionTier?: string;
  isPlatformCourse?: boolean;
  marketingType?: string;
  institutionId?: string;
}

interface Institution {
  id: string;
  name: string;
  description?: string;
  country?: string;
  city?: string;
  logoUrl?: string | null;
  mainImageUrl?: string | null;
  isApproved?: boolean;
  status?: string;
  commissionRate?: number;
  subscriptionPlan?: string;
  isFeatured?: boolean;
  courseCount?: number;
  studentCount?: number;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

interface MonthlyPrice {
  id: string;
  courseId: string;
  monthNumber: number;
  year: number;
  price: number;
}

interface WeeklyPrice {
  id: string;
  courseId: string;
  weekNumber: number;
  year: number;
  price: number;
}

// Add form validation schema
const courseFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  base_price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: 'Base price must be a valid number'
  }),
  duration: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Duration must be a valid number greater than 0'
  }),
  level: z.string().min(1, 'Level is required'),
  framework: z.string().min(1, 'Framework is required'),
  status: z.string().min(1, 'Status is required'),
  categoryId: z.string().min(1, 'Category is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  maxStudents: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: 'Max students must be a valid number greater than 0'
  }),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string()
  })),
  pricingPeriod: z.enum(['FULL_COURSE', 'WEEKLY', 'MONTHLY']),
  institutionId: z.string().optional(),
  // Placement & priority
  priority: z.string().optional(),
  isFeatured: z.boolean().default(false).optional(),
  isSponsored: z.boolean().default(false).optional(),
  // Marketing & classification (kept optional in page schema)
  marketingType: z.string().optional(),
  marketingDescription: z.string().optional(),
  courseType: z.string().optional(),
  deliveryMode: z.string().optional(),
  enrollmentType: z.string().optional(),
  hasLiveClasses: z.boolean().optional(),
  liveClassType: z.string().optional(),
  liveClassFrequency: z.string().optional(),
  requiresSubscription: z.boolean().optional(),
  subscriptionTier: z.string().optional(),
  isPlatformCourse: z.boolean().optional()
});

type CourseFormData = z.infer<typeof courseFormSchema>;

// Define resetFormData function outside component to avoid hooks violation
const resetFormData = (): CourseFormData => ({
  title: '',
  description: '',
  categoryId: '',
  institutionId: '',
  base_price: '0',
  duration: '',
  maxStudents: '',
  framework: 'CEFR',
  level: 'CEFR_A1',
  tags: [],
  pricingPeriod: 'FULL_COURSE',
  status: 'DRAFT',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  priority: '0',
  isFeatured: false,
  isSponsored: false,
  // Marketing fields
  marketingType: 'SELF_PACED',
  marketingDescription: '',
  // New course type fields
  courseType: 'STANDARD',
  deliveryMode: 'SELF_PACED',
  enrollmentType: 'COURSE_BASED',
  hasLiveClasses: false,
  liveClassType: '',
  liveClassFrequency: '',
  requiresSubscription: false,
  subscriptionTier: '',
  isPlatformCourse: false
});

function AdminCoursesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const institutionId = searchParams.get('institutionId');
  
  // Check authentication
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (session.user?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [session, status, router]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [showPlatformWideOnly, setShowPlatformWideOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isWeeklyPricingOpen, setIsWeeklyPricingOpen] = useState(false);
  const [isMonthlyPricingOpen, setIsMonthlyPricingOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  
  // Add caching and loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [cache, setCache] = useState<Map<string, any>>(new Map());
  const [formData, setFormData] = useState<CourseFormData>(resetFormData());
  const formSubmissionRef = useRef(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0,
  });
  const [monthlyPrices, setMonthlyPrices] = useState<MonthlyPrice[]>([]);
  const [weeklyPrices, setWeeklyPrices] = useState<WeeklyPrice[]>([]);

  // Add state for tracking form validation
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Add state for tracking loading states
  const [loadingStates, setLoadingStates] = useState<{
    isSubmitting: boolean;
    isFetching: boolean;
    isDeleting: boolean;
    isEditing: boolean;
  }>({
    isSubmitting: false,
    isFetching: false,
    isDeleting: false,
    isEditing: false
  });

  // Add error state
  const [error, setError] = useState<string | null>(null);

  // Add state for category filtering
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  // Debug useEffect to monitor hasUnsavedChanges
  useEffect(() => {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('hasUnsavedChanges changed:', hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  // Add useEffect to handle URL parameters
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const institutionId = searchParams.get('institutionId');
    
    console.log('URL Parameters:', {
      institutionId,
      fullUrl: window.location.href
    });

    if (institutionId) {
      // Find the institution in the list
      const institution = Array.isArray(institutions) ? institutions.find(inst => inst.id === institutionId) : null;
      console.log('Found institution:', institution);
      
      if (institution) {
        setSelectedInstitution(institution);
      } else {
        // // // // // // console.warn('Institution not found in list:', institutionId);
        // If institution not found in list, fetch it
        fetchInstitution(institutionId);
      }
    }
  }, [institutions]);

  // Add function to fetch single institution
  const fetchInstitution = async (institutionId: string) => {
    try {
      console.log('Fetching institution:', institutionId);
      const response = await fetch(`/api/admin/institutions/${institutionId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity', // Prevent compression
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('Fetched institution:', data);
      
      if (data) {
        setSelectedInstitution(data);
        // Add to institutions list if not already present
        setInstitutions(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          if (!prevArray.find(inst => inst.id === data.id)) {
            return [...prevArray, data];
          }
          return prevArray;
        });
      }
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load institution. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load institution details');
    }
  };

  // Add function to fetch institutions with caching
  const fetchInstitutions = useCallback(async () => {
    // Check if we already have institutions cached
    if (Array.isArray(institutions) && institutions.length > 0) {
      return;
    }

    try {
      const response = await fetch('/api/admin/institutions', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Admin Institutions API response:', data);
      
      // Admin API returns direct array
      const institutionsData = Array.isArray(data) ? data : [];
      
      console.log('Processed institutions data:', institutionsData);
      setInstitutions(institutionsData);
    } catch (error) {
      console.error('Error fetching institutions:', error);
      toast.error(`Failed to load institutions. Please try again or contact support if the problem persists.`);
      // Ensure institutions is always an array even on error
      setInstitutions([]);
    }
  }, [institutions.length]);

  // Add function to fetch categories with caching
  const fetchCategories = useCallback(async () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Check if we already have categories cached
    if (Array.isArray(categories) && categories.length > 0) {
      return;
    }

    try {
      console.log('Fetching categories...');
      const response = await fetch('/api/admin/categories', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Categories API response:', data);
      
      // Handle both direct array and wrapped in categories property
      const categoriesData = Array.isArray(data) ? data : (data.categories || []);
      console.log('Processed categories data:', categoriesData);
      
      if (categoriesData.length === 0) {
        console.warn('No categories found in database');
        toast.warning('No categories found. Please create some categories first.');
      }
      
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(`Failed to load categories. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load categories');
    }
  }, [Array.isArray(categories) ? categories.length : 0]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      // Only run on client side
      if (typeof window === 'undefined') return;
      
      try {
        setLoadingStates(prev => ({ ...prev, isFetching: true }));
        
        const url = new URL('/api/admin/courses', window.location.origin);
        if (selectedInstitution?.id) {
          url.searchParams.append('institutionId', selectedInstitution.id);
        }
        if (query) {
          url.searchParams.append('search', query);
        }
        if (selectedCategory) {
          url.searchParams.append('categoryId', selectedCategory);
        }
        if (selectedStatus) {
          url.searchParams.append('status', selectedStatus);
        }

        const response = await fetch(url.toString(), {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'max-age=300', // 5 minute cache
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCourses(data.courses || []);
        setPage(1); // Reset to first page when searching
      } catch (error) {
              console.error('Error occurred:', error);
        toast.error(`Failed to filtering courses. Please try again or contact support if the problem persists.`);
        toast.error('Failed to filter courses');
      } finally {
        setLoadingStates(prev => ({ ...prev, isFetching: false }));
      }
    }, 800), // Increased to 800ms debounce for better performance
    [selectedInstitution?.id, selectedCategory, selectedStatus]
  );

  // Optimized data loading with caching and loading state
  useEffect(() => {
    if (isInitialLoad) {
      const loadData = async () => {
        try {
          setIsLoading(true);
          setIsInitialLoad(false);
          
          // Load data in parallel with proper error handling
          const [coursesData, institutionsData, categoriesData] = await Promise.allSettled([
            fetchCourses(),
            fetchInstitutions(),
            fetchCategories()
          ]);
          
          // Handle any failed requests
          if (coursesData.status === 'rejected') {
            toast.error('Failed to load courses');
          }
          if (institutionsData.status === 'rejected') {
            toast.error('Failed to load institutions');
          }
          if (categoriesData.status === 'rejected') {
            toast.error('Failed to load categories');
          }
        } catch (error) {
                console.error('Error occurred:', error);
          toast.error(`Failed to loading data. Please try again or contact support if the problem persists.`);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    }
  }, [isInitialLoad]); // Only run once on mount

  // Handle search with debouncing
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  // Handle edit query parameter
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const editCourseId = urlParams.get('edit');
    
    if (editCourseId && courses.length > 0) {
      // Find the course in the current list
      const courseToEdit = courses.find(course => course.id === editCourseId);
      if (courseToEdit) {
        handleEdit(editCourseId);
        // Clean up the URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('edit');
        window.history.replaceState({}, '', newUrl.toString());
      }
    }
  }, [courses]);

  // Add toast for course deletion with timeout
  const handleDelete = async (courseId: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, isDeleting: true }));
      
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      toast.success('Course deleted successfully');
      await fetchCourses();
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to deleting course. Please try again or contact support if the problem persists.`);
      toast.error('Failed to delete course');
    } finally {
      setLoadingStates(prev => ({ ...prev, isDeleting: false }));
    }
  };

  // Add toast for course creation
  const handleAddCourse = () => {
    if (!Array.isArray(categories) || categories.length === 0) {
      toast.error('Categories not loaded. Please refresh the page and try again.');
      // Try to fetch categories again
      fetchCategories();
      return;
    }
    setSelectedCourse(null);
    setFormData(resetFormData()); // Reset form data to blank state
    setIsAddModalOpen(true);
  };

  // Add toast for course filtering
  const handleInstitutionChange = (institutionId: string | null) => {
    if (institutionId === 'all' || !institutionId) {
      setSelectedInstitution(null);
      setShowPlatformWideOnly(false);
    } else if (institutionId === 'platform') {
      setSelectedInstitution(null);
      setShowPlatformWideOnly(true);
    } else {
      const institution = Array.isArray(institutions) ? institutions.find(i => i.id.toString() === institutionId) : null;
      setSelectedInstitution(institution || null);
      setShowPlatformWideOnly(false);
    }
    setPage(1);
    // Trigger course reload after state updates
    setTimeout(() => {
      fetchCourses();
    }, 0);
  };

  // Add toast for pagination
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  // Update handleCategoryChange to use the new state
  const handleCategoryChange = useCallback(async (categoryId: string) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setSelectedCategory(categoryId);
    try {
      setLoadingStates(prev => ({ ...prev, isFetching: true }));
      
      const url = new URL('/api/admin/courses', window.location.origin);
      if (selectedInstitution?.id) {
        url.searchParams.append('institutionId', selectedInstitution.id);
      }
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      if (categoryId) {
        url.searchParams.append('categoryId', categoryId);
      }
      if (selectedStatus) {
        url.searchParams.append('status', selectedStatus);
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity', // Prevent compression
        }
      });
      
      if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to filtering courses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to filter courses');
    } finally {
      setLoadingStates(prev => ({ ...prev, isFetching: false }));
    }
  }, [selectedInstitution?.id, searchQuery, selectedStatus]);

  // Update handleStatusChange to use the new state
  const handleStatusChange = useCallback(async (status: string) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    setSelectedStatus(status);
    try {
      setLoadingStates(prev => ({ ...prev, isFetching: true }));
      
      const url = new URL('/api/admin/courses', window.location.origin);
      if (selectedInstitution?.id) {
        url.searchParams.append('institutionId', selectedInstitution.id);
      }
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      if (selectedCategory) {
        url.searchParams.append('categoryId', selectedCategory);
      }
      if (status) {
        url.searchParams.append('status', status);
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity', // Prevent compression
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setCourses(data.courses || []);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to filtering courses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to filter courses');
    } finally {
      setLoadingStates(prev => ({ ...prev, isFetching: false }));
    }
  }, [selectedInstitution?.id, searchQuery, selectedCategory]);

  // Add toast for pricing management
  const handlePricingManagement = (type: 'WEEKLY' | 'MONTHLY') => {
    if (!selectedCourse) {
      toast.error('No course selected');
      return;
    }
    setIsWeeklyPricingOpen(type === 'WEEKLY');
    setIsMonthlyPricingOpen(type === 'MONTHLY');
  };

  // Add cleanup function
  const cleanupDialog = useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedCourse(null);
    setHasUnsavedChanges(false);
    resetFormData();
  }, []);

  // Add validation function
  const validateFormData = useCallback((data: CourseFormData): boolean => {
    try {
      courseFormSchema.parse(data);
      setFormErrors({});
      setIsFormValid(true);
      return true;
    } catch (error) {
            console.error('Error occurred:', error);
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CourseFormData, string>> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof CourseFormData;
          newErrors[path] = err.message;
        });
        setFormErrors(newErrors);
        setIsFormValid(false);
      }
      return false;
    }
  }, []);

  useEffect(() => {
    if (inView && hasMore && !isLoadingMore) {
      loadMoreCourses();
    }
  }, [inView, hasMore, isLoadingMore]);

  // Removed duplicate initial data loader to avoid repeated requests; rely on the isInitialLoad effect above

  // Move auth guards below all hooks to preserve hook order

  const loadMoreCourses = async () => {
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const url = selectedInstitution && selectedInstitution.id
        ? `/api/admin/courses?institutionId=${selectedInstitution.id}&page=${nextPage}&limit=10`
        : `/api/admin/courses?page=${nextPage}&limit=10`;

      const data = await fetchWithCache(url);
      const { courses: newCourses, pagination } = data;

      if (newCourses.length === 0) {
        setHasMore(false);
        return;
      }

      setCourses(prev => [...prev, ...newCourses]);
      setPage(nextPage);
      setHasMore(nextPage < pagination.totalPages);
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to loading more courses. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load more courses');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Update fetchCourses to log institution filter
  const fetchCourses = useCallback(async () => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      setLoadingStates(prev => ({ ...prev, isFetching: true }));
      
      const url = new URL('/api/admin/courses', window.location.origin);
      if (selectedInstitution?.id) {
        url.searchParams.append('institutionId', selectedInstitution.id);
        console.log('Adding institution filter:', selectedInstitution.id);
      }
      if (searchQuery) {
        url.searchParams.append('search', searchQuery);
      }
      if (selectedCategory) {
        url.searchParams.append('categoryId', selectedCategory);
      }
      if (selectedStatus) {
        url.searchParams.append('status', selectedStatus);
      }
      // Request a higher limit to get all courses
      url.searchParams.append('limit', '100');
      url.searchParams.append('page', '1');

      console.log('Session state:', session);
      console.log('Fetching courses with URL:', url.toString());
      
      // Try with regular fetch first to see the raw response
      const response = await fetch(url.toString(), {
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Encoding': 'identity', // Prevent compression
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        toast.error('API Error Response:');
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('Received courses data:', {
          coursesCount: data.courses?.length,
          total: data.pagination?.total,
          institutionId: selectedInstitution?.id
        });

        if (data.courses && Array.isArray(data.courses)) {
          console.log('🔍 Course data structure:', data.courses[0]?._count);
          setCourses(data.courses);
          setPage(1); // Reset page when fetching new data
          setHasMore(false); // Since we're getting all courses, no more to load
        } else {
          toast.error('Invalid courses data format:');
          throw new Error('Invalid courses data format received from server');
        }
      } else {
        const textData = await response.text();
        console.error('Non-JSON response received:', textData.substring(0, 200));
        throw new Error('Non-JSON response received from server');
      }
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to load courses. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to load courses');
      setCourses([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, isFetching: false }));
    }
  }, [selectedInstitution?.id, searchQuery, selectedCategory, selectedStatus, session]);

  // Fetch courses is triggered explicitly by handlers to avoid duplicate loops

  // Optimized filtered courses logic
  const filteredCourses = useMemo(() => {
    if (!Array.isArray(courses)) {
      return [];
    }

    return courses.filter(course => {
      if (!course) {
        return false;
      }

      const matchesSearch = searchQuery
        ? course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.institution?.name?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCategory = selectedCategory
        ? course.category?.id === selectedCategory
        : true;

      const matchesStatus = selectedStatus
        ? course.status?.toUpperCase() === selectedStatus.toUpperCase()
        : true;

      const matchesInstitution = showPlatformWideOnly
        ? !course.institution // Show only platform-wide courses (no institution)
        : selectedInstitution
        ? course.institution?.id === selectedInstitution.id // Show only courses from selected institution
        : true; // Show all courses

      return matchesSearch && matchesCategory && matchesStatus && matchesInstitution;
    });
  }, [courses, searchQuery, selectedCategory, selectedStatus, selectedInstitution, showPlatformWideOnly]);

  const handleFormDataChange = useCallback((data: CourseFormData) => {
    setFormData(data);
    // Only set unsaved changes if we're not currently submitting
    if (!isFormSubmitting && !formSubmissionRef.current) {
      setHasUnsavedChanges(true);
    }
  }, [isFormSubmitting]);

  const handleDialogOpenChange = useCallback((open: boolean) => {
    // If form is submitting or was just submitted, don't show unsaved changes warning
    if (!open && hasUnsavedChanges && !isFormSubmitting && !formSubmissionRef.current) {
      // The UnsavedChangesDialog will handle the confirmation, so we don't need to do anything here
      // Just return and let the UnsavedChangesDialog handle it
      return;
    } else if (!open) {
      // Close dialog without unsaved changes
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedCourse(null);
      setHasUnsavedChanges(false);
      resetFormData();
    } else {
      // When opening the dialog, ensure we're in the correct mode
      if (selectedCourse) {
        setIsEditModalOpen(true);
        setIsAddModalOpen(false);
      } else {
        setIsAddModalOpen(true);
        setIsEditModalOpen(false);
      }
    }
  }, [hasUnsavedChanges, isFormSubmitting, selectedCourse]);

  const handleFormSubmit = useCallback(async (formData: CourseFormData) => {
    try {
      formSubmissionRef.current = true;
      setIsFormSubmitting(true);
      setLoadingStates(prev => ({ ...prev, isSubmitting: true }));
      setError(null);

      // Validate form data before submission
      if (!validateFormData(formData)) {
        throw new Error('Invalid form data');
      }

      const endpoint = selectedCourse 
        ? `/api/admin/courses/${selectedCourse.id}` 
        : '/api/admin/courses';

      const method = selectedCourse ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        // Ensure booleans are present explicitly
        isFeatured: !!(formData as any).isFeatured,
        isSponsored: !!(formData as any).isSponsored,
      } as any;

      // Log outgoing payload for debugging placement flags
      // debug removed

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      const result = await response.json();
      // debug removed

      // Refresh the courses list
      await fetchCourses();
      // Ensure dialog reflects the saved flags when editing
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          isFeatured: !!result.isFeatured,
          isSponsored: !!result.isSponsored,
        } as any));
      }

      // Reset unsaved changes and form submission state
      setHasUnsavedChanges(false);
      setIsFormSubmitting(false);
      
      // Add a small delay to prevent race conditions with form data updates
      setTimeout(() => {
        formSubmissionRef.current = false;
      }, 100);
      
      // For new courses, close the dialog automatically
      if (!selectedCourse) {
        setIsAddModalOpen(false);
        setSelectedCourse(null);
        resetFormData();
      }
      // For existing courses, keep the dialog open and let user close manually
      
      toast.success(selectedCourse ? 'Course updated successfully' : 'Course created successfully');
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to in handleFormSubmit. Please try again or contact support if the problem persists.`);
      setError(error instanceof Error ? error.message : 'An error occurred while saving the course');
      toast.error('Failed to save course');
      setIsFormSubmitting(false);
      formSubmissionRef.current = false;
    } finally {
      setLoadingStates(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [selectedCourse, validateFormData, fetchCourses]);

  const handleEdit = useCallback(async (courseId: string) => {
    if (!Array.isArray(categories) || categories.length === 0) {
      toast.error('Categories not loaded. Please refresh the page and try again.');
      // Try to fetch categories again
      fetchCategories();
      return;
    }
    
    try {
      setLoadingStates(prev => ({ ...prev, isEditing: true }));
      const response = await fetch(`/api/admin/courses/${courseId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      
      const course = await response.json();
      
      // Validate that course has required data
      if (!course.category || !course.category.id) {
        throw new Error(`Course "${course.title}" is missing category information. This is a data integrity issue that needs to be resolved.`);
      }
      
      // For platform courses, institution can be null
      if (!course.isPlatformCourse && (!course.institution || !course.institution.id)) {
        throw new Error(`Course "${course.title}" is missing institution information. This is a data integrity issue that needs to be resolved.`);
      }
      
      // Map course tags
      const courseTags = course.courseTags?.map((ct: unknown) => ({
        id: ct.tag.id,
        name: ct.tag.name,
        color: ct.tag.color,
        icon: ct.tag.icon
      })) || [];
      
      // Initialize form data
      const initialFormData: CourseFormData = {
        title: course.title,
        description: course.description,
        base_price: course.base_price?.toString() || '0',
        pricingPeriod: course.pricingPeriod || 'FULL_COURSE',
        tags: courseTags,
        framework: course.framework || 'CEFR',
        level: course.level,
        status: course.status.toUpperCase(),
        categoryId: course.category.id,
        startDate: new Date(course.startDate).toISOString().split('T')[0],
        endDate: new Date(course.endDate).toISOString().split('T')[0],
        maxStudents: course.maxStudents.toString(),
        duration: course.duration.toString(),
        institutionId: course.isPlatformCourse ? '' : course.institution?.id || '',
        priority: (course.priority || 0).toString(),
        isFeatured: course.isFeatured || false,
        isSponsored: course.isSponsored || false,
        // Marketing fields
        marketingType: course.marketingType || 'SELF_PACED',
        marketingDescription: course.marketingDescription || '',
        // New course type fields
        courseType: course.courseType || 'STANDARD',
        deliveryMode: course.deliveryMode || 'SELF_PACED',
        enrollmentType: course.enrollmentType || 'COURSE_BASED',
        hasLiveClasses: course.hasLiveClasses || false,
        liveClassType: course.liveClassType || '',
        liveClassFrequency: course.liveClassFrequency || '',
        requiresSubscription: course.requiresSubscription || false,
        subscriptionTier: course.subscriptionTier || '',
        isPlatformCourse: course.isPlatformCourse || false
      };
      

      setFormData(initialFormData);
      setSelectedCourse(course);
      setIsEditModalOpen(true);
      setIsAddModalOpen(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load course data';
      toast.error(`Failed to loading course. Please try again or contact support if the problem persists.`);
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoadingStates(prev => ({ ...prev, isEditing: false }));
    }
  }, [categories, fetchCategories]);

  const handleUpdateWeeklyPrices = async (courseId: string) => {
    try {
      // First get the course to find its current year
      const courseResponse = await fetch(`/api/admin/courses/${courseId}`);
      if (!courseResponse.ok) {
        throw new Error('Failed to fetch course details');
      }
      const course = await courseResponse.json();
      const currentYear = course.weeklyPrices?.[0]?.year || new Date().getFullYear();

      const response = await fetch('/api/admin/courses/update-weekly-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          courseId,
          year: currentYear
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update weekly prices');
      }

      const data = await response.json();
      if (data.success) {
        // Refresh the courses list
        fetchCourses();
      }
    } catch (error) {
            console.error('Error occurred:', error);
      toast.error(`Failed to updating weekly prices. Please try again or contact support if the problem persists.`);
    }
  };

  const handleMonthlyPricingChange = (prices: unknown[]) => {
    setMonthlyPrices(prices);
    setHasUnsavedChanges(true);
  };

  const handleMonthlyPricingClose = () => {
    setIsMonthlyPricingOpen(false);
    if (selectedCourse?.id) {
      fetchCourses();
    }
  };

  const handleWeeklyPricingChange = (prices: unknown[]) => {
    setWeeklyPrices(prices);
  };

  const handleWeeklyPricingClose = () => {
    setIsWeeklyPricingOpen(false);
    if (selectedCourse?.id) {
      fetchCourses();
    }
  };

  const handleWeeklyPricingUnsavedChanges = (hasChanges: boolean) => {
    // This will be called by the WeeklyPricingTable component
    // We don't need to set hasUnsavedChanges here as it's handled internally
  };

  // Add error boundary
  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Categories Status Indicator */}
      {(!Array.isArray(categories) || categories.length === 0) && !loadingStates.isFetching && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Categories Not Loaded
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Course categories are required to create or edit courses. Please refresh the page or contact support if this issue persists.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">
                      {showPlatformWideOnly ? 'Platform-wide Courses' : selectedInstitution ? 'Institution Courses' : 'All Courses'}
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-10 w-10"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-10 w-10"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            className="bg-gray-800 hover:bg-gray-900 text-white"
            onClick={handleAddCourse}
            disabled={!Array.isArray(categories) || categories.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Course
            {(!Array.isArray(categories) || categories.length === 0) && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
                No Categories
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 search-container-long">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Select
                      value={showPlatformWideOnly ? 'platform' : selectedInstitution ? selectedInstitution.id.toString() : 'all'}
          onValueChange={handleInstitutionChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by institution" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Institutions</SelectItem>
            <SelectItem value="platform">Platform-wide Courses</SelectItem>
            {Array.isArray(institutions) && institutions.map((institution) => (
              <SelectItem key={institution.id} value={institution.id.toString()}>
                {institution.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading || loadingStates.isFetching ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Loading data...' : 'Loading courses...'}
            </p>
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {courses.length === 0 
                ? 'No courses found. Please check your filters or add a new course.'
                : 'No courses match your current filters.'}
            </p>
            {courses.length === 0 && (
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4"
              >
                Add New Course
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          {console.log('🔍 Current viewMode:', viewMode)}
          {viewMode === 'list' ? (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          {(() => {
                            const isSubscriptionBased = course.institutionId === null && (
                              course.requiresSubscription || 
                              course.marketingType === 'LIVE_ONLINE' || 
                              course.marketingType === 'BLENDED'
                            );
                            
                            if (isSubscriptionBased && course.subscriptionTier) {
                              const subscriptionInfo = getStudentTier(course.subscriptionTier);
                              return (
                                <span className="text-blue-600 font-medium">
                                  {subscriptionInfo ? `${subscriptionInfo.name} ($${subscriptionInfo.price}/month)` : 'Subscription Required'}
                                </span>
                              );
                            } else {
                              return <span>${course.base_price}</span>;
                            }
                          })()}
                          <span>{course.duration} weeks</span>
                          <span className="capitalize">{course.level}</span>
                          <span className="capitalize">{course.status}</span>
                          <span>{course._count?.bookings || 0} bookings</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {course.courseTags?.map((ct) => (
                            <Badge
                              key={ct.tag.id}
                              variant="secondary"
                              style={{
                                backgroundColor: ct.tag.color || undefined,
                                color: ct.tag.color ? '#fff' : undefined
                              }}
                            >
                              {ct.tag.icon && <span className="mr-1">{ct.tag.icon}</span>}
                              {ct.tag.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/courses/${course.id}/enrollments`)}
                                className="text-purple-600 bg-purple-50 border-purple-200 hover:text-purple-700 hover:bg-purple-100"
                                title={`View Enrollments (${course._count?.enrollments || 0})`}
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Enrollments ({course._count?.enrollments || 0})</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/courses/${course.id}`)}
                          className="text-blue-600 bg-blue-50 border-blue-200 hover:text-blue-700 hover:bg-blue-100"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(course.id)}
                          className="text-green-600 bg-green-50 border-green-200 hover:text-green-700 hover:bg-green-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600 bg-red-50 border-red-200 hover:text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="p-4 sm:p-6 flex-grow">
                    {/* Course Title - Full width */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 leading-tight">
                        {course.title}
                      </h3>
                    </div>
                    
                    {/* Course Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>
                    
                    {/* Course Details */}
                    <div className="mb-4 flex flex-wrap gap-2 text-sm text-gray-500">
                      {(() => {
                        const isSubscriptionBased = course.institutionId === null && (
                          course.requiresSubscription || 
                          course.marketingType === 'LIVE_ONLINE' || 
                          course.marketingType === 'BLENDED'
                        );
                        
                        if (isSubscriptionBased && course.subscriptionTier) {
                          const subscriptionInfo = getStudentTier(course.subscriptionTier);
                          return (
                            <span className="font-medium text-blue-600">
                              {subscriptionInfo ? `${subscriptionInfo.name} ($${subscriptionInfo.price}/month)` : 'Subscription Required'}
                            </span>
                          );
                        } else {
                          return <span className="font-medium text-green-600">${course.base_price}</span>;
                        }
                      })()}
                      <span>{course.duration} weeks</span>
                      <span className="capitalize">{course.level}</span>
                      <span className="capitalize">{course.status}</span>
                    </div>
                    
                    {/* Institution Info */}
                    <div className="mb-4 text-sm text-gray-500">
                      <span className="font-medium">
                        {course.institution ? course.institution.name : 'Platform-wide'}
                      </span>
                      {!course.institution && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Available to all subscribers
                        </span>
                      )}
                    </div>
                    
                    {/* Course Tags */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {course.courseTags?.map((ct) => (
                        <Badge
                          key={ct.tag.id}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: ct.tag.color || undefined,
                            color: ct.tag.color ? '#fff' : undefined
                          }}
                        >
                          {ct.tag.icon && <span className="mr-1">{ct.tag.icon}</span>}
                          {ct.tag.name}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action Buttons - Separate row */}
                    <div className="flex justify-center items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/courses/${course.id}/enrollments`)}
                                className="h-8 w-8 p-0 text-purple-600 bg-purple-100 border-purple-300 hover:text-purple-700 hover:bg-purple-200"
                                title={`View Enrollments (${course._count?.enrollments || 0})`}
                              >
                                <Users className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Enrollments ({course._count?.enrollments || 0})</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/courses/${course.id}`)}
                                className="h-8 w-8 p-0 text-blue-600 bg-blue-50 border-blue-200 hover:text-blue-700 hover:bg-blue-100"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(course.id)}
                                className="h-8 w-8 p-0 text-green-600 bg-green-50 border-green-200 hover:text-green-700 hover:bg-green-100"
                              >
                                <Pencil className="w-4 h-4" />
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
                                onClick={() => handleDelete(course.id)}
                                className="h-8 w-8 p-0 text-red-600 bg-red-50 border-red-200 hover:text-red-700 hover:bg-red-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Course</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          {isLoadingMore ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Loading more courses...</span>
            </div>
          ) : (
            <div className="h-4" /> // Spacer
          )}
        </div>
      )}

      <UnsavedChangesDialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={handleDialogOpenChange}
        hasUnsavedChanges={hasUnsavedChanges}
        onConfirmClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedCourse(null);
          setHasUnsavedChanges(false);
          resetFormData();
        }}
        isSubmitting={isFormSubmitting}
        isFormSubmitting={isFormSubmitting}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? 'Edit Course' : 'Add New Course'}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen 
                ? 'Update the course details below. Click "Save Changes" to save, then "Close" when done.' 
                : 'Fill in the course details below.'}
            </DialogDescription>
          </DialogHeader>

          <AdminCourseForm
            formData={formData}
            setFormData={handleFormDataChange}
            categories={categories}
            selectedCourse={selectedCourse}
            onSubmit={handleFormSubmit}
            onUnsavedChangesChange={setHasUnsavedChanges}
            onPricingManagement={handlePricingManagement}
            onClose={() => handleDialogOpenChange(false)}
            institutions={institutions}
          />
        </DialogContent>
      </UnsavedChangesDialog>

      <Dialog 
        open={isWeeklyPricingOpen} 
        onOpenChange={(open) => {
          console.log('Weekly pricing dialog open state changed:', open);
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
          {selectedCourse && (
            <WeeklyPricingTable
              courseId={selectedCourse.id}
              initialPrices={selectedCourse.weeklyPrices || []}
              basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}
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
          console.log('Monthly pricing dialog open state changed:', open);
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
          {selectedCourse && (
            <MonthlyPricingTable
              courseId={selectedCourse.id}
              initialPrices={selectedCourse.monthlyPrices || []}
              basePrice={selectedCourse.base_price || parseFloat(formData.base_price) || 0}
              onPricesChange={handleMonthlyPricingChange}
              onUnsavedChangesChange={setHasUnsavedChanges}
              onClose={handleMonthlyPricingClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add loading indicators */}
      {loadingStates.isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Saving course...</p>
          </div>
        </div>
      )}

      {loadingStates.isFetching && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Loading course data...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCoursesPage() {
  // Render a static fallback first to avoid hook order mismatches during hydration
  return (
    <Suspense fallback={<div className="p-4">Loading admin courses...</div>}>
      <AdminCoursesContent />
    </Suspense>
  );
}