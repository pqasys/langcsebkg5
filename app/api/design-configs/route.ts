import { NextRequest, NextResponse } from 'next/server';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is active
    if (session.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    // For institution users, check if their institution is approved and active
    if (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: session.user.institutionId },
        select: { isApproved: true, status: true }
      });

      if (!institution || !institution.isApproved || institution.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Institution is not approved or active' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const isDefault = searchParams.get('isDefault');
    const createdBy = searchParams.get('createdBy');
    const itemId = searchParams.get('itemId');
    const includeAdminDesigns = searchParams.get('includeAdminDesigns');

    // Build where clause for user's own designs
    const userWhere: any = {};
    
    if (isActive !== null) {
      userWhere.isActive = isActive === 'true';
    }
    
    if (isDefault !== null) {
      userWhere.isDefault = isDefault === 'true';
    }
    
    if (createdBy) {
      userWhere.createdBy = createdBy;
    } else {
      // If no createdBy specified, get current user's designs
      userWhere.createdBy = session.user.id;
    }
    
    if (itemId) {
      userWhere.itemId = itemId;
    }

    // Get user's own designs
    const userConfigs = await prisma.designConfig.findMany({
      where: userWhere,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    let allConfigs = [...userConfigs];

    // If includeAdminDesigns is true or not specified, also get admin-created and approved designs
    if (includeAdminDesigns !== 'false') {
      // Build where clause for admin designs
      const adminWhere: any = {
        OR: [
          // Admin-created designs (only from active admins)
          { createdBy: { in: await getActiveAdminUserIds() } },
          // Admin-approved designs
          { isApproved: true, approvalStatus: 'APPROVED' }
        ]
      };
      
      if (isActive !== null) {
        adminWhere.isActive = isActive === 'true';
      }
      
      if (isDefault !== null) {
        adminWhere.isDefault = isDefault === 'true';
      }
      
      if (itemId) {
        adminWhere.itemId = itemId;
      }

      // Exclude designs already included from user's own designs
      if (userConfigs.length > 0) {
        const userItemIds = userConfigs.map(config => config.itemId).filter(Boolean);
        if (userItemIds.length > 0) {
          adminWhere.NOT = {
            itemId: { in: userItemIds }
          };
        }
      }

      const adminConfigs = await prisma.designConfig.findMany({
        where: adminWhere,
        orderBy: [
          { isDefault: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      allConfigs = [...userConfigs, ...adminConfigs];
    }

    console.log('📤 API returning configs:', allConfigs.map(config => ({
      itemId: config.itemId,
      titleColor: config.titleColor,
      descriptionColor: config.descriptionColor,
      backgroundType: config.backgroundType,
      createdBy: config.createdBy,
      isApproved: config.isApproved,
      approvalStatus: config.approvalStatus
    })));

    return NextResponse.json({ configs: allConfigs });
  } catch (error) {
    console.error('Error fetching design configs:', error);
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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create design configs
    const userRole = session.user.role;
    if (userRole !== 'ADMIN' && userRole !== 'INSTITUTION_STAFF') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if user is active
    if (session.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    // For institution users, check if their institution is approved and active
    if (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: session.user.institutionId },
        select: { isApproved: true, status: true }
      });

      if (!institution || !institution.isApproved || institution.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Institution is not approved or active' }, { status: 403 });
      }
    }

    const body = await request.json();
    console.log('📥 API received body:', body);
    const {
      name,
      description,
      itemId,
      backgroundType,
      backgroundColor,
      backgroundGradientFrom,
      backgroundGradientTo,
      backgroundGradientDirection,
      backgroundImage,
      backgroundPattern,
      backgroundOpacity,
      titleFont,
      titleSize,
      titleWeight,
      titleColor,
      titleAlignment,
      titleShadow,
      titleShadowColor,
      descriptionFont,
      descriptionSize,
      descriptionColor,
      descriptionAlignment,
      padding,
      borderRadius,
      borderWidth,
      borderColor,
      borderStyle,
      shadow,
      shadowColor,
      shadowBlur,
      shadowOffset,
      hoverEffect,
      animationDuration,
      customCSS,
      isDefault
    } = body;

    // If this is being set as default, unset other defaults
    if (isDefault) {
      await prisma.designConfig.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    // Auto-approve designs created by admins
    const isAdminCreated = userRole === 'ADMIN';
    const autoApproved = isAdminCreated;

    console.log('🔄 Creating design config with data:', {
      name,
      description,
      itemId,
      titleColor,
      descriptionColor,
      titleAlignment,
      descriptionAlignment,
      isAdminCreated,
      autoApproved
    });

    // Check if a configuration already exists for this itemId and user
    const existingConfig = await prisma.designConfig.findFirst({
      where: {
        itemId: itemId,
        createdBy: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    let config;
    if (existingConfig) {
      // Update existing configuration
      console.log('🔄 Updating existing config for itemId:', itemId);
      config = await prisma.designConfig.update({
        where: {
          id: existingConfig.id
        },
        data: {
          name,
          description,
          backgroundType,
          backgroundColor,
          backgroundGradientFrom,
          backgroundGradientTo,
          backgroundGradientDirection,
          backgroundImage,
          backgroundPattern,
          backgroundOpacity,
          titleFont,
          titleSize,
          titleWeight,
          titleColor,
          titleAlignment: titleAlignment, // Already JSON string from frontend
          titleShadow,
          titleShadowColor,
          descriptionFont,
          descriptionSize,
          descriptionColor,
          descriptionAlignment: descriptionAlignment, // Already JSON string from frontend
          padding,
          borderRadius,
          borderWidth,
          borderColor,
          borderStyle,
          shadow,
          shadowColor,
          shadowBlur,
          shadowOffset,
          hoverEffect,
          animationDuration,
          customCSS,
          isDefault,
          isActive: true,
          // Auto-approve admin-created designs
          isApproved: autoApproved,
          approvalStatus: autoApproved ? 'APPROVED' : 'PENDING',
          approvedBy: autoApproved ? session.user.id : null,
          approvedAt: autoApproved ? new Date() : null
        }
      });
    } else {
      // Create new configuration
      console.log('🔄 Creating new config for itemId:', itemId);
      config = await prisma.designConfig.create({
        data: {
          name,
          description,
          itemId,
          backgroundType,
          backgroundColor,
          backgroundGradientFrom,
          backgroundGradientTo,
          backgroundGradientDirection,
          backgroundImage,
          backgroundPattern,
          backgroundOpacity,
          titleFont,
          titleSize,
          titleWeight,
          titleColor,
          titleAlignment: titleAlignment, // Already JSON string from frontend
          titleShadow,
          titleShadowColor,
          descriptionFont,
          descriptionSize,
          descriptionColor,
          descriptionAlignment: descriptionAlignment, // Already JSON string from frontend
          padding,
          borderRadius,
          borderWidth,
          borderColor,
          borderStyle,
          shadow,
          shadowColor,
          shadowBlur,
          shadowOffset,
          hoverEffect,
          animationDuration,
          customCSS,
          isDefault,
          createdBy: session.user.id,
          isActive: true,
          // Auto-approve admin-created designs
          isApproved: autoApproved,
          approvalStatus: autoApproved ? 'APPROVED' : 'PENDING',
          approvedBy: autoApproved ? session.user.id : null,
          approvedAt: autoApproved ? new Date() : null
        }
      });
    }

    return NextResponse.json({ config }, { status: 201 });
  } catch (error) {
    console.error('Error creating design config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is active
    if (session.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    // For institution users, check if their institution is approved and active
    if (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: session.user.institutionId },
        select: { isApproved: true, status: true }
      });

      if (!institution || !institution.isApproved || institution.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Institution is not approved or active' }, { status: 403 });
      }
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const createdBy = searchParams.get('createdBy');

    // Build where clause
    const where: any = {};
    
    if (itemId) {
      where.itemId = itemId;
    }
    
    if (createdBy) {
      where.createdBy = createdBy;
    } else {
      // If no createdBy specified, only allow deletion of user's own configs
      where.createdBy = session.user.id;
    }

    // Ensure user can only delete their own configs unless they're admin
    if (session.user.role !== 'ADMIN') {
      where.createdBy = session.user.id;
    }

    const deletedConfigs = await prisma.designConfig.deleteMany({
      where
    });

    return NextResponse.json({ 
      message: `Deleted ${deletedConfigs.count} design configuration(s)`,
      deletedCount: deletedConfigs.count 
    });
  } catch (error) {
    console.error('Error deleting design configs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can approve designs
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Check if user is active
    if (session.user.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Account is not active' }, { status: 403 });
    }

    // For institution users, check if their institution is approved and active
    if (session.user.role === 'INSTITUTION_STAFF' && session.user.institutionId) {
      const institution = await prisma.institution.findUnique({
        where: { id: session.user.institutionId },
        select: { isApproved: true, status: true }
      });

      if (!institution || !institution.isApproved || institution.status !== 'ACTIVE') {
        return NextResponse.json({ error: 'Institution is not approved or active' }, { status: 403 });
      }
    }

    const body = await request.json();
    const { id, isApproved, approvalStatus, approvalNotes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Design config ID is required' }, { status: 400 });
    }

    // Update the design config approval status
    const updatedConfig = await prisma.designConfig.update({
      where: { id },
      data: {
        isApproved: isApproved ?? false,
        approvalStatus: approvalStatus || (isApproved ? 'APPROVED' : 'REJECTED'),
        approvedBy: session.user.id,
        approvedAt: new Date(),
        approvalNotes: approvalNotes || null
      }
    });

    console.log('✅ Design config approved:', {
      id: updatedConfig.id,
      isApproved: updatedConfig.isApproved,
      approvalStatus: updatedConfig.approvalStatus,
      approvedBy: updatedConfig.approvedBy
    });

    return NextResponse.json({ 
      config: updatedConfig,
      message: `Design config ${isApproved ? 'approved' : 'rejected'} successfully`
    });
  } catch (error) {
    console.error('Error updating design config approval:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
