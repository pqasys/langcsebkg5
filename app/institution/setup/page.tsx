import { InstitutionForm } from '@/components/institution/InstitutionForm';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function InstitutionSetupPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { institution: true },
  });

  if (!user) {
    redirect('/auth/login');
  }

  // Allow users with existing institutions to update their profile
  // Only redirect if they have a complete institution profile
  if (user.institution && user.institution.name && user.institution.description) {
    redirect('/institution/dashboard');
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {user.institution ? 'Update Your Institution Profile' : 'Complete Your Institution Profile'}
        </h1>
        <p className="text-gray-600 mb-8">
          {user.institution 
            ? 'Update your institution details to keep your profile current and complete.'
            : 'Please provide your institution details to complete the setup process.'
          }
        </p>
        <InstitutionForm
          initialData={{ 
            email: user.email,
            ...(user.institution && {
              name: user.institution.name || '',
              description: user.institution.description || '',
              address: user.institution.address || '',
              city: user.institution.city || '',
              state: user.institution.state || '',
              country: user.institution.country || '',
              postcode: user.institution.postcode || '',
              website: user.institution.website || '',
              institutionEmail: user.institution.email || '',
              telephone: user.institution.telephone || '',
              contactName: user.institution.contactName || '',
              contactJobTitle: user.institution.contactJobTitle || '',
              contactPhone: user.institution.contactPhone || '',
              contactEmail: user.institution.contactEmail || '',
              logoUrl: user.institution.logoUrl || '',
              mainImageUrl: user.institution.mainImageUrl || '',
              facilities: user.institution.facilities || []
            })
          }}
          isSubmitting={false}
          onSubmit={async (data) => {
            'use server';
            const response = await fetch('/api/institution/setup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!response.ok) {
              throw new Error(`Failed to setup institution - Context: throw new Error('Failed to setup institution');...`);
            }

            redirect('/institution/dashboard');
          }}
        />
      </div>
    </div>
  );
} 