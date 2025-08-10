import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface EnrollmentModalProps {
  course: {
    id: string;
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    base_price: number;
    marketingType?: string;
    requiresSubscription?: boolean;
  };
  isOpen: boolean;
  onClose: () => void;
  onEnrollmentComplete: (data: any) => void;
}

export default function EnrollmentModal({
  course,
  isOpen,
  onClose,
  onEnrollmentComplete,
}: EnrollmentModalProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  // Check if this is a subscription-based course
  const isSubscriptionBasedCourse = course.requiresSubscription || 
    course.marketingType === 'LIVE_ONLINE' || 
    course.marketingType === 'BLENDED';

  // Calculate price when dates change (only for non-subscription courses)
  useEffect(() => {
    if (isSubscriptionBasedCourse) {
      // For subscription-based courses, set price to 0
      setCalculatedPrice(0);
      return;
    }

    const calculatePrice = async () => {
      if (!startDate || !endDate) return;

      try {
        const response = await fetch('/api/student/enrollments/calculate-price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            courseId: course.id,
            startDate,
            endDate,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to calculate price - Context: throw new Error('Failed to calculate price');...`);
        }

        const data = await response.json();
        setCalculatedPrice(data.price);
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error(`Failed to calculating price:. Please try again or contact support if the problem persists.`));
        setError('Failed to calculate price. Please try again.');
      }
    };

    calculatePrice();
  }, [startDate, endDate, course.id, isSubscriptionBasedCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: isSubscriptionBasedCourse ? new Date().toISOString() : startDate,
          endDate: isSubscriptionBasedCourse ? course.endDate : endDate,
          calculatedPrice: isSubscriptionBasedCourse ? 0 : calculatedPrice,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription requirement
        if (response.status === 402 && errorData.error === 'Subscription required') {
          console.log('Subscription required for this course');
          toast.error('This course requires an active subscription to enroll.');
          
          // Close the modal
          onClose();
          
          // Redirect to subscription page
          if (errorData.redirectUrl) {
            window.location.href = errorData.redirectUrl;
          } else {
            window.location.href = '/subscription-signup';
          }
          return;
        }
        
        throw new Error(errorData.error || errorData.message || 'Failed to enroll in course');
      }

      const data = await response.json();
      
      // Show appropriate success message based on enrollment type
      if (data.enrollment?.isSubscriptionBased) {
        toast.success('Enrollment successful! You have immediate access to the course content.');
      } else {
        toast.success('Enrollment successful! Please complete payment to access course content.');
      }
      
      // Call the callback if provided
      if (onEnrollmentComplete) {
        onEnrollmentComplete(data);
      }

      // Close the modal
      onClose();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to enroll in course. Please try again or contact support if the problem persists.`);
      setError(error instanceof Error ? error.message : 'Failed to enroll in course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Enroll in {course.title}</DialogTitle>
          <DialogDescription>
            {isSubscriptionBasedCourse 
              ? 'This course is included in your subscription. You will have immediate access to all course content.'
              : 'Please select your enrollment period and review the total cost.'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Only show date selection for non-subscription-based courses */}
            {!isSubscriptionBasedCourse && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </>
            )}

            {/* Show subscription-based course details */}
            {isSubscriptionBasedCourse && (
              <div className="space-y-2">
                <h4 className="font-medium">Subscription Enrollment</h4>
                <div className="text-sm text-muted-foreground">
                  <p><strong>Access Period:</strong> Full course duration</p>
                  <p><strong>Course Period:</strong> {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}</p>
                  <p className="text-lg font-bold mt-2 text-green-600">
                    <strong>Cost:</strong> Included in your subscription
                  </p>
                </div>
              </div>
            )}

            {/* Show cost for non-subscription courses */}
            {!isSubscriptionBasedCourse && (
              <div className="grid gap-2">
                <Label>Total Cost</Label>
                <div className="text-lg font-semibold">
                  {calculatedPrice > 0 ? `$${calculatedPrice.toFixed(2)}` : 'Calculating...'}
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || (!isSubscriptionBasedCourse && (!startDate || !endDate || calculatedPrice <= 0))}
            >
              {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 