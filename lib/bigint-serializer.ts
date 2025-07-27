/**
 * Global BigInt serializer utility
 * Handles BigInt serialization for JSON responses across all API routes
 */

// Helper function to handle BigInt serialization
export function serializeForJSON(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeForJSON);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeForJSON(value);
    }
    return result;
  }
  
  return obj;
}

// Decorator function for API responses
export function withBigIntSerialization<T extends (...args: any[]) => any>(
  fn: T
): T {
  return ((...args: Parameters<T>) => {
    const result = fn(...args);
    
    if (result instanceof Promise) {
      return result.then((response) => {
        if (response && typeof response === 'object' && 'json' in response) {
          // Handle NextResponse objects
          const originalJson = response.json.bind(response);
          response.json = function(data: any) {
            return originalJson(serializeForJSON(data));
          };
        }
        return response;
      });
    }
    
    return result;
  }) as T;
}

// Utility for Prisma query results
export function serializePrismaResult<T>(result: T): T {
  return serializeForJSON(result) as T;
}

// Utility for database aggregation results
export function serializeAggregationResult(result: any): any {
  if (result && typeof result === 'object' && '_sum' in result) {
    return {
      ...result,
      _sum: serializeForJSON(result._sum)
    };
  }
  return serializeForJSON(result);
}

// Export types for better TypeScript support
export type SerializedResponse<T> = T extends bigint ? string : T; 