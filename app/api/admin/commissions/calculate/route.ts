import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AutomatedCommissionService } from '@/lib/automated-commission-service';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { paymentId, recalculateAll, startDate, endDate, institutionId } = await request.json();

    let results;

    if (paymentId) {
      // Calculate commission for specific payment
      const calculation = await AutomatedCommissionService.calculateCommissionForPayment(paymentId);
      results = [calculation];
    } else if (recalculateAll) {
      // Calculate commissions for all pending payments
      results = await AutomatedCommissionService.calculatePendingCommissions();
    } else if (startDate && endDate) {
      // Recalculate commissions for a date range
      results = await AutomatedCommissionService.recalculateCommissions(
        new Date(startDate),
        new Date(endDate),
        institutionId
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid parameters. Provide paymentId, recalculateAll, or date range' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      calculations: results,
      count: results.length,
      totalCommission: results.reduce((sum, calc) => sum + calc.commissionAmount, 0)
    });
  } catch (error) {
    console.error('Error calculating commissions:');
    return NextResponse.json(
      { error: 'Failed to calculate commissions' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const institutionId = searchParams.get('institutionId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!institutionId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: institutionId, startDate, endDate' },
        { status: 400 }
      );
    }

    const summary = await AutomatedCommissionService.getCommissionSummary(
      institutionId,
      new Date(startDate),
      new Date(endDate)
    );

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting commission summary:');
    return NextResponse.json(
      { error: 'Failed to get commission summary' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 