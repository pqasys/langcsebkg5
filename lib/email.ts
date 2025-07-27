import * as nodemailer from 'nodemailer';
import { prisma } from './prisma';
import { logger } from './logger';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async initializeTransporter() {
    if (this.transporter) return;

    try {
      // Try to get settings from database first
      const settings = await prisma.emailSettings.findFirst();
      
      if (settings) {
        // // // // // // // // // // // console.log('📧 Using database email settings');
        this.transporter = nodemailer.createTransport({
          host: settings.host,
          port: settings.port,
          secure: settings.secure,
          auth: {
            user: settings.username,
            pass: settings.password,
          },
          tls: {
            rejectUnauthorized: settings.rejectUnauthorized
          },
          // Additional settings for IONOS compatibility
          requireTLS: true,
          ignoreTLS: false
        });
      } else {
        // Fallback to environment variables
        console.log('📧 Using environment email settings');
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587');
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const secure = process.env.SMTP_SECURE === 'true';

        if (!host || !user || !pass) {
          // // // console.warn('⚠️  Email settings not configured. Emails will be logged only.');
          this.transporter = null;
          return;
        }

        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure,
          auth: { user, pass },
          tls: {
            rejectUnauthorized: false
          }
        });
      }
    } catch (error) {
      logger.error('❌ Error initializing email transporter:');
      this.transporter = null;
    }
  }

  public async sendEmail(options: EmailOptions) {
    try {
      await this.initializeTransporter();
      
      // If no transporter is available, throw an error with details
      if (!this.transporter) {
        const error = new Error('SMTP not configured - email cannot be sent');
        error.name = 'SMTP_NOT_CONFIGURED';
        throw error;
      }

      // Get settings from database for from email/name
      const settings = await prisma.emailSettings.findFirst();
      const fromEmail = settings?.fromEmail || process.env.SMTP_FROM_EMAIL || 'noreply@yourdomain.com';
      const fromName = settings?.fromName || process.env.SMTP_FROM_NAME || 'Your Platform';

      const mailOptions = {
        from: `"${fromName}" <${fromEmail}>`,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', {
        messageId: info.messageId,
        to: options.to,
        subject: options.subject,
        accepted: info.accepted,
        rejected: info.rejected
      });
      return info;
    } catch (error) {
      logger.error('❌ Error sending email:');
      
      // Log the email content for debugging
      console.log('📧 FAILED EMAIL CONTENT:', {
        to: options.to,
        subject: options.subject,
        html: options.html.substring(0, 200) + '...'
      });
      
      throw error;
    }
  }

  // Template methods for common emails
  public async sendWelcomeEmail(to: string, name: string) {
    const html = `
      <h1>Welcome to Our Platform!</h1>
      <p>Dear ${name},</p>
      <p>Thank you for joining our platform. We're excited to have you on board!</p>
      <p>If you have any questions, feel free to reach out to our support team.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Welcome to Our Platform',
      html,
    });
  }

  public async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${resetUrl}">Reset Password</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      html,
    });
  }

  public async sendPaymentConfirmationEmail(to: string, name: string, paymentDetails: unknown) {
    const html = `
      <h1>Payment Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Your payment has been confirmed. Here are the details:</p>
      <ul>
        <li>Amount: ${paymentDetails.amount}</li>
        <li>Reference: ${paymentDetails.referenceNumber}</li>
        <li>Date: ${new Date(paymentDetails.paidAt).toLocaleDateString()}</li>
      </ul>
      <p>Thank you for your payment!</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Payment Confirmation',
      html,
    });
  }

  public async sendPaymentFailureEmail(to: string, name: string, paymentDetails: unknown) {
    const html = `
      <h1>Payment Failed</h1>
      <p>Dear ${name},</p>
      <p>We were unable to process your payment. Here are the details:</p>
      <ul>
        <li>Amount: ${paymentDetails.amount}</li>
        <li>Reference: ${paymentDetails.referenceNumber}</li>
        <li>Error: ${paymentDetails.error || 'Unknown error'}</li>
      </ul>
      <p>Please try again or contact support if the issue persists.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Payment Failed',
      html,
    });
  }

  public async sendPaymentReminderEmail(to: string, name: string, paymentDetails: unknown) {
    const html = `
      <h1>Payment Reminder</h1>
      <p>Dear ${name},</p>
      <p>This is a reminder that your payment is due. Here are the details:</p>
      <ul>
        <li>Amount: ${paymentDetails.amount}</li>
        <li>Due Date: ${new Date(paymentDetails.dueDate).toLocaleDateString()}</li>
        <li>Days Remaining: ${paymentDetails.daysRemaining}</li>
      </ul>
      <p>Please complete your payment to maintain your enrollment.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Payment Reminder',
      html,
    });
  }

  public async sendRefundConfirmationEmail(to: string, name: string, refundDetails: unknown) {
    const html = `
      <h1>Refund Confirmation</h1>
      <p>Dear ${name},</p>
      <p>Your refund has been processed. Here are the details:</p>
      <ul>
        <li>Original Amount: ${refundDetails.originalAmount}</li>
        <li>Refund Amount: ${refundDetails.refundAmount}</li>
        <li>Reference: ${refundDetails.referenceNumber}</li>
        <li>Date: ${new Date(refundDetails.refundedAt).toLocaleDateString()}</li>
      </ul>
      <p>The refunded amount will be credited to your original payment method.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Refund Confirmation',
      html,
    });
  }

  public async sendBankTransferInstructionsEmail(to: string, name: string, transferDetails: unknown) {
    const html = `
      <h1>Bank Transfer Instructions</h1>
      <p>Dear ${name},</p>
      <p>Please follow these instructions to complete your payment:</p>
      <ul>
        <li>Amount: ${transferDetails.amount} ${transferDetails.currency}</li>
        <li>Reference Number: ${transferDetails.referenceNumber}</li>
        <li>Due Date: ${new Date(transferDetails.dueDate).toLocaleDateString()}</li>
      </ul>
      <h2>Bank Details:</h2>
      <ul>
        <li>Account Name: ${transferDetails.bankDetails.accountName}</li>
        <li>Account Number: ${transferDetails.bankDetails.accountNumber}</li>
        <li>Bank Name: ${transferDetails.bankDetails.bankName}</li>
        ${transferDetails.bankDetails.swiftCode ? `<li>SWIFT Code: ${transferDetails.bankDetails.swiftCode}</li>` : ''}
        ${transferDetails.bankDetails.iban ? `<li>IBAN: ${transferDetails.bankDetails.iban}</li>` : ''}
      </ul>
      <p>Please include the reference number in your transfer description.</p>
      <p>Payment will be confirmed once we receive the transfer.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Bank Transfer Instructions',
      html,
    });
  }

  public async sendOfflinePaymentInstructionsEmail(to: string, name: string, paymentDetails: unknown) {
    const html = `
      <h1>Offline Payment Instructions</h1>
      <p>Dear ${name},</p>
      <p>Please follow these instructions to complete your offline payment:</p>
      <ul>
        <li>Amount: ${paymentDetails.amount} ${paymentDetails.currency}</li>
        <li>Reference Number: ${paymentDetails.referenceNumber}</li>
        <li>Due Date: ${new Date(paymentDetails.dueDate).toLocaleDateString()}</li>
      </ul>
      ${paymentDetails.instructions ? `
        <h2>Payment Instructions:</h2>
        <p>${paymentDetails.instructions}</p>
      ` : ''}
      ${paymentDetails.contactInfo ? `
        <h2>Contact Information:</h2>
        <p>${paymentDetails.contactInfo}</p>
      ` : ''}
      <p>Please include the reference number when making your payment.</p>
      <p>Payment will be confirmed once we receive your payment.</p>
    `;

    return this.sendEmail({
      to,
      subject: 'Offline Payment Instructions',
      html,
    });
  }
}

export const emailService = EmailService.getInstance();
export { EmailService }; 