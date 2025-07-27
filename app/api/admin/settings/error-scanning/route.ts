import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, scriptType } = body;

    if (!action || !scriptType) {
      return NextResponse.json({ 
        error: 'Missing required parameters: action and scriptType' 
      }, { status: 400 });
    }

    let scriptPath = '';
    let scriptName = '';

    switch (scriptType) {
      case 'common-errors':
        scriptPath = 'scripts/fix-common-errors.ts';
        scriptName = 'Common Errors Fix';
        break;
      case 'specific-errors':
        scriptPath = 'scripts/fix-specific-errors.ts';
        scriptName = 'Specific Errors Fix';
        break;
      case 'critical-errors':
        scriptPath = 'scripts/fix-critical-errors.ts';
        scriptName = 'Critical Errors Fix';
        break;
      case 'scan-errors':
        scriptPath = 'scripts/scan-errors.ts';
        scriptName = 'Error Scanner';
        break;
      default:
        return NextResponse.json({ 
          error: 'Invalid script type. Must be one of: common-errors, specific-errors, critical-errors, scan-errors' 
        }, { status: 400 });
    }

    if (action === 'run') {
      try {
        // // // // // // console.log(`Running ${scriptName}...`);
        
        // Run the script using tsx for TypeScript execution
        const { stdout, stderr } = await execAsync(`npx tsx ${scriptPath}`, {
          cwd: process.cwd(),
          timeout: 300000, // 5 minutes timeout
          env: {
            ...process.env,
            NODE_ENV: 'development'
          }
        });

        if (stderr && !stderr.includes('Warning')) {
          console.error(`Error running ${scriptName}:`, stderr);
          return NextResponse.json({
            success: false,
            error: `Script execution failed: ${stderr}`,
            scriptName
          }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
        }

        console.log(`${scriptName} completed successfully:`, stdout);
        
        return NextResponse.json({
          success: true,
          message: `${scriptName} completed successfully`,
          output: stdout,
          scriptName
        });

      } catch (execError: unknown) {
        console.error(`Error executing ${scriptName}:`, execError);
        
        return NextResponse.json({
          success: false,
          error: `Script execution failed: ${execError.message}`,
          scriptName,
          details: execError.stderr || execError.message
        }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
      }
    } else if (action === 'status') {
      // Check if script exists
      const fs = require('fs');
      const path = require('path');
      
      const fullPath = path.join(process.cwd(), scriptPath);
      const exists = fs.existsSync(fullPath);
      
      return NextResponse.json({
        success: true,
        scriptExists: exists,
        scriptPath: fullPath,
        scriptName
      });
    } else {
      return NextResponse.json({ 
        error: 'Invalid action. Must be "run" or "status"' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in error scanning API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return available scripts
    const scripts = [
      {
        id: 'scan-errors',
        name: 'Error Scanner',
        description: 'Scan the entire codebase for common error patterns',
        path: 'scripts/scan-errors.ts',
        category: 'scanning'
      },
      {
        id: 'common-errors',
        name: 'Common Errors Fix',
        description: 'Fix common error patterns like missing imports and undefined variables',
        path: 'scripts/fix-common-errors.ts',
        category: 'fixing'
      },
      {
        id: 'specific-errors',
        name: 'Specific Errors Fix',
        description: 'Fix specific error patterns like API route issues and component errors',
        path: 'scripts/fix-specific-errors.ts',
        category: 'fixing'
      },
      {
        id: 'critical-errors',
        name: 'Critical Errors Fix',
        description: 'Fix critical error patterns that could break the application',
        path: 'scripts/fix-critical-errors.ts',
        category: 'fixing'
      }
    ];

    return NextResponse.json({
      success: true,
      scripts
    });

  } catch (error) {
    console.error('Error getting available scripts:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
  }
} 