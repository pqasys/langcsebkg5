import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { rules } = await request.json();
    const courseId = params.id;

    // Verify the course exists and belongs to the institution
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        institution: {
          user: {
            some: {
              id: session.user.id
            }
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Delete existing rules
    await prisma.coursePricingRule.deleteMany({
      where: {
        courseId
      }
    });

    // Create new rules
    const pricingRules = await prisma.coursePricingRule.createMany({
      data: rules.map((rule: unknown) => ({
        id: uuidv4(),
        courseId,
        startDate: new Date(rule.startDate),
        endDate: new Date(rule.endDate),
        price: rule.price
      }))
    });

    return NextResponse.json({ success: true, count: pricingRules.count });
  } catch (error) {
    console.error('Error saving pricing rules:');
    return NextResponse.json(
      { error: 'Failed to save pricing rules' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const courseId = params.id;

    const rules = await prisma.coursePricingRule.findMany({
      where: {
        courseId
      },
      orderBy: {
        startDate: 'asc'
      }
    });

    return NextResponse.json(rules);
  } catch (error) {
    console.error('Error fetching pricing rules:');
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 