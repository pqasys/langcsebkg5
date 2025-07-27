import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendInstitutionWelcomeEmail } from '@/lib/email-service';
import { auditLog } from '@/lib/audit-logger';
const prisma = new PrismaClient();

// Validation schema for simplified institution creation
const simplifiedInstitutionSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required'),
  adminEmail: z.string().email('Invalid email address'),
  adminName: z.string().min(1, 'Admin name is required'),
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
    const validatedData = simplifiedInstitutionSchema.parse(body);
    
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.adminEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check if institution name already exists
    const existingInstitution = await prisma.institution.findFirst({
      where: { name: validatedData.institutionName },
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

    // Create institution and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the institution with default values
      const institution = await tx.institution.create({
        data: {
          name: validatedData.institutionName,
          email: validatedData.adminEmail, // Use admin email as institution email
          website: null,
          description: `${validatedData.institutionName} - Language learning institution. Details to be updated by admin.`,
          country: 'United States', // Default country
          state: 'California', // Default state
          city: 'San Francisco', // Default city
          address: 'Address to be updated by admin',
          postcode: null,
          telephone: 'Phone to be updated by admin',
          contactName: validatedData.adminName,
          contactJobTitle: 'Administrator',
          contactPhone: 'Phone to be updated by admin',
          contactEmail: validatedData.adminEmail,
          status: 'ACTIVE', // Set as active since admin created it
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create the user account
      const user = await tx.user.create({
        data: {
          email: validatedData.adminEmail,
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
        to: validatedData.adminEmail,
        institutionName: validatedData.institutionName,
        adminEmail: validatedData.adminEmail,
        temporaryPassword,
        contactName: validatedData.adminName,
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:');
      // Don't fail the creation if email fails
    }

    // Log the creation
    await auditLog({
      action: 'INSTITUTION_CREATED_BY_ADMIN',
      userId: result.user.id,
      institutionId: result.institution.id,
      details: {
        institutionName: validatedData.institutionName,
        adminEmail: validatedData.adminEmail,
        adminName: validatedData.adminName,
        creationMethod: 'admin_simple',
      },
      ipAddress: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      success: true,
      message: 'Institution created successfully',
      institutionId: result.institution.id,
      userId: result.user.id,
    });

  } catch (error) {
    console.error('Simplified institution creation error:');
    
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
      { error: 'Failed to create institution' },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 