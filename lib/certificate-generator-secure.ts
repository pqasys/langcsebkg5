import { PDFDocument, rgb, StandardFonts, PDFFont } from 'pdf-lib';

export interface CertificateData {
  userName: string;
  language: string;
  languageName: string;
  cefrLevel: string;
  score: number;
  totalQuestions: number;
  completionDate: string;
  certificateId: string;
  testType: 'proficiency';
}

export class FluentShipCertificateGeneratorSecure {
  private static readonly PRIMARY_COLOR = rgb(0.145, 0.388, 0.922); // #2563eb
  private static readonly SECONDARY_COLOR = rgb(0.118, 0.251, 0.686); // #1e40af
  private static readonly ACCENT_COLOR = rgb(0.961, 0.620, 0.043); // #f59e0b
  private static readonly TEXT_COLOR = rgb(0.122, 0.161, 0.227); // #1f2937
  private static readonly GRAY_COLOR = rgb(0.420, 0.447, 0.502); // #6b7280

  static async generateCertificate(data: CertificateData): Promise<Buffer> {
    // Create a new PDF document in landscape A4
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape dimensions in points
    const { width, height } = page.getSize();

    // Embed fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Create gradient background effect
    this.createBackground(page, width, height);

    // Add decorative border
    this.createBorder(page, width, height);

    // Add logo/header
    this.createHeader(page, width, height, helveticaFont, helveticaBoldFont);

    // Add main certificate content
    this.createMainContent(page, data, width, height, helveticaFont, helveticaBoldFont);

    // Add footer
    this.createFooter(page, width, height, helveticaFont);

    // Add certificate ID
    this.addCertificateId(page, data.certificateId, width, height, helveticaFont);

    // Save the PDF and return as Buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  private static createBackground(page: any, width: number, height: number) {
    // Create subtle gradient effect using multiple rectangles
    const gradientSteps = 20;
    for (let i = 0; i < gradientSteps; i++) {
      const alpha = 0.02 - (i * 0.001);
      const y = (i * height) / gradientSteps;
      const rectHeight = height / gradientSteps;
      
      page.drawRectangle({
        x: 0,
        y: y,
        width: width,
        height: rectHeight,
        color: this.PRIMARY_COLOR,
        opacity: alpha,
      });
    }
  }

  private static createBorder(page: any, width: number, height: number) {
    // Outer border
    page.drawRectangle({
      x: 28, // 10mm in points
      y: 28,
      width: width - 56,
      height: height - 56,
      borderColor: this.PRIMARY_COLOR,
      borderWidth: 6, // 2mm in points
    });

    // Inner decorative border
    page.drawRectangle({
      x: 42, // 15mm in points
      y: 42,
      width: width - 84,
      height: height - 84,
      borderColor: this.ACCENT_COLOR,
      borderWidth: 1.5, // 0.5mm in points
    });

    // Corner decorations
    const cornerSize = 42; // 15mm in points
    const cornerThickness = 8.5; // 3mm in points
    
    // Top-left corner
    page.drawRectangle({
      x: 28,
      y: height - 28 - cornerThickness,
      width: cornerSize,
      height: cornerThickness,
      color: this.ACCENT_COLOR,
    });
    page.drawRectangle({
      x: 28,
      y: height - 28 - cornerSize,
      width: cornerThickness,
      height: cornerSize,
      color: this.ACCENT_COLOR,
    });
    
    // Top-right corner
    page.drawRectangle({
      x: width - 28 - cornerSize,
      y: height - 28 - cornerThickness,
      width: cornerSize,
      height: cornerThickness,
      color: this.ACCENT_COLOR,
    });
    page.drawRectangle({
      x: width - 28 - cornerThickness,
      y: height - 28 - cornerSize,
      width: cornerThickness,
      height: cornerSize,
      color: this.ACCENT_COLOR,
    });
    
    // Bottom-left corner
    page.drawRectangle({
      x: 28,
      y: 28,
      width: cornerSize,
      height: cornerThickness,
      color: this.ACCENT_COLOR,
    });
    page.drawRectangle({
      x: 28,
      y: 28 + cornerThickness,
      width: cornerThickness,
      height: cornerSize - cornerThickness,
      color: this.ACCENT_COLOR,
    });
    
    // Bottom-right corner
    page.drawRectangle({
      x: width - 28 - cornerSize,
      y: 28,
      width: cornerSize,
      height: cornerThickness,
      color: this.ACCENT_COLOR,
    });
    page.drawRectangle({
      x: width - 28 - cornerThickness,
      y: 28 + cornerThickness,
      width: cornerThickness,
      height: cornerSize - cornerThickness,
      color: this.ACCENT_COLOR,
    });
  }

  private static createHeader(page: any, width: number, height: number, normalFont: PDFFont, boldFont: PDFFont) {
    // FluentShip logo/name
    const title = 'FluentShip';
    const titleWidth = boldFont.widthOfTextAtSize(title, 36);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 142, // 50mm from top
      size: 36,
      font: boldFont,
      color: this.PRIMARY_COLOR,
    });

    // Subtitle
    const subtitle = 'Language Proficiency Certification';
    const subtitleWidth = normalFont.widthOfTextAtSize(subtitle, 16);
    page.drawText(subtitle, {
      x: (width - subtitleWidth) / 2,
      y: height - 184, // 65mm from top
      size: 16,
      font: normalFont,
      color: this.SECONDARY_COLOR,
    });

    // Decorative line
    page.drawLine({
      start: { x: width * 0.2, y: height - 213 }, // 75mm from top
      end: { x: width * 0.8, y: height - 213 },
      thickness: 3, // 1mm in points
      color: this.ACCENT_COLOR,
    });
  }

  private static createMainContent(page: any, data: CertificateData, width: number, height: number, normalFont: PDFFont, boldFont: PDFFont) {
    // Main certificate text
    const mainText = 'This is to certify that';
    const mainTextWidth = normalFont.widthOfTextAtSize(mainText, 14);
    page.drawText(mainText, {
      x: (width - mainTextWidth) / 2,
      y: height - 340, // 120mm from top
      size: 14,
      font: normalFont,
      color: this.TEXT_COLOR,
    });

    // User name
    const userName = data.userName;
    const userNameWidth = boldFont.widthOfTextAtSize(userName, 24);
    page.drawText(userName, {
      x: (width - userNameWidth) / 2,
      y: height - 397, // 140mm from top
      size: 24,
      font: boldFont,
      color: this.PRIMARY_COLOR,
    });

    // Achievement text
    const achievementText = `has successfully completed the ${data.languageName} Language Proficiency Test`;
    const achievementWidth = normalFont.widthOfTextAtSize(achievementText, 14);
    page.drawText(achievementText, {
      x: (width - achievementWidth) / 2,
      y: height - 454, // 160mm from top
      size: 14,
      font: normalFont,
      color: this.TEXT_COLOR,
    });

    // CEFR Level
    const levelText = `CEFR Level: ${data.cefrLevel}`;
    const levelWidth = boldFont.widthOfTextAtSize(levelText, 20);
    page.drawText(levelText, {
      x: (width - levelWidth) / 2,
      y: height - 511, // 180mm from top
      size: 20,
      font: boldFont,
      color: this.ACCENT_COLOR,
    });

    // Score
    const scoreText = `Score: ${data.score}/${data.totalQuestions} (${Math.round((data.score / data.totalQuestions) * 100)}%)`;
    const scoreWidth = normalFont.widthOfTextAtSize(scoreText, 16);
    page.drawText(scoreText, {
      x: (width - scoreWidth) / 2,
      y: height - 567, // 200mm from top
      size: 16,
      font: normalFont,
      color: this.TEXT_COLOR,
    });

    // Date
    const dateText = `Completed on: ${data.completionDate}`;
    const dateWidth = normalFont.widthOfTextAtSize(dateText, 12);
    page.drawText(dateText, {
      x: (width - dateWidth) / 2,
      y: height - 624, // 220mm from top
      size: 12,
      font: normalFont,
      color: this.GRAY_COLOR,
    });
  }

  private static createFooter(page: any, width: number, height: number, normalFont: PDFFont) {
    // Footer text
    const footerText = 'This certificate is issued by FluentShip and can be verified online';
    const footerWidth = normalFont.widthOfTextAtSize(footerText, 10);
    page.drawText(footerText, {
      x: (width - footerWidth) / 2,
      y: 113, // 40mm from bottom
      size: 10,
      font: normalFont,
      color: this.GRAY_COLOR,
    });

    // Verification URL
    const verifyText = 'Verify at: https://fluentship.com/verify';
    const verifyWidth = normalFont.widthOfTextAtSize(verifyText, 10);
    page.drawText(verifyText, {
      x: (width - verifyWidth) / 2,
      y: 85, // 30mm from bottom
      size: 10,
      font: normalFont,
      color: this.GRAY_COLOR,
    });
  }

  private static addCertificateId(page: any, certificateId: string, width: number, height: number, normalFont: PDFFont) {
    // Certificate ID in bottom right
    const idText = `ID: ${certificateId}`;
    page.drawText(idText, {
      x: width - 170, // 60mm from right edge
      y: 42, // 15mm from bottom
      size: 8,
      font: normalFont,
      color: this.GRAY_COLOR,
    });
  }

  static generateCertificateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `FS-${timestamp}-${random}`.toUpperCase();
  }
}
