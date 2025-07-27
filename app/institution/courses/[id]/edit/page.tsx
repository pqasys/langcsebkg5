'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { InstitutionCourseForm } from '../../components/InstitutionCourseForm';
import { useSession } from 'next-auth/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { WeeklyPricingTable } from '../../components/WeeklyPricingTable';
import { MonthlyPricingTable } from '../../components/MonthlyPricingTable';

interface Course {
  id: string;
  title: string;
  description: string;
  base_price: number;
  duration: number;
  level: string;
  status: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  framework?: string;
  pricingPeriod?: string;
  courseTags?: {
    tag: {
      id: string;
      name: string;
      color?: string;
      icon?: string;
    }
  }[];
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isWeeklyPricingOpen, setIsWeeklyPricingOpen] = useState(false);
  const [isMonthlyPricingOpen, setIsMonthlyPricingOpen] = useState(false);
  const [selectedCourseForPricing, setSelectedCourseForPricing] = useState<Course | null>(null);
  const [weeklyPrices, setWeeklyPrices] = useState<any[]>([]);
  const [monthlyPrices, setMonthlyPrices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    base_price: '0',
    duration: '30',
    level: 'CEFR_A1',
    framework: 'CEFR' as 'CEFR' | 'IELTS' | 'TOEFL' | 'TOEIC' | 'CAMBRIDGE',
    status: 'DRAFT',
    categoryId: '',
    startDate: '',
    endDate: '',
    maxStudents: '15',
    tags: [] as { id: string; name: string; color?: string; icon?: string }[],
    pricingPeriod: 'FULL_COURSE' as 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY',
    institutionId: session?.user?.institutionId || ''
  });

  useEffect(() => {
    fetchCourse();
    fetchCategories();
  }, [params.id]);

  useEffect(() => {
    if (session?.user?.institutionId) {
      setFormData(prev => ({
        ...prev,
        institutionId: session.user.institutionId
      }));
    }
  }, [session]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/courses/${params.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch course - Context: throw new Error('Failed to fetch course');...`);
      }
      const data = await response.json();
      setCourse(data);
      
      // Initialize form data with course data
      setFormData({
        title: data.title,
        description: data.description || '',
        base_price: data.base_price.toString(),
        duration: data.duration.toString(),
        level: data.level,
        framework: data.framework || 'CEFR',
        status: data.status,
        categoryId: data.categoryId,
        startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
        endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
        maxStudents: data.maxStudents.toString(),
        tags: data.courseTags?.map((ct: unknown) => ({
          id: ct.tag.id,
          name: ct.tag.name,
          color: ct.tag.color,
          icon: ct.tag.icon
        })) || [],
        pricingPeriod: data.pricingPeriod || 'FULL_COURSE',
        institutionId: session?.user?.institutionId || ''
      });
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load course. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error(`Failed to fetch categories - Context: const response = await fetch('/api/categories');...`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load categories. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load categories');
    }
  };

  const handleSubmit = async (courseData: unknown) => {
    try {
      setLoading(true);
      // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Submitting course data:', courseData);
      
      const response = await fetch(`/api/institution/courses/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error('API Error:');
        throw new Error(errorData.error || 'Failed to update course');
      }

      const updatedCourse = await response.json();
      console.log('Course updated successfully:', updatedCourse);
      toast.success('Course updated successfully');
      router.push('/institution/courses');
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating course. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update course');
      throw error; // Re-throw to let the form handle the error
    } finally {
      setLoading(false);
    }
  };

  const handlePricingManagement = (type: 'WEEKLY' | 'MONTHLY') => {
    console.log('Pricing management requested:', type);
    if (!course) {
      toast.error('No course selected');
      return;
    }
    setSelectedCourseForPricing(course);
    setIsWeeklyPricingOpen(type === 'WEEKLY');
    setIsMonthlyPricingOpen(type === 'MONTHLY');
  };

  const handleWeeklyPricingChange = (prices: unknown[]) => {
    console.log('Weekly pricing changed:', prices);
    setWeeklyPrices(prices);
  };

  const handleWeeklyPricingClose = () => {
    console.log('Weekly pricing dialog closed');
    setIsWeeklyPricingOpen(false);
    setSelectedCourseForPricing(null);
    if (course?.id) {
      console.log('Refreshing course after pricing close');
      fetchCourse();
    }
  };

  const handleMonthlyPricingChange = (prices: unknown[]) => {
    console.log('Monthly pricing changed:', prices);
    setMonthlyPrices(prices);
  };

  const handleMonthlyPricingClose = () => {
    console.log('Monthly pricing dialog closed');
    setIsMonthlyPricingOpen(false);
    setSelectedCourseForPricing(null);
    if (course?.id) {
      console.log('Refreshing course after pricing close');
      fetchCourse();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" disabled>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Loading...</h1>
            <p className="text-muted-foreground">Please wait while we load the course details</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The requested course could not be found.</p>
          <Button onClick={() => router.push('/institution/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-muted-foreground">
            Update course details for "{course.title}"
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent>
          <InstitutionCourseForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            selectedCourse={course}
            onSubmit={handleSubmit}
            institutionId={session?.user?.institutionId || ''}
            onUnsavedChangesChange={() => {}}
            onPricingManagement={handlePricingManagement}
            courses={[]}
            onClose={() => router.back()}
          />
        </CardContent>
      </Card>

      {/* Weekly Pricing Modal */}
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
              onUnsavedChangesChange={() => {}}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Monthly Pricing Modal */}
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