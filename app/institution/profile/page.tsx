import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { InstitutionProfile } from './institution-profile';

export default async function InstitutionProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (session.user.role !== 'INSTITUTION') {
    redirect('/');
  }

  return <InstitutionProfile />;
} 