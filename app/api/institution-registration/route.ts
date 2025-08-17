import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendInstitutionWelcomeEmail } from '@/lib/email-service';
import { auditLog } from '@/lib/audit-logger';
const prisma = new PrismaClient();

// Function to generate a URL-friendly slug from institution name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to ensure slug uniqueness
async function ensureUniqueSlug(baseSlug: string, prisma: PrismaClient): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existing = await prisma.institution.findFirst({
      where: { slug: slug }
    });
    
    if (!existing) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Validation schema for institution registration
const institutionRegistrationSchema = z.object({
  name: z.string().min(1, 'Institution name is required'),
  email: z.string().email('Invalid email address'),
  institutionEmail: z.string().email('Invalid institution email').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State/Province is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().min(1, 'Address is required'),
  postcode: z.string().optional(),
  telephone: z.string().min(1, 'Telephone is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  contactJobTitle: z.string().min(1, 'Contact job title is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  contactEmail: z.string().email('Invalid contact email').optional(),
});

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = institutionRegistrationSchema.parse(body);
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check if institution name already exists
    const existingInstitution = await prisma.institution.findFirst({
      where: { name: validatedData.name },
    });

    if (existingInstitution) {
      return NextResponse.json(
        { error: 'An institution with this name already exists' },
        { status: 400 }
      );
    }

    // Generate temporary password
    const temporaryPassword = generateTemporaryPassword();
    const hashedPassword = await hash(temporaryPassword, 12);

    // Generate unique slug for the institution
    const baseSlug = generateSlug(validatedData.name);
    const uniqueSlug = await ensureUniqueSlug(baseSlug, prisma);

    // Create institution and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the institution
      const institution = await tx.institution.create({
        data: {
          name: validatedData.name,
          slug: uniqueSlug, // Add the unique slug
          email: validatedData.institutionEmail || validatedData.email,
          website: validatedData.website || null,
          description: validatedData.description,
          country: validatedData.country,
          state: validatedData.state,
          city: validatedData.city,
          address: validatedData.address,
          postcode: validatedData.postcode || null,
          telephone: validatedData.telephone,
          contactName: validatedData.contactName,
          contactJobTitle: validatedData.contactJobTitle,
          contactPhone: validatedData.contactPhone,
          contactEmail: validatedData.contactEmail || null,
          status: 'PENDING_APPROVAL',
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create the user account
      const user = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          role: 'INSTITUTION',
          institutionId: institution.id,
          isActive: true,
          forcePasswordReset: true, // Force password reset on first login
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return { institution, user };
    });

    // Send welcome email with temporary credentials
    try {
      await sendInstitutionWelcomeEmail({
        to: validatedData.email,
        institutionName: validatedData.name,
        adminEmail: validatedData.email,
        temporaryPassword,
        contactName: validatedData.contactName,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:');
      // Don't fail the registration if email fails
    }

    // Log the registration
    await auditLog({
      action: 'INSTITUTION_REGISTERED',
      userId: result.user.id,
      institutionId: result.institution.id,
      details: {
        institutionName: validatedData.name,
        adminEmail: validatedData.email,
        registrationMethod: 'public',
      },
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      message: 'Institution registered successfully',
      institutionId: result.institution.id,
      userId: result.user.id,
    });

  } catch (error) {
    console.error('Institution registration error:');
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to register institution' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 