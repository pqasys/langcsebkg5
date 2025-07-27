'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface Institution {
  id: string;
  name: string;
  // Add other institution fields as needed
}

export function useInstitution() {
  const { data: session } = useSession();
  const [institutionData, setInstitutionData] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInstitution = async () => {
      if (!session?.user?.institutionId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/institutions/${session.user.institutionId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch institution data - Context: throw new Error('Failed to fetch institution data'...`);
        }
        const data = await response.json();
        setInstitutionData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [session?.user?.institutionId]);

  return {
    institutionData,
    loading,
    error,
  };
} 