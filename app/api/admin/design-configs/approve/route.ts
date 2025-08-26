import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { designConfigId, action, notes } = await request.json();

    if (!designConfigId || !action) {
      return NextResponse.json(
        { error: 'Design config ID and action are required' },
        { status: 400 }
      );
    }

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be APPROVE or REJECT' },
        { status: 400 }
      );
    }

    // Check if design config exists
    const designConfig = await prisma.designConfig.findUnique({
      where: { id: designConfigId },
      include: {
        promotionalItems: true,
        advertisingItems: true
      }
    });

    if (!designConfig) {
      return NextResponse.json(
        { error: 'Design configuration not found' },
        { status: 404 }
      );
    }

    // Update the design config with approval status
    const updatedConfig = await prisma.designConfig.update({
      where: { id: designConfigId },
      data: {
        isApproved: action === 'APPROVE',
        approvedBy: action === 'APPROVE' ? session.user.id : null,
        approvedAt: action === 'APPROVE' ? new Date() : null,
        approvalStatus: action,
        approvalNotes: notes || null
      }
    });

    // If approved, also update related promotional and advertising items
    if (action === 'APPROVE') {
      await prisma.promotionalItem.updateMany({
        where: { designConfigId },
        data: { isActive: true }
      });

      await prisma.advertisingItem.updateMany({
        where: { designConfigId },
        data: { isApproved: true }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Design configuration ${action.toLowerCase()}d successfully`,
      designConfig: updatedConfig
    });

  } catch (error) {
    console.error('Error approving design config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';

    // Get design configs pending approval
    const designConfigs = await prisma.designConfig.findMany({
      where: {
        approvalStatus: status,
        isActive: true
      },
      include: {
        promotionalItems: true,
        advertisingItems: true,
        _count: {
          select: {
            promotionalItems: true,
            advertisingItems: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      designConfigs
    });

  } catch (error) {
    console.error('Error fetching design configs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
