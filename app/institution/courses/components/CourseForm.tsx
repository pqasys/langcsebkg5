'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CourseTagManager } from '@/components/CourseTagManager';
import { getFrameworkLevels, getFrameworkInfo, type Framework, frameworkMappings, validateLevelForFramework, getLevelLabel } from '@/lib/framework-utils';
import { WeeklyPricingTable } from './WeeklyPricingTable';
import { TimeBasedPricingRules } from './TimeBasedPricingRules';
import { useCurrency } from '@/app/hooks/useCurrency';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface CourseFormData {
  title: string;
  description: string;
  base_price: string;
  pricingPeriod: 'WEEKLY' | 'MONTHLY' | 'FULL_COURSE';
  duration: string;
  level: string;
  framework: Framework;
  status: string;
  categoryId: string;
  startDate: string;
  endDate: string;
  maxStudents: string;
  tags: unknown[];
  weeklyPrices?: unknown[];
  monthlyPrices?: unknown[];
  price?: string;
  // Simplified course classification fields
  hasLiveClasses: boolean;
  liveClassType: string;
  liveClassFrequency: string;
  liveClassSchedule?: {
    dayOfWeek?: string;
    time?: string;
    timezone?: string;
  };
  isPlatformCourse: boolean;
  requiresSubscription: boolean;
  subscriptionTier: string;
  // Marketing fields
  marketingType: 'IN_PERSON' | 'LIVE_ONLINE' | 'SELF_PACED' | 'BLENDED';
  marketingDescription?: string;
}

interface CourseFormProps {
  formData: CourseFormData;
  setFormData: (data: CourseFormData) => void;
  categories: unknown[];
  selectedCourse?: unknown;
  onSubmit: (data: CourseFormData) => void;
  institutionId?: string;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onPricingManagement?: (type: 'WEEKLY' | 'MONTHLY') => void;
  courses?: unknown[];
}

// Framework level mappings
const frameworkLevels = {
  CEFR: [
    { value: "A1", label: "A1 (Beginner)" },
    { value: "A2", label: "A2 (Elementary)" },
    { value: "B1", label: "B1 (Intermediate)" },
    { value: "B2", label: "B2 (Upper Intermediate)" },
    { value: "C1", label: "C1 (Advanced)" },
    { value: "C2", label: "C2 (Mastery)" }
  ],
  DELF_DALF: [
    { value: "A1", label: "A1 (DELF)" },
    { value: "A2", label: "A2 (DELF)" },
    { value: "B1", label: "B1 (DELF)" },
    { value: "B2", label: "B2 (DELF)" },
    { value: "C1", label: "C1 (DALF)" },
    { value: "C2", label: "C2 (DALF)" }
  ],
  DELE: [
    { value: "A1", label: "A1 (DELE)" },
    { value: "A2", label: "A2 (DELE)" },
    { value: "B1", label: "B1 (DELE)" },
    { value: "B2", label: "B2 (DELE)" },
    { value: "C1", label: "C1 (DELE)" },
    { value: "C2", label: "C2 (DELE)" }
  ],
  TESTDAF: [
    { value: "TDN3", label: "TDN 3" },
    { value: "TDN4", label: "TDN 4" },
    { value: "TDN5", label: "TDN 5" }
  ],
  JLPT: [
    { value: "N5", label: "N5 (Basic)" },
    { value: "N4", label: "N4 (Elementary)" },
    { value: "N3", label: "N3 (Intermediate)" },
    { value: "N2", label: "N2 (Pre-Advanced)" },
    { value: "N1", label: "N1 (Advanced)" }
  ],
  HSK: [
    { value: "HSK1", label: "HSK 1" },
    { value: "HSK2", label: "HSK 2" },
    { value: "HSK3", label: "HSK 3" },
    { value: "HSK4", label: "HSK 4" },
    { value: "HSK5", label: "HSK 5" },
    { value: "HSK6", label: "HSK 6" }
  ],
  TOPIK: [
    { value: "TOPIK1", label: "TOPIK 1" },
    { value: "TOPIK2", label: "TOPIK 2" },
    { value: "TOPIK3", label: "TOPIK 3" },
    { value: "TOPIK4", label: "TOPIK 4" },
    { value: "TOPIK5", label: "TOPIK 5" },
    { value: "TOPIK6", label: "TOPIK 6" }
  ],
  OTHER: [
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" }
  ]
};

export function CourseForm({
  formData: initialFormData,
  setFormData,
  categories,
  selectedCourse,
  onSubmit,
  institutionId,
  onUnsavedChangesChange,
  onPricingManagement,
  courses
}: CourseFormProps) {
  const { currencyInfo } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<Array<{ value: string; label: string }>>([]);

  // Initialize formData with default values if not provided
  const formData = initialFormData || {
    title: '',
    description: '',
    categoryId: '',
    framework: '',
    level: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
    base_price: '',
    pricingPeriod: 'FULL_COURSE',
    duration: '',
    tags: [],
    // Simplified course classification fields
    hasLiveClasses: false,
    liveClassType: '',
    liveClassFrequency: '',
    liveClassSchedule: undefined,
    isPlatformCourse: false,
    // Institution courses cannot be subscription-based - only platform courses (institutionId = null) can be
    requiresSubscription: false,
    subscriptionTier: '',
    // Marketing fields
    marketingType: 'IN_PERSON',
    marketingDescription: undefined
  };

  const getFrameworkLevels = (framework: string) => {
    const frameworkInfo = getFrameworkInfo(framework);
    return frameworkInfo ? frameworkInfo.levels : [];
  };

  // Calculate duration in weeks based on start and end dates
  const calculateDuration = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) return '';
    
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const weeksDiff = Math.ceil(daysDiff / 7);
    
    return weeksDiff.toString();
  };

  // Update duration when start or end date changes
  const updateDuration = (startDate: string, endDate: string) => {
    const calculatedDuration = calculateDuration(startDate, endDate);
    setFormData(prev => ({ ...prev, duration: calculatedDuration }));
  };

  const handleFormChange = (field: keyof CourseFormData, value: unknown) => {
    console.log('Form field changed:', field, value);
    
    if (field === 'framework') {
      // When framework changes, update both framework and level
      const levels = getFrameworkLevels(value);
      console.log('Framework changed to:', value);
      console.log('Available levels:', levels);
      
      // Update available levels first
      setAvailableLevels(levels);
      
      // Then update form data
      setFormData(prev => ({
        ...prev,
        framework: value,
        level: levels.length > 0 ? levels[0].value : ''
      }));
    } else if (field === 'startDate' || field === 'endDate') {
      // Update the specific date field
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Calculate and update duration
      const newStartDate = field === 'startDate' ? value as string : formData.startDate;
      const newEndDate = field === 'endDate' ? value as string : formData.endDate;
      updateDuration(newStartDate, newEndDate);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    setHasUnsavedChanges(true);
    onUnsavedChangesChange?.(true);
  };

  // Initialize available levels when component mounts
  useEffect(() => {
    if (formData?.framework) {
      const levels = getFrameworkLevels(formData.framework);
      console.log('Initializing levels for framework:', formData.framework);
      console.log('Available levels:', levels);
      setAvailableLevels(levels);
    }
  }, []); // Run only once on mount

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (isSubmitting) {
      console.log('Form is already submitting');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Form data being submitted:', formData);
    
    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        toast.error('Course title is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.description?.trim()) {
        toast.error('Course description is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.categoryId) {
        toast.error('Course category is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.framework) {
        toast.error('Course framework is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.level) {
        toast.error('Course level is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.startDate) {
        toast.error('Start date is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.endDate) {
        toast.error('End date is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.maxStudents) {
        toast.error('Maximum students is required');
        setIsSubmitting(false);
        return;
      }
      if (!formData.base_price) {
        toast.error('Base price is required');
        setIsSubmitting(false);
        return;
      }

      // Check for duplicate course title only when creating a new course
      if (!selectedCourse && courses) {
        const duplicateCourse = courses.find(
          course => course.title.toLowerCase() === formData.title.toLowerCase()
        );
        if (duplicateCourse) {
          toast.error('Duplicate course title found:');
          toast.error('A course with this title already exists');
          setIsSubmitting(false);
          return;
        }
      }

      console.log('About to call onSubmit with form data:', {
        onSubmit: typeof onSubmit,
        formData
      });

      if (typeof onSubmit === 'function') {
        try {
          console.log('Calling onSubmit function');
          await onSubmit(formData);
          console.log('onSubmit completed successfully');
          setHasUnsavedChanges(false);
          onUnsavedChangesChange?.(false);
        } catch (submitError) {
          toast.error(`Failed to submit form. Please try again or contact support if the problem persists.`);
          throw submitError;
        }
      } else {
        toast.error('onSubmit is not a function:');
        toast.error('Form submission failed: Invalid submit handler');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to submit form. Please try again or contact support if the problem persists.`);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
      console.log('Form submission completed');
    }
  };

  const handlePricingButtonClick = (type: 'WEEKLY' | 'MONTHLY', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Pricing button clicked:', type);
    onPricingManagement?.(type);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => handleFormChange('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
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
          </div>

          {/* Simplified Course Classification Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="marketingType">Marketing Type *</Label>
              <Select
                value={formData.marketingType}
                onValueChange={(value) => handleFormChange('marketingType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marketing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELF_PACED">Self-Paced</SelectItem>
                  <SelectItem value="LIVE_ONLINE">Live Online</SelectItem>
                  <SelectItem value="IN_PERSON">In-Person</SelectItem>
                  <SelectItem value="BLENDED">Blended</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">How the course is marketed to students</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasLiveClasses">Has Live Classes</Label>
              <Select
                value={formData.hasLiveClasses ? 'true' : 'false'}
                onValueChange={(value) => handleFormChange('hasLiveClasses', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.hasLiveClasses && (
              <div className="space-y-2">
                <Label htmlFor="liveClassType">Live Class Type</Label>
                <Select
                  value={formData.liveClassType}
                  onValueChange={(value) => handleFormChange('liveClassType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select live class type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONVERSATION">Conversation Practice</SelectItem>
                    <SelectItem value="COMPREHENSIVE">Comprehensive Learning</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="TUTORIAL">Tutorial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.hasLiveClasses && (
              <div className="space-y-2">
                <Label htmlFor="liveClassFrequency">Live Class Frequency</Label>
                <Select
                  value={formData.liveClassFrequency}
                  onValueChange={(value) => handleFormChange('liveClassFrequency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="BIWEEKLY">Bi-weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="CUSTOM">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Subscription fields disabled for institutions - only platform courses can be subscription-based */}
            <div className="space-y-2">
              <Label htmlFor="requiresSubscription" className="text-gray-500">Requires Subscription</Label>
              <Select
                value="false"
                disabled
              >
                <SelectTrigger className="bg-gray-100">
                  <SelectValue placeholder="Disabled for institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No (Institution courses)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Subscription-based courses are only available for platform-wide courses (institutionId = null)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionTier" className="text-gray-500">Subscription Tier</Label>
              <Select
                value=""
                disabled
              >
                <SelectTrigger className="bg-gray-100">
                  <SelectValue placeholder="Not applicable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">N/A</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Only platform courses can specify subscription tiers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isPlatformCourse">Is Platform Course</Label>
              <Select
                value={formData.isPlatformCourse ? 'true' : 'false'}
                onValueChange={(value) => handleFormChange('isPlatformCourse', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Available to all platform users</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Enter course description"
              required
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketingDescription">Marketing Description</Label>
            <Textarea
              id="marketingDescription"
              value={formData.marketingDescription || ''}
              onChange={(e) => handleFormChange('marketingDescription', e.target.value)}
              placeholder="Optional marketing description for the course"
              className="min-h-[80px]"
            />
            <p className="text-xs text-gray-500">
              Additional marketing text to describe the course to potential students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {Object.entries(frameworkMappings).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
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
                disabled={!formData.framework}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.framework ? "Select level" : "Select framework first"} />
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
              <Label htmlFor="maxStudents">Maximum Students *</Label>
              <Input
                id="maxStudents"
                type="number"
                min="1"
                value={formData.maxStudents}
                onChange={(e) => handleFormChange('maxStudents', e.target.value)}
                placeholder="Enter max students"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price ({currencyInfo.symbol}) *</Label>
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
        </div>  
        

        <div className="space-y-2">
          <Label>Tags</Label>
          <CourseTagManager
            selectedTags={formData.tags}
            onTagsChange={(tags) => {
              console.log('Tags updated:', tags);
              handleFormChange('tags', tags);
            }}
            courses={courses}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pricingPeriod">Pricing Period *</Label>
            <Select
              value={formData.pricingPeriod}
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, pricingPeriod: value }));
                setHasUnsavedChanges(true);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pricing period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.pricingPeriod === 'WEEKLY' || formData.pricingPeriod === 'MONTHLY') && (
            <div className="space-y-2">
              <Label>Pricing Management</Label>
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handlePricingButtonClick(formData.pricingPeriod, e)}
                className="w-full"
                disabled={hasUnsavedChanges}
                title={hasUnsavedChanges ? "Please save the course changes first" : `Manage ${formData.pricingPeriod.toLowerCase()} pricing`}
              >
                Manage {formData.pricingPeriod.toLowerCase()} Prices
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : selectedCourse ? (
              'Update Course'
            ) : (
              'Create Course'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 