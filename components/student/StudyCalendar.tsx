"use client"

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'

type CalendarEvent = {
  id: string
  title: string
  start: string
  end?: string
  allDay?: boolean
  type?: 'liveClass' | 'courseWindow' | 'moduleDue' | 'quiz' | string
  color?: string
  courseId?: string
  moduleId?: string
}

const EVENT_TYPES: Array<{ key: CalendarEvent['type']; label: string }> = [
  { key: 'liveClass', label: 'Live classes' },
  { key: 'courseWindow', label: 'Course windows' },
  { key: 'moduleDue', label: 'Module due' },
  { key: 'quiz', label: 'Quizzes' },
]

export default function StudyCalendar() {
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [typesEnabled, setTypesEnabled] = React.useState<Record<string, boolean>>({
    liveClass: true,
    courseWindow: true,
    moduleDue: true,
    quiz: true,
  })
  const [courseFilter, setCourseFilter] = React.useState<string>('all')
  const [availableCourses, setAvailableCourses] = React.useState<Array<{ id: string; label: string }>>([])

  const fetchEventsForRange = React.useCallback(async (fromISO: string, toISO: string, signal?: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const queryString = new URLSearchParams({ from: fromISO, to: toISO }).toString()
      const response = await fetch(`/api/student/calendar/events?${queryString}`, { cache: 'no-store', signal })
      if (!response.ok) throw new Error('Failed to load events')
      const data = await response.json()
      const list: CalendarEvent[] = Array.isArray(data) ? data : []
      setEvents(list)
      // Derive available courses from events
      const courseIds = Array.from(new Set(list.map(e => e.courseId).filter(Boolean))) as string[]
      setAvailableCourses(courseIds.map(id => ({ id, label: id })))
    } catch (err: any) {
      if (err?.name !== 'AbortError') setError(err?.message || 'Failed to load events')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDatesSet = React.useCallback((arg: { start: Date; end: Date }) => {
    const controller = new AbortController()
    fetchEventsForRange(arg.start.toISOString(), arg.end.toISOString(), controller.signal)
    return () => controller.abort()
  }, [fetchEventsForRange])

  const handleSelect = React.useCallback((selectionInfo: any) => {
    const temporaryEvent: CalendarEvent = {
      id: `temp_${Date.now()}`,
      title: 'Study Session',
      start: selectionInfo.startStr,
      end: selectionInfo.endStr,
      allDay: selectionInfo.allDay,
      type: 'study',
      color: '#10b981',
    }
    setEvents(prev => [...prev, temporaryEvent])
  }, [])

  const filteredEvents = React.useMemo(() => {
    return events.filter(evt => {
      const typeOk = evt.type ? typesEnabled[evt.type] !== false : true
      const courseOk = courseFilter === 'all' ? true : evt.courseId === courseFilter
      return typeOk && courseOk
    })
  }, [events, typesEnabled, courseFilter])

  const fullCalendarEvents = React.useMemo(() => {
    return filteredEvents.map(evt => ({
      id: evt.id,
      title: evt.title,
      start: evt.start,
      end: evt.end,
      allDay: evt.allDay,
      color: evt.color,
      extendedProps: { type: evt.type, courseId: evt.courseId, moduleId: evt.moduleId },
    }))
  }, [filteredEvents])

  return (
    <div className="rounded-lg border border-gray-200 p-2">
      <div className="mb-2 flex flex-col gap-2 px-2 md:flex-row md:items-center md:justify-between">
        <h2 className="text-lg font-medium">Calendar</h2>
        {loading && <span className="text-xs text-gray-500">Loading…</span>}
        <div className="flex flex-wrap items-center gap-3">
          {EVENT_TYPES.map(t => (
            <label key={t.key} className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={typesEnabled[t.key as string] !== false}
                onChange={(e) => setTypesEnabled(prev => ({ ...prev, [t.key as string]: e.target.checked }))}
              />
              <span>{t.label}</span>
            </label>
          ))}
          <label className="flex items-center gap-1 text-xs">
            <span>Course:</span>
            <select
              className="rounded border border-gray-300 p-1 text-xs"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <option value="all">All</option>
              {availableCourses.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      {error && (
        <div className="mx-2 mb-2 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' }}
        height="auto"
        events={fullCalendarEvents}
        datesSet={handleDatesSet as any}
        selectable
        selectMirror
        select={handleSelect}
        nowIndicator
        dayMaxEventRows
        weekends
      />
    </div>
  )
}


