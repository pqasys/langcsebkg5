'use client';

import React, { useState } from 'react';
import { DesignToolkit, DesignConfig, DEFAULT_DESIGN_CONFIG } from '@/components/design/DesignToolkit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AccessibilityTestPage() {
  const [config, setConfig] = useState<DesignConfig>(DEFAULT_DESIGN_CONFIG);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Design Toolkit Accessibility Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test the improved contrast and accessibility features of the Design Toolkit components.
            Use keyboard navigation (Tab, Arrow keys, Enter, Space) to interact with the controls.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ High Contrast Sliders
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              ✓ ARIA Labels
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              ✓ Keyboard Navigation
            </Badge>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              ✓ Screen Reader Support
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Design Toolkit */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-blue-600">🎨</span>
                Design Toolkit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DesignToolkit
                config={config}
                onConfigChange={setConfig}
                showSaveButton={true}
                showResetButton={true}
                showPreview={true}
              />
            </CardContent>
          </Card>

          {/* Accessibility Features Demo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-green-600">♿</span>
                Accessibility Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Keyboard Navigation</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Tab</kbd> - Navigate between controls</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">←</kbd> <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">→</kbd> - Adjust slider values</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> / <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Space</kbd> - Activate buttons</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">Escape</kbd> - Close dialogs</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Visual Improvements</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Enhanced contrast for all controls</li>
                  <li>• Larger, more visible focus indicators</li>
                  <li>• High contrast mode toggle</li>
                  <li>• Improved slider thumb visibility</li>
                  <li>• Better color picker accessibility</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Screen Reader Support</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Proper ARIA labels and roles</li>
                  <li>• Tab panel associations</li>
                  <li>• Descriptive button labels</li>
                  <li>• Live value announcements</li>
                  <li>• Keyboard navigation hints</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Configuration Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-purple-600">⚙️</span>
              Current Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Background</h4>
                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <p>Type: {config.backgroundType}</p>
                  <p>Color: {config.backgroundColor}</p>
                  <p>Opacity: {config.backgroundOpacity}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Typography</h4>
                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <p>Title Font: {config.titleFont}</p>
                  <p>Title Size: {config.titleSize}px</p>
                  <p>Title Color: {config.titleColor}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">Layout</h4>
                <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                  <p>Padding: {config.padding}px</p>
                  <p>Border Radius: {config.borderRadius}px</p>
                  <p>Border Width: {config.borderWidth}px</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
