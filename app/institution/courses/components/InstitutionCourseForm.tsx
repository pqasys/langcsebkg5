'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseTagManager } from '@/components/CourseTagManager';
import { getFrameworkLevels, getFrameworkInfo, type Framework, frameworkMappings } from '@/lib/framework-utils';
import { Textarea } from '@/components/ui/textarea';
import { FaSpinner } from 'react-icons/fa';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

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

interface CourseFormProps {
  formData: {
    title: string;
    description: string;
    base_price: string;
    duration: string;
    level: string;
    framework: Framework;
    status: string;
    categoryId: string;
    startDate: string;
    endDate: string;
    maxStudents: string;
    tags: { id: string; name: string; color?: string; icon?: string }[];
    pricingPeriod: 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY';
    institutionId: string;
  };
  setFormData: (data: unknown) => void;
  categories: unknown[];
  selectedCourse?: Course;
  onSubmit: (data: unknown) => Promise<void>;
  institutionId: string;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onPricingManagement?: (type: 'WEEKLY' | 'MONTHLY') => void;
  courses: unknown[];
  onClose?: () => void;
}

export function InstitutionCourseForm({
  formData,
  setFormData,
  categories,
  selectedCourse,
  onSubmit,
  institutionId,
  onUnsavedChangesChange,
  onPricingManagement,
  courses,
  onClose
}: CourseFormProps) {
  const [initialFormData, setInitialFormData] = useState(formData);
  const defaultMaxStudents = 15;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [availableLevels, setAvailableLevels] = useState<{ value: string; label: string }[]>([]);

  // Track if base price or pricing period has changed
  const hasPricingChanges = formData.base_price !== initialFormData.base_price || 
                          formData.pricingPeriod !== initialFormData.pricingPeriod;

  // Update available levels when framework changes
  useEffect(() => {
    const levels = getFrameworkLevels(formData.framework);
    setAvailableLevels(levels);
  }, [formData.framework]);

  // Update initial form data when selected course changes
  useEffect(() => {
    if (selectedCourse) {
      console.log('InstitutionCourseForm: Initializing form with course data:', selectedCourse);
      console.log('InstitutionCourseForm: selectedCourse.courseTags:', selectedCourse.courseTags);
      
      const initialData = {
        title: selectedCourse.title,
        description: selectedCourse.description,
        categoryId: selectedCourse.categoryId,
        framework: selectedCourse.framework as Framework,
        level: (selectedCourse.level || '').toUpperCase(),
        status: (selectedCourse.status || 'DRAFT').toUpperCase(),
        base_price: selectedCourse.base_price.toString(),
        pricingPeriod: selectedCourse.pricingPeriod as 'FULL_COURSE' | 'WEEKLY' | 'MONTHLY',
        duration: selectedCourse.duration.toString(),
        startDate: selectedCourse.startDate ? new Date(selectedCourse.startDate).toISOString().split('T')[0] : '',
        endDate: selectedCourse.endDate ? new Date(selectedCourse.endDate).toISOString().split('T')[0] : '',
        maxStudents: selectedCourse.maxStudents?.toString() || '',
        tags: selectedCourse.courseTags?.map(ct => ({
          id: ct.tag.id,
          name: ct.tag.name,
          color: ct.tag.color,
          icon: ct.tag.icon
        })) || [],
        institutionId: institutionId
      };
      console.log('InstitutionCourseForm: Setting initial form data:', initialData);
      console.log('InstitutionCourseForm: Mapped tags:', initialData.tags);
      setFormData(initialData);
      setInitialFormData(initialData);
    }
  }, [selectedCourse]);

  // Set default values when creating a new course
  useEffect(() => {
    if (!selectedCourse) {
      setFormData({
        ...formData,
        pricingPeriod: 'FULL_COURSE',
        base_price: '0'
      });
    }
  }, [selectedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current form data:', JSON.stringify(formData, null, 2));
    console.log('Institution ID:', institutionId);
    console.log('Is edit mode:', !!selectedCourse);
    console.log('Tags before submission:', JSON.stringify(formData.tags, null, 2));

    // Validate required fields
    const requiredFields = ['title', 'description', 'categoryId', 'framework', 'level', 'status'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      const courseData = {
        ...formData,
        status: formData.status.toUpperCase(),
        level: formData.level.toUpperCase(),
        duration: Number(formData.duration),
        base_price: Number(formData.base_price),
        maxStudents: Number(formData.maxStudents),
        // Only include institutionId for new courses
        ...(selectedCourse ? {} : { institutionId }),
        // Keep tags as objects with id property to match API schema
        tags: formData.tags.map((tag: unknown) => ({ id: tag.id }))
      };

      console.log('Submitting course data:', JSON.stringify(courseData, null, 2));
      console.log('Selected course:', selectedCourse ? JSON.stringify(selectedCourse, null, 2) : 'No course selected');
      
      await onSubmit(courseData);
      console.log('Form submitted successfully');
      setInitialFormData(formData);
      onUnsavedChangesChange?.(false);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to submitting form. Please try again or contact support if the problem persists.`);
      if (error instanceof Error) {
        toast.error(`Failed to details. Please try again or contact support if the problem persists.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: keyof typeof formData, value: unknown) => {
    console.log('Form field changed:', { field, value });
    
    if (field === 'startDate' || field === 'endDate') {
      // Update the specific date field
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        
        // Calculate and update duration
        const newStartDate = field === 'startDate' ? value as string : prev.startDate;
        const newEndDate = field === 'endDate' ? value as string : prev.endDate;
        
        if (newStartDate && newEndDate) {
          const start = new Date(newStartDate);
          const end = new Date(newEndDate);
          
          if (start < end) {
            const timeDiff = end.getTime() - start.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const weeksDiff = Math.ceil(daysDiff / 7);
            newData.duration = weeksDiff.toString();
          } else {
            newData.duration = '';
          }
        }
        
        console.log('New form data:', JSON.stringify(newData, null, 2));
        return newData;
      });
    } else {
      setFormData(prev => {
        const newData = { ...prev, [field]: value };
        console.log('New form data:', JSON.stringify(newData, null, 2));
        return newData;
      });
    }
    
    onUnsavedChangesChange?.(true);
  };

  // Initialize form with default values if not provided
  useEffect(() => {
    if (!formData.maxStudents) {
      setFormData(prev => ({
        ...prev,
        maxStudents: '15'
      }));
    }
  }, []);

  const getFrameworkLevels = (framework: string) => {
    switch (framework) {
      case 'CEFR':
        return [
          { value: 'CEFR_A1', label: 'A1' },
          { value: 'CEFR_A2', label: 'A2' },
          { value: 'CEFR_B1', label: 'B1' },
          { value: 'CEFR_B2', label: 'B2' },
          { value: 'CEFR_C1', label: 'C1' },
          { value: 'CEFR_C2', label: 'C2' }
        ];
      case 'IELTS':
        return [
          { value: 'IELTS_3', label: '3.0' },
          { value: 'IELTS_4', label: '4.0' },
          { value: 'IELTS_5', label: '5.0' },
          { value: 'IELTS_6', label: '6.0' },
          { value: 'IELTS_7', label: '7.0' },
          { value: 'IELTS_8', label: '8.0' },
          { value: 'IELTS_9', label: '9.0' }
        ];
      case 'TOEFL':
        return [
          { value: 'TOEFL_0', label: '0-30' },
          { value: 'TOEFL_31', label: '31-60' },
          { value: 'TOEFL_61', label: '61-90' },
          { value: 'TOEFL_91', label: '91-120' }
        ];
      default:
        return [];
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleFormChange('title', e.target.value)}
          placeholder="Enter course title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
          placeholder="Enter course description"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleFormChange('categoryId', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="framework">Framework *</Label>
          <Select
            value={formData.framework}
            onValueChange={(value) => handleFormChange('framework', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(frameworkMappings).map((framework) => (
                <SelectItem key={framework} value={framework}>
                  {framework}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="level">Level *</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => handleFormChange('level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {availableLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => {
              console.log('Status changed to:', value);
              handleFormChange('status', value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">DRAFT</SelectItem>
              <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
              <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="base_price">Base Price *</Label>
          <Input
            id="base_price"
            type="number"
            min="0"
            step="0.01"
            value={formData.base_price}
            onChange={(e) => handleFormChange('base_price', e.target.value)}
            placeholder="Enter base price"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricingPeriod">Pricing Period *</Label>
          <Select
            value={formData.pricingPeriod}
            onValueChange={(value) => handleFormChange('pricingPeriod', value)}
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

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (weeks) *</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={formData.duration}
            placeholder="Calculated from start/end dates"
            required
            readOnly
            className="bg-gray-50 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">Duration is automatically calculated from start and end dates</p>
        </div>
      </div>

      {/* Add Pricing Management Buttons */}
      {formData.pricingPeriod !== 'FULL_COURSE' && (
        <div className="flex gap-4">
          {formData.pricingPeriod === 'WEEKLY' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log('Weekly pricing button clicked');
                if (onPricingManagement) {
                  onPricingManagement('WEEKLY');
                }
              }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Manage Weekly Prices
            </Button>
          )}
          {formData.pricingPeriod === 'MONTHLY' && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                console.log('Monthly pricing button clicked');
                if (onPricingManagement) {
                  onPricingManagement('MONTHLY');
                }
              }}
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Manage Monthly Prices
            </Button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleFormChange('startDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleFormChange('endDate', e.target.value)}
            min={formData.startDate}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="maxStudents">Maximum Students *</Label>
          <Input
            id="maxStudents"
            type="number"
            min="1"
            value={formData.maxStudents || '15'}
            onChange={(e) => handleFormChange('maxStudents', e.target.value)}
            required
            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Default: 15"
            aria-required="true"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <CourseTagManager
          selectedTags={formData.tags}
          onTagsChange={(tags) => handleFormChange('tags', tags)}
          courses={courses}
        />
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            console.log('Cancel button clicked');
            if (onUnsavedChangesChange) {
              onUnsavedChangesChange(false);
            }
            onClose?.();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          onClick={() => console.log('Submit button clicked')}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Course'
          )}
        </Button>
      </div>
    </form>
  );
} 