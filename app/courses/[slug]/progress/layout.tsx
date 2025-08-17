import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function CourseProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If not authenticated, redirect to sign in
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=' + encodeURIComponent('/courses'));
  }

  // If not a student, redirect to appropriate dashboard
  if (session.user.role !== 'STUDENT') {
    if (session.user.role === 'ADMIN') {
      redirect('/admin/dashboard');
    } else if (session.user.role === 'INSTITUTION') {
      redirect('/institution/dashboard');
    } else {
      redirect('/');
    }
  }

  return <>{children}</>;
} 