'use client';

import React from 'react';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface MobileGestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export function MobileGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchIn,
  onPinchOut,
  onTap,
  onDoubleTap,
  onLongPress,
  className = '',
  style,
  disabled = false
}: MobileGestureHandlerProps) {
  const callbacks = {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchIn,
    onPinchOut,
    onTap,
    onDoubleTap,
    onLongPress
  };

  const { touchHandlers } = useTouchGestures(callbacks);

  if (disabled) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`touch-manipulation ${className}`}
      style={{
        ...style,
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
      {...touchHandlers}
    >
      {children}
    </div>
  );
} 