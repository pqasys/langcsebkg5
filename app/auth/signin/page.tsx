'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  
  const { data: session, status, update } = useSession();
  const router = useRouter();



  // Handle redirect after successful authentication
  useEffect(() => {
    console.log('SignIn useEffect - Status:', status, 'Session:', !!session, 'Loading:', isLoading, 'Redirecting:', isRedirecting);
    
    if (status === 'authenticated' && session?.user && !isRedirecting) {
      console.log('SignIn - User authenticated, redirecting...', session.user);
      setIsRedirecting(true);
      setIsLoading(false); // Stop the loading spinner
      setSuccess('Authentication successful! Redirecting...');
      
      // Small delay to ensure session is fully established
      setTimeout(() => {
        // Check if there's a callback URL in the URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get('callbackUrl');
        
        if (callbackUrl) {
          // Use the callback URL if provided
          router.push(callbackUrl);
        } else {
          // Fall back to role-based redirects
          if (session.user.role === 'ADMIN') {
            router.push('/admin/dashboard');
          } else if (session.user.role === 'INSTITUTION') {
            if (session.user.institutionApproved) {
              router.push('/institution/dashboard');
            } else {
              router.push('/awaiting-approval');
            }
          } else if (session.user.role === 'STUDENT') {
            router.push('/student');
          } else {
            router.push('/dashboard');
          }
        }
      }, 1000);
    }
  }, [session, status, router, isRedirecting, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SignIn handleSubmit - Starting authentication...');
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Get callback URL from URL parameters or use default
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get('callbackUrl') || '/dashboard';
      
      console.log('SignIn handleSubmit - Calling signIn...');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Don't redirect automatically, we'll handle it manually
        callbackUrl: callbackUrl
      });

      console.log('SignIn handleSubmit - Result:', result);

      if (result?.error) {
        console.log('SignIn handleSubmit - Error:', result.error);
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      console.log('SignIn handleSubmit - Success, keeping loading state...');
      // If successful, keep loading state and let useEffect handle the redirect
      // Don't set isLoading to false here - let the redirect useEffect handle it
    } catch (error) {
      console.error('SignIn handleSubmit - Error occurred:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (session?.user && status === 'authenticated' && !isLoading && !isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Show full-page spinner while signing in or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-xl font-semibold text-gray-700 mb-2">
            {isRedirecting ? 'Redirecting...' : 'Signing In...'}
          </p>
          <p className="text-gray-500">
            {isRedirecting 
              ? 'Please wait while we redirect you to your dashboard' 
              : 'Please wait while we authenticate your credentials'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                data-testid="sign-in-button"
              >
                Sign In
              </Button>

              <div className="text-center space-y-2">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </Link>
                <div className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/signup"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 