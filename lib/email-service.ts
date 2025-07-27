import { EmailService } from './email';

export interface InstitutionWelcomeEmailData {
  to: string;
  institutionName: string;
  adminEmail: string;
  temporaryPassword: string;
  contactName: string;
}

export async function sendInstitutionWelcomeEmail(data: InstitutionWelcomeEmailData) {
  const emailService = EmailService.getInstance();
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #333; text-align: center;">Welcome to Our Platform!</h1>
      
      <p>Dear ${data.contactName},</p>
      
      <p>Welcome to our language learning platform! Your institution <strong>${data.institutionName}</strong> has been successfully registered.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #007bff; margin-top: 0;">Your Login Credentials</h3>
        <p><strong>Email:</strong> ${data.adminEmail}</p>
        <p><strong>Temporary Password:</strong> ${data.temporaryPassword}</p>
      </div>
      
      <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
        <p style="margin: 0;"><strong>Important:</strong> For security reasons, you will be required to change your password on your first login.</p>
      </div>
      
      <p>You can now:</p>
      <ul>
        <li>Log in to your institution dashboard</li>
        <li>Set up your institution profile</li>
        <li>Create and manage courses</li>
        <li>Invite teachers and students</li>
      </ul>
      
      <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
      
      <p>Best regards,<br>The Platform Team</p>
    </div>
  `;

  return emailService.sendEmail({
    to: data.to,
    subject: `Welcome to Our Platform - ${data.institutionName}`,
    html,
  });
} 