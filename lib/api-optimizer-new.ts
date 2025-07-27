import { NextResponse } from "next/server";
import { zlib } from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);

// Simple compression wrapper for NextResponse
export async function compressResponse(response: NextResponse): Promise<NextResponse> {
  const responseBody = await response.text();
  
  // Only compress if response is large enough and is JSON
  if (responseBody.length > 1024 && response.headers.get('content-type')?.includes('application/json')) {
    try {
      const compressed = await gzip(responseBody);
      const compressedResponse = new NextResponse(compressed, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers.entries()),
          'Content-Type': 'application/json+gzip',
          'Content-Encoding': 'gzip',
          'Content-Length': compressed.length.toString()
        }
      });
      return compressedResponse;
    } catch (error) {
    console.error('Error occurred:', error);
      // // // console.warn('Compression failed, returning original response:', error);
    }
  }
  
  return response;
} 