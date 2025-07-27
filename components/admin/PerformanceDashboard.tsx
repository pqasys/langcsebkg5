'use client';

import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Activity, 
  Database, 
  Globe, 
  Server, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface PerformanceMetrics {
  timestamp: Date;
  redis: {
    hitRate: number;
    memoryUsage: number;
    keysCount: number;
    averageResponseTime: number;
  };
  database: {
    totalQueries: number;
    averageDuration: number;
    cacheHitRate: number;
    slowQueries: number;
  };
  cdn: {
    isEnabled: boolean;
    domain: string;
    assetCount: number;
  };
  loadBalancer: {
    totalServers: number;
    activeServers: number;
    totalConnections: number;
    averageResponseTime: number;
  };
  overall: {
    averageResponseTime: number;
    cacheHitRate: number;
    errorRate: number;
  };
}

interface SystemHealth {
  redis: string;
  database: string;
  cdn: string;
  loadBalancer: string;
  overall: string;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPerformanceData();
    const interval = setInterval(fetchPerformanceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [metricsResponse, healthResponse] = await Promise.all([
        fetch('/api/admin/performance/metrics'),
        fetch('/api/admin/performance/health')
      ]);

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        setMetrics(metricsData);
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setHealth(healthData);
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to fetch performance data');
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'unhealthy': return 'text-red-600';
      case 'disabled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'unhealthy': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'disabled': return <Clock className="w-5 h-5 text-gray-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  const latestMetrics = metrics[metrics.length - 1];
  const historicalData = metrics.slice(-24); // Last 24 data points

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Dashboard</h1>
          <p className="text-gray-600">Real-time monitoring of system performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live</span>
        </div>
      </div>

      {/* System Health Overview */}
      {health && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Redis Cache</p>
                <p className={`text-lg font-semibold ${getHealthColor(health.redis)}`}>
                  {health.redis}
                </p>
              </div>
              {getHealthIcon(health.redis)}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database</p>
                <p className={`text-lg font-semibold ${getHealthColor(health.database)}`}>
                  {health.database}
                </p>
              </div>
              {getHealthIcon(health.database)}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CDN</p>
                <p className={`text-lg font-semibold ${getHealthColor(health.cdn)}`}>
                  {health.cdn}
                </p>
              </div>
              {getHealthIcon(health.cdn)}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Load Balancer</p>
                <p className={`text-lg font-semibold ${getHealthColor(health.loadBalancer)}`}>
                  {health.loadBalancer}
                </p>
              </div>
              {getHealthIcon(health.loadBalancer)}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall</p>
                <p className={`text-lg font-semibold ${getHealthColor(health.overall)}`}>
                  {health.overall}
                </p>
              </div>
              {getHealthIcon(health.overall)}
            </div>
          </div>
        </div>
      )}

      {/* Key Performance Indicators */}
      {latestMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestMetrics.overall.averageResponseTime.toFixed(0)}ms
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(latestMetrics.overall.cacheHitRate * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Redis Keys</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestMetrics.redis.keysCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Server className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Servers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {latestMetrics.loadBalancer.activeServers}/{latestMetrics.loadBalancer.totalServers}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Response Time']}
              />
              <Line 
                type="monotone" 
                dataKey="overall.averageResponseTime" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cache Hit Rate Trend */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Hit Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Cache Hit Rate']}
              />
              <Area 
                type="monotone" 
                dataKey="overall.cacheHitRate" 
                stroke="#10B981" 
                fill="#10B981" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Redis Performance */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Redis Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={historicalData.slice(-12)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Response Time']}
              />
              <Bar dataKey="redis.averageResponseTime" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Database Performance */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value: number) => [`${value.toFixed(0)}ms`, 'Query Time']}
              />
              <Line 
                type="monotone" 
                dataKey="database.averageDuration" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Metrics */}
      {latestMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Redis Details */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Redis Cache
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Hit Rate:</span>
                <span className="font-medium">{(latestMetrics.redis.hitRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">{latestMetrics.redis.memoryUsage}MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Keys Count:</span>
                <span className="font-medium">{latestMetrics.redis.keysCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium">{latestMetrics.redis.averageResponseTime.toFixed(0)}ms</span>
              </div>
            </div>
          </div>

          {/* Database Details */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Database
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Queries:</span>
                <span className="font-medium">{latestMetrics.database.totalQueries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cache Hit Rate:</span>
                <span className="font-medium">{(latestMetrics.database.cacheHitRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Duration:</span>
                <span className="font-medium">{latestMetrics.database.averageDuration.toFixed(0)}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Slow Queries:</span>
                <span className="font-medium">{latestMetrics.database.slowQueries}</span>
              </div>
            </div>
          </div>

          {/* Load Balancer Details */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Server className="w-5 h-5 mr-2" />
              Load Balancer
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Servers:</span>
                <span className="font-medium">{latestMetrics.loadBalancer.totalServers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Active Servers:</span>
                <span className="font-medium">{latestMetrics.loadBalancer.activeServers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connections:</span>
                <span className="font-medium">{latestMetrics.loadBalancer.totalConnections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Avg Response:</span>
                <span className="font-medium">{latestMetrics.loadBalancer.averageResponseTime.toFixed(0)}ms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 