import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const isDefault = searchParams.get('isDefault');
    const createdBy = searchParams.get('createdBy');
    const itemId = searchParams.get('itemId');

    const where: any = {};
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }
    
    if (isDefault !== null) {
      where.isDefault = isDefault === 'true';
    }
    
    if (createdBy) {
      where.createdBy = createdBy;
    }
    
    if (itemId) {
      where.itemId = itemId;
    }

    const configs = await prisma.designConfig.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    console.log('📤 API returning configs:', configs.map(config => ({
      itemId: config.itemId,
      titleColor: config.titleColor,
      descriptionColor: config.descriptionColor,
      backgroundType: config.backgroundType
    })));

    return NextResponse.json({ configs });
  } catch (error) {
    console.error('Error fetching design configs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    console.log('🔄 Creating design config with data:', {
      name,
      description,
      itemId,
      titleColor,
      descriptionColor,
      titleAlignment,
      descriptionAlignment
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
          isActive: true
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
          isActive: true
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
