import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-4">
            <div className="mb-4">
              <Logo size="lg" className="text-white" variant="badge-image" />
            </div>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Learn together. Speak with confidence. Join FluentShip's community-powered language learning journey.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link href="/courses" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link href="/students-public" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/institutions-public" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Partner
                </Link>
              </li>
              <li>
                <Link href="/institutions" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Browse Institutions
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Support</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link href="/faq" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors block py-1">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors p-2">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm md:text-base text-gray-300">
                Subscribe to our newsletter for updates and insights.
              </p>
              <div className="mt-3 flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm md:text-base text-gray-900 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white text-sm md:text-base font-medium rounded-r-md hover:bg-blue-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm md:text-base text-gray-300">
              © 2024 FluentShip. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 