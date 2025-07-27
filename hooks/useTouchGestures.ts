import { useState, useRef, useCallback } from 'react';

interface TouchPoint {
  x: number;
  y: number;
}

interface SwipeConfig {
  minDistance?: number;
  maxTime?: number;
  velocity?: number;
}

interface PinchConfig {
  minScale?: number;
  maxScale?: number;
}

interface TouchGesturesCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export function useTouchGestures(
  callbacks: TouchGesturesCallbacks,
  swipeConfig: SwipeConfig = {},
  pinchConfig: PinchConfig = {}
) {
  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchStartTimeRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialDistanceRef = useRef<number>(0);
  const initialScaleRef = useRef<number>(1);

  const {
    minDistance = 50,
    maxTime = 300,
    velocity = 0.3
  } = swipeConfig;

  const {
    minScale = 0.5,
    maxScale = 3
  } = pinchConfig;

  const getDistance = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const getAngle = useCallback((point1: TouchPoint, point2: TouchPoint): number => {
    return Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsTouching(true);
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchStartTimeRef.current = Date.now();

    // Handle long press
    if (callbacks.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        callbacks.onLongPress?.();
      }, 500);
    }

    // Handle pinch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistanceRef.current = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );
    }
  }, [callbacks, getDistance]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle pinch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = getDistance(
        { x: touch1.clientX, y: touch1.clientY },
        { x: touch2.clientX, y: touch2.clientY }
      );

      if (initialDistanceRef.current > 0) {
        const scale = currentDistance / initialDistanceRef.current;
        const clampedScale = Math.max(minScale, Math.min(maxScale, scale));

        if (scale < 1 && callbacks.onPinchIn) {
          callbacks.onPinchIn(clampedScale);
        } else if (scale > 1 && callbacks.onPinchOut) {
          callbacks.onPinchOut(clampedScale);
        }
      }
    }
  }, [callbacks, getDistance, minScale, maxScale]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    setIsTouching(false);
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTimeRef.current;

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle tap and double tap
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const endPoint = { x: touch.clientX, y: touch.clientY };
      const distance = getDistance(touchStartRef.current, endPoint);

      if (distance < 10 && touchDuration < 200) {
        const timeSinceLastTap = touchEndTime - lastTapTimeRef.current;
        
        if (timeSinceLastTap < 300 && callbacks.onDoubleTap) {
          callbacks.onDoubleTap();
        } else if (callbacks.onTap) {
          callbacks.onTap();
        }
        
        lastTapTimeRef.current = touchEndTime;
      }

      // Handle swipe gestures
      if (distance >= minDistance && touchDuration <= maxTime) {
        const angle = getAngle(touchStartRef.current, endPoint);
        const velocity = distance / touchDuration;

        if (velocity >= swipeConfig.velocity || swipeConfig.velocity === undefined) {
          if (angle >= -45 && angle <= 45 && callbacks.onSwipeRight) {
            callbacks.onSwipeRight();
          } else if (angle >= 135 || angle <= -135 && callbacks.onSwipeLeft) {
            callbacks.onSwipeLeft();
          } else if (angle > 45 && angle < 135 && callbacks.onSwipeDown) {
            callbacks.onSwipeDown();
          } else if (angle < -45 && angle > -135 && callbacks.onSwipeUp) {
            callbacks.onSwipeUp();
          }
        }
      }
    }

    // Reset refs
    touchStartRef.current = null;
    initialDistanceRef.current = 0;
  }, [callbacks, getDistance, getAngle, minDistance, maxTime, swipeConfig.velocity]);

  const handleTouchCancel = useCallback(() => {
    setIsTouching(false);
    touchStartRef.current = null;
    initialDistanceRef.current = 0;
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  return {
    isTouching,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchCancel,
    }
  };
} 