"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { useSession } from "next-auth/react";
import { 
  upcomingClasses, 
  getUpcomingClasses, 
  getReadyToJoinClasses,
  getLiveClassById,
  type UpcomingClass 
} from "./data/liveClassesData";
import {
  FaVideo,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStar,
  FaArrowRight,
  FaHeadphones,
  FaCalendarAlt,
  FaPlay,
  FaCheckCircle,
  FaRocket,
  FaGraduationCap,
  FaHeart,
  FaShieldAlt,
  FaBolt,
  FaChartLine,
  FaDollarSign,
  FaUsersCog,
  FaLaptop,
  FaMobile,
  FaBookOpen,
} from "react-icons/fa";

export default function VideoConferencingFeaturePage() {
  const { data: session } = useSession();
  const {
    userType,
    canAccessLiveClasses,
    currentPlan,
    loading: subscriptionLoading,
  } = useSubscription();

  // State for managing UI interactions
  const [favoriteSessions, setFavoriteSessions] = useState<number[]>([]);
  const [showDemo, setShowDemo] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [upcomingClassesData, setUpcomingClassesData] = useState<UpcomingClass[]>([]);
  const [readyToJoinClasses, setReadyToJoinClasses] = useState<UpcomingClass[]>([]);

  // Handler functions
  const handleAccessLiveClasses = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        // Default to student page for other roles
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleWatchDemo = () => {
    setShowDemo(true);
    // In a real app, this would open a video modal or redirect to demo page
    alert("Demo video would play here. This is a placeholder for the demo functionality.");
  };

  const handleJoinClass = (sessionId: number) => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handlePreviewClass = (sessionId: number) => {
    setSelectedSession(sessionId);
    // In a real app, this would show a preview modal
    alert(`Preview for session ${sessionId} would show here.`);
  };

  const handleToggleFavorite = (sessionId: number) => {
    setFavoriteSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleBookSession = (sessionId: number) => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleViewSchedule = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate schedule page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleViewProgress = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate progress page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/progress";
      } else {
        window.location.href = "/student/progress";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleJoinNextClass = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleBookNewSession = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleViewMaterials = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate materials page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/courses";
      } else {
        window.location.href = "/student/courses";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleViewProfile = (instructorId: number) => {
    window.location.href = `/instructor/${instructorId}`;
  };

  const handleStartFreeTrial = () => {
    if (session?.user) {
      window.location.href = "/subscription/trial";
    } else {
      window.location.href = "/auth/signin?redirect=/subscription/trial";
    }
  };

  const handleStartPremium = () => {
    if (session?.user) {
      window.location.href = "/subscription/premium";
    } else {
      window.location.href = "/auth/signin?redirect=/subscription/premium";
    }
  };

  const handleContactSales = () => {
    window.location.href = "/contact/sales";
  };

  const handleBrowseAllClasses = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate live classes page based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin/live-classes";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution/live-classes";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student/live-classes";
      } else {
        window.location.href = "/student/live-classes";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleGoToDashboard = () => {
    if (canAccessLiveClasses) {
      // Route to appropriate dashboard based on user role
      if (session?.user?.role === 'ADMIN') {
        window.location.href = "/admin";
      } else if (session?.user?.role === 'INSTITUTION_STAFF') {
        window.location.href = "/institution";
      } else if (session?.user?.role === 'STUDENT') {
        window.location.href = "/student";
      } else {
        window.location.href = "/student";
      }
    } else {
      setShowTrialModal(true);
    }
  };

  const handleExploreLiveConversations = () => {
    window.location.href = "/features/live-conversations";
  };

  const handleCloseModal = () => {
    setShowDemo(false);
    setShowPricingModal(false);
    setShowTrialModal(false);
    setSelectedSession(null);
  };

  // Load upcoming classes data
  useEffect(() => {
    const fetchLiveClassesData = async () => {
      try {
        // Fetch ready to join classes
        const readyResponse = await fetch('/api/features/live-classes/ready-to-join');
        if (readyResponse.ok) {
          const readyData = await readyResponse.json();
          setReadyToJoinClasses(readyData.readyToJoinClasses || []);
        }

        // Fetch upcoming classes
        const upcomingResponse = await fetch('/api/features/live-classes/upcoming');
        if (upcomingResponse.ok) {
          const upcomingData = await upcomingResponse.json();
          setUpcomingClassesData(upcomingData.upcomingClasses || []);
        }
      } catch (error) {
        console.error('Error fetching live classes data:', error);
        // Fallback to static data if API fails
        setUpcomingClassesData(getUpcomingClasses());
        setReadyToJoinClasses(getReadyToJoinClasses());
      }
    };

    if (canAccessLiveClasses) {
      fetchLiveClassesData();
    }
  }, [canAccessLiveClasses]);

  // Join specific upcoming class
  const handleJoinUpcomingClass = (classId: string) => {
    if (canAccessLiveClasses) {
      // Use the WebRTC session page instead of external meeting link
      window.open(`/student/live-classes/session/${classId}`, '_blank');
    } else {
      setShowTrialModal(true);
    }
  };

  // Join next available class
  const handleJoinNextAvailableClass = () => {
    if (canAccessLiveClasses) {
      const nextClass = readyToJoinClasses[0];
      if (nextClass) {
        handleJoinUpcomingClass(nextClass.id);
      } else {
        alert('No classes are ready to join at the moment. Check your schedule for upcoming classes.');
      }
    } else {
      setShowTrialModal(true);
    }
  };

  // Format time for display
  const formatClassTime = (startTime: string) => {
    const date = new Date(startTime);
    const now = new Date();
    const timeDiff = date.getTime() - now.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hoursDiff = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (daysDiff > 0) {
      return `${daysDiff} day${daysDiff > 1 ? 's' : ''} from now`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} from now`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} from now`;
    } else {
      return 'Starting now';
    }
  };

  // Format date for display
  const formatClassDate = (startTime: string) => {
    const date = new Date(startTime);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const demoSessions = [
    {
      id: 1,
      title: "Advanced Spanish Conversation",
      language: "Spanish",
      instructor: "Dr. María González",
      time: "Today, 3:00 PM",
      duration: "60 min",
      participants: 6,
      maxParticipants: 8,
      level: "Advanced",
      type: "Group Session",
      price: 29.99,
      rating: 4.9,
      reviews: 234,
      features: ["Screen Sharing", "Recording", "Chat", "Breakout Rooms"],
    },
    {
      id: 2,
      title: "Business English Masterclass",
      language: "English",
      instructor: "Prof. Sarah Johnson",
      time: "Today, 5:30 PM",
      duration: "90 min",
      participants: 4,
      maxParticipants: 6,
      level: "Professional",
      type: "Workshop",
      price: 49.99,
      rating: 4.8,
      reviews: 156,
      features: ["Presentation Mode", "Recording", "Chat", "File Sharing"],
    },
    {
      id: 3,
      title: "French Pronunciation Workshop",
      language: "French",
      instructor: "Pierre Dubois",
      time: "Tomorrow, 10:00 AM",
      duration: "45 min",
      participants: 12,
      maxParticipants: 15,
      level: "All Levels",
      type: "Workshop",
      price: 19.99,
      rating: 4.7,
      reviews: 189,
      features: ["Screen Sharing", "Recording", "Chat"],
    },
  ];

  const instructors = [
    {
      id: 1,
      name: "Dr. María González",
      language: "Spanish",
      country: "Spain",
      rating: 4.9,
      students: 2500,
      sessions: 850,
      hourlyRate: 45,
      specialties: ["Conversation", "Business Spanish", "DELE Preparation"],
      verified: true,
    },
    {
      id: 2,
      name: "Prof. Sarah Johnson",
      language: "English",
      country: "USA",
      rating: 4.8,
      students: 1800,
      sessions: 620,
      hourlyRate: 55,
      specialties: ["Business English", "IELTS", "TOEFL"],
      verified: true,
    },
    {
      id: 3,
      name: "Pierre Dubois",
      language: "French",
      country: "France",
      rating: 4.9,
      students: 1200,
      sessions: 480,
      hourlyRate: 40,
      specialties: ["Pronunciation", "DELF", "Conversation"],
      verified: true,
    },
  ];

  const features = [
    {
      title: "HD Live Video Quality",
      description: "Crystal clear video with adaptive quality based on your connection",
      icon: <FaVideo className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Screen Sharing",
      description: "Share your screen for presentations, documents, and interactive learning",
      icon: <FaLaptop className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Recording & Playback",
      description: "Record live classes for later review and learning reinforcement",
      icon: <FaPlay className="w-6 h-6" />,
      color: "bg-purple-500",
    },
    {
      title: "Breakout Rooms",
      description: "Split into smaller groups for focused practice and discussions",
      icon: <FaUsers className="w-6 h-6" />,
      color: "bg-orange-500",
    },
    {
      title: "Chat & File Sharing",
      description: "Real-time messaging and secure file sharing during live classes",
      icon: <FaHeadphones className="w-6 h-6" />,
      color: "bg-pink-500",
    },
    {
      title: "Mobile Optimized",
      description: "Join live classes from any device with our mobile-friendly interface",
      icon: <FaMobile className="w-6 h-6" />,
      color: "bg-indigo-500",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Live Classes", icon: <FaVideo className="w-6 h-6" /> },
    { number: "500+", label: "Certified Instructors", icon: <FaGraduationCap className="w-6 h-6" /> },
    { number: "50+", label: "Languages", icon: <FaGlobe className="w-6 h-6" /> },
    { number: "99.9%", label: "Uptime", icon: <FaShieldAlt className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4">
              <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                🚀 Premium Feature
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Engaging Live Classes
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Experience the future of language learning through our interactive, real-time classes led by expert instructors.
            </p>
                         <div className="flex flex-col sm:flex-row gap-4 justify-center">
               {canAccessLiveClasses ? (
                 <Button 
                   size="lg" 
                   className="bg-green-500 hover:bg-green-600 text-white"
                   onClick={handleAccessLiveClasses}
                 >
                   <FaPlay className="w-5 h-5 mr-2" />
                   Access Live Classes
                 </Button>
               ) : (
                 <Button 
                   size="lg" 
                   className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                   onClick={handleStartFreeTrial}
                 >
                   <FaPlay className="w-5 h-5 mr-2" />
                   Try Free Session
                 </Button>
               )}
               <Button 
                 size="lg" 
                 className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg"
                 onClick={handleWatchDemo}
               >
                 <FaVideo className="w-5 h-5 mr-2" />
                 Watch Demo
               </Button>
             </div>
          </div>
        </div>
      </section>

      {/* Access Status Banner */}
      {session?.user && !subscriptionLoading && (
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${canAccessLiveClasses ? "bg-green-500" : "bg-yellow-500"}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {canAccessLiveClasses
                      ? "You have access to live classes"
                      : "Live classes require a subscription"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {canAccessLiveClasses
                      ? currentPlan
                        ? `Current Plan: ${currentPlan}`
                        : "Active Subscription"
                      : "Upgrade to access live classes"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 mb-2 flex justify-center">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Sessions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
               {canAccessLiveClasses
                 ? "Your Live Classes Dashboard"
                 : "Experience Professional Live Classes"}
             </h2>
             <p className="text-xl text-gray-600">
               {canAccessLiveClasses
                 ? "Access your scheduled classes and discover new learning opportunities"
                 : "Join upcoming sessions and see the power of our live class platform"}
             </p>
           </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {session.type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                      {session.rating} ({session.reviews})
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{session.title}</h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGlobe className="w-4 h-4 mr-2" />
                      {session.language}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaGraduationCap className="w-4 h-4 mr-2" />
                      {session.instructor}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaClock className="w-4 h-4 mr-2" />
                      {session.time} • {session.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUsers className="w-4 h-4 mr-2" />
                      {session.participants}/{session.maxParticipants} students
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaDollarSign className="w-4 h-4 mr-2" />
                      ${session.price}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {session.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                                     <div className="flex gap-2">
                     {canAccessLiveClasses ? (
                       <>
                         <Button 
                           className="flex-1 bg-green-600 hover:bg-green-700"
                           onClick={() => handleJoinClass(session.id)}
                         >
                           <FaPlay className="w-4 h-4 mr-2" />
                           Join Class
                         </Button>
                         <Button 
                           variant="outline" 
                           className="px-3"
                           onClick={() => handleBookSession(session.id)}
                         >
                           <FaCalendarAlt className="w-4 h-4" />
                         </Button>
                       </>
                     ) : (
                       <>
                         <Button 
                           className="flex-1 bg-blue-600 hover:bg-blue-700"
                           onClick={() => handlePreviewClass(session.id)}
                         >
                           <FaPlay className="w-4 h-4 mr-2" />
                           Preview Class
                         </Button>
                         <Button 
                           variant="outline" 
                           className="px-3"
                           onClick={() => handleToggleFavorite(session.id)}
                         >
                           <FaHeart className={`w-4 h-4 ${favoriteSessions.includes(session.id) ? 'text-red-500' : ''}`} />
                         </Button>
                       </>
                     )}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Expert Instructors</h2>
            <p className="text-xl text-gray-600">Learn from certified language teachers and native speakers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <Card key={instructor.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <FaGraduationCap className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{instructor.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {instructor.language} • {instructor.country}
                    </p>
                    {instructor.verified && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <FaCheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-center mb-4">
                    <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-semibold">{instructor.rating}</span>
                    <span className="text-sm text-gray-500 ml-1">({instructor.students} students)</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>${instructor.hourlyRate}/hour</div>
                    <div>{instructor.sessions} classes completed</div>
                  </div>
                  <div className="space-y-1 mb-4">
                    {instructor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mr-1 mb-1 inline-block"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                                     <Button 
                     variant="outline" 
                     className="w-full"
                     onClick={() => handleViewProfile(instructor.id)}
                   >
                     View Profile
                   </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
             </section>

       {/* Live Classes Dashboard Section */}
       {canAccessLiveClasses && (
         <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                 Your Learning Journey
               </h2>
               <p className="text-xl text-gray-600">
                 Track your progress and manage your live class schedule
               </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {/* Upcoming Classes */}
               <Card className="bg-white shadow-lg">
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <FaCalendarAlt className="w-6 h-6 text-blue-600 mr-3" />
                     <h3 className="text-xl font-semibold text-gray-900">Upcoming Classes</h3>
                   </div>
                                       <div className="space-y-3">
                      {upcomingClassesData.length > 0 ? (
                        upcomingClassesData.slice(0, 2).map((classItem) => (
                          <div 
                            key={classItem.id}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                            onClick={() => handleJoinUpcomingClass(classItem.id)}
                          >
                            <div>
                              <p className="font-medium text-gray-900">{classItem.title}</p>
                              <p className="text-sm text-gray-600">
                                {formatClassDate(classItem.startTime)} • {formatClassTime(classItem.startTime)}
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{classItem.duration} min</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <p>No upcoming classes scheduled</p>
                          <p className="text-sm">Book a session to get started!</p>
                        </div>
                      )}
                    </div>
                                       <Button 
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                      onClick={handleViewSchedule}
                    >
                      View Schedule
                    </Button>
                 </CardContent>
               </Card>

               {/* Progress Tracking */}
               <Card className="bg-white shadow-lg">
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <FaChartLine className="w-6 h-6 text-green-600 mr-3" />
                     <h3 className="text-xl font-semibold text-gray-900">Your Progress</h3>
                   </div>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Classes Completed</span>
                       <span className="font-semibold text-gray-900">12</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Hours Learned</span>
                       <span className="font-semibold text-gray-900">24</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Current Streak</span>
                       <span className="font-semibold text-gray-900">5 days</span>
                     </div>
                     <div className="flex items-center justify-between">
                       <span className="text-sm text-gray-600">Average Rating</span>
                       <div className="flex items-center">
                         <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
                         <span className="font-semibold text-gray-900">4.9</span>
                       </div>
                     </div>
                   </div>
                                       <Button 
                      className="w-full mt-4 bg-green-600 hover:bg-green-700"
                      onClick={handleViewProgress}
                    >
                      View Details
                    </Button>
                 </CardContent>
               </Card>

               {/* Quick Actions */}
               <Card className="bg-white shadow-lg">
                 <CardContent className="p-6">
                   <div className="flex items-center mb-4">
                     <FaBolt className="w-6 h-6 text-purple-600 mr-3" />
                     <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                   </div>
                   <div className="space-y-3">
                                           <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={handleJoinNextAvailableClass}
                      >
                        <FaPlay className="w-4 h-4 mr-2" />
                        {readyToJoinClasses.length > 0 ? 'Join Next Class' : 'No Classes Ready'}
                      </Button>
                     <Button 
                       variant="outline" 
                       className="w-full"
                       onClick={handleBookNewSession}
                     >
                       <FaCalendarAlt className="w-4 h-4 mr-2" />
                       Book Session
                     </Button>
                     <Button 
                       variant="outline" 
                       className="w-full"
                       onClick={handleViewMaterials}
                     >
                       <FaBookOpen className="w-4 h-4 mr-2" />
                       View Materials
                     </Button>
                   </div>
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>
       )}

       {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need for effective live language learning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className={`${feature.color} text-white rounded-full w-12 h-12 flex items-center justify-center mb-4`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
             </section>

       {/* Pricing */}
       <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
             <p className="text-xl text-gray-600">Start with a free trial and upgrade when you're ready</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               {
                 name: "Free Trial",
                 price: "$0",
                 period: "1 session",
                 features: [
                   "1 free live class",
                   "Basic video features",
                   "Screen sharing",
                   "Chat functionality",
                   "Class recording (24h)",
                   "Community forum access",
                 ],
                 cta: "Start Free Trial",
                 popular: false,
               },
               {
                 name: "Premium",
                 price: "$24.99",
                 period: "/month",
                 features: [
                   "Unlimited live classes",
                   "All languages and instructors",
                   "Priority booking",
                   "HD video quality",
                   "Advanced screen sharing",
                   "Class recordings (30 days)",
                   "Breakout rooms",
                   "File sharing",
                   "Advanced analytics",
                   "Study group access",
                 ],
                 cta: "Start Premium",
                 popular: true,
               },
               {
                 name: "Enterprise",
                 price: "Custom",
                 period: "",
                 features: [
                   "Custom live class programs",
                   "Dedicated instructors",
                   "Unlimited recordings",
                   "Advanced analytics",
                   "API integration",
                   "White-label options",
                   "24/7 priority support",
                   "Custom branding",
                   "Multi-language support",
                   "Bulk pricing",
                 ],
                 cta: "Contact Sales",
                 popular: false,
               },
             ].map((plan, index) => (
               <Card key={index} className={`relative ${plan.popular ? "border-2 border-blue-500 bg-blue-50" : ""}`}>
                 {plan.popular && (
                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                     <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                   </div>
                 )}
                 <CardContent className="p-6 text-center">
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                   <div className="text-3xl font-bold text-blue-600 mb-4">
                     {plan.price}
                     {plan.period && <span className="text-lg text-gray-500">{plan.period}</span>}
                   </div>
                   <ul className="space-y-3 mb-8 text-left">
                     {plan.features.map((feature, featureIndex) => (
                       <li key={featureIndex} className="flex items-center">
                         <FaCheckCircle className="w-4 h-4 text-green-500 mr-3" />
                         <span className="text-sm">{feature}</span>
                       </li>
                     ))}
                   </ul>
                                       <Button
                      className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
                      onClick={
                        plan.name === "Free Trial" 
                          ? handleStartFreeTrial
                          : plan.name === "Premium" 
                          ? handleStartPremium
                          : handleContactSales
                      }
                    >
                      {plan.cta}
                    </Button>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>
       </section>

       {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                     <h2 className="text-3xl md:text-4xl font-bold mb-4">
             {canAccessLiveClasses
               ? "Ready to Continue Your Learning Journey?"
               : "Ready to Experience Professional Live Class Learning?"}
           </h2>
           <p className="text-xl text-blue-100 mb-8">
             {canAccessLiveClasses
               ? "Keep building your language skills with our comprehensive live class platform"
               : "Join thousands of learners who have transformed their language skills through our live class platform"}
           </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
               {canAccessLiveClasses ? (
                 <>
                   <Button 
                     size="lg" 
                     className="bg-green-500 hover:bg-green-600 text-white"
                     onClick={handleBrowseAllClasses}
                   >
                     <FaRocket className="w-5 h-5 mr-2" />
                     Browse All Classes
                   </Button>
                   <Button 
                     size="lg" 
                     className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg"
                     onClick={handleGoToDashboard}
                   >
                     <FaArrowRight className="w-5 h-5 mr-2" />
                     Go to Dashboard
                   </Button>
                 </>
               ) : (
                 <>
                   <Button 
                     size="lg" 
                     className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                     onClick={handleStartFreeTrial}
                   >
                     <FaRocket className="w-5 h-5 mr-2" />
                     Start Your Free Trial
                   </Button>
                   <Button 
                     size="lg" 
                     className="border-2 border-white bg-transparent text-white hover:bg-white hover:text-blue-600 font-semibold shadow-lg"
                     onClick={handleExploreLiveConversations}
                   >
                     <FaArrowRight className="w-5 h-5 mr-2" />
                     Explore Live Conversations
                   </Button>
                 </>
               )}
             </div>
        </div>
             </section>

       {/* Trial Signup Modal */}
       {showTrialModal && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
             <h3 className="text-xl font-bold text-gray-900 mb-4">Start Your Free Trial</h3>
             <p className="text-gray-600 mb-6">
               Get access to live classes and start your language learning journey today!
             </p>
             <div className="flex gap-3">
               <Button 
                 className="flex-1 bg-blue-600 hover:bg-blue-700"
                 onClick={handleStartFreeTrial}
               >
                 Start Free Trial
               </Button>
               <Button 
                 variant="outline" 
                 onClick={handleCloseModal}
               >
                 Cancel
               </Button>
             </div>
           </div>
         </div>
       )}

       {/* Demo Modal */}
       {showDemo && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-bold text-gray-900">Live Class Demo</h3>
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={handleCloseModal}
               >
                 ✕
               </Button>
             </div>
             <div className="bg-gray-100 rounded-lg p-8 text-center">
               <FaVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
               <p className="text-gray-600 mb-4">
                 This is where the live class demo video would be embedded.
               </p>
               <p className="text-sm text-gray-500">
                 Experience the interactive features, HD video quality, and real-time learning environment.
               </p>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 } 