'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Building2, BookOpen, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AccessibilityTestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()}
            variant="outline"
            size="mobile-sm"
            className="mb-4"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Accessibility Test Page
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test the improved contrast and accessibility features
          </p>
        </div>

        {/* Button Variants Test */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              Button Variants & Contrast Test
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Test different button variants with improved contrast ratios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="default"
                size="mobile-lg"
                aria-label="Primary action button"
              >
                Primary Action
              </Button>
              
              <Button 
                variant="primary-high"
                size="mobile-lg"
                aria-label="High contrast primary button"
              >
                High Contrast
              </Button>
              
              <Button 
                variant="success-high"
                size="mobile-lg"
                aria-label="Success action button"
              >
                Success Action
              </Button>
              
              <Button 
                variant="warning-high"
                size="mobile-lg"
                aria-label="Warning action button"
              >
                Warning Action
              </Button>
              
              <Button 
                variant="danger-high"
                size="mobile-lg"
                aria-label="Danger action button"
              >
                Danger Action
              </Button>
              
              <Button 
                variant="outline"
                size="mobile-lg"
                aria-label="Outline button"
              >
                Outline Style
              </Button>
              
              <Button 
                variant="secondary"
                size="mobile-lg"
                aria-label="Secondary action button"
              >
                Secondary
              </Button>
              
              <Button 
                variant="ghost"
                size="mobile-lg"
                aria-label="Ghost style button"
              >
                Ghost Style
              </Button>
              
              <Button 
                variant="link"
                size="mobile-lg"
                aria-label="Link style button"
              >
                Link Style
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Optimization Test */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Mobile Optimization Test
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Test mobile-optimized button sizes and touch targets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary-high"
                  size="mobile-sm"
                  aria-label="Small mobile button"
                >
                  Mobile Small
                </Button>
                
                <Button 
                  variant="primary-high"
                  size="default"
                  aria-label="Default size button"
                >
                  Default Size
                </Button>
                
                <Button 
                  variant="primary-high"
                  size="mobile-lg"
                  aria-label="Large mobile button"
                >
                  Mobile Large
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="success-high"
                  size="mobile-icon"
                  aria-label="Mobile icon button"
                >
                  <Settings className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="icon"
                  aria-label="Icon button"
                >
                  <Users className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Focus and Keyboard Navigation Test */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              Focus & Keyboard Navigation Test
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Use Tab key to navigate and test focus indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tab through these buttons to test keyboard navigation and focus indicators:
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  variant="primary-high"
                  aria-label="First focusable button"
                >
                  First Button
                </Button>
                
                <Button 
                  variant="outline"
                  aria-label="Second focusable button"
                >
                  Second Button
                </Button>
                
                <Button 
                  variant="secondary"
                  aria-label="Third focusable button"
                >
                  Third Button
                </Button>
                
                <Button 
                  variant="ghost"
                  aria-label="Fourth focusable button"
                >
                  Fourth Button
                </Button>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Accessibility Features Tested:</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                  <li>• High contrast ratios (WCAG AA compliant)</li>
                  <li>• Clear focus indicators</li>
                  <li>• Proper ARIA labels</li>
                  <li>• Mobile-optimized touch targets (44px minimum)</li>
                  <li>• Keyboard navigation support</li>
                  <li>• Dark mode compatibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge and Status Test */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              Status Indicators Test
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Test badges and status indicators with improved contrast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </Badge>
              
              <Badge variant="outline" className="border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-300">
                Pending
              </Badge>
              
              <Badge variant="outline" className="border-red-300 text-red-700 dark:border-red-600 dark:text-red-300">
                Error
              </Badge>
              
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Admin
              </Badge>
              
              <Badge variant="outline" className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300">
                User
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 