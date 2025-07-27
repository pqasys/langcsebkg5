import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const missingTemplates = [
  {
    name: 'quiz_passed',
    type: 'email',
    subject: 'Quiz Passed!',
    title: 'Quiz Passed!',
    content: `
      <h1>Congratulations! You Passed the Quiz</h1>
      <p>Dear {{name}},</p>
      <p>Great job! You've successfully passed the quiz: <strong>{{quizName}}</strong></p>
      <p>Quiz details:</p>
      <ul>
        <li>Module: {{moduleName}}</li>
        <li>Course: {{courseName}}</li>
        <li>Score: {{score}}</li>
        <li>Questions: {{totalQuestions}}</li>
        <li>Correct Answers: {{correctAnswers}}</li>
        <li>Time Taken: {{timeTaken}}</li>
      </ul>
      <p>Keep up the excellent work!</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'course',
    isDefault: true
  },
  {
    name: 'quiz_failed',
    type: 'email',
    subject: 'Quiz Result - Keep Learning!',
    title: 'Quiz Result - Keep Learning!',
    content: `
      <h1>Quiz Result</h1>
      <p>Dear {{name}},</p>
      <p>You've completed the quiz: <strong>{{quizName}}</strong></p>
      <p>Quiz details:</p>
      <ul>
        <li>Module: {{moduleName}}</li>
        <li>Course: {{courseName}}</li>
        <li>Score: {{score}}</li>
        <li>Questions: {{totalQuestions}}</li>
        <li>Correct Answers: {{correctAnswers}}</li>
        <li>Time Taken: {{timeTaken}}</li>
      </ul>
      <p>Don't worry! You can retake the quiz to improve your score. Review the module content and try again.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'course',
    isDefault: true
  },
  {
    name: 'achievement_unlocked',
    type: 'email',
    subject: 'Achievement Unlocked!',
    title: 'Achievement Unlocked!',
    content: `
      <h1>🎉 Achievement Unlocked!</h1>
      <p>Dear {{name}},</p>
      <p>Congratulations! You've earned a new achievement:</p>
      <div style="background-color: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #0066cc; margin-top: 0;">{{achievementName}}</h2>
        <p><strong>Description:</strong> {{achievementDescription}}</p>
        <p><strong>Type:</strong> {{type}}</p>
        <p><strong>Points Earned:</strong> {{points}}</p>
      </div>
      <p>Keep up the great work and continue your learning journey!</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'achievement',
    isDefault: true
  },
  {
    name: 'subscription_activated',
    type: 'email',
    subject: 'Subscription Activated',
    title: 'Subscription Activated',
    content: `
      <h1>Subscription Activated</h1>
      <p>Dear {{name}},</p>
      <p>Your subscription has been successfully activated!</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
      </ul>
      <p>You now have access to all the features included in your plan.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_cancelled',
    type: 'email',
    subject: 'Subscription Cancelled',
    title: 'Subscription Cancelled',
    content: `
      <h1>Subscription Cancelled</h1>
      <p>Dear {{name}},</p>
      <p>Your subscription has been cancelled as requested.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Previous Status: {{oldStatus}}</li>
        <li>New Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
        <li>Reason: {{reason}}</li>
      </ul>
      <p>You will continue to have access until the end of your current billing period.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_expired',
    type: 'email',
    subject: 'Subscription Expired',
    title: 'Subscription Expired',
    content: `
      <h1>Subscription Expired</h1>
      <p>Dear {{name}},</p>
      <p>Your subscription has expired.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Previous Status: {{oldStatus}}</li>
        <li>New Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
      </ul>
      <p>To continue accessing premium features, please renew your subscription.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_past_due',
    type: 'email',
    subject: 'Payment Past Due',
    title: 'Payment Past Due',
    content: `
      <h1>Payment Past Due</h1>
      <p>Dear {{name}},</p>
      <p>Your subscription payment is past due.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Previous Status: {{oldStatus}}</li>
        <li>New Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
      </ul>
      <p>Please update your payment method to avoid service interruption.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_trial',
    type: 'email',
    subject: 'Trial Started',
    title: 'Trial Started',
    content: `
      <h1>Trial Started</h1>
      <p>Dear {{name}},</p>
      <p>Your free trial has started!</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
      </ul>
      <p>Enjoy your trial period. You can upgrade to a paid plan at any time.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'subscription_update',
    type: 'email',
    subject: 'Subscription Updated',
    title: 'Subscription Updated',
    content: `
      <h1>Subscription Updated</h1>
      <p>Dear {{name}},</p>
      <p>Your subscription has been updated.</p>
      <p>Subscription details:</p>
      <ul>
        <li>Plan: {{planName}}</li>
        <li>Previous Status: {{oldStatus}}</li>
        <li>New Status: {{newStatus}}</li>
        <li>Effective Date: {{effectiveDate}}</li>
        <li>Reason: {{reason}}</li>
      </ul>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'subscription',
    isDefault: true
  },
  {
    name: 'account_update',
    type: 'email',
    subject: 'Account Updated',
    title: 'Account Updated',
    content: `
      <h1>Account Updated</h1>
      <p>Dear {{name}},</p>
      <p>Your account has been updated successfully.</p>
      <p>Update details:</p>
      <ul>
        <li>Update Type: {{updateType}}</li>
        <li>Update Date: {{updateDate}}</li>
        <li>Details: {{details}}</li>
      </ul>
      <p>If you didn't make this change, please contact support immediately.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'security',
    isDefault: true
  },
  {
    name: 'course_payment_reminder',
    type: 'email',
    subject: 'Course Payment Reminder',
    title: 'Course Payment Reminder',
    content: `
      <h1>Course Payment Reminder</h1>
      <p>Dear {{name}},</p>
      <p>This is a reminder that your course payment is due.</p>
      <p>Payment details:</p>
      <ul>
        <li>Course: {{courseName}}</li>
        <li>Amount: {{amount}}</li>
        <li>Due Date: {{dueDate}}</li>
        <li>Days Remaining: {{daysRemaining}}</li>
      </ul>
      <p>Please complete your payment to maintain access to the course.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'payment',
    isDefault: true
  },
  {
    name: 'subscription_payment_reminder',
    type: 'email',
    subject: 'Subscription Payment Reminder',
    title: 'Subscription Payment Reminder',
    content: `
      <h1>Subscription Payment Reminder</h1>
      <p>Dear {{name}},</p>
      <p>This is a reminder that your subscription payment is due.</p>
      <p>Payment details:</p>
      <ul>
        <li>Plan: {{subscriptionPlan}}</li>
        <li>Amount: {{amount}}</li>
        <li>Due Date: {{dueDate}}</li>
        <li>Days Remaining: {{daysRemaining}}</li>
      </ul>
      <p>Please update your payment method to avoid service interruption.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'payment',
    isDefault: true
  },
  {
    name: 'module_completion',
    type: 'email',
    subject: 'Module Completed!',
    title: 'Module Completed!',
    content: `
      <h1>Module Completed!</h1>
      <p>Dear {{name}},</p>
      <p>Congratulations! You've completed the module: <strong>{{moduleName}}</strong></p>
      <p>Module details:</p>
      <ul>
        <li>Course: {{courseName}}</li>
        <li>Progress: {{progress}}</li>
        <li>Content Completed: {{completedContent}}/{{totalContent}}</li>
      </ul>
      <p>Keep up the great work!</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'course',
    isDefault: true
  },
  {
    name: 'learning_streak',
    type: 'email',
    subject: 'Learning Streak Milestone!',
    title: 'Learning Streak Milestone!',
    content: `
      <h1>🔥 Learning Streak Milestone!</h1>
      <p>Dear {{name}},</p>
      <p>Amazing! You've reached a learning streak milestone!</p>
      <p>Streak details:</p>
      <ul>
        <li>Current Streak: {{currentStreak}} days</li>
        <li>Previous Best: {{previousStreak}} days</li>
        <li>Milestone: {{milestone}} days</li>
      </ul>
      <p>Keep the momentum going! Consistency is key to learning success.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'achievement',
    isDefault: true
  },
  {
    name: 'payment_failed',
    type: 'email',
    subject: 'Payment Failed',
    title: 'Payment Failed',
    content: `
      <h1>Payment Failed</h1>
      <p>Dear {{name}},</p>
      <p>We're sorry, but your payment has failed.</p>
      <p>Payment details:</p>
      <ul>
        <li>Amount: {{amount}}</li>
        <li>Reference: {{referenceNumber}}</li>
        <li>Course: {{courseName}}</li>
        <li>Date: {{date}}</li>
        <li>Error: {{error}}</li>
      </ul>
      <p>Please check your payment method and try again. If the problem persists, please contact support.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'payment',
    isDefault: true
  },
  {
    name: 'refund_confirmation',
    type: 'email',
    subject: 'Refund Confirmation',
    title: 'Refund Confirmation',
    content: `
      <h1>Refund Confirmation</h1>
      <p>Dear {{name}},</p>
      <p>Your refund has been processed successfully.</p>
      <p>Refund details:</p>
      <ul>
        <li>Original Amount: {{originalAmount}}</li>
        <li>Refund Amount: {{refundAmount}}</li>
        <li>Reference: {{referenceNumber}}</li>
        <li>Course: {{courseName}}</li>
        <li>Refund Date: {{refundedAt}}</li>
      </ul>
      <p>The refund will be credited to your original payment method within 5-10 business days.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'payment',
    isDefault: true
  },
  {
    name: 'course_enrollment',
    type: 'email',
    subject: 'Course Enrollment Confirmation',
    title: 'Course Enrollment Confirmation',
    content: `
      <h1>Course Enrollment Confirmation</h1>
      <p>Dear {{name}},</p>
      <p>You have successfully enrolled in a new course!</p>
      <p>Enrollment details:</p>
      <ul>
        <li>Course: {{courseName}}</li>
        <li>Institution: {{institutionName}}</li>
        <li>Amount: {{amount}}</li>
        <li>Start Date: {{startDate}}</li>
        <li>End Date: {{endDate}}</li>
      </ul>
      <p>Please complete your payment to access the course content.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'course',
    isDefault: true
  },
  {
    name: 'course_completion_reminder',
    type: 'email',
    subject: 'Almost There! Complete Your Course',
    title: 'Almost There! Complete Your Course',
    content: `
      <h1>You're Almost There!</h1>
      <p>Dear {{name}},</p>
      <p>Great progress! You're very close to completing your course.</p>
      <p>Course details:</p>
      <ul>
        <li>Course: {{courseName}}</li>
        <li>Current Progress: {{progress}}</li>
        <li>Remaining: {{remainingContent}}</li>
      </ul>
      <p>Keep up the momentum! You're so close to earning your certificate.</p>
      <p>Best regards,<br>The Team</p>
    `,
    category: 'course',
    isDefault: true
  }
];

async function addMissingTemplates() {
  try {
    console.log('Adding missing notification templates...');
    
    for (const template of missingTemplates) {
      // Check if template already exists
      const existingTemplate = await prisma.notificationTemplate.findFirst({
        where: { name: template.name }
      });

      if (existingTemplate) {
        console.log(`Template '${template.name}' already exists, skipping...`);
        continue;
      }

      // Create the template
      await prisma.notificationTemplate.create({
        data: {
          id: uuidv4(),
          name: template.name,
          type: template.type,
          subject: template.subject,
          title: template.title,
          content: template.content,
          isActive: true,
          isDefault: template.isDefault,
          category: template.category,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'SYSTEM'
        }
      });

      console.log(` Added template: ${template.name}`);
    }

    console.log('🎉 All missing notification templates have been added successfully!');
  } catch (error) {
    console.error('❌ Error adding notification templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addMissingTemplates(); 