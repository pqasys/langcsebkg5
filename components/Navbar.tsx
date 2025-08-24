'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useNavigation } from '@/lib/navigation'
import { Menu, X, Search } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { SimpleNotifications } from '@/components/SimpleNotifications'

const Navbar = () => {
  const { data: session, status } = useSession()
  // Role-specific links moved to SecondaryNav
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  
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

  // Note: Role-specific links have been moved to SecondaryNav

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

  // Removed role-specific helpers; SecondaryNav will render them

  

  

  

  

  

  

  

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
            {/* Actions moved to SecondaryNav */}
            {status === 'authenticated' && session ? (
              <div className="flex items-center space-x-4">
                <Button onClick={handleSignOut} variant="outline" size="sm" data-testid="sign-out-button">Sign Out</Button>
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
                   {session.user.role !== 'ADMIN' && (
                     <div className="px-3 py-2">
                       <SimpleNotifications />
                     </div>
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