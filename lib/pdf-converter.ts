import puppeteer from 'puppeteer';

export class PDFConverter {
  /**
   * Converts HTML content to PDF using Puppeteer
   * This is used for email attachments and download functionality
   */
  static async htmlToPDF(htmlContent: string, options: {
    format?: 'A4' | 'Letter';
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  } = {}): Promise<Buffer> {
    let browser;
    
    try {
      // Launch browser with better configuration for PDF generation
      browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });

      const page = await browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2
      });
      
      // Set content with proper wait conditions
      await page.setContent(htmlContent, {
        waitUntil: ['networkidle0', 'domcontentloaded']
      });

      // Wait for fonts and images to load using a more reliable method
      await page.waitForFunction(() => {
        return document.readyState === 'complete' && 
               !document.querySelector('img[src*="fluentship-badge"]') || 
               document.querySelector('img[src*="fluentship-badge"]')?.complete;
      }, { timeout: 10000 });

      // Additional wait for any remaining resources
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate PDF with optimized settings
      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        margin: options.margin || {
          top: '0.1in',
          right: '0.25in',
          bottom: '0.1in',
          left: '0.25in'
        },
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        scale: 1.0
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error converting HTML to PDF:', error);
      throw new Error(`PDF conversion failed: ${error}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Converts HTML certificate to PDF with certificate-specific settings
   */
  static async certificateToPDF(htmlContent: string): Promise<Buffer> {
    return this.htmlToPDF(htmlContent, {
      format: 'A4',
      margin: {
        top: '0.1in',
        right: '0.25in',
        bottom: '0.1in',
        left: '0.25in'
      }
    });
  }
}
