import { NextRequest, NextResponse } from 'next/server';
import { CertificateServiceSecure } from '@/lib/services/certificate-service-secure';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Fetch public certificate statistics (no authentication required)
    const publicStats = await CertificateServiceSecure.getPublicCertificateStats();
    
    return NextResponse.json({
      success: true,
      data: publicStats,
      message: 'Public certificate statistics retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching public certificate stats:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch public certificate statistics',
      message: 'Unable to retrieve public certificate statistics at this time'
    }, { status: 500 });
  }
}
