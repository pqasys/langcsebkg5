import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's notification preferences
    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: session.user.id },
      include: {
        template: {
          select: {
            name: true,
            category: true,
            title: true
          }
        }
      }
    });

    // If no preferences exist, create default ones
    if (preferences.length === 0) {
      const templates = await prisma.notificationTemplate.findMany({
        where: { isDefault: true }
      });

      const defaultPreferences = templates.map(template => ({
        userId: session.user.id,
        templateId: template.id,
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        frequency: 'IMMEDIATE'
      }));

      await prisma.notificationPreference.createMany({
        data: defaultPreferences
      });

      // Fetch the newly created preferences
      const newPreferences = await prisma.notificationPreference.findMany({
        where: { userId: session.user.id },
        include: {
          template: {
            select: {
              name: true,
              category: true,
              title: true
            }
          }
        }
      });

      return NextResponse.json({ preferences: newPreferences });
    }

    return NextResponse.json({ preferences });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notification preferences' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { preferences } = await request.json();

    if (!preferences || !Array.isArray(preferences)) {
      return NextResponse.json(
        { error: 'Invalid preferences data' },
        { status: 400 }
      );
    }

    // Update preferences in a transaction
    const results = await prisma.$transaction(
      preferences.map(pref => 
        prisma.notificationPreference.upsert({
          where: {
            userId_templateId: {
              userId: session.user.id,
              templateId: pref.templateId
            }
          },
          update: {
            emailEnabled: pref.emailEnabled,
            pushEnabled: pref.pushEnabled,
            smsEnabled: pref.smsEnabled,
            frequency: pref.frequency,
            updatedAt: new Date()
          },
          create: {
            userId: session.user.id,
            templateId: pref.templateId,
            emailEnabled: pref.emailEnabled,
            pushEnabled: pref.pushEnabled,
            smsEnabled: pref.smsEnabled,
            frequency: pref.frequency
          }
        })
      )
    );

    return NextResponse.json({
      message: 'Notification preferences updated successfully',
      updatedCount: results.length
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, templateIds } = await request.json();

    if (!action || !templateIds || !Array.isArray(templateIds)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    let updateData: unknown = {};

    switch (action) {
      case 'enable_all':
        updateData = {
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: false
        };
        break;
      case 'disable_all':
        updateData = {
          emailEnabled: false,
          pushEnabled: false,
          smsEnabled: false
        };
        break;
      case 'enable_email':
        updateData = { emailEnabled: true };
        break;
      case 'disable_email':
        updateData = { emailEnabled: false };
        break;
      case 'enable_push':
        updateData = { pushEnabled: true };
        break;
      case 'disable_push':
        updateData = { pushEnabled: false };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const result = await prisma.notificationPreference.updateMany({
      where: {
        userId: session.user.id,
        templateId: { in: templateIds }
      },
      data: updateData
    });

    return NextResponse.json({
      message: `Successfully updated ${result.count} preferences`,
      updatedCount: result.count
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update notification preferences' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 