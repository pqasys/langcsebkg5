import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

async function fetchCircles() {
  const res = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/community/circles`, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export default async function CommunityCirclesPage() {
  const circles = await fetchCircles()
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Study Circles</h1>
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
        {circles.map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-sm text-gray-500">{c.membersCount} members</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{c.description || 'No description yet.'}</p>
              <div className="flex gap-2 text-xs text-gray-500">
                {c.language && <span>Lang: {c.language}</span>}
                {c.level && <span>Level: {c.level}</span>}
              </div>
              <div className="mt-4">
                <form action={`/api/community/circles/${c.id}/join`} method="post">
                  <Button size="sm" type="submit">Join Circle</Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}


