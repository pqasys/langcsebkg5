import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow image requests to pass through without authentication
    if (req.nextUrl.pathname.startsWith('/uploads/')) {
      return NextResponse.next();
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
        // Require authentication for other protected routes
        return !!token;
      }
    },
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