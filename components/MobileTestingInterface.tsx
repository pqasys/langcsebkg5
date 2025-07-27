'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Play, 
  Square, 
  Download, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  mobileDeviceTester, 
  DEVICE_CONFIGS, 
  DeviceConfig, 
  TestResult 
} from '@/tests/mobile-device-testing';

export function MobileTestingInterface() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentDevice, setCurrentDevice] = useState<DeviceConfig | null>(null);
  const [results, setResults] = useState<TestResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set());
  const [testReport, setTestReport] = useState<string>('');

  // Guard browser-only code
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Load previous results
    const savedResults = localStorage.getItem('mobile_test_results');
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error('Failed to load saved results:');
      }
    }
  }, []);

  const saveResults = (newResults: TestResult[]) => {
    setResults(newResults);
    localStorage.setItem('mobile_test_results', JSON.stringify(newResults));
  };

  const runTests = async (devices: DeviceConfig[]) => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const allResults: TestResult[] = [];
    const totalTests = devices.length * 5; // 5 tests per device
    let completedTests = 0;

    for (const device of devices) {
      setCurrentDevice(device);
      
      try {
        const deviceResults = await mobileDeviceTester.runAllTests(device);
        allResults.push(...deviceResults);
        
        completedTests += deviceResults.length;
        setProgress((completedTests / totalTests) * 100);
        
        // Update results in real-time
        saveResults([...allResults]);
        
        // Add delay between devices
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error('Failed to test device ${device.name}:');
      }
    }

    setCurrentDevice(null);
    setIsRunning(false);
    setProgress(100);

    // Generate report
    const report = mobileDeviceTester.generateReport();
    setTestReport(report);
  };

  const runAllTests = async () => {
    await runTests(DEVICE_CONFIGS);
  };

  const runSelectedTests = async () => {
    const devices = DEVICE_CONFIGS.filter(device => selectedDevices.has(device.name));
    if (devices.length === 0) {
      alert('Please select at least one device to test');
      return;
    }
    await runTests(devices);
  };

  const runSingleDeviceTest = async (device: DeviceConfig) => {
    await runTests([device]);
  };

  const toggleDeviceSelection = (deviceName: string) => {
    const newSelected = new Set(selectedDevices);
    if (newSelected.has(deviceName)) {
      newSelected.delete(deviceName);
    } else {
      newSelected.add(deviceName);
    }
    setSelectedDevices(newSelected);
  };

  const clearResults = () => {
    setResults([]);
    setTestReport('');
    localStorage.removeItem('mobile_test_results');
  };

  const downloadReport = () => {
    if (!testReport) {
      alert('No test report available');
      return;
    }

    const blob = new Blob([testReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mobile-test-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDeviceIcon = (category: string) => {
    switch (category) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const getTestStatusIcon = (passed: boolean) => {
    return passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getDeviceResults = (deviceName: string) => {
    return results.filter(r => r.device.name === deviceName);
  };

  const getOverallStats = () => {
    if (results.length === 0) return null;

    const totalTests = results.length;
    const passedTests = results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = (passedTests / totalTests) * 100;

    return { totalTests, passedTests, failedTests, successRate };
  };

  const stats = getOverallStats();

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Mobile Device Testing</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Testing...</span>
            </div>
          )}
          {currentDevice && (
            <Badge variant="outline">
              Testing: {currentDevice.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Run All Tests</span>
            </Button>
            
            <Button 
              onClick={runSelectedTests} 
              disabled={isRunning || selectedDevices.size === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Run Selected ({selectedDevices.size})</span>
            </Button>
            
            <Button 
              onClick={clearResults} 
              disabled={isRunning}
              variant="outline"
              className="flex items-center space-x-2"
            >
                              <Square className="w-4 h-4" />
              <span>Clear Results</span>
            </Button>
            
            {testReport && (
              <Button 
                onClick={downloadReport} 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </Button>
            )}
          </div>

          {isRunning && (
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Progress: {progress.toFixed(1)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Overall Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalTests}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.passedTests}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.failedTests}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="report">Report</TabsTrigger>
        </TabsList>

        {/* Devices Tab */}
        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVICE_CONFIGS.map((device) => {
              const deviceResults = getDeviceResults(device.name);
              const deviceStats = deviceResults.length > 0 ? {
                total: deviceResults.length,
                passed: deviceResults.filter(r => r.passed).length,
                successRate: (deviceResults.filter(r => r.passed).length / deviceResults.length) * 100
              } : null;

              return (
                <Card key={device.name} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.category)}
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedDevices.has(device.name)}
                        onChange={() => toggleDeviceSelection(device.name)}
                        className="w-4 h-4"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <div>{device.width} × {device.height}</div>
                        <div>{device.category} • {device.browser} • {device.os}</div>
                        <div>Touch: {device.touchSupport ? 'Yes' : 'No'}</div>
                      </div>

                      {deviceStats ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Success Rate</span>
                            <span className="font-medium">{deviceStats.successRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={deviceStats.successRate} className="w-full" />
                          <div className="text-xs text-gray-500">
                            {deviceStats.passed}/{deviceStats.total} tests passed
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No test results</div>
                      )}

                      <div className="flex space-x-2">
                        <Button
                          onClick={() => runSingleDeviceTest(device)}
                          disabled={isRunning}
                          size="sm"
                          className="flex-1"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          {results.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No test results available. Run some tests to see results here.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {DEVICE_CONFIGS.map((device) => {
                const deviceResults = getDeviceResults(device.name);
                if (deviceResults.length === 0) return null;

                return (
                  <Card key={device.name}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {getDeviceIcon(device.category)}
                        <span>{device.name}</span>
                        <Badge variant={deviceResults.every(r => r.passed) ? "default" : "destructive"}>
                          {deviceResults.filter(r => r.passed).length}/{deviceResults.length} passed
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {deviceResults.map((result, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {getTestStatusIcon(result.passed)}
                              <div>
                                <div className="font-medium">{result.testName}</div>
                                <div className="text-sm text-gray-600">
                                  Duration: {result.duration}ms
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </div>
                              {result.error && (
                                <div className="text-xs text-red-600 max-w-xs truncate">
                                  {result.error}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Report Tab */}
        <TabsContent value="report">
          {testReport ? (
            <Card>
              <CardHeader>
                <CardTitle>Test Report</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  {testReport}
                </pre>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No test report available. Run tests to generate a report.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 