'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import Link from 'next/link'
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaGraduationCap, 
  FaGlobe, 
  FaUsers, 
  FaAward,
  FaPlay,
  FaStar,
  FaCheckCircle,
  FaArrowRight,
  FaBookOpen,
  FaChalkboardTeacher,
  FaCertificate,
  FaHeadphones,
  FaVideo,
  FaComments,
  FaShieldAlt,
  FaMobile,
  FaBrain,
  FaScroll,
  FaGlobeAmericas,
  FaUserFriends,
  FaLaptop,
  FaLock,
  FaWifi,
  FaClock,
  FaRocket
} from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { getAllStudentTiers } from '@/lib/subscription-pricing'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner';
import { useMobileOptimization } from '@/components/MobileOptimizer';
import { useSessionSync } from '@/hooks/useSessionSync';
import { useServiceWorkerContext } from '@/components/ServiceWorkerProvider';

export default function HomePageClient() {
  const { session, status, isAuthenticated, isLoading } = useSessionSync()
  const { isSmallScreen } = useMobileOptimization()
  const { isOnline, isServiceWorkerReady } = useServiceWorkerContext()
  
  // Initialize state with cached data if available
  const getInitialStats = () => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return null
    }
    
    try {
      const cachedStats = localStorage.getItem('cachedStats')
      const statsCacheTime = localStorage.getItem('statsCacheTime')
      
      if (cachedStats && statsCacheTime) {
        const age = Date.now() - parseInt(statsCacheTime)
        if (age < 60 * 60 * 1000) { // 1 hour
          return JSON.parse(cachedStats)
        }
      }
    } catch (error) {
      console.error('Error loading initial cached stats:', error)
    }
    
    // Return null to indicate no cached data available
    return null
  }

  const getInitialCountries = () => {
    // Check if we're in browser environment
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return []
    }
    
    try {
      const cachedCountries = localStorage.getItem('cachedCountries')
      const countriesCacheTime = localStorage.getItem('countriesCacheTime')
      
      if (cachedCountries && countriesCacheTime) {
        const age = Date.now() - parseInt(countriesCacheTime)
        if (age < 60 * 60 * 1000) { // 1 hour
          return JSON.parse(cachedCountries)
        }
      }
    } catch (error) {
      console.error('Error loading initial cached countries:', error)
    }
    
    // Return empty array to indicate no cached data available
    return []
  }

  const [countries, setCountries] = useState<Array<{ country: string; courseCount: number }>>([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionTimeout, setSessionTimeout] = useState(false)
  const [isOfflineData, setIsOfflineData] = useState(false)
  const hasFetchedData = useRef(false)
  const [mounted, setMounted] = useState(false);

  // Pricing: derive student plans from single source of truth
  const homepageStudentTiers = useMemo(() => getAllStudentTiers(), [])
  const homepagePricingPlans = useMemo(() => homepageStudentTiers.map(tier => ({
    name: tier.name.replace(' Plan', ''),
    price: tier.price,
    period: '/month',
    features: tier.features,
    popular: !!tier.popular
  })), [homepageStudentTiers])

  const homepageFreeTrialPlan = useMemo(() => ({
    name: 'Free Trial',
    price: '$0',
    period: '',
    features: [
      'Access to basic courses',
      'Limited practice sessions',
      'Basic community access'
    ],
    popular: false
  }), [])

  const homepageDisplayPlans = useMemo(() => [homepageFreeTrialPlan, ...homepagePricingPlans], [homepageFreeTrialPlan, homepagePricingPlans])

  // Ensure component is mounted before rendering icons
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load cached data after mount to avoid hydration mismatch
  useEffect(() => {
    if (mounted) {
      // Load cached countries data
      if (countries.length === 0) {
        const cachedCountries = getInitialCountries();
        if (cachedCountries.length > 0) {
          setCountries(cachedCountries);
        }
      }
      
      // Load cached stats data
      if (stats === null) {
        const cachedStats = getInitialStats();
        if (cachedStats) {
          setStats(cachedStats);
        }
      }
      
      // Check offline status after mount
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const isActuallyOffline = !navigator.onLine;
        const hasCachedData = getInitialStats() !== null || getInitialCountries().length > 0;
        console.log('HomePageClient - Initial offline check:', { isActuallyOffline, hasCachedData });
        setIsOfflineData(isActuallyOffline && hasCachedData);
      }
    }
  }, [mounted]);

  
  // Memoize expensive computations
  const memoizedStats = useMemo(() => stats, [stats])
  const memoizedCountries = useMemo(() => countries, [countries])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Test network connectivity first (but don't block everything if it fails)
      let networkTest = null;
      try {
        networkTest = await fetch('/api/test-connection', { 
          method: 'HEAD',
          signal: AbortSignal.timeout(2000)
        });
      } catch (error) {
        console.log('HomePageClient - Network connectivity test failed, but continuing:', error);
      }
      
      if (!networkTest) {
        console.log('HomePageClient - Network connectivity test failed, but proceeding with data fetch');
        // Don't block the entire fetch, just log the issue
      }
      
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('HomePageClient - API timeout, using cached data');
        controller.abort();
      }, 5000); // Increased timeout for better reliability
      
      try {
        // Force cache refresh by adding timestamp and version
        const timestamp = Date.now();
        const version = 'fluentship-v1';
        const cacheBuster = `?t=${timestamp}&v=${version}`;
        
        const [countriesResponse, statsResponse] = await Promise.all([
          fetch(`/api/courses/by-country${cacheBuster}`, { 
            signal: controller.signal,
            headers: { 
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Cache-Bust': timestamp.toString()
            }
          }),
          fetch(`/api/stats${cacheBuster}`, { 
            signal: controller.signal,
            headers: { 
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0',
              'X-Cache-Bust': timestamp.toString()
            }
          })
        ]);
        
        clearTimeout(timeoutId);
        
        // Handle countries data
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json()
          console.log('HomePageClient - Countries data loaded:', countriesData.length, 'countries');
          setCountries(countriesData.slice(0, 8))
          // Store successful data for offline use
          localStorage.setItem('cachedCountries', JSON.stringify(countriesData.slice(0, 8)))
          localStorage.setItem('countriesCacheTime', Date.now().toString())
          setIsOfflineData(false)
        } else {
          console.error('Failed to fetch countries data, status:', countriesResponse.status);
          // Try to use cached data first
          const cachedCountries = localStorage.getItem('cachedCountries')
          const cacheTime = localStorage.getItem('countriesCacheTime')
          
          if (cachedCountries && cacheTime) {
            const age = Date.now() - parseInt(cacheTime)
            // Use cached data if it's less than 1 hour old
            if (age < 60 * 60 * 1000) {
              console.log('HomePageClient - Using cached countries data');
              setCountries(JSON.parse(cachedCountries))
              setIsOfflineData(true)
            } else {
              // Keep existing countries data if cache is too old (don't fallback to hardcoded)
              console.log('Countries cache too old, keeping existing data')
            }
          } else {
            // Keep existing countries data if no cache available (don't fallback to hardcoded)
            console.log('No countries cache available, keeping existing data')
          }
        }
        
        // Handle stats data
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          console.log('HomePageClient - Stats data loaded:', statsData);
          
          // Check if this is fallback data (from database connection issues)
          if (statsData._fallback) {
            console.log('Received fallback stats data, trying cached data instead')
            // Don't store fallback data, try to use cached data
            const cachedStats = localStorage.getItem('cachedStats')
            const cacheTime = localStorage.getItem('statsCacheTime')
            
            if (cachedStats && cacheTime) {
              const age = Date.now() - parseInt(cacheTime)
              if (age < 60 * 60 * 1000) {
                setStats(JSON.parse(cachedStats))
                setIsOfflineData(true)
                console.log('Using cached stats data due to database connection issues')
              } else {
                // Cache too old, but still better than zeros
                setStats(JSON.parse(cachedStats))
                setIsOfflineData(true)
                console.log('Using old cached stats data due to database connection issues')
              }
            } else {
              // No cache available, use fallback data but mark as offline
              setStats({
                students: statsData.students,
                institutions: statsData.institutions,
                courses: statsData.courses,
                languages: statsData.languages
              })
              setIsOfflineData(true)
              console.log('Using fallback stats data (no cache available)')
            }
          } else {
            // Real data received, store it
            setStats(statsData)
            localStorage.setItem('cachedStats', JSON.stringify(statsData))
            localStorage.setItem('statsCacheTime', Date.now().toString())
            setIsOfflineData(false)
          }
        } else {
          console.error('Failed to fetch stats data, status:', statsResponse.status);
          // Try to use cached data first
          const cachedStats = localStorage.getItem('cachedStats')
          const cacheTime = localStorage.getItem('statsCacheTime')
          
          if (cachedStats && cacheTime) {
            const age = Date.now() - parseInt(cacheTime)
            // Use cached data if it's less than 1 hour old
            if (age < 60 * 60 * 1000) {
              console.log('HomePageClient - Using cached stats data');
              setStats(JSON.parse(cachedStats))
              setIsOfflineData(true)
            } else {
              // Keep existing stats if cache is too old (don't fallback to hardcoded)
              console.log('Stats cache too old, keeping existing data')
            }
          } else {
            // Keep existing stats if no cache available (don't fallback to hardcoded)
            console.log('No stats cache available, keeping loading state')
            // Don't set placeholder data - keep loading state
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('API fetch error:', fetchError);
        
        // Try to use cached data on network errors
        const cachedStats = localStorage.getItem('cachedStats')
        const cachedCountries = localStorage.getItem('cachedCountries')
        const statsCacheTime = localStorage.getItem('statsCacheTime')
        const countriesCacheTime = localStorage.getItem('countriesCacheTime')
        
        if (cachedStats && statsCacheTime) {
          const age = Date.now() - parseInt(statsCacheTime)
          if (age < 60 * 60 * 1000) {
            setStats(JSON.parse(cachedStats))
            setIsOfflineData(true)
          } else {
            console.log('Stats cache too old, keeping existing data')
          }
        } else {
          console.log('No stats cache available, keeping loading state')
          // Don't set placeholder data - keep loading state
        }
        
        if (cachedCountries && countriesCacheTime) {
          const age = Date.now() - parseInt(countriesCacheTime)
          if (age < 60 * 60 * 1000) {
            setCountries(JSON.parse(cachedCountries))
          } else {
            console.log('Countries cache too old, keeping existing data')
          }
        } else {
          console.log('No countries cache available, keeping existing data')
        }
        
        // Only set offline data if we're actually offline
        if (!isOnline) {
          console.log('HomePageClient - Setting offline data due to actual offline status');
          setIsOfflineData(true)
        } else if (fetchError instanceof TypeError) {
          console.log('HomePageClient - Network error detected, but staying online');
          // Don't set offline mode for network errors - let the user retry
        }
      }
          } catch (error) {
        console.error('Error fetching data:', error)
        
        // Only show error if it's not a timeout (timeout is handled by controller.abort())
        if (error instanceof Error && error.name !== 'AbortError') {
          setError('Failed to load some data')
        }
        
        // Don't set placeholder data - let the loading state handle it
        // This prevents showing zeros when there's an error
      } finally {
        // Only set loading to false if we have some data or have tried to fetch
        const shouldStopLoading = stats || countries.length > 0 || hasFetchedData.current;
        console.log('HomePageClient - Setting loading to false:', shouldStopLoading, { 
          hasStats: !!stats, 
          countriesCount: countries.length, 
          hasFetchedData: hasFetchedData.current 
        });
        
        if (shouldStopLoading) {
          setLoading(false)
        }
        hasFetchedData.current = true
      }
  }

  useEffect(() => {
    if (hasFetchedData.current) {
      return;
    }
    
    // Clear service worker cache to ensure fresh data
    if ('serviceWorker' in navigator && 'caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          if (cacheName.includes('fluentish-') || cacheName.includes('fluentship-v1')) {
            caches.delete(cacheName);
            console.log('Cleared old cache:', cacheName);
          }
        });
      });
    }
    
    fetchData();
    
    // Add loading timeout to prevent infinite loading
    const loadingTimer = setTimeout(() => {
      if (loading) {
        console.log('HomePageClient - Loading timeout, forcing loading to complete');
        setLoading(false);
        setSessionTimeout(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(loadingTimer);
  }, [isOnline, isLoading, status]);

  // Clear offline data indicator when session is authenticated and online
  useEffect(() => {
    if (status === 'authenticated' && isOnline && isOfflineData) {
      console.log('HomePageClient - Clearing offline data indicator due to authenticated session');
      setIsOfflineData(false);
    }
  }, [status, isOnline, isOfflineData]);

  // Monitor network status changes
  useEffect(() => {
    const handleOnline = () => {
      console.log('HomePageClient - Network came back online');
      if (isOfflineData) {
        setIsOfflineData(false);
      }
    };

    const handleOffline = () => {
      console.log('HomePageClient - Network went offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOfflineData]);

  const StatsSkeleton = () => (
    <div className={`grid ${isSmallScreen ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-8`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center">
          <div className="h-8 md:h-12 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-3 md:h-4 bg-gray-200 rounded animate-pulse w-16 md:w-24 mx-auto"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                Master Languages with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  FluentShip
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0">
                Start your language learning voyage with certified native speakers and learners worldwide. Learn through interactive videos, quizzes, live conversations, study groups, personalized paths, and in-person classes at partner institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/students-public">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:shadow-lg transition-all duration-200 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold w-full sm:w-auto">
                    Start Learning
                  </Button>
                </Link>
                <Link href="/institutions-public">
                  <Button size="lg" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 transition-all duration-200 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold w-full sm:w-auto">
                    For Partners
                  </Button>
                </Link>
              </div>
              {/* Small CTA for Language Proficiency Test */}
              <div className="mt-4 flex justify-center lg:justify-start">
                <Link href="/language-proficiency-test">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-blue-100 hover:text-white hover:bg-white/10 transition-all duration-200 px-4 py-2 text-sm font-medium border border-white/20 hover:border-white/40"
                  >
                    <FaAward className="w-4 h-4 mr-2" />
                    Take Free Language Test
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                      <FaPlay className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Interactive Learning</h3>
                      <p className="text-xs md:text-sm text-blue-200">Real-time practice with native speakers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                      <FaScroll className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Certified Programs</h3>
                      <p className="text-xs md:text-sm text-blue-200">Internationally recognized certificates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                      <FaGlobeAmericas className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm md:text-base">Global Community</h3>
                      <p className="text-xs md:text-sm text-blue-200">Join study groups and language exchanges</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(loading && !sessionTimeout && !error) || !stats ? (
            <StatsSkeleton />
          ) : (
            <>
              {/* Offline Data Indicator */}
              {mounted && isOfflineData && (
                <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-center text-blue-800 text-sm">
                    <FaWifi className="w-4 h-4 mr-2" />
                    <span>
                      {!isOnline 
                        ? "You're offline - showing cached data" 
                        : "📊 Showing cached data from previous session - refreshing for latest stats..."
                      }
                    </span>
                  </div>
                </div>
              )}
              <div className={`grid ${isSmallScreen ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4'} gap-4 md:gap-8`}>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2">
                    {!mounted || loading || !stats ? 'Loading...' : `${stats.students.toLocaleString()}+`}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-indigo-600 mb-2">
                    {!mounted || loading || !stats ? 'Loading...' : `${stats.institutions.toLocaleString()}+`}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">Partner Institutions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">
                    {!mounted || loading || !stats ? 'Loading...' : `${stats.courses.toLocaleString()}+`}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">Available Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-cyan-600 mb-2">
                    {!mounted || loading || !stats ? 'Loading...' : `${stats.languages}+`}
                  </div>
                  <div className="text-sm md:text-base text-gray-600">Languages Taught</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Popular Languages Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
              Popular Languages
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from a wide variety of languages taught by native speakers from around the world.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
            {!mounted || (loading && countries.length === 0) ? (
              // Loading skeleton for countries
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="text-center w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                  <CardContent className="p-3 md:p-4 lg:p-6">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16 mx-auto"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              countries.map((country, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer w-[150px] md:w-[180px] lg:w-[200px] flex-shrink-0">
                  <CardContent className="p-3 md:p-4 lg:p-6">
                    <div className="text-xl md:text-2xl lg:text-3xl mb-2">
                      {getCountryFlag(country.country)}
                    </div>
                    <h3 className="font-semibold text-xs md:text-sm lg:text-base text-gray-900 mb-1">
                      {country.country}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {country.courseCount} courses
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
              Why Choose FluentShip?
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Experience language learning like never before with our innovative platform designed for the modern learner.
            </p>
            <p className="text-lg md:text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              "FluentShip — Where fluency meets friendship."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserFriends className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Native Speakers</h3>
              <p className="text-sm md:text-base text-gray-600">
                Learn from certified native speakers who provide authentic pronunciation and cultural insights.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaVideo className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Interactive Lessons</h3>
              <p className="text-sm md:text-base text-gray-600">
                Engage with high-quality video content and interactive exercises designed for optimal retention.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaBrain className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">AI-Powered Learning</h3>
              <p className="text-sm md:text-base text-gray-600">
                Personalized learning paths adapted to your progress and learning style using advanced AI.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaComments className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Live Conversations</h3>
              <p className="text-sm md:text-base text-gray-600">
                Practice speaking with native speakers in real-time conversations and group sessions.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
                       <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Community Learning</h3>
         <p className="text-sm md:text-base text-gray-600">
           Join study groups, language exchange partners, and global communities of learners.
         </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMobile className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Mobile Learning</h3>
              <p className="text-sm md:text-base text-gray-600">
                Learn anywhere, anytime with our mobile-optimized platform and offline capabilities.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLock className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">Secure & Reliable</h3>
              <p className="text-sm md:text-base text-gray-600">
                Your data is protected with enterprise-grade security and 99.9% uptime guarantee.
              </p>
            </div>

            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaGraduationCap className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">In-Person Learning</h3>
              <p className="text-sm md:text-base text-gray-600 mb-2">
                Attend physical classes at our partner institutions for traditional classroom learning with native speakers.
              </p>
              <p className="text-sm text-blue-600 font-medium italic">
                "Best of both worlds"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Get started with FluentShip in just a few simple steps
            </p>
            <p className="text-lg md:text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              "FluentShip — Set sail for your next language."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-xl md:text-2xl">1</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Choose Your Language</h3>
              <p className="text-sm md:text-base text-gray-600">
                Select from our wide range of languages and find the perfect course for your learning goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-xl md:text-2xl">2</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Connect & Collaborate</h3>
              <p className="text-sm md:text-base text-gray-600 mb-2">
                Join live sessions with native speakers, connect with fellow learners in study groups, or attend in-person classes at partner institutions.
              </p>
              <p className="text-xs text-blue-600 font-medium italic">
                "You're never learning alone"
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-xl md:text-2xl">3</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Practice & Improve</h3>
              <p className="text-sm md:text-base text-gray-600">
                Complete interactive exercises, take quizzes, and track your progress with detailed analytics.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <span className="text-white font-bold text-xl md:text-2xl">4</span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">Get Certified</h3>
              <p className="text-sm md:text-base text-gray-600">
                Earn certificates upon completion and showcase your language skills to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-2">
              Hear from real students and institutions who have achieved their language learning goals with FluentShip.
            </p>
            <p className="text-lg md:text-xl text-blue-600 font-semibold max-w-3xl mx-auto">
              "On FluentShip, you're never learning alone."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "FluentShip helped me achieve fluency in English in just 6 months. The native speakers and interactive lessons made all the difference."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Maria Santos</div>
                  <div className="text-blue-600 text-sm">English • Brazil</div>
                  <div className="text-green-600 text-sm font-medium">B2 to C1 in 6 months</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "Partnering with FluentShip has transformed our reach. We now have students from 30+ countries and our revenue has increased by 150%."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Dr. Maria Rodriguez</div>
                  <div className="text-blue-600 text-sm">Director, Spanish Language Institute</div>
                  <div className="text-green-600 text-sm font-medium">Madrid Language Academy</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The live conversation practice sessions and study groups are incredible. I found amazing language exchange partners and can now confidently speak German in professional settings."
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Ahmed Hassan</div>
                  <div className="text-blue-600 text-sm">German • Egypt</div>
                  <div className="text-green-600 text-sm font-medium">A2 to B2 in 8 months</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "The community aspect is what makes FluentShip special. I joined a Spanish study group and made friends from 5 different countries. Learning together is so much more fun!"
                </p>
                <div className="space-y-2">
                  <div className="font-semibold text-gray-900">Emma Thompson</div>
                  <div className="text-blue-600 text-sm">Spanish • Canada</div>
                  <div className="text-green-600 text-sm font-medium">Beginner to B1 in 5 months</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Start your language learning journey with flexible plans designed for every learner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {homepageDisplayPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-2 border-blue-500 bg-blue-50' : 'border-2 border-gray-200 hover:border-blue-500 transition-all duration-300'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
                  </div>
                )}
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">{typeof plan.price === 'number' ? `$${plan.price}` : plan.price}<span className="text-lg text-gray-500">{plan.period}</span></div>
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.slice(0, 7).map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                        <span className="text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.name === 'Free Trial' ? (
                    <Link href="/subscription/trial">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Start Free Trial
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/subscription-signup">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        Choose {plan.name}
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
              <FaComments className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto mb-4">
              Find answers to common questions about FluentShip language learning platform.
            </p>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold max-w-4xl mx-auto">
              "Fluent learning starts with human connection."
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {/* FAQ Item 1 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <FaPlay className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                    How does FluentShip work?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    FluentShip connects you with certified native speakers through interactive video lessons, live conversations, personalized learning paths, and in-person classes at our partner institutions. Our AI-powered platform adapts to your learning style and progress.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 2 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <FaGlobe className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                    What languages are available?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    We offer courses in 25+ languages including English, Spanish, French, German, Italian, Portuguese, Chinese, Japanese, Korean, and many more. New languages are added regularly to meet global demand.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 3 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <FaClock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-200">
                    Can I learn at my own pace?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! FluentShip is designed for flexible learning. You can access courses anytime, anywhere, and our AI adapts the content to your learning speed and preferences. No pressure, just progress.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 4 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <FaCertificate className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-200">
                    Do you offer certificates?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Yes! Upon completing courses and reaching proficiency milestones, you'll receive certificates that are recognized by educational institutions and employers worldwide. Your achievements matter.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 5 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <FaUsers className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                    Can I practice with other learners?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Absolutely! FluentShip offers study groups, language exchange partnerships, and community forums where you can practice with fellow learners. Join topic-specific discussion groups and participate in group challenges.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Item 6 */}
            <div className="group bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-cyan-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/10 to-teal-600/10 rounded-bl-full transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <FaRocket className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors duration-200">
                    How do I get started?
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Getting started is easy! Simply sign up for a free account, choose your target language, and begin with our assessment to determine your current level. Our platform will guide you through the rest of your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Ready to Start Your Language Journey?
          </h2>
          <p className="text-lg md:text-xl text-blue-100 mb-4 max-w-3xl mx-auto">
            Join thousands of learners who have already transformed their language skills with FluentShip.
          </p>
          <p className="text-xl md:text-2xl text-yellow-300 font-bold mb-6 md:mb-8 max-w-3xl mx-auto">
            "Learn together. Speak with confidence."
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/students-public">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold">
                Start Learning Today
              </Button>
            </Link>
            <Link href="/institutions-public">
              <Button size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all duration-200">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function getCountryFlag(countryName: string): string {
  const countryCodeMap: { [key: string]: string } = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'China': '🇨🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'India': '🇮🇳',
    'Russia': '🇷🇺',
    'Netherlands': '🇳🇱',
    'Sweden': '🇸🇪',
    'Norway': '🇳🇴',
    'Denmark': '🇩🇰',
    'Finland': '🇫🇮',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Belgium': '🇧🇪',
    'Portugal': '🇵🇹',
    'Greece': '🇬🇷',
    'Poland': '🇵🇱',
    'Czech Republic': '🇨🇿',
    'Hungary': '🇭🇺',
    'Romania': '🇷🇴',
    'Bulgaria': '🇧🇬',
    'Croatia': '🇭🇷',
    'Slovenia': '🇸🇮',
    'Slovakia': '🇸🇰',
    'Estonia': '🇪🇪',
    'Latvia': '🇱🇻',
    'Lithuania': '🇱🇹',
    'Ireland': '🇮🇪',
    'Iceland': '🇮🇸',
    'Luxembourg': '🇱🇺',
    'Malta': '🇲🇹',
    'Cyprus': '🇨🇾',
    'New Zealand': '🇳🇿',
    'Singapore': '🇸🇬',
    'Hong Kong': '🇭🇰',
    'Taiwan': '🇹🇼',
    'Thailand': '🇹🇭',
    'Vietnam': '🇻🇳',
    'Malaysia': '🇲🇾',
    'Indonesia': '🇮🇩',
    'Philippines': '🇵🇭',
    'Turkey': '🇹🇷',
    'Israel': '🇮🇱',
    'Saudi Arabia': '🇸🇦',
    'UAE': '🇦🇪',
    'Qatar': '🇶🇦',
    'Kuwait': '🇰🇼',
    'Bahrain': '🇧🇭',
    'Oman': '🇴🇲',
    'Jordan': '🇯🇴',
    'Lebanon': '🇱🇧',
    'Egypt': '🇪🇬',
    'Morocco': '🇲🇦',
    'Tunisia': '🇹🇳',
    'Algeria': '🇩🇿',
    'Libya': '🇱🇾',
    'Sudan': '🇸🇩',
    'Ethiopia': '🇪🇹',
    'Kenya': '🇰🇪',
    'Uganda': '🇺🇬',
    'Tanzania': '🇹🇿',
    'Ghana': '🇬🇭',
    'Nigeria': '🇳🇬',
    'South Africa': '🇿🇦',
    'Namibia': '🇳🇦',
    'Botswana': '🇧🇼',
    'Zimbabwe': '🇿🇼',
    'Zambia': '🇿🇲',
    'Malawi': '🇲🇼',
    'Mozambique': '🇲🇿',
    'Angola': '🇦🇴',
    'Congo': '🇨🇬',
    'Gabon': '🇬🇦',
    'Cameroon': '🇨🇲',
    'Chad': '🇹🇩',
    'Niger': '🇳🇪',
    'Mali': '🇲🇱',
    'Burkina Faso': '🇧🇫',
    'Senegal': '🇸🇳',
    'Guinea': '🇬🇳',
    'Sierra Leone': '🇸🇱',
    'Liberia': '🇱🇷',
    'Ivory Coast': '🇨🇮',
    'Togo': '🇹🇬',
    'Benin': '🇧🇯',
    'Central African Republic': '🇨🇫',
    'Democratic Republic of the Congo': '🇨🇩',
    'Rwanda': '🇷🇼',
    'Burundi': '🇧🇮',
    'Somalia': '🇸🇴',
    'Djibouti': '🇩🇯',
    'Eritrea': '🇪🇷',
    'Comoros': '🇰🇲',
    'Seychelles': '🇸🇨',
    'Mauritius': '🇲🇺',
    'Madagascar': '🇲🇬',
         'Cape Verde': '🇨🇻',
     'Guinea-Bissau': '🇬🇼',
     'Equatorial Guinea': '🇬🇶',
     'São Tomé and Príncipe': '🇸🇹',
     'Mauritania': '🇲🇷',
     'Western Sahara': '🇪🇭',
     'Gambia': '🇬🇲'
  };

  return countryCodeMap[countryName] || '🌍';
} 