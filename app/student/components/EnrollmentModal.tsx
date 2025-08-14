'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Info, Calendar } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format, isValid, isBefore, isAfter, addDays, addMonths } from 'date-fns';
import { Input } from '@/components/ui/input';
import { createRoot } from 'react-dom/client';
import PayCourseButton from '@/app/student/components/PayCourseButton';
import { revalidateCourses } from '@/app/actions/revalidate';
import { SessionProvider } from 'next-auth/react';
import { revalidatePath } from 'next/cache';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
  onEnrollmentComplete: () => void;
}

export default function EnrollmentModal({
  isOpen,
  onClose,
  courseId,
  onEnrollmentComplete,
}: EnrollmentModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState<{
    price: number;
    startDate: string;
    endDate: string;
    weeks?: number;
    months?: number;
    pricingPeriod: string;
  } | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>();
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        toast.error('Invalid date:');
        return 'Invalid date';
      }
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to format date. Please try again or contact support if the problem persists.');
      return 'Invalid date';
    }
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;
      
      try {
        setIsLoading(true);
        // Reset state when fetching new course details
        setCourse(null);
        setEnrollmentDetails(null);
        setSelectedStartDate(undefined);
        setSelectedEndDate(undefined);
        setTermsAccepted(false);
        setError(null);
        
        const response = await fetch(`/api/student/courses/${courseId}?t=${Date.now()}`, {
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch course details - Status: ${response.status}`);
        }
        
        const data = await response.json();
        // console.log('Fetched course details:', { 
        //   courseId, 
        //   pricingPeriod: data.pricingPeriod, 
        //   title: data.title 
        // });
        setCourse(data);
        
        // Initialize dates
        const courseStartDate = new Date(data.startDate);
        const courseEndDate = new Date(data.endDate);
        const today = new Date();

        // Validate dates
        if (!isValid(courseStartDate) || !isValid(courseEndDate)) {
          toast.error('Invalid course dates:');
          toast.error('The course has invalid start or end dates. Please contact support.');
          onClose();
          return;
        }

        // Ensure course end date is after start date
        if (isBefore(courseEndDate, courseStartDate)) {
          toast.error('Course end date is before start date:');
          toast.error('The course end date is before the start date. Please contact support.');
          onClose();
          return;
        }

        // Set initial start date (can't be before course start date)
        const initialStartDate = isBefore(today, courseStartDate) ? courseStartDate : today;
        setSelectedStartDate(initialStartDate);

        // Set initial end date based on pricing period
        let initialEndDate: Date;
        switch (data.pricingPeriod) {
          case 'WEEKLY':
            initialEndDate = addDays(initialStartDate, 7);
            break;
          case 'MONTHLY':
            initialEndDate = addMonths(initialStartDate, 1);
            break;
          case 'FULL_COURSE':
          default:
            initialEndDate = courseEndDate;
            break;
        }

        // Ensure end date doesn't exceed course end date
        if (isAfter(initialEndDate, courseEndDate)) {
          initialEndDate = courseEndDate;
        }

        setSelectedEndDate(initialEndDate);

        // Calculate initial price
        calculatePrice(initialStartDate, initialEndDate, data.pricingPeriod);
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error('Failed to load course details. Please try again or contact support if the problem persists.');
        // Don't close the modal immediately on error, let the user see the error
        setError(error instanceof Error ? error.message : 'Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && courseId) {
      fetchCourseDetails();
    }
  }, [isOpen, courseId, onClose, toast]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCourse(null);
      setEnrollmentDetails(null);
      setSelectedStartDate(undefined);
      setSelectedEndDate(undefined);
      setTermsAccepted(false);
      setError(null);
    }
  }, [isOpen]);

  const calculatePrice = async (startDate: Date, endDate: Date, pricingPeriod?: string) => {
    if (!courseId) return;
    
    console.log('Calculating price:', { 
      courseId, 
      startDate: startDate.toISOString(), 
      endDate: endDate.toISOString(), 
      pricingPeriod 
    });
    
    try {
      const response = await fetch('/api/student/enrollments/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      const data = await response.json();
      console.log('Price calculation response:', data);
      
      if (data.status === 'success') {
        const enrollmentData = {
          ...data,
          pricingPeriod: pricingPeriod || course?.pricingPeriod || 'FULL_COURSE'
        };
        console.log('Setting enrollment details:', { 
          courseId, 
          pricingPeriod: enrollmentData.pricingPeriod,
          price: enrollmentData.price 
        });
        setEnrollmentDetails(enrollmentData);
      } else {
        throw new Error(data.details || 'Failed to calculate price');
      }
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to calculate price. Please try again or contact support if the problem persists.');
      toast.error(error instanceof Error ? error.message : 'Failed to calculate course price. Please try again.');
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    console.log('Start date change:', { date, isValid: date ? isValid(date) : false, course: !!course });
    
    if (!date || !isValid(date) || !course) return;

    const courseStartDate = new Date(course.startDate);
    const courseEndDate = new Date(course.endDate);

    // Ensure start date is not before course start date
    if (isBefore(date, courseStartDate)) {
      toast.error('Start date cannot be before course start date.');
      return;
    }

    // Ensure start date is not after course end date
    if (isAfter(date, courseEndDate)) {
      toast.error('Start date cannot be after course end date.');
      return;
    }

    console.log('Setting start date:', date);
    setSelectedStartDate(date);
    
    // If end date is before new start date, update it
    if (selectedEndDate && isBefore(selectedEndDate, date)) {
      let newEndDate: Date;
      switch (course.pricingPeriod) {
        case 'WEEKLY':
          newEndDate = addDays(date, 7);
          break;
        case 'MONTHLY':
          newEndDate = addMonths(date, 1);
          break;
        case 'FULL_COURSE':
        default:
          newEndDate = courseEndDate;
          break;
      }

      // Ensure end date doesn't exceed course end date
      if (isAfter(newEndDate, courseEndDate)) {
        newEndDate = courseEndDate;
      }

      console.log('Updating end date to:', newEndDate);
      setSelectedEndDate(newEndDate);
      // Calculate price with the new dates
      setTimeout(() => {
        calculatePrice(date, newEndDate, course.pricingPeriod);
      }, 0);
    } else if (selectedEndDate) {
      // Calculate price with existing end date
      console.log('Calculating price with existing end date:', selectedEndDate);
      setTimeout(() => {
        calculatePrice(date, selectedEndDate, course.pricingPeriod);
      }, 0);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    console.log('End date change:', { date, isValid: date ? isValid(date) : false, selectedStartDate, course: !!course });
    
    if (!date || !isValid(date) || !selectedStartDate || !course) return;

    const courseEndDate = new Date(course.endDate);

    // Ensure end date is not after course end date
    if (isAfter(date, courseEndDate)) {
      toast.error('End date cannot be after course end date.');
      return;
    }

    // Ensure end date is not before start date
    if (isBefore(date, selectedStartDate)) {
      toast.error('End date must be after start date.');
      return;
    }

    console.log('Setting end date:', date);
    setSelectedEndDate(date);
    // Calculate price with the new end date
    setTimeout(() => {
      calculatePrice(selectedStartDate, date, course.pricingPeriod);
    }, 0);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: selectedStartDate,
          endDate: selectedEndDate,
          calculatedPrice: enrollmentDetails?.price
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription requirement
        if (response.status === 402 && errorData.error === 'Subscription required') {
          console.log('Subscription required for this course');
          
          // Show more helpful error message
          toast.error('This course requires a subscription. Starting your free trial now...');
          
          // Close the modal
          onClose();
          
          // Redirect to subscription page with better UX
          if (errorData.redirectUrl) {
            // Add a small delay to show the toast message
            setTimeout(() => {
              router.push(errorData.redirectUrl);
            }, 1500);
          } else {
            setTimeout(() => {
              router.push('/subscription-signup');
            }, 1500);
          }
          return;
        }
        
        throw new Error(errorData.error || errorData.message || 'Failed to enroll in course');
      }

      const data = await response.json();
      console.log('Enrollment successful:', data);

      // Close the modal
      onClose();

      // Show appropriate success message based on enrollment type
      if (data.enrollment?.isSubscriptionBased) {
        toast.success('Enrollment successful! You have immediate access to the course content.');
      } else {
        toast.success('Enrollment successful! Please complete payment to access course content.');
      }

      // Revalidate courses data
      await revalidateCourses();
      
      // Add a small delay to ensure revalidation completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Refresh the router
      router.refresh();

      // Call the callback if provided
      onEnrollmentComplete?.();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to enroll in course. Please try again or contact support if the problem persists.');
      setError(error instanceof Error ? error.message : 'Failed to enroll in course');
    } finally {
      setIsLoading(false);
    }
  };

  const getPricingModelDescription = () => {
    if (!course) return '';
    
    // Check if this is a subscription-based course
    const isSubscriptionBasedCourse = course.requiresSubscription || 
      course.marketingType === 'LIVE_ONLINE' || 
      course.marketingType === 'BLENDED';
    
    if (isSubscriptionBasedCourse) {
      return 'This course is included in your subscription. You will have immediate access to all course content without additional payment.';
    }
    
    const pricingPeriod = enrollmentDetails?.pricingPeriod || course.pricingPeriod;
    switch (pricingPeriod) {
      case 'WEEKLY':
        return 'This course is priced per week. The cost is calculated based on the number of weeks you enroll for.';
      case 'MONTHLY':
        return 'This course is priced per month. The cost is calculated based on the number of months you enroll for.';
      case 'FULL_COURSE':
        return 'This course is priced for the full duration. The cost covers the entire course period.';
      default:
        return '';
    }
  };

  const getMinDate = () => {
    if (!course) return format(new Date(), 'yyyy-MM-dd');
    
    try {
      const courseStartDate = new Date(course.startDate);
      const today = new Date();
      return isValid(courseStartDate) ? format(courseStartDate, 'yyyy-MM-dd') : format(today, 'yyyy-MM-dd');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to get minimum date. Please try again or contact support if the problem persists.');
      return format(new Date(), 'yyyy-MM-dd');
    }
  };

  const getMaxDate = () => {
    if (!course) return format(addMonths(new Date(), 12), 'yyyy-MM-dd');
    
    try {
      const courseEndDate = new Date(course.endDate);
      return isValid(courseEndDate) ? format(courseEndDate, 'yyyy-MM-dd') : format(addMonths(new Date(), 12), 'yyyy-MM-dd');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to get maximum date. Please try again or contact support if the problem persists.');
      return format(addMonths(new Date(), 12), 'yyyy-MM-dd');
    }
  };

  // Check if this is a subscription-based course
  const isSubscriptionBasedCourse = course?.requiresSubscription || 
    course?.marketingType === 'LIVE_ONLINE' || 
    course?.marketingType === 'BLENDED';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Course Enrollment</DialogTitle>
          <DialogDescription>
            {getPricingModelDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isSubscriptionBasedCourse 
                ? 'You have immediate access to all course materials and can track your progress.'
                : 'After payment, you\'ll have access to all course materials and can track your progress.'
              }
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    if (courseId) {
                      const fetchCourseDetails = async () => {
                        try {
                          setIsLoading(true);
                          setCourse(null);
                          setEnrollmentDetails(null);
                          setSelectedStartDate(undefined);
                          setSelectedEndDate(undefined);
                          setTermsAccepted(false);
                          
                          const response = await fetch(`/api/student/courses/${courseId}?t=${Date.now()}`, {
                            cache: 'no-store'
                          });
                          
                          if (!response.ok) {
                            throw new Error(`Failed to fetch course details - Status: ${response.status}`);
                          }
                          
                          const data = await response.json();
                          setCourse(data);
                          
                          // Initialize dates and calculate price
                          const courseStartDate = new Date(data.startDate);
                          const courseEndDate = new Date(data.endDate);
                          const today = new Date();
                          const initialStartDate = isBefore(today, courseStartDate) ? courseStartDate : today;
                          setSelectedStartDate(initialStartDate);
                          
                          let initialEndDate: Date;
                          switch (data.pricingPeriod) {
                            case 'WEEKLY':
                              initialEndDate = addDays(initialStartDate, 7);
                              break;
                            case 'MONTHLY':
                              initialEndDate = addMonths(initialStartDate, 1);
                              break;
                            case 'FULL_COURSE':
                            default:
                              initialEndDate = courseEndDate;
                              break;
                          }
                          
                          if (isAfter(initialEndDate, courseEndDate)) {
                            initialEndDate = courseEndDate;
                          }
                          
                          setSelectedEndDate(initialEndDate);
                          calculatePrice(initialStartDate, initialEndDate, data.pricingPeriod);
                        } catch (error) {
                          console.error('Error occurred:', error);
                          setError(error instanceof Error ? error.message : 'Failed to load course details');
                        } finally {
                          setIsLoading(false);
                        }
                      };
                      fetchCourseDetails();
                    }
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    'Retry'
                  )}
                </Button>
              </div>
            </Alert>
          )}
          
          {isLoading || !course ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2 text-sm text-muted-foreground">Loading course details...</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h4 className="font-medium">Course Details</h4>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Course:</strong> {course.title}</p>
                  <p><strong>Institution:</strong> {course.institution?.name || 'Not assigned'}</p>
                  <p><strong>Description:</strong> {course.description}</p>
                  <p><strong>Pricing Model:</strong> {isSubscriptionBasedCourse ? 'Subscription-based' : (enrollmentDetails?.pricingPeriod || course.pricingPeriod || 'FULL_COURSE').replace('_', ' ')}</p>
                  <p><strong>Course Period:</strong> {formatDate(course.startDate)} - {formatDate(course.endDate)}</p>
                </div>
              </div>

              {/* Only show date selection for non-subscription-based courses */}
              {!isSubscriptionBasedCourse && course.pricingPeriod !== 'FULL_COURSE' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleStartDateChange(new Date(e.target.value))}
                        min={getMinDate()}
                        max={getMaxDate()}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={selectedEndDate ? format(selectedEndDate, 'yyyy-MM-dd') : ''}
                        onChange={(e) => handleEndDateChange(new Date(e.target.value))}
                        min={selectedStartDate ? format(selectedStartDate, 'yyyy-MM-dd') : getMinDate()}
                        max={getMaxDate()}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Show subscription-based course enrollment details */}
              {isSubscriptionBasedCourse && (
                <div className="space-y-2">
                  <h4 className="font-medium">Subscription Enrollment</h4>
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <strong>Access Period:</strong> Full course duration
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <strong>Course Period:</strong> {formatDate(course.startDate)} - {formatDate(course.endDate)}
                    </p>
                    <p className="text-lg font-bold mt-2 text-green-600">
                      <strong>Cost:</strong> Included in your subscription
                    </p>
                  </div>
                </div>
              )}

              {/* Show regular enrollment details for non-subscription courses */}
              {!isSubscriptionBasedCourse && enrollmentDetails && (
                <div className="space-y-2">
                  <h4 className="font-medium">Enrollment Period</h4>
                  <div className="text-sm text-muted-foreground">
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <strong>Start Date:</strong> {formatDate(enrollmentDetails.startDate)}
                    </p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <strong>End Date:</strong> {formatDate(enrollmentDetails.endDate)}
                    </p>
                    {enrollmentDetails.weeks && (
                      <p><strong>Duration:</strong> {enrollmentDetails.weeks} weeks</p>
                    )}
                    {enrollmentDetails.months && (
                      <p><strong>Duration:</strong> {enrollmentDetails.months} months</p>
                    )}
                    <p className="text-lg font-bold mt-2">
                      <strong>Total Cost:</strong> {formatCurrency(enrollmentDetails.price)}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the institution's terms and conditions of enrollment
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground">
                  By accepting, you agree to the institution's terms and conditions. 
                  A detailed version will be available soon.
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || !termsAccepted || (!isSubscriptionBasedCourse && !enrollmentDetails)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Enrollment'
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 