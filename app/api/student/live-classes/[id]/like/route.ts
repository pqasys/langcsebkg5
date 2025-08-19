import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/student/live-classes/[id]/like - Toggle like on a live class (video session)
export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		const session = await getServerSession(authOptions)
		if (!session?.user || session.user.role !== 'STUDENT') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const sessionId = params.id
		if (!sessionId) {
			return NextResponse.json({ error: 'Missing session id' }, { status: 400 })
		}

		// Check if like exists
		const existing = await prisma.videoSessionLike.findUnique({
			where: {
				sessionId_userId: {
					sessionId,
					userId: session.user.id,
				},
			},
		})

		if (existing) {
			await prisma.videoSessionLike.delete({
				where: { sessionId_userId: { sessionId, userId: session.user.id } },
			})
		} else {
			await prisma.videoSessionLike.create({
				data: { sessionId, userId: session.user.id },
			})
		}

		const [likesCount, likedByMe] = await Promise.all([
			prisma.videoSessionLike.count({ where: { sessionId } }),
			prisma.videoSessionLike.findUnique({
				where: { sessionId_userId: { sessionId, userId: session.user.id } },
			}).then(Boolean),
		])

		return NextResponse.json({ success: true, likesCount, likedByMe })
	} catch (error) {
		console.error('Error toggling like:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}


