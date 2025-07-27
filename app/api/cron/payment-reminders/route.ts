import { NextResponse } from 'next/server';
import { ReminderScheduler } from '@/lib/payment/reminder-scheduler';

// This route should be called by a cron job service (e.g., Vercel Cron Jobs)
export async function GET(request: Request) {
  try {
    // Verify the request is from an authorized source
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Process payment reminders
    const result = await ReminderScheduler.processPaymentReminders();

    return NextResponse.json({
      success: true,
      message: `Processed ${result.remindersSent} payment reminders`,
      data: result,
    });
  } catch (error) {
    console.error('Error processing payment reminders:');
    return NextResponse.json(
      { 
        error: 'Failed to process payment reminders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 