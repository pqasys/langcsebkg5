import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export interface DesignConfigAccess {
  canAccess: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canApprove: boolean;
  requiresApproval: boolean;
  userRole: string | undefined;
  isInstitutionApproved: boolean;
}

export function useDesignConfigAccess(): DesignConfigAccess {
  const { data: session, status } = useSession();
  const [access, setAccess] = useState<DesignConfigAccess>({
    canAccess: false,
    canCreate: false,
    canEdit: false,
    canApprove: false,
    requiresApproval: true,
    userRole: undefined,
    isInstitutionApproved: false
  });

  useEffect(() => {
    if (status === 'loading') return;

    const userRole = session?.user?.role;
    const isInstitutionApproved = session?.user?.institutionApproved || false;

    // Admin has full access
    if (userRole === 'ADMIN') {
      setAccess({
        canAccess: true,
        canCreate: true,
        canEdit: true,
        canApprove: true,
        requiresApproval: false,
        userRole,
        isInstitutionApproved: true
      });
      return;
    }

    // Institution users can access and create, but require approval
    if (userRole === 'INSTITUTION' && isInstitutionApproved) {
      setAccess({
        canAccess: true,
        canCreate: true,
        canEdit: true,
        canApprove: false,
        requiresApproval: true,
        userRole,
        isInstitutionApproved
      });
      return;
    }

    // Institution users with pending approval can view but not create
    if (userRole === 'INSTITUTION' && !isInstitutionApproved) {
      setAccess({
        canAccess: true,
        canCreate: false,
        canEdit: false,
        canApprove: false,
        requiresApproval: true,
        userRole,
        isInstitutionApproved
      });
      return;
    }

    // Other users (students, unauthenticated) have no access
    setAccess({
      canAccess: false,
      canCreate: false,
      canEdit: false,
      canApprove: false,
      requiresApproval: true,
      userRole,
      isInstitutionApproved: false
    });
  }, [session, status]);

  return access;
}

export function useDesignConfigApproval() {
  const { data: session } = useSession();
  const [pendingCount, setPendingCount] = useState(0);

  const fetchPendingCount = async () => {
    if (session?.user?.role !== 'ADMIN') return;

    try {
      const response = await fetch('/api/admin/design-configs/approve?status=PENDING');
      if (response.ok) {
        const data = await response.json();
        setPendingCount(data.designConfigs?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching pending design configs:', error);
    }
  };

  useEffect(() => {
    fetchPendingCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  return { pendingCount, refreshPendingCount: fetchPendingCount };
}
