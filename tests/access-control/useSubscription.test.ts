import { renderHook, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useSubscription } from '@/hooks/useSubscription';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('useSubscription Access Control', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('FREE User Access Control', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-1',
            role: 'STUDENT',
            email: 'free@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock API responses for FREE user
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: false,
              currentPlan: null,
              features: {},
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: false,
              institutionId: null,
              institutionName: null,
              enrollmentStatus: null,
              enrollmentDate: null,
              canAccessInstitutionContent: false
            }
          })
        });
    });

    test('FREE user has correct access levels', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('FREE');
      expect(result.current.canAccessLiveClasses).toBe(false);
      expect(result.current.canAccessLiveConversations).toBe(false);
      expect(result.current.canAccessPlatformContent).toBe(false);
      expect(result.current.canAccessInstitutionContent).toBe(false);
      expect(result.current.canAccessPremiumFeatures).toBe(false);
      expect(result.current.canUseHDVideo).toBe(false);
      expect(result.current.canAccessRecordings).toBe(false);
      expect(result.current.canUseBreakoutRooms).toBe(false);
    });

    test('FREE user has no subscription data', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasActiveSubscription).toBe(false);
      expect(result.current.currentPlan).toBeUndefined();
      expect(result.current.features).toEqual({});
    });
  });

  describe('SUBSCRIBER User Access Control', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-2',
            role: 'STUDENT',
            email: 'subscriber@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock API responses for SUBSCRIBER user
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: true,
              currentPlan: 'PREMIUM',
              features: {
                hdVideo: true,
                recordings: true,
                breakoutRooms: true,
                advancedFeatures: true
              },
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: false,
              institutionId: null,
              institutionName: null,
              enrollmentStatus: null,
              enrollmentDate: null,
              canAccessInstitutionContent: false
            }
          })
        });
    });

    test('SUBSCRIBER user has platform access', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('SUBSCRIBER');
      expect(result.current.canAccessLiveClasses).toBe(true);
      expect(result.current.canAccessLiveConversations).toBe(true);
      expect(result.current.canAccessPlatformContent).toBe(true);
      expect(result.current.canAccessInstitutionContent).toBe(false);
      expect(result.current.canAccessPremiumFeatures).toBe(true);
      expect(result.current.canUseHDVideo).toBe(true);
      expect(result.current.canAccessRecordings).toBe(true);
      expect(result.current.canUseBreakoutRooms).toBe(true);
    });

    test('SUBSCRIBER user has subscription data', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasActiveSubscription).toBe(true);
      expect(result.current.currentPlan).toBe('PREMIUM');
      expect(result.current.features).toEqual({
        hdVideo: true,
        recordings: true,
        breakoutRooms: true,
        advancedFeatures: true
      });
    });
  });

  describe('INSTITUTION_STUDENT User Access Control', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-3',
            role: 'STUDENT',
            email: 'institution@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock API responses for INSTITUTION_STUDENT user
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: false,
              currentPlan: null,
              features: {},
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: true,
              institutionId: 'inst-1',
              institutionName: 'Test Language School',
              enrollmentStatus: 'ACTIVE',
              enrollmentDate: new Date(),
              canAccessInstitutionContent: true
            }
          })
        });
    });

    test('INSTITUTION_STUDENT has institution access', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('INSTITUTION_STUDENT');
      expect(result.current.canAccessLiveClasses).toBe(true);
      expect(result.current.canAccessLiveConversations).toBe(true);
      expect(result.current.canAccessPlatformContent).toBe(false);
      expect(result.current.canAccessInstitutionContent).toBe(true);
      expect(result.current.canAccessPremiumFeatures).toBe(false);
      expect(result.current.canUseHDVideo).toBe(false);
      expect(result.current.canAccessRecordings).toBe(false);
      expect(result.current.canUseBreakoutRooms).toBe(false);
    });

    test('INSTITUTION_STUDENT has institution enrollment data', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.institutionEnrollment).toEqual({
        hasInstitutionEnrollment: true,
        institutionId: 'inst-1',
        institutionName: 'Test Language School',
        enrollmentStatus: 'ACTIVE',
        enrollmentDate: expect.any(Date),
        canAccessInstitutionContent: true
      });
    });
  });

  describe('HYBRID User Access Control', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-4',
            role: 'STUDENT',
            email: 'hybrid@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock API responses for HYBRID user
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: true,
              currentPlan: 'PRO',
              features: {
                hdVideo: true,
                recordings: true,
                breakoutRooms: true,
                advancedFeatures: true
              },
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: true,
              institutionId: 'inst-1',
              institutionName: 'Test Language School',
              enrollmentStatus: 'ACTIVE',
              enrollmentDate: new Date(),
              canAccessInstitutionContent: true
            }
          })
        });
    });

    test('HYBRID user has both platform and institution access', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('HYBRID');
      expect(result.current.canAccessLiveClasses).toBe(true);
      expect(result.current.canAccessLiveConversations).toBe(true);
      expect(result.current.canAccessPlatformContent).toBe(true);
      expect(result.current.canAccessInstitutionContent).toBe(true);
      expect(result.current.canAccessPremiumFeatures).toBe(true);
      expect(result.current.canUseHDVideo).toBe(true);
      expect(result.current.canAccessRecordings).toBe(true);
      expect(result.current.canUseBreakoutRooms).toBe(true);
    });

    test('HYBRID user has both subscription and enrollment data', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasActiveSubscription).toBe(true);
      expect(result.current.currentPlan).toBe('PRO');
      expect(result.current.institutionEnrollment?.hasInstitutionEnrollment).toBe(true);
      expect(result.current.institutionEnrollment?.institutionName).toBe('Test Language School');
    });
  });

  describe('INSTITUTION_STAFF User Access Control', () => {
    beforeEach(() => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-5',
            role: 'INSTITUTION',
            email: 'staff@example.com',
            institutionId: 'inst-1'
          }
        },
        status: 'authenticated'
      });

      // Mock API responses for INSTITUTION_STAFF user
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: false,
              currentPlan: null,
              features: {},
              isFallback: false
            }
          })
        });
    });

    test('INSTITUTION_STAFF has admin capabilities', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('INSTITUTION_STAFF');
      expect(result.current.canAccessLiveClasses).toBe(true);
      expect(result.current.canAccessLiveConversations).toBe(true);
      expect(result.current.canAccessPlatformContent).toBe(false);
      expect(result.current.canAccessInstitutionContent).toBe(true);
      expect(result.current.canAccessPremiumFeatures).toBe(false);
      expect(result.current.canUseHDVideo).toBe(false);
      expect(result.current.canAccessRecordings).toBe(false);
      expect(result.current.canUseBreakoutRooms).toBe(false);
    });

    test('INSTITUTION_STAFF has institution role', async () => {
      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userAccessLevel?.userType).toBe('INSTITUTION_STAFF');
    });
  });

  describe('Error Handling', () => {
    test('handles API errors gracefully', async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-6',
            role: 'STUDENT',
            email: 'error@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock API error
      (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'));

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch user access data');
      expect(result.current.userType).toBe('FREE'); // Default fallback
    });

    test('handles unauthenticated users', () => {
      (useSession as jest.Mock).mockReturnValue({
        data: null,
        status: 'unauthenticated'
      });

      const { result } = renderHook(() => useSubscription());

      expect(result.current.loading).toBe(false);
      expect(result.current.userType).toBe('FREE');
      expect(result.current.canAccessLiveClasses).toBe(false);
    });
  });

  describe('Data Refresh', () => {
    test('refreshUserAccess updates data', async () => {
      (useSession as jest.Mock).mockReturnValue({
        data: {
          user: {
            id: 'user-7',
            role: 'STUDENT',
            email: 'refresh@example.com'
          }
        },
        status: 'authenticated'
      });

      // Mock initial API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: false,
              currentPlan: null,
              features: {},
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: false,
              institutionId: null,
              institutionName: null,
              enrollmentStatus: null,
              enrollmentDate: null,
              canAccessInstitutionContent: false
            }
          })
        });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.userType).toBe('FREE');

      // Mock updated API responses
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            subscriptionStatus: {
              hasActiveSubscription: true,
              currentPlan: 'PREMIUM',
              features: { hdVideo: true },
              isFallback: false
            }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            enrollment: {
              hasInstitutionEnrollment: false,
              institutionId: null,
              institutionName: null,
              enrollmentStatus: null,
              enrollmentDate: null,
              canAccessInstitutionContent: false
            }
          })
        });

      // Trigger refresh
      result.current.refreshUserAccess();

      await waitFor(() => {
        expect(result.current.userType).toBe('SUBSCRIBER');
      });

      expect(result.current.canAccessLiveClasses).toBe(true);
      expect(result.current.canAccessPremiumFeatures).toBe(true);
    });
  });
}); 