import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

  // Calculate price when dates change
  useEffect(() => {
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
  }, [startDate, endDate, course.id]);

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
          startDate,
          endDate,
          calculatedPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to enroll in course');
      }

      const data = await response.json();
      
      // Call the callback if provided
      if (onEnrollmentComplete) {
        onEnrollmentComplete(data);
      }

      // Close the modal
      onClose();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to enrolling in course:. Please try again or contact support if the problem persists.`));
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
            Please select your enrollment period and review the total cost.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
            <div className="grid gap-2">
              <Label>Total Cost</Label>
              <div className="text-lg font-semibold">
                {calculatedPrice > 0 ? `$${calculatedPrice.toFixed(2)}` : 'Calculating...'}
              </div>
            </div>
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
            <Button type="submit" disabled={isLoading || !startDate || !endDate || calculatedPrice <= 0}>
              {isLoading ? 'Enrolling...' : 'Confirm Enrollment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 