'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, RefreshCcw, Calendar, Users, DollarSign } from 'lucide-react'

interface AdminConversation {
  id: string
  title: string
  conversationType: string
  language: string
  level: string
  startTime: string
  duration: number
  maxParticipants: number
  currentParticipants: number
  price: number
  isFree: boolean
  status: string
}

export default function AdminLiveConversationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<AdminConversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin')
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/live-conversations')
        const data = await res.json()
        if (data.success) setItems(data.conversations)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [status, router])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Live Conversations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.refresh()}><RefreshCcw className="w-4 h-4 mr-2" />Refresh</Button>
          <Button onClick={() => router.push('/live-conversations/create')}><Plus className="w-4 h-4 mr-2" />Create</Button>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-gray-600">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-600">No conversations yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-lg">{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(c.startTime).toLocaleString()}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4" />{c.currentParticipants}/{c.maxParticipants}</div>
                <div className="flex items-center gap-2"><DollarSign className="w-4 h-4" />{c.isFree ? <Badge>Free</Badge> : `$${c.price}`}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{c.conversationType}</Badge>
                  <Badge variant="outline">{c.level.replace('CEFR_', '')}</Badge>
                  <Badge variant="outline">{c.language}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}


