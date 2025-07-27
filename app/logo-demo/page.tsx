'use client';

import React from 'react';
import FluentShipLogo from '@/components/ui/FluentShipLogo';
import HydrationSafeWrapper from '@/components/ui/HydrationSafeWrapper';

export default function LogoDemoPage() {
  return (
    <HydrationSafeWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              FluentShip Logo Demo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the new boat logo design with different variants, sizes, and applications.
              This logo represents global communication, learning, and cultural exchange.
            </p>
          </div>

          {/* Default Variants */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Logo Variants
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Default</h3>
                <div className="flex justify-center mb-4">
                  <FluentShipLogo width={150} height={100} />
                </div>
                <p className="text-sm text-gray-600">
                  Standard color scheme with blue boat and sail
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-8 shadow-lg text-center">
                <h3 className="text-lg font-medium text-white mb-4">White Variant</h3>
                <div className="flex justify-center mb-4">
                  <FluentShipLogo width={150} height={100} variant="white" />
                </div>
                <p className="text-sm text-blue-100">
                  White version for dark backgrounds
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg text-center">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Gradient</h3>
                <div className="flex justify-center mb-4">
                  <FluentShipLogo width={150} height={100} variant="gradient" />
                </div>
                <p className="text-sm text-gray-600">
                  Enhanced with gradients and water waves
                </p>
              </div>
            </div>
          </section>

          {/* Size Variations */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Size Variations
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Small</h3>
                <div className="flex justify-center">
                  <FluentShipLogo width={80} height={60} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Medium</h3>
                <div className="flex justify-center">
                  <FluentShipLogo width={120} height={90} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Large</h3>
                <div className="flex justify-center">
                  <FluentShipLogo width={200} height={150} />
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Extra Large</h3>
                <div className="flex justify-center">
                  <FluentShipLogo width={300} height={200} />
                </div>
              </div>
            </div>
          </section>

          {/* Application Examples */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
              Application Examples
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Header Example */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Header Navigation</h3>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FluentShipLogo width={40} height={30} variant="white" />
                    <span className="text-white font-semibold text-lg">FluentShip</span>
                  </div>
                  <nav className="flex space-x-4">
                    <a href="#" className="text-blue-100 hover:text-white text-sm">Courses</a>
                    <a href="#" className="text-blue-100 hover:text-white text-sm">Institutions</a>
                    <a href="#" className="text-blue-100 hover:text-white text-sm">About</a>
                  </nav>
                </div>
              </div>

              {/* Card Example */}
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Feature Card</h3>
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FluentShipLogo width={50} height={40} />
                    <h4 className="ml-3 text-lg font-medium text-gray-800">Global Learning</h4>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Connect with learners worldwide through our innovative language learning platform.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Logo Meaning */}
          <section className="bg-white rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Logo Design Concept
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Communication</h3>
                <p className="text-gray-600 text-sm">
                  The speech bubble sail represents dialogue and language exchange
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">
                  Three figures represent learners working together on their journey
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Journey</h3>
                <p className="text-gray-600 text-sm">
                  The boat symbolizes the learning journey and exploration of new languages
                </p>
              </div>
            </div>
          </section>

          <div className="text-center mt-12">
            <a 
              href="/logo-exploration.html" 
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              View Full Logo Exploration
            </a>
          </div>
        </div>
      </div>
    </HydrationSafeWrapper>
  );
} 