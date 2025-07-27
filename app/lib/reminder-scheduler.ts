import { prisma } from './prisma';
import { Resend } from 'resend';
import { generateEmailTemplate } from './invoice-templates';
// import { toast } from 'sonner';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReminderSchedule {
  daysBeforeDue: number;
  template: 'FIRST_REMINDER' | 'SECOND_REMINDER' | 'FINAL_REMINDER';
  subject: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
}

const REMINDER_SCHEDULE: ReminderSchedule[] = [
  {
    daysBeforeDue: 14,
    template: 'FIRST_REMINDER',
    subject: 'Payment Reminder: Your Course Enrollment',
    urgency: 'LOW',
  },
  {
    daysBeforeDue: 7,
    template: 'SECOND_REMINDER',
    subject: 'Urgent: Payment Due Next Week',
    urgency: 'MEDIUM',
  },
  {
    daysBeforeDue: 3,
    template: 'FINAL_REMINDER',
    subject: 'Final Notice: Payment Due Immediately',
    urgency: 'HIGH',
  },
];

export async function scheduleReminders() {
  try {
    const pendingEnrollments = await prisma.studentCourseEnrollment.findMany({
      where: {
        paymentStatus: 'PENDING',
        status: 'PENDING_PAYMENT',
      },
      include: {
        student: {
          select: {
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            title: true,
            institution: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    const today = new Date();
    const remindersToSend = [];

    for (const enrollment of pendingEnrollments) {
      const dueDate = new Date(enrollment.startDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Find applicable reminder schedule
      const schedule = REMINDER_SCHEDULE.find(s => s.daysBeforeDue === daysUntilDue);
      if (!schedule) continue;

      // Check if reminder was already sent
      const existingReminder = await prisma.paymentReminder.findFirst({
        where: {
          enrollmentId: enrollment.id,
          reminderType: schedule.template,
        },
      });

      if (!existingReminder) {
        remindersToSend.push({
          enrollment,
          schedule,
          daysUntilDue,
        });
      }
    }

    // Send reminders
    for (const { enrollment, schedule, daysUntilDue } of remindersToSend) {
      const reminderOptions = {
        primaryColor: schedule.urgency === 'HIGH' ? '#FF0000' : 
                     schedule.urgency === 'MEDIUM' ? '#FFA500' : '#000000',
        paymentInstructions: `This is a ${schedule.urgency.toLowerCase()} priority reminder that payment of $${enrollment.paymentAmount} is due in ${daysUntilDue} days.`,
        termsAndConditions: 'Please ensure payment is completed before the course start date to maintain your enrollment.',
        footerText: schedule.urgency === 'HIGH' ? 
          'This is your final reminder. Please process payment immediately to secure your enrollment.' :
          'We look forward to having you in our course!',
      };

      const emailHtml = generateEmailTemplate(enrollment, reminderOptions);

      await resend.emails.send({
        from: 'noreply@yourdomain.com',
        to: enrollment.student.email,
        subject: schedule.subject,
        html: emailHtml,
      });

      // Record reminder
      await prisma.paymentReminder.create({
        data: {
          enrollmentId: enrollment.id,
          sentAt: new Date(),
          sentBy: 'SYSTEM',
          reminderType: schedule.template,
          daysUntilDue,
        },
      });
    }

    return {
      processed: pendingEnrollments.length,
      sent: remindersToSend.length,
    };
  } catch (error) {
    console.error('Error scheduling reminders:', error);
    throw error;
  }
} 