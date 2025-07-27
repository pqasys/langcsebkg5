# Institution Approval and Status Filtering Implementation

## Overview
This document outlines the implementation of comprehensive filtering to ensure that only approved and active institutions and their content are visible in public-facing APIs and pages.

## Problem Statement
Previously, institutions awaiting approval or with inactive status were appearing in public listings, which could cause:
- Security issues (unauthorized access to content)
- Business logic problems (showing unapproved content)
- User confusion (seeing institutions that aren't actually available)

## Solution Implemented

### 1. Public Institutions API (`/api/institutions/route.ts`)
**Before:**
```typescript
const institutions = await prisma.institution.findMany({
  select: {
    id: true,
    name: true,
    // ... other fields
  },
})
```

**After:**
```typescript
const institutions = await prisma.institution.findMany({
  where: {
    isApproved: true,
    status: 'ACTIVE'
  },
  select: {
    id: true,
    name: true,
    isApproved: true,  // Added for verification
    status: true,      // Added for verification
    // ... other fields
    courses: {
      where: {
        status: 'PUBLISHED'  // Only published courses
      },
      select: {
        id: true,
        title: true,
      },
    },
  },
})
```

### 2. Public Courses API (`/api/courses/public/route.ts`)
**Before:**
```typescript
const courses = await prisma.course.findMany({
  where: {
    startDate: { gte: new Date() },
    status: 'PUBLISHED'
  },
  // ... include institution data
})
```

**After:**
```typescript
const courses = await prisma.course.findMany({
  where: {
    startDate: { gte: new Date() },
    status: 'PUBLISHED',
    institution: {
      isApproved: true,
      status: 'ACTIVE'
    }
  },
  include: {
    institution: {
      select: {
        name: true,
        country: true,
        city: true,
        commissionRate: true,
        isApproved: true,  // Added for verification
        status: true       // Added for verification
      }
    },
    // ... other includes
  },
})
```

### 3. Individual Institution API (`/api/institutions/[id]/route.ts`)
**Before:**
```typescript
// Allow public access for viewing institution details
// Authentication is only required for editing
```

**After:**
```typescript
// Check if user is authenticated and has access to this institution
const isInstitutionUser = session?.user?.role === 'INSTITUTION' && 
                         session?.user?.institutionId === params.id;
const isAdmin = session?.user?.role === 'ADMIN';

// For public access, only show approved and active institutions
if (!isInstitutionUser && !isAdmin) {
  if (!institution.isApproved || institution.status !== 'ACTIVE') {
    return NextResponse.json({ error: 'Institution not available' }, { status: 404 });
  }
}

// Only show published courses to public, all courses to institution users and admins
courses: {
  where: {
    ...(isInstitutionUser || isAdmin ? {} : { status: 'PUBLISHED' })
  },
  // ... select fields
}
```

### 4. Search API (`/api/courses/search/route.ts`)
**Before:**
```typescript
const whereClause: any = {
  status: 'published',
  startDate: { gte: new Date() }
};
```

**After:**
```typescript
const whereClause: any = {
  status: 'published',
  startDate: { gte: new Date() },
  institution: {
    isApproved: true,
    status: 'ACTIVE'
  }
};
```

## Access Control Matrix

| User Type | Institution Status | Access Level |
|-----------|-------------------|--------------|
| Public | Approved + Active | ✅ Full access to public content |
| Public | Not Approved | ❌ 404 Error |
| Public | Not Active | ❌ 404 Error |
| Institution User | Own Institution | ✅ Full access to own content |
| Institution User | Other Approved + Active | ✅ Public access only |
| Institution User | Other Not Approved/Active | ❌ 404 Error |
| Admin | Any Institution | ✅ Full access to all content |

## Testing Results

### ✅ Successfully Implemented
1. **Public Institutions API**: Only returns approved and active institutions
2. **Public Courses API**: Only returns courses from approved and active institutions
3. **Individual Institution API**: Returns 404 for non-approved/inactive institutions
4. **Search API**: Only returns courses from approved and active institutions

### ✅ Verification Tests
- Non-approved institution (GraceFul English School) correctly returns 404
- Non-approved institution excluded from public institutions list
- Non-approved institution courses excluded from public courses list
- Approved institutions (ABC School, XYZ Language School) accessible publicly

## Database State
Current institution approval status:
- **ABC School of English**: `isApproved: true, status: ACTIVE` ✅
- **XYZ Language School**: `isApproved: true, status: ACTIVE` ✅  
- **GraceFul English School**: `isApproved: false, status: PENDING` ❌

## Security Benefits
1. **Content Protection**: Unapproved content is completely hidden from public view
2. **Access Control**: Proper role-based access control implemented
3. **Data Integrity**: Only verified institutions can display content publicly
4. **Business Logic**: Respects the approval workflow

## Maintenance Notes
- All public APIs now include `isApproved` and `status` fields for verification
- Filtering is applied at the database level for performance
- Role-based access control ensures proper permissions
- 404 errors are returned for unauthorized access (security through obscurity)

## Future Considerations
1. Consider adding audit logging for access attempts to non-approved content
2. Implement caching for approved institution lists to improve performance
3. Add monitoring for approval status changes to ensure immediate effect
4. Consider implementing a preview mode for institutions to see their content before approval 