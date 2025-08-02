'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useNavigation } from '@/lib/navigation';
import { 
  Building2, 
  Users, 
  BookOpen, 
  Calendar,
  Settings,
  Home,
  Trash2,
  Tags,
  Building,
  ExternalLink,
  Tag,
  CreditCard,
  DollarSign,
  FileText,
  Database,
  Crown,
  TrendingUp,
  Target,
  BarChart3,
  Bell,
  Shield,
  Zap,
  ChevronDown,
  ChevronRight,
  Activity,
  LogOut,
  Video
} from 'lucide-react';
// import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/ui/logo';

interface AdminSidebarProps {
  institutionId?: string | null;
  institutionData?: unknown;
  onNavigate?: () => void;
}

export default function AdminSidebar({ institutionId }: AdminSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const navigate = useNavigation();
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    content: true,
    financial: true,
    settings: true
  });

  // // // // // // // // // console.log('Sidebar - Current pathname:', pathname);
  console.log('Sidebar - Institution ID from props:', institutionId || 'Not provided');

  // Fetch pending payments count
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await fetch('/api/admin/payments/pending-count');
        if (response.ok) {
          const data = await response.json();
          setPendingPaymentsCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching pending payments count:', error);
      }
    };

    fetchPendingCount();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchPendingCount, 30000);

    return () => clearInterval(interval);
  }, []);

  // Function to refresh pending count (can be called from other components)
  const refreshPendingCount = async () => {
    try {
      const response = await fetch('/api/admin/payments/pending-count');
      if (response.ok) {
        const data = await response.json();
        setPendingPaymentsCount(data.count);
      }
    } catch (error) {
      console.error('Error refreshing pending payments count:', error);
    }
  };

  // Expose refresh function globally for other components to use
  useEffect(() => {
    (window as any).refreshAdminPendingCount = refreshPendingCount;
    return () => {
      delete (window as any).refreshAdminPendingCount;
    };
  }, []);



  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/');
  };

  const handleCoursesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (institutionId) {
      router.push(`/admin/institutions/${institutionId}/courses`);
    } else {
      router.push('/admin/courses');
    }
  };

  const handleTagsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (institutionId) {
      router.push(`/admin/institutions/${institutionId}/tags`);
    } else {
      router.push('/admin/tags');
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Check if we're on the courses page
  const isCoursesPage = pathname.startsWith('/admin/courses') || pathname.includes('/admin/institutions/') && pathname.endsWith('/courses');
  // Check if we're on the tags page
  const isTagsPage = pathname.startsWith('/admin/tags') || pathname.includes('/admin/institutions/') && pathname.endsWith('/tags');
  // Check if we're on the institutions page
  const isInstitutionsPage = pathname.startsWith('/admin/institutions') && !pathname.includes('/courses') && !pathname.includes('/tags');
  // Check if we're on question templates page
  const isQuestionTemplatesPage = pathname.startsWith('/admin/question-templates');
  // Check if we're on question banks page
  const isQuestionBanksPage = pathname.startsWith('/admin/question-banks');
  // Check if we're on subscriptions page
  const isSubscriptionsPage = pathname.startsWith('/admin/subscriptions');
  // Check if we're on advertising page
  const isAdvertisingPage = pathname.startsWith('/admin/advertising');
  // Check if we're on institution monetization page
  const isInstitutionMonetizationPage = pathname.startsWith('/admin/institution-monetization');
  // Check if we're on commission tiers page
  const isCommissionTiersPage = pathname.startsWith('/admin/settings/commission-tiers');
  // Check if we're on subscription plans page
  const isSubscriptionPlansPage = pathname.startsWith('/admin/settings/subscription-plans');
  // Check if we're on settings page
  const isSettingsPage = pathname.startsWith('/admin/settings');
  // Check if we're on notifications page
  const isNotificationsPage = pathname.startsWith('/admin/settings/notifications/templates');
  // Check if we're on performance page
  const isPerformancePage = pathname.startsWith('/admin/performance');
  // Check if we're on live classes page
  const isLiveClassesPage = pathname.startsWith('/admin/live-classes');

  return (
    <div className="flex h-full flex-col bg-gray-900">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-3 py-4 border-b border-gray-700">
        <div className="px-4">
          <Logo size="sm" className="text-white" variant="badge-image" />
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {/* Dashboard */}
            <a
              href="#"
              onClick={handleDashboardClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                pathname === '/' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
              )}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </a>

            {/* Core Management */}
            <div className="pt-2">
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Core Management
              </h3>
              <div className="mt-2 space-y-1">
                <Link
                  href="/admin/institutions"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    isInstitutionsPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  Institutions
                </Link>

                <Link
                  href="/admin/users"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    pathname === '/admin/users' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>

                <Link
                  href="/admin/instructors"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    pathname === '/admin/instructors' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Users className="h-4 w-4" />
                  Instructors
                </Link>

                <a
                  href="#"
                  onClick={handleCoursesClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    isCoursesPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <BookOpen className="h-4 w-4" />
                  Courses
                </a>

                <Link
                  href="/admin/categories"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    pathname === '/admin/categories' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Tag className="h-4 w-4" />
                  Categories
                </Link>

                <a
                  href="#"
                  onClick={handleTagsClick}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    isTagsPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Tags className="h-4 w-4" />
                  Tag Management
                </a>

                <Link
                  href="/admin/live-classes"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                    isLiveClassesPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                  )}
                >
                  <Video className="h-4 w-4" />
                  Live Classes
                </Link>
              </div>
            </div>

            {/* Financial Management */}
            <div className="pt-2">
              <button
                onClick={() => toggleSection('financial')}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>Financial</span>
                {expandedSections.financial ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
              {expandedSections.financial && (
                <div className="mt-2 space-y-1">
                  <Link
                    href="/admin/payments"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      pathname === '/admin/payments' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="flex-1">Payments</span>
                    {pendingPaymentsCount > 0 && (
                      <div className="ml-auto flex items-center justify-center">
                        <Badge 
                          variant="destructive" 
                          className="h-6 w-6 rounded-full p-0 text-xs font-bold bg-red-600 hover:bg-red-700 text-white border-2 border-red-400 shadow-lg ring-2 ring-red-300 ring-opacity-50 animate-pulse flex items-center justify-center"
                          title={`${pendingPaymentsCount} payment${pendingPaymentsCount !== 1 ? 's' : ''} awaiting approval`}
                        >
                          {pendingPaymentsCount > 99 ? '99+' : pendingPaymentsCount}
                        </Badge>
                      </div>
                    )}
                  </Link>

                  <Link
                    href="/admin/subscriptions"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isSubscriptionsPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Crown className="h-4 w-4" />
                    Subscriptions
                  </Link>

                  <Link
                    href="/admin/revenue"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      pathname === '/admin/revenue' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Revenue Analytics
                  </Link>

                  <Link
                    href="/admin/advertising"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isAdvertisingPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Zap className="h-4 w-4" />
                    Advertising & Revenue
                  </Link>

                  <Link
                    href="/admin/institution-monetization"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isInstitutionMonetizationPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Target className="h-4 w-4" />
                    Institution Monetization
                  </Link>
                </div>
              )}
            </div>

            {/* Content Management */}
            <div className="pt-2">
              <button
                onClick={() => toggleSection('content')}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>Content</span>
                {expandedSections.content ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
              {expandedSections.content && (
                <div className="mt-2 space-y-1">
                  <Link
                    href="/admin/question-templates"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isQuestionTemplatesPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <FileText className="h-4 w-4" />
                    Question Templates
                  </Link>

                  <Link
                    href="/admin/question-banks"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isQuestionBanksPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Database className="h-4 w-4" />
                    Question Banks
                  </Link>
                </div>
              )}
            </div>

            {/* Settings & Configuration */}
            <div className="pt-2">
              <button
                onClick={() => toggleSection('settings')}
                className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>Settings</span>
                {expandedSections.settings ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </button>
              {expandedSections.settings && (
                <div className="mt-2 space-y-1">
                  <Link
                    href="/admin/settings"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isSettingsPage && !isNotificationsPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Settings className="h-4 w-4" />
                    General Settings
                  </Link>

                  <Link
                    href="/admin/settings/notifications/templates"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isNotificationsPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Bell className="h-4 w-4" />
                    Notification Templates
                  </Link>

                  <Link
                    href="/admin/settings/payment-approval"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      pathname === '/admin/settings/payment-approval' ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <CreditCard className="h-4 w-4" />
                    Payment Approval
                  </Link>

                  <Link
                    href="/admin/settings/commission-tiers"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isCommissionTiersPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <DollarSign className="h-4 w-4" />
                    Commission Tiers
                  </Link>

                  <Link
                    href="/admin/settings/subscription-plans"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isSubscriptionPlansPage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Crown className="h-4 w-4" />
                    Subscription Plans
                  </Link>

                  <Link
                    href="/admin/performance"
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-gray-800',
                      isPerformancePage ? 'bg-gray-800 text-gray-50' : 'text-gray-400 hover:text-gray-50'
                    )}
                  >
                    <Activity className="h-4 w-4" />
                    Performance Dashboard
                  </Link>


                </div>
              )}
            </div>
          </div>
        </div>
        {/* Bottom padding to ensure last item is not cut off */}
        <div className="h-4"></div>
      </div>

      {/* Footer - Fixed */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-gray-700">
        <button
          onClick={async () => {
            try {
              // Clear any cached session data
              if (typeof window !== 'undefined') {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                  const key = localStorage.key(i);
                  if (key && key.includes('next-auth')) {
                    keysToRemove.push(key);
                  }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
                sessionStorage.clear();
              }
              
              await signOut({ redirect: false });
              navigate.replace('/');
            } catch (error) {
              console.error('Sign out error:', error);
              navigate.replace('/');
            }
          }}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
} 