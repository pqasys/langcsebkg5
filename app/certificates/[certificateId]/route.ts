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

    // Generate the PDF
    const pdfBuffer = await FluentShipCertificateGeneratorSecure.generateCertificate({
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

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="certificate-${certificateId}.pdf"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

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
