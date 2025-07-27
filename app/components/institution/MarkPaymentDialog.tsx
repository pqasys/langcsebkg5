import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  UnsavedChangesDialog,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { PaymentMethod } from '@/lib/payment-service';
import { useToast } from "@/components/ui/use-toast";

interface MarkPaymentDialogProps {
  enrollmentId: string;
  courseTitle: string;
  amount: number;
  trigger?: React.ReactNode;
}

export function MarkPaymentDialog({
  enrollmentId,
  courseTitle,
  amount,
  trigger,
}: MarkPaymentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('MANUAL');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/institution/enrollments/${enrollmentId}/mark-paid`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethod,
            referenceNumber,
            notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to mark payment as paid - Context: throw new Error('Failed to mark payment as paid');...`);
      }

      toast.success('Payment marked as paid successfully');
      setOpen(false);
      router.refresh();
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to marking payment as paid:. Please try again or contact support if the problem persists.`));
      toast.error('Failed to mark payment as paid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value as PaymentMethod);
    setHasUnsavedChanges(true);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleConfirmClose = () => {
    setPaymentMethod('MANUAL');
    setReferenceNumber('');
    setNotes('');
    setHasUnsavedChanges(false);
  };

  return (
    <UnsavedChangesDialog
      open={open}
      onOpenChange={setOpen}
      hasUnsavedChanges={hasUnsavedChanges}
      onConfirmClose={handleConfirmClose}
    >
      <DialogTrigger asChild>
        {trigger || <Button>Mark as Paid</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Payment</DialogTitle>
          <DialogDescription>
            Mark payment for {courseTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Course</Label>
            <p className="text-sm text-muted-foreground">{courseTitle}</p>
          </div>
          <div>
            <Label>Amount</Label>
            <p className="text-sm text-muted-foreground">${amount.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number (optional)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Enter any additional notes (optional)"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Mark as Paid'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </UnsavedChangesDialog>
  );
} 