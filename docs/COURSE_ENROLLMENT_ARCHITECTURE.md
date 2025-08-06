# Course Enrollment Architecture: Three-Scenario Support

## **🎯 Overview**

This document addresses the implementation issues for course discovery, enrollment, and payment flow across the three live class scenarios:
1. **Institution Course (Live Classes Only)** - Course-based enrollment
2. **Institution Course (Blended Learning)** - Course-based enrollment  
3. **Platform-wide Courses (Live Classes Only)** - Subscription-based access

---

## **📊 Enhanced Course Model**

### **1. Course Classification System**

```typescript
model Course {
  // ... existing fields ...
  
  // Course Classification
  courseType        String   @default("STANDARD") // 'STANDARD', 'LIVE_ONLY', 'BLENDED', 'PLATFORM_LIVE'
  deliveryMode      String   @default("SELF_PACED") // 'SELF_PACED', 'LIVE_ONLY', 'BLENDED', 'PLATFORM_LIVE'
  enrollmentType    String   @default("COURSE_BASED") // 'COURSE_BASED', 'SUBSCRIPTION_BASED'
  
  // Live Class Configuration
  hasLiveClasses    Boolean  @default(false)
  liveClassType     String?  // 'LIVE_ONLY', 'BLENDED', 'PLATFORM_LIVE'
  liveClassFrequency String? // 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM'
  
  // Access Control
  requiresSubscription Boolean @default(false)
  subscriptionTier    String?  // 'BASIC', 'PREMIUM', 'ENTERPRISE'
  isPlatformCourse    Boolean  @default(false)
  
  // Relations
  recurringSessions  RecurringSessionPattern[]
  liveClassSessions  VideoSession[]
  
  @@index([courseType])
  @@index([deliveryMode])
  @@index([enrollmentType])
  @@index([isPlatformCourse])
  @@index([requiresSubscription])
}
```

### **2. Enhanced Enrollment Model**

```typescript
model StudentCourseEnrollment {
  // ... existing fields ...
  
  // Enhanced enrollment tracking
  enrollmentType    String   @default("COURSE_BASED") // 'COURSE_BASED', 'SUBSCRIPTION_BASED'
  accessMethod      String   @default("DIRECT") // 'DIRECT', 'SUBSCRIPTION', 'INSTITUTION'
  
  // Live class specific
  hasLiveClassAccess Boolean  @default(false)
  liveClassAccessExpiry DateTime?
  
  // Subscription tracking
  subscriptionId    String?  // Link to active subscription
  subscriptionTier  String?  // Subscription tier at enrollment
  
  // Relations
  subscription      StudentSubscription? @relation(fields: [subscriptionId], references: [id])
  
  @@index([enrollmentType])
  @@index([accessMethod])
  @@index([subscriptionId])
}
```

---

## **🔍 Course Discovery & Filtering**

### **1. Course Listing API Enhancement**

```typescript
// Enhanced course listing with filtering
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Filter parameters
  const courseType = searchParams.get('courseType'); // 'STANDARD', 'LIVE_ONLY', 'BLENDED', 'PLATFORM_LIVE'
  const deliveryMode = searchParams.get('deliveryMode'); // 'SELF_PACED', 'LIVE_ONLY', 'BLENDED'
  const enrollmentType = searchParams.get('enrollmentType'); // 'COURSE_BASED', 'SUBSCRIPTION_BASED'
  const hasLiveClasses = searchParams.get('hasLiveClasses'); // 'true', 'false'
  
  // Build where clause
  const where: any = {
    status: 'PUBLISHED',
    institution: {
      isApproved: true,
      status: 'ACTIVE'
    }
  };
  
  if (courseType) where.courseType = courseType;
  if (deliveryMode) where.deliveryMode = deliveryMode;
  if (enrollmentType) where.enrollmentType = enrollmentType;
  if (hasLiveClasses) where.hasLiveClasses = hasLiveClasses === 'true';
  
  const courses = await prisma.course.findMany({
    where,
    include: {
      institution: { /* ... */ },
      courseTags: { include: { tag: true } }
    },
    orderBy: [
      { isFeatured: 'desc' },
      { createdAt: 'desc' }
    ]
  });
  
  // Add course type indicators
  const enhancedCourses = courses.map(course => ({
    ...course,
    courseTypeLabel: getCourseTypeLabel(course.courseType),
    deliveryModeLabel: getDeliveryModeLabel(course.deliveryMode),
    enrollmentTypeLabel: getEnrollmentTypeLabel(course.enrollmentType),
    requiresSubscription: course.requiresSubscription,
    isPlatformCourse: course.isPlatformCourse
  }));
  
  return NextResponse.json(enhancedCourses);
}
```

### **2. Course Type Labels**

```typescript
function getCourseTypeLabel(courseType: string): string {
  const labels = {
    'STANDARD': 'Self-Paced Course',
    'LIVE_ONLY': 'Live Classes Only',
    'BLENDED': 'Blended Learning',
    'PLATFORM_LIVE': 'Platform Live Course'
  };
  return labels[courseType] || 'Course';
}

function getDeliveryModeLabel(deliveryMode: string): string {
  const labels = {
    'SELF_PACED': 'Self-Paced',
    'LIVE_ONLY': 'Live Classes Only',
    'BLENDED': 'Blended Learning',
    'PLATFORM_LIVE': 'Platform Live'
  };
  return labels[deliveryMode] || 'Self-Paced';
}

function getEnrollmentTypeLabel(enrollmentType: string): string {
  const labels = {
    'COURSE_BASED': 'One-time Purchase',
    'SUBSCRIPTION_BASED': 'Subscription Required'
  };
  return labels[enrollmentType] || 'One-time Purchase';
}
```

---

## **🎫 Enrollment Process by Scenario**

### **Scenario 1 & 2: Institution Courses (Course-Based Enrollment)**

```typescript
// Course enrollment flow
export async function POST(request: NextRequest) {
  const { courseId, studentId } = await request.json();
  
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { institution: true }
  });
  
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  
  // Check if course requires subscription
  if (course.requiresSubscription) {
    const subscription = await prisma.studentSubscription.findFirst({
      where: {
        studentId,
        status: 'ACTIVE',
        subscriptionTier: { gte: course.subscriptionTier }
      }
    });
    
    if (!subscription) {
      return NextResponse.json({ 
        error: 'Subscription required',
        requiredTier: course.subscriptionTier,
        courseType: course.courseType
      }, { status: 402 });
    }
  }
  
  // Create course enrollment
  const enrollment = await prisma.studentCourseEnrollment.create({
    data: {
      studentId,
      courseId,
      enrollmentType: course.enrollmentType,
      accessMethod: course.isPlatformCourse ? 'SUBSCRIPTION' : 'DIRECT',
      hasLiveClassAccess: course.hasLiveClasses,
      liveClassAccessExpiry: course.hasLiveClasses ? 
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null, // 1 year access
      status: 'ACTIVE',
      progress: 0
    }
  });
  
  // If course has live classes, create session access
  if (course.hasLiveClasses) {
    await createLiveClassAccess(enrollment.id, courseId, studentId);
  }
  
  return NextResponse.json({ enrollment });
}
```

### **Scenario 3: Platform Courses (Subscription-Based Access)**

```typescript
// Platform course access check
export async function GET(request: NextRequest) {
  const { courseId } = await request.json();
  const session = await getServerSession(authOptions);
  
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  
  if (!course || !course.isPlatformCourse) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  
  // Check subscription access
  const subscription = await prisma.studentSubscription.findFirst({
    where: {
      studentId: session.user.id,
      status: 'ACTIVE'
    }
  });
  
  const hasAccess = subscription && 
    subscription.subscriptionTier >= course.subscriptionTier;
  
  return NextResponse.json({
    course,
    hasAccess,
    requiredTier: course.subscriptionTier,
    currentTier: subscription?.subscriptionTier
  });
}
```

---

## **🎛️ User Interface Components**

### **1. Course Card Component**

```typescript
interface CourseCardProps {
  course: {
    id: string;
    title: string;
    courseType: string;
    deliveryMode: string;
    enrollmentType: string;
    hasLiveClasses: boolean;
    requiresSubscription: boolean;
    isPlatformCourse: boolean;
    price: number;
    // ... other fields
  };
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{course.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              {getCourseTypeLabel(course.courseType)}
            </Badge>
            {course.hasLiveClasses && (
              <Badge variant="outline">
                <Video className="w-3 h-3 mr-1" />
                Live Classes
              </Badge>
            )}
            {course.requiresSubscription && (
              <Badge variant="destructive">
                Subscription Required
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {getDeliveryModeLabel(course.deliveryMode)}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">
              {getEnrollmentTypeLabel(course.enrollmentType)}
            </span>
            
            {course.enrollmentType === 'COURSE_BASED' ? (
              <Button>
                Enroll Now - ${course.price}
              </Button>
            ) : (
              <Button variant="outline">
                View with Subscription
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### **2. Course Filtering Component**

```typescript
function CourseFilters() {
  const [filters, setFilters] = useState({
    courseType: '',
    deliveryMode: '',
    hasLiveClasses: '',
    enrollmentType: ''
  });
  
  return (
    <div className="space-y-4">
      <Select
        value={filters.courseType}
        onValueChange={(value) => setFilters(prev => ({ ...prev, courseType: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Course Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Course Types</SelectItem>
          <SelectItem value="STANDARD">Self-Paced Courses</SelectItem>
          <SelectItem value="LIVE_ONLY">Live Classes Only</SelectItem>
          <SelectItem value="BLENDED">Blended Learning</SelectItem>
          <SelectItem value="PLATFORM_LIVE">Platform Live Courses</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.hasLiveClasses}
        onValueChange={(value) => setFilters(prev => ({ ...prev, hasLiveClasses: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Live Classes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Courses</SelectItem>
          <SelectItem value="true">With Live Classes</SelectItem>
          <SelectItem value="false">Self-Paced Only</SelectItem>
        </SelectContent>
      </Select>
      
      <Select
        value={filters.enrollmentType}
        onValueChange={(value) => setFilters(prev => ({ ...prev, enrollmentType: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Enrollment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Enrollment Types</SelectItem>
          <SelectItem value="COURSE_BASED">One-time Purchase</SelectItem>
          <SelectItem value="SUBSCRIPTION_BASED">Subscription Required</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

---

## **🔐 Access Control Matrix**

### **Course Access by User Type**

| User Type | Standard Courses | Institution Live Courses | Platform Live Courses |
|-----------|------------------|-------------------------|----------------------|
| **FREE** | ❌ | ❌ | ❌ |
| **SUBSCRIBER** | ✅ | ❌ | ✅ (with subscription) |
| **INSTITUTION_STUDENT** | ❌ | ✅ (if enrolled) | ✅ (with subscription) |
| **HYBRID** | ✅ | ✅ (if enrolled) | ✅ (with subscription) |
| **INSTITUTION_STAFF** | ❌ | ✅ (own institution) | ✅ (with subscription) |

### **Enrollment Flow Logic**

```typescript
function determineEnrollmentFlow(course: Course, user: User) {
  // Scenario 1 & 2: Institution courses
  if (course.institutionId) {
    if (user.role === 'INSTITUTION_STAFF' && user.institutionId === course.institutionId) {
      return 'STAFF_ACCESS'; // Direct access for staff
    }
    
    if (course.enrollmentType === 'COURSE_BASED') {
      return 'COURSE_ENROLLMENT'; // One-time purchase
    }
  }
  
  // Scenario 3: Platform courses
  if (course.isPlatformCourse) {
    if (course.enrollmentType === 'SUBSCRIPTION_BASED') {
      return 'SUBSCRIPTION_CHECK'; // Check subscription access
    }
  }
  
  return 'NO_ACCESS';
}
```

---

## **📈 Benefits of This Architecture**

### **For Students:**
- ✅ **Clear Course Types**: Easy to identify course type and enrollment method
- ✅ **Appropriate Expectations**: Know if subscription or one-time purchase required
- ✅ **Filtered Discovery**: Can filter courses by type and enrollment method
- ✅ **Unified Experience**: Consistent interface across all course types

### **For Institutions:**
- ✅ **Flexible Course Types**: Can create different types of courses
- ✅ **Clear Pricing**: Different enrollment models for different course types
- ✅ **Access Control**: Proper control over who can access courses
- ✅ **Revenue Optimization**: Multiple monetization strategies

### **For Platform:**
- ✅ **Scalable Architecture**: Supports all three scenarios
- ✅ **Clear Differentiation**: Platform courses vs. institution courses
- ✅ **Subscription Integration**: Proper subscription-based access
- ✅ **Revenue Diversification**: Course sales + subscription revenue

---

## **🚀 Implementation Roadmap**

### **Phase 1: Core Infrastructure**
1. Enhance Course model with classification fields
2. Update enrollment model for different access methods
3. Implement course filtering and discovery

### **Phase 2: User Interface**
1. Update course cards with type indicators
2. Add course filtering components
3. Implement different enrollment flows

### **Phase 3: Access Control**
1. Implement subscription-based access checks
2. Add enrollment validation logic
3. Create access control matrix

This architecture provides a clear, scalable solution that properly handles the different enrollment and access requirements for all three scenarios. 