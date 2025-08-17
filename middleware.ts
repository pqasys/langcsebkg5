import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow image requests to pass through without authentication
    if (req.nextUrl.pathname.startsWith('/uploads/')) {
      return NextResponse.next();
    }

    // Handle institution URL redirects for SEO-friendly URLs
    if (req.nextUrl.pathname.startsWith('/institutions/')) {
      const pathParts = req.nextUrl.pathname.split('/');
      if (pathParts.length >= 3) {
        const institutionIdentifier = pathParts[2];
        
        // Check if this looks like a UUID (old format)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(institutionIdentifier)) {
          // This is an old UUID-based URL, redirect to slug-based URL
          // We'll need to look up the institution by ID and redirect to its slug
          // For now, we'll let the page handle the redirect
          console.log('UUID-based institution URL detected:', req.nextUrl.pathname);
        }
      }
    }

    const token = req.nextauth.token;
    const userRole = token?.role as string | undefined;

    // If user is authenticated and trying to access auth pages, redirect to appropriate dashboard
    if (token && req.nextUrl.pathname.startsWith('/auth/')) {

      if (userRole === 'INSTITUTION') {
        const institutionApproved = token?.institutionApproved as boolean | undefined;
        if (institutionApproved) {
          return NextResponse.redirect(new URL('/institution/dashboard', req.url));
        } else {
          return NextResponse.redirect(new URL('/awaiting-approval', req.url));
        }
      } else if (userRole === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      } else if (userRole === 'STUDENT') {
        return NextResponse.redirect(new URL('/student', req.url));
      }
    }

    // Allow authenticated users to access the homepage
    if (token && req.nextUrl.pathname === '/') {
      return NextResponse.next();
    }

    // Handle Design Toolkit access control for /courses page
    if (req.nextUrl.pathname === '/courses') {
      // Allow public access to courses page, but restrict design toolkit functionality
      return NextResponse.next();
    }

    // Handle role-based access control
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith('/institution')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      if (userRole !== 'INSTITUTION') {
        return NextResponse.redirect(new URL('/', req.url));
      }
      // Check institution approval
      const institutionApproved = token?.institutionApproved as boolean | undefined;
      if (institutionApproved === false) {
        return NextResponse.redirect(new URL('/awaiting-approval', req.url));
      }
    }

    if (req.nextUrl.pathname.startsWith('/student')) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
      if (userRole !== 'STUDENT') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Handle institution approval check
    if (userRole === 'INSTITUTION') {
      const institutionApproved = token?.institutionApproved as boolean | undefined;

      // If institution is approved and trying to access awaiting-approval page
      if (institutionApproved === true && req.nextUrl.pathname.startsWith('/awaiting-approval')) {
        return NextResponse.redirect(new URL('/institution/dashboard', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Allow uploads without authentication
        if (req.nextUrl.pathname.startsWith('/uploads/')) {
          return true;
        }
        // Allow auth pages without authentication
        if (req.nextUrl.pathname.startsWith('/auth/')) {
          return true;
        }
        // Allow homepage without authentication
        if (req.nextUrl.pathname === '/') {
          return true;
        }
        // Allow public design configs API without authentication
        if (req.nextUrl.pathname === '/api/design-configs/public') {
          return true;
        }
        // Allow public institution pages without authentication
        if (req.nextUrl.pathname.startsWith('/institutions/')) {
          return true;
        }
        // Allow public courses page without authentication
        if (req.nextUrl.pathname === '/courses') {
          return true;
        }
        // Allow public institutions listing without authentication
        if (req.nextUrl.pathname === '/institutions') {
          return true;
        }
        // Allow public students page without authentication
        if (req.nextUrl.pathname === '/students-public') {
          return true;
        }
        // Allow public institutions page without authentication
        if (req.nextUrl.pathname === '/institutions-public') {
          return true;
        }
        // Allow offline page without authentication
        if (req.nextUrl.pathname === '/offline') {
          return true;
        }
        // Allow features pages without authentication
        if (req.nextUrl.pathname.startsWith('/features/')) {
          return true;
        }
        // Allow institution registration without authentication
        if (req.nextUrl.pathname === '/institution-registration') {
          return true;
        }
        // Allow awaiting approval page without authentication
        if (req.nextUrl.pathname === '/awaiting-approval') {
          return true;
        }
        // Allow sitemap without authentication
        if (req.nextUrl.pathname === '/sitemap.xml') {
          return true;
        }
        // Allow robots.txt without authentication
        if (req.nextUrl.pathname === '/robots.txt') {
          return true;
        }
        // Allow manifest without authentication
        if (req.nextUrl.pathname === '/manifest.json') {
          return true;
        }
        // Allow favicon without authentication
        if (req.nextUrl.pathname === '/favicon.ico') {
          return true;
        }
        // Allow API routes that don't require authentication
        if (req.nextUrl.pathname.startsWith('/api/')) {
          // Allow public API routes
          const publicApiRoutes = [
            '/api/institutions',
            '/api/courses',
            '/api/design-configs/public',
            '/api/auth',
            '/api/institution-registration'
          ];
          
          const isPublicApiRoute = publicApiRoutes.some(route => 
            req.nextUrl.pathname.startsWith(route)
          );
          
          if (isPublicApiRoute) {
            return true;
          }
        }
        
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/student/:path*',
    '/institution/:path*',
    '/awaiting-approval',
    '/auth/:path*',
    '/uploads/:path*'
  ]
}; 