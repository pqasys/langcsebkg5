import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Bank, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentInstructionsProps {
  paymentMethod: PaymentMethod;
  amount: number;
  currency: string;
  referenceNumber: string;
  status: PaymentStatus;
  paymentDetails: {
    instructions?: string;
    contactInfo?: string;
    dueDate?: Date;
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      swiftCode?: string;
      iban?: string;
    };
  };
}

export function PaymentInstructions({
  paymentMethod,
  amount,
  currency,
  referenceNumber,
  status,
  paymentDetails,
}: PaymentInstructionsProps) {
  const isPending = status === 'PENDING';
  const dueDate = paymentDetails.dueDate ? new Date(paymentDetails.dueDate) : null;

  return (
    <div className="space-y-4">
      <Alert variant={isPending ? "default" : "success"}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {isPending ? (
            <div className="space-y-2">
              <p>Your payment is pending. Please follow the instructions below to complete your payment.</p>
              {dueDate && (
                <p className="text-sm text-muted-foreground">
                  Payment due by: {dueDate.toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <p>Your payment has been confirmed. Thank you!</p>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <div className="flex justify-between items-center">
          <span className="font-medium">Amount:</span>
          <span className="font-bold">{formatCurrency(amount, currency)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium">Reference Number:</span>
          <span className="font-mono">{referenceNumber}</span>
        </div>

        {paymentMethod === PaymentMethod.BANK_TRANSFER && paymentDetails.bankDetails && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <Bank className="h-4 w-4" />
              <h3 className="font-medium">Bank Transfer Details</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Bank:</span> {paymentDetails.bankDetails.bankName}</p>
              <p><span className="font-medium">Account Name:</span> {paymentDetails.bankDetails.accountName}</p>
              <p><span className="font-medium">Account Number:</span> {paymentDetails.bankDetails.accountNumber}</p>
              {paymentDetails.bankDetails.swiftCode && (
                <p><span className="font-medium">SWIFT Code:</span> {paymentDetails.bankDetails.swiftCode}</p>
              )}
              {paymentDetails.bankDetails.iban && (
                <p><span className="font-medium">IBAN:</span> {paymentDetails.bankDetails.iban}</p>
              )}
            </div>
          </div>
        )}

        {paymentMethod === PaymentMethod.OFFLINE && (
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <h3 className="font-medium">Payment Instructions</h3>
            </div>
            <div className="space-y-1 text-sm">
              {paymentDetails.instructions && (
                <p>{paymentDetails.instructions}</p>
              )}
              {paymentDetails.contactInfo && (
                <p>
                  <span className="font-medium">Contact:</span> {paymentDetails.contactInfo}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 