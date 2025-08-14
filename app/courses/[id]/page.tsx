'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  Play, 
  Home, 
  BarChart3 
} from 'lucide-react'
import { formatCurrencyWithSymbol } from '@/lib/utils'
import { toast } from 'sonner';
import EnrollmentModal from '@/app/student/components/EnrollmentModal';

interface CourseTag {
  id: string
  tag: {
    id: string
    name: string
    color?: string
    icon?: string
  }
}

interface Institution {
  id: string
  name: string
  description?: string
  country: string
  city: string
  address?: string
}

interface Category {
  id: string
  name: string
}

interface Course {
  id: string
  title: string
  description: string
  base_price: number
  duration: number
  level: string
  startDate: string
  endDate: string
  maxStudents: number
  pricingPeriod: string
  framework: string
  status: string
  institutionId: string
  categoryId: string
  institution: Institution
  category: Category
  courseTags: CourseTag[]
}

export default function CourseDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedEnrollment, setHasCompletedEnrollment] = useState(false)
  const [showAutoEnrollmentPrompt, setShowAutoEnrollmentPrompt] = useState(false)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true)
        setHasCompletedEnrollment(false) // Reset enrollment completion state
        const response = await fetch(`/api/courses/${params.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch course')
        }
        
        const data = await response.json()
        setCourse(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [params.id])

  // Check authentication status and handle enrollment flow
  useEffect(() => {
    const checkAuthAndHandleEnrollment = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const sessionData = await response.json()
        
        if (sessionData.user) {
          setIsAuthenticated(true)
          
          // Check if user just returned from sign-in (check URL params)
          const urlParams = new URLSearchParams(window.location.search)
          const enrollmentRequested = urlParams.get('enroll')
          
          if (enrollmentRequested === 'true' && course && !hasCompletedEnrollment) {
            // User just returned from sign-in and wants to enroll
            setIsEnrollmentModalOpen(true)
            // Clean up the URL by removing all query parameters
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl)
          }
          
          // Check if user just returned from subscription signup
          const fromSubscription = sessionStorage.getItem('fromSubscriptionSignup')
          if (fromSubscription === 'true' && course && !hasCompletedEnrollment) {
            // Clear the flag
            sessionStorage.removeItem('fromSubscriptionSignup')
            
            // Check if user now has an active subscription
            const subscriptionResponse = await fetch('/api/student/subscription/current')
            if (subscriptionResponse.ok) {
              const subscriptionData = await subscriptionResponse.json()
              
              if (subscriptionData.subscription && 
                  ['ACTIVE', 'TRIAL'].includes(subscriptionData.subscription.status)) {
                // User has active subscription, show enrollment prompt
                toast.success('Great! You now have an active subscription.')
                
                // Show auto-enrollment prompt modal
                setShowAutoEnrollmentPrompt(true)
              }
            }
          }
        } else {
          setIsAuthenticated(false)
        }
      } catch (err) {
        console.error('Auth check error:', err)
        setIsAuthenticated(false)
      }
    }

    if (course) {
      checkAuthAndHandleEnrollment()
    }
  }, [course])

  const handleEnrollment = async () => {
    if (!course) return
    
    if (!isAuthenticated) {
      // Create a clean return URL without duplicate parameters
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('enroll', 'true');
      const returnUrl = currentUrl.toString();
      
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(returnUrl)}`)
      return
    }
    
    try {
      // Check enrollment eligibility before opening modal
      const response = await fetch(`/api/student/courses/${course.id}/check-enrollment-eligibility`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle subscription requirement
        if (response.status === 402 && errorData.error === 'Subscription required') {
          console.log('Subscription required for this course');
          toast.error('This course requires an active subscription to enroll.');
          
          // Redirect to subscription page
          if (errorData.redirectUrl) {
            router.push(errorData.redirectUrl);
          } else {
            router.push('/subscription-signup');
          }
          return;
        }
        
        // Handle other errors
        toast.error(errorData.details || errorData.error || 'Unable to check enrollment eligibility');
        return;
      }

      // User is eligible - check if this is a subscription-based course
      // UPDATED RULE: Only platform courses (institutionId = null) can be subscription-based
      if (course.institutionId === null && (course.marketingType === 'LIVE_ONLINE' || course.marketingType === 'BLENDED' || course.requiresSubscription)) {
        // For subscription-based courses, enroll directly
        await handleDirectEnrollment();
      } else {
        // For non-subscription courses, open enrollment modal
        setIsEnrollmentModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking enrollment eligibility:', error);
      toast.error('Failed to check enrollment eligibility. Please try again.');
    }
  }

  const handleDirectEnrollment = async () => {
    if (!course) return
    
    try {
      // Direct enrollment without opening modal
      const response = await fetch(`/api/student/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to enroll in course')
        return
      }

      // Enrollment successful
      toast.success('Successfully enrolled in course!')
      setHasCompletedEnrollment(true)
      
      // Redirect to student dashboard after successful enrollment
      setTimeout(() => {
        router.push('/student')
      }, 1000)
    } catch (error) {
      console.error('Error during direct enrollment:', error)
      toast.error('Failed to enroll in course. Please try again.')
    }
  }

  const handleEnrollmentComplete = () => {
    toast.success('Successfully enrolled in course!')
    setIsEnrollmentModalOpen(false)
    setHasCompletedEnrollment(true)
    
    // Redirect to student dashboard after successful enrollment
    // Small delay to ensure the toast is visible
    setTimeout(() => {
      router.push('/student')
    }, 1000)
  }

  const handleViewModules = () => {
    if (!course) return
    router.push(`/courses/${course.id}/modules`)
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
  }

  const handleViewProgress = () => {
    if (!course) return
    router.push(`/courses/${course.id}/progress`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The course you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            <ArrowRight className="w-4 h-4 mr-1 rotate-180" />
            Back to Courses
          </button>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {course.institution?.name || 'Institution not available'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrencyWithSymbol(course.base_price)}
                </div>
                <div className="text-sm text-gray-500">
                  {course.pricingPeriod === 'WEEKLY' && 'per week'}
                  {course.pricingPeriod === 'MONTHLY' && 'per month'}
                  {course.pricingPeriod === 'FULL_COURSE' && 'full course'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleViewModules}
              className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors group"
            >
              <div className="text-center">
                <Play className="w-6 h-6 mx-auto mb-2 text-blue-600 group-hover:text-blue-700" />
                <span className="text-sm font-medium text-gray-900">View Modules</span>
                <p className="text-xs text-gray-500 mt-1">Start learning</p>
              </div>
            </button>
            
            <button
              onClick={handleGoToDashboard}
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition-colors group"
            >
              <div className="text-center">
                <Home className="w-6 h-6 mx-auto mb-2 text-green-600 group-hover:text-green-700" />
                <span className="text-sm font-medium text-gray-900">Dashboard</span>
                <p className="text-xs text-gray-500 mt-1">Overview</p>
              </div>
            </button>
            
            <button
              onClick={handleViewProgress}
              className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors group"
            >
              <div className="text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-600 group-hover:text-purple-700" />
                <span className="text-sm font-medium text-gray-900">Progress</span>
                <p className="text-xs text-gray-500 mt-1">Track learning</p>
              </div>
            </button>
            
            <button
              onClick={handleEnrollment}
              className="flex items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors group"
            >
              <div className="text-center">
                <GraduationCap className="w-6 h-6 mx-auto mb-2 text-orange-600 group-hover:text-orange-700" />
                <span className="text-sm font-medium text-gray-900">
                  Enroll Now
                </span>
                <p className="text-xs text-gray-500 mt-1">Join course</p>
              </div>
            </button>
          </div>
        </div>

        {/* Course Details Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {course.title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {course.institution?.name || 'Institution not available'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrencyWithSymbol(course.base_price)}
                </div>
                <div className="text-sm text-gray-500">
                  {course.pricingPeriod === 'WEEKLY' && 'per week'}
                  {course.pricingPeriod === 'MONTHLY' && 'per month'}
                  {course.pricingPeriod === 'FULL_COURSE' && 'full course'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Category
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{course.category?.name || 'Not specified'}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Level
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{course.level}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{course.duration} weeks</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Max Students
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{course.maxStudents}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(course.startDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  End Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(course.endDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{course.description}</dd>
              </div>
            </dl>
          </div>
          
          {/* Institution Details */}
          {course.institution && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                Institution Details
              </h4>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{course.institution.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {course.institution.city}, {course.institution.country}
                  </dd>
                </div>
                {course.institution.address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{course.institution.address}</dd>
                  </div>
                )}
                {course.institution.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {course.institution.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
          
          {/* Course Tags */}
          {course.courseTags && course.courseTags.length > 0 && (
            <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Course Tags</h4>
              <div className="flex flex-wrap gap-2">
                {course.courseTags.map((courseTag) => (
                  <span
                    key={courseTag.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {courseTag.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleEnrollment}
                className="flex-1 inline-flex justify-center items-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <>
                  Enroll Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              </button>
              
              <button
                onClick={handleViewModules}
                className="flex-1 inline-flex justify-center items-center py-3 px-6 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Play className="mr-2 w-4 h-4" />
                Preview Modules
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        courseId={course?.id || null}
        onEnrollmentComplete={handleEnrollmentComplete}
      />
      
      {/* Auto-Enrollment Prompt Modal */}
      {showAutoEnrollmentPrompt && course && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to Enroll?
              </h3>
              <p className="text-gray-600 mb-6">
                Great! You now have an active subscription. Would you like to enroll in <strong>"{course.title}"</strong> now?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAutoEnrollmentPrompt(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Maybe Later
                </button>
                <button
                  onClick={async () => {
                    setShowAutoEnrollmentPrompt(false)
                    await handleDirectEnrollment()
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 