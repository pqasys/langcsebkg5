import { NextRequest, NextResponse } from 'next/server'
import { isBuildTime } from '@/lib/build-error-handler';
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
    // During build time, return fallback data immediately
    if (isBuildTime()) {
      return NextResponse.json([]);
    }


		const session = await getServerSession(authOptions)
		if (!session?.user || session.user.role !== 'STUDENT') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { searchParams } = new URL(request.url)
		const from = searchParams.get('from')
		const to = searchParams.get('to')
		if (!from || !to) {
			return NextResponse.json([])
		}
		const fromDate = new Date(from)
		const toDate = new Date(to)
		if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
			return NextResponse.json({ error: 'Invalid date range' }, { status: 400 })
		}

		// 1) Live classes within range or overlapping
		const liveClasses = await prisma.videoSession.findMany({
			where: {
				status: 'SCHEDULED',
				OR: [
					{ AND: [{ startTime: { gte: fromDate } }, { startTime: { lte: toDate } }] },
					{ AND: [{ endTime: { gte: fromDate } }, { endTime: { lte: toDate } }] },
					{ AND: [{ startTime: { lte: fromDate } }, { endTime: { gte: toDate } }] },
				],
			},
			select: { id: true, title: true, startTime: true, endTime: true, courseId: true, moduleId: true },
			orderBy: { startTime: 'asc' },
		})

		// 2) Course enrollments (student windows) within range
		const enrollments = await prisma.studentCourseEnrollment.findMany({
			where: {
				studentId: session.user.id,
				OR: [
					{ AND: [{ startDate: { gte: fromDate } }, { startDate: { lte: toDate } }] },
					{ AND: [{ endDate: { gte: fromDate } }, { endDate: { lte: toDate } }] },
					{ AND: [{ startDate: { lte: fromDate } }, { endDate: { gte: toDate } }] },
				],
			},
			select: { id: true, courseId: true, startDate: true, endDate: true },
		})

		// 3) Derived module deadlines and quiz due dates based on module order and estimated duration
		const courseIds = Array.from(new Set(enrollments.map(e => e.courseId).filter(Boolean))) as string[]
		let modules: Array<{ id: string; course_id: string; title: string; estimated_duration: number; order_index: number }> = []
		let quizzes: Array<{ id: string; module_id: string; title: string }> = []
		if (courseIds.length > 0) {
			modules = await prisma.modules.findMany({
				where: { course_id: { in: courseIds } },
				select: { id: true, course_id: true, title: true, estimated_duration: true, order_index: true },
				orderBy: [{ course_id: 'asc' }, { order_index: 'asc' }],
			})
			const moduleIds = modules.map(m => m.id)
			if (moduleIds.length > 0) {
				quizzes = await prisma.quizzes.findMany({
					where: { module_id: { in: moduleIds } },
					select: { id: true, module_id: true, title: true },
				})
			}
		}

		const addDays = (date: Date, days: number) => {
			const d = new Date(date)
			d.setUTCDate(d.getUTCDate() + days)
			return d
		}

		// Map to unified CalendarEvent format
		const events = [
			...liveClasses.map((c) => ({
				id: `live_${c.id}`,
				title: c.title || 'Live Class',
				start: c.startTime.toISOString(),
				end: c.endTime?.toISOString(),
				allDay: false,
				type: 'liveClass',
				courseId: c.courseId || undefined,
				moduleId: c.moduleId || undefined,
				color: '#0ea5e9',
			})),
			...enrollments.map((e) => ({
				id: `enroll_${e.id}`,
				title: 'Course Enrollment',
				start: (e.startDate || fromDate).toISOString(),
				end: (e.endDate || toDate).toISOString(),
				allDay: true,
				type: 'courseWindow',
				courseId: e.courseId,
				color: '#6366f1',
			})),
			// Derived module/quiz deadlines
			...(() => {
				const derived: any[] = []
				if (modules.length === 0 || enrollments.length === 0) return derived

				const courseIdToModules = new Map<string, typeof modules>()
				for (const m of modules) {
					const list = courseIdToModules.get(m.course_id) || []
					list.push(m)
					courseIdToModules.set(m.course_id, list)
				}
				const moduleIdToQuizzes = new Map<string, typeof quizzes>()
				for (const q of quizzes) {
					const list = moduleIdToQuizzes.get(q.module_id) || []
					list.push(q)
					moduleIdToQuizzes.set(q.module_id, list)
				}

				for (const e of enrollments) {
					const courseModules = (courseIdToModules.get(e.courseId) || []).sort((a, b) => a.order_index - b.order_index)
					if (courseModules.length === 0) continue
					const windowStart = e.startDate ? new Date(e.startDate) : fromDate
					const windowEnd = e.endDate ? new Date(e.endDate) : toDate
					let cursor = new Date(Math.max(windowStart.getTime(), fromDate.getTime()))

					for (const m of courseModules) {
						const est = typeof m.estimated_duration === 'number' ? m.estimated_duration : 0
						const durationDays = Math.max(1, Math.ceil(est / 60))
						const due = addDays(cursor, Math.max(0, durationDays - 1))

						if (due >= fromDate && due <= toDate && due >= windowStart && due <= windowEnd) {
							derived.push({
								id: `moduleDue_${m.id}`,
								title: `Module due: ${m.title}`,
								start: new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())).toISOString(),
								allDay: true,
								type: 'moduleDue',
								courseId: e.courseId,
								moduleId: m.id,
								color: '#f59e0b',
							})
							const qzs = moduleIdToQuizzes.get(m.id) || []
							for (const q of qzs) {
								derived.push({
									id: `quiz_${q.id}`,
									title: `Quiz due: ${q.title || 'Quiz'}`,
									start: new Date(Date.UTC(due.getUTCFullYear(), due.getUTCMonth(), due.getUTCDate())).toISOString(),
									allDay: true,
									type: 'quiz',
									courseId: e.courseId,
									moduleId: m.id,
									color: '#ef4444',
								})
							}
						}

						cursor = addDays(cursor, durationDays)
						if (cursor > toDate || cursor > windowEnd) break
					}
				}
				return derived
			})(),
		]


		// Optional filter by type param (comma-separated)
		const typeParam = searchParams.get('type')
		const filtered = typeParam
			? events.filter(e => typeParam.split(',').includes((e as any).type))
			: events

		return NextResponse.json(filtered)
	} catch (error) {
		console.error('Calendar aggregation error:', error)
		return NextResponse.json({ error: 'Failed to load events' }, { status: 500 })
	}
}


