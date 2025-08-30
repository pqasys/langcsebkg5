import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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
  static async generateCertificate(data: CertificateData): Promise<Buffer> {
    try {
      // Validate input data
      if (!data.userName || !data.language || !data.cefrLevel || !data.certificateId) {
        throw new Error('Missing required certificate data');
      }

      // Calculate correct percentage
      const percentage = Math.round((data.score / data.totalQuestions) * 100);

      // Create HTML certificate with professional design
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate of Completion</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
            
            @page {
              size: A4 portrait;
              margin: 0.1in 0.25in;
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
              margin: 0;
            }
            
            .certificate-container {
              width: 100%;
              max-width: 720px;
              background: white;
              border-radius: 20px;
              box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
              overflow: hidden;
              position: relative;
              min-height: 800px;
            }
            
            .certificate-border {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border: 3px solid transparent;
              border-radius: 20px;
              background: linear-gradient(45deg, #667eea, #764ba2, #3498db, #2980b9) border-box;
              -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: destination-out;
              mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
              mask-composite: exclude;
            }
            
            .certificate-content {
              padding: 35px;
              position: relative;
              z-index: 1;
              background: white;
            }
            
            .header {
              text-align: center;
              margin-bottom: 25px;
              position: relative;
            }
            
            .logo-container {
              margin-bottom: 15px;
            }
            
            .logo {
              width: 65px;
              height: 65px;
              margin: 0 auto;
              background: linear-gradient(135deg, #667eea, #764ba2);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }
            
            .logo img {
              width: 35px;
              height: 35px;
              filter: brightness(0) invert(1);
              object-fit: contain;
            }
            
            .title {
              font-family: 'Playfair Display', serif;
              font-size: 30px;
              font-weight: 900;
              background: linear-gradient(135deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              margin-bottom: 6px;
              letter-spacing: 2px;
            }
            
            .subtitle {
              font-size: 15px;
              color: #6b7280;
              font-weight: 400;
              letter-spacing: 1px;
            }
            
            .main-content {
              text-align: center;
              margin: 25px 0;
            }
            
            .language-level-section {
              background: linear-gradient(135deg, #667eea, #764ba2);
              color: white;
              padding: 20px;
              border-radius: 15px;
              margin: 20px 0;
              box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
            }
            
            .language-title {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 900;
              color: white;
              margin-bottom: 8px;
              letter-spacing: 1px;
              text-align: center;
            }
            
            .level-subtitle {
              font-family: 'Playfair Display', serif;
              font-size: 20px;
              font-weight: 700;
              color: white;
              margin-bottom: 0;
              text-align: center;
              letter-spacing: 1px;
              opacity: 0.9;
            }
            
            .certificate-text {
              font-family: 'Playfair Display', serif;
              font-size: 17px;
              line-height: 1.4;
              color: #374151;
              margin-bottom: 25px;
              font-weight: 400;
            }
            
            .user-name {
              font-weight: 700;
              color: #667eea;
              font-size: 20px;
            }
            
            .score-section {
              background: #f8fafc;
              color: #374151;
              padding: 15px;
              border-radius: 12px;
              margin: 20px 0;
              border: 1px solid #e5e7eb;
            }
            
            .score-display {
              font-size: 26px;
              font-weight: 700;
              margin-bottom: 6px;
            }
            
            .percentage {
              font-size: 16px;
              font-weight: 600;
              opacity: 0.9;
            }
            
            .details-grid {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin: 25px 0;
              flex-wrap: wrap;
            }
            
            .detail-card {
              background: #f8fafc;
              padding: 18px 22px;
              border-radius: 15px;
              border: 2px solid #e5e7eb;
              box-shadow: 0 8px 25px rgba(102, 126, 234, 0.1);
              text-align: center;
              min-width: 160px;
              transition: all 0.3s ease;
            }
            
            .detail-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 12px 35px rgba(102, 126, 234, 0.15);
            }
            
            .detail-label {
              font-size: 11px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-bottom: 8px;
              display: block;
            }
            
            .detail-value {
              font-size: 15px;
              font-weight: 600;
              color: #1f2937;
              display: block;
            }
            
            .footer {
              margin-top: 25px;
              text-align: center;
              border-top: 2px solid #e5e7eb;
              padding-top: 20px;
            }
            
            .footer-text {
              font-size: 13px;
              color: #6b7280;
              margin-bottom: 6px;
            }
            
            .certificate-id {
              font-family: 'Inter', monospace;
              font-size: 11px;
              color: #9ca3af;
              background: #f3f4f6;
              padding: 6px 12px;
              border-radius: 20px;
              display: inline-block;
              margin-top: 12px;
            }
            
            .decorative-elements {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              pointer-events: none;
              z-index: 0;
            }
            
            .corner-decoration {
              position: absolute;
              width: 35px;
              height: 35px;
              border: 2px solid #e5e7eb;
            }
            
            .corner-decoration.top-left {
              top: 12px;
              left: 12px;
              border-right: none;
              border-bottom: none;
            }
            
            .corner-decoration.top-right {
              top: 12px;
              right: 12px;
              border-left: none;
              border-bottom: none;
            }
            
            .corner-decoration.bottom-left {
              bottom: 12px;
              left: 12px;
              border-right: none;
              border-top: none;
            }
            
            .corner-decoration.bottom-right {
              bottom: 12px;
              right: 12px;
              border-left: none;
              border-top: none;
            }
            
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 70px;
              font-weight: 900;
              color: rgba(102, 126, 234, 0.03);
              z-index: 0;
              pointer-events: none;
            }
            
            /* Print-specific styles */
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
                margin: 0 !important;
              }
              
              .certificate-container {
                box-shadow: none !important;
                border: 2px solid #667eea !important;
                max-width: none !important;
                width: 100% !important;
                min-height: 100vh !important;
                height: 100vh !important;
                border-radius: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
              
              .certificate-content {
                background: white !important;
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                padding: 40px !important;
              }
              
              .header {
                margin-bottom: 40px !important;
              }
              
              .main-content {
                flex: 1 !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: center !important;
                margin: 40px 0 !important;
              }
              
              .footer {
                margin-top: 40px !important;
              }
              
              .decorative-elements {
                display: none !important;
              }
              
              .watermark {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="certificate-border"></div>
            <div class="decorative-elements">
              <div class="corner-decoration top-left"></div>
              <div class="corner-decoration top-right"></div>
              <div class="corner-decoration bottom-left"></div>
              <div class="corner-decoration bottom-right"></div>
              <div class="watermark">FS</div>
            </div>
            
            <div class="certificate-content">
              <div class="header">
                <div class="logo-container">
                  <div class="logo">
                    <img src="${this.getLogoBase64()}" alt="FluentShip Logo">
                  </div>
                </div>
                <h1 class="title">Certificate of Completion</h1>
                <p class="subtitle">Language Proficiency Achievement</p>
              </div>
              
              <div class="main-content">
                <div class="language-level-section">
                  <h2 class="language-title">${data.languageName} Language</h2>
                  <h3 class="level-subtitle">Level: CEFR ${data.cefrLevel}</h3>
                </div>
                
                <p class="certificate-text">
                  This is to certify that <span class="user-name">${data.userName}</span> has successfully completed the ${data.languageName} Language Proficiency Test with distinction.
                </p>
                
                <div class="score-section">
                  <div class="score-display">${data.score}/${data.totalQuestions}</div>
                  <div class="percentage">${percentage}% Accuracy</div>
                </div>
                
                <div class="details-grid">
                  <div class="detail-card">
                    <div class="detail-label">Completion Date</div>
                    <div class="detail-value">${data.completionDate}</div>
                  </div>
                  <div class="detail-card">
                    <div class="detail-label">Test Type</div>
                    <div class="detail-value">Language Proficiency</div>
                  </div>
                </div>
              </div>
              
              <div class="footer">
                <p class="footer-text">This certificate is issued by FluentShip Language Learning Platform</p>
                <p class="footer-text" style="color: #667eea; font-weight: 600;">www.fluentship.com</p>
                <p class="footer-text">Certificate ID: ${data.certificateId}</p>
                <div class="certificate-id">Generated on ${new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Return HTML as a buffer
      return Buffer.from(html, 'utf-8');
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw new Error(`Failed to generate certificate: ${error}`);
    }
  }

  // Method specifically for email attachments - generates a simple PDF
  static async generateEmailCertificate(data: CertificateData): Promise<Buffer> {
    try {
      // For email distribution, we'll use a simple approach
      // In production, you could use a service like:
      // - Puppeteer for HTML-to-PDF conversion
      // - A cloud service like DocRaptor or Prince
      // - Or store pre-generated PDFs in cloud storage

      // For now, return the HTML version which can be converted to PDF by the email service
      return await this.generateCertificate(data);
    } catch (error) {
      console.error('Error generating email certificate:', error);
      throw new Error(`Failed to generate email certificate: ${error}`);
    }
  }

  static generateCertificateId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `FS-${timestamp}-${random}`.toUpperCase();
  }

  private static getLogoBase64(): string {
    // For development, use localhost
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000/fluentship-branding/fluentship-badge.png';
    }
    
    // For production, use the actual domain
    // You can replace this with your actual domain
    return 'https://fluentship.com/fluentship-branding/fluentship-badge.png';
  }
}
