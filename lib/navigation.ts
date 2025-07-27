'use client';

import { useRouter } from 'next/navigation';

// Navigation utility functions
export const useNavigation = () => {
  const router = useRouter();

  const navigate = {
    // Navigate to a new page
    to: (path: string) => {
      router.push(path);
    },

    // Replace current page (no back button)
    replace: (path: string) => {
      router.replace(path);
    },

    // Reload the current page
    reload: () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },

    // Navigate back
    back: () => {
      router.back();
    },

    // Navigate forward
    forward: () => {
      router.forward();
    },

    // Get current URL (safe for SSR)
    getCurrentUrl: () => {
      if (typeof window !== 'undefined') {
        return window.location.href;
      }
      return '';
    },

    // Get current pathname (safe for SSR)
    getCurrentPath: () => {
      if (typeof window !== 'undefined') {
        return window.location.pathname;
      }
      return '';
    },

    // Get current origin (safe for SSR)
    getOrigin: () => {
      if (typeof window !== 'undefined') {
        return window.location.origin;
      }
      return '';
    },

    // Get URL search params (safe for SSR)
    getSearchParams: () => {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search);
      }
      return new URLSearchParams();
    },

    // Open URL in new tab
    openInNewTab: (url: string) => {
      if (typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    }
  };

  return navigate;
};

// Standalone functions for use outside of components
export const safeNavigate = {
  to: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  },

  replace: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.replace(path);
    }
  },

  reload: () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },

  getCurrentUrl: () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  },

  getOrigin: () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }
};

// Utility for class components that can't use hooks
export const navigateUtils = {
  reload: () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
  
  to: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  },
  
  replace: (path: string) => {
    if (typeof window !== 'undefined') {
      window.location.replace(path);
    }
  }
}; 