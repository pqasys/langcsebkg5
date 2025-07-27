'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { toast } from 'sonner';
import { FaCreditCard, FaLock, FaSpinner } from 'react-icons/fa';

interface PaymentFormProps {
  amount: number;
  currency: string;
  planName: string;
  onSuccess: (paymentIntent: unknown) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export function PaymentForm({ 
  amount, 
  currency, 
  planName, 
  onSuccess, 
  onError, 
  isLoading = false 
}: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      // toast.error('Please fill in all payment fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      // In a real implementation, you would:
      // 1. Create a payment intent on your server
      // 2. Use Stripe.js to confirm the payment
      // 3. Handle the payment result
      
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPaymentIntent = {
        id: `pi_${Date.now()}`,
        amount: amount * 100, // Convert to cents
        currency: currency.toLowerCase(),
        status: 'succeeded',
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`
      };
      
      onSuccess(mockPaymentIntent);
      // toast.success('Payment processed successfully!');
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error('Payment error:');
      onError('Payment failed. Please try again.');
      // toast.error('Payment failed. Please check your card details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {/* <FaCreditCard className="w-5 h-5 text-blue-600" /> */}
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Amount to charge</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(amount)}
            </p>
            <p className="text-sm text-gray-500">for {planName} plan</p>
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              maxLength={19}
              required
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                required
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {/* <FaLock className="w-4 h-4" /> */}
            <span>Your payment information is encrypted and secure</span>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isProcessing || isLoading}
          >
            {isProcessing || isLoading ? (
              <>
                {/* <FaSpinner className="animate-spin mr-2" /> */}
                Processing Payment...
              </>
            ) : (
              `Pay ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency
              }).format(amount)}`
            )}
          </Button>

          {/* Test Card Information */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-medium mb-1">Test Card (for development):</p>
            <p>Card: 4242 4242 4242 4242</p>
            <p>Expiry: Any future date</p>
            <p>CVV: Any 3 digits</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 