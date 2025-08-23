import React from 'react'

import StudyCalendar from '../../../components/student/StudyCalendar'

export const metadata = {
  title: 'Study Calendar',
}

export default function StudentCalendarPage() {
  return (
    <main className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Study Calendar</h1>
        <p className="text-sm text-gray-500">Plan your studies and see all upcoming sessions in one place.</p>
      </header>
      <section>
        <StudyCalendar />
      </section>
    </main>
  )
}


