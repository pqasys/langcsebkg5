import { NextResponse } from 'next/server';
import { ReminderScheduler } from '@/lib/payment/reminder-scheduler';
import { isBuildTime } from '@/lib/build-error-handler';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await ReminderScheduler.processPaymentReminders();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Cron job error:');
    return NextResponse.json(
      { error: 'Failed to process reminders' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 