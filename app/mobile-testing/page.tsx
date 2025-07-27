'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Database,
  Zap,
  Settings,
  Eye,
  EyeOff,
  Upload,
  Download
} from 'lucide-react';
import { MobileTestingInterface } from '@/components/MobileTestingInterface';

export default function MobileTestingPage() {
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pendingActions, setPendingActions] = useState(0);
  const [pendingProgress, setPendingProgress] = useState(0);
  const [pendingQuizzes, setPendingQuizzes] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const [showTestingInterface, setShowTestingInterface] = useState(false);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);

  // Initialize client-side data
  useEffect(() => {
    setIsClient(true);
    
    // Set online status
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Load offline data if available
    const loadOfflineData = async () => {
      try {
        if (typeof window !== 'undefined' && 'indexedDB' in window) {
          // Try to load offline data
          // const { offlineStorage } = await import('@/lib/offline-storage');
          await offlineStorage.init();
          setIsServiceWorkerReady(true);
          
          // Load data
          const [pendingActionsData, progressData, quizData] = await Promise.all([
            offlineStorage.getPendingActions(),
            offlineStorage.getStoredCourseProgress(),
            offlineStorage.getStoredQuizSubmissions()
          ]);
          
          setPendingActions(pendingActionsData.length);
          setPendingProgress(progressData.length);
          setPendingQuizzes(quizData.length);
          
          // Load courses and categories
          const [coursesData, categoriesData] = await Promise.all([
            offlineStorage.getOfflineCourses(),
            offlineStorage.getOfflineCategories()
          ]);
          
          setCourses(coursesData);
          setCategories(categoriesData);
          
          // Get total size
          const size = await offlineStorage.getDatabaseSize();
          setTotalSize(size);
        }
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error('Failed to load offline data:');
      }
    };

    loadOfflineData();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const getDeviceInfo = () => {
    if (typeof window === 'undefined') return {};
    
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      maxTouchPoints: navigator.maxTouchPoints,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        devicePixelRatio: window.devicePixelRatio
      },
      features: {
        serviceWorker: 'serviceWorker' in navigator,
        pushManager: 'PushManager' in window,
        notifications: 'Notification' in window,
        indexedDB: 'indexedDB' in window,
        localStorage: 'localStorage' in window,
        sessionStorage: 'sessionStorage' in window,
        webGL: 'WebGLRenderingContext' in window,
        webAudio: 'AudioContext' in window,
        geolocation: 'geolocation' in navigator,
        mediaDevices: 'mediaDevices' in navigator
      }
    };
  };

  const [deviceInfo] = useState(getDeviceInfo());

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const detectDeviceType = () => {
    if (typeof window === 'undefined') return 'unknown';
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const [deviceType] = useState(detectDeviceType());

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4 space-y-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading mobile testing interface...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Mobile Device Testing</h1>
              <p className="text-gray-600">Comprehensive testing for all device types</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Offline Data</p>
                  <p className="text-2xl font-bold">{formatBytes(totalSize * 1024)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Pending Sync</p>
                  <p className="text-2xl font-bold">{pendingActions + pendingProgress + pendingQuizzes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Cached Content</p>
                  <p className="text-2xl font-bold">{courses.length + categories.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">Service Worker</p>
                  <p className="text-2xl font-bold">{isServiceWorkerReady ? 'Ready' : 'Not Ready'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Current Device Information</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeviceInfo(!showDeviceInfo)}
              >
                {showDeviceInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDeviceInfo ? 'Hide' : 'Show'} Details
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {deviceType === 'mobile' && <Smartphone className="w-4 h-4" />}
                  {deviceType === 'tablet' && <Tablet className="w-4 h-4" />}
                  {deviceType === 'desktop' && <Monitor className="w-4 h-4" />}
                  <span className="font-medium">Device Type</span>
                </div>
                <Badge variant="outline">{deviceType}</Badge>
              </div>

              <div className="space-y-2">
                <span className="font-medium">Screen Resolution</span>
                <Badge variant="outline">{deviceInfo.screen?.width} x {deviceInfo.screen?.height}</Badge>
              </div>

              <div className="space-y-2">
                <span className="font-medium">Browser</span>
                <Badge variant="outline">{deviceInfo.userAgent?.split(' ').pop()?.split('/')[0]}</Badge>
              </div>
            </div>

            {showDeviceInfo && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3">Detailed Device Information</h4>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(deviceInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Testing Interface Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Mobile Testing Interface</h3>
                <p className="text-gray-600">Test responsive design and mobile features</p>
              </div>
              <Button
                onClick={() => setShowTestingInterface(!showTestingInterface)}
                variant={showTestingInterface ? "outline" : "default"}
              >
                {showTestingInterface ? 'Hide' : 'Show'} Testing Interface
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Testing Interface */}
        {showTestingInterface && (
          <MobileTestingInterface />
        )}
      </div>
    </div>
  );
} 