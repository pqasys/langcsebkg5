import { prisma } from '@/lib/prisma';

// Define valid state transitions
export const ENROLLMENT_STATES = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  ENROLLED: 'ENROLLED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;

export const PAYMENT_STATES = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED'
} as const;

export const BOOKING_STATES = {
  PENDING: 'PENDING',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
} as const;

// Define valid state transitions
const VALID_ENROLLMENT_TRANSITIONS = {
  [ENROLLMENT_STATES.PENDING_PAYMENT]: [ENROLLMENT_STATES.PAYMENT_INITIATED, ENROLLMENT_STATES.CANCELLED],
  [ENROLLMENT_STATES.PAYMENT_INITIATED]: [ENROLLMENT_STATES.ENROLLED, ENROLLMENT_STATES.FAILED],
  [ENROLLMENT_STATES.ENROLLED]: [],
  [ENROLLMENT_STATES.FAILED]: [ENROLLMENT_STATES.PAYMENT_INITIATED, ENROLLMENT_STATES.CANCELLED],
  [ENROLLMENT_STATES.CANCELLED]: []
};

const VALID_PAYMENT_TRANSITIONS = {
  [PAYMENT_STATES.PENDING]: [PAYMENT_STATES.PAID, PAYMENT_STATES.FAILED],
  [PAYMENT_STATES.PAID]: [],
  [PAYMENT_STATES.FAILED]: [PAYMENT_STATES.PENDING]
};

const VALID_BOOKING_TRANSITIONS = {
  [BOOKING_STATES.PENDING]: [BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.CANCELLED],
  [BOOKING_STATES.PAYMENT_INITIATED]: [BOOKING_STATES.COMPLETED, BOOKING_STATES.FAILED],
  [BOOKING_STATES.COMPLETED]: [],
  [BOOKING_STATES.FAILED]: [BOOKING_STATES.PAYMENT_INITIATED, BOOKING_STATES.CANCELLED],
  [BOOKING_STATES.CANCELLED]: []
};

export class EnrollmentStateManager {
  static validateStateTransition(
    currentState: string,
    newState: string,
    type: 'enrollment' | 'payment' | 'booking'
  ): boolean {
    const transitions = {
      enrollment: VALID_ENROLLMENT_TRANSITIONS,
      payment: VALID_PAYMENT_TRANSITIONS,
      booking: VALID_BOOKING_TRANSITIONS
    }[type];

    return transitions[currentState]?.includes(newState) ?? false;
  }

  static async validateEnrollmentState(enrollmentId: string): Promise<boolean> {
    const enrollment = await prisma.studentCourseEnrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        course: {
          include: {
            bookings: {
              where: { studentId: enrollmentId },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!enrollment) return false;

    const latestPayment = enrollment.payments[0];
    const latestBooking = enrollment.course.bookings[0];

    // Validate state consistency
    const isPaymentStateValid = !latestPayment || 
      this.validateStateTransition(latestPayment.status, enrollment.paymentStatus, 'payment');
    
    const isBookingStateValid = !latestBooking || 
      this.validateStateTransition(latestBooking.status, enrollment.status, 'booking');

    return isPaymentStateValid && isBookingStateValid;
  }

  static async updateEnrollmentState(
    enrollmentId: string,
    newState: string,
    metadata: unknown = {}
  ) {
    return prisma.$transaction(async (tx) => {
      const enrollment = await tx.studentCourseEnrollment.findUnique({
        where: { id: enrollmentId },
        include: {
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      });

      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      if (!this.validateStateTransition(enrollment.status, newState, 'enrollment')) {
        throw new Error('Invalid state transition from ' + enrollment.status + ' to ' + newState);
      }

      // Update enrollment with optimistic locking
      const updatedEnrollment = await tx.studentCourseEnrollment.update({
        where: {
          id: enrollmentId,
          version: enrollment.version
        },
        data: {
          status: newState,
          version: { increment: 1 },
          stateVersion: { increment: 1 },
          ...metadata
        }
      });

      return updatedEnrollment;
    });
  }

  static async updatePaymentState(
    paymentId: string,
    newState: string,
    metadata: unknown = {}
  ) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({
        where: { id: paymentId }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      if (!this.validateStateTransition(payment.status, newState, 'payment')) {
        throw new Error('Invalid state transition from ' + payment.status + ' to ' + newState);
      }

      // Update payment with optimistic locking
      const updatedPayment = await tx.payment.update({
        where: {
          id: paymentId,
          version: payment.version
        },
        data: {
          status: newState,
          version: { increment: 1 },
          stateVersion: { increment: 1 },
          ...metadata
        }
      });

      return updatedPayment;
    });
  }

  static async updateBookingState(
    bookingId: string,
    newState: string,
    metadata: unknown = {}
  ) {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId }
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      if (!this.validateStateTransition(booking.status, newState, 'booking')) {
        throw new Error('Invalid state transition from ' + booking.status + ' to ' + newState);
      }

      // Update booking with optimistic locking
      const updatedBooking = await tx.booking.update({
        where: {
          id: bookingId,
          version: booking.version
        },
        data: {
          status: newState,
          version: { increment: 1 },
          stateVersion: { increment: 1 },
          ...metadata
        }
      });

      return updatedBooking;
    });
  }
} 