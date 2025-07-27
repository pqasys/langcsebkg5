// Mobile device testing framework for comprehensive device validation
export interface DeviceConfig {
  name: string;
  width: number;
  height: number;
  userAgent: string;
  pixelRatio: number;
  touchSupport: boolean;
  orientation: 'portrait' | 'landscape';
  category: 'mobile' | 'tablet' | 'desktop';
  browser: 'chrome' | 'safari' | 'firefox' | 'edge';
  os: 'ios' | 'android' | 'windows' | 'macos';
}

export interface TestResult {
  device: DeviceConfig;
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
  timestamp: Date;
  details?: unknown;
}

export interface TestSuite {
  name: string;
  description: string;
  tests: TestFunction[];
}

type TestFunction = (device: DeviceConfig) => Promise<TestResult>;

// Device configurations for testing
export const DEVICE_CONFIGS: DeviceConfig[] = [
  // iPhone devices
  {
    name: 'iPhone SE (2020)',
    width: 375,
    height: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 2,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'iPhone 12/13',
    width: 390,
    height: 844,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 3,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'iPhone 12/13 Pro Max',
    width: 428,
    height: 926,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 3,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'iPhone 14 Plus',
    width: 428,
    height: 926,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 3,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 3,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'safari',
    os: 'ios'
  },

  // Android devices
  {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    pixelRatio: 3,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'chrome',
    os: 'android'
  },
  {
    name: 'Google Pixel 6',
    width: 412,
    height: 915,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.104 Mobile Safari/537.36',
    pixelRatio: 2.75,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'chrome',
    os: 'android'
  },
  {
    name: 'OnePlus 9',
    width: 412,
    height: 915,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; LE2113) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    pixelRatio: 2.75,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'chrome',
    os: 'android'
  },
  {
    name: 'Samsung Galaxy A52',
    width: 384,
    height: 854,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-A525F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    pixelRatio: 2.625,
    touchSupport: true,
    orientation: 'portrait',
    category: 'mobile',
    browser: 'chrome',
    os: 'android'
  },

  // iPad/Tablet devices
  {
    name: 'iPad (9th generation)',
    width: 810,
    height: 1080,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 2,
    touchSupport: true,
    orientation: 'portrait',
    category: 'tablet',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'iPad Pro 11-inch',
    width: 834,
    height: 1194,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    pixelRatio: 2,
    touchSupport: true,
    orientation: 'portrait',
    category: 'tablet',
    browser: 'safari',
    os: 'ios'
  },
  {
    name: 'Samsung Galaxy Tab S7',
    width: 800,
    height: 1280,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
    pixelRatio: 2,
    touchSupport: true,
    orientation: 'portrait',
    category: 'tablet',
    browser: 'chrome',
    os: 'android'
  },
  {
    name: 'Amazon Fire HD 10',
    width: 800,
    height: 1280,
    userAgent: 'Mozilla/5.0 (Linux; Android 9; KFMAWI) AppleWebKit/537.36 (KHTML, like Gecko) Silk/91.0.4472.120 Safari/537.36',
    pixelRatio: 1.5,
    touchSupport: true,
    orientation: 'portrait',
    category: 'tablet',
    browser: 'chrome',
    os: 'android'
  },

  // Desktop browsers
  {
    name: 'Chrome Desktop',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    pixelRatio: 1,
    touchSupport: false,
    orientation: 'landscape',
    category: 'desktop',
    browser: 'chrome',
    os: 'windows'
  },
  {
    name: 'Safari Desktop',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_0_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    pixelRatio: 2,
    touchSupport: false,
    orientation: 'landscape',
    category: 'desktop',
    browser: 'safari',
    os: 'macos'
  },
  {
    name: 'Firefox Desktop',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0',
    pixelRatio: 1,
    touchSupport: false,
    orientation: 'landscape',
    category: 'desktop',
    browser: 'firefox',
    os: 'windows'
  },
  {
    name: 'Edge Desktop',
    width: 1920,
    height: 1080,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36 Edg/96.0.1054.62',
    pixelRatio: 1,
    touchSupport: false,
    orientation: 'landscape',
    category: 'desktop',
    browser: 'edge',
    os: 'windows'
  }
];

// Mobile device testing class
export class MobileDeviceTester {
  private results: TestResult[] = [];
  private currentDevice: DeviceConfig | null = null;

  // Set up device simulation
  async simulateDevice(device: DeviceConfig): Promise<void> {
    this.currentDevice = device;
    
    // Set viewport
    if (typeof window !== 'undefined') {
      // Simulate viewport
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', `width=${device.width}, initial-scale=1, maximum-scale=1, user-scalable=no`);
      }

      // Set body dimensions
      document.body.style.width = `${device.width}px`;
      document.body.style.height = `${device.height}px`;
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    }

    // Simulate user agent
    Object.defineProperty(navigator, 'userAgent', {
      value: device.userAgent,
      configurable: true
    });

    // Simulate touch support
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: device.touchSupport ? 5 : 0,
      configurable: true
    });

    // Simulate pixel ratio
    Object.defineProperty(window, 'devicePixelRatio', {
      value: device.pixelRatio,
      configurable: true
    });

    // // // // // // // // // // console.log(`Simulating device: ${device.name}`);
  }

  // Test responsive design
  async testResponsiveDesign(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      if (!this.currentDevice) {
        throw new Error(`No device configured - Context: No device configured - Context:` );
      }

      const device = this.currentDevice;
      const issues: string[] = [];

      // Test viewport meta tag
      const viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        issues.push('Missing viewport meta tag');
      }

      // Test responsive breakpoints
      const bodyWidth = document.body.offsetWidth;
      const bodyHeight = document.body.offsetHeight;

      if (bodyWidth !== device.width) {
        issues.push(`Body width mismatch: expected ${device.width}, got ${bodyWidth}`);
      }

      // Test CSS media queries
      const mediaQueryTests = [
        { query: '(max-width: 768px)', expected: device.category === 'mobile' },
        { query: '(min-width: 768px) and (max-width: 1024px)', expected: device.category === 'tablet' },
        { query: '(min-width: 1024px)', expected: device.category === 'desktop' }
      ];

      for (const test of mediaQueryTests) {
        const matches = window.matchMedia(test.query).matches;
        if (matches !== test.expected) {
          issues.push(`Media query ${test.query} mismatch: expected ${test.expected}, got ${matches}`);
        }
      }

      // Test touch targets
      const touchTargets = document.querySelectorAll('button, a, input, select, textarea');
      const smallTouchTargets: Element[] = [];

      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const minSize = 44; // iOS minimum touch target size
        
        if (rect.width < minSize || rect.height < minSize) {
          smallTouchTargets.push(target);
        }
      });

      if (device.touchSupport && smallTouchTargets.length > 0) {
        issues.push(`${smallTouchTargets.length} touch targets are too small (< 44px)`);
      }

      return {
        device,
        testName: 'Responsive Design',
        passed: issues.length === 0,
        error: issues.length > 0 ? issues.join('; ') : undefined,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          bodyWidth,
          bodyHeight,
          smallTouchTargets: smallTouchTargets.length,
          issues
        }
      };
    } catch (error) {
      return {
        device: this.currentDevice!,
        testName: 'Responsive Design',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  // Test touch interactions
  async testTouchInteractions(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      if (!this.currentDevice) {
        throw new Error(`No device configured - Context: const startTime = Date.now();...`);
      }

      const device = this.currentDevice;
      const issues: string[] = [];

      if (!device.touchSupport) {
        return {
          device,
          testName: 'Touch Interactions',
          passed: true,
          duration: Date.now() - startTime,
          timestamp: new Date(),
          details: { skipped: 'Device does not support touch' }
        };
      }

      // Test touch event support
      const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
      const missingEvents: string[] = [];

      touchEvents.forEach(event => {
        if (!('ontouchstart' in window)) {
          missingEvents.push(event);
        }
      });

      if (missingEvents.length > 0) {
        issues.push(`Missing touch events: ${missingEvents.join(', ')}`);
      }

      // Test gesture support
      const gestureEvents = ['gesturestart', 'gesturechange', 'gestureend'];
      const missingGestures: string[] = [];

      gestureEvents.forEach(event => {
        if (!(`on${event}` in window)) {
          missingGestures.push(event);
        }
      });

      // Test pointer events
      if (!('PointerEvent' in window)) {
        issues.push('Pointer events not supported');
      }

      return {
        device,
        testName: 'Touch Interactions',
        passed: issues.length === 0,
        error: issues.length > 0 ? issues.join('; ') : undefined,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          touchEventsSupported: touchEvents.length - missingEvents.length,
          gestureEventsSupported: gestureEvents.length - missingGestures.length,
          pointerEventsSupported: 'PointerEvent' in window,
          issues
        }
      };
    } catch (error) {
      return {
        device: this.currentDevice!,
        testName: 'Touch Interactions',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  // Test service worker functionality
  async testServiceWorker(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      if (!this.currentDevice) {
        throw new Error(`No device configured - Context: async testOfflineFunctionality(): Promise<TestResu...`);
      }

      const device = this.currentDevice;
      const issues: string[] = [];

      // Test service worker support
      if (!('serviceWorker' in navigator)) {
        issues.push('Service Worker not supported');
      }

      // Test service worker registration
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (!registration) {
            issues.push('Service Worker not registered');
          } else {
            // Test service worker state
            if (registration.active) {
              console.log('Service Worker is active');
            } else if (registration.installing) {
              console.log('Service Worker is installing');
            } else if (registration.waiting) {
              console.log('Service Worker is waiting');
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          issues.push('Service Worker registration error: ' + errorMessage);
        }
      }

      // Test cache API
      if (!('caches' in window)) {
        issues.push('Cache API not supported');
      }

      // Test IndexedDB
      if (!('indexedDB' in window)) {
        issues.push('IndexedDB not supported');
      }

      return {
        device,
        testName: 'Service Worker',
        passed: issues.length === 0,
        error: issues.length > 0 ? issues.join('; ') : undefined,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          serviceWorkerSupported: 'serviceWorker' in navigator,
          cacheAPISupported: 'caches' in window,
          indexedDBSupported: 'indexedDB' in window,
          issues
        }
      };
    } catch (error) {
      return {
        device: this.currentDevice!,
        testName: 'Service Worker',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  // Test offline functionality
  async testOfflineFunctionality(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      if (!this.currentDevice) {
        throw new Error('No device configured');
      }

      const device = this.currentDevice;
      const issues: string[] = [];

      // Test offline detection
      if (!('onLine' in navigator)) {
        issues.push('Online/offline detection not supported');
      }

      // Test offline storage
      if (!('localStorage' in window)) {
        issues.push('localStorage not supported');
      }

      if (!('sessionStorage' in window)) {
        issues.push('sessionStorage not supported');
      }

      // Test offline data access
      try {
        localStorage.setItem('test', 'value');
        const value = localStorage.getItem('test');
        localStorage.removeItem('test');
        
        if (value !== 'value') {
          issues.push('localStorage not working correctly');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        issues.push('localStorage test failed: ' + errorMessage);
      }

      return {
        device,
        testName: 'Offline Functionality',
        passed: issues.length === 0,
        error: issues.length > 0 ? issues.join('; ') : undefined,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          onlineDetectionSupported: 'onLine' in navigator,
          localStorageSupported: 'localStorage' in window,
          sessionStorageSupported: 'sessionStorage' in window,
          issues
        }
      };
    } catch (error) {
      return {
        device: this.currentDevice!,
        testName: 'Offline Functionality',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  // Test performance
  async testPerformance(): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      if (!this.currentDevice) {
        throw new Error('No device configured');
      }

      const device = this.currentDevice;
      const issues: string[] = [];

      // Test performance API
      if (!('performance' in window)) {
        issues.push('Performance API not supported');
      }

      // Test navigation timing
      if ('performance' in window && 'navigation' in performance) {
        const navigation = performance.navigation;
        const timing = performance.timing;
        
        if (timing) {
          const loadTime = timing.loadEventEnd - timing.navigationStart;
          if (loadTime > 5000) { // 5 seconds
            issues.push('Page load time too slow: ' + loadTime + 'ms');
          }
        }
      }

      // Test memory usage
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / 1024 / 1024; // MB
        
        if (usedMemory > 100) { // 100MB
          issues.push('High memory usage: ' + usedMemory.toFixed(2) + 'MB');
        }
      }

      return {
        device,
        testName: 'Performance',
        passed: issues.length === 0,
        error: issues.length > 0 ? issues.join('; ') : undefined,
        duration: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          performanceAPISupported: 'performance' in window,
          navigationTimingSupported: 'performance' in window && 'navigation' in performance,
          memorySupported: 'memory' in performance,
          issues
        }
      };
    } catch (error) {
      return {
        device: this.currentDevice!,
        testName: 'Performance',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date()
      };
    }
  }

  // Run all tests for a device
  async runAllTests(device: DeviceConfig): Promise<TestResult[]> {
    await this.simulateDevice(device);
    
    const tests = [
      this.testResponsiveDesign.bind(this),
      this.testTouchInteractions.bind(this),
      this.testServiceWorker.bind(this),
      this.testOfflineFunctionality.bind(this),
      this.testPerformance.bind(this)
    ];

    const results: TestResult[] = [];
    
    for (const test of tests) {
      const result = await test();
      results.push(result);
      this.results.push(result);
    }

    return results;
  }

  // Run tests for all devices
  async runAllDeviceTests(): Promise<TestResult[]> {
    const allResults: TestResult[] = [];
    
    for (const device of DEVICE_CONFIGS) {
      console.log(`Testing device: ${device.name}`);
      const deviceResults = await this.runAllTests(device);
      allResults.push(...deviceResults);
      
      // Add delay between devices
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return allResults;
  }

  // Get test results
  getResults(): TestResult[] {
    return this.results;
  }

  // Generate test report
  generateReport(): string {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = (passedTests / totalTests) * 100;

    let report = `# Mobile Device Testing Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;
    report += `## Summary\n\n`;
    report += `- **Total Tests:** ${totalTests}\n`;
    report += `- **Passed:** ${passedTests}\n`;
    report += `- **Failed:** ${failedTests}\n`;
    report += `- **Success Rate:** ${successRate.toFixed(1)}%\n\n`;

    // Group by device
    const deviceGroups = this.results.reduce((groups, result) => {
      const deviceName = result.device.name;
      if (!groups[deviceName]) {
        groups[deviceName] = [];
      }
      groups[deviceName].push(result);
      return groups;
    }, {} as Record<string, TestResult[]>);

    report += `## Device Results\n\n`;

    for (const [deviceName, results] of Object.entries(deviceGroups)) {
      const devicePassed = results.filter(r => r.passed).length;
      const deviceTotal = results.length;
      const deviceSuccessRate = (devicePassed / deviceTotal) * 100;

      report += `### ${deviceName}\n\n`;
      report += `- **Success Rate:** ${deviceSuccessRate.toFixed(1)}% (${devicePassed}/${deviceTotal})\n\n`;

      for (const result of results) {
        const status = result.passed ? '✅' : '❌';
        report += `- ${status} **${result.testName}** (${result.duration}ms)\n`;
        if (result.error) {
          report += `  - Error: ${result.error}\n`;
        }
      }
      report += `\n`;
    }

    return report;
  }
}

// Export singleton instance
export const mobileDeviceTester = new MobileDeviceTester(); 