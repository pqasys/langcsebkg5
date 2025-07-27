'use client'

import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default function TestAuth() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Auth Test Page</h1>
          <p className="text-gray-600">Testing authentication status</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Session Status</h2>
          
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
            
            {session?.user && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">User Info:</h3>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Role:</strong> {session.user.role}</p>
                <p><strong>Status:</strong> {session.user.status}</p>
                <p><strong>Institution ID:</strong> {session.user.institutionId || 'None'}</p>
                <p><strong>Institution Approved:</strong> {session.user.institutionApproved ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 space-y-2">
            <button
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Sign Out
            </button>
            
            <a
              href="/auth/signin"
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
            >
              Go to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 