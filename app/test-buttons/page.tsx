import { Button } from '@/components/ui/button'

export default function TestButtonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Button Test Page - Mobile Optimized</h1>
        
        {/* NEW: Simple Button Debug Section */}
        <div className="mb-8 p-4 bg-red-100 border-2 border-red-500 rounded">
          <h2 className="text-lg font-bold text-red-800 mb-4">🔍 Button Component Debug</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-red-700 mb-2">Raw Button Component (no props):</p>
              <Button>Test Button Text</Button>
            </div>
            <div>
              <p className="text-sm text-red-700 mb-2">Button with explicit className:</p>
              <Button className="bg-red-500 text-white px-4 py-2 rounded">Explicit Styled Button</Button>
            </div>
            <div>
              <p className="text-sm text-red-700 mb-2">Button with inline style override:</p>
              <Button style={{ backgroundColor: 'purple', color: 'white', padding: '8px 16px' }}>
                Inline Style Button
              </Button>
            </div>
            <div>
              <p className="text-sm text-red-700 mb-2">HTML button for comparison:</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">HTML Button</button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Basic HTML Buttons (No Component)</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base font-medium">
                HTML Button
              </button>
              <button className="bg-red-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base font-medium">
                Red HTML Button
              </button>
              <button className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base font-medium">
                Green HTML Button
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Inline Style Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                style={{ 
                  backgroundColor: 'blue', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '44px'
                }}
              >
                Inline Blue Button
              </button>
              <button 
                style={{ 
                  backgroundColor: 'red', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '600',
                  minHeight: '44px'
                }}
              >
                Inline Red Button
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Component Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button>Default Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="link">Link Button</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Button Sizes</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
              <Button size="sm">Small Button</Button>
              <Button size="default">Default Size</Button>
              <Button size="lg">Large Button</Button>
              <Button size="icon">🚀</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Mobile Optimized Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button size="mobile-sm">Mobile Small</Button>
              <Button size="mobile-lg">Mobile Large</Button>
              <Button size="mobile-icon">📱</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">High Contrast Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button variant="primary-high">Primary High</Button>
              <Button variant="success-high">Success High</Button>
              <Button variant="warning-high">Warning High</Button>
              <Button variant="danger-high">Danger High</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Action Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button variant="save">Save Changes</Button>
              <Button variant="update">Update Profile</Button>
              <Button variant="cancel">Cancel</Button>
              <Button variant="delete">Delete Item</Button>
              <Button variant="pricing">View Pricing</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Disabled Buttons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button disabled>Disabled Button</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
              <Button variant="save" disabled>Disabled Save</Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Buttons with Icons</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button>
                <span className="mr-2">🚀</span>
                Launch App
              </Button>
              <Button variant="outline">
                <span className="mr-2">📧</span>
                Send Email
              </Button>
              <Button variant="destructive">
                <span className="mr-2">🗑️</span>
                Delete
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Text Color Test</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="bg-blue-600 text-white p-3 sm:p-4 rounded text-sm sm:text-base">White text on blue</div>
              <div className="bg-red-600 text-white p-3 sm:p-4 rounded text-sm sm:text-base">White text on red</div>
              <div className="bg-green-600 text-white p-3 sm:p-4 rounded text-sm sm:text-base">White text on green</div>
              <div className="bg-gray-800 text-white p-3 sm:p-4 rounded text-sm sm:text-base">White text on gray</div>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Raw Button Test</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 touch-manipulation text-gray-900 bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus-visible:ring-blue-500 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 h-11 px-6 py-3 text-base font-semibold"
              >
                Raw Button with Classes
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Mobile Touch Test</h2>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-base font-semibold touch-manipulation active:scale-95 transition-transform"
                style={{ minHeight: '48px', minWidth: '48px' }}
              >
                Touch Test Button
              </button>
              <button 
                className="bg-orange-600 text-white px-4 py-3 rounded-lg text-base font-semibold touch-manipulation active:scale-95 transition-transform"
                style={{ minHeight: '48px', minWidth: '48px' }}
              >
                Another Touch Button
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm sm:text-base">
            <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
            <p><strong>Viewport:</strong> {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Server-side'}</p>
            <p><strong>CSS Loaded:</strong> {typeof document !== 'undefined' ? 'Yes' : 'Server-side'}</p>
            <p><strong>Tailwind Classes:</strong> Check if these classes are working</p>
            <div className="mt-4 space-y-2">
              <div className="text-red-600 font-medium">This should be red text</div>
              <div className="text-blue-600 font-medium">This should be blue text</div>
              <div className="text-green-600 font-medium">This should be green text</div>
              <div className="font-bold">This should be bold text</div>
              <div className="text-lg">This should be large text</div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Mobile Optimization Status:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Responsive breakpoints configured</li>
                <li>✅ Touch targets (min 44px)</li>
                <li>✅ Mobile-first CSS</li>
                <li>✅ Font scaling for mobile</li>
                <li>✅ Touch manipulation enabled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 