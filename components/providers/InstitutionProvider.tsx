'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Institution } from '@prisma/client';
// import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface InstitutionContextType {
  institution: Institution | null;
  loading: boolean;
  error: Error | null;
  refreshInstitution: () => Promise<void>;
}

const InstitutionContext = createContext<InstitutionContextType | undefined>(undefined);

export function InstitutionProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInstitution = async () => {
    if (status !== 'authenticated' || session?.user?.role !== 'INSTITUTION' || !session?.user?.institutionId) {
      setInstitution(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/institutions/${session.user.institutionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch institution data - Context: throw new Error('Failed to fetch institution data'...`);
      }
      
      const data = await response.json();
      setInstitution(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      // toast.error(`Failed to load institution data:. Please try again or contact support if the problem persists.`));
    } finally {
      setLoading(false);
    }
  };

  const refreshInstitution = async () => {
    await fetchInstitution();
  };

  useEffect(() => {
    // Only fetch if session is authenticated and we have a valid session
    if (status === 'authenticated') {
      fetchInstitution();
    } else {
      setInstitution(null);
      setLoading(false);
    }
  }, [session?.user?.role, session?.user?.institutionId, status]);

  const value = {
    institution,
    loading,
    error,
    refreshInstitution,
  };

  return (
    <InstitutionContext.Provider value={value}>
      {children}
    </InstitutionContext.Provider>
  );
}

export function useInstitutionContext() {
  const context = useContext(InstitutionContext);
  if (context === undefined) {
    throw new Error(`useInstitutionContext must be used within an InstitutionProvider - Context: const context = useContext(InstitutionContext);...`);
  }
  return context;
} 