// import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
// import { toast } from 'sonner';

export interface InvoiceTemplateOptions {
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  termsAndConditions?: string;
  paymentInstructions?: string;
  footerText?: string;
}

const defaultOptions: InvoiceTemplateOptions = {
  primaryColor: '#000000',
  secondaryColor: '#666666',
  termsAndConditions: 'Payment is due upon receipt of this invoice.',
  paymentInstructions: 'Please make payment to the bank account details provided below.',
  footerText: 'Thank you for your business!',
};

export async function generateInvoicePDF(
  enrollment: unknown,
  institution: unknown,
  options: InvoiceTemplateOptions = {}
) {
  // Dynamic import to avoid SSR issues
  const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
  
  const mergedOptions = { ...defaultOptions, ...options };
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 12;
  const lineHeight = 20;

  // Helper function to draw text with proper line spacing
  const drawText = (text: string, x: number, y: number, size: number = fontSize, isBold: boolean = false) => {
    page.drawText(text, {
      x,
      y,
      size,
      font: isBold ? boldFont : font,
      color: rgb(0, 0, 0),
    });
    return y - lineHeight;
  };

  // Add logo if provided
  let currentY = height - 50;
  if (mergedOptions.logo) {
    try {
      const logoBytes = await fetch(mergedOptions.logo).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoBytes);
      const logoDims = logoImage.scale(0.5);
      page.drawImage(logoImage, {
        x: 50,
        y: currentY,
        width: logoDims.width,
        height: logoDims.height,
      });
      currentY -= logoDims.height + 20;
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  }

  // Invoice header
  currentY = drawText('INVOICE', 50, currentY, 24, true);
  currentY -= lineHeight;

  // Institution details
  currentY = drawText(mergedOptions.primaryColor, 50, currentY, fontSize, true);
  currentY = drawText(institution.name, 50, currentY);
  currentY = drawText(institution.email, 50, currentY);
  currentY -= lineHeight;

  // Student details
  currentY = drawText('Bill To:', 50, currentY, fontSize, true);
  currentY = drawText(enrollment.student.name, 50, currentY);
  currentY = drawText(enrollment.student.email, 50, currentY);
  currentY -= lineHeight;

  // Invoice details
  currentY = drawText('Invoice Details:', 50, currentY, fontSize, true);
  currentY = drawText(`Invoice Number: ${enrollment.invoiceNumber}`, 50, currentY);
  currentY = drawText(`Date: ${new Date().toLocaleDateString()}`, 50, currentY);
  currentY = drawText(`Due Date: ${new Date(enrollment.startDate).toLocaleDateString()}`, 50, currentY);
  currentY -= lineHeight;

  // Course details
  currentY = drawText('Course Details:', 50, currentY, fontSize, true);
  currentY = drawText(`Course: ${enrollment.course.title}`, 50, currentY);
  currentY = drawText(`Start Date: ${new Date(enrollment.startDate).toLocaleDateString()}`, 50, currentY);
  currentY = drawText(`End Date: ${new Date(enrollment.endDate).toLocaleDateString()}`, 50, currentY);
  currentY -= lineHeight;

  // Payment details
  currentY = drawText('Payment Details:', 50, currentY, fontSize, true);
  currentY = drawText(`Amount: $${enrollment.paymentAmount}`, 50, currentY);
  currentY -= lineHeight;

  // Payment instructions
  if (mergedOptions.paymentInstructions) {
    currentY = drawText('Payment Instructions:', 50, currentY, fontSize, true);
    currentY = drawText(mergedOptions.paymentInstructions, 50, currentY);
    currentY -= lineHeight;
  }

  // Terms and conditions
  if (mergedOptions.termsAndConditions) {
    currentY = drawText('Terms and Conditions:', 50, currentY, fontSize, true);
    currentY = drawText(mergedOptions.termsAndConditions, 50, currentY);
    currentY -= lineHeight;
  }

  // Footer
  if (mergedOptions.footerText) {
    currentY = drawText(mergedOptions.footerText, 50, currentY);
  }

  return await pdfDoc.save();
}

export function generateEmailTemplate(enrollment: unknown, institution: unknown, options: InvoiceTemplateOptions = {}) {
  const mergedOptions = { ...defaultOptions, ...options };
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: ${mergedOptions.primaryColor};">Invoice for ${enrollment.course.title}</h1>
      
      <div style="margin: 20px 0;">
        <p>Dear ${enrollment.student.name},</p>
        <p>Please find attached the invoice for your enrollment in ${enrollment.course.title}.</p>
      </div>

      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <h2 style="color: ${mergedOptions.primaryColor};">Invoice Details</h2>
        <p><strong>Invoice Number:</strong> ${enrollment.invoiceNumber}</p>
        <p><strong>Amount:</strong> $${enrollment.paymentAmount}</p>
        <p><strong>Due Date:</strong> ${new Date(enrollment.startDate).toLocaleDateString()}</p>
      </div>

      ${mergedOptions.paymentInstructions ? `
        <div style="margin: 20px 0;">
          <h3 style="color: ${mergedOptions.primaryColor};">Payment Instructions</h3>
          <p>${mergedOptions.paymentInstructions}</p>
        </div>
      ` : ''}

      ${mergedOptions.termsAndConditions ? `
        <div style="margin: 20px 0;">
          <h3 style="color: ${mergedOptions.primaryColor};">Terms and Conditions</h3>
          <p>${mergedOptions.termsAndConditions}</p>
        </div>
      ` : ''}

      <div style="margin: 20px 0; text-align: center;">
        <p>Thank you for choosing ${institution.name}.</p>
        ${mergedOptions.footerText ? `<p>${mergedOptions.footerText}</p>` : ''}
      </div>
    </div>
  `;
} 