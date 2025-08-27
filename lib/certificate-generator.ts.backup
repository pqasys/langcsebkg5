import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

export class FluentShipCertificateGenerator {
  private static readonly FONT_FAMILY = 'helvetica';
  private static readonly PRIMARY_COLOR = '#2563eb'; // Blue
  private static readonly SECONDARY_COLOR = '#1e40af'; // Darker blue
  private static readonly ACCENT_COLOR = '#f59e0b'; // Gold
  private static readonly TEXT_COLOR = '#1f2937'; // Dark gray

  static async generateCertificate(data: CertificateData): Promise<Buffer> {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Set up fonts
    doc.setFont(this.FONT_FAMILY);

    // Create gradient background effect
    this.createBackground(doc, pageWidth, pageHeight);

    // Add decorative border
    this.createBorder(doc, pageWidth, pageHeight);

    // Add logo/header
    this.createHeader(doc, pageWidth);

    // Add main certificate content
    this.createMainContent(doc, data, pageWidth, pageHeight);

    // Add footer
    this.createFooter(doc, pageWidth, pageHeight);

    // Add certificate ID
    this.addCertificateId(doc, data.certificateId, pageWidth, pageHeight);

    return Buffer.from(doc.output('arraybuffer'));
  }

  private static createBackground(doc: jsPDF, pageWidth: number, pageHeight: number) {
    // Create subtle gradient effect
    const gradientSteps = 20;
    for (let i = 0; i < gradientSteps; i++) {
      const alpha = 0.02 - (i * 0.001);
      doc.setFillColor(37, 99, 235); // Blue
      doc.setGlobalAlpha(alpha);
      doc.rect(0, (i * pageHeight) / gradientSteps, pageWidth, pageHeight / gradientSteps, 'F');
    }
    doc.setGlobalAlpha(1);
  }

  private static createBorder(doc: jsPDF, pageWidth: number, pageHeight: number) {
    // Outer border
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Inner decorative border
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Corner decorations
    const cornerSize = 15;
    doc.setFillColor(245, 158, 11);
    
    // Top-left corner
    doc.rect(10, 10, cornerSize, 3, 'F');
    doc.rect(10, 10, 3, cornerSize, 'F');
    
    // Top-right corner
    doc.rect(pageWidth - 25, 10, cornerSize, 3, 'F');
    doc.rect(pageWidth - 13, 10, 3, cornerSize, 'F');
    
    // Bottom-left corner
    doc.rect(10, pageHeight - 13, cornerSize, 3, 'F');
    doc.rect(10, pageHeight - 25, 3, cornerSize, 'F');
    
    // Bottom-right corner
    doc.rect(pageWidth - 25, pageHeight - 13, cornerSize, 3, 'F');
    doc.rect(pageWidth - 13, pageHeight - 25, 3, cornerSize, 'F');
  }

  private static createHeader(doc: jsPDF, pageWidth: number) {
    // FluentShip logo/name
    doc.setFontSize(36);
    doc.setTextColor(37, 99, 235);
    doc.setFont(this.FONT_FAMILY, 'bold');
    
    const title = 'FluentShip';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 50);

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const subtitle = 'Language Proficiency Certification';
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 65);

    // Decorative line
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1);
    doc.line(pageWidth * 0.2, 75, pageWidth * 0.8, 75);
  }

  private static createMainContent(doc: jsPDF, data: CertificateData, pageWidth: number, pageHeight: number) {
    // Main certificate text
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const mainText = 'This is to certify that';
    const mainTextWidth = doc.getTextWidth(mainText);
    doc.text(mainText, (pageWidth - mainTextWidth) / 2, 120);

    // User name
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235);
    doc.setFont(this.FONT_FAMILY, 'bold');
    
    const userName = data.userName;
    const userNameWidth = doc.getTextWidth(userName);
    doc.text(userName, (pageWidth - userNameWidth) / 2, 140);

    // Achievement text
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const achievementText = `has successfully completed the ${data.languageName} Language Proficiency Test`;
    const achievementWidth = doc.getTextWidth(achievementText);
    doc.text(achievementText, (pageWidth - achievementWidth) / 2, 160);

    // CEFR Level
    doc.setFontSize(20);
    doc.setTextColor(245, 158, 11);
    doc.setFont(this.FONT_FAMILY, 'bold');
    
    const levelText = `CEFR Level: ${data.cefrLevel}`;
    const levelWidth = doc.getTextWidth(levelText);
    doc.text(levelText, (pageWidth - levelWidth) / 2, 180);

    // Score
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const scoreText = `Score: ${data.score}/${data.totalQuestions} (${Math.round((data.score / data.totalQuestions) * 100)}%)`;
    const scoreWidth = doc.getTextWidth(scoreText);
    doc.text(scoreText, (pageWidth - scoreWidth) / 2, 200);

    // Date
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const dateText = `Completed on: ${data.completionDate}`;
    const dateWidth = doc.getTextWidth(dateText);
    doc.text(dateText, (pageWidth - dateWidth) / 2, 220);
  }

  private static createFooter(doc: jsPDF, pageWidth: number, pageHeight: number) {
    // Footer text
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const footerText = 'This certificate is issued by FluentShip and can be verified online';
    const footerWidth = doc.getTextWidth(footerText);
    doc.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - 40);

    // Verification URL
    const verifyText = 'Verify at: https://fluentship.com/verify';
    const verifyWidth = doc.getTextWidth(verifyText);
    doc.text(verifyText, (pageWidth - verifyWidth) / 2, pageHeight - 30);
  }

  private static addCertificateId(doc: jsPDF, certificateId: string, pageWidth: number, pageHeight: number) {
    // Certificate ID in bottom right
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.setFont(this.FONT_FAMILY, 'normal');
    
    const idText = `ID: ${certificateId}`;
    doc.text(idText, pageWidth - 60, pageHeight - 15);
  }

  static generateCertificateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `FS-${timestamp}-${random}`.toUpperCase();
  }
} 