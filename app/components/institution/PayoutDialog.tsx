import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface PayoutDialogProps {
  payout: {
    id: string;
    amount: number;
    enrollment: {
      course: {
        title: string;
      };
      student: {
        name: string;
        email: string;
      };
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayoutDialog({
  payout,
  open,
  onOpenChange,
}: PayoutDialogProps) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMarkAsPaid = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/institution/payouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payoutId: payout.id,
          status: 'PAID',
          notes,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark payout as paid');
      }

      toast.success('Payout marked as paid successfully');
      router.refresh();
      onOpenChange(false);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to marking payout as paid:. Please try again or contact support if the problem persists.`));
      toast.error(error instanceof Error ? error.message : 'Failed to mark payout as paid');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Payout as Paid</DialogTitle>
          <DialogDescription>
            Confirm that you have processed the payout for{' '}
            {payout.enrollment.student.name} ({payout.enrollment.student.email})
            for the course {payout.enrollment.course.title}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <h3 className="text-sm font-medium">Amount</h3>
            <p className="text-sm text-muted-foreground">
              ${payout.amount.toFixed(2)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Notes</h3>
            <Textarea
              placeholder="Add any notes about this payout..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleMarkAsPaid} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mark as Paid
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 