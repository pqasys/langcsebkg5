# Subscription Enrollment Governance: Platform-Wide Course Management

## **🎯 Overview**

This document addresses the critical requirement that platform-wide course enrollments must be governed by subscription plans, including:
- **Enrollment Limits**: Number of courses a user can enroll in based on their plan
- **Attendance Tracking**: Monitoring active enrollments and attendance
- **Plan Downgrade Handling**: Managing access when subscription is downgraded
- **Upgrade Benefits**: Enhanced access when subscription is upgraded

---

## **📊 Enhanced Subscription Model**

### **1. Subscription Plan Limits**

```typescript
model StudentSubscription {
  // ... existing fields ...
  
  // Enrollment Governance
  maxEnrollments       Int     @default(1) // Maximum concurrent enrollments
  maxActiveCourses     Int     @default(1) // Maximum active courses
  canAccessLiveClasses Boolean @default(false)
  canAccessRecordings  Boolean @default(false)
  canUseHDVideo        Boolean @default(false)
  
  // Plan-specific limits
  planType             String  @default("BASIC") // 'BASIC', 'PREMIUM', 'ENTERPRISE'
  enrollmentQuota      Int     @default(1) // Monthly enrollment quota
  attendanceQuota      Int     @default(10) // Monthly live session attendance quota
  
  // Usage tracking
  currentEnrollments   Int     @default(0) // Current active enrollments
  monthlyEnrollments   Int     @default(0) // Enrollments this month
  monthlyAttendance    Int     @default(0) // Live sessions attended this month
  
  // Relations
  enrollments          StudentCourseEnrollment[]
  
  @@index([planType])
  @@index([currentEnrollments])
}
```

### **2. Enhanced Enrollment Tracking**

```typescript
model StudentCourseEnrollment {
  // ... existing fields ...
  
  // Subscription governance
  enrollmentType       String  @default("COURSE_BASED") // 'COURSE_BASED', 'SUBSCRIPTION_BASED'
  accessMethod         String  @default("DIRECT") // 'DIRECT', 'SUBSCRIPTION', 'INSTITUTION'
  subscriptionId       String? // Link to active subscription
  subscriptionTier     String? // Subscription tier at enrollment
  
  // Platform course specific
  isPlatformCourse     Boolean @default(false)
  enrollmentQuotaUsed  Boolean @default(false) // Whether this enrollment used quota
  attendanceQuotaUsed  Int     @default(0) // Number of live sessions attended
  
  // Access control
  accessExpiry         DateTime? // When access expires (for subscription-based)
  isActive             Boolean @default(true) // Whether enrollment is currently active
  
  // Relations
  subscription         StudentSubscription? @relation(fields: [subscriptionId], references: [id])
  
  @@index([subscriptionId])
  @@index([isPlatformCourse])
  @@index([isActive])
}
```

### **3. Live Session Attendance Tracking**

```typescript
model VideoSessionParticipant {
  // ... existing fields ...
  
  // Subscription governance
  subscriptionId       String? // Link to subscription used for access
  quotaUsed           Boolean @default(false) // Whether this attendance used quota
  attendanceType       String  @default("REGULAR") // 'REGULAR', 'QUOTA_BASED', 'UNLIMITED'
  
  // Relations
  subscription         StudentSubscription? @relation(fields: [subscriptionId], references: [id])
  
  @@index([subscriptionId])
  @@index([quotaUsed])
}
```

---

## **🔧 Enrollment Governance Logic**

### **1. Enrollment Limit Checking**

```typescript
// Check if user can enroll in platform course
async function canEnrollInPlatformCourse(userId: string, courseId: string): Promise<{
  canEnroll: boolean;
  reason?: string;
  limits?: {
    current: number;
    max: number;
    remaining: number;
  };
}> {
  const subscription = await prisma.studentSubscription.findFirst({
    where: {
      studentId: userId,
      status: 'ACTIVE'
    }
  });
  
  if (!subscription) {
    return {
      canEnroll: false,
      reason: 'No active subscription required for platform courses'
    };
  }
  
  // Check enrollment limits
  const currentEnrollments = await prisma.studentCourseEnrollment.count({
    where: {
      studentId: userId,
      isPlatformCourse: true,
      isActive: true,
      subscriptionId: subscription.id
    }
  });
  
  const canEnroll = currentEnrollments < subscription.maxEnrollments;
  
  return {
    canEnroll,
    reason: canEnroll ? undefined : 'Enrollment limit reached',
    limits: {
      current: currentEnrollments,
      max: subscription.maxEnrollments,
      remaining: subscription.maxEnrollments - currentEnrollments
    }
  };
}
```

### **2. Platform Course Enrollment Process**

```typescript
// Platform course enrollment with subscription governance
export async function POST(request: NextRequest) {
  const { courseId } = await request.json();
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const course = await prisma.course.findUnique({
    where: { id: courseId }
  });
  
  if (!course || !course.isPlatformCourse) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 });
  }
  
  // Check enrollment eligibility
  const enrollmentCheck = await canEnrollInPlatformCourse(session.user.id, courseId);
  
  if (!enrollmentCheck.canEnroll) {
    return NextResponse.json({
      error: enrollmentCheck.reason,
      limits: enrollmentCheck.limits
    }, { status: 402 });
  }
  
  // Get active subscription
  const subscription = await prisma.studentSubscription.findFirst({
    where: {
      studentId: session.user.id,
      status: 'ACTIVE'
    }
  });
  
  // Create enrollment
  const enrollment = await prisma.studentCourseEnrollment.create({
    data: {
      studentId: session.user.id,
      courseId,
      enrollmentType: 'SUBSCRIPTION_BASED',
      accessMethod: 'SUBSCRIPTION',
      subscriptionId: subscription.id,
      subscriptionTier: subscription.planType,
      isPlatformCourse: true,
      enrollmentQuotaUsed: true,
      status: 'ACTIVE',
      progress: 0
    }
  });
  
  // Update subscription usage
  await prisma.studentSubscription.update({
    where: { id: subscription.id },
    data: {
      currentEnrollments: {
        increment: 1
      },
      monthlyEnrollments: {
        increment: 1
      }
    }
  });
  
  return NextResponse.json({ enrollment });
}
```

### **3. Live Session Attendance Governance**

```typescript
// Check if user can attend live session
async function canAttendLiveSession(userId: string, sessionId: string): Promise<{
  canAttend: boolean;
  reason?: string;
  quotaInfo?: {
    used: number;
    max: number;
    remaining: number;
  };
}> {
  const subscription = await prisma.studentSubscription.findFirst({
    where: {
      studentId: userId,
      status: 'ACTIVE'
    }
  });
  
  if (!subscription) {
    return {
      canAttend: false,
      reason: 'No active subscription required'
    };
  }
  
  // Check if user has unlimited attendance
  if (subscription.attendanceQuota === -1) {
    return { canAttend: true };
  }
  
  // Count this month's attendance
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  
  const monthlyAttendance = await prisma.videoSessionParticipant.count({
    where: {
      userId,
      session: {
        startTime: {
          gte: startOfMonth
        }
      },
      quotaUsed: true
    }
  });
  
  const canAttend = monthlyAttendance < subscription.attendanceQuota;
  
  return {
    canAttend,
    reason: canAttend ? undefined : 'Monthly attendance quota reached',
    quotaInfo: {
      used: monthlyAttendance,
      max: subscription.attendanceQuota,
      remaining: subscription.attendanceQuota - monthlyAttendance
    }
  };
}
```

---

## **📉 Plan Downgrade Handling**

### **1. Subscription Downgrade Process**

```typescript
// Handle subscription downgrade
async function handleSubscriptionDowngrade(subscriptionId: string, newPlanType: string) {
  const subscription = await prisma.studentSubscription.findUnique({
    where: { id: subscriptionId },
    include: {
      enrollments: {
        where: { isActive: true }
      }
    }
  });
  
  if (!subscription) return;
  
  // Get new plan limits
  const newPlanLimits = getPlanLimits(newPlanType);
  
  // Check if current enrollments exceed new limits
  const currentEnrollments = subscription.enrollments.length;
  
  if (currentEnrollments > newPlanLimits.maxEnrollments) {
    // Need to deactivate excess enrollments
    const excessEnrollments = currentEnrollments - newPlanLimits.maxEnrollments;
    
    // Deactivate oldest enrollments first
    const enrollmentsToDeactivate = subscription.enrollments
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(0, excessEnrollments);
    
    for (const enrollment of enrollmentsToDeactivate) {
      await prisma.studentCourseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          isActive: false,
          accessExpiry: new Date() // Immediate expiry
        }
      });
    }
    
    // Send notification to user
    await sendDowngradeNotification(subscription.studentId, {
      deactivatedCourses: enrollmentsToDeactivate.length,
      newPlanLimits
    });
  }
  
  // Update subscription with new limits
  await prisma.studentSubscription.update({
    where: { id: subscriptionId },
    data: {
      planType: newPlanType,
      maxEnrollments: newPlanLimits.maxEnrollments,
      maxActiveCourses: newPlanLimits.maxActiveCourses,
      enrollmentQuota: newPlanLimits.enrollmentQuota,
      attendanceQuota: newPlanLimits.attendanceQuota,
      currentEnrollments: Math.min(currentEnrollments, newPlanLimits.maxEnrollments)
    }
  });
}
```

### **2. Plan Limits Configuration**

```typescript
function getPlanLimits(planType: string) {
  const limits = {
    'BASIC': {
      maxEnrollments: 1,
      maxActiveCourses: 1,
      enrollmentQuota: 1,
      attendanceQuota: 5,
      canAccessLiveClasses: true,
      canAccessRecordings: false,
      canUseHDVideo: false
    },
    'PREMIUM': {
      maxEnrollments: 3,
      maxActiveCourses: 3,
      enrollmentQuota: 5,
      attendanceQuota: 20,
      canAccessLiveClasses: true,
      canAccessRecordings: true,
      canUseHDVideo: true
    },
    'ENTERPRISE': {
      maxEnrollments: 10,
      maxActiveCourses: 10,
      enrollmentQuota: -1, // Unlimited
      attendanceQuota: -1, // Unlimited
      canAccessLiveClasses: true,
      canAccessRecordings: true,
      canUseHDVideo: true
    }
  };
  
  return limits[planType] || limits['BASIC'];
}
```

---

## **📈 Usage Monitoring & Analytics**

### **1. Subscription Usage Dashboard**

```typescript
// Get subscription usage analytics
async function getSubscriptionUsage(userId: string) {
  const subscription = await prisma.studentSubscription.findFirst({
    where: {
      studentId: userId,
      status: 'ACTIVE'
    },
    include: {
      enrollments: {
        where: { isActive: true },
        include: {
          course: true
        }
      }
    }
  });
  
  if (!subscription) return null;
  
  // Calculate usage metrics
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);
  
  const monthlyAttendance = await prisma.videoSessionParticipant.count({
    where: {
      userId,
      session: {
        startTime: {
          gte: currentMonth
        }
      },
      quotaUsed: true
    }
  });
  
  const planLimits = getPlanLimits(subscription.planType);
  
  return {
    subscription,
    usage: {
      enrollments: {
        current: subscription.currentEnrollments,
        max: planLimits.maxEnrollments,
        percentage: (subscription.currentEnrollments / planLimits.maxEnrollments) * 100
      },
      monthlyAttendance: {
        current: monthlyAttendance,
        max: planLimits.attendanceQuota,
        percentage: planLimits.attendanceQuota === -1 ? 0 : 
          (monthlyAttendance / planLimits.attendanceQuota) * 100
      },
      monthlyEnrollments: {
        current: subscription.monthlyEnrollments,
        max: planLimits.enrollmentQuota,
        percentage: planLimits.enrollmentQuota === -1 ? 0 :
          (subscription.monthlyEnrollments / planLimits.enrollmentQuota) * 100
      }
    },
    activeEnrollments: subscription.enrollments
  };
}
```

### **2. Usage Alerts & Notifications**

```typescript
// Check and send usage alerts
async function checkUsageAlerts(userId: string) {
  const usage = await getSubscriptionUsage(userId);
  
  if (!usage) return;
  
  const { usage: metrics } = usage;
  
  // Enrollment limit warnings
  if (metrics.enrollments.percentage >= 80) {
    await sendUsageAlert(userId, {
      type: 'ENROLLMENT_LIMIT_WARNING',
      message: `You've used ${metrics.enrollments.current}/${metrics.enrollments.max} enrollments`,
      percentage: metrics.enrollments.percentage
    });
  }
  
  // Attendance limit warnings
  if (metrics.monthlyAttendance.percentage >= 80) {
    await sendUsageAlert(userId, {
      type: 'ATTENDANCE_LIMIT_WARNING',
      message: `You've attended ${metrics.monthlyAttendance.current}/${metrics.monthlyAttendance.max} sessions this month`,
      percentage: metrics.monthlyAttendance.percentage
    });
  }
  
  // Monthly enrollment limit warnings
  if (metrics.monthlyEnrollments.percentage >= 80) {
    await sendUsageAlert(userId, {
      type: 'MONTHLY_ENROLLMENT_WARNING',
      message: `You've enrolled in ${metrics.monthlyEnrollments.current}/${metrics.monthlyEnrollments.max} courses this month`,
      percentage: metrics.monthlyEnrollments.percentage
    });
  }
}
```

---

## **🎛️ User Interface Components**

### **1. Subscription Usage Component**

```typescript
function SubscriptionUsage({ userId }: { userId: string }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsage();
  }, [userId]);
  
  const fetchUsage = async () => {
    try {
      const response = await fetch(`/api/subscription/usage?userId=${userId}`);
      const data = await response.json();
      setUsage(data);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Loading usage...</div>;
  if (!usage) return <div>No active subscription</div>;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Subscription Usage</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Enrollment Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Current</span>
                <span>{usage.usage.enrollments.current}/{usage.usage.enrollments.max}</span>
              </div>
              <Progress 
                value={usage.usage.enrollments.percentage} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>This Month</span>
                <span>
                  {usage.usage.monthlyAttendance.current}/
                  {usage.usage.monthlyAttendance.max === -1 ? '∞' : usage.usage.monthlyAttendance.max}
                </span>
              </div>
              <Progress 
                value={usage.usage.monthlyAttendance.percentage} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Monthly Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Monthly Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>This Month</span>
                <span>
                  {usage.usage.monthlyEnrollments.current}/
                  {usage.usage.monthlyEnrollments.max === -1 ? '∞' : usage.usage.monthlyEnrollments.max}
                </span>
              </div>
              <Progress 
                value={usage.usage.monthlyEnrollments.percentage} 
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Enrollments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {usage.activeEnrollments.map(enrollment => (
              <div key={enrollment.id} className="flex justify-between items-center p-2 border rounded">
                <span>{enrollment.course.title}</span>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## **📋 Implementation Benefits**

### **For Platform:**
- ✅ **Revenue Protection**: Prevents unlimited usage on limited plans
- ✅ **Plan Differentiation**: Clear value proposition for different tiers
- ✅ **Usage Analytics**: Track user behavior and plan effectiveness
- ✅ **Upgrade Incentives**: Natural upgrade path when limits are reached

### **For Users:**
- ✅ **Clear Limits**: Know exactly what their plan includes
- ✅ **Usage Tracking**: Monitor their usage and plan accordingly
- ✅ **Upgrade Path**: Clear benefits for upgrading plans
- ✅ **Fair Usage**: Prevents abuse while maintaining flexibility

### **For Business:**
- ✅ **Predictable Revenue**: Controlled usage patterns
- ✅ **Scalable Pricing**: Different tiers for different usage needs
- ✅ **Customer Retention**: Usage-based upgrade incentives
- ✅ **Resource Management**: Efficient allocation of platform resources

This governance system ensures that platform-wide enrollments are properly controlled by subscription plans while providing clear value and upgrade incentives for users. 