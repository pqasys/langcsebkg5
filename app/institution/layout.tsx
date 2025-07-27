import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { BookOpen, Users, Building2, Settings, School, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import InstitutionSidebar from '@/components/institution/InstitutionSidebar';

export default async function InstitutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'INSTITUTION') {
    redirect('/auth/signin');
  }

  // Check if institution is approved
  if (session.user.institutionId) {
    const institution = await prisma.institution.findUnique({
      where: { id: session.user.institutionId },
      select: { isApproved: true }
    });

    // If not approved, redirect to awaiting approval page
    if (!institution?.isApproved) {
      redirect('/awaiting-approval');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block w-64 min-h-screen bg-gray-900 text-white">
          <InstitutionSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
} 