import { prisma } from '@/lib/prisma';
import { BOOKING_STATES, PAYMENT_STATES } from '@/lib/enrollment/state-manager';
import { logger, logError } from '../logger';

export interface ValidationResult {
  isValid: boolean;
  inconsistencies: Array<{
    bookingId: string;
    bookingStatus: string;
    paymentStatus: string;
    enrollmentStatus: string;
    issue: string;
  }>;
  orphanedPayments: Array<{
    paymentId: string;
    bookingId: string;
    issue: string;
  }>;
}

export class BookingPaymentValidator {
  /**
   * Validates consistency between booking and payment statuses
   */
  static async validateConsistency(): Promise<ValidationResult> {
    const result: ValidationResult = {
      isValid: true,
      inconsistencies: [],
      orphanedPayments: []
    };

    try {
      // Get all bookings with their related data
      const bookings = await prisma.booking.findMany({
        include: {
          course: {
            include: {
              enrollments: {
                where: {
                  studentId: {
                    equals: prisma.booking.fields.studentId
                  }
                },
                include: {
                  payments: {
                    orderBy: {
                      createdAt: 'desc'
                    },
                    take: 1
                  }
                }
              }
            }
          }
        }
      });

      for (const booking of bookings) {
        const enrollment = booking.course.enrollments[0];
        if (!enrollment) {
          result.inconsistencies.push({
            bookingId: booking.id,
            bookingStatus: booking.status,
            paymentStatus: 'NO_PAYMENT',
            enrollmentStatus: 'NO_ENROLLMENT',
            issue: 'No enrollment found for booking'
          });
          result.isValid = false;
          continue;
        }

        const latestPayment = enrollment.payments[0];

        // Check for inconsistencies
        if (latestPayment) {
          const inconsistency = this.checkStatusInconsistency(
            booking.status,
            latestPayment.status,
            enrollment.status,
            booking.id
          );
          
          if (inconsistency) {
            result.inconsistencies.push(inconsistency);
            result.isValid = false;
          }
        } else {
          // No payment but booking is in payment state
          if ([BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED].includes(booking.status as any)) {
            result.inconsistencies.push({
              bookingId: booking.id,
              bookingStatus: booking.status,
              paymentStatus: 'NO_PAYMENT',
              enrollmentStatus: enrollment.status,
              issue: 'Booking in payment state but no payment record exists'
            });
            result.isValid = false;
          }
        }
      }

      // Check for orphaned payments
      const orphanedPayments = await prisma.payment.findMany({
        where: {
          metadata: {
            path: ['bookingId'],
            not: null
          }
        }
      });

      for (const payment of orphanedPayments) {
        const bookingId = (payment.metadata as any)?.bookingId;
        if (bookingId) {
          const booking = await prisma.booking.findUnique({
            where: { id: bookingId }
          });
          
          if (!booking) {
            result.orphanedPayments.push({
              paymentId: payment.id,
              bookingId,
              issue: 'Payment references non-existent booking'
            });
            result.isValid = false;
          }
        }
      }

    } catch (error) {
      logger.error('Error during validation:');
      result.isValid = false;
    }

    return result;
  }

  /**
   * Checks for status inconsistency between booking and payment
   */
  private static checkStatusInconsistency(
    bookingStatus: string,
    paymentStatus: string,
    enrollmentStatus: string,
    bookingId: string
  ) {
    // Payment is COMPLETED but booking is not COMPLETED
    if (paymentStatus === 'COMPLETED' && bookingStatus !== BOOKING_STATES.COMPLETED) {
      return {
        bookingId,
        bookingStatus,
        paymentStatus,
        enrollmentStatus,
        issue: 'Payment COMPLETED but booking not COMPLETED'
      };
    }

    // Payment is PAID but booking is not COMPLETED
    if (paymentStatus === 'PAID' && bookingStatus !== BOOKING_STATES.COMPLETED) {
      return {
        bookingId,
        bookingStatus,
        paymentStatus,
        enrollmentStatus,
        issue: 'Payment PAID but booking not COMPLETED'
      };
    }

    // Payment is FAILED but booking is not FAILED
    if (paymentStatus === 'FAILED' && bookingStatus !== BOOKING_STATES.FAILED) {
      return {
        bookingId,
        bookingStatus,
        paymentStatus,
        enrollmentStatus,
        issue: 'Payment FAILED but booking not FAILED'
      };
    }

    // Payment is PENDING but booking is not in payment state
    if (paymentStatus === 'PENDING' && 
        ![BOOKING_STATES.PENDING, BOOKING_STATES.PAYMENT_INITIATED].includes(bookingStatus as any)) {
      return {
        bookingId,
        bookingStatus,
        paymentStatus,
        enrollmentStatus,
        issue: 'Payment PENDING but booking not in payment state'
      };
    }

    return null;
  }

  /**
   * Validates a specific booking-payment relationship
   */
  static async validateBooking(bookingId: string): Promise<{
    isValid: boolean;
    issues: string[];
    booking?: unknown;
    payment?: unknown;
    enrollment?: unknown;
  }> {
    const issues: string[] = [];

    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          course: {
            include: {
              enrollments: {
                where: {
                  studentId: {
                    equals: prisma.booking.fields.studentId
                  }
                },
                include: {
                  payments: {
                    orderBy: {
                      createdAt: 'desc'
                    },
                    take: 1
                  }
                }
              }
            }
          }
        }
      });

      if (!booking) {
        issues.push('Booking not found');
        return { isValid: false, issues };
      }

      const enrollment = booking.course.enrollments[0];
      if (!enrollment) {
        issues.push('No enrollment found for booking');
        return { isValid: false, issues, booking };
      }

      const payment = enrollment.payments[0];
      if (!payment) {
        if ([BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED].includes(booking.status as any)) {
          issues.push('Booking in payment state but no payment record exists');
        }
        return { isValid: issues.length === 0, issues, booking, enrollment };
      }

      // Check status consistency
      const inconsistency = this.checkStatusInconsistency(
        booking.status,
        payment.status,
        enrollment.status,
        bookingId
      );

      if (inconsistency) {
        issues.push(inconsistency.issue);
      }

      return {
        isValid: issues.length === 0,
        issues,
        booking,
        payment,
        enrollment
      };

    } catch (error) {
    console.error('Error occurred:', error);
      issues.push(`Validation error: ${error.message}`);
      return { isValid: false, issues };
    }
  }

  /**
   * Suggests the correct booking status based on payment status
   */
  static suggestBookingStatus(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'COMPLETED':
      case 'PAID':
        return BOOKING_STATES.COMPLETED;
      case 'FAILED':
        return BOOKING_STATES.FAILED;
      case 'PENDING':
        return BOOKING_STATES.PAYMENT_INITIATED;
      default:
        return BOOKING_STATES.PENDING;
    }
  }
} 