'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useInstitutionContext } from '@/components/providers/InstitutionProvider'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SimpleNotifications } from '@/components/SimpleNotifications'
import { 
  LayoutDashboard, BookOpen, Users, GraduationCap, Settings as SettingsIcon, 
  PlusCircle, Calendar, Search as SearchIcon, Menu, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type NavItem = { 
  href: string; 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  badgeCount?: number;
  badgeKey?: string; // Key to identify which badge to update dynamically
}

function RoleLinks(role: string | undefined): NavItem[] {
  switch (role) {
    case 'STUDENT':
      return [
        { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/student/courses', label: 'My Courses', icon: BookOpen },
        { href: '/student/calendar', label: 'Study Calendar', icon: Calendar },
        { href: '/community/circles', label: 'Circles', icon: Users, badgeCount: 12, badgeKey: 'circles' },
        { href: '/community/clubs', label: 'Clubs', icon: Calendar, badgeCount: 5, badgeKey: 'clubs' },
        { href: '/student/settings', label: 'Settings', icon: SettingsIcon },
      ]
    case 'INSTITUTION':
      return [
        { href: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/institution/courses', label: 'Courses', icon: BookOpen },
        { href: '/institution/instructors', label: 'Instructors', icon: GraduationCap },
        { href: '/institution/students', label: 'Students', icon: Users },
        { href: '/video-sessions/create', label: 'Create Session', icon: PlusCircle },
        { href: '/community/circles', label: 'Circles', icon: Users, badgeCount: 8, badgeKey: 'circles' },
        { href: '/community/clubs', label: 'Clubs', icon: Calendar, badgeCount: 3, badgeKey: 'clubs' },
        { href: '/institution/settings', label: 'Settings', icon: SettingsIcon },
      ]
    case 'ADMIN':
      return [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/institutions', label: 'Institutions', icon: Users },
        { href: '/admin/performance', label: 'Performance', icon: LayoutDashboard },
        { href: '/community/circles', label: 'Circles', icon: Users, badgeCount: 25, badgeKey: 'circles' },
        { href: '/community/clubs', label: 'Clubs', icon: Calendar, badgeCount: 15, badgeKey: 'clubs' },
        { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
      ]
    default:
      // Guest/default links
      return [
        { href: '/community/circles', label: 'Circles', icon: Users, badgeCount: 18, badgeKey: 'circles' },
        { href: '/community/clubs', label: 'Clubs', icon: Calendar, badgeCount: 7, badgeKey: 'clubs' },
      ]
  }
}

export default function SecondaryNav() {
  const { data: session, status } = useSession()
  const { institution } = useInstitutionContext()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [dynamicBadgeCounts, setDynamicBadgeCounts] = useState<{ [key: string]: number }>({})

  const role = session?.user?.role as string | undefined
  const items = RoleLinks(role)
  const isInstitutionAwaitingApproval = role === 'INSTITUTION' && !(session?.user as any)?.institutionApproved && !institution?.isApproved

  // Fetch dynamic badge counts
  useEffect(() => {
    const fetchBadgeCounts = async () => {
      try {
        const response = await fetch(`/api/community/badge-counts?role=${role || 'GUEST'}`)
        const data = await response.json()
        
        if (data.success) {
          setDynamicBadgeCounts({
            circles: data.data.circles,
            clubs: data.data.clubs
          })
          
          // Log metadata for debugging (only in development)
          if (process.env.NODE_ENV === 'development' && data.data.metadata) {
            console.log('Badge Counts Metadata:', data.data.metadata)
          }
        }
      } catch (error) {
        console.error('Error fetching badge counts:', error)
        // Keep using fallback counts on error
      }
    }

    fetchBadgeCounts()
  }, [role])

  return (
    <nav className="sticky top-16 z-40 bg-gray-900 text-gray-100 border-b border-gray-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="h-10 flex items-center justify-between">
          <div className="flex items-center">
            {/* Mobile collapse toggle */}
            <button
              aria-label="Toggle secondary navigation"
              className="mr-2 inline-flex items-center justify-center rounded sm:hidden p-1 text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            {/* Awaiting Approval banner for institutions */}
            {isInstitutionAwaitingApproval && (
              <Link
                href="/awaiting-approval"
                className="mr-2 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-200/20 text-yellow-300 border border-yellow-300/30 whitespace-nowrap"
              >
                Awaiting Approval
              </Link>
            )}
            <div className={`no-scrollbar overflow-x-auto sm:overflow-visible ${open ? 'flex' : 'hidden'} sm:flex`}> 
              {items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                                     <Link
                     key={item.href}
                     href={item.href}
                     className={`mr-2 inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium whitespace-nowrap ${
                       isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'
                     }`}
                   >
                     <Icon className="h-3.5 w-3.5" />
                     {item.label}
                                         {item.badgeCount && (
                      <span className={`ml-1 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                        isActive 
                          ? 'bg-white text-blue-600' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {(() => {
                          const count = item.badgeKey && dynamicBadgeCounts[item.badgeKey] !== undefined 
                            ? dynamicBadgeCounts[item.badgeKey] 
                            : item.badgeCount
                          return count > 99 ? '99+' : count
                        })()}
                      </span>
                    )}
                   </Link>
                )
              })}
            </div>
          </div>
          {/* Right actions: Community CTAs, Search and Notifications */}
          <div className="flex items-center gap-2">
            <Button asChild className="h-5 min-h-0 px-2 py-0 text-[11px] font-medium">
              <Link href="/language-proficiency-test">Free Test</Link>
            </Button>
            <Button asChild variant="outline" className="h-5 min-h-0 px-2 py-0 text-[11px] font-medium">
              <Link href="/community/circles">Join a Circle</Link>
            </Button>
            <Button asChild className="h-5 min-h-0 px-2 py-0 text-[11px] font-medium">
              <Link href="/community/clubs">RSVP a Club</Link>
            </Button>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded p-1.5 text-gray-300 hover:text-white hover:bg-gray-800"
              aria-label="Search"
            >
              <SearchIcon className="h-4 w-4" />
            </Link>
            {session?.user && session?.user?.role !== 'ADMIN' && (
              <div className="-mr-1">
                <SimpleNotifications />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}



