import StudentSidebar from '@/components/student/StudentSidebar';
import MobileStudentNav from './components/MobileStudentNav';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="flex h-full flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-gray-700 bg-gray-900">
            <div className="flex h-[60px] items-center px-4">
              <span className="text-xl font-bold text-white">Student Portal</span>
            </div>
          </div>
          
          <main className="flex-1 overflow-y-auto p-6 lg:pb-6 pb-20">
            {children}
          </main>
          
          {/* Mobile Navigation */}
          <MobileStudentNav />
        </div>
      </div>
    </div>
  );
} 