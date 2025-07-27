import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // This endpoint is used to initialize the WebSocket server
    // The actual WebSocket connection is handled by the socket.io server
    return NextResponse.json({ 
      status: 'ok', 
      message: 'WebSocket server ready',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Socket API error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize WebSocket server' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 