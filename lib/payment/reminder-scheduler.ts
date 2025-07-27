import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/email';
import { PaymentStatus } from '@prisma/client';
import { logger, logError } from '../logger';

interface ReminderSchedule {
  daysBeforeDue: number;
  template: 'FIRST_REMINDER' | 'SECOND_REMINDER' | 'FINAL_REMINDER';
  subject: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class ReminderScheduler {
  private static readonly REMINDER_SCHEDULES: ReminderSchedule[] = [
    {
      daysBeforeDue: 7,
      template: 'FIRST_REMINDER',
      subject: 'Payment Reminder: Your Course Payment is Due Soon',
      urgency: 'LOW',
    },
    {
      daysBeforeDue: 3,
      template: 'SECOND_REMINDER',
      subject: 'Urgent: Course Payment Due in 3 Days',
      urgency: 'MEDIUM',
    },
    {
      daysBeforeDue: 1,
      template: 'FINAL_REMINDER',
      subject: 'Final Notice: Course Payment Due Tomorrow',
      urgency: 'HIGH',
    },
  ];

  static async processPaymentReminders() {
    try {
      const pendingPayments = await prisma.payment.findMany({
        where: {
          status: PaymentStatus.PENDING,
          enrollment: {
            paymentStatus: 'PENDING',
          },
        },
        include: {
          enrollment: {
            include: {
              student: true,
              course: true,
            },
          },
        },
      });

      const today = new Date();
      const remindersSent: string[] = [];

      for (const payment of pendingPayments) {
        const dueDate = new Date(payment.paymentDetails?.dueDate || payment.createdAt);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        // Find applicable reminder schedule
        const schedule = this.REMINDER_SCHEDULES.find(
          (s) => s.daysBeforeDue === daysUntilDue
        );

        if (schedule) {
          // Check if a reminder was already sent for this schedule
          const existingReminder = await prisma.paymentReminder.findFirst({
            where: {
              paymentId: payment.id,
              reminderType: schedule.template,
            },
          });

          if (!existingReminder) {
            // Send reminder email
            await emailService.sendPaymentReminderEmail(
              payment.enrollment.student.email,
              payment.enrollment.student.name,
              {
                amount: payment.amount,
                currency: payment.currency,
                dueDate,
                daysRemaining: daysUntilDue,
                courseName: payment.enrollment.course.title,
                urgency: schedule.urgency,
              }
            );

            // Record reminder sent
            await prisma.paymentReminder.create({
              data: {
                paymentId: payment.id,
                enrollmentId: payment.enrollmentId,
                reminderType: schedule.template,
                sentAt: new Date(),
                daysUntilDue,
                metadata: {
                  schedule,
                },
              },
            });

            remindersSent.push(payment.id);
          }
        }
      }

      return {
        success: true,
        remindersSent: remindersSent.length,
        paymentIds: remindersSent,
      };
    } catch (error) {
      logger.error('Error processing payment reminders:');
      throw error;
    }
  }

  static async getReminderHistory(paymentId: string) {
    try {
      const reminders = await prisma.paymentReminder.findMany({
        where: {
          paymentId,
        },
        orderBy: {
          sentAt: 'desc',
        },
      });

      return reminders;
    } catch (error) {
      logger.error('Error fetching reminder history:');
      throw error;
    }
  }
} 