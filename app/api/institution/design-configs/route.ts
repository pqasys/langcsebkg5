import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an institution user
    if (!session?.user || session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { error: 'Unauthorized. Institution access required.' },
        { status: 401 }
      );
    }

    // Check if institution is approved
    if (!session.user.institutionApproved) {
      return NextResponse.json(
        { error: 'Your institution account is pending approval.' },
        { status: 403 }
      );
    }

    const { name, description, config, promotionalItemId, advertisingItemId } = await request.json();

    if (!name || !config) {
      return NextResponse.json(
        { error: 'Name and configuration are required' },
        { status: 400 }
      );
    }

    // Create the design configuration with pending approval status
    const designConfig = await prisma.designConfig.create({
      data: {
        name,
        description,
        // Background settings
        backgroundType: config.backgroundType || 'solid',
        backgroundColor: config.backgroundColor || '#ffffff',
        backgroundGradientFrom: config.backgroundGradient?.from || '#667eea',
        backgroundGradientTo: config.backgroundGradient?.to || '#764ba2',
        backgroundGradientDirection: config.backgroundGradient?.direction || 'to-r',
        backgroundImage: config.backgroundImage || null,
        backgroundPattern: config.backgroundPattern || 'none',
        backgroundOpacity: config.backgroundOpacity || 100,
        
        // Typography settings
        titleFont: config.titleFont || 'inter',
        titleSize: config.titleSize || 16,
        titleWeight: config.titleWeight || 'semibold',
        titleColor: config.titleColor || '#1f2937',
        titleAlignment: config.titleAlignment?.horizontal || 'left',
        titleShadow: config.titleShadow || false,
        titleShadowColor: config.titleShadowColor || '#000000',
        
        descriptionFont: config.descriptionFont || 'inter',
        descriptionSize: config.descriptionSize || 14,
        descriptionColor: config.descriptionColor || '#6b7280',
        descriptionAlignment: config.descriptionAlignment?.horizontal || 'left',
        
        // Layout settings
        padding: config.padding || 16,
        borderRadius: config.borderRadius || 8,
        borderWidth: config.borderWidth || 1,
        borderColor: config.borderColor || '#e5e7eb',
        borderStyle: config.borderStyle || 'solid',
        
        // Effects settings
        shadow: config.shadow || true,
        shadowColor: config.shadowColor || 'rgba(0, 0, 0, 0.1)',
        shadowBlur: config.shadowBlur || 10,
        shadowOffset: config.shadowOffset || 4,
        
        // Animation settings
        hoverEffect: config.hoverEffect || 'scale',
        animationDuration: config.animationDuration || 300,
        
        // Custom CSS
        customCSS: config.customCSS || null,
        
        // Metadata
        createdBy: session.user.id,
        isActive: true,
        isDefault: false,
        
        // Approval workflow - starts as pending
        isApproved: false,
        approvalStatus: 'PENDING'
      }
    });

    // If a promotional item ID is provided, link it to this design config
    if (promotionalItemId) {
      await prisma.promotionalItem.update({
        where: { id: promotionalItemId },
        data: { designConfigId: designConfig.id }
      });
    }

    // If an advertising item ID is provided, link it to this design config
    if (advertisingItemId) {
      await prisma.advertisingItem.update({
        where: { id: advertisingItemId },
        data: { designConfigId: designConfig.id }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Design configuration saved and submitted for approval',
      designConfig
    });

  } catch (error) {
    console.error('Error saving design config:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an institution user
    if (!session?.user || session.user.role !== 'INSTITUTION') {
      return NextResponse.json(
        { error: 'Unauthorized. Institution access required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    // Build where clause
    const whereClause: any = {
      createdBy: session.user.id,
      isActive: true
    };

    if (status !== 'all') {
      whereClause.approvalStatus = status;
    }

    // Get design configs for this institution
    const designConfigs = await prisma.designConfig.findMany({
      where: whereClause,
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
