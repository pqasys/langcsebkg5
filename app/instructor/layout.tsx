import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import InstructorSidebar from '@/components/instructor/InstructorSidebar';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'INSTRUCTOR') {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:block w-64 min-h-screen bg-gray-900 text-white">
          <InstructorSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

