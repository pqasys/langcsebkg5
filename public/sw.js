const CACHE_NAME = 'fluentship-v1';
const STATIC_CACHE = 'fluentship-static-v1';
const DYNAMIC_CACHE = 'fluentship-dynamic-v1';
const API_CACHE = 'fluentship-api-v1';
const IMAGE_CACHE = 'fluentship-images-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/courses',
  '/institutions',
  '/offline',
  '/manifest.json',
  '/icon.svg',
  '/pricing',
  '/features',
  '/about',
  '/contact'
];

// Critical CSS and JS files
const CRITICAL_ASSETS = [
  '/globals.css',
  '/_next/static/css/',
  '/_next/static/chunks/',
  '/_next/static/js/'
];

// API endpoints to cache with different strategies
const API_CACHE_PATTERNS = {
  // Cache-first APIs (rarely changing data)
  cacheFirst: [
    '/api/courses/public',
    '/api/categories',
    '/api/institutions',
    '/api/tags',
    '/api/locations'
  ],
  // Network-first APIs (frequently changing data)
  networkFirst: [
    '/api/user/profile',
    '/api/institution/profile',
    '/api/courses/enrolled',
    '/api/student/progress',
    '/api/bookings',
    '/api/stats',
    '/api/courses/by-country'
  ],
  // Stale-while-revalidate APIs (balance between fresh and fast)
  staleWhileRevalidate: [
    '/api/search'
  ]
};

// Image patterns to cache
const IMAGE_PATTERNS = [
  '/uploads/',
  '/_next/image',
  '/temp/'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE)
        .then((cache) => {
          console.log('Caching static files');
          return cache.addAll(STATIC_FILES);
        }),
      
      // Pre-cache critical assets
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          console.log('Pre-caching critical assets');
          return cache.addAll(CRITICAL_ASSETS);
        })
    ])
    .then(() => {
      console.log('All caches initialized successfully');
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Failed to initialize caches:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-HTTP(S) requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle image requests
  if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static file requests
  if (url.origin === self.location.origin) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // Handle external requests (CDN, etc.)
  event.respondWith(handleExternalRequest(request));
});

// Check if request is for an image
function isImageRequest(request) {
  return request.destination === 'image' || 
         request.url.includes('/_next/image') ||
         request.url.includes('/uploads/') ||
         request.url.includes('/temp/');
}

// Handle API requests with different strategies based on endpoint
async function handleApiRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Determine caching strategy based on endpoint
  if (API_CACHE_PATTERNS.cacheFirst.some(pattern => path.startsWith(pattern))) {
    return handleCacheFirst(request);
  } else if (API_CACHE_PATTERNS.networkFirst.some(pattern => path.startsWith(pattern))) {
    return handleNetworkFirst(request);
  } else if (API_CACHE_PATTERNS.staleWhileRevalidate.some(pattern => path.startsWith(pattern))) {
    return handleStaleWhileRevalidate(request);
  } else {
    // Default to network-first for unknown APIs
    return handleNetworkFirst(request);
  }
}

// Cache-first strategy for rarely changing data
async function handleCacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Cache-first failed for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createOfflineResponse(request);
  }
}

// Network-first strategy for frequently changing data
async function handleNetworkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache for:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return createOfflineResponse(request);
  }
}

// Stale-while-revalidate strategy
async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, but we don't need to handle it here
    // as we'll return cached response if available
  });
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    return await fetchPromise;
  } catch (error) {
    return createOfflineResponse(request);
  }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Image request failed:', request.url);
    // Return a placeholder image or empty response
    return new Response('', { status: 404 });
  }
}

// Handle static file requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Static request failed:', request.url);
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline');
    }
    
    return new Response('', { status: 404 });
  }
}

// Handle external requests with cache-first strategy
async function handleExternalRequest(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('External request failed:', request.url);
    return new Response('', { status: 404 });
  }
}

// Create offline response for API requests
function createOfflineResponse(request) {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Return appropriate offline data based on endpoint
  let offlineData = { 
    error: 'Offline mode - data not available',
    offline: true,
    timestamp: new Date().toISOString()
  };
  
  // Provide some basic offline data for common endpoints
  if (path.startsWith('/api/courses/public')) {
    offlineData = {
      courses: [],
      message: 'Course data not available offline',
      offline: true
    };
  } else if (path.startsWith('/api/categories')) {
    offlineData = {
      categories: [],
      message: 'Categories not available offline',
      offline: true
    };
  } else if (path.startsWith('/api/user/profile')) {
    offlineData = {
      error: 'Profile data not available offline',
      offline: true
    };
  }
  
  return new Response(
    JSON.stringify(offlineData),
    {
      status: 503,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    }
  );
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  } else if (event.tag === 'course-progress-sync') {
    event.waitUntil(syncCourseProgress());
  } else if (event.tag === 'quiz-submission-sync') {
    event.waitUntil(syncQuizSubmissions());
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  let notificationData = {
    title: 'Fluentish',
    body: 'You have a new notification',
    icon: '/icon.svg',
    badge: '/icon.svg',
    data: {
      url: '/',
      timestamp: new Date().toISOString()
    }
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { ...notificationData, ...data };
    } catch (error) {
      notificationData.body = event.data.text();
    }
  }

  // Store notification in IndexedDB for history
  event.waitUntil(
    Promise.all([
      self.registration.showNotification(notificationData.title, notificationData),
      storeNotificationInHistory(notificationData)
    ])
  );
});

// Store notification in history
async function storeNotificationInHistory(notificationData) {
  try {
    const history = await getNotificationHistory();
    const newNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    history.unshift(newNotification);
    
    // Keep only last 100 notifications
    if (history.length > 100) {
      history.splice(100);
    }
    
    await storeNotificationHistory(history);
  } catch (error) {
    console.error('Failed to store notification in history:', error);
  }
}

// Get notification history from IndexedDB
async function getNotificationHistory() {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['notifications'], 'readonly');
    const store = transaction.objectStore('notifications');
    const history = await store.get('history');
    return history || [];
  } catch (error) {
    console.error('Failed to get notification history:', error);
    return [];
  }
}

// Store notification history in IndexedDB
async function storeNotificationHistory(history) {
  try {
    const db = await openNotificationDB();
    const transaction = db.transaction(['notifications'], 'readwrite');
    const store = transaction.objectStore('notifications');
    await store.put({ key: 'history', data: history, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to store notification history:', error);
  }
}

// Open notification IndexedDB
async function openNotificationDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', { keyPath: 'key' });
      }
    };
  });
}

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Perform background sync
async function performBackgroundSync() {
  try {
    const pendingActions = await getPendingActions();
    
    for (const action of pendingActions) {
      try {
        await performAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action, error);
      }
    }
    
    // Update last sync time
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETED',
        timestamp: new Date().toISOString()
      });
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Sync course progress
async function syncCourseProgress() {
  try {
    const progressData = await getStoredProgressData();
    
    for (const progress of progressData) {
      try {
        await fetch('/api/student/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(progress)
        });
      } catch (error) {
        console.error('Failed to sync progress:', progress, error);
      }
    }
  } catch (error) {
    console.error('Course progress sync failed:', error);
  }
}

// Sync quiz submissions
async function syncQuizSubmissions() {
  try {
    const quizData = await getStoredQuizData();
    
    for (const quiz of quizData) {
      try {
        await fetch('/api/student/quiz-submission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quiz)
        });
      } catch (error) {
        console.error('Failed to sync quiz submission:', quiz, error);
      }
    }
  } catch (error) {
    console.error('Quiz submission sync failed:', error);
  }
}

// Get pending actions from IndexedDB
async function getPendingActions() {
  // This would typically use IndexedDB to store pending actions
  // For now, return empty array
  return [];
}

// Perform a specific action
async function performAction(action) {
  // Implementation would depend on the action type
  console.log('Performing action:', action);
}

// Remove completed action
async function removePendingAction(actionId) {
  // Remove from IndexedDB
  console.log('Removing action:', actionId);
}

// Get stored progress data
async function getStoredProgressData() {
  // This would get data from IndexedDB
  return [];
}

// Get stored quiz data
async function getStoredQuizData() {
  // This would get data from IndexedDB
  return [];
}

// Handle service worker messages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
}); 