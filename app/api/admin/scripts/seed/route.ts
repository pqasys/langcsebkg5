import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { exec } from 'child_process'
import { promisify } from 'util'
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

    // Run the seed script
    const { stdout, stderr } = await execAsync('npx prisma db seed')

    if (stderr) {
      console.error('Seed script error:', stderr)
      return NextResponse.json(
        { error: 'Failed to run seed script', details: stderr },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Seed script executed successfully',
      output: stdout
    })
  } catch (error) {
    console.error('Error running seed script:', error)
    return NextResponse.json(
      { error: 'Failed to run seed script', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 