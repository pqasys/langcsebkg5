'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useNavigation } from '@/lib/navigation'
import { BookOpen, Building2, LayoutDashboard, Menu, X, Search } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { SimpleNotifications } from '@/components/SimpleNotifications'
import { Button } from '@/components/ui/button'
import { useInstitutionContext } from '@/components/providers/InstitutionProvider'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { data: session, status } = useSession()
  const { institution, loading: institutionLoading } = useInstitutionContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const navigate = useNavigation()

  useEffect(() => {
    setMounted(true);
  }, []);



  // Debug log to check session data - only log when status changes
  useEffect(() => {
    if (status === 'loading') {
      // console.log('Navbar - Session loading...');
    } else if (status === 'authenticated') {
      console.log('Navbar - Session authenticated:', session?.user?.email, 'Role:', session?.user?.role);
    } else if (status === 'unauthenticated') {
      console.log('Navbar - Session unauthenticated');
    }
  }, [session, status]);

  // Note: Admin pages will show navbar but without duplicate links (handled by conditional logic below)

  const getDashboardLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'STUDENT':
        return '/student';
      case 'INSTITUTION':
        return '/institution/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return null;
    }
  }

  const getInstitutionsLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'ADMIN':
        return { href: '/admin/institutions', label: 'Institutions' };
      case 'INSTITUTION':
        return { href: '/institution/profile', label: 'Profile' };
      default:
        return null;
    }
  }

  const getCoursesLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'STUDENT':
        return { href: '/student/courses', label: 'My Courses' };
      case 'INSTITUTION':
        return { href: '/institution/courses', label: 'Courses' };
      case 'ADMIN':
        return null; // Don't show Courses link for admin users since it's in the sidebar
      default:
        return null;
    }
  }

  const getVideoSessionsLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'INSTITUTION':
        return { href: '/video-sessions/create', label: 'Create Session' };
      case 'ADMIN':
        return { href: '/video-sessions/create', label: 'Create Session' };
      default:
        return null;
    }
  }

  const getStudentsLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'INSTITUTION':
        return { href: '/institution/students', label: 'Students' };
      case 'ADMIN':
        return { href: '/admin/users', label: 'Users' };
      default:
        return null;
    }
  }

  const getSettingsLink = () => {
    if (!session?.user) return null;
    
    switch (session.user.role) {
      case 'STUDENT':
        return { href: '/student/settings', label: 'Settings' };
      case 'INSTITUTION':
        return { href: '/institution/settings', label: 'Settings' };
      case 'ADMIN':
        return { href: '/admin/settings', label: 'Settings' };
      default:
        return null;
    }
  }

  const getAdminLinks = () => {
    if (session?.user?.role !== 'ADMIN') return [];
    
    return [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/users', label: 'Users', icon: Building2 },
      { href: '/admin/courses', label: 'Courses', icon: BookOpen },
      { href: '/admin/institutions', label: 'Institutions', icon: Building2 },
      { href: '/admin/categories', label: 'Categories', icon: BookOpen },
      { href: '/admin/tags', label: 'Tags', icon: BookOpen },
      { href: '/admin/performance', label: 'Performance', icon: LayoutDashboard },
      { href: '/admin/stats', label: 'Stats', icon: LayoutDashboard },
      { href: '/admin/settings', label: 'Settings', icon: LayoutDashboard },
    ];
  }

  const handleSignOut = async () => {
    console.log('Navbar - handleSignOut called');
    try {
      await signOut({ 
        callbackUrl: '/',
        redirect: true 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Fallback: force redirect to homepage and clear everything
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
        navigate.to('/');
      }
    }
  }

  const handleSignIn = () => {
    console.log('Navbar - handleSignIn called');
    // Use router.push for more reliable navigation
    router.push('/auth/signin')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white shadow-lg relative z-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center min-w-0">
            <div className="flex-shrink-0 flex items-center">
              <Logo size="xl" variant="badge-image" />
            </div>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Desktop Navigation - Full on extra large screens only */}
                   <div className="hidden 2xl:ml-12 2xl:flex 2xl:space-x-8 min-w-0">
              <Link
                href="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Home
              </Link>
              <Link
                href="/students-public"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Learn
              </Link>
              <Link
                href="/institutions-public"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Partner
              </Link>
              <Link
                href="/institutions"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Browse Institutions
              </Link>
              <Link
                href="/features/live-conversations"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Live Conversations
              </Link>
                             <Link
                 href="/features/live-classes"
                 className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
               >
                 Live Classes
               </Link>
              <Link
                href="/features/community-learning"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Community
              </Link>
              <Link
                href="/language-proficiency-test"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium no-hover-underline flex-shrink-0"
              >
                Language Test
              </Link>
            </div>
            

            

            

          </div>
          
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Desktop Actions - Full on large screens */}
                 <div className="hidden 2xl:flex items-center space-x-4 flex-shrink-0">
            <Link
              href="/search"
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md text-sm font-medium flex-shrink-0"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            {getCoursesLink() && (
              <Link
                href={getCoursesLink()!.href}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {getCoursesLink()!.label}
              </Link>
            )}
            {getVideoSessionsLink() && (
              <Link
                href={getVideoSessionsLink()!.href}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {getVideoSessionsLink()!.label}
              </Link>
            )}
            {status === 'authenticated' && session ? (
              <div className="flex items-center space-x-4">
                {/* Notifications for authenticated users (except admin) */}
                {session.user.role !== 'ADMIN' && <SimpleNotifications />}
                
                {session.user.role === 'INSTITUTION' ? (
                  (session.user.institutionApproved || institution?.isApproved) ? (
                    <Link
                      href="/institution/dashboard"
                      className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/awaiting-approval"
                      className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-200"
                    >
                      Awaiting Approval
                    </Link>
                  )
                ) : (
                  <Link
                    href={getDashboardLink()}
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                )}
                <Button onClick={handleSignOut} variant="outline" size="sm" data-testid="sign-out-button">
                  Sign Out
                </Button>
              </div>
                          ) : mounted ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={handleSignIn}>
                  Sign In
                </Button>
                <Link href="/auth/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
          
                      
          
          

          

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Mobile menu button */}
                  <div className="flex items-center 2xl:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               {/* Mobile menu */}
              {isMobileMenuOpen && (
                <div className="2xl:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/students-public"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Learn
            </Link>
            <Link
              href="/institutions-public"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Partner
            </Link>
            <Link
              href="/institutions"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Browse Institutions
            </Link>
            <Link
              href="/features/live-conversations"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Live Conversations
            </Link>
                         <Link
               href="/features/live-classes"
               className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
               onClick={closeMobileMenu}
             >
               Live Classes
             </Link>
            <Link
              href="/features/community-learning"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Community
            </Link>
            <Link
              href="/language-proficiency-test"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              Language Test
            </Link>
            <Link
              href="/search"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md no-hover-underline"
              onClick={closeMobileMenu}
            >
              <Search className="h-4 w-4 mr-2 inline" />
              Search
            </Link>

            {/* Mobile Actions */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {status === 'authenticated' && session ? (
                <div className="space-y-2">
                  {/* Real-time notifications for authenticated users (except admin) */}
                  {session.user.role !== 'ADMIN' && (
                    <div className="px-3 py-2">
                      <SimpleNotifications />
                    </div>
                  )}
                  
                  {session.user.role === 'INSTITUTION' ? (
                    (session.user.institutionApproved || institution?.isApproved) ? (
                      <Link
                        href="/institution/dashboard"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/awaiting-approval"
                        className="block px-3 py-2 text-base font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 rounded-md"
                        onClick={closeMobileMenu}
                      >
                        Awaiting Approval
                      </Link>
                    )
                  ) : (
                    <Link
                      href={getDashboardLink()}
                      className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                  )}
                  <Button 
                    onClick={() => {
                      handleSignOut()
                      closeMobileMenu()
                    }} 
                    variant="outline" 
                    className="w-full justify-center"
                    data-testid="mobile-sign-out-button"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : status !== 'loading' ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center"
                    onClick={() => {
                      closeMobileMenu()
                      handleSignIn()
                    }}
                  >
                    Sign In
                  </Button>
                  <Link href="/auth/signup" onClick={closeMobileMenu}>
                    <Button className="w-full justify-center">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-full h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar 