import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { notificationService } from '@/lib/notification';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      templateId,
      recipientId,
      recipientEmail,
      recipientName,
      type,
      subject,
      title,
      content,
      variables,
      isTest = false
    } = body;

    // Validate required fields
    if (!recipientEmail || !recipientName || !type || !title || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // If using a template, validate it exists
    let template = null;
    if (templateId) {
      template = await prisma.notificationTemplate.findUnique({
        where: { id: templateId }
      });

      if (!template) {
        return NextResponse.json(
          { message: 'Template not found' },
          { status: 404 }
        );
      }
    }

    // Send the notification
    const notificationLog = await notificationService.sendNotification({
      recipientId: recipientId || 'test',
      recipientEmail,
      recipientName,
      templateId,
      type,
      subject,
      title,
      content,
      metadata: {
        isTest,
        variables,
        sentBy: session.user.id
      },
      createdBy: session.user.id
    });

    return NextResponse.json({
      message: isTest ? 'Test notification sent successfully' : 'Notification sent successfully',
      notificationLog
    });
  } catch (error) {
    console.error('Error sending notification:');
    return NextResponse.json(
      { message: 'Failed to send notification' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 