import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function fetchClubs() {
  const url = `${process.env.NEXTAUTH_URL || ''}/api/community/clubs`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function CommunityClubsPage() {
  const clubs = await fetchClubs()
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Weekly Clubs</h1>
        <div className="flex gap-2">
          <Link href="/language-proficiency-test">
            <Button>Take Free Test</Button>
          </Link>
          <Link href="/community">
            <Button variant="outline">Back to Community</Button>
          </Link>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <div>Language: {c.language}</div>
                <div>Level: {c.level}</div>
                <div>Starts: {new Date(c.start).toLocaleString()}</div>
                <div>Ends: {new Date(c.end).toLocaleString()}</div>
                <div>Capacity: {c.capacity}</div>
                {c.isRecurring && <div className="mt-1">Recurring</div>}
              </div>
              <div className="mt-4">
                <form action={`/api/community/clubs/${c.id}/rsvp`} method="post">
                  <Button size="sm" type="submit">RSVP</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}


