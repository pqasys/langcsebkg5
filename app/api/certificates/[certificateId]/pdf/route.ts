import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { CertificateServiceSecure } from '@/lib/services/certificate-service-secure';
import { FluentShipCertificateGeneratorSecure } from '@/lib/certificate-generator-secure';
import { PDFConverter } from '@/lib/pdf-converter';

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

    // Check if the user owns this certificate or if it's public
    if (certificate.userId !== session.user.id && !certificate.isPublic) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
      // Generate certificate HTML
      const certificateHTML = await FluentShipCertificateGeneratorSecure.generateCertificate({
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

             // Convert HTML to PDF with better error handling
       const htmlString = certificateHTML.toString('utf-8');
       const pdfBuffer = await PDFConverter.certificateToPDF(htmlString);

      // Return the PDF
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="FluentShip_Certificate_${certificateId}.pdf"`,
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } catch (pdfError) {
      console.error('Error generating certificate PDF:', pdfError);
      
      return NextResponse.json({
        error: 'PDF generation failed',
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
        message: 'Certificate data is available but PDF generation failed. Please try again later.'
      }, { status: 200 });
    }

  } catch (error) {
    console.error('Error serving certificate PDF:', error);
    
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
