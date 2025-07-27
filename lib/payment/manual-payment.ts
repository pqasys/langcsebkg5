import { prisma } from '@/lib/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import { PaymentResult } from './types';
import { emailService } from '@/lib/email';
import { logger, logError } from '../logger';

export class ManualPaymentService {
  static async createOfflinePayment(
    enrollmentId: string,
    amount: number,
    currency: string,
    metadata: {
      instructions?: string;
      contactInfo?: string;
      dueDate?: Date;
    } = {}
  ): Promise<PaymentResult> {
    try {
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: {
            include: {
              institution: true,
            },
          },
          student: true,
        },
      });

      if (!enrollment) {
        throw new Error(`Enrollment not found - Context: Enrollment not found - Context: },`);
      }

      // Generate a unique reference number
      const referenceNumber = `OFF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          enrollmentId,
          amount,
          currency,
          method: PaymentMethod.OFFLINE,
          status: PaymentStatus.PENDING,
          paymentId: referenceNumber,
          paymentDetails: {
            instructions: metadata.instructions || 'Please contact the institution for payment instructions',
            contactInfo: metadata.contactInfo || enrollment.course.institution.contactEmail,
            dueDate: metadata.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            referenceNumber,
          },
        },
      });

      // Send offline payment instructions email
      await emailService.sendOfflinePaymentInstructionsEmail(
        enrollment.student.email,
        enrollment.student.name,
        {
          amount,
          currency,
          referenceNumber,
          instructions: metadata.instructions,
          contactInfo: metadata.contactInfo,
          dueDate: metadata.dueDate,
          courseName: enrollment.course.title,
        }
      );

      return {
        success: true,
        paymentIntent: {
          id: payment.id,
          clientSecret: referenceNumber,
          amount,
          currency,
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.OFFLINE,
        },
      };
    } catch (error) {
      logger.error('Error creating offline payment:');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create offline payment',
      };
    }
  }

  static async createBankTransferPayment(
    enrollmentId: string,
    amount: number,
    currency: string,
    metadata: {
      bankDetails?: {
        accountName: string;
        accountNumber: string;
        bankName: string;
        swiftCode?: string;
        iban?: string;
      };
      dueDate?: Date;
    } = {}
  ): Promise<PaymentResult> {
    try {
      const enrollment = await prisma.studentCourseEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          course: {
            include: {
              institution: true,
            },
          },
          student: true,
        },
      });

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      // Generate a unique reference number
      const referenceNumber = `BANK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          enrollmentId,
          amount,
          currency,
          method: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PENDING,
          paymentId: referenceNumber,
          paymentDetails: {
            bankDetails: metadata.bankDetails || enrollment.course.institution.bankDetails,
            dueDate: metadata.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 7 days
            referenceNumber,
          },
        },
      });

      // Send bank transfer instructions email
      await emailService.sendBankTransferInstructionsEmail(
        enrollment.student.email,
        enrollment.student.name,
        {
          amount,
          currency,
          referenceNumber,
          bankDetails: metadata.bankDetails || enrollment.course.institution.bankDetails,
          dueDate: metadata.dueDate,
          courseName: enrollment.course.title,
        }
      );

      return {
        success: true,
        paymentIntent: {
          id: payment.id,
          clientSecret: referenceNumber,
          amount,
          currency,
          status: PaymentStatus.PENDING,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
      };
    } catch (error) {
      logger.error('Error creating bank transfer payment:');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create bank transfer payment',
      };
    }
  }
} 