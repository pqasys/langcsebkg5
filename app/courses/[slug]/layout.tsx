import { redirect } from 'next/navigation'
import { getCourseSlugById } from '@/lib/id-to-slug-cache'

export default async function CourseSlugLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: { slug: string }
}) {
	// If the incoming segment looks like an id (UUID), redirect to canonical slug URL
	const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
	if (uuidRegex.test(params.slug)) {
		const slug = await getCourseSlugById(params.slug)
		if (!slug) {
			redirect('/courses')
		}
		redirect(`/courses/${slug}`)
	}

	return children
}


