import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const isDefault = searchParams.get('isDefault');

    // Build where clause for public designs
    const publicWhere: any = {
      OR: [
        // Admin-created designs (only from active admins)
        { createdBy: { in: await getActiveAdminUserIds() } },
        // Admin-approved designs from all users (including institution users)
        { 
          isApproved: true, 
          approvalStatus: 'APPROVED',
          isActive: true
        }
      ]
    };
    
    if (isActive !== null) {
      publicWhere.isActive = isActive === 'true';
    }
    
    if (isDefault !== null) {
      publicWhere.isDefault = isDefault === 'true';
    }

    // Get public design configs
    const publicConfigs = await prisma.designConfig.findMany({
      where: publicWhere,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log('📤 Public API returning configs:', publicConfigs.map(config => ({
      name: config.name,
      titleColor: config.titleColor,
      descriptionColor: config.descriptionColor,
      backgroundType: config.backgroundType,
      createdBy: config.createdBy,
      isActive: config.isActive,
      isDefault: config.isDefault,
      isApproved: config.isApproved,
      approvalStatus: config.approvalStatus,
      approvedBy: config.approvedBy
    })));

    return NextResponse.json({ configs: publicConfigs });
  } catch (error) {
    console.error('Error fetching public design configs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get active admin user IDs
async function getActiveAdminUserIds(): Promise<string[]> {
  try {
    const adminUsers = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
        status: 'ACTIVE'
      },
      select: {
        id: true
      }
    });
    return adminUsers.map(user => user.id);
  } catch (error) {
    console.error('Error fetching admin user IDs:', error);
    return [];
  }
}
