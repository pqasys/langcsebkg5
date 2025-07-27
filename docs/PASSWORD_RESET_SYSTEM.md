# Password Reset System Implementation

## Overview

This document describes the implementation of a comprehensive password reset system for the language learning platform. The system includes both force password reset functionality for new institution users and traditional password reset via email links.

## Features

### 1. Force Password Reset for New Institution Users
- When an admin creates a new institution, the system automatically sets `forcePasswordReset: true`
- New institution users receive a welcome email with a secure temporary password
- Users are redirected to change their password on first login
- The system prevents access to protected routes until password is changed

### 2. Traditional Password Reset via Email
- Users can request password reset from the forgot password page
- Secure reset tokens are generated and sent via email
- Reset links expire after 1 hour
- Users can set a new password through the reset link

### 3. Security Features
- Secure password generation with mixed character types
- Password hashing using bcrypt
- Audit logging for password changes
- Rate limiting protection
- Secure token generation and validation

## Database Schema Changes

### User Model Updates
```prisma
model user {
  // ... existing fields ...
  forcePasswordReset Boolean @default(false)
}
```

## API Endpoints

### 1. Password Reset Request
**POST** `/api/auth/password-reset`
- Request body: `{ email: string }`
- Generates reset token and sends email
- Returns success message (doesn't reveal if email exists)

### 2. Password Reset Completion
**PUT** `/api/auth/password-reset`
- Request body: `{ token: string, email: string, newPassword: string }`
- Validates token and updates password
- Clears `forcePasswordReset` flag

### 3. Check Password Reset Status
**GET** `/api/auth/check-password-reset`
- Returns user's password reset status
- Used by middleware to check if force reset is required

### 4. Force Password Reset Update
**POST** `/api/auth/check-password-reset`
- Request body: `{ newPassword: string }`
- Updates password and clears force reset flag
- Requires authentication

### 5. Institution Creation (Updated)
**POST** `/api/admin/institutions`
- Creates institution with `forcePasswordReset: true`
- Sends welcome email with temporary password
- Uses secure password generation

## UI Components

### 1. Reset Password Page
**Location**: `/app/reset-password/page.tsx`
- Handles both force reset and email link reset
- Password validation and confirmation
- Responsive design with loading states

### 2. Forgot Password Page
**Location**: `/app/forgot-password/page.tsx`
- Email input for password reset request
- Success/error message handling
- Link back to sign in page

### 3. Force Password Reset Check Component
**Location**: `/components/ForcePasswordResetCheck.tsx`
- Middleware component that checks password reset status
- Redirects users to reset page if needed
- Excludes certain paths from checking

## Utility Functions

### 1. Secure Password Generation
**Location**: `/lib/auth-utils.ts`
```typescript
export function generateSecurePassword(length: number = 12): string
```
- Generates passwords with uppercase, lowercase, numbers, and special characters
- Ensures at least one character from each category
- Shuffles the final password for randomness

### 2. Password Hashing
**Location**: `/lib/auth-utils.ts`
```typescript
export async function hashPassword(password: string): Promise<string>
export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>
```
- Uses bcrypt for secure password hashing
- Provides password comparison functionality

## Email Templates

### 1. Welcome Email for New Institution Users
- Professional HTML template
- Includes temporary password
- Security notice about password change requirement
- Platform branding and styling

### 2. Password Reset Email
- Clean, responsive design
- Reset button with secure link
- Expiration notice
- Security warnings

## Security Considerations

### 1. Token Security
- Reset tokens are 32-byte random hex strings
- Tokens are temporarily stored in the password field
- Tokens expire after 1 hour
- No token reuse allowed

### 2. Password Requirements
- Minimum 8 characters
- Must include confirmation
- Secure generation for temporary passwords
- Bcrypt hashing for storage

### 3. Rate Limiting
- Password reset requests are rate limited
- Prevents abuse and brute force attacks
- Configurable limits per IP address

### 4. Audit Logging
- All password changes are logged
- Includes IP address and timestamp
- Tracks both force resets and user-initiated resets

## Integration Points

### 1. Layout Integration
The `ForcePasswordResetCheck` component is integrated into the main layout to ensure all protected routes check for password reset requirements.

### 2. Authentication Flow
- Users are redirected to reset page if `forcePasswordReset` is true
- Normal authentication flow continues after password change
- Session management handles the transition

### 3. Email Service Integration
- Uses existing email service infrastructure
- Supports both database and environment variable configurations
- Graceful fallback if email sending fails

## Usage Examples

### 1. Creating a New Institution (Admin)
```typescript
// The admin creates an institution through the admin panel
// The system automatically:
// 1. Sets forcePasswordReset: true
// 2. Generates secure temporary password
// 3. Sends welcome email
// 4. User must change password on first login
```

### 2. User Requests Password Reset
```typescript
// User visits /forgot-password
// Enters email address
// System sends reset email with secure link
// User clicks link and sets new password
```

### 3. Force Password Reset Flow
```typescript
// User logs in with temporary password
// System detects forcePasswordReset: true
// Redirects to /reset-password
// User sets new password
// System clears forcePasswordReset flag
// User can access protected routes
```

## Testing

The system includes comprehensive testing:
- Secure password generation validation
- Password hashing verification
- Database schema validation
- API endpoint functionality
- UI component behavior

## Future Enhancements

### 1. Additional Security Features
- Two-factor authentication integration
- Password strength indicators
- Account lockout after failed attempts
- Session invalidation on password change

### 2. Email Enhancements
- Multiple email templates for different scenarios
- Localization support
- Email delivery tracking
- Alternative contact methods

### 3. Admin Features
- Bulk password reset for institutions
- Password policy management
- Reset token management
- User account status monitoring

## Troubleshooting

### Common Issues

1. **Email Not Sending**
   - Check SMTP configuration
   - Verify email settings in database
   - Check environment variables

2. **Reset Link Not Working**
   - Verify token expiration (1 hour)
   - Check URL encoding
   - Ensure proper email parameter

3. **Force Reset Not Triggering**
   - Verify `forcePasswordReset` field in database
   - Check middleware component integration
   - Ensure proper session handling

### Debug Steps

1. Check database for `forcePasswordReset` field
2. Verify email service configuration
3. Test API endpoints directly
4. Check browser console for errors
5. Review server logs for issues

## Conclusion

The password reset system provides a secure, user-friendly way to handle password management for both new institution users and existing users. The implementation follows security best practices and integrates seamlessly with the existing platform architecture. 