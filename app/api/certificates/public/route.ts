import { NextRequest, NextResponse } from 'next/server';
import { CertificateServiceSecure } from '@/lib/services/certificate-service-secure';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch public certificates (no authentication required)
    const publicCertificates = await CertificateServiceSecure.getPublicCertificates();
    
    return NextResponse.json({
      success: true,
      data: publicCertificates,
      message: 'Public certificates retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching public certificates:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch public certificates',
      message: 'Unable to retrieve public certificates at this time'
    }, { status: 500 });
  }
}
