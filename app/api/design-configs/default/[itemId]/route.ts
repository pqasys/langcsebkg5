import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const { itemId } = params;

    // Find the default config for this item
    const defaultConfig = await prisma.designConfig.findFirst({
      where: {
        itemId: itemId,
        isDefault: true,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!defaultConfig) {
      return NextResponse.json(
        { error: 'Default config not found for this item' },
        { status: 404 }
      );
    }

    // Transform the database config to DesignConfig format
    const transformedConfig = {
      backgroundType: defaultConfig.backgroundType,
      backgroundColor: defaultConfig.backgroundColor,
      backgroundGradient: {
        from: defaultConfig.backgroundGradientFrom,
        to: defaultConfig.backgroundGradientTo,
        direction: defaultConfig.backgroundGradientDirection,
      },
      backgroundImage: defaultConfig.backgroundImage || '',
      backgroundPattern: defaultConfig.backgroundPattern,
      backgroundOpacity: defaultConfig.backgroundOpacity,
      titleFont: defaultConfig.titleFont,
      titleSize: defaultConfig.titleSize,
      titleWeight: defaultConfig.titleWeight,
      titleColor: defaultConfig.titleColor,
      titleAlignment: defaultConfig.titleAlignment ? JSON.parse(defaultConfig.titleAlignment as string) : {
        horizontal: 'left',
        vertical: 'top',
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      },
      titleShadow: defaultConfig.titleShadow,
      titleShadowColor: defaultConfig.titleShadowColor,
      descriptionFont: defaultConfig.descriptionFont,
      descriptionSize: defaultConfig.descriptionSize,
      descriptionColor: defaultConfig.descriptionColor,
      descriptionAlignment: defaultConfig.descriptionAlignment ? JSON.parse(defaultConfig.descriptionAlignment as string) : {
        horizontal: 'left',
        vertical: 'top',
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      },
      padding: defaultConfig.padding,
      borderRadius: defaultConfig.borderRadius,
      borderWidth: defaultConfig.borderWidth,
      borderColor: defaultConfig.borderColor,
      borderStyle: defaultConfig.borderStyle,
      shadow: defaultConfig.shadow,
      shadowColor: defaultConfig.shadowColor,
      shadowBlur: defaultConfig.shadowBlur,
      shadowOffset: defaultConfig.shadowOffset,
      hoverEffect: defaultConfig.hoverEffect,
      animationDuration: defaultConfig.animationDuration,
      customCSS: defaultConfig.customCSS || ''
    };

    return NextResponse.json(transformedConfig);
  } catch (error) {
    console.error('Error fetching default design config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch default design config' },
      { status: 500 }
    );
  }
}
