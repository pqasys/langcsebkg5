import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { hash } from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { emailService } from '@/lib/email';
import { generateSecurePassword } from '@/lib/auth-utils';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only admin can access all institutions
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can access all institutions' },
        { status: 403 }
      );
    }

    // Get all institutions
    const institutions = await prisma.institution.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        institutionEmail: true,
        description: true,
        country: true,
        city: true,
        address: true,
        telephone: true,
        contactName: true,
        contactJobTitle: true,
        contactPhone: true,
        contactEmail: true,
        logoUrl: true,
        facilities: true,
        status: true,
        isApproved: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            bookings: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(institutions);
  } catch (error) {
    console.error('Error fetching institutions:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch institutions',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // // // // // // // // // // // // // // // // // // // // // console.log('Session in POST:', session);
    
    if (!session?.user) {
      console.log('No session found in POST');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user.role || session.user.role !== 'ADMIN') {
      console.log('User is not admin in POST:', session.user.role);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Request body:', body);

    const {
      name,
      email,
      institutionEmail,
      website,
      description,
      country,
      city,
      state,
      postcode,
      address,
      telephone,
      contactName,
      contactJobTitle,
      contactPhone,
      contactEmail,
    } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Generate a secure temporary password for the institution admin
    const tempPassword = generateSecurePassword(12);
    const hashedPassword = await hash(tempPassword, 12);

    try {
      // Create institution and admin user in a transaction
      const result = await prisma.$transaction(async (tx) => {
        const now = new Date();
        
        // Create the institution first
        const institution = await tx.institution.create({
          data: {
            id: uuidv4(),
            name,
            description: description || '',
            country: country || '',
            city: city || '',
            state: state || '',
            postcode: postcode || '',
            address: address || '',
            telephone: telephone || '',
            contactName: contactName || '',
            contactJobTitle: contactJobTitle || '',
            contactPhone: contactPhone || '',
            contactEmail: contactEmail || '',
            institutionEmail: institutionEmail || '',
            website: website || '',
            status: 'ACTIVE',
            createdAt: now,
            updatedAt: now,
            email: email,
            logoUrl: null, // Initialize logoUrl as null
          },
        });

        console.log('Created institution:', institution);

        // Create the institution admin user with force password reset
        const user = await tx.user.create({
          data: {
            id: uuidv4(),
            email,
            password: hashedPassword,
            role: 'INSTITUTION',
            name: name,
            createdAt: now,
            updatedAt: now,
            institutionId: institution.id, // Link the user to the institution
            forcePasswordReset: true, // Force password reset on first login
          },
        });

        console.log('Created user:', user);

        return { user, institution };
      });

      // Send welcome email with temporary password
      try {
        await emailService.sendEmail({
          to: email,
          subject: 'Welcome to Our Platform - Your Institution Account',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333; text-align: center;">Welcome to Our Platform!</h1>
              
              <p>Dear ${name},</p>
              
              <p>Your institution account has been successfully created. Here are your login credentials:</p>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #333;">Login Information</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Temporary Password:</strong> <span style="font-family: monospace; background-color: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #ddd;">${tempPassword}</span></p>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin-top: 0; color: #856404;">⚠️ Important Security Notice</h4>
                <p style="margin-bottom: 0; color: #856404;">
                  For security reasons, you will be required to change your password on your first login. 
                  Please keep this temporary password safe until you can log in and set a new password.
                </p>
              </div>
              
              <p>You can now access your institution dashboard and start managing your courses and students.</p>
              
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              
              <p>Best regards,<br>The Platform Team</p>
            </div>
          `,
        });
        console.log('Welcome email sent successfully to:', email);
      } catch (emailError) {
        console.error('Failed to send welcome email:');
        // Don't fail the entire operation if email fails
      }

      return NextResponse.json({
        id: result.institution.id,
        name: result.institution.name,
        email: result.user.email,
        message: 'Institution created successfully',
      });
    } catch (dbError) {
      console.error('Database error:');
      return NextResponse.json(
        { 
          error: 'Database operation failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
      );
    }
  } catch (error) {
    console.error('Error creating institution:');
    return NextResponse.json(
      { 
        error: 'Failed to create institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isApproved, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Institution ID is required' },
        { status: 400 }
      );
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: {
        isApproved: isApproved ?? undefined,
        status: status ?? undefined,
      },
    });

    return NextResponse.json({
      message: 'Institution updated successfully',
      institution: updatedInstitution,
    });
  } catch (error) {
    console.error('Error updating institution:');
    return NextResponse.json(
      { 
        error: 'Failed to update institution',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' }
    );
  }
} 