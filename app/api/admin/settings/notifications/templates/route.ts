import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isBuildTime } from '@/lib/build-error-handler';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // First, get all templates without the problematic relations
    const templates = await prisma.notificationTemplate.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });

    // Then, get user information separately to avoid foreign key constraint issues
    const userIds = [...new Set([
      ...templates.map(t => t.createdBy),
      ...templates.map(t => t.updatedBy).filter(Boolean)
    ])];

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

    // Process templates with user information
    const processedTemplates = templates.map(template => ({
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
    }));

    return NextResponse.json(processedTemplates);
  } catch (error) {
    console.error('Error fetching notification templates:');
    return NextResponse.json(
      { message: 'Failed to fetch notification templates' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: Request) {
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
      isActive = true,
      isDefault = false
    } = data;

    // Validation
    if (!name || !type || !title || !content || !category) {
      return NextResponse.json(
        { message: 'Missing required fields: name, type, title, content, category' },
        { status: 400 }
      );
    }

    // Check if template with same name already exists
    const existingTemplate = await prisma.notificationTemplate.findUnique({
      where: { name }
    });

    if (existingTemplate) {
      return NextResponse.json(
        { message: 'Template with this name already exists' },
        { status: 409 }
      );
    }

    // Create the template
    const template = await prisma.notificationTemplate.create({
      data: {
        id: uuidv4(),
        name,
        type,
        subject,
        title,
        content,
        variables: variables ? JSON.stringify(variables) : null,
        category,
        isActive,
        isDefault,
        createdBy: session.user.id
      }
    });

    // Get user information separately
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    // Ensure createdByUser is properly set
    const processedTemplate = {
      ...template,
      createdByUser: user || {
        id: template.createdBy,
        name: session.user.name || 'Admin User',
        email: session.user.email || 'admin@example.com'
      }
    };

    return NextResponse.json(processedTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating notification template:');
    return NextResponse.json(
      { message: 'Failed to create notification template' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 