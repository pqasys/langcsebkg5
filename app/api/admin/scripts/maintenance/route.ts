import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Paths to scripts
    const auditScript = path.join(process.cwd(), 'scripts', 'audit-fix-booking-payment-consistency.ts');
    const cleanupScript = path.join(process.cwd(), 'scripts', 'cleanup-orphaned-enrollments.ts');

    // Run the audit/fix script
    const { stdout: auditOut, stderr: auditErr } = await execAsync(`npx tsx "${auditScript}"`, {
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes
    });
    // Run the orphaned enrollments cleanup script with --cleanup
    const { stdout: cleanupOut, stderr: cleanupErr } = await execAsync(`npx tsx "${cleanupScript}" --cleanup`, {
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes
    });

    // Combine logs and parse summaries
    const auditOutput = auditOut + auditErr;
    const cleanupOutput = cleanupOut + cleanupErr;

    // Parse audit summary
    const auditMatch = auditOutput.match(/📈 Audit\/Fix Summary:[\s\S]*?Total bookings checked: (\d+)[\s\S]*?Fixed inconsistencies: (\d+)[\s\S]*?Errors encountered: (\d+)/);
    let auditResults = {
      totalBookings: 0,
      fixedInconsistencies: 0,
      errors: 0,
      log: auditOutput
    };
    if (auditMatch) {
      auditResults = {
        totalBookings: parseInt(auditMatch[1]),
        fixedInconsistencies: parseInt(auditMatch[2]),
        errors: parseInt(auditMatch[3]),
        log: auditOutput
      };
    }

    // Parse cleanup summary
    const cleanupMatch = cleanupOutput.match(/Orphaned enrollments found: (\d+)[\s\S]*?Successfully cleaned: (\d+)[\s\S]*?Cleanup errors: (\d+)/);
    let cleanupResults = {
      orphanedFound: 0,
      cleaned: 0,
      errors: 0,
      log: cleanupOutput
    };
    if (cleanupMatch) {
      cleanupResults = {
        orphanedFound: parseInt(cleanupMatch[1]),
        cleaned: parseInt(cleanupMatch[2]),
        errors: parseInt(cleanupMatch[3]),
        log: cleanupOutput
      };
    }

    return NextResponse.json({
      message: 'All maintenance scripts executed successfully',
      auditResults,
      cleanupResults,
      combinedLog: auditOutput + '\n\n' + cleanupOutput
    });
  } catch (error) {
    console.error('Error running maintenance scripts:');
    return NextResponse.json(
      { error: 'Failed to run maintenance scripts', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 