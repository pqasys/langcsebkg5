import { prisma } from '../lib/prisma';
import { v4 as uuidv4 } from 'uuid';

const connectionTemplates = [
  {
    name: 'connection_request_received',
    type: 'email',
    subject: 'New Connection Request from {{senderName}}',
    title: 'New Connection Request',
    content: `
      <h1>You have a new connection request!</h1>
      <p>Dear {{receiverName}},</p>
      <p><strong>{{senderName}}</strong> would like to connect with you on FluentShip.</p>
      <p>Message: {{message}}</p>
      <p>Click the link below to view and respond to this request:</p>
      <p><a href="{{connectionRequestUrl}}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Connection Request</a></p>
      <p>Best regards,<br>The FluentShip Team</p>
    `,
    category: 'connection',
    isDefault: true
  },
  {
    name: 'connection_request_accepted',
    type: 'email',
    subject: '{{receiverName}} accepted your connection request!',
    title: 'Connection Request Accepted',
    content: `
      <h1>Great news! Your connection request was accepted</h1>
      <p>Dear {{senderName}},</p>
      <p><strong>{{receiverName}}</strong> has accepted your connection request on FluentShip.</p>
      <p>You can now:</p>
      <ul>
        <li>Send messages to each other</li>
        <li>See each other's learning progress</li>
        <li>Join study groups together</li>
        <li>Practice languages together</li>
      </ul>
      <p>Click the link below to view their profile:</p>
      <p><a href="{{receiverProfileUrl}}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Profile</a></p>
      <p>Best regards,<br>The FluentShip Team</p>
    `,
    category: 'connection',
    isDefault: true
  },
  {
    name: 'connection_request_declined',
    type: 'email',
    subject: 'Connection request update',
    title: 'Connection Request Declined',
    content: `
      <h1>Connection Request Update</h1>
      <p>Dear {{senderName}},</p>
      <p>Unfortunately, <strong>{{receiverName}}</strong> has declined your connection request on FluentShip.</p>
      <p>Don't worry! You can still:</p>
      <ul>
        <li>Connect with other language learners</li>
        <li>Join study groups and clubs</li>
        <li>Participate in community discussions</li>
        <li>Continue your language learning journey</li>
      </ul>
      <p>Keep learning and connecting with the FluentShip community!</p>
      <p>Best regards,<br>The FluentShip Team</p>
    `,
    category: 'connection',
    isDefault: true
  },
  {
    name: 'new_connection_notification',
    type: 'system',
    subject: null,
    title: 'New Connection: {{connectionName}}',
    content: `
      <p>You are now connected with <strong>{{connectionName}}</strong>!</p>
      <p>You can now send messages, see each other's learning progress, and join study groups together.</p>
      <p><a href="{{connectionProfileUrl}}">View Profile</a></p>
    `,
    category: 'connection',
    isDefault: true
  }
];

async function addConnectionNotificationTemplates() {
  try {
    console.log('Adding connection notification templates...');
    
    for (const template of connectionTemplates) {
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

      console.log(`✅ Added template: ${template.name}`);
    }

    console.log('🎉 All connection notification templates have been added successfully!');
  } catch (error) {
    console.error('❌ Error adding connection notification templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addConnectionNotificationTemplates();
