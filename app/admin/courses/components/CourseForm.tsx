'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseTagManager } from '@/components/CourseTagManager';
import type { Tag } from '@/components/CourseTagManager';
import { getFrameworkLevels, getFrameworkInfo, frameworkMappings, type Framework } from '@/lib/framework-utils';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
// import { toast } from 'sonner'; // Removed to fix server-side build issue

// Toast replacement for server-side compatibility
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message),
  loading: (message: string) => {
    console.log('Loading:', message);
    return 'toast-id'; // Return a dummy ID for compatibility
  },
  dismiss: (id: string) => console.log('Dismissed toast:', id)
};

// Define Institution interface - matches admin API response
interface Institution {
  id: string;
  name: string;
  email: string;
  institutionEmail: string;
  description: string;
  country: string;
  city: string;
  address: string;
  telephone: string;
  contactName: string;
  contactJobTitle: string;
  contactPhone: string;
  contactEmail: string;
  logoUrl: string | null;
  facilities: unknown[];
  status: string;
  createdAt: string;
  _count: {
    courses: number;
    bookings: number;
  };
  isApproved: boolean;
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
    name: z.string(),
    color: z.string().optional(),
    icon: z.string().optional()
  })),
  pricingPeriod: z.enum(['FULL_COURSE', 'WEEKLY', 'MONTHLY']),
  institutionId: z.string().min(1, 'Institution is required'),
  priority: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Priority must be a valid number greater than or equal to 0'
  }),
  isFeatured: z.boolean().default(false),
  isSponsored: z.boolean().default(false)
});

type CourseFormData = Omit<z.infer<typeof courseFormSchema>, 'tags'> & { tags: Tag[] };

interface CourseFormProps {
  formData: CourseFormData;
  setFormData: (data: CourseFormData) => void;
  categories: unknown[];
  selectedCourse?: unknown;
  onSubmit: (data: CourseFormData) => void | Promise<void>;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onPricingManagement?: (type: 'WEEKLY' | 'MONTHLY') => void;
  onClose?: () => void;
  institutions?: Institution[];
}

// Add timeout constant
const SAVING_TIMEOUT = 10000; // 10 seconds

export function AdminCourseForm({
  formData,
  setFormData,
  categories,
  selectedCourse,
  onSubmit,
  onUnsavedChangesChange,
  onPricingManagement,
  onClose,
  institutions = []
}: CourseFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add success toast for form initialization
  useEffect(() => {
    if (selectedCourse) {
      toast.success('Course data loaded successfully');
    }
  }, [selectedCourse]);

  // Update validateForm to be more specific about validation errors
  const validateForm = (data: CourseFormData): boolean => {
    const errors: Record<string, string> = {};
    
    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }
    if (!data.description?.trim()) {
      errors.description = 'Description is required';
    }
    if (!data.categoryId) {
      errors.categoryId = 'Category is required';
    }
    if (!data.institutionId) {
      errors.institutionId = 'Institution is required';
    }
    if (!data.base_price || isNaN(Number(data.base_price)) || Number(data.base_price) < 0) {
      errors.base_price = 'Valid base price is required';
    }
    if (!data.duration || isNaN(Number(data.duration)) || Number(data.duration) <= 0) {
      errors.duration = 'Valid duration is required';
    }
    if (!data.maxStudents || isNaN(Number(data.maxStudents)) || Number(data.maxStudents) <= 0) {
      errors.maxStudents = 'Valid max students is required';
    }
    if (!data.startDate) {
      errors.startDate = 'Start date is required';
    }
    if (!data.endDate) {
      errors.endDate = 'End date is required';
    }
    if (new Date(data.startDate) >= new Date(data.endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleFormChange to properly handle field changes
  const handleFormChange = (field: keyof CourseFormData, value: unknown) => {
    console.log('Form field changed:', field, value);
    
    // Normalize status to uppercase
    if (field === 'status') {
      value = value.toUpperCase();
    }

    // Handle framework and level changes
    let newFormData: CourseFormData;
    if (field === 'framework') {
      const newLevel = value === 'CEFR' ? 'CEFR_A1' : 'IELTS_4.0';
      newFormData = { ...formData, framework: value, level: newLevel };
    } else if (field === 'startDate' || field === 'endDate') {
      // Update the specific date field
      newFormData = { ...formData, [field]: value };
      
      // Calculate and update duration
      const newStartDate = field === 'startDate' ? value as string : formData.startDate;
      const newEndDate = field === 'endDate' ? value as string : formData.endDate;
      
      if (newStartDate && newEndDate) {
        const start = new Date(newStartDate);
        const end = new Date(newEndDate);
        
        if (start < end) {
          const timeDiff = end.getTime() - start.getTime();
          const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
          const weeksDiff = Math.ceil(daysDiff / 7);
          newFormData.duration = weeksDiff.toString();
        } else {
          newFormData.duration = '';
        }
      }
    } else {
      newFormData = { ...formData, [field]: value };
    }

    // Update form data through parent
    setFormData(newFormData);

    // Mark form as having unsaved changes
    console.log('Setting hasUnsavedChanges to true');
    onUnsavedChangesChange?.(true);
  };

  // Update handleFormSubmit to properly handle form state after submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    try {
      // Validate form data first
      if (!validateForm(formData)) {
        const errorMessage = Object.values(errors).join(', ');
        toast.error(`Please fix the following errors: ${errorMessage}`);
        return;
      }

      setIsSubmitting(true);
      const savingToast = toast.loading('Saving course...');
      const timeoutId = setTimeout(() => {
        toast.dismiss(savingToast);
        toast.error('Saving is taking longer than expected. Please try again.');
      }, SAVING_TIMEOUT);

      // Call parent's onSubmit and wait for it to complete
      await onSubmit(formData);
      
      // Clear timeout and dismiss loading toast
      clearTimeout(timeoutId);
      toast.dismiss(savingToast);
      
      // Reset form state
      setIsSubmitting(false);
      setErrors({});
      
      // Reset unsaved changes after successful submission
      console.log('Setting hasUnsavedChanges to false after successful submission');
      onUnsavedChangesChange?.(false);
      
      console.log('Form submission completed successfully');
      // Don't call onClose here - let user close manually
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(`Failed to in form submission:. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to save course');
      setIsSubmitting(false);
    }
  };

  // Add toast for pricing management
  const handlePricingClick = (type: 'WEEKLY' | 'MONTHLY') => {
    if (onPricingManagement) {
      toast.info(`Opening ${type.toLowerCase()} pricing management`);
      onPricingManagement(type);
    }
  };

  // Update handleCancel to properly handle form cancellation
  const handleCancel = () => {
    if (onUnsavedChangesChange) {
      onUnsavedChangesChange(false);
    }
    onClose?.();
  };

  const frameworkLevels = getFrameworkLevels(formData.framework as Framework);
  const frameworkInfo = getFrameworkInfo(formData.framework as Framework);

  // Add error display component
  const ErrorMessage = ({ field }: { field: keyof CourseFormData }) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
    );
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution *</Label>
          <Select
            value={formData.institutionId}
            onValueChange={(value) => handleFormChange('institutionId', value)}
            disabled={!!selectedCourse}
          >
            <SelectTrigger>
              <SelectValue>
                {(() => {
                  const institution = Array.isArray(institutions) ? institutions.find(i => i.id.toString() === formData.institutionId) : null;
                  return institution ? institution.name : 'Select institution';
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(institutions) && institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id.toString()}>
                  {institution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage field="institutionId" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            required
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <ErrorMessage field="title" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleFormChange('description', e.target.value)}
          required
          className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
          rows={4}
          aria-required="true"
        />
        <ErrorMessage field="description" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => handleFormChange('categoryId', value)}
            required
          >
            <SelectTrigger id="category" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.categoryId ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  No categories available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <ErrorMessage field="categoryId" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="base_price" className="text-sm font-medium">Base Price *</Label>
          <Input
            id="base_price"
            type="number"
            value={formData.base_price}
            onChange={(e) => handleFormChange('base_price', e.target.value)}
            required
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.base_price ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <ErrorMessage field="base_price" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-medium">Duration (weeks) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            placeholder="Calculated from start/end dates"
            required
            readOnly
            className={`bg-gray-50 cursor-not-allowed border-gray-300 ${
              errors.duration ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <p className="text-xs text-gray-500">Duration is automatically calculated from start and end dates</p>
          <ErrorMessage field="duration" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxStudents" className="text-sm font-medium">Max Students *</Label>
          <Input
            id="maxStudents"
            type="number"
            value={formData.maxStudents}
            onChange={(e) => handleFormChange('maxStudents', e.target.value)}
            required
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.maxStudents ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <ErrorMessage field="maxStudents" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleFormChange('startDate', e.target.value)}
            required
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.startDate ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <ErrorMessage field="startDate" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleFormChange('endDate', e.target.value)}
            required
            className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.endDate ? 'border-red-500' : ''
            }`}
            aria-required="true"
          />
          <ErrorMessage field="endDate" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Tags</Label>
        <CourseTagManager
          selectedTags={formData.tags}
          onTagsChange={(tags) => {
            console.log('Tags changed in CourseTagManager:', tags);
            const newFormData = { ...formData, tags };
            setFormData(newFormData);
            onUnsavedChangesChange?.(true);
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="framework" className="text-sm font-medium">Framework *</Label>
          <Select
            value={formData.framework}
            onValueChange={(value) => handleFormChange('framework', value)}
            required
          >
            <SelectTrigger id="framework" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.framework ? 'border-red-500' : ''
            }`}>
              <SelectValue>{frameworkInfo.label || 'Select framework'}</SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.entries(frameworkMappings).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage field="framework" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium">Level *</Label>
          <Select
            value={formData.level}
            onValueChange={(value) => handleFormChange('level', value)}
            required
          >
            <SelectTrigger id="level" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.level ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {frameworkLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ErrorMessage field="level" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pricingPeriod" className="text-sm font-medium">Pricing Period *</Label>
          <Select
            value={formData.pricingPeriod}
            onValueChange={(value) => handleFormChange('pricingPeriod', value)}
            required
          >
            <SelectTrigger id="pricingPeriod" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.pricingPeriod ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select pricing period" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="FULL_COURSE">Full Course</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage field="pricingPeriod" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium">Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleFormChange('status', value)}
            required
          >
            <SelectTrigger id="status" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.status ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage field="status" />
        </div>
      </div>

      {/* Priority Management Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Management</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-sm font-medium">Priority Score</Label>
            <Input
              id="priority"
              type="number"
              min="0"
              value={formData.priority || '0'}
              onChange={(e) => handleFormChange('priority', e.target.value)}
              className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                errors.priority ? 'border-red-500' : ''
              }`}
              placeholder="0"
            />
            <p className="text-xs text-gray-500">
              Higher scores appear first in listings. System calculates base score automatically.
            </p>
            <ErrorMessage field="priority" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => handleFormChange('isFeatured', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isFeatured" className="text-sm font-medium">Featured Course</Label>
            </div>
            <p className="text-xs text-gray-500">
              Featured courses get priority placement and special styling.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isSponsored"
                checked={formData.isSponsored || false}
                onChange={(e) => handleFormChange('isSponsored', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isSponsored" className="text-sm font-medium">Sponsored Course</Label>
            </div>
            <p className="text-xs text-gray-500">
              Sponsored courses appear in premium advertising positions.
            </p>
          </div>
        </div>
      </div>

      {formData.pricingPeriod === 'WEEKLY' && (
        <div className="grid grid-cols-1 gap-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePricingClick('WEEKLY')}
            className="w-full"
            disabled={false}
            title="Manage weekly pricing"
          >
            Manage Weekly Pricing
          </Button>
        </div>
      )}

      {formData.pricingPeriod === 'MONTHLY' && (
        <div className="grid grid-cols-1 gap-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => handlePricingClick('MONTHLY')}
            className="w-full"
            disabled={false}
            title="Manage monthly pricing"
          >
            Manage Monthly Pricing
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).length > 0}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? 'Saving...' : selectedCourse ? 'Save Changes' : 'Create Course'}
        </Button>
        {selectedCourse && (
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        )}
      </div>
    </form>
  );
} 