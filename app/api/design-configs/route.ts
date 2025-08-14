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

    const configs = await prisma.designConfig.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

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
    const {
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

    const config = await prisma.designConfig.create({
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
        isDefault,
        createdBy: session.user.id,
        isActive: true
      }
    });

    return NextResponse.json({ config }, { status: 201 });
  } catch (error) {
    console.error('Error creating design config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
