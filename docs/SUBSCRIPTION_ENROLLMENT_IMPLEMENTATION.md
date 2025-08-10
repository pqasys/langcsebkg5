# Subscription Enrollment Implementation

## Overview

This document describes the implementation of subscription status checking for course enrollment, specifically for subscription-based courses like `LIVE_ONLINE` and other courses that require an active subscription.

## Problem Statement

Previously, the enrollment API did not check subscription status, allowing users to enroll in subscription-based courses without having an active subscription. This created a discrepancy in the enrollment workflow where users could access subscription-required content without proper authorization.

Additionally, users with valid subscriptions were still required to pay additional fees for subscription-based courses, which was incorrect since they had already paid through their subscription.

## Solution

### 1. Pre-Enrollment Eligibility Check

A new API endpoint checks enrollment eligibility (including subscription status) before opening the enrollment modal:

#### New API Endpoint:
- `GET /api/student/courses/[id]/check-enrollment-eligibility`

This endpoint performs comprehensive checks:
- User authentication and role validation
- Course availability and status
- Subscription requirements for LIVE_ONLINE/BLENDED courses
- Existing enrollment status
- Course capacity limits

### 2. API-Level Subscription Check with Differentiated Workflow

The enrollment APIs check subscription status and handle subscription-based courses differently:

#### Affected API Endpoints:
- `POST /api/student/courses/[id]/enroll`
- `POST /api/courses/[id]/enroll`

#### Implementation Details:

```typescript
// Check if course requires subscription
const requiresSubscription = courseCheck.requiresSubscription || 
  courseCheck.marketingType === 'LIVE_ONLINE' || 
  courseCheck.marketingType === 'BLENDED';

if (requiresSubscription) {
  // Get user's subscription status
  const subscriptionStatus = await SubscriptionCommissionService.getUserSubscriptionStatus(session.user.id);
  
  if (!subscriptionStatus.hasActiveSubscription) {
    return NextResponse.json({ 
      error: 'Subscription required',
      details: 'This course requires an active subscription to enroll.',
      redirectUrl: '/subscription-signup',
      courseType: courseCheck.marketingType,
      requiresSubscription: true
    }, { status: 402 }); // 402 Payment Required
  }
}

// Determine if this is a subscription-based enrollment (no additional payment required)
const isSubscriptionBasedEnrollment = requiresSubscription && subscriptionStatus?.hasActiveSubscription;
```

### 3. Differentiated Enrollment Flow

#### For Users with Valid Subscriptions (Subscription-Based Courses):
- ✅ **Enrollment Status**: `ENROLLED` (immediate access)
- ✅ **Payment Status**: `PAID` (no additional payment required)
- ✅ **Booking Status**: `COMPLETED`
- ✅ **Payment Record**: `COMPLETED` with `SUBSCRIPTION` payment method
- ✅ **User Experience**: Immediate access to course content

#### For Users without Subscriptions (Subscription-Based Courses):
- ❌ **Access Denied**: Redirected to subscription signup page
- ❌ **No Enrollment Created**: Prevents unauthorized access

#### For Regular Courses (Non-Subscription-Based):
- ⏳ **Enrollment Status**: `PENDING_PAYMENT`
- ⏳ **Payment Status**: `PENDING`
- ⏳ **Booking Status**: `PENDING`
- ⏳ **Payment Record**: `PENDING`
- ⏳ **User Experience**: Payment required for content access

### 4. Course Types Requiring Subscription

The following course types now require an active subscription:

- **LIVE_ONLINE**: Live online courses with real-time instruction
- **BLENDED**: Courses that combine online and in-person elements
- **Any course with `requiresSubscription: true`**: Explicitly marked subscription courses

### 5. Frontend Handling

#### Pre-Enrollment Check Updates

All enrollment handlers now check eligibility before opening the enrollment modal:

```typescript
const handleEnroll = async (courseId: string) => {
  try {
    // Check enrollment eligibility before opening modal
    const response = await fetch(`/api/student/courses/${courseId}/check-enrollment-eligibility`);
    
    if (!response.ok) {
      const errorData = await response.json();
      
      // Handle subscription requirement
      if (response.status === 402 && errorData.error === 'Subscription required') {
        toast.error('This course requires an active subscription to enroll.');
        router.push('/subscription-signup');
        return;
      }
      
      // Handle other errors
      toast.error(errorData.details || errorData.error);
      return;
    }

    // User is eligible, open enrollment modal
    setSelectedCourseId(courseId);
    setShowEnrollmentModal(true);
  } catch (error) {
    toast.error('Failed to check enrollment eligibility. Please try again.');
  }
};
```

#### Enrollment Modal Updates

The enrollment modal now handles different enrollment types and disables date selection for subscription-based courses:

```typescript
// Check if this is a subscription-based course
const isSubscriptionBasedCourse = course.requiresSubscription || 
  course.marketingType === 'LIVE_ONLINE' || 
  course.marketingType === 'BLENDED';

// Different UI for subscription-based courses
if (isSubscriptionBasedCourse) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium">Subscription Enrollment</h4>
      <div className="text-sm text-muted-foreground">
        <p><strong>Access Period:</strong> Full course duration</p>
        <p><strong>Course Period:</strong> {formatDate(course.startDate)} - {formatDate(course.endDate)}</p>
        <p className="text-lg font-bold mt-2 text-green-600">
          <strong>Cost:</strong> Included in your subscription
        </p>
      </div>
    </div>
  );
}

// Regular enrollment with date selection for non-subscription courses
return (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Input type="date" ... />
      </div>
      <div className="space-y-2">
        <Label>End Date</Label>
        <Input type="date" ... />
      </div>
    </div>
  </div>
);
```

#### Key Changes Made:

1. **Date Selection Disabled**: For subscription-based courses, date selection inputs are hidden
2. **Different Messaging**: 
   - Subscription courses: "This course is included in your subscription. You will have immediate access to all course content."
   - Regular courses: "Please select your enrollment period and review the total cost."
3. **Cost Display**: 
   - Subscription courses: "Cost: Included in your subscription" (green text)
   - Regular courses: Calculated price based on selected dates
4. **Form Validation**: 
   - Subscription courses: No date validation required
   - Regular courses: Dates and price calculation required
5. **API Calls**: 
   - Subscription courses: Use current date and course end date
   - Regular courses: Use selected start/end dates

## User Experience Flow

### For Students with Valid Subscriptions:

1. **Browse Courses**: User sees LIVE_ONLINE and subscription-based courses
2. **Click Enroll**: System checks eligibility (subscription status verified)
3. **Enrollment Modal**: User configures enrollment details
4. **Confirm Enrollment**: System creates enrollment with immediate access
5. **Success Message**: "Enrollment successful! You have immediate access to the course content."
6. **Direct Access**: User can immediately access course content

### For Students without Subscriptions:

1. **Browse Courses**: User sees LIVE_ONLINE and subscription-based courses
2. **Click Enroll**: System checks eligibility (subscription required)
3. **Error Message**: "This course requires an active subscription to enroll."
4. **Redirect**: User is redirected to subscription signup page
5. **No Enrollment**: No enrollment is created

### For Regular Courses:

1. **Browse Courses**: User sees regular courses
2. **Click Enroll**: System checks eligibility (no subscription required)
3. **Enrollment Modal**: User configures enrollment details
4. **Confirm Enrollment**: System creates enrollment with pending payment
5. **Success Message**: "Enrollment successful! Please complete payment to access course content."
6. **Payment Required**: User must complete payment for content access

## Technical Implementation Details

### Database Changes

The enrollment records now include additional metadata:

```typescript
// For subscription-based enrollments
{
  status: 'ENROLLED',
  paymentStatus: 'PAID',
  paymentMethod: 'SUBSCRIPTION',
  paymentDate: new Date(),
  paymentId: `SUB_${Date.now()}_${randomId}`,
  metadata: {
    isSubscriptionBased: true,
    subscriptionPlan: 'PREMIUM'
  }
}

// For regular enrollments
{
  status: 'PENDING_PAYMENT',
  paymentStatus: 'PENDING',
  metadata: {
    isSubscriptionBased: false
  }
}
```

### API Response Changes

The enrollment APIs now return different messages based on enrollment type:

```typescript
// For subscription-based enrollments
{
  message: 'Course enrollment successful! You have immediate access to the course content.',
  enrollment: {
    isSubscriptionBased: true,
    status: 'ENROLLED',
    paymentStatus: 'PAID'
  }
}

// For regular enrollments
{
  message: 'Course enrollment successful. Payment required for content access.',
  enrollment: {
    isSubscriptionBased: false,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'PENDING'
  }
}
```

## Benefits

1. **Correct Business Logic**: Users with subscriptions don't pay twice for subscription-based content
2. **Improved User Experience**: Immediate access for subscription users
3. **Clear Messaging**: Different success messages based on enrollment type
4. **Proper Access Control**: Subscription verification at multiple levels
5. **Audit Trail**: Clear tracking of subscription-based vs regular enrollments

## Testing Scenarios

### Test Case 1: Valid Subscription User
- **User**: Student with active PREMIUM subscription
- **Course**: LIVE_ONLINE course
- **Expected Result**: Immediate enrollment with access, no payment required

### Test Case 2: No Subscription User
- **User**: Student without subscription
- **Course**: LIVE_ONLINE course
- **Expected Result**: Redirected to subscription signup, no enrollment created

### Test Case 3: Regular Course
- **User**: Any student
- **Course**: Regular course (not subscription-based)
- **Expected Result**: Enrollment with pending payment required

### Test Case 4: Subscription Expired
- **User**: Student with expired subscription
- **Course**: LIVE_ONLINE course
- **Expected Result**: Redirected to subscription signup, no enrollment created
