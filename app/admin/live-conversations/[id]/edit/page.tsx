'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function EditLiveConversationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<any>({
    title: '',
    description: '',
    conversationType: 'GROUP',
    language: 'English',
    level: 'CEFR_A1',
    startTime: '',
    endTime: '',
    duration: 60,
    maxParticipants: 8,
    price: 0,
    isPublic: true,
    isFree: false,
    topic: '',
  })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const res = await fetch(`/api/admin/live-conversations/${id}`)
      const data = await res.json()
      if (data?.conversation) {
        setForm({
          ...form,
          ...data.conversation,
          startTime: new Date(data.conversation.startTime).toISOString().slice(0, 16),
          endTime: new Date(data.conversation.endTime).toISOString().slice(0, 16),
        })
      }
      setLoading(false)
    }
    if (id) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const save = async () => {
    setSaving(true)
    const res = await fetch(`/api/admin/live-conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      }),
    })
    setSaving(false)
    if (res.ok) router.push('/admin/live-conversations')
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">Loading…</div>

  return (
    <div className="p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Live Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Input id="language" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Input id="level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="conversationType">Type</Label>
              <Input id="conversationType" value={form.conversationType} onChange={(e) => setForm({ ...form, conversationType: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input type="datetime-local" id="startTime" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input type="datetime-local" id="endTime" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="duration">Duration (min)</Label>
              <Input id="duration" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="maxParticipants">Max Participants</Label>
              <Input id="maxParticipants" type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input id="topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


