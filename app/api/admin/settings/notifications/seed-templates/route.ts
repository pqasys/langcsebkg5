import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notificationService } from '@/lib/notification';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create default templates and get detailed results
    const result = await notificationService.createDefaultTemplates(session.user.id);

    // Determine appropriate response message
    let message = '';
    if (result.created > 0 && result.skipped > 0) {
      message = `Created ${result.created} new templates and skipped ${result.skipped} existing templates.`;
    } else if (result.created > 0) {
      message = `Successfully created ${result.created} notification templates.`;
    } else if (result.skipped > 0) {
      message = `All ${result.skipped} notification templates already exist. No duplicates created.`;
    } else {
      message = 'No notification templates were processed.';
    }

    return NextResponse.json({
      message,
      details: result
    });
  } catch (error) {
    console.error('Error seeding notification templates:');
    return NextResponse.json(
      { message: 'Failed to seed notification templates' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 