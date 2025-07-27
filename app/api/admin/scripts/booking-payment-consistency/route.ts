import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { logger, logError } from '../../../../../lib/logger';

const execAsync = promisify(exec)

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get the script path
    const scriptPath = path.join(process.cwd(), 'scripts', 'audit-fix-booking-payment-consistency.ts')

    // Run the booking payment consistency script
    const { stdout, stderr } = await execAsync(`npx tsx "${scriptPath}"`, {
      cwd: process.cwd(),
      timeout: 300000 // 5 minutes timeout
    })

    if (stderr && !stderr.includes('✅')) {
      console.error('Booking payment consistency script error:', stderr)
      return NextResponse.json(
        { error: 'Failed to run booking payment consistency script', details: stderr },
        { status: 500 }
      )
    }

    // Parse the output to extract results
    const output = stdout + stderr
    const summaryMatch = output.match(/📈 Audit\/Fix Summary:[\s\S]*?Total bookings checked: (\d+)[\s\S]*?Fixed inconsistencies: (\d+)[\s\S]*?Errors encountered: (\d+)/)
    
    let results = {
      totalBookings: 0,
      fixedInconsistencies: 0,
      errors: 0,
      log: output
    }

    if (summaryMatch) {
      results = {
        totalBookings: parseInt(summaryMatch[1]),
        fixedInconsistencies: parseInt(summaryMatch[2]),
        errors: parseInt(summaryMatch[3]),
        log: output
      }
    }

    return NextResponse.json({
      message: 'Booking payment consistency script executed successfully',
      results,
      output
    })
  } catch (error) {
    console.error('Error running booking payment consistency script:', error)
    return NextResponse.json(
      { error: 'Failed to run booking payment consistency script', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 