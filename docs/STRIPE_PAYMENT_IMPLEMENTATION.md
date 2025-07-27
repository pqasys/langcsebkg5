# Stripe Payment Implementation

## Overview

This document describes the implementation of a complete Stripe payment flow for course enrollments in the language learning platform.

## Implementation Summary

### 1. Payment Initiation API (`/api/student/payments/initiate`)

**Updated Features:**
- Creates Stripe Payment Intent for credit card payments
- Returns client secret for frontend Stripe Elements
- Handles different payment methods (CREDIT_CARD, BANK_TRANSFER, OFFLINE)
- Updates enrollment and booking status appropriately

**Key Changes:**
```typescript
// For CREDIT_CARD payments
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100), // Convert to cents
  currency: 'usd',
  metadata: {
    enrollmentId: enrollment.id,
    studentId: session.user.id,
    courseId,
    institutionId: enrollment.course.institutionId,
    bookingId: booking.id,
    courseTitle: enrollment.course.title,
    institutionName: institution.name,
  },
  automatic_payment_methods: { enabled: true },
});

// Returns client secret for frontend
return NextResponse.json({
  success: true,
  clientSecret: paymentIntent.client_secret,
  paymentIntentId: paymentIntent.id,
  // ... other data
});
```

### 2. Frontend Payment Flow (`PayCourseButton.tsx`)

**Updated Features:**
- Conditional rendering of payment method selection vs Stripe payment form
- Integration with Stripe Elements for secure card input
- Proper state management for payment flow
- Error handling and user feedback

**Key Components:**
- `PayCourseButton`: Main payment dialog component
- `StripePaymentForm`: Dedicated Stripe payment form component
- Stripe Elements integration for secure payment processing

### 3. Stripe Payment Form (`StripePaymentForm.tsx`)

**Features:**
- Secure card input using Stripe Elements
- Real-time validation and error handling
- Payment confirmation with Stripe
- Success/failure state management
- User-friendly error messages

**Implementation:**
```typescript
const handleSubmit = async (event: React.FormEvent) => {
  // Submit payment element
  const { error: submitError } = await elements.submit();
  
  // Confirm payment with Stripe
  const { error: confirmError } = await stripe.confirmPayment({
    elements,
    clientSecret,
    confirmParams: {
      return_url: `${window.location.origin}/student/courses/payment/success`,
    },
  });
};
```

### 4. Webhook Processing (`/api/webhooks/stripe`)

**Features:**
- Handles `payment_intent.succeeded` events
- Updates enrollment status to `ENROLLED`
- Creates payment records with commission calculations
- Creates institution payout records
- Sends payment confirmation notifications

**Payment Success Flow:**
```typescript
private static async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { enrollmentId, institutionId, commissionRate } = paymentIntent.metadata;
  const amount = paymentIntent.amount / 100;
  const commissionAmount = (amount * Number(commissionRate)) / 100;
  const institutionAmount = amount - commissionAmount;
  
  await prisma.$transaction(async (tx) => {
    // Update enrollment status
    await tx.studentCourseEnrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'ENROLLED',
        paymentStatus: 'PAID',
        paymentDate: new Date(),
        paymentMethod: 'STRIPE',
        paymentId: paymentIntent.id,
      },
    });
    
    // Create payment record
    await tx.payment.create({
      data: {
        enrollmentId,
        amount,
        currency: paymentIntent.currency,
        status: 'COMPLETED',
        paymentMethod: 'STRIPE',
        paymentId: paymentIntent.id,
        metadata: {
          commissionRate: Number(commissionRate),
          commissionAmount,
          institutionAmount,
        },
      },
    });
    
    // Create institution payout record
    await tx.institutionPayout.create({
      data: {
        institutionId,
        enrollmentId,
        amount: institutionAmount,
        status: 'PENDING',
        metadata: {
          paymentId: paymentIntent.id,
          paymentMethod: 'STRIPE',
        },
      },
    });
  });
}
```

## Payment Flow

### 1. User Initiates Payment
1. User clicks "Pay Now" button on course card
2. Payment dialog opens with course details and payment method selection
3. User selects "Credit / Debit Card"

### 2. Payment Intent Creation
1. Frontend calls `/api/student/payments/initiate` with payment method
2. Backend creates Stripe Payment Intent
3. Returns client secret to frontend

### 3. Stripe Payment Form
1. Frontend shows Stripe Elements payment form
2. User enters card details securely
3. Payment is processed through Stripe

### 4. Payment Confirmation
1. Stripe sends webhook to `/api/webhooks/stripe`
2. Backend updates enrollment status to `ENROLLED`
3. Creates payment and payout records
4. Sends confirmation notifications

### 5. User Experience
1. User sees success message
2. Dialog closes and page refreshes
3. User can now access course content

## Security Features

1. **Secure Card Input**: Uses Stripe Elements for PCI compliance
2. **Client Secret**: Payment intent client secret for secure payment confirmation
3. **Webhook Verification**: Stripe signature verification for webhook authenticity
4. **No Card Storage**: Card details never touch our servers
5. **Metadata Tracking**: Comprehensive metadata for payment tracking

## Error Handling

1. **Payment Failures**: Proper error messages and retry options
2. **Network Issues**: Graceful handling of connection problems
3. **Invalid Data**: Validation of payment method and amounts
4. **Webhook Failures**: Logging and retry mechanisms

## Testing

The implementation includes:
- Unit tests for payment flow components
- Integration tests for API endpoints
- E2E tests for complete payment flow
- Webhook testing with Stripe CLI

## Environment Variables Required

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Future Enhancements

1. **Multi-currency Support**: Support for different currencies
2. **Payment Methods**: Additional payment methods (PayPal, Apple Pay, etc.)
3. **Subscription Payments**: Recurring payment support
4. **Payment Analytics**: Enhanced payment tracking and analytics
5. **Refund Handling**: Automated refund processing
6. **Fraud Detection**: Integration with Stripe Radar

## Conclusion

This implementation provides a complete, secure, and user-friendly payment flow for course enrollments using Stripe. The solution handles all aspects of payment processing from initiation to completion, with proper error handling and user feedback throughout the process. 