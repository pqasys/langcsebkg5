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
    try {
      // Create a new PDF document in landscape A4
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 landscape dimensions in points
      const { width, height } = page.getSize();

      // Embed fonts
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      // For now, we'll use a text-based logo to avoid file system issues
      // The logo can be added later when we have a proper server-side setup
      const logoImage = null;

      // Create gradient background effect
      this.createBackground(page, width, height);

      // Add decorative border
      this.createBorder(page, width, height);

      // Add logo and header
      this.createHeader(page, width, height, helveticaFont, helveticaBoldFont, logoImage);

      // Add main certificate content with improved spacing
      this.createMainContent(page, data, width, height, helveticaFont, helveticaBoldFont);

      // Add footer
      this.createFooter(page, width, height, helveticaFont, logoImage);

      // Add certificate ID
      this.addCertificateId(page, data.certificateId, width, height, helveticaFont);

      // Save the PDF with minimal options to avoid compression issues
      const pdfBytes = await pdfDoc.save();
      
      return Buffer.from(pdfBytes);
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
      throw new Error(`Failed to generate certificate PDF: ${error.message}`);
    }
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

  private static createHeader(page: any, width: number, height: number, normalFont: PDFFont, boldFont: PDFFont, logoImage: any) {
    // Draw FluentShip logo using the actual PNG badge
    this.drawFluentShipLogo(page, width, height, logoImage, boldFont);

    // FluentShip title
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

  private static drawFluentShipLogo(page: any, width: number, height: number, logoImage: any, boldFont: PDFFont) {
    const logoX = width / 2 - 60; // Center the logo
    const logoY = height - 100; // Position above the title
    
    if (logoImage) {
      // Draw the actual FluentShip badge logo
      const logoWidth = 120; // 120 points wide
      const logoHeight = (logoWidth * logoImage.height) / logoImage.width; // Maintain aspect ratio
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY - logoHeight / 2,
        width: logoWidth,
        height: logoHeight,
      });
    } else {
      // Fallback: Draw a stylized text-based logo with decorative elements
      const logoText = 'FluentShip';
      const logoSize = 28;
      const logoWidth = boldFont.widthOfTextAtSize(logoText, logoSize);
      
      // Draw a decorative background rectangle
      page.drawRectangle({
        x: logoX - 10,
        y: logoY - 10,
        width: logoWidth + 20,
        height: logoSize + 20,
        color: this.PRIMARY_COLOR,
        opacity: 0.1,
      });
      
      // Draw the main logo text
      page.drawText(logoText, {
        x: logoX,
        y: logoY,
        size: logoSize,
        font: boldFont,
        color: this.PRIMARY_COLOR,
      });
      
      // Draw decorative lines
      page.drawLine({
        start: { x: logoX - 5, y: logoY - 5 },
        end: { x: logoX + logoWidth + 5, y: logoY - 5 },
        thickness: 2,
        color: this.ACCENT_COLOR,
      });
      
      page.drawLine({
        start: { x: logoX - 5, y: logoY + logoSize + 5 },
        end: { x: logoX + logoWidth + 5, y: logoY + logoSize + 5 },
        thickness: 2,
        color: this.ACCENT_COLOR,
      });
    }
  }

  private static createMainContent(page: any, data: CertificateData, width: number, height: number, normalFont: PDFFont, boldFont: PDFFont) {
    // Calculate dynamic spacing based on content
    const maxContentWidth = width * 0.8; // 80% of page width for content
    const startY = height - 280; // Start content area
    let currentY = startY;

    // Main certificate text
    const mainText = 'This is to certify that';
    const mainTextWidth = normalFont.widthOfTextAtSize(mainText, 14);
    page.drawText(mainText, {
      x: (width - mainTextWidth) / 2,
      y: currentY,
      size: 14,
      font: normalFont,
      color: this.TEXT_COLOR,
    });
    currentY -= 40; // Space after main text

    // User name with dynamic sizing for long names
    const userName = data.userName;
    let userNameSize = 24;
    let userNameWidth = boldFont.widthOfTextAtSize(userName, userNameSize);
    
    // Reduce font size if name is too long
    while (userNameWidth > maxContentWidth && userNameSize > 16) {
      userNameSize -= 2;
      userNameWidth = boldFont.widthOfTextAtSize(userName, userNameSize);
    }

    page.drawText(userName, {
      x: (width - userNameWidth) / 2,
      y: currentY,
      size: userNameSize,
      font: boldFont,
      color: this.PRIMARY_COLOR,
    });
    currentY -= (userNameSize + 20); // Dynamic spacing based on font size

    // Achievement text with line wrapping for long language names
    const achievementText = `has successfully completed the ${data.languageName} Language Proficiency Test`;
    const achievementSize = 14;
    const achievementWidth = normalFont.widthOfTextAtSize(achievementText, achievementSize);
    
    if (achievementWidth <= maxContentWidth) {
      // Single line
      page.drawText(achievementText, {
        x: (width - achievementWidth) / 2,
        y: currentY,
        size: achievementSize,
        font: normalFont,
        color: this.TEXT_COLOR,
      });
      currentY -= 50;
    } else {
      // Split into multiple lines
      const words = achievementText.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const testWidth = normalFont.widthOfTextAtSize(testLine, achievementSize);
        
        if (testWidth <= maxContentWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);

      // Draw each line
      for (const line of lines) {
        const lineWidth = normalFont.widthOfTextAtSize(line, achievementSize);
        page.drawText(line, {
          x: (width - lineWidth) / 2,
          y: currentY,
          size: achievementSize,
          font: normalFont,
          color: this.TEXT_COLOR,
        });
        currentY -= 25;
      }
      currentY -= 25; // Extra space after multi-line text
    }

    // CEFR Level with improved spacing
    const levelText = `CEFR Level: ${data.cefrLevel}`;
    const levelWidth = boldFont.widthOfTextAtSize(levelText, 20);
    page.drawText(levelText, {
      x: (width - levelWidth) / 2,
      y: currentY,
      size: 20,
      font: boldFont,
      color: this.ACCENT_COLOR,
    });
    currentY -= 50;

    // Score with better formatting
    const percentage = Math.round((data.score / data.totalQuestions) * 100);
    const scoreText = `Score: ${data.score}/${data.totalQuestions} (${percentage}%)`;
    const scoreWidth = normalFont.widthOfTextAtSize(scoreText, 16);
    page.drawText(scoreText, {
      x: (width - scoreWidth) / 2,
      y: currentY,
      size: 16,
      font: normalFont,
      color: this.TEXT_COLOR,
    });
    currentY -= 50;

    // Test date with improved formatting
    const testDateText = `Test Date: ${data.completionDate}`;
    const testDateWidth = normalFont.widthOfTextAtSize(testDateText, 12);
    page.drawText(testDateText, {
      x: (width - testDateWidth) / 2,
      y: currentY,
      size: 12,
      font: normalFont,
      color: this.GRAY_COLOR,
    });
    currentY -= 40;

    // Certificate issue date
    const issueDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const issueDateText = `Certificate Issued: ${issueDate}`;
    const issueDateWidth = normalFont.widthOfTextAtSize(issueDateText, 12);
    page.drawText(issueDateText, {
      x: (width - issueDateWidth) / 2,
      y: currentY,
      size: 12,
      font: normalFont,
      color: this.GRAY_COLOR,
    });
  }

  private static createFooter(page: any, width: number, height: number, normalFont: PDFFont, logoImage: any) {
    // Footer text with better positioning
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

    // Add small FluentShip logo in footer
    this.drawSmallFluentShipLogo(page, width, height, logoImage, normalFont);
  }

  private static drawSmallFluentShipLogo(page: any, width: number, height: number, logoImage: any, normalFont: PDFFont) {
    const logoX = width / 2 - 20; // Center the logo
    const logoY = 60; // Position in footer area
    
    if (logoImage) {
      // Draw small FluentShip badge logo
      const logoWidth = 40; // 40 points wide for footer
      const logoHeight = (logoWidth * logoImage.height) / logoImage.width; // Maintain aspect ratio
      
      page.drawImage(logoImage, {
        x: logoX,
        y: logoY - logoHeight / 2,
        width: logoWidth,
        height: logoHeight,
      });
    } else {
      // Fallback: Draw a stylized small logo
      const logoText = 'FS';
      const logoSize = 14;
      const logoWidth = normalFont.widthOfTextAtSize(logoText, logoSize);
      
      // Draw a small decorative circle background
      page.drawCircle({
        x: logoX + logoWidth / 2,
        y: logoY + logoSize / 2,
        size: logoSize + 4,
        color: this.PRIMARY_COLOR,
        opacity: 0.1,
      });
      
      // Draw the logo text
      page.drawText(logoText, {
        x: logoX,
        y: logoY,
        size: logoSize,
        font: normalFont,
        color: this.PRIMARY_COLOR,
      });
    }
  }

  private static addCertificateId(page: any, certificateId: string, width: number, height: number, normalFont: PDFFont) {
    // Certificate ID in bottom right with better positioning
    const idText = `ID: ${certificateId}`;
    const idWidth = normalFont.widthOfTextAtSize(idText, 8);
    page.drawText(idText, {
      x: width - idWidth - 42, // 15mm from right edge
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
