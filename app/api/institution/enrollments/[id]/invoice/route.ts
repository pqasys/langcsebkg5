import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrollment with all necessary details
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        id: params.id,
        course: {
          institutionId: session.user.institutionId,
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Get institution details
    const institution = await prisma.institution.findUnique({
      where: { id: enrollment.course.institutionId },
      select: {
        name: true,
        email: true,
      },
    });

    // Send invoice email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: enrollment.student.email,
      subject: `Invoice for ${enrollment.course.title}`,
      html: `
        <h1>Invoice for ${enrollment.course.title}</h1>
        <p>Dear ${enrollment.student.name},</p>
        <p>Please find attached the invoice for your enrollment in ${enrollment.course.title}.</p>
        <p>Invoice Number: ${enrollment.invoiceNumber}</p>
        <p>Amount: $${enrollment.paymentAmount}</p>
        <p>Due Date: ${new Date(enrollment.startDate).toLocaleDateString()}</p>
        <p>Thank you for choosing ${institution.name}.</p>
      `,
      attachments: [
        {
          filename: `invoice-${enrollment.invoiceNumber}.pdf`,
          content: await generateInvoicePDF(enrollment, institution),
        },
      ],
    });

    return NextResponse.json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error('Error sending invoice:');
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get enrollment with all necessary details
    const enrollment = await prisma.studentCourseEnrollment.findFirst({
      where: {
        id: params.id,
        course: {
          institutionId: session.user.institutionId,
        },
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            institutionId: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Get institution details
    const institution = await prisma.institution.findUnique({
      where: { id: enrollment.course.institutionId },
      select: {
        name: true,
        email: true,
      },
    });

    // Generate PDF
    const pdfBytes = await generateInvoicePDF(enrollment, institution);

    // Return PDF as downloadable file
    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${enrollment.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:');
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

async function generateInvoicePDF(enrollment: unknown, institution: unknown) {
  // Dynamic import to avoid SSR issues
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Add content to PDF
  page.drawText('INVOICE', {
    x: 50,
    y: height - 50,
    size: 24,
    font,
  });

  // Institution details
  page.drawText(`${institution.name}`, {
    x: 50,
    y: height - 100,
    size: fontSize,
    font,
  });

  // Student details
  page.drawText(`Bill To:`, {
    x: 50,
    y: height - 150,
    size: fontSize,
    font,
  });
  page.drawText(`${enrollment.student.name}`, {
    x: 50,
    y: height - 170,
    size: fontSize,
    font,
  });
  page.drawText(`${enrollment.student.email}`, {
    x: 50,
    y: height - 190,
    size: fontSize,
    font,
  });

  // Invoice details
  page.drawText(`Invoice Number: ${enrollment.invoiceNumber}`, {
    x: 50,
    y: height - 250,
    size: fontSize,
    font,
  });
  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 50,
    y: height - 270,
    size: fontSize,
    font,
  });

  // Course details
  page.drawText(`Course: ${enrollment.course.title}`, {
    x: 50,
    y: height - 320,
    size: fontSize,
    font,
  });
  page.drawText(`Amount: $${enrollment.paymentAmount}`, {
    x: 50,
    y: height - 340,
    size: fontSize,
    font,
  });

  // Terms and conditions
  page.drawText('Terms and Conditions:', {
    x: 50,
    y: height - 400,
    size: fontSize,
    font,
  });
  page.drawText('Payment is due upon receipt of this invoice.', {
    x: 50,
    y: height - 420,
    size: fontSize,
    font,
  });

  return await pdfDoc.save();
} 