import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const template = await prisma.notificationTemplate.findUnique({
      where: { id: params.id }
    });

    if (!template) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    // Get user information separately to avoid foreign key constraint issues
    const userIds = [template.createdBy, template.updatedBy].filter(Boolean);
    
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const userMap = new Map(users.map(user => [user.id, user]));

    // Process template with user information
    const processedTemplate = {
      ...template,
      createdByUser: userMap.get(template.createdBy) || {
        id: template.createdBy,
        name: 'Unknown User',
        email: 'unknown@example.com'
      },
      updatedByUser: template.updatedBy ? (userMap.get(template.updatedBy) || {
        id: template.updatedBy,
        name: 'Unknown User',
        email: 'unknown@example.com'
      }) : null
    };

    return NextResponse.json(processedTemplate);
  } catch (error) {
    console.error('Error fetching notification template:');
    return NextResponse.json(
      { message: 'Failed to fetch notification template' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    if (!data) throw new Error('Request body is required');;
    const {
      name,
      type,
      subject,
      title,
      content,
      variables,
      category,
      isActive,
      isDefault
    } = data;

    // Check if template exists
    const existingTemplate = await prisma.notificationTemplate.findUnique({
      where: { id: params.id }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    // If name is being changed, check for conflicts
    if (name && name !== existingTemplate.name) {
      const nameConflict = await prisma.notificationTemplate.findUnique({
        where: { name }
      });

      if (nameConflict) {
        return NextResponse.json(
          { message: 'Template with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update the template
    const updatedTemplate = await prisma.notificationTemplate.update({
      where: { id: params.id },
      data: {
        name,
        type,
        subject,
        title,
        content,
        variables: variables ? JSON.stringify(variables) : null,
        category,
        isActive,
        isDefault,
        updatedBy: session.user.id
      }
    });

    // Get user information separately
    const userIds = [updatedTemplate.createdBy, updatedTemplate.updatedBy].filter(Boolean);
    
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const userMap = new Map(users.map(user => [user.id, user]));

    // Process template with user information
    const processedTemplate = {
      ...updatedTemplate,
      createdByUser: userMap.get(updatedTemplate.createdBy) || {
        id: updatedTemplate.createdBy,
        name: 'Unknown User',
        email: 'unknown@example.com'
      },
      updatedByUser: updatedTemplate.updatedBy ? (userMap.get(updatedTemplate.updatedBy) || {
        id: updatedTemplate.updatedBy,
        name: 'Unknown User',
        email: 'unknown@example.com'
      }) : null
    };

    // // // // // // console.log('Notification template updated successfully');
    return NextResponse.json(processedTemplate);
  } catch (error) {
    console.error('Error updating notification template:');
    return NextResponse.json(
      { message: 'Failed to update notification template' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if template exists
    const existingTemplate = await prisma.notificationTemplate.findUnique({
      where: { id: params.id }
    });

    if (!existingTemplate) {
      return NextResponse.json(
        { message: 'Template not found' },
        { status: 404 }
      );
    }

    // Check if template is default (prevent deletion of default templates)
    if (existingTemplate.isDefault) {
      return NextResponse.json(
        { message: 'Cannot delete default templates' },
        { status: 400 }
      );
    }

    // Check if template has associated logs
    const logCount = await prisma.notificationLog.count({
      where: { templateId: params.id }
    });

    if (logCount > 0) {
      return NextResponse.json(
        { message: `Cannot delete template. It has ${logCount} associated notification logs.` },
        { status: 400 }
      );
    }

    // Delete the template
    await prisma.notificationTemplate.delete({
      where: { id: params.id }
    });

    console.log('Notification template deleted successfully');
    return NextResponse.json(
      { message: 'Template deleted successfully' }
    );
  } catch (error) {
    console.error('Error deleting notification template:');
    return NextResponse.json(
      { message: 'Failed to delete notification template' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 