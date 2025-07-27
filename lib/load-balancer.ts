// Load Balancer for horizontal scaling and traffic distribution
import { NextRequest, NextResponse } from 'next/server';

// Server instance interface
interface ServerInstance {
  id: string;
  url: string;
  health: 'healthy' | 'unhealthy' | 'degraded';
  weight: number;
  maxConnections: number;
  currentConnections: number;
  responseTime: number;
  lastHealthCheck: Date;
  isActive: boolean;
  region?: string;
  datacenter?: string;
}

// Load balancing strategy
enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  WEIGHTED_ROUND_ROBIN = 'weighted_round_robin',
  WEIGHTED_LEAST_CONNECTIONS = 'weighted_least_connections',
  IP_HASH = 'ip_hash',
  LEAST_RESPONSE_TIME = 'least_response_time',
  GEOGRAPHIC = 'geographic'
}

// Health check configuration
interface HealthCheckConfig {
  endpoint: string;
  interval: number; // milliseconds
  timeout: number; // milliseconds
  healthyThreshold: number;
  unhealthyThreshold: number;
  expectedStatus: number[];
  expectedResponse?: string;
}

// Load balancer configuration
interface LoadBalancerConfig {
  strategy: LoadBalancingStrategy;
  healthCheck: HealthCheckConfig;
  failover: boolean;
  stickySessions: boolean;
  sessionTimeout: number; // milliseconds
  maxRetries: number;
  retryDelay: number; // milliseconds
  circuitBreaker: {
    enabled: boolean;
    failureThreshold: number;
    recoveryTimeout: number; // milliseconds
  };
}

// Session tracking for sticky sessions
interface SessionInfo {
  sessionId: string;
  serverId: string;
  createdAt: Date;
  lastAccess: Date;
  requests: number;
}

// Circuit breaker state
interface CircuitBreakerState {
  serverId: string;
  state: 'closed' | 'open' | 'half_open';
  failureCount: number;
  lastFailureTime: Date;
  nextAttemptTime: Date;
}

// Load Balancer class
export class LoadBalancer {
  private servers: Map<string, ServerInstance> = new Map();
  private config: LoadBalancerConfig;
  private currentIndex: number = 0;
  private sessions: Map<string, SessionInfo> = new Map();
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(config: LoadBalancerConfig) {
    this.config = config;
    this.startHealthChecks();
  }

  // Add server instance
  addServer(server: ServerInstance): void {
    this.servers.set(server.id, {
      ...server,
      lastHealthCheck: new Date(),
      currentConnections: 0
    });

    // Initialize circuit breaker
    if (this.config.circuitBreaker.enabled) {
      this.circuitBreakers.set(server.id, {
        serverId: server.id,
        state: 'closed',
        failureCount: 0,
        lastFailureTime: new Date(),
        nextAttemptTime: new Date()
      });
    }
  }

  // Remove server instance
  removeServer(serverId: string): void {
    this.servers.delete(serverId);
    this.circuitBreakers.delete(serverId);
  }

  // Get next server based on strategy
  getNextServer(request: NextRequest): ServerInstance | null {
    const activeServers = this.getActiveServers();
    
    if (activeServers.length === 0) {
      return null;
    }

    // Check for sticky session
    if (this.config.stickySessions) {
      const sessionServer = this.getStickySessionServer(request);
      if (sessionServer) {
        return sessionServer;
      }
    }

    switch (this.config.strategy) {
      case LoadBalancingStrategy.ROUND_ROBIN:
        return this.roundRobin(activeServers);
      case LoadBalancingStrategy.LEAST_CONNECTIONS:
        return this.leastConnections(activeServers);
      case LoadBalancingStrategy.WEIGHTED_ROUND_ROBIN:
        return this.weightedRoundRobin(activeServers);
      case LoadBalancingStrategy.WEIGHTED_LEAST_CONNECTIONS:
        return this.weightedLeastConnections(activeServers);
      case LoadBalancingStrategy.IP_HASH:
        return this.ipHash(activeServers, request);
      case LoadBalancingStrategy.LEAST_RESPONSE_TIME:
        return this.leastResponseTime(activeServers);
      case LoadBalancingStrategy.GEOGRAPHIC:
        return this.geographic(activeServers, request);
      default:
        return this.roundRobin(activeServers);
    }
  }

  // Round robin strategy
  private roundRobin(servers: ServerInstance[]): ServerInstance {
    const server = servers[this.currentIndex % servers.length];
    this.currentIndex = (this.currentIndex + 1) % servers.length;
    return server;
  }

  // Least connections strategy
  private leastConnections(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((min, server) => 
      server.currentConnections < min.currentConnections ? server : min
    );
  }

  // Weighted round robin strategy
  private weightedRoundRobin(servers: ServerInstance[]): ServerInstance {
    const totalWeight = servers.reduce((sum, server) => sum + server.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const server of servers) {
      random -= server.weight;
      if (random <= 0) {
        return server;
      }
    }
    
    return servers[0]; // Fallback
  }

  // Weighted least connections strategy
  private weightedLeastConnections(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((min, server) => {
      const minScore = min.currentConnections / min.weight;
      const serverScore = server.currentConnections / server.weight;
      return serverScore < minScore ? server : min;
    });
  }

  // IP hash strategy
  private ipHash(servers: ServerInstance[], request: NextRequest): ServerInstance {
    const clientIP = this.getClientIP(request);
    const hash = this.simpleHash(clientIP);
    return servers[hash % servers.length];
  }

  // Least response time strategy
  private leastResponseTime(servers: ServerInstance[]): ServerInstance {
    return servers.reduce((min, server) => 
      server.responseTime < min.responseTime ? server : min
    );
  }

  // Geographic strategy
  private geographic(servers: ServerInstance[], request: NextRequest): ServerInstance {
    const clientIP = this.getClientIP(request);
    const clientRegion = this.getRegionFromIP(clientIP);
    
    // Find servers in the same region
    const regionalServers = servers.filter(server => 
      server.region === clientRegion
    );
    
    if (regionalServers.length > 0) {
      return this.roundRobin(regionalServers);
    }
    
    // Fallback to any server
    return this.roundRobin(servers);
  }

  // Get active servers
  private getActiveServers(): ServerInstance[] {
    return Array.from(this.servers.values()).filter(server => 
      server.isActive && server.health === 'healthy'
    );
  }

  // Sticky session handling
  private getStickySessionServer(request: NextRequest): ServerInstance | null {
    const sessionId = this.getSessionId(request);
    if (!sessionId) return null;

    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check if session is still valid
    if (Date.now() - session.lastAccess.getTime() > this.config.sessionTimeout) {
      this.sessions.delete(sessionId);
      return null;
    }

    const server = this.servers.get(session.serverId);
    if (!server || server.health !== 'healthy' || !server.isActive) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Update session
    session.lastAccess = new Date();
    session.requests++;
    return server;
  }

  // Create or update sticky session
  private createStickySession(sessionId: string, serverId: string): void {
    this.sessions.set(sessionId, {
      sessionId,
      serverId,
      createdAt: new Date(),
      lastAccess: new Date(),
      requests: 1
    });
  }

  // Get session ID from request
  private getSessionId(request: NextRequest): string | null {
    // Try to get from cookie
    const sessionCookie = request.cookies.get('lb_session');
    if (sessionCookie) return sessionCookie.value;

    // Try to get from header
    const sessionHeader = request.headers.get('x-session-id');
    if (sessionHeader) return sessionHeader;

    // Generate from IP and user agent
    const clientIP = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    return this.simpleHash(clientIP + userAgent).toString();
  }

  // Health check methods
  private async performHealthCheck(server: ServerInstance): Promise<void> {
    try {
      const startTime = Date.now();
      const response = await fetch(`${server.url}${this.config.healthCheck.endpoint}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'LoadBalancer-HealthCheck/1.0'
        },
        signal: AbortSignal.timeout(this.config.healthCheck.timeout)
      });

      const responseTime = Date.now() - startTime;
      
      // Update server health
      const isHealthy = this.config.healthCheck.expectedStatus.includes(response.status);
      const newHealth = isHealthy ? 'healthy' : 'unhealthy';
      
      this.updateServerHealth(server.id, newHealth, responseTime);

    } catch (error) {
      console.error(`Health check failed for server ${server.id}:`, error);
      this.updateServerHealth(server.id, 'unhealthy', 0);
    }
  }

  private updateServerHealth(serverId: string, health: 'healthy' | 'unhealthy' | 'degraded', responseTime: number): void {
    const server = this.servers.get(serverId);
    if (!server) return;

    server.health = health;
    server.responseTime = responseTime;
    server.lastHealthCheck = new Date();

    // Update circuit breaker
    if (this.config.circuitBreaker.enabled) {
      this.updateCircuitBreaker(serverId, health === 'healthy');
    }
  }

  // Circuit breaker methods
  private updateCircuitBreaker(serverId: string, isSuccess: boolean): void {
    const circuitBreaker = this.circuitBreakers.get(serverId);
    if (!circuitBreaker) return;

    if (isSuccess) {
      if (circuitBreaker.state === 'open') {
        circuitBreaker.state = 'half_open';
      } else if (circuitBreaker.state === 'half_open') {
        circuitBreaker.state = 'closed';
        circuitBreaker.failureCount = 0;
      }
    } else {
      circuitBreaker.failureCount++;
      circuitBreaker.lastFailureTime = new Date();

      if (circuitBreaker.failureCount >= this.config.circuitBreaker.failureThreshold) {
        circuitBreaker.state = 'open';
        circuitBreaker.nextAttemptTime = new Date(
          Date.now() + this.config.circuitBreaker.recoveryTimeout
        );
      }
    }
  }

  private isCircuitBreakerOpen(serverId: string): boolean {
    const circuitBreaker = this.circuitBreakers.get(serverId);
    if (!circuitBreaker) return false;

    if (circuitBreaker.state === 'open') {
      if (Date.now() >= circuitBreaker.nextAttemptTime.getTime()) {
        circuitBreaker.state = 'half_open';
        return false;
      }
      return true;
    }

    return false;
  }

  // Start health checks
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.servers.forEach(server => {
        this.performHealthCheck(server);
      });
    }, this.config.healthCheck.interval);
  }

  // Stop health checks
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  // Utility methods
  private getClientIP(request: NextRequest): string {
    return request.headers.get('x-forwarded-for')?.split(',')[0] ||
           request.headers.get('x-real-ip') ||
           request.ip ||
           '127.0.0.1';
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private getRegionFromIP(ip: string): string {
    // Simple region detection based on IP ranges
    // In production, use a proper IP geolocation service
    const firstOctet = parseInt(ip.split('.')[0]);
    
    if (firstOctet >= 1 && firstOctet <= 126) return 'us-east';
    if (firstOctet >= 128 && firstOctet <= 191) return 'us-west';
    if (firstOctet >= 192 && firstOctet <= 223) return 'eu-west';
    
    return 'default';
  }

  // Connection tracking
  incrementConnections(serverId: string): void {
    const server = this.servers.get(serverId);
    if (server && server.currentConnections < server.maxConnections) {
      server.currentConnections++;
    }
  }

  decrementConnections(serverId: string): void {
    const server = this.servers.get(serverId);
    if (server && server.currentConnections > 0) {
      server.currentConnections--;
    }
  }

  // Get load balancer statistics
  getStats() {
    const activeServers = this.getActiveServers();
    const totalConnections = activeServers.reduce((sum, server) => sum + server.currentConnections, 0);
    const avgResponseTime = activeServers.reduce((sum, server) => sum + server.responseTime, 0) / activeServers.length;

    return {
      totalServers: this.servers.size,
      activeServers: activeServers.length,
      totalConnections,
      averageResponseTime: avgResponseTime,
      activeSessions: this.sessions.size,
      strategy: this.config.strategy,
      circuitBreakers: Array.from(this.circuitBreakers.values()).map(cb => ({
        serverId: cb.serverId,
        state: cb.state,
        failureCount: cb.failureCount
      }))
    };
  }

  // Cleanup expired sessions
  cleanupSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastAccess.getTime() > this.config.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

// Load balancer middleware
export function createLoadBalancerMiddleware(loadBalancer: LoadBalancer) {
  return async function loadBalancerMiddleware(request: NextRequest): Promise<NextResponse> {
    const server = loadBalancer.getNextServer(request);
    
    if (!server) {
      return new NextResponse('No available servers', { status: 503 });
    }

    // Check circuit breaker
    if (loadBalancer.isCircuitBreakerOpen(server.id)) {
      return new NextResponse('Server temporarily unavailable', { status: 503 });
    }

    // Increment connection count
    loadBalancer.incrementConnections(server.id);

    try {
      // Forward request to selected server
      const response = await fetch(`${server.url}${request.nextUrl.pathname}${request.nextUrl.search}`, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      // Create response with forwarded content
      const responseBody = await response.text();
      const nextResponse = new NextResponse(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      // Add sticky session cookie if enabled
      if (loadBalancer.config.stickySessions) {
        const sessionId = loadBalancer.getSessionId(request);
        if (sessionId) {
          loadBalancer.createStickySession(sessionId, server.id);
          nextResponse.cookies.set('lb_session', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: loadBalancer.config.sessionTimeout / 1000
          });
        }
      }

      return nextResponse;

    } catch (error) {
      console.error(`Request failed for server ${server.id}:`, error);
      
      // Update circuit breaker
      if (loadBalancer.config.circuitBreaker.enabled) {
        loadBalancer.updateCircuitBreaker(server.id, false);
      }
      
      return new NextResponse('Internal Server Error', { status: 500, statusText: 'Internal Server Error', statusText: 'Internal Server Error' });
    } finally {
      // Decrement connection count
      loadBalancer.decrementConnections(server.id);
    }
  };
}

// Default load balancer configuration
export const defaultLoadBalancerConfig: LoadBalancerConfig = {
  strategy: LoadBalancingStrategy.LEAST_CONNECTIONS,
  healthCheck: {
    endpoint: '/health',
    interval: 30000, // 30 seconds
    timeout: 5000, // 5 seconds
    healthyThreshold: 2,
    unhealthyThreshold: 3,
    expectedStatus: [200, 204]
  },
  failover: true,
  stickySessions: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5,
    recoveryTimeout: 60000 // 1 minute
  }
};

// Export types and enums
export { LoadBalancingStrategy };
export type { ServerInstance, LoadBalancerConfig, HealthCheckConfig, SessionInfo, CircuitBreakerState }; 