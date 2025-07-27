# Revenue Discrepancy Fix - Institution Dashboard vs Analytics

## Issue Description
The institution dashboard showed a total revenue of $2,200 while the analytics page showed $6,440 for the same institution (XYZ Language School).

## Root Cause
The discrepancy was caused by different revenue calculation methods:

### Dashboard Calculation (Correct)
- Used `institutionAmount` field from the database
- Query: `prisma.payment.aggregate({ _sum: { institutionAmount: true } })`
- Result: $2,200 (amount after commission deduction)

### Analytics Calculation (Incorrect)
- Used `payment.amount` field (total payment amount before commission)
- Included ALL payments regardless of status (COMPLETED, PENDING, PROCESSING)
- Result: $6,440 (total amount before commission + all payment statuses)

## Fix Applied

### 1. Updated Analytics API (`app/api/institution/analytics/stats/route.ts`)
```typescript
// Before: Used payment.amount for all payments
const totalRevenue = institution.courses.reduce((sum, course) => {
  return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
    return enrollmentSum + enrollment.payments.reduce((paymentSum, payment) => {
      return paymentSum + (payment.amount || 0);
    }, 0);
  }, 0);
}, 0);

// After: Uses institutionAmount and filters for completed payments only
const totalRevenue = institution.courses.reduce((sum, course) => {
  return sum + course.enrollments.reduce((enrollmentSum, enrollment) => {
    return enrollmentSum + enrollment.payments
      .filter(payment => payment.status === 'COMPLETED') // Only include completed payments
      .reduce((paymentSum, payment) => {
        // Use institutionAmount if available, otherwise calculate it
        const institutionAmount = payment.institutionAmount || 
          (payment.amount ? payment.amount - (payment.amount * (institution.commissionRate || 0) / 100) : 0);
        return paymentSum + (institutionAmount || 0);
      }, 0);
  }, 0);
}, 0);
```

### 2. Updated Test Script (`scripts/test-analytics-fix.ts`)
Applied the same fix to ensure consistency in testing.

## Verification
- **Dashboard Revenue**: $2,200 ✅
- **Analytics Revenue**: $2,200 ✅ (after fix)
- **Old Analytics Revenue**: $6,440 ❌ (before fix)

## Payment Breakdown for XYZ Language School
- **Completed Payment**: $2,750 → $2,200 (after 20% commission)
- **Pending Payment**: $3,500 (excluded from revenue calculation)
- **Processing Payment**: $740 (excluded from revenue calculation)

## Files Modified
1. `app/api/institution/analytics/stats/route.ts` - Fixed revenue calculation
2. `scripts/test-analytics-fix.ts` - Updated test script
3. `scripts/debug-revenue-discrepancy.ts` - Created debug script
4. `scripts/debug-analytics-calculation.ts` - Created detailed debug script
5. `scripts/test-analytics-api.ts` - Created verification script

## Cache Clearing Instructions
If the discrepancy persists after the fix:

1. **Clear browser cache**:
   - Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - Or clear browser cache completely

2. **Restart development server**:
   ```bash
   npm run dev
   ```

3. **Clear Next.js cache**:
   ```bash
   rm -rf .next
   npm run dev
   ```

## Testing
Run the verification script to confirm the fix:
```bash
npx tsx scripts/test-analytics-api.ts
```

Expected output:
```
Analytics API: $2200
Dashboard API: $2200
✅ Analytics and Dashboard match!
```

## Prevention
To prevent similar issues in the future:
1. Always use `institutionAmount` for institution-specific revenue calculations
2. Always filter for `status: 'COMPLETED'` when calculating revenue
3. Use consistent calculation methods across all revenue-related APIs
4. Add unit tests for revenue calculations 