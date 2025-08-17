import { prisma } from '@/lib/prisma'

type CachedEntry = { slug: string; expiresAt: number }

const cache: Map<string, CachedEntry> = new Map()
const MAX_ENTRIES = 1000
const TTL_MS = 10 * 60 * 1000 // 10 minutes

function setWithLimit(id: string, slug: string) {
	// Evict oldest if over capacity
	if (cache.size >= MAX_ENTRIES) {
		const firstKey = cache.keys().next().value
		if (firstKey) cache.delete(firstKey)
	}
	cache.set(id, { slug, expiresAt: Date.now() + TTL_MS })
}

export async function getCourseSlugById(id: string): Promise<string | null> {
	const hit = cache.get(id)
	if (hit && hit.expiresAt > Date.now()) {
		return hit.slug
	}

	const course = await prisma.course.findUnique({
		where: { id },
		select: { slug: true }
	})

	if (!course?.slug) {
		return null
	}

	setWithLimit(id, course.slug)
	return course.slug
}


