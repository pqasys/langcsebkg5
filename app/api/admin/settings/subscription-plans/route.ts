import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Try to fetch from database first
    try {
      const plans = await prisma.subscriptionPlan.findMany({
        orderBy: { createdAt: 'desc' }
      });

      if (plans.length > 0) {
        return NextResponse.json({ plans });
      }
    } catch (dbError) {
      // // // // // // // // // // // // console.log('Database not available, using fallback plans');
    }

    // Fallback to hardcoded plans if database is not available
    const subscriptionPlans = [
      {
        id: 'starter-1',
        name: 'Starter',
        description: 'Perfect for small institutions getting started',
        price: 99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Up to 100 students',
          'Up to 10 courses',
          'Basic analytics',
          'Email support',
          'Standard features'
        ],
        maxStudents: 100,
        maxCourses: 10,
        maxTeachers: 2,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'professional-1',
        name: 'Professional',
        description: 'Ideal for growing institutions with advanced needs',
        price: 299,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Up to 500 students',
          'Up to 50 courses',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'Marketing tools'
        ],
        maxStudents: 500,
        maxCourses: 50,
        maxTeachers: 5,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'enterprise-1',
        name: 'Enterprise',
        description: 'Complete solution for large institutions',
        price: 999,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Unlimited students',
          'Unlimited courses',
          'Advanced analytics',
          'Priority support',
          'Custom branding',
          'API access',
          'White label solution',
          'Dedicated account manager'
        ],
        maxStudents: -1,
        maxCourses: -1,
        maxTeachers: -1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return NextResponse.json({ plans: subscriptionPlans });
  } catch (error) {
    console.error('Error fetching subscription plans:');
    return NextResponse.json(
      { error: 'Failed to fetch subscription plans' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, price, currency, billingCycle, features, maxStudents, maxCourses, maxTeachers, maxLiveClasses, attendanceQuota, enrollmentQuota } = body;

    // Try to save to database first
    try {
      const subscriptionPlan = await prisma.subscriptionPlan.create({
        data: {
          name,
          description,
          price,
          currency,
          billingCycle,
          features,
          maxStudents,
          maxCourses,
          maxTeachers,
          maxLiveClasses,
          attendanceQuota,
          enrollmentQuota,
          isActive: true,
        }
      });

      return NextResponse.json(subscriptionPlan);
    } catch (dbError) {
      console.log('Database not available, using fallback');
      
      // Fallback: return mock data
      const subscriptionPlan = {
        id: `plan-${Date.now()}`,
        name,
        description,
        price,
        currency,
        billingCycle,
        features,
        maxStudents,
        maxCourses,
        maxTeachers,
        maxLiveClasses,
        attendanceQuota,
        enrollmentQuota,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json(subscriptionPlan);
    }
  } catch (error) {
    console.error('Error creating subscription plan:');
    return NextResponse.json(
      { error: 'Failed to create subscription plan' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, description, price, currency, billingCycle, features, maxStudents, maxCourses, maxTeachers, maxLiveClasses, attendanceQuota, enrollmentQuota, isActive } = body;

    // Try to update in database first
    try {
      const subscriptionPlan = await prisma.subscriptionPlan.update({
        where: { id },
        data: {
          name,
          description,
          price,
          currency,
          billingCycle,
          features,
          maxStudents,
          maxCourses,
          maxTeachers,
          maxLiveClasses,
          attendanceQuota,
          enrollmentQuota,
          isActive,
          updatedAt: new Date(),
        }
      });

      return NextResponse.json(subscriptionPlan);
    } catch (dbError) {
      console.log('Database not available, using fallback');
      
      // Fallback: return mock data
      const subscriptionPlan = {
        id,
        name,
        description,
        price,
        currency,
        billingCycle,
        features,
        maxStudents,
        maxCourses,
        maxTeachers,
        maxLiveClasses,
        attendanceQuota,
        enrollmentQuota,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return NextResponse.json(subscriptionPlan);
    }
  } catch (error) {
    console.error('Error updating subscription plan:');
    return NextResponse.json(
      { error: 'Failed to update subscription plan' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Try to delete from database first
    try {
      await prisma.subscriptionPlan.delete({
        where: { id }
      });

      return NextResponse.json({ success: true });
    } catch (dbError) {
      console.log('Database not available, using fallback');
      
      // Fallback: return success
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting subscription plan:');
    return NextResponse.json(
      { error: 'Failed to delete subscription plan' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 