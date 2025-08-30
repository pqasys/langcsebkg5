import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateServiceSecure } from '@/lib/services/certificate-service-secure';
import { FluentShipCertificateGeneratorSecure } from '@/lib/certificate-generator-secure';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { certificateId } = params;

    // Get the certificate data
    const certificate = await CertificateServiceSecure.getCertificateById(certificateId);
    
    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Check if the user owns this certificate
    if (certificate.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Try to get the stored certificate data first (currently disabled)
    // const certificateWithData = await CertificateServiceSecure.getCertificateById(certificateId, true);
    
    // if (certificateWithData?.certificateData) {
    //   // Return the stored certificate data
    //   const certificateBuffer = Buffer.from(certificateWithData.certificateData, 'base64');
    //   return new NextResponse(certificateBuffer, {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'text/html',
    //       'Content-Disposition': `inline; filename="certificate-${certificateId}.html"`,
    //       'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    //     },
    //   });
    // }

    // Fallback: Generate certificate on-demand if not stored
    try {
      const certificateBuffer = await FluentShipCertificateGeneratorSecure.generateCertificate({
        userName: certificate.user.name || 'Student',
        language: certificate.language,
        languageName: certificate.languageName,
        cefrLevel: certificate.cefrLevel,
        score: certificate.score,
        totalQuestions: certificate.totalQuestions,
        completionDate: certificate.completionDate.toLocaleDateString(),
        certificateId: certificate.certificateId,
        testType: 'proficiency'
      });

      // Return the HTML certificate as a response
      return new NextResponse(certificateBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'text/html',
          'Content-Disposition': `inline; filename="certificate-${certificateId}.html"`,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } catch (pdfError) {
      console.error('Error generating certificate:', pdfError);
      
      // Return a fallback response with certificate data
      return NextResponse.json({
        error: 'Certificate generation failed',
        certificate: {
          id: certificate.id,
          certificateId: certificate.certificateId,
          userName: certificate.user.name,
          language: certificate.language,
          languageName: certificate.languageName,
          cefrLevel: certificate.cefrLevel,
          score: certificate.score,
          totalQuestions: certificate.totalQuestions,
          percentage: Math.round((certificate.score / certificate.totalQuestions) * 100),
          completionDate: certificate.completionDate,
        },
        message: 'Certificate data is available but generation failed. Please try again later.'
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error serving certificate PDF:', error);
    
    // Provide more detailed error information for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error details:', {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      certificateId: params.certificateId
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate certificate PDF',
        details: errorMessage,
        certificateId: params.certificateId
      },
      { status: 500 }
    );
  }
}
