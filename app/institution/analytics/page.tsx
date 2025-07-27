import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InstitutionAnalyticsClient } from './InstitutionAnalyticsClient';

export default async function InstitutionAnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'INSTITUTION') {
    redirect('/');
  }

  return <InstitutionAnalyticsClient />;
} 