'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseTagManager } from '@/components/CourseTagManager';
import type { Tag } from '@/components/CourseTagManager';
// Using native radios for robust mutually-exclusive selection
import { getFrameworkLevels, getFrameworkInfo, frameworkMappings, type Framework } from '@/lib/framework-utils';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
// Using sonner toast for client-side notifications

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
  institutionId: z.string().optional(),
  priority: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
    message: 'Priority must be a valid number greater than or equal to 0'
  }),
  isFeatured: z.boolean().default(false),
  isSponsored: z.boolean().default(false),
  // Simplified course classification fields
  hasLiveClasses: z.boolean().default(false),
  liveClassType: z.string().optional(),
  liveClassFrequency: z.string().optional(),
  liveClassSchedule: z.object({
    dayOfWeek: z.string().optional(),
    time: z.string().optional(),
    timezone: z.string().optional()
  }).optional(),
  isPlatformCourse: z.boolean().default(false),
  requiresSubscription: z.boolean().default(false),
  subscriptionTier: z.string().optional(),
  // Marketing fields
  marketingType: z.enum(['IN_PERSON', 'LIVE_ONLINE', 'SELF_PACED', 'BLENDED']).default('SELF_PACED'),
  marketingDescription: z.string().optional()
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
  uiWarning?: string;
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
  institutions = [],
  uiWarning
}: CourseFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof CourseFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Remove verbose init toast

  // Normalize mutually exclusive placement on mount and when toggled
  useEffect(() => {
    if (formData.isFeatured && formData.isSponsored) {
      // Prefer Featured if both are mistakenly true
      const normalized = { ...formData, isSponsored: false };
      setFormData(normalized);
    }
  }, [formData.isFeatured, formData.isSponsored, setFormData]);

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
    // Skip base price validation for platform subscription courses
    if (!(data.isPlatformCourse && data.requiresSubscription)) {
      if (!data.base_price || isNaN(Number(data.base_price)) || Number(data.base_price) < 0) {
        errors.base_price = 'Valid base price is required';
      }
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
    
    // Live class validation
    if (data.hasLiveClasses) {
      if (!data.liveClassType) {
        errors.liveClassType = 'Live class type is required when live classes are enabled';
      }
      if (!data.liveClassFrequency) {
        errors.liveClassFrequency = 'Live class frequency is required when live classes are enabled';
      }
    }
    
    // Platform course validation
    if (data.isPlatformCourse && !data.requiresSubscription) {
      errors.requiresSubscription = 'Platform courses (institutionId = null) must require subscription';
    }
    
    // Subscription validation
    if (data.requiresSubscription && !data.subscriptionTier) {
      errors.subscriptionTier = 'Subscription tier is required when subscription is required';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Update handleFormChange to properly handle field changes
  const handleFormChange = (field: keyof CourseFormData, value: unknown) => {
    // no-op debug removed
    
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

    // Handle platform subscription course logic
    if (field === 'isPlatformCourse' || field === 'requiresSubscription') {
      const isPlatformSubscription = newFormData.isPlatformCourse && newFormData.requiresSubscription;
      
      // If this is now a platform subscription course, set pricing defaults
      if (isPlatformSubscription) {
        newFormData.base_price = '0'; // Set to 0 for subscription courses
        newFormData.pricingPeriod = 'FULL_COURSE'; // Set to full course for subscription courses
      }
    }

    // Update form data through parent
    setFormData(newFormData);

    // Mark form as having unsaved changes
    // no-op debug removed
    onUnsavedChangesChange?.(true);
  };

  // Update handleFormSubmit to properly handle form state after submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // no-op debug removed
    
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

      // Ensure mutually exclusive placement is reflected explicitly in submit payload
      const currentPlacement = placementRef.current;
      const dataToSubmit = {
        ...formData,
        isFeatured: currentPlacement === 'FEATURED',
        isSponsored: currentPlacement === 'SPONSORED',
      } as typeof formData;
      // no-op debug removed

      // Call parent's onSubmit and wait for it to complete
      await onSubmit(dataToSubmit as any);
      
      // Clear timeout and dismiss loading toast
      clearTimeout(timeoutId);
      toast.dismiss(savingToast);
      
      // Reset form state
      setIsSubmitting(false);
      setErrors({});
      
      // Reset unsaved changes after successful submission
      onUnsavedChangesChange?.(false);
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
  const placement = formData.isSponsored ? 'SPONSORED' : formData.isFeatured ? 'FEATURED' : 'NORMAL';
  const [placementLocal, setPlacementLocal] = useState<string>(placement);
  const placementRef = useRef<string>(placement);
  useEffect(() => {
    placementRef.current = placement;
    setPlacementLocal(placement);
  }, [placement]);

  // Add error display component
  const ErrorMessage = ({ field }: { field: keyof CourseFormData }) => {
    if (!errors[field]) return null;
    return (
      <p className="text-sm text-red-500 mt-1">{errors[field]}</p>
    );
  };

  // Debug placement changes
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[CourseForm] placement flags changed', {
      isFeatured: formData.isFeatured,
      isSponsored: formData.isSponsored,
      derivedPlacement: placement,
    });
  }, [formData.isFeatured, formData.isSponsored, placement]);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {(formData.isPlatformCourse && formData.hasLiveClasses && formData.marketingType === 'LIVE_ONLINE') && (
        <div className="p-3 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900">
          <div className="text-sm font-medium">Live class governance</div>
          <div className="text-xs mt-1">
            Changes to Start/End Dates or Live Class Frequency may be blocked if any auto-generated session has enrollments or is not in SCHEDULED status.
          </div>
          <ul className="list-disc pl-5 text-xs mt-2 space-y-1">
            <li>If blocked, cancel or migrate affected sessions, or unenroll participants, then try again.</li>
            <li>Extending dates will add new sessions; shrinking dates may remove future/earlier sessions when allowed.</li>
          </ul>
          {uiWarning && (
            <div className="mt-2 p-2 rounded border border-red-300 bg-red-50 text-red-800 text-xs">
              <span className="font-semibold">Blocked:</span> {uiWarning}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="institution">Institution</Label>
          <Select
            value={formData.institutionId || "none"}
            onValueChange={(value) => handleFormChange('institutionId', value === "none" ? "" : value)}
            disabled={!!selectedCourse}
          >
            <SelectTrigger>
              <SelectValue>
                {(() => {
                  if (!formData.institutionId) {
                    return 'Platform-wide (no institution)';
                  }
                  const institution = Array.isArray(institutions) ? institutions.find(i => i.id.toString() === formData.institutionId) : null;
                  return institution ? institution.name : 'Select institution';
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Platform-wide (available to all subscribers)</SelectItem>
              {Array.isArray(institutions) && institutions.map((institution) => (
                <SelectItem key={institution.id} value={institution.id.toString()}>
                  {institution.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Platform-wide courses are available to all subscribers. Institution-specific courses are only available to students enrolled in that institution.
          </p>
          <ErrorMessage field="institutionId" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketingType" className="text-sm font-medium">Marketing Type *</Label>
          <Select
            value={formData.marketingType}
            onValueChange={(value) => handleFormChange('marketingType', value)}
            required
          >
            <SelectTrigger id="marketingType" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.marketingType ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select marketing type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="SELF_PACED">Self-Paced</SelectItem>
              <SelectItem value="LIVE_ONLINE">Live Online</SelectItem>
              <SelectItem value="IN_PERSON">In-Person</SelectItem>
              <SelectItem value="BLENDED">Blended</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            How the course is marketed to students (independent of technical implementation)
          </p>
          <ErrorMessage field="marketingType" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="hasLiveClasses" className="text-sm font-medium">Has Live Classes</Label>
          <Select
            value={formData.hasLiveClasses ? 'true' : 'false'}
            onValueChange={(value) => handleFormChange('hasLiveClasses', value === 'true')}
          >
            <SelectTrigger id="hasLiveClasses" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.hasLiveClasses ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select if course has live classes" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Enable live class functionality for this course
          </p>
          <ErrorMessage field="hasLiveClasses" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isPlatformCourse" className="text-sm font-medium">Is Platform Course</Label>
          <Select
            value={formData.isPlatformCourse ? 'true' : 'false'}
            onValueChange={(value) => handleFormChange('isPlatformCourse', value === 'true')}
          >
            <SelectTrigger id="isPlatformCourse" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.isPlatformCourse ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select if this is a platform course" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="true">Yes (Platform-wide)</SelectItem>
              <SelectItem value="false">No (Institution-specific)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Platform courses are available to all subscribers, institution courses are institution-specific
          </p>
          <ErrorMessage field="isPlatformCourse" />
        </div>
      </div>



      {formData.hasLiveClasses && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="liveClassType" className="text-sm font-medium">Live Class Type</Label>
            <Select
              value={formData.liveClassType || ''}
              onValueChange={(value) => handleFormChange('liveClassType', value)}
            >
              <SelectTrigger id="liveClassType" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                errors.liveClassType ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select live class type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="CONVERSATION">Conversation Practice</SelectItem>
                <SelectItem value="COMPREHENSIVE">Comprehensive Learning</SelectItem>
                <SelectItem value="WORKSHOP">Workshop</SelectItem>
                <SelectItem value="TUTORIAL">Tutorial</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage field="liveClassType" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveClassFrequency" className="text-sm font-medium">Live Class Frequency</Label>
            <Select
              value={formData.liveClassFrequency || ''}
              onValueChange={(value) => handleFormChange('liveClassFrequency', value)}
            >
              <SelectTrigger id="liveClassFrequency" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                errors.liveClassFrequency ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select live class frequency" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage field="liveClassFrequency" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="requiresSubscription" className="text-sm font-medium">Requires Subscription</Label>
          <Select
            value={formData.requiresSubscription ? 'true' : 'false'}
            onValueChange={(value) => handleFormChange('requiresSubscription', value === 'true')}
          >
            <SelectTrigger id="requiresSubscription" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
              errors.requiresSubscription ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder="Select if course requires subscription" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
          <ErrorMessage field="requiresSubscription" />
        </div>

        {formData.requiresSubscription && (
          <div className="space-y-2">
            <Label htmlFor="subscriptionTier" className="text-sm font-medium">Subscription Tier</Label>
            <Select
              value={formData.subscriptionTier || ''}
              onValueChange={(value) => handleFormChange('subscriptionTier', value)}
            >
              <SelectTrigger id="subscriptionTier" className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
                errors.subscriptionTier ? 'border-red-500' : ''
              }`}>
                <SelectValue placeholder="Select subscription tier" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="BASIC">Basic</SelectItem>
                <SelectItem value="PREMIUM">Premium</SelectItem>
                <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <ErrorMessage field="subscriptionTier" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marketingDescription" className="text-sm font-medium">Marketing Description</Label>
        <Textarea
          id="marketingDescription"
          value={formData.marketingDescription || ''}
          onChange={(e) => handleFormChange('marketingDescription', e.target.value)}
          className={`bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${
            errors.marketingDescription ? 'border-red-500' : ''
          }`}
          rows={3}
          placeholder="Optional marketing description for the course"
        />
        <p className="text-xs text-gray-500">
          Additional marketing text to describe the course to potential students
        </p>
        <ErrorMessage field="marketingDescription" />
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
          <Label htmlFor="base_price" className={`text-sm font-medium ${formData.isPlatformCourse && formData.requiresSubscription ? 'text-gray-500' : ''}`}>
            Base Price *
            {formData.isPlatformCourse && formData.requiresSubscription && (
              <span className="text-xs text-gray-500 ml-2">(Disabled for subscription courses)</span>
            )}
          </Label>
          <Input
            id="base_price"
            type="number"
            value={formData.base_price}
            onChange={(e) => handleFormChange('base_price', e.target.value)}
            required={!(formData.isPlatformCourse && formData.requiresSubscription)}
            disabled={formData.isPlatformCourse && formData.requiresSubscription}
            className={`${
              formData.isPlatformCourse && formData.requiresSubscription 
                ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${
              errors.base_price ? 'border-red-500' : ''
            }`}
            aria-required={!(formData.isPlatformCourse && formData.requiresSubscription)}
          />
          {formData.isPlatformCourse && formData.requiresSubscription && (
            <p className="text-xs text-gray-500">
              Pricing is determined by subscription tiers for platform-wide subscription courses
            </p>
          )}
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
          <Label htmlFor="pricingPeriod" className={`text-sm font-medium ${formData.isPlatformCourse && formData.requiresSubscription ? 'text-gray-500' : ''}`}>
            Pricing Period *
            {formData.isPlatformCourse && formData.requiresSubscription && (
              <span className="text-xs text-gray-500 ml-2">(Disabled for subscription courses)</span>
            )}
          </Label>
          <Select
            value={formData.pricingPeriod}
            onValueChange={(value) => handleFormChange('pricingPeriod', value)}
            required={!(formData.isPlatformCourse && formData.requiresSubscription)}
            disabled={formData.isPlatformCourse && formData.requiresSubscription}
          >
            <SelectTrigger id="pricingPeriod" className={`${
              formData.isPlatformCourse && formData.requiresSubscription 
                ? 'bg-gray-100 cursor-not-allowed border-gray-300' 
                : 'bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            } ${
              errors.pricingPeriod ? 'border-red-500' : ''
            }`}>
              <SelectValue placeholder={
                formData.isPlatformCourse && formData.requiresSubscription 
                  ? "N/A for subscription courses" 
                  : "Select pricing period"
              } />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="FULL_COURSE">Full Course</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
            </SelectContent>
          </Select>
          {formData.isPlatformCourse && formData.requiresSubscription && (
            <p className="text-xs text-gray-500">
              Pricing period is not applicable for platform-wide subscription courses
            </p>
          )}
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

          <div className="space-y-3">
            <Label className="text-sm font-medium">Placement</Label>
            <div className="flex flex-row flex-wrap items-center gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="placement"
                  value="NORMAL"
                  checked={placementLocal === 'NORMAL'}
                  onChange={() => {
                    setPlacementLocal('NORMAL');
                    handleFormChange('isFeatured', false);
                    handleFormChange('isSponsored', false);
                    placementRef.current = 'NORMAL';
                  }}
                  className="h-4 w-4 accent-blue-600"
                  style={{ appearance: 'auto', WebkitAppearance: 'radio', MozAppearance: 'radio' as any }}
                />
                <span className="text-sm text-gray-800">Normal</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="placement"
                  value="FEATURED"
                  checked={placementLocal === 'FEATURED'}
                  onChange={() => {
                    setPlacementLocal('FEATURED');
                    handleFormChange('isFeatured', true);
                    handleFormChange('isSponsored', false);
                    placementRef.current = 'FEATURED';
                  }}
                  className="h-4 w-4 accent-blue-600"
                  style={{ appearance: 'auto', WebkitAppearance: 'radio', MozAppearance: 'radio' as any }}
                />
                <span className="text-sm text-gray-800">Featured</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="placement"
                  value="SPONSORED"
                  checked={placementLocal === 'SPONSORED'}
                  onChange={() => {
                    setPlacementLocal('SPONSORED');
                    handleFormChange('isSponsored', true);
                    handleFormChange('isFeatured', false);
                    placementRef.current = 'SPONSORED';
                  }}
                  className="h-4 w-4 accent-blue-600"
                  style={{ appearance: 'auto', WebkitAppearance: 'radio', MozAppearance: 'radio' as any }}
                />
                <span className="text-sm text-gray-800">Sponsored</span>
              </label>
            </div>
            <p className="text-xs text-gray-600">Only one of Featured or Sponsored can be selected.</p>
          </div>
        </div>
      </div>

      {formData.pricingPeriod === 'WEEKLY' && !(formData.isPlatformCourse && formData.requiresSubscription) && (
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

      {formData.pricingPeriod === 'MONTHLY' && !(formData.isPlatformCourse && formData.requiresSubscription) && (
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

      {formData.isPlatformCourse && formData.requiresSubscription && (
        <div className="grid grid-cols-1 gap-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Platform Subscription Course</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Pricing is managed through subscription tiers. Individual course pricing controls are disabled.
            </p>
          </div>
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