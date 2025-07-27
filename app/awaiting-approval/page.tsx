'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, Mail, Shield, Building2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AwaitingApprovalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [institution, setInstitution] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    if (session.user.role !== 'INSTITUTION') {
      router.push('/');
      return;
    }

    // Fetch institution data
    const fetchInstitution = async () => {
      try {
        const response = await fetch('/api/institution/profile');
        if (response.ok) {
          const data = await response.json();
          setInstitution(data.institution);
          
          // If already approved, redirect to dashboard
          if (data.institution?.isApproved) {
            router.push('/institution/dashboard');
            return;
          }
        }
      } catch (error) {
        console.error('Error occurred:', error);
        toast.error(`Failed to load institution. Please try again or contact support if the problem persists.`);
        toast.error(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchInstitution();
  }, [session, status]);

  const handleCheckStatus = () => {
    navigate.reload();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null; // Will redirect
  }

  if (session.user.role !== 'INSTITUTION') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="h-12 w-12 text-yellow-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Account Pending Approval
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for registering your institution. Your account is currently under review by our administrators.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Status Banner */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-white" />
                  <div>
                    <h2 className="text-white font-semibold text-lg">Review in Progress</h2>
                    <p className="text-yellow-100 text-sm">This process typically takes 1-2 business days</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold text-2xl">24-48h</div>
                  <div className="text-yellow-100 text-sm">Estimated time</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Notification Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-blue-900 font-semibold mb-2">Email Notification</h3>
                    <p className="text-blue-800">
                      You will receive an email notification at <strong>{session.user.email}</strong> once your account has been approved. 
                      Until then, you won't be able to access the institution dashboard or make any changes to your profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Review Process</h4>
                        <p className="text-gray-600 text-sm">Our team will review your institution details and verify your credentials</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Verification</h4>
                        <p className="text-gray-600 text-sm">We'll verify your institution's credentials and contact information</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Email Notification</h4>
                        <p className="text-gray-600 text-sm">You'll receive an email notification once your account is approved</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 font-semibold text-sm">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Full Access</h4>
                        <p className="text-gray-600 text-sm">After approval, you can access all institution features and dashboard</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Link 
                  href="/auth/signout"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Sign Out
                </Link>
                <button 
                  onClick={handleCheckStatus}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Check Status</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:text-blue-700">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 