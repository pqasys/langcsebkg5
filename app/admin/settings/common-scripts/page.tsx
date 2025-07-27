'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Loader2, RefreshCw, CheckCircle, AlertTriangle, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ScriptResult {
  totalBookings: number
  fixedInconsistencies: number
  errors: number
  log: string
}

export default function CommonScriptsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRunningConsistencyScript, setIsRunningConsistencyScript] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [consistencyResults, setConsistencyResults] = useState<ScriptResult | null>(null)
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false)
  const [maintenanceResults, setMaintenanceResults] = useState<any | null>(null)

  const runSeedScript = async () => {
    try {
      setIsLoading(true)
      setMessage(null)
      
      const response = await fetch('/api/admin/scripts/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run seed script')
      }

      setMessage({
        type: 'success',
        text: 'Seed script executed successfully'
      })
    } catch (error) {
          console.error('Error occurred:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const runBookingPaymentConsistencyScript = async () => {
    try {
      setIsRunningConsistencyScript(true)
      setMessage(null)
      setConsistencyResults(null)
      
      const response = await fetch('/api/admin/scripts/booking-payment-consistency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to run booking payment consistency script')
      }

      setConsistencyResults(data.results)
      setMessage({
        type: 'success',
        text: `Booking payment consistency script executed successfully. Fixed ${data.results.fixedInconsistencies} inconsistencies.`
      })
    } catch (error) {
          console.error('Error occurred:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setIsRunningConsistencyScript(false)
    }
  }

  const runAllMaintenanceScripts = async () => {
    try {
      setIsRunningMaintenance(true)
      setMessage(null)
      setMaintenanceResults(null)
      const response = await fetch('/api/admin/settings/run-all-maintenance-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to run maintenance scripts')
      }
      setMaintenanceResults(data)
      setMessage({
        type: 'success',
        text: data.message || 'All maintenance scripts executed successfully.'
      })
    } catch (error) {
          console.error('Error occurred:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'An error occurred'
      })
    } finally {
      setIsRunningMaintenance(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Common Scripts</h1>
      
      {message && (
        <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <AlertTitle>{message.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Database Seed Script</CardTitle>
            <CardDescription>
              Populates the database with initial data including language categories, sample institutions, and admin users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p>This script will:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Create language course categories and subcategories</li>
                  <li>Add sample institutions</li>
                  <li>Create admin users</li>
                  <li>Set up initial tags and relationships</li>
                </ul>
              </div>
              <Button 
                onClick={runSeedScript} 
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Script...
                  </>
                ) : (
                  'Run Seed Script'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-blue-600" />
              Booking Payment Consistency Audit
            </CardTitle>
            <CardDescription>
              Audits and fixes inconsistencies between booking status, payment status, and enrollment paymentStatus across all records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">
                <p>This script will:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Check all bookings and their related enrollments/payments</li>
                  <li>Fix booking status to match the latest payment status</li>
                  <li>Update enrollment paymentStatus to match payment status</li>
                  <li>Reset inconsistent records to PENDING if no payment exists</li>
                  <li>Provide a detailed report of all changes made</li>
                </ul>
              </div>
              
              <Button 
                onClick={runBookingPaymentConsistencyScript} 
                disabled={isRunningConsistencyScript}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                {isRunningConsistencyScript ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Audit...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Run Consistency Audit
                  </>
                )}
              </Button>

              {consistencyResults && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Audit Results
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{consistencyResults.totalBookings}</div>
                      <div className="text-sm text-gray-600">Total Bookings Checked</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{consistencyResults.fixedInconsistencies}</div>
                      <div className="text-sm text-gray-600">Fixed Inconsistencies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{consistencyResults.errors}</div>
                      <div className="text-sm text-gray-600">Errors Encountered</div>
                    </div>
                  </div>
                  
                  {consistencyResults.fixedInconsistencies > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        {consistencyResults.fixedInconsistencies} inconsistency{consistencyResults.fixedInconsistencies !== 1 ? 'ies' : 'y'} fixed
                      </span>
                    </div>
                  )}
                  
                  {consistencyResults.errors > 0 && (
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        {consistencyResults.errors} error{consistencyResults.errors !== 1 ? 's' : ''} encountered
                      </span>
                    </div>
                  )}

                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      View Detailed Log
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {consistencyResults.log}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-orange-600" />
              Run All Maintenance Scripts
            </CardTitle>
            <CardDescription>
              Runs all maintenance scripts: booking/payment/enrollment consistency audit and orphaned enrollments cleanup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={runAllMaintenanceScripts}
                disabled={isRunningMaintenance}
                className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700"
              >
                {isRunningMaintenance ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Running Maintenance...
                  </>
                ) : (
                  <>
                    <Wrench className="mr-2 h-4 w-4" />
                    Run All Maintenance Scripts
                  </>
                )}
              </Button>
              {maintenanceResults && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-orange-600" />
                    Maintenance Results
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="font-bold text-blue-600">Audit/Fix Results</div>
                      <div className="text-sm">Inconsistent Bookings: {maintenanceResults.auditFix?.inconsistentBookings || 0}</div>
                      <div className="text-sm">Fixed Bookings: {maintenanceResults.auditFix?.fixedBookings || 0}</div>
                      <div className="text-sm">Inconsistent Enrollments: {maintenanceResults.auditFix?.inconsistentEnrollments || 0}</div>
                      <div className="text-sm">Fixed Enrollments: {maintenanceResults.auditFix?.fixedEnrollments || 0}</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-600">Cleanup Results</div>
                      <div className="text-sm">Orphaned Enrollments Found: {maintenanceResults.cleanup?.orphanedEnrollments || 0}</div>
                      <div className="text-sm">Deleted Enrollments: {maintenanceResults.cleanup?.deletedEnrollments || 0}</div>
                    </div>
                  </div>
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      View Combined Log
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {maintenanceResults.combinedLogs?.join('\n') || 'No logs available'}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 